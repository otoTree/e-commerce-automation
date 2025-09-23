'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ProductCard } from './ProductCard'
import { ProductAnalysisModal } from './ProductAnalysisModal'
import { useProducts } from '@/hooks/useProductsOptimized'
import { useAnalysis, AnalysisResult } from '@/hooks/useAnalysis'
import { 
  Search, 
  Filter, 
  Package, 
  AlertCircle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react'

// 产品接口定义 - 本地版本
interface LocalProduct {
  id: string
  title: string
  price: number
  currency: string
  category: string
  platform: string
  image?: string
  images?: string[]
  description?: string
  tags?: string[]
  createdAt?: string
  status?: 'active' | 'inactive' | 'draft'
  updatedAt?: string
}

interface ProductGridProps {
  products?: LocalProduct[]
  loading?: boolean
  className?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products: externalProducts, 
  loading: externalLoading, 
  className = '' 
}) => {
  const [products, setProducts] = useState<LocalProduct[]>([])
  const [filteredProducts, setFilteredProducts] = useState<LocalProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 筛选和搜索状态
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  
  // 分析相关状态
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false)
  const [analyzingProducts, setAnalyzingProducts] = useState<Set<string>>(new Set())

  const { getProducts } = useProducts()
  const { analyzeProduct, getAnalysisResult, getTaskStatus } = useAnalysis()

  // 加载产品数据
  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await getProducts()
      if (result.success && result.data) {
        const products = result.data.products || []
        const formattedProducts = products.map((product: {
          _id?: string
          id?: string
          basic_info?: { title?: string; category?: string }
          pricing?: { current_price?: number; currency?: string }
          platform?: string
          title?: string
        }) => ({
          id: product._id || product.id || '',
          title: product.basic_info?.title || product.title || '未知产品',
          price: product.pricing?.current_price || 0,
          currency: product.pricing?.currency || 'CNY',
          category: product.basic_info?.category || '未分类',
          platform: product.platform || '未知平台',
          image: '/placeholder-product.jpg', // 默认图片
          description: '暂无描述',
          tags: [],
          createdAt: new Date().toISOString()
        }))
        
        setProducts(formattedProducts)
        setFilteredProducts(formattedProducts)
      }
    } catch (err) {
      console.error('加载产品失败:', err)
      setError('加载产品数据失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  // 初始化加载
  useEffect(() => {
    if (externalProducts) {
      // 如果有外部传入的产品数据，直接使用
      setProducts(externalProducts)
      setFilteredProducts(externalProducts)
      setLoading(externalLoading || false)
    } else {
      // 否则自己加载数据
      loadProducts()
    }
  }, [externalProducts, externalLoading])

  // 筛选产品
  useEffect(() => {
    let filtered = products

    // 搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // 平台筛选
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(product => product.platform === selectedPlatform)
    }

    // 分类筛选
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory)
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedPlatform, selectedCategory])

  // 获取唯一的平台列表
  const platforms = Array.from(new Set(products.map(p => p.platform)))
  
  // 获取唯一的分类列表
  const categories = Array.from(new Set(products.map(p => p.category)))

  // 处理产品分析
  const handleAnalyzeProduct = async (productId: string) => {
    try {
      setAnalyzingProducts(prev => new Set(prev).add(productId))
      
      const result = await analyzeProduct(productId, {
        include_market_heat: true,
        include_profit_analysis: true,
        include_competitiveness: true
      })
      
      if (result.task_id) {
        // 分析任务创建成功，开始轮询任务状态
        console.log('分析任务已创建:', result.task_id)
        
        // 轮询任务状态
        const pollTaskStatus = async () => {
          const taskStatus = await getTaskStatus(result.task_id!)
          
          if (taskStatus) {
            console.log('任务状态:', taskStatus)
            
            if (taskStatus.status === 'completed') {
              // 任务完成，移除loading状态并刷新分析结果
              setAnalyzingProducts(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
              })
              
              // 触发重新加载产品数据以获取最新的分析结果
              if (externalProducts) {
                // 如果使用外部产品数据，可能需要通知父组件刷新
                console.log('分析完成，建议刷新产品数据')
              } else {
                // 重新加载产品数据
                loadProducts()
              }
              
            } else if (taskStatus.status === 'failed') {
              // 任务失败
              const errorMsg = taskStatus.errorMessage || '分析任务失败，请重试'
              console.error('分析任务失败:', errorMsg)
              setAnalyzingProducts(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
              })
            } else if (taskStatus.status === 'running' || taskStatus.status === 'pending') {
              // 任务仍在进行中，继续轮询
              setTimeout(pollTaskStatus, 2000) // 2秒后再次检查
            }
          } else {
            // 获取任务状态失败，停止轮询
            setTimeout(() => {
              setAnalyzingProducts(prev => {
                const newSet = new Set(prev)
                newSet.delete(productId)
                return newSet
              })
            }, 3000)
          }
        }
        
        // 开始轮询
        setTimeout(pollTaskStatus, 1000) // 1秒后开始第一次检查
      }
    } catch (err) {
      console.error('分析失败:', err)
      setAnalyzingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  // 处理查看分析结果
  const handleViewAnalysis = (analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis)
    setIsAnalysisModalOpen(true)
  }

  // 关闭分析模态框
  const handleCloseAnalysisModal = () => {
    setIsAnalysisModalOpen(false)
    setSelectedAnalysis(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">加载产品数据中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadProducts}
            className="ml-4"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重试
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 搜索和筛选 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            产品管理
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索产品名称或分类..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* 平台筛选 */}
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="选择平台" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有平台</SelectItem>
                {platforms.map(platform => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* 分类筛选 */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* 结果统计 */}
          <div className="mt-4 text-sm text-gray-500">
            共找到 {filteredProducts.length} 个产品
            {searchTerm && ` (搜索: "${searchTerm}")`}
            {selectedPlatform !== 'all' && ` (平台: ${selectedPlatform})`}
            {selectedCategory !== 'all' && ` (分类: ${selectedCategory})`}
          </div>
        </CardContent>
      </Card>

      {/* 产品网格 */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
              <p className="text-gray-500">
                {searchTerm || selectedPlatform !== 'all' || selectedCategory !== 'all'
                  ? '没有找到符合条件的产品，请尝试调整筛选条件'
                  : '还没有收集到产品数据，请先进行数据收集'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => {
            // 转换为ProductCard期望的Product类型
            const productForCard = {
              ...product,
              image: product.images?.[0] || product.image || '/placeholder-product.jpg',
              images: product.images || [product.image || '/placeholder-product.jpg'],
              description: product.description || '暂无描述',
              tags: [],
              status: product.status || 'active' as const,
              createdAt: product.createdAt || new Date().toISOString(),
              updatedAt: product.updatedAt || new Date().toISOString()
            }
            
            return (
               <ProductCard
                 key={product.id}
                 product={productForCard}
                 onAnalyze={handleAnalyzeProduct}
                 onViewAnalysis={handleViewAnalysis}
                 isAnalyzing={analyzingProducts.has(product.id)}
               />
             )
          })}
        </div>
      )}

      {/* 分析结果模态框 */}
      <ProductAnalysisModal
        isOpen={isAnalysisModalOpen}
        onClose={handleCloseAnalysisModal}
        analysis={selectedAnalysis}
      />
    </div>
  )
}

export default ProductGrid