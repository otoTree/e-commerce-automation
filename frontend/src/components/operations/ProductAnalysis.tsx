import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Target, 
  Lightbulb,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import type { OperationTask, ProductAnalysisResult } from '../../types/operations';

interface ProductAnalysisProps {
  task: OperationTask;
}

export function ProductAnalysis({ task }: ProductAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ProductAnalysisResult | null>(null);
  const [customRequirements, setCustomRequirements] = useState('');

  useEffect(() => {
    // 如果任务已经有分析结果，加载它
    if (task.progress.analysis === 'completed') {
      loadAnalysisResult();
    }
  }, [task.id]);

  const loadAnalysisResult = async () => {
    // 模拟加载已有的分析结果
    const mockResult: ProductAnalysisResult = {
      id: 'analysis-001',
      taskId: task.id,
      overallScore: 85,
      marketPotential: {
        score: 88,
        trends: ['智能穿戴设备增长', '无线音频市场扩张', '降噪技术普及'],
        seasonality: '全年稳定，节假日销量增长30%',
        competition: 'medium'
      },
      targetAudience: {
        demographics: ['25-40岁', '中高收入', '城市白领', '学生群体'],
        interests: ['科技产品', '音乐', '运动健身', '通勤便利'],
        painPoints: ['有线耳机不便', '通话质量差', '续航时间短', '佩戴不舒适'],
        buyingBehavior: '注重品质和性价比，喜欢在线比价，重视用户评价'
      },
      competitorAnalysis: {
        mainCompetitors: ['Apple AirPods', 'Sony WF系列', '小米Air系列', 'QCY耳机'],
        priceRange: { min: 200, max: 2000 },
        differentiators: ['降噪技术', '续航能力', '音质表现', '佩戴舒适度'],
        marketGaps: ['中端价位降噪产品', '运动专用防水耳机', '老年人友好设计']
      },
      recommendations: {
        pricing: '建议定价800-1200卢布，定位中高端市场',
        positioning: '主打降噪和长续航，面向商务和通勤人群',
        channels: ['OZON', 'Wildberries', '社交媒体广告', 'KOL合作'],
        timeline: '2-3个月完成市场投放，6个月达到盈亏平衡'
      },
      createdAt: new Date()
    };
    setAnalysisResult(mockResult);
  };

  const handleStartAnalysis = async () => {
    setAnalyzing(true);
    
    // 模拟AI分析过程
    setTimeout(() => {
      loadAnalysisResult();
      setAnalyzing(false);
    }, 3000);
  };

  const getCompetitionColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCompetitionText = (level: string) => {
    switch (level) {
      case 'low': return '竞争较小';
      case 'medium': return '竞争适中';
      case 'high': return '竞争激烈';
      default: return '未知';
    }
  };

  if (task.progress.analysis === 'pending') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            商品市场分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="text-center py-8">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">开始商品分析</h3>
              <p className="text-muted-foreground mb-6">
                AI将分析商品的市场潜力、目标受众、竞争情况并提供运营建议
              </p>
              
              <div className="max-w-md mx-auto mb-6">
                <label className="block text-sm font-medium mb-2">特殊要求（可选）</label>
                <Textarea
                  placeholder="例如：重点分析俄罗斯市场，关注25-35岁用户群体..."
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleStartAnalysis}
                disabled={analyzing}
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    分析中...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    开始分析
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (analyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            正在分析商品...
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
                AI正在分析市场数据，请稍候...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisResult) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          分析结果加载失败，请重试。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* 总体评分 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              分析完成
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">{analysisResult.overallScore}</div>
              <div className="text-sm text-muted-foreground">综合评分</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={analysisResult.overallScore} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            基于市场潜力、竞争情况、目标受众等多维度分析得出
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 市场潜力 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              市场潜力
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>市场评分</span>
              <div className="flex items-center gap-2">
                <Progress value={analysisResult.marketPotential.score} className="w-20 h-2" />
                <span className="font-bold">{analysisResult.marketPotential.score}</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">市场趋势</h4>
              <div className="space-y-1">
                {analysisResult.marketPotential.trends.map((trend, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {trend}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">季节性分析</h4>
              <p className="text-sm text-muted-foreground">
                {analysisResult.marketPotential.seasonality}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">竞争程度</h4>
              <Badge className={getCompetitionColor(analysisResult.marketPotential.competition)}>
                {getCompetitionText(analysisResult.marketPotential.competition)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* 目标受众 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              目标受众
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">人群画像</h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.targetAudience.demographics.map((demo, index) => (
                  <Badge key={index} variant="secondary">{demo}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">兴趣偏好</h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.targetAudience.interests.map((interest, index) => (
                  <Badge key={index} variant="outline">{interest}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">痛点需求</h4>
              <div className="space-y-1">
                {analysisResult.targetAudience.painPoints.map((pain, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                    {pain}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">购买行为</h4>
              <p className="text-sm text-muted-foreground">
                {analysisResult.targetAudience.buyingBehavior}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 竞争分析 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              竞争分析
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">主要竞品</h4>
              <div className="space-y-1">
                {analysisResult.competitorAnalysis.mainCompetitors.map((competitor, index) => (
                  <div key={index} className="text-sm">{competitor}</div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">价格区间</h4>
              <p className="text-sm">
                ¥{analysisResult.competitorAnalysis.priceRange.min} - 
                ¥{analysisResult.competitorAnalysis.priceRange.max}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">差异化要素</h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.competitorAnalysis.differentiators.map((diff, index) => (
                  <Badge key={index} variant="secondary">{diff}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">市场空白</h4>
              <div className="space-y-1">
                {analysisResult.competitorAnalysis.marketGaps.map((gap, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {gap}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 运营建议 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              运营建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">定价策略</h4>
              <p className="text-sm text-muted-foreground">
                {analysisResult.recommendations.pricing}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">市场定位</h4>
              <p className="text-sm text-muted-foreground">
                {analysisResult.recommendations.positioning}
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">推荐渠道</h4>
              <div className="flex flex-wrap gap-1">
                {analysisResult.recommendations.channels.map((channel, index) => (
                  <Badge key={index} variant="outline">{channel}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">时间规划</h4>
              <p className="text-sm text-muted-foreground">
                {analysisResult.recommendations.timeline}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 下一步操作 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-1">分析完成！</h3>
              <p className="text-sm text-muted-foreground">
                基于分析结果，建议继续进行内容生成和营销策略制定
              </p>
            </div>
            <Button>
              继续内容生成
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProductAnalysis;