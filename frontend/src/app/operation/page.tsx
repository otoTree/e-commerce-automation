'use client'

import { useState } from 'react'
import { ExtractedProduct, ProductData, OzonProductData } from '@/types/product'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Loader2, Link, Search, Package, ShoppingCart, Zap } from 'lucide-react'

// 商品信息类型定义
interface ProductInfo {
  id: string
  title: string
  price: string
  images: string[]
  seller: string
  description: string
  specifications: Record<string, string>
  source: 'ozon' | '1688'
}

// 生成的新商品信息类型
interface GeneratedProduct {
  title: string
  description: string
  price: string
  specifications: Record<string, string>
  images: string[]
  tags: string[]
}

// 翻译API占位符函数
const translateToChineseAPI = async (text: string): Promise<string> => {
  try {
    console.log('Translating text to Chinese:', text)
    
    const apiKey = 'fastgpt-uKPR7eITeoqIPm5PPqWMyPh07rkfKhtXF7bLI7QGFSOAyefpTk9Rz'
    const apiUrl = 'https://api.fastgpt.in/api/v1/chat/completions'
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: `translate_${Date.now()}`,
        stream: false,
        detail: false,
        messages: [
          {
            content: `请将以下文本翻译成中文，只返回翻译结果，不要添加任何解释或其他内容：\n\n${text}`,
            role: 'user'
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`FastGPT API error: ${response.status}`)
    }

    const data = await response.json()
    
    // 从响应中提取翻译结果
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const translatedText = data.choices[0].message.content.trim()
      console.log('Translation result:', translatedText)
      return translatedText
    }
    
    throw new Error('Invalid response format from FastGPT API')
    
  } catch (error) {
    console.error('Translation error:', error)
    // 翻译失败时返回原文本
    return text
  }
}

// API调用函数占位符
const fetchOzonProduct = async (url: string): Promise<ProductInfo | null> => {
  try {
    console.log('Fetching Ozon product from:', url)
    
    // 1. 使用taskService创建任务
    const taskResponse = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        type: 'url',
        title: `Ozon商品分析任务 - ${new Date().toLocaleString()}`,
        description: `获取Ozon商品信息: ${url}`,
        url: url 
      }),
    })

    if (!taskResponse.ok) {
      throw new Error(`创建任务失败: ${taskResponse.status}`)
    }

    const taskData = await taskResponse.json()
    
    if (!taskData.success) {
      throw new Error(taskData.message || '创建任务失败')
    }

    // 2. 优化的轮询逻辑
    const taskId = taskData.data._id
    const pollTask = async (): Promise<ProductInfo> => {
      let attempts = 0
      const maxAttempts = 30 // 最多等待30次，每次2秒，总共1分钟
      const pollInterval = 2000 // 2秒轮询间隔
      
      while (attempts < maxAttempts) {
        try {
          // 使用更短的初始延迟，然后逐渐增加
          const delay = Math.min(pollInterval + (attempts * 200), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
          
          // 获取任务状态
          const statusResponse = await fetch(`http://localhost:3001/api/tasks/${taskId}`)
          
          if (!statusResponse.ok) {
            console.warn(`获取任务状态失败: ${statusResponse.status}`)
            attempts++
            continue
          }

          const statusData = await statusResponse.json()
          
          if (!statusData.success) {
            console.warn('任务状态响应格式错误:', statusData)
            attempts++
            continue
          }

          const task = statusData.data
          console.log(`任务状态检查 (${attempts + 1}/${maxAttempts}):`, {
            status: task.status,
            progress: task.progress,
            hasResult: !!task.result
          })

          // 处理任务完成
          if (task.status === 'completed') {
            const result = task.result
            console.log('任务已完成，开始获取商品数据...')
            
            // 等待一小段时间，确保数据已经保存到数据库
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            try {
              // 任务完成后，通过products API获取实际的商品数据
              console.log('正在从后端API获取商品数据...')
              const productsResponse = await fetch('http://localhost:3001/api/products?limit=50')
              if (productsResponse.ok) {
                const productsData = await productsResponse.json()
                console.log('Products API 响应:', productsData)
                
                if (productsData.success && productsData.data.products.length > 0) {
                   // 查找与当前URL匹配的最新商品
                   const matchingProduct = productsData.data.products.find((p: ExtractedProduct) => 
                     p.url === url || 
                     (p.ozonProductData && p.url.includes(url.split('/').pop() || '')) ||
                     (p.productData && p.url.includes(url.split('/').pop() || ''))
                   )
                  
                  if (matchingProduct) {
                    console.log('找到匹配的商品数据:', matchingProduct)
                    
                    // 优先使用Ozon数据，其次使用1688数据
                    const productData = matchingProduct.ozonProductData || matchingProduct.productData
                    
                    if (productData) {
                      console.log('返回匹配的商品数据')
                      
                      // 处理价格字段 - 如果是对象则转换为字符串
                      let priceString = ''
                      if (productData.price) {
                        if (typeof productData.price === 'object' && 'current' in productData.price) {
                          // 处理 OzonPrice 对象
                          const priceObj = productData.price as { current?: string; currency?: string; original?: string }
                          priceString = `${priceObj.current || ''} ${priceObj.currency || ''}`
                          if (priceObj.original && priceObj.original !== priceObj.current) {
                            priceString += ` (原价: ${priceObj.original})`
                          }
                        } else if (typeof productData.price === 'string') {
                          priceString = productData.price
                        } else {
                          priceString = String(productData.price)
                        }
                      }
                      
                      return {
                        id: productData.productId || matchingProduct._id,
                        title: productData.title || '',
                        price: priceString || '价格待获取',
                        images: productData.images || [],
                        seller: productData.seller || '',
                        description: productData.description || '',
                        specifications: productData.attributes || productData.featureAttributes || {},
                        source: matchingProduct.ozonProductData ? 'ozon' as const : '1688' as const
                      }
                    }
                  }
                  
                  // 如果没找到匹配的，使用最新的商品数据
                  const latestProduct = productsData.data.products[0]
                  const productData = latestProduct.ozonProductData || latestProduct.productData
                  
                  if (productData) {
                      console.log('使用最新的商品数据:', latestProduct)
                      
                      // 处理价格字段 - 如果是对象则转换为字符串
                      let priceString = ''
                      if (productData.price) {
                        if (typeof productData.price === 'object' && 'current' in productData.price) {
                          // 处理 OzonPrice 对象
                          const priceObj = productData.price as { current?: string; currency?: string; original?: string }
                          priceString = `${priceObj.current || ''} ${priceObj.currency || ''}`
                          if (priceObj.original && priceObj.original !== priceObj.current) {
                            priceString += ` (原价: ${priceObj.original})`
                          }
                        } else if (typeof productData.price === 'string') {
                          priceString = productData.price
                        } else {
                          priceString = String(productData.price)
                        }
                      }
                      
                      return {
                        id: productData.productId || latestProduct._id,
                        title: productData.title || '',
                        price: priceString || '价格待获取',
                        images: productData.images || [],
                        seller: productData.seller || '',
                        description: productData.description || '',
                        specifications: productData.attributes || productData.featureAttributes || {},
                        source: latestProduct.ozonProductData ? 'ozon' as const : '1688' as const
                      }
                    }
                }
              } else {
                console.error('Products API 请求失败:', productsResponse.status, productsResponse.statusText)
              }
            } catch (error) {
              console.error('获取商品数据失败:', error)
            }
            
            // 如果无法获取商品数据，创建基础信息
            console.log('未找到商品数据，创建基础产品信息')
            return {
              id: url,
              title: `Ozon商品 - ${new Date().toLocaleString()}`,
              price: '价格待获取',
              images: [],
              seller: 'Ozon',
              description: `商品链接: ${url}\n任务结果: ${result?.message || '任务已完成'}`,
              specifications: result?.url ? { '原始链接': result.url } : {},
              source: 'ozon' as const
            }
          }
          
          // 处理任务失败
          if (task.status === 'failed') {
            throw new Error(task.errorMessage || '任务处理失败')
          }
          
          // 任务仍在处理中，继续轮询
          attempts++
          
        } catch (error) {
          console.error(`轮询第${attempts + 1}次时出错:`, error)
          attempts++
          
          // 如果是网络错误，稍微延长等待时间
          if (error instanceof TypeError && error.message.includes('fetch')) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      
      throw new Error(`任务处理超时 (${maxAttempts * pollInterval / 1000}秒)，请稍后重试`)
    }

    return await pollTask()
    
  } catch (error) {
    console.error('获取Ozon商品信息失败:', error)
    throw error
  }
}

const search1688Products = async (keyword: string): Promise<ProductInfo[]> => {
  try {
    console.log('Searching 1688 products with keyword:', keyword)
    
    // 1. 翻译关键词为中文
    const chineseKeyword = await translateToChineseAPI(keyword)
    console.log('Translated keyword:', chineseKeyword)
    
    // 2. 构造1688搜索URL，参考products页面的实现
    const encodedKeyword = encodeURIComponent(chineseKeyword.trim())
    const searchUrl = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodedKeyword}&spm=a260k.home2025.searchbox.0&beginPage=1&charset=utf-8`
    
    console.log('1688搜索URL:', searchUrl)

    // 3. 创建搜索任务
    const taskResponse = await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        type: 'search_1688',
        title: `1688关键词搜索任务 - ${chineseKeyword}`,
        description: `搜索关键词: ${chineseKeyword} (原文: ${keyword})`,
        url: searchUrl 
      }),
    })

    if (!taskResponse.ok) {
      throw new Error(`创建搜索任务失败: ${taskResponse.status}`)
    }

    const taskData = await taskResponse.json()
    
    if (!taskData.success) {
      throw new Error(taskData.message || '创建搜索任务失败')
    }

    // 4. 优化的轮询逻辑
    const taskId = taskData.data._id
    const pollSearchTask = async (): Promise<ProductInfo[]> => {
      let attempts = 0
      const maxAttempts = 30 // 最多等待30次
      const pollInterval = 2000 // 2秒轮询间隔
      
      while (attempts < maxAttempts) {
        try {
          // 使用渐进式延迟
          const delay = Math.min(pollInterval + (attempts * 200), 5000)
          await new Promise(resolve => setTimeout(resolve, delay))
          
          // 获取任务状态
          const statusResponse = await fetch(`http://localhost:3001/api/tasks/${taskId}`)
          
          if (!statusResponse.ok) {
            console.warn(`获取搜索任务状态失败: ${statusResponse.status}`)
            attempts++
            continue
          }

          const statusData = await statusResponse.json()
          
          if (!statusData.success) {
            console.warn('搜索任务状态响应格式错误:', statusData)
            attempts++
            continue
          }

          const task = statusData.data
          console.log(`搜索任务状态检查 (${attempts + 1}/${maxAttempts}):`, {
            status: task.status,
            progress: task.progress,
            hasResult: !!task.result
          })

          // 处理任务完成
          if (task.status === 'completed') {
            console.log('搜索任务已完成，开始获取搜索结果和产品数据...')
            
            // 等待一小段时间，确保数据已经保存到数据库
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            try {
              // 1. 首先获取搜索结果（包含产品链接）
              console.log('正在获取1688搜索结果...')
              const searchResultsResponse = await fetch(`http://localhost:3001/api/search-1688/by-keyword/${encodeURIComponent(chineseKeyword)}`)
              
              if (!searchResultsResponse.ok) {
                console.warn('获取搜索结果失败:', searchResultsResponse.status)
                return []
              }

              const searchResultsData = await searchResultsResponse.json()
              console.log('搜索结果API响应:', searchResultsData)
              
              if (!searchResultsData.success || !searchResultsData.data || searchResultsData.data.length === 0) {
                console.log('未找到搜索结果')
                return []
              }

              // 获取最新的搜索结果
              const latestSearchResult = searchResultsData.data[0]
              const searchData = latestSearchResult.searchData
              
              if (!searchData || !searchData.products || searchData.products.length === 0) {
                console.log('搜索结果中没有产品链接')
                return []
              }

              console.log(`找到 ${searchData.products.length} 个产品链接`)

              // 2. 获取所有产品数据，用于匹配
              console.log('正在获取产品数据库中的产品...')
              const productsResponse = await fetch('http://localhost:3001/api/products?limit=100')
              
              if (!productsResponse.ok) {
                console.warn('获取产品数据失败:', productsResponse.status)
                return []
              }

              const productsData = await productsResponse.json()
              console.log('产品数据API响应:', productsData)
              
              if (!productsData.success || !productsData.data.products) {
                console.log('未找到产品数据')
                return []
              }

              // 3. 通过关键词模糊匹配搜索结果和产品数据
              const matchedProducts: ProductInfo[] = []
              
              // 关键词包含匹配函数
              const containsKeyword = (title: string, keyword: string): boolean => {
                if (!title || !keyword) return false
                
                const normalizeTitle = title.toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, '')
                const normalizeKeyword = keyword.toLowerCase().replace(/[^\w\u4e00-\u9fff]/g, '')
                
                // 检查标题是否包含关键词中的任何字符
                for (const char of normalizeKeyword) {
                  if (normalizeTitle.includes(char)) {
                    return true
                  }
                }
                
                return false
              }
              
              // 从搜索关键词中提取关键词
              const searchKeywords = chineseKeyword
              
              console.log(`开始关键词匹配，搜索关键词: ${chineseKeyword}`)
              
              // 遍历产品列表进行匹配
              for (const product of productsData.data.products) {
                if (!product.productData || !product.productData.title) continue
                
                // 检查标题是否包含关键词
                const isMatch = containsKeyword(product.productData.title, searchKeywords)
                
                console.log(`产品匹配检查: "${product.productData.title}" vs "${searchKeywords}" => ${isMatch ? '匹配成功' : '不匹配'}`)
                
                if (isMatch) {
                  console.log(`✅ 匹配成功: ${product.productData.title}`)
                  const productData = product.productData
                  
                  // 处理价格字段
                  let priceString = ''
                  if (productData.price) {
                    priceString = typeof productData.price === 'string' ? productData.price : String(productData.price)
                  }
                  
                  matchedProducts.push({
                     id: productData.productId || product._id,
                     title: productData.title || '',
                     price: priceString || '价格待获取',
                     images: productData.images?.map((img: { fullPathImageURI?: string; imageURI?: string; url?: string; src?: string }) => 
                       img.fullPathImageURI || img.imageURI || img.url || img.src || ''
                     ).filter(Boolean) || [],
                     seller: productData.seller || '',
                     description: typeof productData.description === 'string' 
                       ? productData.description 
                       : JSON.stringify(productData.description || ''),
                     specifications: productData.featureAttributes?.reduce((acc: Record<string, string>, attr: { name: string; value: string }) => {
                       acc[attr.name] = attr.value
                       return acc
                     }, {} as Record<string, string>) || {},
                     source: '1688' as const
                   })
                  
                  // 找到匹配的产品就停止搜索
                  if (matchedProducts.length >= 10) break
                }
              }
              
              console.log(`成功匹配 ${matchedProducts.length} 个产品`)
              return matchedProducts
              
            } catch (error) {
              console.error('获取和匹配产品数据失败:', error)
              return []
            }
          }
          
          // 处理任务失败
          if (task.status === 'failed') {
            throw new Error(task.errorMessage || '搜索任务处理失败')
          }
          
          // 任务仍在处理中，继续轮询
          attempts++
          
        } catch (error) {
          console.error(`搜索轮询第${attempts + 1}次时出错:`, error)
          attempts++
          
          // 如果是网络错误，稍微延长等待时间
          if (error instanceof TypeError && error.message.includes('fetch')) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }
      
      throw new Error(`搜索任务处理超时 (${maxAttempts * pollInterval / 1000}秒)，请稍后重试`)
    }

    return await pollSearchTask()
    
  } catch (error) {
    console.error('搜索1688商品失败:', error)
    // 发生错误时返回空数组，而不是抛出异常
    return []
  }
}

const generateNewProduct = async (ozonProduct: ProductInfo, similarProducts: ProductInfo[]): Promise<GeneratedProduct | null> => {
  // TODO: 实现基于Ozon商品和1688搜索结果生成新商品信息的逻辑
  console.log('Generating new product based on:', ozonProduct, similarProducts)
  return null
}

// 商品卡片组件
const ProductCard = ({ product, title }: { product: ProductInfo | null, title: string }) => {
  if (!product) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            暂无商品信息
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>
          <Badge variant={product.source === 'ozon' ? 'default' : 'secondary'}>
            {product.source === 'ozon' ? 'Ozon' : '1688'}
          </Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 商品图片 */}
        {product.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                <img
                  src={image}
                  alt={`商品图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* 商品信息 */}
        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2">{product.title}</h3>
          <div className="text-lg font-bold text-primary">{product.price}</div>
          <div className="text-sm text-muted-foreground">卖家: {product.seller}</div>
        </div>

        {/* 商品描述 */}
        {product.description && (
          <div className="text-sm text-muted-foreground line-clamp-3">
            {product.description}
          </div>
        )}

        {/* 规格信息 */}
        {Object.keys(product.specifications).length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">规格信息</h4>
            <div className="space-y-1">
              {Object.entries(product.specifications).slice(0, 3).map(([key, value]) => (
                <div key={key} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{key}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// 1688搜索结果列表组件
const SearchResultsList = ({ products }: { products: ProductInfo[] }) => {
  if (products.length === 0) {
    return (
      <Card className="h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            1688搜索结果
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center py-12 text-muted-foreground">
            暂无搜索结果
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          1688搜索结果 ({products.length}个)
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <div className="space-y-4 h-full overflow-y-auto">
          {products.map((product, index) => (
            <div key={product.id || index} className="border rounded-lg p-3 space-y-2">
              <div className="flex gap-3">
                {product.images[0] && (
                  <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                    <img
                      src={product.images[0]}
                      alt="商品图片"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{product.title}</h4>
                  <div className="text-sm font-bold text-primary">{product.price}</div>
                  <div className="text-xs text-muted-foreground">{product.seller}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 生成的新商品信息组件
const GeneratedProductCard = ({ product }: { product: GeneratedProduct | null }) => {
  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            生成的新商品信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            请先输入Ozon商品链接并搜索1688商品
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          生成的新商品信息
        </CardTitle>
        <CardDescription>
          基于Ozon商品和1688搜索结果智能生成
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 商品图片 */}
        {product.images.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(0, 6).map((image, index) => (
              <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                <img
                  src={image}
                  alt={`生成商品图片 ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 商品信息 */}
        <div className="space-y-2">
          <h3 className="font-medium">{product.title}</h3>
          <div className="text-lg font-bold text-primary">{product.price}</div>
        </div>

        {/* 商品描述 */}
        <div className="text-sm text-muted-foreground">
          {product.description}
        </div>

        {/* 标签 */}
        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <Badge key={index} variant="outline">{tag}</Badge>
            ))}
          </div>
        )}

        {/* 规格信息 */}
        {Object.keys(product.specifications).length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">规格信息</h4>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-muted-foreground">{key}:</span>
                  <span className="ml-1">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function OperationPage() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [ozonProduct, setOzonProduct] = useState<ProductInfo | null>(null)
  const [searchResults, setSearchResults] = useState<ProductInfo[]>([])
  const [generatedProduct, setGeneratedProduct] = useState<GeneratedProduct | null>(null)
  const [error, setError] = useState('')
  const [processingStep, setProcessingStep] = useState('')

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('请输入有效的商品链接')
      return
    }

    // 验证URL格式
    try {
      new URL(url)
    } catch {
      setError('请输入有效的URL格式')
      return
    }

    // 检查是否为Ozon链接
    if (!url.includes('ozon.ru')) {
      setError('请输入有效的Ozon商品链接')
      return
    }

    setLoading(true)
    setError('')
    setOzonProduct(null)
    setSearchResults([])
    setGeneratedProduct(null)
    
    try {
      // 1. 从Ozon获取商品信息
      setProcessingStep('正在获取Ozon商品信息...')
      const ozonData = await fetchOzonProduct(url)
      if (!ozonData) {
        throw new Error('无法获取Ozon商品信息，请检查链接是否正确')
      }
      setOzonProduct(ozonData)

      // 2. 提取关键词并在1688搜索
      setProcessingStep('正在1688搜索相似商品...')
      const keyword = ozonData.title.split(' ').slice(0, 3).join(' ') // 简单的关键词提取
      const searchData = await search1688Products(keyword)
      setSearchResults(searchData)

      // 3. 生成新商品信息
      if (searchData.length > 0) {
        setProcessingStep('正在生成新商品信息...')
        const generated = await generateNewProduct(ozonData, searchData)
        setGeneratedProduct(generated)
      }

      setProcessingStep('处理完成！')

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '处理过程中发生未知错误'
      setError(errorMessage)
      console.error('Operation error:', err)
    } finally {
      setLoading(false)
      setProcessingStep('')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">商品信息处理</h1>
        <p className="text-muted-foreground">
          输入Ozon商品链接，自动获取商品信息并在1688搜索相似商品，生成新的商品信息
        </p>
      </div>

      {/* 输入区域 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            商品链接输入
          </CardTitle>
          <CardDescription>
            请输入Ozon商品页面的完整URL链接
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="https://www.ozon.ru/product/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !url.trim()}
              className="min-w-[100px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  开始处理
                </>
              )}
            </Button>
          </div>
          
          {/* 处理步骤提示 */}
          {loading && processingStep && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                <p className="text-blue-700 text-sm">{processingStep}</p>
              </div>
            </div>
          )}
          
          {/* 错误信息 */}
          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive text-sm font-medium">错误：{error}</p>
              <p className="text-destructive/80 text-xs mt-1">
                请检查网络连接和链接有效性，或稍后重试
              </p>
            </div>
          )}

          {/* 成功提示 */}
          {!loading && ozonProduct && !error && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-700 text-sm font-medium">✓ 商品信息获取成功</p>
              <p className="text-green-600 text-xs mt-1">
                已获取Ozon商品信息{searchResults.length > 0 ? `并找到${searchResults.length}个相似商品` : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 商品信息展示区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProductCard product={ozonProduct} title="Ozon商品信息" />
        <SearchResultsList products={searchResults} />
      </div>

      {/* 生成的新商品信息 */}
      <GeneratedProductCard product={generatedProduct} />
    </div>
  )
}