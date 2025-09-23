'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, RefreshCw, Home, Bug, Copy, CheckCircle } from 'lucide-react'
import { useState } from 'react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // 记录错误到控制台
    console.error('应用错误:', error)
  }, [error])

  const copyErrorDetails = async () => {
    const errorDetails = `
错误信息: ${error.message}
错误堆栈: ${error.stack}
错误摘要: ${error.digest || '无'}
时间: ${new Date().toLocaleString()}
用户代理: ${navigator.userAgent}
页面URL: ${window.location.href}
    `.trim()

    try {
      await navigator.clipboard.writeText(errorDetails)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  const goHome = () => {
    window.location.href = '/'
  }

  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">应用遇到了问题</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              很抱歉，应用遇到了意外错误。我们已经记录了这个问题，请尝试刷新页面或返回首页。
            </AlertDescription>
          </Alert>

          {/* 错误信息摘要 */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Bug className="w-4 h-4" />
              错误信息
            </h4>
            <p className="text-sm text-muted-foreground font-mono">
              {error.message || '未知错误'}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mt-2">
                错误ID: {error.digest}
              </p>
            )}
          </div>

          {/* 开发环境下显示详细错误信息 */}
          {isDevelopment && (
            <details className="bg-muted p-4 rounded-lg">
              <summary className="cursor-pointer font-medium mb-2 flex items-center gap-2">
                <Bug className="w-4 h-4" />
                详细错误信息 (开发模式)
              </summary>
              <div className="mt-3 space-y-3">
                <div>
                  <h5 className="text-sm font-medium mb-1">错误堆栈:</h5>
                  <pre className="text-xs bg-background p-3 rounded border overflow-auto max-h-40 font-mono">
                    {error.stack}
                  </pre>
                </div>
                <Button
                  onClick={copyErrorDetails}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      已复制错误详情
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制错误详情
                    </>
                  )}
                </Button>
              </div>
            </details>
          )}

          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={reset}
              className="flex-1"
              variant="default"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              重试
            </Button>
            <Button
              onClick={goHome}
              className="flex-1"
              variant="outline"
            >
              <Home className="w-4 h-4 mr-2" />
              返回首页
            </Button>
          </div>

          {/* 帮助信息 */}
          <div className="text-center text-sm text-muted-foreground">
            <p>如果问题持续存在，请联系技术支持</p>
            <p className="mt-1">
              错误时间: {new Date().toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}