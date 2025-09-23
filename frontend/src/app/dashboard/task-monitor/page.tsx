'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTaskMonitor, Task } from '@/hooks/useTaskMonitor'
import { 
  Monitor,
  Play,
  Pause,
  Square,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Download,
  Trash2,
  Eye,
  MoreHorizontal
} from 'lucide-react'

export default function TaskMonitorPage() {
  const {
    tasks,
    loading,
    error,
    autoRefresh,
    setAutoRefresh,
    fetchTasks,
    pauseTask,
    resumeTask,
    stopTask,
    restartTask,
    deleteTask,
    batchOperation,
    exportTaskResults,
    getTaskStats
  } = useTaskMonitor()

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.platform?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleTaskAction = async (taskId: string, action: 'pause' | 'resume' | 'stop' | 'restart') => {
    try {
      switch (action) {
        case 'pause':
          await pauseTask(taskId)
          break
        case 'resume':
          await resumeTask(taskId)
          break
        case 'stop':
          await stopTask(taskId)
          break
        case 'restart':
          await restartTask(taskId)
          break
      }
    } catch (err) {
      console.error(`任务操作失败:`, err)
    }
  }

  const handleBatchAction = async (action: 'delete' | 'pause' | 'resume') => {
    if (selectedTasks.length === 0) return
    
    try {
      if (action === 'delete') {
        await Promise.all(selectedTasks.map(taskId => deleteTask(taskId)))
      } else {
        await batchOperation(selectedTasks, action)
      }
      setSelectedTasks([])
    } catch (err) {
      console.error(`批量操作失败:`, err)
    }
  }

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    )
  }

  const stats = getTaskStats()

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'running': return <Play className="w-4 h-4 text-blue-500" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      case 'paused': return <Pause className="w-4 h-4 text-gray-500" />
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'paused': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待处理'
      case 'running': return '进行中'
      case 'completed': return '已完成'
      case 'failed': return '失败'
      case 'paused': return '已暂停'
      default: return '未知'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Monitor className="w-8 h-8" />
            任务监控中心
          </h1>
          <p className="text-gray-600 mt-2">实时监控和管理数据收集任务</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            自动刷新
          </Button>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">总任务</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Monitor className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">进行中</p>
                <p className="text-2xl font-bold text-blue-600">{stats.running}</p>
              </div>
              <Play className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">失败</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">待处理</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和过滤 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="搜索任务名称或平台..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">所有状态</option>
                <option value="pending">待处理</option>
                <option value="running">进行中</option>
                <option value="completed">已完成</option>
                <option value="failed">失败</option>
                <option value="paused">已暂停</option>
              </select>
            </div>

            {selectedTasks.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  已选择 {selectedTasks.length} 个任务
                </span>
                <Button size="sm" variant="outline" onClick={() => handleBatchAction('pause')}>
                  <Pause className="w-4 h-4 mr-1" />
                  暂停
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBatchAction('resume')}>
                  <Play className="w-4 h-4 mr-1" />
                  恢复
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBatchAction('delete')}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  删除
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <Card>
        <CardHeader>
          <CardTitle>任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>暂无任务数据</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => toggleTaskSelection(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {getStatusIcon(task.status)}
                          <h3 className="font-medium">{task.name}</h3>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusText(task.status)}
                          </Badge>
                          {task.type === 'keyword' && (
                            <Badge variant="outline">关键词</Badge>
                          )}
                          {task.type === 'batch' && (
                            <Badge variant="outline">批量</Badge>
                          )}
                          {task.type === 'single' && (
                            <Badge variant="outline">单个</Badge>
                          )}
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          {task.platform && (
                            <p>平台: {task.platform}</p>
                          )}
                          {task.keywords && (
                            <p>关键词: {task.keywords.join(', ')}</p>
                          )}
                          {task.url && (
                            <p>链接: {task.url}</p>
                          )}
                          {task.urls && (
                            <p>批量链接: {task.urls.length} 个</p>
                          )}
                          {task.results !== undefined && (
                            <p className="text-green-600">已收集: {task.results} 个商品</p>
                          )}
                          {task.errorMessage && (
                            <p className="text-red-600">错误: {task.errorMessage}</p>
                          )}
                        </div>

                        {task.status === 'running' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>进度: {Math.round(task.progress)}%</span>
                              <span>预计时间: {task.estimatedTime}</span>
                            </div>
                            <Progress value={task.progress} className="w-full" />
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                          <span>创建: {new Date(task.createdAt).toLocaleString()}</span>
                          <span>更新: {new Date(task.updatedAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === 'running' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, 'pause')}
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      )}
                      
                      {task.status === 'paused' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, 'resume')}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}

                      {(task.status === 'failed' || task.status === 'completed') && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, 'restart')}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}

                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>

                      {task.status === 'completed' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => exportTaskResults(task.id)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}