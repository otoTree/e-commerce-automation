'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Download, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react'
import { extensionService } from '@/services/extensionService'
import type { SourceTaskResult } from '@/services/extensionService'

export default function SourceExtractionPage() {
  const [url, setUrl] = useState('')
  const [extensionId, setExtensionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [progressMessage, setProgressMessage] = useState('')
  const [result, setResult] = useState<SourceTaskResult | null>(null)
  const [error, setError] = useState('')
  const [taskId, setTaskId] = useState('')

  // 重置状态
  const resetState = () => {
    setResult(null)
    setError('')
    setProgress(0)
    setProgressMessage('')
    setTaskId('')
  }

  // 获取源码
  const handleGetSource = async () => {
    if (!url.trim()) {
      setError('请输入有效的URL')
      return
    }

    resetState()
    setLoading(true)

    try {
      // 使用一键获取源码方法
      const sourceData = await extensionService.getSourceCode(url, {
        extension_id: extensionId || undefined,
        timeout: 60000, // 60秒超时
        interval: 2000, // 2秒轮询间隔
        onProgress: (progress, message) => {
          setProgress(progress)
          setProgressMessage(message || '正在处理...')
        }
      })

      setResult({
        status: 'completed',
        html_content: sourceData.html_content,
        url: sourceData.url,
        completed_at: sourceData.timestamp
      })
      setProgress(100)
      setProgressMessage('源码获取完成')

    } catch (err) {
      console.error('获取源码失败:', err)
      setError(err instanceof Error ? err.message : '获取源码失败')
    } finally {
      setLoading(false)
    }
  }

  // 手动请求源码（分步操作）
  const handleRequestSource = async () => {
    if (!url.trim()) {
      setError('请输入有效的URL')
      return
    }

    resetState()
    setLoading(true)

    try {
      const response = await extensionService.requestSourceCode({
        url,
        extension_id: extensionId || undefined
      })

      if (response.success && response.data) {
        setTaskId(response.data.task_id)
        setProgressMessage(`任务已创建: ${response.data.task_id}`)
        setProgress(10)
      } else {
        throw new Error(response.error || '创建任务失败')
      }
    } catch (err) {
      console.error('请求源码失败:', err)
      setError(err instanceof Error ? err.message : '请求源码失败')
      setLoading(false)
    }
  }

  // 查询任务结果
  const handleCheckResult = async () => {
    if (!taskId) {
      setError('请先创建任务')
      return
    }

    try {
      const response = await extensionService.getSourceTaskResult(taskId)
      
      if (response.success && response.data) {
        setResult(response.data)
        
        if (response.data.status === 'completed') {
          setProgress(100)
          setProgressMessage('源码获取完成')
          setLoading(false)
        } else if (response.data.status === 'failed') {
          setError(response.data.error || '任务执行失败')
          setLoading(false)
        } else {
          setProgress(response.data.progress || 50)
          setProgressMessage(response.data.message || '任务进行中...')
        }
      } else {
        throw new Error(response.error || '查询任务结果失败')
      }
    } catch (err) {
      console.error('查询任务结果失败:', err)
      setError(err instanceof Error ? err.message : '查询任务结果失败')
    }
  }

  // 复制源码到剪贴板
  const handleCopySource = async () => {
    if (result?.html_content) {
      try {
        await navigator.clipboard.writeText(result.html_content)
        // 这里可以添加toast提示
        console.log('源码已复制到剪贴板')
      } catch (err) {
        console.error('复制失败:', err)
      }
    }
  }

  // 下载源码文件
  const handleDownloadSource = () => {
    if (result?.html_content) {
      const blob = new Blob([result.html_content], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `source-${Date.now()}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // 获取状态徽章
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />已完成</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />失败</Badge>
      case 'running':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="w-3 h-3 mr-1 animate-spin" />运行中</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />等待中</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Code className="w-6 h-6 mr-2" />
          源码提取测试
        </h1>
        <p className="text-gray-600">测试浏览器插件获取网页源码功能</p>
      </div>

      {/* 输入表单 */}
      <Card>
        <CardHeader>
          <CardTitle>源码获取配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">目标URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="extensionId">插件ID（可选）</Label>
            <Input
              id="extensionId"
              type="text"
              value={extensionId}
              onChange={(e) => setExtensionId(e.target.value)}
              placeholder="浏览器插件ID"
              disabled={loading}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGetSource} 
              disabled={loading || !url.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  获取中...
                </>
              ) : (
                <>
                  <Code className="w-4 h-4 mr-2" />
                  一键获取源码
                </>
              )}
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleRequestSource}
              disabled={loading || !url.trim()}
            >
              分步请求
            </Button>
            
            {taskId && (
              <Button 
                variant="outline"
                onClick={handleCheckResult}
                disabled={!taskId}
              >
                查询结果
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 进度显示 */}
      {(loading || progress > 0) && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>进度</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {progressMessage && (
                <p className="text-sm text-gray-600">{progressMessage}</p>
              )}
              {taskId && (
                <p className="text-xs text-gray-500">任务ID: {taskId}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 错误提示 */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 结果显示 */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>获取结果</span>
              {getStatusBadge(result.status)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="info" className="w-full">
              <TabsList>
                <TabsTrigger value="info">基本信息</TabsTrigger>
                <TabsTrigger value="source">源码内容</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>状态</Label>
                    <div className="mt-1">{getStatusBadge(result.status)}</div>
                  </div>
                  <div>
                    <Label>URL</Label>
                    <div className="mt-1 flex items-center">
                      <span className="text-sm truncate">{result.url}</span>
                      {result.url && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(result.url, '_blank')}
                          className="ml-2 p-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>完成时间</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.completed_at ? new Date(result.completed_at).toLocaleString() : '-'}
                    </p>
                  </div>
                  <div>
                    <Label>源码大小</Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.html_content ? `${(result.html_content.length / 1024).toFixed(2)} KB` : '-'}
                    </p>
                  </div>
                </div>
                
                {result.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{result.error}</AlertDescription>
                  </Alert>
                )}
              </TabsContent>
              
              <TabsContent value="source" className="space-y-4">
                {result.html_content ? (
                  <>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopySource}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制源码
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadSource}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        下载文件
                      </Button>
                    </div>
                    
                    <Textarea
                      value={result.html_content}
                      readOnly
                      className="min-h-[400px] font-mono text-sm"
                      placeholder="HTML源码将显示在这里..."
                    />
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    暂无源码内容
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}