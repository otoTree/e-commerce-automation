'use client'

import { useEffect, useState } from 'react'
import { useProductStore } from '@/store'
import { UniversalProductCard } from '@/components/UniversalProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Upload, Search, RefreshCw, Link, FileText } from 'lucide-react'

const ProductsPage = () => {
  const {
    products,
    loading,
    error,
    clearProducts,
    setLoading,
    setError,
    fetchProducts
  } = useProductStore()

  const [uploadUrl, setUploadUrl] = useState('')
  const [batchUrls, setBatchUrls] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | '1688' | 'ozon'>('all')
  const [uploadMode, setUploadMode] = useState<'single' | 'batch' | 'keyword'>('single')
  const [keywordSearch, setKeywordSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)

  // 统一后端 API 基础地址
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const handleKeywordSearch = async () => {
    if (!keywordSearch.trim()) {
      setError('请输入搜索关键词')
      return
    }

    setSearchLoading(true)
    setError(null)

    try {
      // 构造1688搜索URL，参考test.md中的URL结构
      const encodedKeyword = encodeURIComponent(keywordSearch.trim())
      const searchUrl = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodedKeyword}&spm=a260k.home2025.searchbox.0&beginPage=1&charset=utf-8`
      
      console.log('搜索URL:', searchUrl)

      // 调用后端API进行搜索任务创建
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'search_1688',
          title: `关键词搜索任务 - ${keywordSearch}`,
          description: `搜索关键词: ${keywordSearch}`,
          url: searchUrl 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // 搜索任务创建成功，重新获取产品数据
        await fetchProducts()
        setKeywordSearch('')
        // 可以添加成功提示
        console.log('关键词搜索任务创建成功')
      } else {
        setError(data.message || '搜索失败')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误')
    } finally {
      setSearchLoading(false)
    }
  }

  // 合并所有产品数据（现在所有数据都在products数组中）
  const allProducts = products.map((p, index) => ({
    ...p,
    source: p.source, // 保留来源
    type: 'product',
    _id: `product-${p.productId}-${index}` // 生成临时ID用于key
  }))

  // 过滤产品
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterType === 'all' || 
      (filterType === '1688' && product.source === '1688') ||
      (filterType === 'ozon' && product.source === 'ozon')
    
    return matchesSearch && matchesFilter
  })

  const handleSingleUpload = async () => {
    if (!uploadUrl.trim()) {
      setError('请输入有效的URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'url',
          title: `单个URL分析任务 - ${new Date().toLocaleString()}`,
          url: uploadUrl 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // 上传成功后重新获取产品数据
        await fetchProducts()
        setUploadUrl('')
      } else {
        setError(data.message || '上传失败')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchUpload = async () => {
    if (!batchUrls.trim()) {
      setError('请输入有效的URL列表')
      return
    }

    // 解析批量URL（按行分割，过滤空行）
    const urls = batchUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)

    if (urls.length === 0) {
      setError('请输入至少一个有效的URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          type: 'batch_url',
          title: `批量URL分析任务 - ${urls.length}个链接 - ${new Date().toLocaleString()}`,
          urls: urls 
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.success) {
        // 上传成功后重新获取产品数据
        await fetchProducts()
        setBatchUrls('')
      } else {
        setError(data.message || '批量上传失败')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchProducts()
  }

  const handleClear = () => {
    clearProducts()
  }

  // 组件加载时自动获取产品数据
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">产品数据管理</h1>
        <p className="text-muted-foreground">
          上传和管理来自1688和Ozon的产品数据，支持单个和批量上传
        </p>
      </div>

      {/* 上传区域 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            上传产品数据
          </CardTitle>
          <CardDescription>
            输入1688或Ozon产品页面URL来提取产品数据，支持单个或批量上传
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={uploadMode} onValueChange={(value: string) => setUploadMode(value as 'single' | 'batch' | 'keyword')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="single" className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  单个上传
                </TabsTrigger>
                <TabsTrigger value="batch" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  批量上传
                </TabsTrigger>
                <TabsTrigger value="keyword" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  关键词搜索
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="输入产品页面URL..."
                    value={uploadUrl}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadUrl(e.target.value)}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button 
                    onClick={handleSingleUpload} 
                    disabled={loading || !uploadUrl.trim()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        处理中...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        上传
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="batch" className="space-y-4">
                <div className="space-y-4">
                  <Textarea
                    placeholder="输入多个产品页面URL，每行一个..."
                    value={batchUrls}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setBatchUrls(e.target.value)}
                    className="min-h-[120px]"
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {batchUrls.split('\n').filter(url => url.trim().length > 0).length} 个URL
                    </p>
                    <Button 
                      onClick={handleBatchUpload} 
                      disabled={loading || !batchUrls.trim()}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          批量处理中...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          批量上传
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keyword" className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    placeholder="输入搜索关键词..."
                    value={keywordSearch}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeywordSearch(e.target.value)}
                    className="flex-1"
                    disabled={searchLoading}
                  />
                  <Button 
                    onClick={handleKeywordSearch} 
                    disabled={searchLoading || !keywordSearch.trim()}
                  >
                    {searchLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        搜索中...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        搜索
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  输入关键词在1688平台搜索相关产品
                </p>
              </TabsContent>
            </Tabs>
          
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 搜索和过滤区域 */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="搜索产品标题或ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('all')}
              >
                全部
              </Button>
              <Button
                variant={filterType === '1688' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('1688')}
              >
                1688
              </Button>
              <Button
                variant={filterType === 'ozon' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType('ozon')}
              >
                Ozon
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={allProducts.length === 0}
              >
                清空
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{allProducts.length}</div>
            <p className="text-xs text-muted-foreground">总产品数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">1688产品</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{products.filter(p => p.title.includes('Ozon') || p.seller.includes('Ozon')).length}</div>
            <p className="text-xs text-muted-foreground">Ozon产品</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredProducts.length}</div>
            <p className="text-xs text-muted-foreground">筛选结果</p>
          </CardContent>
        </Card>
      </div>

      {/* 产品列表 */}
      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <div className="text-muted-foreground">正在加载产品数据...</div>
            </div>
          </CardContent>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {allProducts.length === 0 ? '暂无产品数据' : '没有找到匹配的产品'}
              </div>
              {allProducts.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  请上传产品URL来开始使用，或点击刷新按钮获取已有数据
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product._id || `${product.source}-${product.productId}-${index}`} className="relative">
              <Badge 
                variant={product.source === '1688' ? 'default' : 'secondary'}
                className="absolute top-2 right-2 z-10"
              >
                {product.source.toUpperCase()}
              </Badge>
              <UniversalProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductsPage