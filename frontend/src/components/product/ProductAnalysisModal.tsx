'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  DollarSign,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  Calendar
} from 'lucide-react'

import { AnalysisResult } from '@/hooks/useAnalysis'

// 分析结果接口定义
// interface AnalysisResult {
//   id: string
//   productId: string
//   productTitle: string
//   marketHeat: {
//     score: number
//     trend: 'up' | 'down' | 'stable'
//     searchVolume: number
//     competitorCount: number
//   }
//   profitAnalysis: {
//     estimatedProfit: number
//     profitMargin: number
//     breakEvenPoint: number
//     roi: number
//   }
//   competitiveness: {
//     score: number
//     strengths: string[]
//     weaknesses: string[]
//     recommendations: string[]
//   }
//   createdAt: string
//   status: 'pending' | 'completed' | 'failed'
// }

interface ProductAnalysisModalProps {
  isOpen: boolean
  onClose: () => void
  analysis: AnalysisResult | null
}

export const ProductAnalysisModal: React.FC<ProductAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis
}) => {
  if (!analysis) return null

  // 获取趋势图标和颜色
  const getTrendDisplay = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return {
          icon: <TrendingUp className="h-4 w-4" />,
          color: 'text-green-500',
          bg: 'bg-green-50',
          text: '上升趋势'
        }
      case 'down':
        return {
          icon: <TrendingDown className="h-4 w-4" />,
          color: 'text-red-500',
          bg: 'bg-red-50',
          text: '下降趋势'
        }
      default:
        return {
          icon: <Minus className="h-4 w-4" />,
          color: 'text-gray-500',
          bg: 'bg-gray-50',
          text: '稳定趋势'
        }
    }
  }

  // 获取评分颜色
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  // 获取评分背景色
  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100'
    if (score >= 60) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const trendDisplay = getTrendDisplay(analysis.marketHeat.trend)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {analysis.productTitle} - 分析报告
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 分析时间 */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            分析时间: {new Date(analysis.createdAt).toLocaleString('zh-CN')}
          </div>

          {/* 核心指标概览 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">市场热度</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.marketHeat.score)}`}>
                    {analysis.marketHeat.score}
                  </span>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${trendDisplay.bg}`}>
                    <span className={trendDisplay.color}>{trendDisplay.icon}</span>
                    <span className={`text-xs ${trendDisplay.color}`}>{trendDisplay.text}</span>
                  </div>
                </div>
                <Progress 
                  value={analysis.marketHeat.score} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">竞争力评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${getScoreColor(analysis.competitiveness.score)}`}>
                    {analysis.competitiveness.score}
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={getScoreBg(analysis.competitiveness.score)}
                  >
                    {analysis.competitiveness.score >= 80 ? '优秀' : 
                     analysis.competitiveness.score >= 60 ? '良好' : '需改进'}
                  </Badge>
                </div>
                <Progress 
                  value={analysis.competitiveness.score} 
                  className="mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">预期利润率</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    {analysis.profitAnalysis.profitMargin.toFixed(1)}%
                  </span>
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ROI: {analysis.profitAnalysis.roi.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 详细分析 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 市场热度详情 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  市场热度分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">搜索量趋势</span>
                    <span className="font-medium">{analysis.marketHeat.searchVolume.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">竞争对手数量</span>
                    <span className="font-medium">{analysis.marketHeat.competitorCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">市场趋势</span>
                    <div className={`flex items-center gap-1 ${trendDisplay.color}`}>
                      {trendDisplay.icon}
                      <span className="text-sm">{trendDisplay.text}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 盈利分析详情 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  盈利能力分析
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">预期利润</span>
                    <span className="font-medium text-green-600">
                      ¥{analysis.profitAnalysis.estimatedProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">利润率</span>
                    <span className="font-medium text-green-600">
                      {analysis.profitAnalysis.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">投资回报率</span>
                    <span className="font-medium text-green-600">
                      {analysis.profitAnalysis.roi.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 竞争力优势 */}
          {analysis.competitiveness.strengths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green-500" />
                  竞争优势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysis.competitiveness.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-green-800">{strength}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 改进建议 */}
          {analysis.competitiveness.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-blue-500" />
                  改进建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.competitiveness.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-blue-800">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProductAnalysisModal