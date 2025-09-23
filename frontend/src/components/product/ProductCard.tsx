'use client'

import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Package,
  Clock,
  Eye,
  Play,
  Edit,
  Trash2
} from 'lucide-react'
import { useAnalysis, AnalysisResult } from '@/hooks/useAnalysis'
import { Product } from '@/services/productService'

// 分析状态类型
type AnalysisStatus = 'none' | 'pending' | 'completed' | 'failed' | 'loading'

interface ProductCardProps {
  product: Product
  onAnalyze: (productId: string) => void
  onViewAnalysis?: (analysis: AnalysisResult) => void
  onEdit?: (product: Product) => void
  onDelete?: (productId: string) => void
  className?: string
  isAnalyzing?: boolean // 新增：是否正在分析
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAnalyze,
  onViewAnalysis,
  onEdit,
  onDelete,
  className = '',
  isAnalyzing = false
}) => {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('loading')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const { getAnalysisResult } = useAnalysis()

  // 加载分析结果
  useEffect(() => {
    const loadAnalysisResult = async () => {
      try {
        // 如果正在分析，设置为pending状态
        if (isAnalyzing) {
          setAnalysisStatus('pending')
          return
        }
        
        setAnalysisStatus('loading')
        const result = await getAnalysisResult(product.id)
        
        if (result) {
          setAnalysisResult(result)
          setAnalysisStatus('completed')
        } else {
          setAnalysisStatus('none')
        }
      } catch (error) {
        console.error('获取分析结果失败:', error)
        setAnalysisStatus('none')
      }
    }

    loadAnalysisResult()
  }, [product.id, getAnalysisResult, isAnalyzing])

  // 获取趋势图标
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  // 获取分析状态徽章
  const getStatusBadge = () => {
    switch (analysisStatus) {
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            已分析
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            分析中
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            分析失败
          </Badge>
        )
      case 'loading':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1 animate-spin" />
            加载中
          </Badge>
        )
      default:
        return (
          <Badge variant="outline">
            <Package className="h-3 w-3 mr-1" />
            未分析
          </Badge>
        )
    }
  }

  // 处理分析按钮点击
  const handleAnalyzeClick = () => {
    if (onAnalyze) {
      onAnalyze(product.id)
    }
  }

  // 处理查看分析结果点击
  const handleViewAnalysisClick = () => {
    if (analysisResult && onViewAnalysis) {
      onViewAnalysis(analysisResult)
    }
  }

  return (
    <Card className={`hover:shadow-md transition-shadow cursor-pointer ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium truncate" title={product.title}>
              {product.title}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{product.platform}</span>
              <span className="text-sm text-gray-400">•</span>
              <span className="text-sm text-gray-500">{product.category}</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 产品基本信息 */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500 ml-1">{product.currency}</span>
          </div>
        </div>

        {/* 分析结果预览 */}
        {analysisStatus === 'completed' && analysisResult && (
          <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">市场热度</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold">
                  {analysisResult.marketHeat.score}
                </span>
                {getTrendIcon(analysisResult.marketHeat.trend)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">竞争力评分</span>
              <span className="text-sm font-semibold">
                {analysisResult.competitiveness.score}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">预期利润率</span>
              <span className="text-sm font-semibold text-green-600">
                {analysisResult.profitAnalysis.profitMargin.toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex gap-2">
          {analysisStatus === 'completed' && analysisResult ? (
            <Button 
              onClick={handleViewAnalysisClick}
              className="flex-1"
              variant="default"
            >
              <Eye className="h-4 w-4 mr-2" />
              查看分析
            </Button>
          ) : analysisStatus === 'none' || analysisStatus === 'failed' ? (
            <Button 
              onClick={handleAnalyzeClick}
              className="flex-1"
              variant="outline"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              开始分析
            </Button>
          ) : analysisStatus === 'pending' ? (
            <Button 
              disabled
              className="flex-1"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              分析中...
            </Button>
          ) : (
            <Button 
              disabled
              className="flex-1"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              加载中...
            </Button>
          )}
          
          {/* 编辑和删除按钮 */}
          {onEdit && (
            <Button 
              onClick={() => onEdit(product)}
              variant="ghost"
              size="sm"
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          
          {onDelete && (
            <Button 
              onClick={() => onDelete(product.id)}
              variant="ghost"
              size="sm"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          
          {analysisStatus === 'completed' && (
            <Button 
              onClick={handleAnalyzeClick}
              variant="ghost"
              size="sm"
            >
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
export type { ProductCardProps }