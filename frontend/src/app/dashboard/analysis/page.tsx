'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProducts } from '@/hooks/useProductsOptimized'
import { formatPrice } from '@/lib/utils'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Users,
  ShoppingCart,
  Star,
  AlertCircle,
  RefreshCw,
  Download,
  Eye,
  Zap,
  Loader2,
  Calendar,
  PieChart,
  Activity,
  Globe
} from 'lucide-react'

interface BusinessMetrics {
  revenue: {
    total: number
    growth: number
    trend: 'up' | 'down' | 'stable'
  }
  products: {
    total: number
    active: number
    topPerforming: number
    needsAttention: number
  }
  market: {
    totalValue: number
    averagePrice: number
    priceRange: { min: number; max: number }
    categoryDistribution: { [key: string]: number }
  }
  performance: {
    conversionRate: number
    averageOrderValue: number
    customerSatisfaction: number
    returnRate: number
  }
}

interface TrendData {
  period: string
  revenue: number
  products: number
  orders: number
}

export default function AnalysisPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const { 
    getProducts, 
    loading: productsLoading, 
    error: productsError 
  } = useProducts()

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  const loadAnalyticsData = async () => {
    setIsLoading(true)
    try {
      // 获取商品数据用于分析
      const result = await getProducts()
      if (result.success && result.data) {
        const products = result.data.products || []
        
        // 计算业务指标
        const businessMetrics = calculateBusinessMetrics(products)
        setMetrics(businessMetrics)
        
        // 生成趋势数据（模拟数据，实际应从后端获取）
        const trends = generateTrendData(timeRange)
        setTrendData(trends)
      }
    } catch (err) {
      console.error('加载分析数据失败:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateBusinessMetrics = (products: Array<{
    status?: string
    pricing?: { current_price?: number }
    basic_info?: { category?: string }
  }>): BusinessMetrics => {
    const activeProducts = products.filter(p => p.status === 'active')
    const totalValue = products.reduce((sum, p) => sum + (p.pricing?.current_price || 0), 0)
    const prices = products.map(p => p.pricing?.current_price || 0).filter(p => p > 0)
    
    // 按类别分组
    const categoryDistribution: { [key: string]: number } = {}
    products.forEach(p => {
      const category = p.basic_info?.category || '未分类'
      categoryDistribution[category] = (categoryDistribution[category] || 0) + 1
    })

    return {
      revenue: {
        total: totalValue * 0.15, // 假设15%的转化率
        growth: Math.random() * 20 - 10, // 模拟增长率
        trend: Math.random() > 0.5 ? 'up' : 'down'
      },
      products: {
        total: products.length,
        active: activeProducts.length,
        topPerforming: Math.floor(activeProducts.length * 0.2),
        needsAttention: Math.floor(activeProducts.length * 0.1)
      },
      market: {
        totalValue,
        averagePrice: prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0,
        priceRange: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0
        },
        categoryDistribution
      },
      performance: {
        conversionRate: 12.5 + Math.random() * 5,
        averageOrderValue: 150 + Math.random() * 100,
        customerSatisfaction: 4.2 + Math.random() * 0.6,
        returnRate: 2 + Math.random() * 3
      }
    }
  }

  const generateTrendData = (range: string): TrendData[] => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90
    const data: TrendData[] = []
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      data.push({
        period: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
        revenue: 1000 + Math.random() * 2000,
        products: 50 + Math.random() * 20,
        orders: 20 + Math.random() * 30
      })
    }
    
    return data
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Target className="h-4 w-4 text-gray-500" />
    }
  }

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : ''
    const color = growth >= 0 ? 'text-green-600' : 'text-red-600'
    return <span className={color}>{sign}{growth.toFixed(1)}%</span>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">加载分析数据中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-6 w-6 mr-2" />
            业务分析仪表板
          </h1>
          <p className="text-gray-600">全局业务数据分析和趋势洞察</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">近7天</SelectItem>
              <SelectItem value="30d">近30天</SelectItem>
              <SelectItem value="90d">近90天</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新数据
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {productsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{productsError}</AlertDescription>
        </Alert>
      )}

      {/* 核心指标卡片 */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总收入</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(metrics.revenue.total, 'CNY')}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                {getTrendIcon(metrics.revenue.trend)}
                <span className="ml-1">
                  {formatGrowth(metrics.revenue.growth)} 相比上期
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">商品表现</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.products.active}</div>
              <div className="text-xs text-muted-foreground">
                活跃商品 / 总计 {metrics.products.total}
              </div>
              <div className="flex items-center mt-2 space-x-4 text-xs">
                <span className="text-green-600">
                  ⭐ {metrics.products.topPerforming} 优秀
                </span>
                <span className="text-orange-600">
                  ⚠️ {metrics.products.needsAttention} 需关注
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">转化率</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.performance.conversionRate.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                平均订单价值 {formatPrice(metrics.performance.averageOrderValue, 'CNY')}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">客户满意度</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.performance.customerSatisfaction.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                退货率 {metrics.performance.returnRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 详细分析标签页 */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">趋势分析</TabsTrigger>
          <TabsTrigger value="categories">品类分析</TabsTrigger>
          <TabsTrigger value="performance">性能分析</TabsTrigger>
          <TabsTrigger value="predictions">预测分析</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                业务趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>趋势图表组件</p>
                  <p className="text-sm">可集成 Chart.js 或 Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                品类分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              {metrics && (
                <div className="space-y-4">
                  {Object.entries(metrics.market.categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ 
                              width: `${(count / metrics.products.total) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>价格分析</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>平均价格</span>
                      <span className="font-medium">
                        {formatPrice(metrics.market.averagePrice, 'CNY')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>价格区间</span>
                      <span className="font-medium">
                        {formatPrice(metrics.market.priceRange.min, 'CNY')} - {formatPrice(metrics.market.priceRange.max, 'CNY')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>总市场价值</span>
                      <span className="font-medium">
                        {formatPrice(metrics.market.totalValue, 'CNY')}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>运营效率</CardTitle>
              </CardHeader>
              <CardContent>
                {metrics && (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>转化率</span>
                      <span className="font-medium">
                        {metrics.performance.conversionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>客户满意度</span>
                      <span className="font-medium">
                        {metrics.performance.customerSatisfaction.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>退货率</span>
                      <span className="font-medium">
                        {metrics.performance.returnRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                AI 预测分析
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    基于历史数据和市场趋势的智能预测功能正在开发中
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h3 className="font-medium">销量预测</h3>
                    <p className="text-sm text-gray-600">下月预计增长 15%</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-medium">收入预测</h3>
                    <p className="text-sm text-gray-600">季度目标达成率 85%</p>
                  </div>
                  
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-medium">市场机会</h3>
                    <p className="text-sm text-gray-600">发现 3 个潜力品类</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}