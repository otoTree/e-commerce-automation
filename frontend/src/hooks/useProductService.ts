/**
 * 产品服务Hook
 * 提供产品相关的状态管理和API调用
 * 遵循函数式编程原则
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { 
  productService, 
  Product, 
  ProductQueryParams, 
  CreateProductData, 
  UpdateProductData 
} from '@/services/productService'

interface UseProductServiceState {
  products: Product[]
  currentProduct: Product | null
  loading: boolean
  error: string | null
  pagination: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  } | null
}

interface UseProductServiceActions {
  loadProducts: (params?: ProductQueryParams) => Promise<void>
  loadProduct: (id: string) => Promise<void>
  createProduct: (data: CreateProductData) => Promise<Product>
  updateProduct: (data: UpdateProductData) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  deleteProducts: (ids: string[]) => Promise<void>
  updateProductStatus: (id: string, status: Product['status']) => Promise<void>
  searchProducts: (query: string, filters?: Omit<ProductQueryParams, 'search'>) => Promise<void>
  refreshProducts: () => Promise<void>
  clearError: () => void
  clearCurrentProduct: () => void
}

interface UseProductServiceReturn extends UseProductServiceState, UseProductServiceActions {
  isLoading: (operation?: string) => boolean
}

export const useProductService = (): UseProductServiceReturn => {
  // 状态管理
  const [state, setState] = useState<UseProductServiceState>({
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
    pagination: null
  })

  // 操作状态管理
  const [operationStates, setOperationStates] = useState<Record<string, boolean>>({})
  
  // 缓存和取消控制
  const abortControllerRef = useRef<AbortController | null>(null)
  const lastParamsRef = useRef<ProductQueryParams | undefined>()

  // 设置操作加载状态
  const setOperationLoading = useCallback((operation: string, loading: boolean) => {
    setOperationStates(prev => ({
      ...prev,
      [operation]: loading
    }))
  }, [])

  // 检查是否有操作正在加载
  const isLoading = useCallback((operation?: string) => {
    if (operation) {
      return operationStates[operation] || false
    }
    return state.loading || Object.values(operationStates).some(Boolean)
  }, [state.loading, operationStates])

  // 更新状态的辅助函数
  const updateState = useCallback((updates: Partial<UseProductServiceState> | ((prev: UseProductServiceState) => Partial<UseProductServiceState>)) => {
    if (typeof updates === 'function') {
      setState(prev => ({ ...prev, ...updates(prev) }))
    } else {
      setState(prev => ({ ...prev, ...updates }))
    }
  }, [])

  // 错误处理
  const handleError = useCallback((error: unknown, operation: string) => {
    const errorMessage = error instanceof Error ? error.message : `${operation}失败`
    updateState({ error: errorMessage })
    console.error(`${operation} error:`, error)
  }, [updateState])

  // 清除错误
  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  // 清除当前产品
  const clearCurrentProduct = useCallback(() => {
    updateState({ currentProduct: null })
  }, [updateState])

  // 加载产品列表
  const loadProducts = useCallback(async (params?: ProductQueryParams) => {
    try {
      setOperationLoading('loadProducts', true)
      clearError()
      
      // 取消之前的请求
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      const result = await productService.getProducts(params)
      
      updateState({
        products: result.products,
        pagination: result.pagination || null
      })
      
      // 保存参数用于刷新
      lastParamsRef.current = params
      
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        handleError(error, '加载产品列表')
      }
    } finally {
      setOperationLoading('loadProducts', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 加载单个产品
  const loadProduct = useCallback(async (id: string) => {
    try {
      setOperationLoading('loadProduct', true)
      clearError()

      const product = await productService.getProduct(id)
      updateState({ currentProduct: product })
      
    } catch (error) {
      handleError(error, '加载产品详情')
    } finally {
      setOperationLoading('loadProduct', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 创建产品
  const createProduct = useCallback(async (data: CreateProductData): Promise<Product> => {
    try {
      setOperationLoading('createProduct', true)
      clearError()

      const newProduct = await productService.createProduct(data)
      
      // 更新产品列表
      setState(prev => ({
        ...prev,
        products: [newProduct, ...prev.products]
      }))
      
      return newProduct
      
    } catch (error) {
      handleError(error, '创建产品')
      throw error
    } finally {
      setOperationLoading('createProduct', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 更新产品
  const updateProduct = useCallback(async (data: UpdateProductData): Promise<Product> => {
    try {
      setOperationLoading('updateProduct', true)
      clearError()

      const updatedProduct = await productService.updateProduct(data)
      
      // 更新产品列表中的对应项
      setState(prev => ({
        ...prev,
        products: prev.products.map((p: Product) => p.id === updatedProduct.id ? updatedProduct : p),
        currentProduct: prev.currentProduct?.id === updatedProduct.id ? updatedProduct : prev.currentProduct
      }))
      
      return updatedProduct
      
    } catch (error) {
      handleError(error, '更新产品')
      throw error
    } finally {
      setOperationLoading('updateProduct', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 删除产品
  const deleteProduct = useCallback(async (id: string) => {
    try {
      setOperationLoading('deleteProduct', true)
      clearError()

      await productService.deleteProduct(id)
      
      // 从产品列表中移除
      setState(prev => ({
        ...prev,
        products: prev.products.filter((p: Product) => p.id !== id),
        currentProduct: prev.currentProduct?.id === id ? null : prev.currentProduct
      }))
      
    } catch (error) {
      handleError(error, '删除产品')
      throw error
    } finally {
      setOperationLoading('deleteProduct', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 批量删除产品
  const deleteProducts = useCallback(async (ids: string[]) => {
    try {
      setOperationLoading('deleteProducts', true)
      clearError()

      await productService.deleteProducts(ids)
      
      // 从产品列表中移除
      setState(prev => ({
        ...prev,
        products: prev.products.filter((p: Product) => !ids.includes(p.id)),
        currentProduct: prev.currentProduct && ids.includes(prev.currentProduct.id) ? null : prev.currentProduct
      }))
      
    } catch (error) {
      handleError(error, '批量删除产品')
      throw error
    } finally {
      setOperationLoading('deleteProducts', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 更新产品状态
  const updateProductStatus = useCallback(async (id: string, status: Product['status']) => {
    try {
      setOperationLoading('updateProductStatus', true)
      clearError()

      const updatedProduct = await productService.updateProductStatus(id, status)
      
      // 更新产品列表中的对应项
      setState(prev => ({
        ...prev,
        products: prev.products.map((p: Product) => p.id === id ? updatedProduct : p),
        currentProduct: prev.currentProduct?.id === id ? updatedProduct : prev.currentProduct
      }))
      
    } catch (error) {
      handleError(error, '更新产品状态')
      throw error
    } finally {
      setOperationLoading('updateProductStatus', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 搜索产品
  const searchProducts = useCallback(async (query: string, filters?: Omit<ProductQueryParams, 'search'>) => {
    try {
      setOperationLoading('searchProducts', true)
      clearError()

      const result = await productService.searchProducts(query, filters)
      
      updateState({
        products: result.products,
        pagination: result.pagination || null
      })
      
      // 保存参数用于刷新
      lastParamsRef.current = { ...filters, search: query }
      
    } catch (error) {
      handleError(error, '搜索产品')
    } finally {
      setOperationLoading('searchProducts', false)
    }
  }, [setOperationLoading, clearError, updateState, handleError])

  // 刷新产品列表
  const refreshProducts = useCallback(async () => {
    await loadProducts(lastParamsRef.current)
  }, [loadProducts])

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return {
    // 状态
    ...state,
    
    // 操作
    loadProducts,
    loadProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteProducts,
    updateProductStatus,
    searchProducts,
    refreshProducts,
    clearError,
    clearCurrentProduct,
    
    // 工具函数
    isLoading
  }
}