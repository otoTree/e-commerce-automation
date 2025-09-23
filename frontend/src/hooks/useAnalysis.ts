import { useState, useCallback } from 'react'
import { api } from '@/lib/api-client'

// 分析选项接口
interface AnalysisOptions {
  include_market_heat?: boolean
  include_profit_analysis?: boolean
  include_competitiveness?: boolean
}

// 分析结果接口
interface AnalysisResult {
  id: string
  productId: string
  productTitle: string
  marketHeat: {
    score: number
    trend: 'up' | 'down' | 'stable'
    searchVolume: number
    competitorCount: number
  }
  profitAnalysis: {
    estimatedProfit: number
    profitMargin: number
    breakEvenPoint: number
    roi: number
  }
  competitiveness: {
    score: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
  }
  status: 'pending' | 'processing' | 'completed' | 'failed'
  createdAt: string
  updatedAt: string
}

// 市场热度数据接口
interface MarketHeatData {
  score: number
  trend: 'up' | 'down' | 'stable'
  searchVolume: number
  competitorCount: number
  keywords: string[]
  trendData: Array<{
    date: string
    value: number
  }>
}

// 分析任务接口
interface AnalysisTask {
  id: string
  productId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: string
  updatedAt: string
  error?: string
}

// 分析统计接口
interface AnalysisStatistics {
  totalAnalyses: number
  completedAnalyses: number
  pendingAnalyses: number
  failedAnalyses: number
  averageProcessingTime: number
  analysisTypes: Record<string, number>
}

// API响应接口
interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  task_id?: string
  analysis?: T
  error?: string
  message?: string
}

// 批量分析请求接口
interface BatchAnalysisRequest {
  product_ids: string[]
  analysis_options?: AnalysisOptions
}

// 后端分析结果接口
interface BackendAnalysisResult {
  _id?: string
  id?: string
  product_id: string
  product_title?: string
  market_heat?: {
    current_heat_score: number
    heat_trend: 'rising' | 'stable' | 'declining'
    heat_factors?: {
      search_volume_trend: number
    }
  }
  deep_analysis?: {
    competitiveness?: {
      score: number
      insights: string[]
    }
    profit_potential?: {
      estimated_margin: number
      roi_projection: number
    }
  }
  overall_assessment?: {
    key_reasons: string[]
  }
  analysis_meta?: {
    analyzed_at: string
  }
}

// 后端API响应接口
interface BackendApiResponse {
  success: boolean
  analysis?: BackendAnalysisResult
  error?: string
}

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 通用请求处理函数
  const makeRequest = useCallback(async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> => {
    try {
      setError(null)
      
      let response
      switch (method) {
        case 'GET':
          response = await api.get<T>(endpoint)
          break
        case 'POST':
          response = await api.post<T>(endpoint, body)
          break
        case 'PUT':
          response = await api.put<T>(endpoint, body)
          break
        case 'DELETE':
          response = await api.delete<T>(endpoint)
          break
      }

      if (!response.success && response.error) {
        throw new Error(response.error)
      }

      return response.data || response as T
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '请求失败'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  }, [])

  // 分析产品
  const analyzeProduct = useCallback(async (
    productId: string,
    options?: AnalysisOptions
  ): Promise<{ task_id: string }> => {
    setLoading(true)
    try {
      const response = await makeRequest<ApiResponse<{ task_id: string }>>(
        `/analysis/products/${productId}/analyze`,
        'POST',
        { analysis_options: options }
      )
      
      return { task_id: response.task_id || '' }
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取分析结果
  const getAnalysisResult = useCallback(async (
    productId: string
  ): Promise<AnalysisResult | null> => {
    setLoading(true)
    try {
      const response = await makeRequest<BackendApiResponse>(
        `/analysis/products/${productId}/analysis`
      )
      
      // 后端返回的数据结构是 { success: true, analysis: {...} }
      if (response.success && response.analysis) {
        // 转换后端数据格式为前端期望的格式
        const backendData = response.analysis
        const analysisResult: AnalysisResult = {
          id: backendData._id || backendData.id || '',
          productId: backendData.product_id || productId,
          productTitle: backendData.product_title || '未知商品',
          marketHeat: {
            score: backendData.market_heat?.current_heat_score || 0,
            trend: backendData.market_heat?.heat_trend === 'rising' ? 'up' : 
                   backendData.market_heat?.heat_trend === 'declining' ? 'down' : 'stable',
            searchVolume: backendData.market_heat?.heat_factors?.search_volume_trend || 0,
            competitorCount: 0
          },
          profitAnalysis: {
            estimatedProfit: backendData.deep_analysis?.profit_potential?.estimated_margin || 0,
            profitMargin: backendData.deep_analysis?.profit_potential?.estimated_margin || 0,
            breakEvenPoint: 0,
            roi: backendData.deep_analysis?.profit_potential?.roi_projection || 0
          },
          competitiveness: {
            score: backendData.deep_analysis?.competitiveness?.score || 0,
            strengths: backendData.deep_analysis?.competitiveness?.insights || [],
            weaknesses: [],
            recommendations: backendData.overall_assessment?.key_reasons || []
          },
          createdAt: backendData.analysis_meta?.analyzed_at || new Date().toISOString(),
          updatedAt: backendData.analysis_meta?.analyzed_at || new Date().toISOString(),
          status: 'completed'
        }
        return analysisResult
      }
      
      return null
    } catch (error) {
      // 如果是404错误，返回null而不是抛出错误
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取市场热度数据
  const getMarketHeatData = useCallback(async (
    productId: string
  ): Promise<MarketHeatData | null> => {
    setLoading(true)
    try {
      const response = await makeRequest<ApiResponse<MarketHeatData>>(
        `/analysis/products/${productId}/market-heat`
      )
      
      return response.data || null
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 批量分析产品
  const batchAnalyze = useCallback(async (
    request: BatchAnalysisRequest
  ): Promise<{ task_ids: string[] }> => {
    setLoading(true)
    try {
      const response = await makeRequest<ApiResponse<{ task_ids: string[] }>>(
        '/analysis/products/batch-analysis',
        'POST',
        request
      )
      
      return response.data || { task_ids: [] }
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取所有分析结果
  const getAnalysisResults = useCallback(async (params?: {
    page?: number
    pageSize?: number
    status?: string
    productId?: string
  }): Promise<{
    results: AnalysisResult[]
    total: number
    page: number
    pageSize: number
  }> => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
      if (params?.status) searchParams.append('status', params.status)
      if (params?.productId) searchParams.append('productId', params.productId)

      const url = `/analysis/results${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      
      const response = await makeRequest<ApiResponse<{
        results: AnalysisResult[]
        total: number
        page: number
        pageSize: number
      }>>(url)
      
      return response.data || { results: [], total: 0, page: 1, pageSize: 10 }
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取分析任务
  const getAnalysisTasks = useCallback(async (params?: {
    page?: number
    pageSize?: number
    status?: string
  }): Promise<{
    tasks: AnalysisTask[]
    total: number
    page: number
    pageSize: number
  }> => {
    setLoading(true)
    try {
      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.append('page', params.page.toString())
      if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString())
      if (params?.status) searchParams.append('status', params.status)

      const url = `/analysis/tasks${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
      
      const response = await makeRequest<ApiResponse<{
        tasks: AnalysisTask[]
        total: number
        page: number
        pageSize: number
      }>>(url)
      
      return response.data || { tasks: [], total: 0, page: 1, pageSize: 10 }
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取分析统计
  const getAnalysisStatistics = useCallback(async (): Promise<AnalysisStatistics | null> => {
    setLoading(true)
    try {
      const response = await makeRequest<ApiResponse<AnalysisStatistics>>(
        '/analysis/statistics'
      )
      
      return response.data || null
    } finally {
      setLoading(false)
    }
  }, [makeRequest])

  // 获取任务状态
  const getTaskStatus = useCallback(async (taskId: string): Promise<{
    id: string
    status: 'pending' | 'running' | 'completed' | 'failed'
    progress: number
    errorMessage?: string
  } | null> => {
    try {
      const response = await makeRequest<ApiResponse<{
        id: string
        status: 'pending' | 'running' | 'completed' | 'failed'
        progress: number
        errorMessage?: string
      }>>(`/tasks/${taskId}`)
      
      return response.data || null
    } catch (error) {
      console.error('获取任务状态失败:', error)
      return null
    }
  }, [makeRequest])

  return {
    // 状态
    loading,
    error,
    
    // 方法
    analyzeProduct,
    getAnalysisResult,
    getMarketHeatData,
    batchAnalyze,
    getAnalysisResults,
    getAnalysisTasks,
    getAnalysisStatistics,
    getTaskStatus,
    
    // 清除错误
    clearError: () => setError(null)
  }
}

// 导出类型
export type {
  AnalysisOptions,
  AnalysisResult,
  MarketHeatData,
  AnalysisTask,
  AnalysisStatistics,
  BatchAnalysisRequest,
}