'use client'

import { useEffect, useState } from 'react'
import { usePluginStore } from '@/store'
import { PluginHealthStatusCard, PluginHealthStatusList } from '@/components/PluginHealthStatus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Activity, 
  RefreshCw, 
  Settings, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  Monitor
} from 'lucide-react'
import { PluginHealthStatus as PluginHealthStatusType } from '@/types/product'

const PluginsPage = () => {
  const {
    pluginStatus,
    statusHistory,
    isMonitoring,
    lastUpdate,
    updatePluginStatus,
    startMonitoring,
    stopMonitoring,
    clearHistory
  } = usePluginStore()

  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // 模拟插件状态数据
  const mockPluginStatus: PluginHealthStatusType = {
    isConnected: Math.random() > 0.2,
    lastHeartbeat: new Date(),
    version: '1.2.3',
    status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'inactive' : 'error',
    errorMessage: Math.random() > 0.7 ? '连接超时' : undefined,
    metrics: {
      pagesProcessed: Math.floor(Math.random() * 1000) + 100,
      successRate: Math.random() * 0.3 + 0.7, // 70-100%
      averageProcessingTime: Math.random() * 2000 + 500 // 500-2500ms
    }
  }

  const fetchPluginStatus = async () => {
    try {
      // 这里应该调用实际的API
      // const response = await fetch('/api/plugin/health')
      // const data = await response.json()
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      updatePluginStatus(mockPluginStatus)
    } catch (error) {
      console.error('获取插件状态失败:', error)
      updatePluginStatus({
        isConnected: false,
        status: 'error',
        errorMessage: '无法连接到插件',
        lastHeartbeat: new Date()
      })
    }
  }

  const handleRefresh = () => {
    fetchPluginStatus()
  }

  const handleToggleMonitoring = () => {
    if (isMonitoring) {
      stopMonitoring()
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    } else {
      startMonitoring()
      fetchPluginStatus()
    }
  }

  const handleToggleAutoRefresh = (enabled: boolean) => {
    setAutoRefresh(enabled)
    
    if (enabled) {
      const interval = setInterval(fetchPluginStatus, 10000) // 每10秒刷新
      setRefreshInterval(interval)
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval)
        setRefreshInterval(null)
      }
    }
  }

  const handleClearHistory = () => {
    clearHistory()
  }

  // 计算统计数据
  const getStatusStats = () => {
    if (statusHistory.length === 0) {
      return { active: 0, inactive: 0, error: 0, uptime: 0 }
    }

    const recent = statusHistory.slice(0, 20) // 最近20条记录
    const active = recent.filter(s => s.status === 'active').length
    const inactive = recent.filter(s => s.status === 'inactive').length
    const error = recent.filter(s => s.status === 'error').length
    const uptime = (active / recent.length) * 100

    return { active, inactive, error, uptime }
  }

  const stats = getStatusStats()

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [refreshInterval])

  // 初始化时获取一次状态
  useEffect(() => {
    fetchPluginStatus()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">插件健康监控</h1>
        <p className="text-muted-foreground">
          监控浏览器插件的运行状态和性能指标
        </p>
      </div>

      {/* 控制面板 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            监控控制
          </CardTitle>
          <CardDescription>
            管理插件监控设置和数据刷新
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={isMonitoring}
                  onCheckedChange={handleToggleMonitoring}
                />
                <span className="text-sm">
                  {isMonitoring ? '监控中' : '已停止'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={autoRefresh}
                  onCheckedChange={handleToggleAutoRefresh}
                  disabled={!isMonitoring}
                />
                <span className="text-sm">自动刷新</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={!isMonitoring}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                disabled={statusHistory.length === 0}
              >
                清空历史
              </Button>
            </div>

            {lastUpdate && (
              <div className="text-sm text-muted-foreground">
                最后更新: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{stats.active}</div>
                <p className="text-xs text-muted-foreground">活跃状态</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">{stats.inactive}</div>
                <p className="text-xs text-muted-foreground">非活跃状态</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{stats.error}</div>
                <p className="text-xs text-muted-foreground">错误状态</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.uptime.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">可用率</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 当前状态 */}
      {pluginStatus && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              当前插件状态
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PluginHealthStatusCard status={pluginStatus} />
          </CardContent>
        </Card>
      )}

      {/* 状态历史 */}
      {statusHistory.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              状态历史 ({statusHistory.length})
            </CardTitle>
            <CardDescription>
              最近的插件状态变化记录
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PluginHealthStatusList statusList={statusHistory.slice(0, 10)} />
            {statusHistory.length > 10 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  显示最近10条记录，共{statusHistory.length}条
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <div className="text-muted-foreground mb-4">暂无状态历史</div>
              <p className="text-sm text-muted-foreground">
                启动监控后将显示插件状态变化记录
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PluginsPage