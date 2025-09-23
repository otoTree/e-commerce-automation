import { useState, useEffect, useCallback } from 'react'
import { api } from '../lib/utils'

export interface Task {
  id: string
  type: 'single' | 'batch' | 'keyword'
  name: string
  url?: string
  urls?: string[]
  keywords?: string[]
  platform?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'paused'
  progress: number
  createdAt: string
  updatedAt: string
  results?: number
  errorMessage?: string
  estimatedTime?: string
  actualTime?: string
  metadata?: Record<string, string | number | boolean | null>
}

export interface TaskStats {
  total: number
  running: number
  completed: number
  failed: number
  pending: number
  paused: number
}

export const useTaskMonitor = () => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(5000) // 5秒

  // 获取所有任务
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.get('/tasks')
      const responseData = result.data as { tasks?: Task[] }
      setTasks(responseData?.tasks || [])
    } catch (err) {
      // 对于404错误，不设置错误状态，因为这可能是正常的初始状态
      if (err instanceof Error && err.message.includes('404')) {
        console.warn('任务列表暂时不可用，可能是服务正在启动中')
        setTasks([]) // 设置为空数组而不是错误状态
      } else {
        const errorMessage = err instanceof Error ? err.message : '获取任务列表失败'
        setError(errorMessage)
        console.error('获取任务失败:', err)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // 获取单个任务详情
  const getTask = useCallback(async (taskId: string) => {
    try {
      const result = await api.get(`/tasks/${taskId}`)
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取任务详情失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 获取任务统计
  const getTaskStats = useCallback(async (): Promise<TaskStats> => {
    try {
      const result = await api.get('/tasks/stats')
      const defaultStats: TaskStats = {
        total: 0,
        running: 0,
        completed: 0,
        failed: 0,
        pending: 0,
        paused: 0
      }
      return (result.data as TaskStats) || defaultStats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取任务统计失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 暂停任务
  const pauseTask = useCallback(async (taskId: string) => {
    try {
      const result = await api.post(`/tasks/${taskId}/pause`)
      
      // 更新本地状态
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'paused' as const }
          : task
      ))
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '暂停任务失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 恢复任务
  const resumeTask = useCallback(async (taskId: string) => {
    try {
      const result = await api.post(`/tasks/${taskId}/resume`)
      
      // 更新本地状态
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'running' as const }
          : task
      ))
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '恢复任务失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 取消任务
  const cancelTask = useCallback(async (taskId: string) => {
    try {
      const result = await api.post(`/tasks/${taskId}/cancel`)
      
      // 更新本地状态
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'failed' as const }
          : task
      ))
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '取消任务失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 删除任务
  const deleteTask = useCallback(async (taskId: string) => {
    try {
      await api.delete(`/tasks/${taskId}`)
      
      // 从本地状态中移除
      setTasks(prev => prev.filter(task => task.id !== taskId))
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除任务失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 批量操作
  const batchOperation = useCallback(async (
    taskIds: string[], 
    operation: 'pause' | 'resume' | 'cancel' | 'delete'
  ) => {
    try {
      const result = await api.post('/tasks/batch', {
        taskIds,
        operation
      })
      
      // 刷新任务列表
      await fetchTasks()
      
      return result.data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '批量操作失败'
      setError(errorMessage)
      throw err
    }
  }, [fetchTasks])

  // 清理已完成的任务
  const clearCompletedTasks = useCallback(async () => {
    try {
      await api.delete('/tasks/completed')
      
      // 从本地状态中移除已完成的任务
      setTasks(prev => prev.filter(task => task.status !== 'completed'))
      
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '清理任务失败'
      setError(errorMessage)
      throw err
    }
  }, [])

  // 自动刷新逻辑
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchTasks()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchTasks])

  // 初始加载
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    // 状态
    tasks,
    loading,
    error,
    autoRefresh,
    refreshInterval,
    
    // 方法
    fetchTasks,
    getTask,
    getTaskStats,
    pauseTask,
    resumeTask,
    cancelTask,
    deleteTask,
    batchOperation,
    clearCompletedTasks,
    
    // 设置
    setAutoRefresh,
    setRefreshInterval,
    clearError: () => setError(null)
  }
}