'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Package,
  Search,
  Filter,
  Upload,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  DollarSign
} from 'lucide-react'

// API请求工具函数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

const makeRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  
  if (!data.success && data.error) {
    throw new Error(data.error)
  }

  return data
}

interface AnalyzedProduct {
  _id: string
  platform: string
  platform_product_id: string
  basic_info: {
    title: string
    description: string
    category: string
    brand?: string
    images: string[]
  }
  pricing: {
    current_price: number
    original_price?: number
    currency: string
  }
  sales_data: {
    sales_volume: number
    review_count: number
    rating: number
    stock_quantity?: number
  }
  supplier: {
    name: string
    location: string
    rating: number
    years_in_business?: number
  }
  collection_meta: {
    collected_at: string
    collection_duration: number
    data_completeness: number
  }
  analysis: {
    total_score: number
    recommendation: string
    confidence_level: number
    analyzed_at: string
  }
}

interface ProductListing {
  _id: string
  product_id: string
  analysis_id: string
  platform: string
  status: 'draft' | 'pending' | 'active' | 'paused' | 'rejected'
  listing_data: {
    title: string
    description: string
    price: number
    currency: string
    images: string[]
    category: string
  }
  inventory: {
    stock_quantity: number
    reserved_quantity: number
    low_stock_threshold: number
  }
  created_at: string
  updated_at: string
}

const ProductListingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('analyzed')
  const [analyzedProducts, setAnalyzedProducts] = useState<AnalyzedProduct[]>([])
  const [listings, setListings] = useState<ProductListing[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选状态
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // 获取已分析商品列表
  const fetchAnalyzedProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter && categoryFilter !== 'all' && { category: categoryFilter })
      })
      
      const response = await makeRequest(`/listings/analyzed-products?${params}`)
      
      if (response.success) {
        setAnalyzedProducts(response.data.products || [])
      } else {
        setError(response.message || '获取商品列表失败')
      }
    } catch (err) {
      console.error('获取已分析商品失败:', err)
      setError(err instanceof Error ? err.message : '网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 获取上架商品列表
  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        ...(statusFilter && statusFilter !== 'all' && { status: statusFilter })
      })
      
      const response = await makeRequest(`/listings?${params}`)
      
      if (response.success) {
        setListings(response.data.listings || [])
      } else {
        setError(response.message || '获取上架列表失败')
      }
    } catch (err) {
      console.error('获取上架列表失败:', err)
      setError(err instanceof Error ? err.message : '网络错误，请重试')
    } finally {
      setLoading(false)
    }
  }

  // 创建商品上架
  const createListing = async (productId: string, analysisId: string) => {
    try {
      const response = await makeRequest('/listings', {
        method: 'POST',
        body: JSON.stringify({
          product_id: productId,
          analysis_id: analysisId,
          platform: 'ozon'
        })
      })
      
      if (response.success) {
        alert('商品上架成功！')
        fetchListings()
      } else {
        alert(response.message || '上架失败')
      }
    } catch (err) {
      console.error('创建商品上架失败:', err)
      alert(err instanceof Error ? err.message : '网络错误，请重试')
    }
  }

  // 更新上架状态
  const updateListingStatus = async (listingId: string, status: string) => {
    try {
      const response = await makeRequest(`/listings/${listingId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      })
      
      if (response.success) {
        fetchListings()
      } else {
        alert(response.message || '状态更新失败')
      }
    } catch (err) {
      console.error('更新上架状态失败:', err)
      alert(err instanceof Error ? err.message : '网络错误，请重试')
    }
  }

  useEffect(() => {
    if (activeTab === 'analyzed') {
      fetchAnalyzedProducts()
    } else {
      fetchListings()
    }
  }, [activeTab, searchTerm, categoryFilter, statusFilter])

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: '草稿', variant: 'secondary' as const },
      pending: { label: '待审核', variant: 'default' as const },
      active: { label: '已上架', variant: 'default' as const },
      paused: { label: '已暂停', variant: 'secondary' as const },
      rejected: { label: '已拒绝', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getRiskBadge = (riskLevel: string) => {
    const riskConfig = {
      low: { label: '低风险', variant: 'default' as const, color: 'text-green-600' },
      medium: { label: '中风险', variant: 'secondary' as const, color: 'text-yellow-600' },
      high: { label: '高风险', variant: 'destructive' as const, color: 'text-red-600' }
    }
    
    const config = riskConfig[riskLevel as keyof typeof riskConfig] || riskConfig.medium
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const getRecommendationBadge = (recommendation: string) => {
    const recommendationConfig = {
      buy: { label: '推荐购买', variant: 'default' as const, color: 'text-green-600' },
      hold: { label: '观望', variant: 'secondary' as const, color: 'text-yellow-600' },
      sell: { label: '不推荐', variant: 'destructive' as const, color: 'text-red-600' }
    }
    
    const config = recommendationConfig[recommendation as keyof typeof recommendationConfig] || recommendationConfig.hold
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>
  }

  const getRecommendationText = (recommendation: string) => {
    const recommendationText = {
      buy: '推荐购买',
      hold: '观望',
      sell: '不推荐'
    }
    
    return recommendationText[recommendation as keyof typeof recommendationText] || '观望'
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商品上架管理</h1>
          <p className="text-gray-600">管理已分析商品的上架流程</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          刷新
        </Button>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 主要内容 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="analyzed">已分析商品</TabsTrigger>
          <TabsTrigger value="listings">上架管理</TabsTrigger>
        </TabsList>

        {/* 已分析商品标签页 */}
        <TabsContent value="analyzed" className="space-y-4">
          {/* 筛选工具栏 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="搜索商品标题..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部分类</SelectItem>
                    <SelectItem value="electronics">电子产品</SelectItem>
                    <SelectItem value="clothing">服装</SelectItem>
                    <SelectItem value="home">家居用品</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 商品列表 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {analyzedProducts.map((item) => (
                <Card key={item._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* 商品图片 */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.basic_info.images[0] || '/placeholder.jpg'}
                          alt={item.basic_info.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* 商品信息 */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {item.basic_info.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.supplier.name} · {item.supplier.location}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>价格: {item.pricing.current_price} {item.pricing.currency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4 text-blue-600" />
                            <span>评分: {item.analysis.total_score}/100</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-purple-600" />
                            <span>置信度: {Math.round(item.analysis.confidence_level * 100)}%</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.basic_info.category}</Badge>
                          {getRecommendationBadge(item.analysis.recommendation)}
                          <Badge variant="secondary">评分: {item.analysis.total_score}/100</Badge>
                        </div>

                        {/* 推荐信息 */}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-blue-800 mb-1">分析建议:</p>
                          <p className="text-sm text-blue-700">
                            推荐等级: {getRecommendationText(item.analysis.recommendation)}
                          </p>
                          <p className="text-sm text-blue-600 mt-1">
                            分析时间: {new Date(item.analysis.analyzed_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex flex-col gap-2 lg:w-32">
                        <Button
                          onClick={() => createListing(item._id, item._id)}
                          className="w-full"
                          size="sm"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          上架
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          详情
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {analyzedProducts.length === 0 && !loading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">暂无已分析的商品</p>
                    <p className="text-sm text-gray-500 mt-1">
                      请先在数据分析页面分析商品
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* 上架管理标签页 */}
        <TabsContent value="listings" className="space-y-4">
          {/* 筛选工具栏 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="pending">待审核</SelectItem>
                    <SelectItem value="active">已上架</SelectItem>
                    <SelectItem value="paused">已暂停</SelectItem>
                    <SelectItem value="rejected">已拒绝</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* 上架列表 */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">加载中...</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {listings.map((listing) => (
                <Card key={listing._id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* 商品图片 */}
                      <div className="flex-shrink-0">
                        <img
                          src={listing.listing_data.images[0] || '/placeholder.jpg'}
                          alt={listing.listing_data.title}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* 商品信息 */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">
                            {listing.listing_data.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            平台: {listing.platform.toUpperCase()}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span>价格: {listing.listing_data.price} {listing.listing_data.currency}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4 text-blue-600" />
                            <span>库存: {listing.inventory.stock_quantity}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{listing.listing_data.category}</Badge>
                          {getStatusBadge(listing.status)}
                        </div>

                        <div className="text-xs text-gray-500">
                          创建时间: {new Date(listing.created_at).toLocaleString()}
                          {listing.updated_at !== listing.created_at && (
                            <span className="ml-4">
                              更新时间: {new Date(listing.updated_at).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex flex-col gap-2 lg:w-32">
                        <Select
                          value={listing.status}
                          onValueChange={(value) => updateListingStatus(listing._id, value)}
                        >
                          <SelectTrigger size="sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">草稿</SelectItem>
                            <SelectItem value="pending">待审核</SelectItem>
                            <SelectItem value="active">已上架</SelectItem>
                            <SelectItem value="paused">已暂停</SelectItem>
                            <SelectItem value="rejected">已拒绝</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" className="w-full">
                          <Edit className="w-4 h-4 mr-2" />
                          编辑
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          查看
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {listings.length === 0 && !loading && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">暂无上架商品</p>
                    <p className="text-sm text-gray-500 mt-1">
                      请先在已分析商品中选择商品进行上架
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductListingsPage