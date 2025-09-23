'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Download, 
  RefreshCw, 
  Settings, 
  TrendingUp,
  Wifi,
  WifiOff,
  Zap
} from 'lucide-react'
import { API_BASE_URL } from '@/lib/utils'

interface PluginStatus {
  extension_id: string
  status: 'online' | 'offline' | 'error'
  last_heartbeat: string
  last_task_poll: string
  tasks_completed: number
  tasks_failed: number
  version?: string
  browser?: string
  created_at: string
}

const PluginMonitor = () => {
  const [plugins, setPlugins] = useState<PluginStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // 获取插件状态数据
  const fetchPluginStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/extension/status`)
      if (response.ok) {
        const data = await response.json()
        setPlugins(data.data || [])
      } else {
        console.error('获取插件状态失败:', response.status)
        setPlugins([])
      }
      setLastUpdate(new Date())
    } catch (error) {
      console.error('获取插件状态出错:', error)
      setPlugins([])
    } finally {
      setLoading(false)
    }
  }

  // 页面加载时获取数据
  useEffect(() => {
    fetchPluginStatus()
    // 每30秒自动刷新
    const interval = setInterval(fetchPluginStatus, 30000)
    return () => clearInterval(interval)
  }, [])

  // 计算统计数据
  const onlineCount = plugins.filter(p => p.status === 'online').length
  const offlineCount = plugins.filter(p => p.status === 'offline').length
  const errorCount = plugins.filter(p => p.status === 'error').length

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 border-green-200'
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'error': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'offline': return <WifiOff className="h-4 w-4 text-gray-600" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  // 格式化时间
  const formatTime = (timeString: string) => {
    const time = new Date(timeString)
    const now = new Date()
    const diff = now.getTime() - time.getTime()
    
    if (diff < 60000) return '刚刚'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
    return `${Math.floor(diff / 86400000)}天前`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">插件监控</h1>
          <p className="text-muted-foreground">
            监控浏览器插件的健康状况和运行状态
          </p>
        </div>
        <Button onClick={fetchPluginStatus} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* 统计概览 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总插件数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plugins.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线插件</CardTitle>
            <Wifi className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">离线插件</CardTitle>
            <WifiOff className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{offlineCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">异常插件</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* 插件列表 */}
      <Card>
        <CardHeader>
          <CardTitle>插件详情</CardTitle>
          <CardDescription>
            最后更新: {lastUpdate.toLocaleString('zh-CN')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              <span>加载中...</span>
            </div>
          ) : plugins.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无插件数据
            </div>
          ) : (
            <div className="space-y-4">
              {plugins.map((plugin) => (
                <div
                  key={plugin.extension_id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(plugin.status)}
                      <Badge className={getStatusColor(plugin.status)}>
                        {plugin.status === 'online' ? '在线' : 
                         plugin.status === 'offline' ? '离线' : '异常'}
                      </Badge>
                    </div>
                    
                    <div>
                      <div className="font-medium">{plugin.extension_id}</div>
                      <div className="text-sm text-muted-foreground">
                        {plugin.browser && `浏览器: ${plugin.browser}`}
                        {plugin.version && ` | 版本: ${plugin.version}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <div className="text-sm">
                      <span className="text-muted-foreground">最后心跳: </span>
                      <span>{formatTime(plugin.last_heartbeat)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">任务轮询: </span>
                      <span>{formatTime(plugin.last_task_poll)}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-green-600">完成: {plugin.tasks_completed}</span>
                      <span className="mx-2">|</span>
                      <span className="text-red-600">失败: {plugin.tasks_failed}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default PluginMonitor