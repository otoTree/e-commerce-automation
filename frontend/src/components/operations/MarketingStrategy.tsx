import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Calendar, 
  BarChart3,
  Users,
  Megaphone,
  Mail,
  Share2,
  Search,
  Play,
  Loader2,
  CheckCircle2,
  Plus,
  Edit3,
  ArrowRight
} from 'lucide-react';
import type { OperationTask, MarketingStrategy as MarketingStrategyType, MarketingChannel, KPI } from '../../types/operations';

interface MarketingStrategyProps {
  task: OperationTask;
}

export function MarketingStrategy({ task }: MarketingStrategyProps) {
  const [creating, setCreating] = useState(false);
  const [strategies, setStrategies] = useState<MarketingStrategyType[]>([]);
  const [activeStrategy, setActiveStrategy] = useState<MarketingStrategyType | null>(null);
  const [totalBudget, setTotalBudget] = useState(50000);
  const [duration, setDuration] = useState(30);
  const [targetAudience, setTargetAudience] = useState('');
  const [objectives, setObjectives] = useState<string[]>(['brand_awareness', 'sales']);

  useEffect(() => {
    if (task.progress.marketing === 'completed') {
      loadMarketingStrategies();
    }
  }, [task.id]);

  const loadMarketingStrategies = async () => {
    // 模拟加载营销策略
    const mockStrategy: MarketingStrategyType = {
      id: 'strategy-001',
      taskId: task.id,
      name: '智能耳机全渠道营销策略',
      description: '针对25-40岁商务人群的多渠道营销方案，重点突出降噪和续航优势',
      channels: [
        {
          id: 'channel-001',
          name: 'OZON广告投放',
          type: 'paid_ads',
          platform: 'OZON',
          budget: 20000,
          expectedReach: 50000,
          expectedCtr: 2.5,
          expectedCvr: 3.2
        },
        {
          id: 'channel-002',
          name: 'Yandex搜索广告',
          type: 'paid_ads',
          platform: 'Yandex',
          budget: 15000,
          expectedReach: 30000,
          expectedCtr: 3.1,
          expectedCvr: 4.5
        },
        {
          id: 'channel-003',
          name: 'VK社交媒体',
          type: 'social_media',
          platform: 'VKontakte',
          budget: 8000,
          expectedReach: 80000,
          expectedCtr: 1.8,
          expectedCvr: 2.1
        },
        {
          id: 'channel-004',
          name: 'KOL合作推广',
          type: 'influencer',
          platform: 'YouTube/Telegram',
          budget: 7000,
          expectedReach: 25000,
          expectedCtr: 4.2,
          expectedCvr: 5.8
        }
      ],
      budget: {
        total: 50000,
        allocation: {
          'paid_ads': 35000,
          'social_media': 8000,
          'influencer': 7000
        }
      },
      timeline: {
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        milestones: [
          {
            id: 'milestone-001',
            name: '广告素材制作',
            description: '完成所有渠道的广告创意和素材',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'pending',
            deliverables: ['广告图片', '视频素材', '文案内容']
          },
          {
            id: 'milestone-002',
            name: '渠道投放启动',
            description: '所有营销渠道正式开始投放',
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            status: 'pending',
            deliverables: ['OZON广告上线', 'Yandex广告上线', 'KOL合作启动']
          },
          {
            id: 'milestone-003',
            name: '中期效果评估',
            description: '评估前两周的营销效果并优化',
            dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            status: 'pending',
            deliverables: ['效果报告', '优化建议', '预算调整']
          }
        ]
      },
      kpis: [
        {
          id: 'kpi-001',
          name: '总曝光量',
          description: '所有渠道的总曝光次数',
          target: 200000,
          current: 0,
          unit: '次',
          category: 'traffic'
        },
        {
          id: 'kpi-002',
          name: '点击率',
          description: '平均点击率',
          target: 2.8,
          current: 0,
          unit: '%',
          category: 'engagement'
        },
        {
          id: 'kpi-003',
          name: '转化率',
          description: '平均转化率',
          target: 3.5,
          current: 0,
          unit: '%',
          category: 'conversion'
        },
        {
          id: 'kpi-004',
          name: '销售额',
          description: '总销售金额',
          target: 500000,
          current: 0,
          unit: '₽',
          category: 'revenue'
        }
      ],
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setStrategies([mockStrategy]);
    setActiveStrategy(mockStrategy);
  };

  const handleCreateStrategy = async () => {
    setCreating(true);
    
    // 模拟AI生成营销策略
    setTimeout(() => {
      loadMarketingStrategies();
      setCreating(false);
    }, 3000);
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'paid_ads': return <Target className="w-4 h-4" />;
      case 'social_media': return <Share2 className="w-4 h-4" />;
      case 'content_marketing': return <Megaphone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'influencer': return <Users className="w-4 h-4" />;
      case 'seo': return <Search className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getChannelColor = (type: string) => {
    switch (type) {
      case 'paid_ads': return 'bg-blue-100 text-blue-800';
      case 'social_media': return 'bg-purple-100 text-purple-800';
      case 'content_marketing': return 'bg-green-100 text-green-800';
      case 'email': return 'bg-orange-100 text-orange-800';
      case 'influencer': return 'bg-pink-100 text-pink-800';
      case 'seo': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getChannelName = (type: string) => {
    switch (type) {
      case 'paid_ads': return '付费广告';
      case 'social_media': return '社交媒体';
      case 'content_marketing': return '内容营销';
      case 'email': return '邮件营销';
      case 'influencer': return 'KOL合作';
      case 'seo': return 'SEO优化';
      default: return '其他';
    }
  };

  const getMilestoneStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMilestoneStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待开始';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      case 'overdue': return '已逾期';
      default: return '未知';
    }
  };

  const getKpiCategoryColor = (category: string) => {
    switch (category) {
      case 'traffic': return 'text-blue-600';
      case 'engagement': return 'text-purple-600';
      case 'conversion': return 'text-green-600';
      case 'revenue': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (task.progress.marketing === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            营销策略制定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">制定营销策略</h3>
              <p className="text-muted-foreground mb-6">
                基于商品分析和内容生成结果，AI将为您制定个性化的营销策略
              </p>
              
              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="budget">营销预算（卢布）</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(Number(e.target.value))}
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="duration">营销周期（天）</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    placeholder="30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="audience">目标受众描述（可选）</Label>
                  <Textarea
                    id="audience"
                    placeholder="例如：25-40岁商务人群，注重品质和效率..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <Button 
                onClick={handleCreateStrategy}
                disabled={creating}
                size="lg"
                className="mt-6"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    制定中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始制定策略
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (creating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            正在制定营销策略...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
              <p className="text-muted-foreground mt-4">
                AI正在分析市场数据，制定最优营销策略...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!activeStrategy) {
    return (
      <Alert>
        <TrendingUp className="h-4 w-4" />
        <AlertDescription>
          营销策略加载失败，请重试。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* 策略概览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              {activeStrategy.name}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Edit3 className="w-3 h-3 mr-1" />
                编辑
              </Button>
              <Button variant="outline" size="sm">
                <Plus className="w-3 h-3 mr-1" />
                新策略
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{activeStrategy.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                ₽{activeStrategy.budget.total.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">总预算</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {activeStrategy.channels.length}
              </div>
              <div className="text-sm text-muted-foreground">营销渠道</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.ceil((activeStrategy.timeline.endDate.getTime() - activeStrategy.timeline.startDate.getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-muted-foreground">执行天数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {activeStrategy.kpis.length}
              </div>
              <div className="text-sm text-muted-foreground">关键指标</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels">营销渠道</TabsTrigger>
          <TabsTrigger value="timeline">时间规划</TabsTrigger>
          <TabsTrigger value="kpis">关键指标</TabsTrigger>
          <TabsTrigger value="budget">预算分配</TabsTrigger>
        </TabsList>
        
        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4">
            {activeStrategy.channels.map(channel => (
              <Card key={channel.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        {getChannelIcon(channel.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{channel.name}</h4>
                          <Badge className={getChannelColor(channel.type)}>
                            {getChannelName(channel.type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          平台: {channel.platform}
                        </p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">预算</span>
                            <p className="font-medium">₽{channel.budget.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">预期曝光</span>
                            <p className="font-medium">{channel.expectedReach.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">预期CTR</span>
                            <p className="font-medium">{channel.expectedCtr}%</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">预期CVR</span>
                            <p className="font-medium">{channel.expectedCvr}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="timeline" className="space-y-4">
          <div className="space-y-4">
            {activeStrategy.timeline.milestones.map((milestone, index) => (
              <Card key={milestone.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        {index < activeStrategy.timeline.milestones.length - 1 && (
                          <div className="w-px h-16 bg-gray-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{milestone.name}</h4>
                          <Badge className={getMilestoneStatusColor(milestone.status)}>
                            {getMilestoneStatusText(milestone.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {milestone.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{milestone.dueDate.toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">交付物:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {milestone.deliverables.map((deliverable, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {deliverable}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeStrategy.kpis.map(kpi => (
              <Card key={kpi.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{kpi.name}</h4>
                    <Badge variant="outline" className={getKpiCategoryColor(kpi.category)}>
                      {kpi.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {kpi.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>当前: {kpi.current.toLocaleString()}{kpi.unit}</span>
                      <span>目标: {kpi.target.toLocaleString()}{kpi.unit}</span>
                    </div>
                    <Progress 
                      value={kpi.target > 0 ? (kpi.current / kpi.target) * 100 : 0} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                预算分配
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(activeStrategy.budget.allocation).map(([category, amount]) => {
                  const percentage = (amount / activeStrategy.budget.total) * 100;
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{getChannelName(category)}</span>
                        <span className="text-sm text-muted-foreground">
                          ₽{amount.toLocaleString()} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 下一步操作 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">营销策略制定完成！</h3>
              <p className="text-sm text-muted-foreground">
                策略已制定完成，可以开始执行并跟踪效果
              </p>
            </div>
            <Button>
              开始效果跟踪
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default MarketingStrategy;