/**
 * 统一的API客户端配置
 * 基于axios提供标准化的HTTP请求方法和错误处理
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// 请求配置类型
export interface RequestConfig extends AxiosRequestConfig {
  retries?: number
  retryDelay?: number
}

// API客户端类
class ApiClient {
  private axiosInstance: AxiosInstance
  private defaultRetries: number = 3
  private defaultRetryDelay: number = 1000

  constructor(baseURL?: string) {
    const apiBaseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
    
    this.axiosInstance = axios.create({
      baseURL: apiBaseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // 请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // 可以在这里添加认证token等
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        // 统一错误处理
        if (error.response) {
          // 服务器响应了错误状态码
          const message = error.response.data?.message || error.response.statusText || '请求失败'
          
          // 对于404错误，提供更友好的错误信息
          if (error.response.status === 404) {
            throw new Error(`HTTP ${error.response.status}: 请求的资源不存在或服务暂时不可用`)
          }
          
          // 对于409冲突错误，提供更友好的错误信息
          if (error.response.status === 409) {
            throw new Error(`HTTP ${error.response.status}: ${message || '数据冲突，该资源已存在'}`)
          }
          
          throw new Error(`HTTP ${error.response.status}: ${message}`)
        } else if (error.request) {
          // 请求已发出但没有收到响应
          throw new Error('网络错误，请检查网络连接')
        } else {
          // 其他错误
          throw new Error(error.message || '请求失败')
        }
      }
    )
  }

  /**
   * 通用请求方法
   */
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      ...axiosConfig
    } = config

    let lastError: Error | null = null

    // 重试逻辑
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await this.axiosInstance.request<ApiResponse<T>>({
          url: endpoint,
          ...axiosConfig,
        })

        return response.data

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error')
        
        // 如果是最后一次尝试，或者是不可重试的错误，直接抛出
        if (attempt === retries || this.isNonRetryableError(lastError)) {
          break
        }

        // 等待后重试
        if (attempt < retries) {
          await this.delay(retryDelay * Math.pow(2, attempt)) // 指数退避
        }
      }
    }

    // 处理最终错误
    if (lastError) {
      throw lastError
    }

    throw new Error('请求失败')
  }

  /**
   * 判断是否为不可重试的错误
   */
  private isNonRetryableError(error: Error): boolean {
    const nonRetryablePatterns = [
      /400/, // Bad Request
      /401/, // Unauthorized
      /403/, // Forbidden
      /404/, // Not Found
      /422/, // Unprocessable Entity
    ]

    return nonRetryablePatterns.some(pattern => pattern.test(error.message))
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * GET请求
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' })
  }

  /**
   * POST请求
   */
  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', data })
  }

  /**
   * PUT请求
   */
  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', data })
  }

  /**
   * PATCH请求
   */
  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', data })
  }

  /**
   * DELETE请求
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' })
  }

  /**
   * 设置认证token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  /**
   * 清除认证token
   */
  clearAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization']
  }
}

// 创建默认的API客户端实例
export const apiClient = new ApiClient()

// 导出便捷方法
export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) => apiClient.get<T>(endpoint, config),
  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.post<T>(endpoint, data, config),
  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.put<T>(endpoint, data, config),
  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) => apiClient.patch<T>(endpoint, data, config),
  delete: <T>(endpoint: string, config?: RequestConfig) => apiClient.delete<T>(endpoint, config),
}

export default apiClient