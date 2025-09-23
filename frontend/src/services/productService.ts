/**
 * 产品服务层
 * 负责所有与产品相关的API调用
 * 遵循函数式编程和DDD原则
 */

import { api } from '@/lib/api-client'

// 产品相关类型定义
export interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  currency: string
  description: string
  images: string[]
  category: string
  brand?: string
  sku?: string
  stock?: number
  status: 'active' | 'inactive' | 'draft'
  platform: string
  sourceUrl?: string
  createdAt: string
  updatedAt: string
}

export interface BackendProduct {
  _id: string
  platform: string
  platform_product_id: string
  basic_info: {
    title: string
    description: string
    category: string
    brand?: string
    images: string[]
    specifications?: Record<string, unknown>
  }
  pricing: {
    current_price: number
    original_price?: number
    currency: string
    price_history?: Array<{ price: number; date: string }>
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
  createdAt: string
  updatedAt: string
}

export interface ProductsResponse {
  products: BackendProduct[]
  pagination?: {
    current_page: number
    total_pages: number
    total_items: number
    items_per_page: number
  }
}

export interface ProductQueryParams {
  page?: number
  limit?: number
  search?: string
  category?: string
  status?: string
  platform?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CreateProductData {
  title: string
  price: number
  originalPrice?: number
  currency: string
  description: string
  images: string[]
  category: string
  brand?: string
  sku?: string
  stock?: number
  status: 'active' | 'inactive' | 'draft'
  platform: string
  sourceUrl?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: string
}

// 数据转换函数
export const transformBackendProduct = (backendProduct: BackendProduct): Product => ({
  id: backendProduct._id,
  title: backendProduct.basic_info?.title || '未知产品',
  price: backendProduct.pricing?.current_price || 0,
  originalPrice: backendProduct.pricing?.original_price,
  currency: backendProduct.pricing?.currency || 'CNY',
  description: backendProduct.basic_info?.description || '暂无描述',
  images: backendProduct.basic_info?.images || [],
  category: backendProduct.basic_info?.category || '未分类',
  brand: backendProduct.basic_info?.brand || backendProduct.supplier?.name || '未知品牌',
  sku: backendProduct.platform_product_id,
  stock: backendProduct.sales_data?.stock_quantity || 0,
  status: 'active' as const,
  platform: backendProduct.platform,
  sourceUrl: undefined,
  createdAt: backendProduct.createdAt,
  updatedAt: backendProduct.updatedAt
})

// 产品服务API
export const productService = {
  /**
   * 获取产品列表
   */
  getProducts: async (params?: ProductQueryParams): Promise<{ products: Product[]; pagination?: ProductsResponse['pagination'] }> => {
    const queryParams = new URLSearchParams()
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
    }
    
    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    const response = await api.get<ProductsResponse>(endpoint)
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '获取产品列表失败')
    }
    
    const transformedProducts = response.data.products.map(transformBackendProduct)
    
    return {
      products: transformedProducts,
      pagination: response.data.pagination
    }
  },

  /**
   * 获取单个产品详情
   */
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<BackendProduct>(`/products/${id}`)
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '获取产品详情失败')
    }
    
    return transformBackendProduct(response.data)
  },

  /**
   * 创建产品
   */
  createProduct: async (productData: CreateProductData): Promise<Product> => {
    const response = await api.post<BackendProduct>('/products', productData)
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '创建产品失败')
    }
    
    return transformBackendProduct(response.data)
  },

  /**
   * 更新产品
   */
  updateProduct: async (productData: UpdateProductData): Promise<Product> => {
    const { id, ...updateData } = productData
    const response = await api.put<BackendProduct>(`/products/${id}`, updateData)
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '更新产品失败')
    }
    
    return transformBackendProduct(response.data)
  },

  /**
   * 删除产品
   */
  deleteProduct: async (id: string): Promise<void> => {
    const response = await api.delete(`/products/${id}`)
    
    if (!response.success) {
      throw new Error(response.error || '删除产品失败')
    }
  },

  /**
   * 批量删除产品
   */
  deleteProducts: async (ids: string[]): Promise<void> => {
    const response = await api.post('/products/batch-delete', { ids })
    
    if (!response.success) {
      throw new Error(response.error || '批量删除产品失败')
    }
  },

  /**
   * 更新产品状态
   */
  updateProductStatus: async (id: string, status: Product['status']): Promise<Product> => {
    const response = await api.patch<BackendProduct>(`/products/${id}/status`, { status })
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '更新产品状态失败')
    }
    
    return transformBackendProduct(response.data)
  },

  /**
   * 搜索产品
   */
  searchProducts: async (query: string, filters?: Omit<ProductQueryParams, 'search'>): Promise<{ products: Product[]; pagination?: ProductsResponse['pagination'] }> => {
    return productService.getProducts({ ...filters, search: query })
  },

  /**
   * 获取产品统计信息
   */
  getProductStats: async (): Promise<{
    total: number
    active: number
    inactive: number
    draft: number
    categories: Record<string, number>
    platforms: Record<string, number>
  }> => {
    const response = await api.get<{
      total: number
      active: number
      inactive: number
      draft: number
      categories: Record<string, number>
      platforms: Record<string, number>
    }>('/products/stats')
    
    if (!response.success || !response.data) {
      throw new Error(response.error || '获取产品统计失败')
    }
    
    return response.data
  }
}