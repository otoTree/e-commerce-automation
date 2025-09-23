import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

import { api, apiClient } from './api-client'

// API基础URL - 保持向后兼容
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// 导出新的API客户端
export { api, apiClient }

// 保持向后兼容的API请求函数
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const method = (options.method || 'GET').toUpperCase()
    const body = options.body ? JSON.parse(options.body as string) : undefined
    
    switch (method) {
      case 'GET':
        return await api.get(endpoint, options)
      case 'POST':
        return await api.post(endpoint, body, options)
      case 'PUT':
        return await api.put(endpoint, body, options)
      case 'PATCH':
        return await api.patch(endpoint, body, options)
      case 'DELETE':
        return await api.delete(endpoint, options)
      default:
        throw new Error(`Unsupported method: ${method}`)
    }
  } catch (error) {
    if (error instanceof Error) {
      // 对于404错误，不在控制台输出错误信息，因为这通常是正常情况
      if (!error.message.includes('404')) {
        console.error('API request failed:', error.message, 'Endpoint:', endpoint)
      }
    } else {
      console.error('API request failed:', error, 'Endpoint:', endpoint)
    }
    throw error
  }
}

// 格式化日期
export const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// 格式化价格
export const formatPrice = (price: number | undefined | null, currency = '¥') => {
  if (price === undefined || price === null || isNaN(price)) {
    return `${currency}0.00`
  }
  return `${currency}${price.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`
}

// 任务状态映射
export const taskStatusMap = {
  pending: '待处理',
  running: '进行中',
  completed: '已完成',
  failed: '失败',
} as const

// 任务状态颜色
export const getTaskStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'running':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'failed':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}