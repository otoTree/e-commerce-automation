'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from './button'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorId: string
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    })

    // 调用错误回调
    this.props.onError?.(error, errorInfo)

    // 在开发环境下打印错误信息
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  copyErrorDetails = () => {
    const { error, errorInfo, errorId } = this.state
    const errorDetails = `
错误ID: ${errorId}
时间: ${new Date().toLocaleString()}
错误信息: ${error?.message}
错误堆栈: ${error?.stack}
组件堆栈: ${errorInfo?.componentStack}
    `.trim()

    navigator.clipboard.writeText(errorDetails).then(() => {
      alert('错误详情已复制到剪贴板')
    })
  }

  render() {
    if (this.state.hasError) {
      // 如果提供了自定义fallback，使用它
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, errorId } = this.state
      const { showDetails = process.env.NODE_ENV === 'development' } = this.props

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            
            <div className="text-center mb-6">
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                页面出现错误
              </h1>
              <p className="text-gray-600">
                抱歉，页面遇到了一个意外错误。请尝试刷新页面或返回首页。
              </p>
            </div>

            {showDetails && error && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">错误详情</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>错误ID: {errorId}</div>
                  <div>错误信息: {error.message}</div>
                  <div className="max-h-20 overflow-y-auto">
                    <pre className="whitespace-pre-wrap break-all">
                      {error.stack}
                    </pre>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={this.copyErrorDetails}
                  className="mt-2 w-full"
                >
                  复制错误详情
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                onClick={this.handleRetry}
                className="w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              
              <Button
                variant="outline"
                onClick={this.handleGoHome}
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                如果问题持续存在，请联系技术支持
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// 函数式组件包装器，用于更简单的使用
interface ErrorBoundaryWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  showDetails?: boolean
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = (props) => {
  return <ErrorBoundary {...props} />
}

export default ErrorBoundary