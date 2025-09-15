import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  ShoppingCart, 
  DollarSign,
  Calendar,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle2,
  Target,
  Users,
  Zap
} from 'lucide-react';
import type { OperationTask, PerformanceMetrics, KPI } from '../../types/operations';

interface PerformanceTrackingProps {
  task: OperationTask;
}

export function PerformanceTracking({ task }: PerformanceTrackingProps) {
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [timeRange, setTimeRange] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    loadPerformanceData();
  }, [task.id, timeRange]);

  const loadPerformanceData = async () => {
    setLoading(true);
    
    // 模拟加载性能数据
    setTimeout(() => {
      const mockMetrics: PerformanceMetrics = {
        views: 45230,
        clicks: 1267,
        conversions: 89,
        revenue: 267800,
        ctr: 2.8,
        cvr: 7.0,
        roas: 5.36
      };
      
      setMetrics(mockMetrics);
      setLastUpdated(new Date());
      setLoading(false);
    }, 1000);
  };

  const handleRefresh = () => {
    loadPerformanceData();
  };

  const getMetricTrend = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      direction: change >= 0 ? 'up' : 'down',
      isPositive: change >= 0
    };
  };

  const getMetricColor = (value: number, target: number, isReverse = false) => {
    const ratio = value / target;
    if (isReverse) {
      if (ratio <= 0.7) return 'text-green-600';
      if (ratio <= 0.9) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (ratio >= 1.2) return 'text-green-600';
      if (ratio >= 0.8) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const ratio = (value / target) * 100;
    if (ratio >= 100) return 'bg-green-500';
    if (ratio >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 模拟历史数据用于对比
  const previousMetrics = {
    views: 38450,
    clicks: 1089,
    conversions: 76,
    revenue: 228400,
    ctr: 2.83,
    cvr: 6.98,
    roas: 4.87
  };

  // 模拟目标数据
  const targets = {
    views: 50000,
    clicks: 1400,
    conversions: 100,
    revenue: 300000,
    ctr: 2.8,
    cvr: 7.1,
    roas: 6.0
  };

  // 模拟渠道数据
  const channelData = [
    {
      name: 'OZON广告',
      views: 18500,
      clicks: 520,
      conversions: 38,
      revenue: 114000,
      spend: 20000,
      roas: 5.7
    },
    {
      name: 'Yandex搜索',
      views: 12300,
      clicks: 380,
      conversions: 28,
      revenue: 84000,
      spend: 15000,
      roas: 5.6
    },
    {
      name: 'VK社交媒体',
      views: 8900,
      clicks: 245,
      conversions: 15,
      revenue: 45000,
      spend: 8000,
      roas: 5.6
    },
    {
      name: 'KOL合作',
      views: 5530,
      clicks: 122,
      conversions: 8,
      revenue: 24800,
      spend: 7000,
      roas: 3.5
    }
  ];

  if (!metrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            效果跟踪
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">暂无数据</h3>
            <p className="text-muted-foreground mb-6">
              营销活动启动后，这里将显示详细的效果数据
            </p>
            <Button onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新数据
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 数据概览和控制 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              效果跟踪
            </div>
            <div className="flex items-center gap-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">今天</SelectItem>
                  <SelectItem value="7d">近7天</SelectItem>
                  <SelectItem value="30d">近30天</SelectItem>
                  <SelectItem value="90d">近90天</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-3 h-3 mr-1" />
                刷新
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-3 h-3 mr-1" />
                导出
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground mb-4">
            最后更新: {lastUpdated.toLocaleString()}
          </div>
          
          {/* 核心指标卡片 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">总曝光</p>
                    <p className="text-2xl font-bold">{metrics.views.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getMetricTrend(metrics.views, previousMetrics.views).direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        getMetricTrend(metrics.views, previousMetrics.views).isPositive 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMetricTrend(metrics.views, previousMetrics.views).value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <Eye className="w-8 h-8 text-blue-600" />
                </div>
                <Progress 
                  value={(metrics.views / targets.views) * 100} 
                  className="mt-2 h-1" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">总点击</p>
                    <p className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getMetricTrend(metrics.clicks, previousMetrics.clicks).direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        getMetricTrend(metrics.clicks, previousMetrics.clicks).isPositive 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMetricTrend(metrics.clicks, previousMetrics.clicks).value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <MousePointer className="w-8 h-8 text-purple-600" />
                </div>
                <Progress 
                  value={(metrics.clicks / targets.clicks) * 100} 
                  className="mt-2 h-1" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">转化数</p>
                    <p className="text-2xl font-bold">{metrics.conversions}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getMetricTrend(metrics.conversions, previousMetrics.conversions).direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        getMetricTrend(metrics.conversions, previousMetrics.conversions).isPositive 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMetricTrend(metrics.conversions, previousMetrics.conversions).value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-green-600" />
                </div>
                <Progress 
                  value={(metrics.conversions / targets.conversions) * 100} 
                  className="mt-2 h-1" 
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">销售额</p>
                    <p className="text-2xl font-bold">₽{(metrics.revenue / 1000).toFixed(0)}K</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getMetricTrend(metrics.revenue, previousMetrics.revenue).direction === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        getMetricTrend(metrics.revenue, previousMetrics.revenue).isPositive 
                          ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {getMetricTrend(metrics.revenue, previousMetrics.revenue).value.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-red-600" />
                </div>
                <Progress 
                  value={(metrics.revenue / targets.revenue) * 100} 
                  className="mt-2 h-1" 
                />
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="channels">渠道分析</TabsTrigger>
          <TabsTrigger value="kpis">KPI跟踪</TabsTrigger>
          <TabsTrigger value="insights">智能洞察</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 关键比率指标 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">点击率 (CTR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.ctr}%</div>
                <div className="flex items-center gap-2">
                  <Progress value={(metrics.ctr / targets.ctr) * 100} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground">
                    目标: {targets.ctr}%
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {getMetricTrend(metrics.ctr, previousMetrics.ctr).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${
                    getMetricTrend(metrics.ctr, previousMetrics.ctr).isPositive 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getMetricTrend(metrics.ctr, previousMetrics.ctr).value.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">转化率 (CVR)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.cvr}%</div>
                <div className="flex items-center gap-2">
                  <Progress value={(metrics.cvr / targets.cvr) * 100} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground">
                    目标: {targets.cvr}%
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {getMetricTrend(metrics.cvr, previousMetrics.cvr).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${
                    getMetricTrend(metrics.cvr, previousMetrics.cvr).isPositive 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getMetricTrend(metrics.cvr, previousMetrics.cvr).value.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">广告回报率 (ROAS)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">{metrics.roas}x</div>
                <div className="flex items-center gap-2">
                  <Progress value={(metrics.roas / targets.roas) * 100} className="flex-1 h-2" />
                  <span className="text-sm text-muted-foreground">
                    目标: {targets.roas}x
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {getMetricTrend(metrics.roas, previousMetrics.roas).direction === 'up' ? (
                    <TrendingUp className="w-3 h-3 text-green-600" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-600" />
                  )}
                  <span className={`text-xs ${
                    getMetricTrend(metrics.roas, previousMetrics.roas).isPositive 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {getMetricTrend(metrics.roas, previousMetrics.roas).value.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="channels" className="space-y-4">
          <div className="space-y-4">
            {channelData.map((channel, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">{channel.name}</h4>
                    <Badge variant={channel.roas >= 5 ? 'default' : 'secondary'}>
                      ROAS: {channel.roas}x
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">曝光</span>
                      <p className="font-medium">{channel.views.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">点击</span>
                      <p className="font-medium">{channel.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">转化</span>
                      <p className="font-medium">{channel.conversions}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">销售额</span>
                      <p className="font-medium">₽{channel.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">花费</span>
                      <p className="font-medium">₽{channel.spend.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">CTR</span>
                      <p className="font-medium">{((channel.clicks / channel.views) * 100).toFixed(2)}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>效果评分</span>
                      <span>{Math.round(channel.roas * 20)}%</span>
                    </div>
                    <Progress value={Math.min(channel.roas * 20, 100)} className="h-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="kpis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  流量指标
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">总曝光量</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.views.toLocaleString()} / {targets.views.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(metrics.views / targets.views) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">总点击量</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.clicks.toLocaleString()} / {targets.clicks.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(metrics.clicks / targets.clicks) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  转化指标
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">转化数量</span>
                    <span className="text-sm text-muted-foreground">
                      {metrics.conversions} / {targets.conversions}
                    </span>
                  </div>
                  <Progress value={(metrics.conversions / targets.conversions) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">销售额</span>
                    <span className="text-sm text-muted-foreground">
                      ₽{metrics.revenue.toLocaleString()} / ₽{targets.revenue.toLocaleString()}
                    </span>
                  </div>
                  <Progress value={(metrics.revenue / targets.revenue) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-4">
          <div className="space-y-4">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                <strong>表现良好:</strong> 整体ROAS达到5.36x，超出预期目标。OZON和Yandex渠道表现优异。
              </AlertDescription>
            </Alert>
            
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>需要关注:</strong> KOL合作渠道的ROAS仅为3.5x，建议优化合作内容或调整预算分配。
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  AI优化建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">增加OZON广告预算</p>
                      <p className="text-sm text-muted-foreground">
                        OZON渠道表现优异，建议将预算从₽20,000增加到₽25,000，预计可提升20%销售额
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">优化KOL合作内容</p>
                      <p className="text-sm text-muted-foreground">
                        建议与KOL制作更多产品使用场景视频，突出降噪功能在通勤中的实际效果
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">A/B测试新创意</p>
                      <p className="text-sm text-muted-foreground">
                        当前CTR为2.8%，建议测试强调&quot;商务专用&quot;和&quot;长续航&quot;的新广告创意
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PerformanceTracking;