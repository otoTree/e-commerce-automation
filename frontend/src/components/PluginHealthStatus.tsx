'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PluginHealthStatus } from "@/types/product"
import { Activity, AlertCircle, CheckCircle, Clock, TrendingUp, Zap } from "lucide-react"

interface PluginHealthStatusProps {
  status: PluginHealthStatus
}

export const PluginHealthStatusCard = ({ status }: PluginHealthStatusProps) => {
  const getStatusIcon = () => {
    switch (status.status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'inactive':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = () => {
    switch (status.status) {
      case 'active':
        return <Badge variant="success">运行中</Badge>
      case 'inactive':
        return <Badge variant="warning">未激活</Badge>
      case 'error':
        return <Badge variant="destructive">错误</Badge>
      default:
        return <Badge variant="secondary">未知</Badge>
    }
  }

  const getConnectionStatus = () => {
    return status.isConnected ? (
      <Badge variant="success" className="text-xs">
        已连接
      </Badge>
    ) : (
      <Badge variant="destructive" className="text-xs">
        未连接
      </Badge>
    )
  }

  const formatLastHeartbeat = (date?: Date) => {
    if (!date) return '从未'
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}天前`
    if (hours > 0) return `${hours}小时前`
    if (minutes > 0) return `${minutes}分钟前`
    return '刚刚'
  }

  const formatSuccessRate = (rate?: number) => {
    if (rate === undefined) return 'N/A'
    return `${(rate * 100).toFixed(1)}%`
  }

  const formatProcessingTime = (time?: number) => {
    if (time === undefined) return 'N/A'
    if (time < 1000) return `${time}ms`
    return `${(time / 1000).toFixed(1)}s`
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <CardTitle className="text-lg">浏览器插件</CardTitle>
          </div>
          {getStatusBadge()}
        </div>
        <CardDescription>
          插件运行状态和性能监控
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 连接状态 */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">连接状态</span>
          </div>
          {getConnectionStatus()}
        </div>

        {/* 基本信息 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-muted-foreground">版本</div>
            <div className="font-medium">{status.version || 'N/A'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">最后心跳</div>
            <div className="font-medium">{formatLastHeartbeat(status.lastHeartbeat)}</div>
          </div>
        </div>

        {/* 性能指标 */}
        {status.metrics && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              性能指标
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">处理页面数</span>
                <span className="font-medium">{status.metrics.pagesProcessed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">成功率</span>
                <span className="font-medium">{formatSuccessRate(status.metrics.successRate)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">平均处理时间</span>
                <span className="font-medium">{formatProcessingTime(status.metrics.averageProcessingTime)}</span>
              </div>
            </div>
          </div>
        )}

        {/* 错误信息 */}
        {status.errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-800">错误信息</div>
                <div className="text-sm text-red-600 mt-1">{status.errorMessage}</div>
              </div>
            </div>
          </div>
        )}

        {/* 状态指示器 */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>实时监控</span>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                status.isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`} />
              <span>{status.isConnected ? '在线' : '离线'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// 插件健康状态列表组件
interface PluginHealthStatusListProps {
  statusList: PluginHealthStatus[]
}

export const PluginHealthStatusList = ({ statusList }: PluginHealthStatusListProps) => {
  if (statusList.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-lg font-medium text-muted-foreground">暂无插件状态数据</div>
            <div className="text-sm text-muted-foreground mt-1">
              请确保浏览器插件已安装并正常运行
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statusList.map((status, index) => (
        <PluginHealthStatusCard key={index} status={status} />
      ))}
    </div>
  )
}