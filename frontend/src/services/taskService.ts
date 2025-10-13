import { Task, TaskFilter } from '@/types/product'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  details?: unknown
}

export interface TaskListResponse {
  tasks: Task[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface TaskStats {
  statusStats: Array<{ _id: string; count: number }>
  typeStats: Array<{ _id: string; count: number }>
  priorityStats: Array<{ _id: string; count: number }>
}

class TaskService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api/tasks${endpoint}`
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // 获取任务列表
  async getTasks(params: {
    page?: number
    limit?: number
    status?: string
    type?: string
    priority?: string
    tags?: string[]
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  } = {}): Promise<ApiResponse<TaskListResponse>> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v))
        } else {
          searchParams.append(key, String(value))
        }
      }
    })

    const queryString = searchParams.toString()
    const endpoint = queryString ? `?${queryString}` : ''
    
    return this.request<TaskListResponse>(endpoint)
  }

  // 获取单个任务
  async getTask(id: string): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/${id}`)
  }

  // 创建任务
  async createTask(taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'progress' | 'processedItems' | 'retryCount' | 'startedAt' | 'completedAt'>): Promise<ApiResponse<Task>> {
    return this.request<Task>('', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  // 更新任务
  async updateTask(id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  // 删除任务
  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/${id}`, {
      method: 'DELETE',
    })
  }

  // 批量创建任务
  async createBatchTasks(tasks: Array<Omit<Task, '_id' | 'createdAt' | 'updatedAt' | 'progress' | 'processedItems' | 'retryCount' | 'startedAt' | 'completedAt'>>): Promise<ApiResponse<Task[]>> {
    return this.request<Task[]>('/batch', {
      method: 'POST',
      body: JSON.stringify({ tasks }),
    })
  }

  // 更新任务状态
  async updateTaskStatus(
    id: string,
    data: {
      status?: string
      progress?: number
      errorMessage?: string
      result?: unknown
    }
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  // 获取任务统计信息
  async getTaskStats(): Promise<ApiResponse<TaskStats>> {
    return this.request<TaskStats>('/stats/overview')
  }

  // 从搜索结果创建批量提取任务
  async createTaskFromSearchResult(
    searchResultId: string,
    data: {
      title?: string
      description?: string
      priority?: 'low' | 'medium' | 'high'
      tags?: string[]
    }
  ): Promise<ApiResponse<Task>> {
    return this.request<Task>(`/from-search-result/${searchResultId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}

export const taskService = new TaskService()