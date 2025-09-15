import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  ShoppingCart, 
  ArrowLeft, 
  ArrowRight, 
  Star, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { SelectionTask, SupplierProduct } from '../../types/selection';

interface SearchResultsProps {
  task: SelectionTask | null;
  loading: boolean;
  error: string | null;
  onProductSelect: (products: SupplierProduct[]) => void;
  onBack: () => void;
}

export function SearchResults({ 
  task, 
  loading, 
  error, 
  onProductSelect, 
  onBack 
}: SearchResultsProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'similarity' | 'price'>('similarity');

  // 模拟进度更新
  const getProgress = () => {
    if (!task) return 0;
    switch (task.status) {
      case 'PENDING': return 10;
      case 'SCRAPING': return 50;
      case 'PROCESSING': return 80;
      case 'COMPLETED': return 100;
      case 'FAILED': return 0;
      default: return 0;
    }
  };

  const getStatusText = () => {
    if (!task) return '准备中...';
    switch (task.status) {
      case 'PENDING': return '任务已创建，准备开始爬取...';
      case 'SCRAPING': return '正在1688平台搜索相关商品...';
      case 'PROCESSING': return '正在分析商品相似度并排序...';
      case 'COMPLETED': return '搜索完成！';
      case 'FAILED': return '搜索失败，请重试';
      default: return '未知状态';
    }
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (!task?.results) return;
    
    if (selectedProducts.length === task.results.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(task.results.map(p => p.supplierProductId));
    }
  };

  const handleContinue = () => {
    if (!task?.results || selectedProducts.length === 0) return;
    
    const selected = task.results.filter(p => 
      selectedProducts.includes(p.supplierProductId)
    );
    onProductSelect(selected);
  };

  const sortedResults = task?.results ? [...task.results].sort((a, b) => {
    if (sortBy === 'similarity') {
      return b.similarityScore - a.similarityScore;
    } else {
      return parseFloat(a.price) - parseFloat(b.price);
    }
  }) : [];

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回重试
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索进度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            1688货源搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{getStatusText()}</span>
              <span className="text-sm font-medium">{getProgress()}%</span>
            </div>
            <Progress value={getProgress()} className="w-full" />
            
            {task?.status === 'COMPLETED' && task.results && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  搜索完成！找到 {task.results.length} 个相关商品，请选择您感兴趣的商品进行成本核算。
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 搜索结果 */}
      {task?.status === 'COMPLETED' && task.results && task.results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>搜索结果 ({task.results.length} 个商品)</CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">排序:</span>
                  <Button
                    variant={sortBy === 'similarity' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('similarity')}
                  >
                    相似度
                  </Button>
                  <Button
                    variant={sortBy === 'price' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSortBy('price')}
                  >
                    价格
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {selectedProducts.length === task.results.length ? '取消全选' : '全选'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {sortedResults.map((product) => (
                <div
                  key={product.supplierProductId}
                  className={`border rounded-lg p-4 transition-colors ${
                    selectedProducts.includes(product.supplierProductId)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedProducts.includes(product.supplierProductId)}
                      onCheckedChange={() => handleProductToggle(product.supplierProductId)}
                      className="mt-1"
                    />
                    
                    <div className="flex-shrink-0">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-20 h-20 object-cover rounded-md border"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.png';
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 mb-2">
                        {product.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-red-600">
                            ¥{product.price}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">
                            {(product.similarityScore * 100).toFixed(0)}%
                          </span>
                          <span className="text-xs text-muted-foreground">相似度</span>
                        </div>
                        
                        <Badge variant="secondary">{product.source}</Badge>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(product.productUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回修改
        </Button>
        
        {task?.status === 'COMPLETED' && (
          <Button
            onClick={handleContinue}
            disabled={selectedProducts.length === 0}
          >
            核算成本 ({selectedProducts.length})
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default SearchResults;