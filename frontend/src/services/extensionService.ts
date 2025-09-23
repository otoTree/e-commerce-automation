/**
 * 扩展服务 - 处理与浏览器插件相关的API调用
 */

import { api } from '@/lib/api-client'
import type { ApiResponse } from '@/types'

// 源码请求参数
export interface SourceRequestParams {
  url: string
  extension_id?: string
}

// 源码任务响应
export interface SourceTaskResponse {
  task_id: string
  message: string
  status: 'pending' | 'running' | 'completed' | 'failed'
}

// 源码任务结果
export interface SourceTaskResult {
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: {
    html_content?: string
    url?: string
    timestamp?: string
  }
  html_content?: string
  url?: string
  completed_at?: string
  error?: string
  progress?: number
  message?: string
}

/**
 * 扩展服务类
 */
export class ExtensionService {
  /**
   * 请求插件获取指定URL的源码
   */
  static async requestSourceCode(params: SourceRequestParams): Promise<ApiResponse<SourceTaskResponse>> {
    return api.post<SourceTaskResponse>('/extension/request-source', params)
  }

  /**
   * 获取源码任务的执行结果
   */
  static async getSourceTaskResult(taskId: string): Promise<ApiResponse<SourceTaskResult>> {
    return api.get<SourceTaskResult>(`/extension/source-task/${taskId}`)
  }

  /**
   * 轮询获取源码任务结果（带超时和重试机制）
   */
  static async pollSourceTaskResult(
    taskId: string, 
    options: {
      timeout?: number // 超时时间（毫秒），默认30秒
      interval?: number // 轮询间隔（毫秒），默认2秒
      onProgress?: (progress: number, message?: string) => void // 进度回调
    } = {}
  ): Promise<SourceTaskResult> {
    const { timeout = 30000, interval = 2000, onProgress } = options
    const startTime = Date.now()

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // 检查超时
          if (Date.now() - startTime > timeout) {
            reject(new Error('获取源码任务结果超时'))
            return
          }

          const response = await this.getSourceTaskResult(taskId)
          
          if (!response.success) {
            reject(new Error(response.error || '获取任务结果失败'))
            return
          }

          const result = response.data!

          // 调用进度回调
          if (onProgress && result.progress !== undefined) {
            onProgress(result.progress, result.message)
          }

          // 任务完成
          if (result.status === 'completed') {
            resolve(result)
            return
          }

          // 任务失败
          if (result.status === 'failed') {
            reject(new Error(result.error || '任务执行失败'))
            return
          }

          // 任务仍在进行中，继续轮询
          if (result.status === 'pending' || result.status === 'running') {
            setTimeout(poll, interval)
            return
          }

          // 未知状态
          reject(new Error(`未知任务状态: ${result.status}`))

        } catch (error) {
          reject(error)
        }
      }

      // 开始轮询
      poll()
    })
  }

  /**
   * 一键获取源码（请求 + 轮询结果）
   */
  static async getSourceCode(
    url: string,
    options: {
      extension_id?: string
      timeout?: number
      interval?: number
      onProgress?: (progress: number, message?: string) => void
    } = {}
  ): Promise<{
    html_content: string
    url: string
    timestamp?: string
  }> {
    const { extension_id, ...pollOptions } = options

    // 1. 发起源码获取请求
    const requestResponse = await this.requestSourceCode({ url, extension_id })
    
    if (!requestResponse.success || !requestResponse.data) {
      throw new Error(requestResponse.error || '发起源码获取请求失败')
    }

    const taskId = requestResponse.data.task_id

    // 2. 轮询获取结果
    const result = await this.pollSourceTaskResult(taskId, pollOptions)

    // 3. 返回源码内容
    if (!result.html_content && !result.result?.html_content) {
      throw new Error('未获取到HTML源码内容')
    }

    return {
      html_content: result.html_content || result.result?.html_content || '',
      url: result.url || result.result?.url || url,
      timestamp: result.result?.timestamp || result.completed_at
    }
  }
}

// 导出便捷方法
export const extensionService = {
  requestSourceCode: ExtensionService.requestSourceCode,
  getSourceTaskResult: ExtensionService.getSourceTaskResult,
  pollSourceTaskResult: ExtensionService.pollSourceTaskResult,
  getSourceCode: ExtensionService.getSourceCode,
}

export default ExtensionService