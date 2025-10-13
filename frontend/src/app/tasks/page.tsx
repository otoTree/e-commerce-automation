'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { taskService } from '@/services/taskService'
import { Task, TaskFilter } from '@/types/product'

type TaskTypeEnum = 'url' | 'keyword' | 'batch_url' | 'search_1688'
type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'
type TaskPriority = 'low' | 'medium' | 'high'

interface TaskStats {
  total: number
  pending: number
  processing: number
  completed: number
  failed: number
  averageDuration: number
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<TaskFilter>({})
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTask, setNewTask] = useState({
    type: 'url' as TaskTypeEnum,
    title: '',
    description: '',
    url: '',
    keyword: '',
    priority: 'medium' as TaskPriority,
  })

  // 获取任务列表
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page: 1,
        limit: 50,
        ...(filter.status && { status: filter.status }),
        ...(filter.type && { type: filter.type }),
        ...(filter.priority && { priority: filter.priority }),
      }
      
      const response = await taskService.getTasks(params)
      
      if (response.success) {
        setTasks(response.data.tasks)
      } else {
        setError(response.error || '获取任务列表失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络请求失败')
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取任务
  useEffect(() => {
    fetchTasks()
  }, [filter])

  // 计算统计数据
  const calculateStats = (): TaskStats => {
    const total = tasks.length
    const pending = tasks.filter(t => t.status === 'pending').length
    const processing = tasks.filter(t => t.status === 'processing').length
    const completed = tasks.filter(t => t.status === 'completed').length
    const failed = tasks.filter(t => t.status === 'failed').length
    
    const completedTasks = tasks.filter(t => 
      t.status === 'completed' && 
      t.startedAt && 
      t.completedAt
    )
    
    const averageDuration = completedTasks.length > 0 
      ? completedTasks.reduce((sum, task) => {
          const startTime = new Date(task.startedAt!).getTime()
          const endTime = new Date(task.completedAt!).getTime()
          const duration = endTime - startTime
          return sum + duration
        }, 0) / completedTasks.length / 1000 / 60 // 转换为分钟
      : 0

    return {
      total,
      pending,
      processing,
      completed,
      failed,
      averageDuration: Math.round(averageDuration * 100) / 100
    }
  }

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    if (filter.status && task.status !== filter.status) return false
    if (filter.priority && task.priority !== filter.priority) return false
    if (filter.type && task.type !== filter.type) return false
    return true
  })

  // 获取状态颜色
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 获取优先级颜色
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // 创建新任务
  const handleCreateTask = async () => {
    try {
      const taskData = {
        type: newTask.type,
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: 'pending' as const,
        progress: 0,
        processedItems: 0,
        retryCount: 0,
        maxRetries: 3,
        tags: [],
        ...(newTask.type === 'url' && { url: newTask.url }),
        ...(newTask.type === 'keyword' && { keywords: [newTask.keyword] }),
      }

      const response = await taskService.createTask(taskData)
      
      if (response.success) {
        setIsCreateDialogOpen(false)
        setNewTask({
          type: 'url',
          title: '',
          description: '',
          url: '',
          keyword: '',
          priority: 'medium',
        })
        fetchTasks() // 重新获取任务列表
      } else {
        setError(response.error || '创建任务失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败')
    }
  }

  const stats = calculateStats()

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 text-lg mb-4">错误: {error}</div>
            <Button onClick={fetchTasks}>重试</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">任务管理</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          创建任务
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">总任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">待处理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">处理中</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">已完成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">失败</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          </CardContent>
        </Card>
      </div>

      {/* 过滤器 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">状态</label>
              <Select
                value={filter.status || 'all'}
                onValueChange={(value: string) => setFilter({ ...filter, status: value === 'all' ? undefined : value as TaskStatus })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全部状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="completed">已完成</SelectItem>
                  <SelectItem value="failed">失败</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">优先级</label>
              <Select
                value={filter.priority || 'all'}
                onValueChange={(value: string) => setFilter({ ...filter, priority: value === 'all' ? undefined : value as TaskPriority })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全部优先级" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部优先级</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="medium">中</SelectItem>
                  <SelectItem value="low">低</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">类型</label>
              <Select
                value={filter.type || 'all'}
                onValueChange={(value: string) => setFilter({ ...filter, type: value === 'all' ? undefined : value as TaskTypeEnum })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="全部类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="url">URL抓取</SelectItem>
                  <SelectItem value="keyword">关键词搜索</SelectItem>
                  <SelectItem value="batch_url">批量URL</SelectItem>
                  <SelectItem value="search_1688">1688搜索</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <div className="grid gap-4">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="text-gray-500">暂无任务数据</div>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task._id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    {task.description && (
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'pending' && '待处理'}
                      {task.status === 'processing' && '处理中'}
                      {task.status === 'completed' && '已完成'}
                      {task.status === 'failed' && '失败'}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'high' && '高'}
                      {task.priority === 'medium' && '中'}
                      {task.priority === 'low' && '低'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">类型: {task.type}</div>
                    {task.url && <div className="text-sm text-gray-600">URL: {task.url}</div>}
                    {task.keywords && task.keywords.length > 0 && (
                      <div className="text-sm text-gray-600">关键词: {task.keywords.join(', ')}</div>
                    )}
                    {task.errorMessage && (
                      <div className="text-sm text-red-600">错误: {task.errorMessage}</div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">
                      创建时间: {new Date(task.createdAt).toLocaleString()}
                    </div>
                    {task.startedAt && (
                      <div className="text-sm text-gray-600">
                        开始时间: {new Date(task.startedAt).toLocaleString()}
                      </div>
                    )}
                    {task.completedAt && (
                      <div className="text-sm text-gray-600">
                        完成时间: {new Date(task.completedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                {task.progress > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>进度</span>
                      <span>{Math.round(task.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.round(task.progress)}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 创建任务对话框 */}
      {isCreateDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">创建新任务</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">任务类型</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value as TaskTypeEnum })}
                >
                  <option value="url">URL抓取</option>
                  <option value="keyword">关键词搜索</option>
                  <option value="batch_url">批量URL</option>
                  <option value="search_1688">1688搜索</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">任务标题</label>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="输入任务标题"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">任务描述</label>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="输入任务描述"
                />
              </div>
              {newTask.type === 'url' && (
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <Input
                    value={newTask.url}
                    onChange={(e) => setNewTask({ ...newTask, url: e.target.value })}
                    placeholder="输入要抓取的URL"
                  />
                </div>
              )}
              {newTask.type === 'keyword' && (
                <div>
                  <label className="block text-sm font-medium mb-2">关键词</label>
                  <Input
                    value={newTask.keyword}
                    onChange={(e) => setNewTask({ ...newTask, keyword: e.target.value })}
                    placeholder="输入搜索关键词"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-2">优先级</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as TaskPriority })}
                >
                  <option value="low">低</option>
                  <option value="medium">中</option>
                  <option value="high">高</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                取消
              </Button>
              <Button onClick={handleCreateTask}>
                创建
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}