import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Upload,
  FileText,
  Globe,
  Settings,
  Package,
  AlertCircle,
  Sparkles,
  Star,
  TrendingUp,
  TrendingDown,
  Zap,
} from 'lucide-react';
import type { CreateTaskRequest, TargetPlatform } from '../../types/task';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (task: CreateTaskRequest) => void;
  productId?: string;
}

interface AISelectedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  discount: number;
  marketTrend: 'rising' | 'stable' | 'declining';
  aiScore: number;
  aiReason: string;
  tags: string[];
}

interface PlatformConfig {
  category_id?: string;
  attributes?: Record<string, string | number>;
  pricing_strategy?: 'fixed' | 'dynamic' | 'competitive';
  inventory_sync?: boolean;
}

interface PlatformOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  supported: boolean;
}

// API调用函数
const fetchAISelectedProducts = async (): Promise<AISelectedProduct[]> => {
  try {
    const response = await fetch('/api/tasks/ai-selected-products', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // 这里可以添加认证token
        // 'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('获取AI选品数据失败');
    }
    
    const result = await response.json();
    return result.data.products || [];
  } catch (error) {
    console.error('获取AI选品数据失败:', error);
    return [];
  }
};

const PLATFORM_OPTIONS: PlatformOption[] = [
  {
    id: 'taobao',
    name: '淘宝',
    icon: '🛒',
    description: '中国最大的C2C电商平台',
    supported: true,
  },
  {
    id: 'tmall',
    name: '天猫',
    icon: '🐱',
    description: '阿里巴巴旗下B2C电商平台',
    supported: true,
  },
  {
    id: 'jd',
    name: '京东',
    icon: '🐶',
    description: '中国领先的自营式电商企业',
    supported: true,
  },
  {
    id: 'pdd',
    name: '拼多多',
    icon: '🍊',
    description: '新电商开创者',
    supported: true,
  },
  {
    id: 'amazon',
    name: 'Amazon',
    icon: '📦',
    description: '全球最大的电商平台',
    supported: false,
  },
  {
    id: 'shopee',
    name: 'Shopee',
    icon: '🛍️',
    description: '东南亚领先的电商平台',
    supported: false,
  },
];

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreateTask,
  productId = '',
}: CreateTaskDialogProps) {
  const [activeTab, setActiveTab] = useState('ai-products');
  const [selectedAIProduct, setSelectedAIProduct] = useState<AISelectedProduct | null>(null);
  const [aiProducts, setAiProducts] = useState<AISelectedProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [formData, setFormData] = useState<CreateTaskRequest>({
    product_id: productId,
    type: 'upload',
    priority: 'medium',
    title: '',
    description: '',
    content: {
      target_platforms: [],
    },
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [platformConfigs, setPlatformConfigs] = useState<Record<string, PlatformConfig>>({});

  // 加载AI选品数据
  useEffect(() => {
    if (open && activeTab === 'ai-products') {
      const loadAIProducts = async () => {
        setIsLoadingProducts(true);
        try {
          const products = await fetchAISelectedProducts();
          setAiProducts(products);
        } catch (error) {
          console.error('加载AI选品失败:', error);
        } finally {
          setIsLoadingProducts(false);
        }
      };
      loadAIProducts();
    }
  }, [open, activeTab]);

  const handlePlatformToggle = (platformId: string) => {
    const newSelected = selectedPlatforms.includes(platformId)
      ? selectedPlatforms.filter(id => id !== platformId)
      : [...selectedPlatforms, platformId];
    
    setSelectedPlatforms(newSelected);
    
    // 更新目标平台配置
    const targetPlatforms: TargetPlatform[] = newSelected.map(id => ({
      platform: id,
      config: platformConfigs[id] || {
        category_id: '',
        attributes: {},
        pricing_strategy: 'fixed',
        inventory_sync: true,
      },
    }));
    
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        target_platforms: targetPlatforms,
      },
    }));
  };

  const handlePlatformConfigChange = (platformId: string, config: PlatformConfig) => {
    const newConfigs = {
      ...platformConfigs,
      [platformId]: config,
    };
    setPlatformConfigs(newConfigs);
    
    // 更新formData中的平台配置
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        target_platforms: prev.content.target_platforms.map(tp =>
          tp.platform === platformId ? { ...tp, config } : tp
        ),
      },
    }));
  };

  const handleAIProductSelect = (product: AISelectedProduct) => {
    setSelectedAIProduct(product);
    setFormData(prev => ({
      ...prev,
      product_id: product.id,
      title: `上传商品: ${product.name}`,
      description: `AI推荐商品，AI评分: ${product.aiScore}，折扣: ${product.discount}%`,
    }));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'stable':
        return <div className="h-4 w-4 rounded-full bg-yellow-500" />;
      case 'declining':
        return <TrendingUp className="h-4 w-4 text-red-500 rotate-180" />;
      default:
        return null;
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'rising':
        return '上升趋势';
      case 'stable':
        return '稳定';
      case 'declining':
        return '下降趋势';
      default:
        return '未知';
    }
  };

  const handleSubmit = () => {
    if (!selectedAIProduct) {
      alert('请先选择AI推荐的商品');
      return;
    }
    
    if (selectedPlatforms.length === 0) {
      alert('请至少选择一个目标平台');
      return;
    }
    
    onCreateTask(formData);
    onOpenChange(false);
    
    // 重置表单
    setSelectedAIProduct(null);
    setFormData({
      product_id: productId,
      type: 'upload',
      priority: 'medium',
      title: '',
      description: '',
      content: {
        target_platforms: [],
      },
    });
    setSelectedPlatforms([]);
    setPlatformConfigs({});
    setActiveTab('ai-products');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            创建运营任务
          </DialogTitle>
          <DialogDescription>
            配置商品上传任务，选择目标平台并设置相关参数
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai-products" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI选品
            </TabsTrigger>
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              基本信息
            </TabsTrigger>
            <TabsTrigger value="platforms" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              目标平台
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              平台配置
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai-products" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                AI为您精选的优质商品，基于市场趋势和盈利潜力分析
              </div>
              
              <div className="grid grid-cols-1 gap-4 max-h-96 overflow-y-auto">
                {isLoadingProducts ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    <p>正在加载AI推荐商品...</p>
                  </div>
                ) : aiProducts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>暂无AI推荐商品</p>
                  </div>
                ) : (
                  aiProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all ${
                      selectedAIProduct?.id === product.id
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedAIProduct(product)}
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <div className="relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1">
                            AI推荐
                          </Badge>
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm leading-tight">{product.name}</h4>
                            <div className="flex items-center gap-1 ml-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm font-medium">{product.aiScore}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>分类: {product.category}</span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <span className="text-lg font-bold text-red-500">¥{product.price}</span>
                              <span className="text-sm text-muted-foreground line-through">¥{product.originalPrice}</span>
                              <Badge variant="destructive" className="text-xs">
                                -{product.discount}%
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1">
                              {product.marketTrend === 'rising' ? (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                              ) : (
                                <TrendingDown className="h-4 w-4 text-gray-500" />
                              )}
                              <span className="text-sm">{product.marketTrend === 'rising' ? '上升' : '稳定'}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">标签:</span>
                            <div className="flex gap-1">
                              {product.tags.slice(0, 2).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {product.tags.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{product.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>评分: {product.rating}/5.0</span>
                            <span>评价: {product.reviewCount.toLocaleString()}</span>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {product.aiReason}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </div>
              
              {selectedAIProduct && (
                <div className="mt-4 p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-primary">已选择商品</span>
                  </div>
                  <div className="text-sm">
                    <strong>{selectedAIProduct.name}</strong>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    AI评分: {selectedAIProduct.aiScore}/100 | 折扣: {selectedAIProduct.discount}%
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-id">商品ID</Label>
                <Input
                  id="product-id"
                  value={formData.product_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, product_id: e.target.value }))}
                  placeholder="输入商品ID"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-type">任务类型</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'content_optimization' | 'translation' | 'upload' | 'monitoring') => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upload">商品上传</SelectItem>
                    <SelectItem value="content_optimization">内容优化</SelectItem>
                    <SelectItem value="translation">多语言翻译</SelectItem>
                    <SelectItem value="monitoring">效果监控</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">任务标题</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="输入任务标题"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">优先级</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') => setFormData(prev => ({ ...prev, priority: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">低</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="urgent">紧急</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">任务描述</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="输入任务描述（可选）"
                rows={3}
              />
            </div>
          </TabsContent>

          <TabsContent value="platforms" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                选择要上传商品的目标平台
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {PLATFORM_OPTIONS.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`cursor-pointer transition-all ${
                      selectedPlatforms.includes(platform.id)
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    } ${
                      !platform.supported ? 'opacity-50' : ''
                    }`}
                    onClick={() => platform.supported && handlePlatformToggle(platform.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{platform.icon}</span>
                          <CardTitle className="text-base">{platform.name}</CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          {!platform.supported && (
                            <Badge variant="secondary" className="text-xs">
                              即将支持
                            </Badge>
                          )}
                          {platform.supported && (
                            <Checkbox
                              checked={selectedPlatforms.includes(platform.id)}
                              onChange={() => handlePlatformToggle(platform.id)}
                            />
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedPlatforms.length > 0 && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">已选择平台</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatforms.map((platformId) => {
                      const platform = PLATFORM_OPTIONS.find(p => p.id === platformId);
                      return platform ? (
                        <Badge key={platformId} variant="default">
                          {platform.icon} {platform.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            {selectedPlatforms.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>请先在&ldquo;目标平台&rdquo;标签页中选择平台</p>
              </div>
            ) : (
              <div className="space-y-6">
                {selectedPlatforms.map((platformId) => {
                  const platform = PLATFORM_OPTIONS.find(p => p.id === platformId);
                  const config = platformConfigs[platformId] || {};
                  
                  return platform ? (
                    <Card key={platformId}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span>{platform.icon}</span>
                          {platform.name} 配置
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>商品分类</Label>
                            <Input
                              value={config.category_id || ''}
                              onChange={(e) => handlePlatformConfigChange(platformId, {
                                ...config,
                                category_id: e.target.value,
                              })}
                              placeholder="输入分类ID"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>定价策略</Label>
                            <Select
                              value={config.pricing_strategy || 'fixed'}
                              onValueChange={(value: 'fixed' | 'dynamic' | 'competitive') => handlePlatformConfigChange(platformId, {
                                ...config,
                                pricing_strategy: value,
                              })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="fixed">固定价格</SelectItem>
                                <SelectItem value="dynamic">动态定价</SelectItem>
                                <SelectItem value="competitive">竞争定价</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`inventory-sync-${platformId}`}
                            checked={config.inventory_sync !== false}
                            onCheckedChange={(checked) => handlePlatformConfigChange(platformId, {
                              ...config,
                              inventory_sync: checked === true,
                            })}
                          />
                          <Label htmlFor={`inventory-sync-${platformId}`}>
                            启用库存同步
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  ) : null;
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSubmit}>
            创建任务
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}