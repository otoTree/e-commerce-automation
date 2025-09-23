import { useState, useCallback, useRef } from 'react'
import { api } from '@/lib/api-client'

interface ProductData {
  // 定义产品数据接口
  [key: string]: unknown
}

export const useProducts = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // 请求缓存和取消控制
  const requestCacheRef = useRef<Map<string, Promise<unknown>>>(new Map())
  const abortControllerRef = useRef<AbortController | null>(null)
  
  // 生成缓存键
  const generateCacheKey = useCallback((endpoint: string, params?: Record<string, unknown>) => {
    return `${endpoint}${params ? JSON.stringify(params) : ''}`
  }, [])
  
  // 清理函数
  const cleanup = useCallback(() => {
    // 取消正在进行的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    // 清理缓存
    requestCacheRef.current.clear()
  }, [])

  // 改进的加载状态管理
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  
  const setOperationLoading = useCallback((operation: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [operation]: isLoading
    }))
  }, [])

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(Boolean) || loading
  }, [loadingStates, loading])

  const getProducts = useCallback(async (params?: Record<string, unknown>) => {
    const cacheKey = generateCacheKey('/products', params)
    
    // 检查缓存
    if (requestCacheRef.current.has(cacheKey)) {
      return requestCacheRef.current.get(cacheKey)
    }
    
    const requestPromise = (async () => {
      try {
        setOperationLoading('getProducts', true)
        setError(null)
        
        const queryParams = new URLSearchParams()
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              queryParams.append(key, String(value))
            }
          })
        }
        
        const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        const response = await api.get(endpoint)
        
        if (!response.success) {
          throw new Error(response.error || '获取产品列表失败')
        }
        
        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取产品列表失败'
        setError(errorMessage)
        throw err
      } finally {
        setOperationLoading('getProducts', false)
        requestCacheRef.current.delete(cacheKey)
      }
    })()
    
    requestCacheRef.current.set(cacheKey, requestPromise)
    return requestPromise
  }, [generateCacheKey, setOperationLoading])

  const getProduct = useCallback(async (id: string) => {
    const cacheKey = generateCacheKey(`/products/${id}`)
    
    if (requestCacheRef.current.has(cacheKey)) {
      return requestCacheRef.current.get(cacheKey)
    }
    
    const requestPromise = (async () => {
      try {
        setOperationLoading('getProduct', true)
        setError(null)
        
        const response = await api.get(`/products/${id}`)
        
        if (!response.success) {
          throw new Error(response.error || '获取产品详情失败')
        }
        
        return response.data
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '获取产品详情失败'
        setError(errorMessage)
        throw err
      } finally {
        setOperationLoading('getProduct', false)
        requestCacheRef.current.delete(cacheKey)
      }
    })()
    
    requestCacheRef.current.set(cacheKey, requestPromise)
    return requestPromise
  }, [generateCacheKey, setOperationLoading])

  const createProduct = useCallback(async (productData: ProductData) => {
    try {
      setOperationLoading('createProduct', true)
      setError(null)
      
      const response = await api.post('/products', productData)
      
      if (!response.success) {
        throw new Error(response.error || '创建产品失败')
      }
      
      // 清理相关缓存
      requestCacheRef.current.clear()
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建产品失败'
      setError(errorMessage)
      throw err
    } finally {
      setOperationLoading('createProduct', false)
    }
  }, [setOperationLoading])

  const updateProduct = useCallback(async (id: string, productData: Partial<ProductData>) => {
    try {
      setOperationLoading('updateProduct', true)
      setError(null)
      
      const response = await api.put(`/products/${id}`, productData)
      
      if (!response.success) {
        throw new Error(response.error || '更新产品失败')
      }
      
      // 清理相关缓存
      requestCacheRef.current.clear()
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新产品失败'
      setError(errorMessage)
      throw err
    } finally {
      setOperationLoading('updateProduct', false)
    }
  }, [setOperationLoading])

  const deleteProduct = useCallback(async (id: string) => {
    try {
      setOperationLoading('deleteProduct', true)
      setError(null)
      
      const response = await api.delete(`/products/${id}`)
      
      if (!response.success) {
        throw new Error(response.error || '删除产品失败')
      }
      
      // 清理相关缓存
      requestCacheRef.current.clear()
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除产品失败'
      setError(errorMessage)
      throw err
    } finally {
      setOperationLoading('deleteProduct', false)
    }
  }, [setOperationLoading])

  const searchProducts = useCallback(async (query: string, filters?: Record<string, unknown>) => {
    try {
      setOperationLoading('searchProducts', true)
      setError(null)
      
      const searchParams = { query, ...filters }
      const queryParams = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
      
      const response = await api.get(`/products/search?${queryParams.toString()}`)
      
      if (!response.success) {
        throw new Error(response.error || '搜索产品失败')
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '搜索产品失败'
      setError(errorMessage)
      throw err
    } finally {
      setOperationLoading('searchProducts', false)
    }
  }, [setOperationLoading])

  const getProductStats = useCallback(async () => {
    try {
      setOperationLoading('getStats', true)
      setError(null)
      
      const response = await api.get('/products/stats')
      
      if (!response.success) {
        throw new Error(response.error || '获取产品统计失败')
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取产品统计失败'
      setError(errorMessage)
      throw err
    } finally {
      setOperationLoading('getStats', false)
    }
  }, [setOperationLoading])

  return {
    // 状态
    loading: isAnyLoading(),
    error,
    loadingStates,
    
    // 方法
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductStats,
    
    // 工具方法
    cleanup,
    clearError: () => setError(null),
    isOperationLoading: (operation: string) => loadingStates[operation] || false
  }
}

export const useDataCollection = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const collectData = useCallback(async (url: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.post('/data-collection/collect', { url })
      
      if (!response.success) {
        throw new Error(response.error || '数据采集失败')
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '数据采集失败'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getCollectionStatus = useCallback(async (taskId: string) => {
    try {
      const response = await api.get(`/data-collection/status/${taskId}`)
      
      if (!response.success) {
        throw new Error(response.error || '获取采集状态失败')
      }
      
      return response.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取采集状态失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  return {
    loading,
    error,
    collectData,
    getCollectionStatus,
    clearError: () => setError(null)
  }
}