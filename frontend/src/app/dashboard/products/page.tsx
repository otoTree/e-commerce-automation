'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ProductListItem from './ProductListItem'
import ProductCard from '@/components/product/ProductCard'
import ProductStats from './ProductStats'
import ProductForm from './ProductForm'
import { useProductService } from '@/hooks/useProductService'
import { useAnalysis } from '@/hooks/useAnalysis'
import type { AnalysisResult } from '@/hooks/useAnalysis'
import { Product } from '@/services/productService'
import { formatPrice } from '@/lib/utils'
import { 
  Package, 
  Plus, 
  Search,
  Edit,
  Trash2,
  AlertCircle,
  Grid,
  List,
  BarChart3,
  TrendingUp,
  DollarSign,
  Target
} from 'lucide-react'

export default function ProductsPage() {
  // 使用新的产品服务hook
  const {
    products,
    loading,
    error,
    pagination,
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    clearError,
    isLoading
  } = useProductService()

  // 使用分析服务hook
  const {
    analyzeProduct,
    loading: analysisLoading,
    error: analysisError,
    clearError: clearAnalysisError
  } = useAnalysis()

  // 本地状态
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [analyzingProducts, setAnalyzingProducts] = useState<Set<string>>(new Set())
  
  // 分析结果展示相关状态
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false)

  // 初始化加载产品
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // 处理产品分析
  const handleAnalyzeProduct = useCallback(async (productId: string) => {
    try {
      setAnalyzingProducts(prev => new Set(prev).add(productId))
      const result = await analyzeProduct(productId)
      
      // 显示成功消息
      if (result?.task_id) {
        console.log(`分析任务已创建: ${result.task_id}`)
        // 可以添加toast通知或其他用户反馈
      }
    } catch (error) {
      console.error('分析产品失败:', error)
      // 显示错误消息给用户
      const errorMessage = error instanceof Error ? error.message : '分析失败，请重试'
      console.error('分析错误:', errorMessage)
    } finally {
      setAnalyzingProducts(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }, [analyzeProduct])

  // 处理编辑产品
  const handleEditProduct = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsEditDialogOpen(true)
  }, [])

  // 处理删除产品
  const handleDeleteProduct = useCallback(async (product: Product) => {
    if (window.confirm(`确定要删除产品 "${product.title}" 吗？`)) {
      try {
        await deleteProduct(product.id)
      } catch (error) {
        console.error('删除产品失败:', error)
      }
    }
  }, [deleteProduct])

  // 处理表单关闭
  const handleFormClose = useCallback(() => {
    setSelectedProduct(null)
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
  }, [])

  // 处理表单提交
  const handleFormSubmit = useCallback(() => {
    handleFormClose()
    loadProducts() // 重新加载产品列表
  }, [handleFormClose, loadProducts])

  // 查看分析结果处理
  const handleViewAnalysis = useCallback((analysis: AnalysisResult) => {
    setSelectedAnalysis(analysis)
    setIsAnalysisDialogOpen(true)
  }, [])

  // 关闭分析结果对话框
  const handleCloseAnalysisDialog = useCallback(() => {
    setIsAnalysisDialogOpen(false)
    setSelectedAnalysis(null)
  }, [])

  // 过滤后的产品列表
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || product.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, categoryFilter, statusFilter])

  // 获取唯一分类列表
  const uniqueCategories = useMemo(() => {
    const categories = products.map(product => product.category).filter(Boolean)
    return [...new Set(categories)]
  }, [products])

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">产品管理</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            {viewMode === 'grid' ? '列表视图' : '网格视图'}
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            添加产品
          </Button>
        </div>
      </div>

      {/* 产品统计 */}
      <ProductStats products={products} />

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索产品标题或描述..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分类</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有状态</SelectItem>
                <SelectItem value="active">活跃</SelectItem>
                <SelectItem value="inactive">非活跃</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 分析错误提示 */}
      {analysisError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            分析失败: {analysisError}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAnalysisError}
              className="ml-2"
            >
              关闭
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 产品列表 */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">加载中...</p>
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => loadProducts()}
              className="ml-2"
            >
              重试
            </Button>
          </AlertDescription>
        </Alert>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无产品</h3>
            <p className="text-gray-600 mb-4">开始添加您的第一个产品</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              添加产品
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={(productId) => {
                    const prod = products.find(p => p.id === productId)
                    if (prod) handleDeleteProduct(prod)
                  }}
                  onAnalyze={handleAnalyzeProduct}
                  onViewAnalysis={handleViewAnalysis}
                  isAnalyzing={analyzingProducts.has(product.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>产品</TableHead>
                    <TableHead>分类</TableHead>
                    <TableHead>价格</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <ProductListItem
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDelete={(productId) => {
                        const prod = products.find(p => p.id === productId)
                        if (prod) handleDeleteProduct(prod)
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </>
      )}

      {/* 创建产品对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>添加新产品</DialogTitle>
          </DialogHeader>
          <ProductForm
            onClose={handleFormClose}
            onSave={handleFormSubmit}
            createProduct={createProduct}
            isLoading={isLoading('createProduct')}
          />
        </DialogContent>
      </Dialog>

      {/* 编辑产品对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑产品</DialogTitle>
          </DialogHeader>
          <ProductForm
            product={selectedProduct || undefined}
            onClose={handleFormClose}
            onSave={handleFormSubmit}
            updateProduct={updateProduct}
            isLoading={isLoading('updateProduct')}
          />
        </DialogContent>
      </Dialog>

      {/* 分析结果展示对话框 */}
      <Dialog open={isAnalysisDialogOpen} onOpenChange={setIsAnalysisDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              产品分析报告
            </DialogTitle>
          </DialogHeader>
          
          {selectedAnalysis && (
            <div className="space-y-6">
              {/* 产品基本信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">产品信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">产品标题</span>
                      <p className="text-sm">{selectedAnalysis.productTitle}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">分析时间</span>
                      <p className="text-sm">{new Date(selectedAnalysis.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 市场热度分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    市场热度分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedAnalysis.marketHeat.score}
                      </div>
                      <div className="text-sm text-gray-500">热度评分</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedAnalysis.marketHeat.searchVolume.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">搜索量</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {selectedAnalysis.marketHeat.competitorCount}
                      </div>
                      <div className="text-sm text-gray-500">竞争对手</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-2xl font-bold">
                          {selectedAnalysis.marketHeat.trend === 'up' ? '↗️' : 
                           selectedAnalysis.marketHeat.trend === 'down' ? '↘️' : '➡️'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">趋势</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 盈利分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    盈利分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ¥{selectedAnalysis.profitAnalysis.estimatedProfit.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">预期利润</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedAnalysis.profitAnalysis.profitMargin.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">利润率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {selectedAnalysis.profitAnalysis.breakEvenPoint}
                      </div>
                      <div className="text-sm text-gray-500">盈亏平衡点</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {selectedAnalysis.profitAnalysis.roi.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500">投资回报率</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 竞争力分析 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    竞争力分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {selectedAnalysis.competitiveness.score}
                      </div>
                      <div className="text-sm text-gray-500">竞争力评分</div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-green-700 mb-2">优势</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.competitiveness.strengths.map((strength, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-red-700 mb-2">劣势</h4>
                        <ul className="space-y-1">
                          {selectedAnalysis.competitiveness.weaknesses.map((weakness, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-red-500 mt-1">✗</span>
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">建议</h4>
                      <ul className="space-y-1">
                        {selectedAnalysis.competitiveness.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-500 mt-1">💡</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 操作按钮 */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleCloseAnalysisDialog}>
                  关闭
                </Button>
                <Button onClick={() => {
                  // 可以添加导出报告功能
                  alert('导出功能开发中...')
                }}>
                  导出报告
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}