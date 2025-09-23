'use client'

import { toast } from '@/hooks/use-toast'
import { AlertTriangle, X, RefreshCw, Bug } from 'lucide-react'
import { Button } from './button'

export interface ErrorToastOptions {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  showRetry?: boolean
  onRetry?: () => void
  duration?: number
}

// 错误类型映射
const ERROR_MESSAGES = {
  NETWORK_ERROR: {
    title: '网络连接失败',
    description: '请检查您的网络连接后重试',
  },
  TIMEOUT_ERROR: {
    title: '请求超时',
    description: '服务器响应时间过长，请稍后重试',
  },
  VALIDATION_ERROR: {
    title: '数据验证失败',
    description: '请检查输入的数据格式是否正确',
  },
  PERMISSION_ERROR: {
    title: '权限不足',
    description: '您没有执行此操作的权限',
  },
  SERVER_ERROR: {
    title: '服务器错误',
    description: '服务器遇到了问题，请稍后重试',
  },
  NOT_FOUND_ERROR: {
    title: '资源未找到',
    description: '请求的资源不存在或已被删除',
  },
  UNKNOWN_ERROR: {
    title: '未知错误',
    description: '发生了意外错误，请稍后重试',
  },
} as const

export type ErrorType = keyof typeof ERROR_MESSAGES

// 根据错误类型显示错误提示
export const showErrorToast = (
  errorType: ErrorType | string,
  options: ErrorToastOptions = {}
) => {
  const errorConfig = ERROR_MESSAGES[errorType as ErrorType] || ERROR_MESSAGES.UNKNOWN_ERROR
  
  const {
    title = errorConfig.title,
    description = errorConfig.description,
    action,
    showRetry = false,
    onRetry,
  } = options

  const toastResult = toast({
    variant: 'destructive',
    title: (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        {title}
      </div>
    ),
    description,
    action: action || (showRetry && onRetry) ? (
      <div className="flex gap-2">
        {action && (
          <Button
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
          >
            {action.label}
          </Button>
        )}
        {showRetry && onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="bg-destructive-foreground text-destructive hover:bg-destructive-foreground/90"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            重试
          </Button>
        )}
      </div>
    ) : undefined,
  })

  // 手动设置自动关闭
  if (options.duration) {
    setTimeout(() => {
      toastResult.dismiss()
    }, options.duration)
  }
}

// 根据HTTP状态码显示错误提示
export const showHttpErrorToast = (
  status: number,
  message?: string,
  options: ErrorToastOptions = {}
) => {
  let errorType: ErrorType

  switch (status) {
    case 400:
      errorType = 'VALIDATION_ERROR'
      break
    case 401:
    case 403:
      errorType = 'PERMISSION_ERROR'
      break
    case 404:
      errorType = 'NOT_FOUND_ERROR'
      break
    case 408:
      errorType = 'TIMEOUT_ERROR'
      break
    case 500:
    case 502:
    case 503:
    case 504:
      errorType = 'SERVER_ERROR'
      break
    default:
      errorType = 'UNKNOWN_ERROR'
  }

  showErrorToast(errorType, {
    ...options,
    description: message || options.description,
  })
}

// 根据错误对象显示错误提示
export const showErrorFromException = (
  error: Error,
  options: ErrorToastOptions = {}
) => {
  let errorType: ErrorType = 'UNKNOWN_ERROR'
  const description = error.message

  // 根据错误消息判断错误类型
  if (error.message.includes('network') || error.message.includes('fetch')) {
    errorType = 'NETWORK_ERROR'
  } else if (error.message.includes('timeout')) {
    errorType = 'TIMEOUT_ERROR'
  } else if (error.message.includes('validation') || error.message.includes('invalid')) {
    errorType = 'VALIDATION_ERROR'
  } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    errorType = 'PERMISSION_ERROR'
  }

  showErrorToast(errorType, {
    ...options,
    description: options.description || description,
  })
}

// 成功提示
export const showSuccessToast = (
  title: string,
  description?: string,
  duration = 3000
) => {
  const toastResult = toast({
    title,
    description,
  })

  // 手动设置自动关闭
  setTimeout(() => {
    toastResult.dismiss()
  }, duration)
}

// 警告提示
export const showWarningToast = (
  title: string,
  description?: string,
  duration = 4000
) => {
  const toastResult = toast({
    title: (
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        {title}
      </div>
    ),
    description,
  })

  // 手动设置自动关闭
  setTimeout(() => {
    toastResult.dismiss()
  }, duration)
}

// 信息提示
export const showInfoToast = (
  title: string,
  description?: string,
  duration = 3000
) => {
  const toastResult = toast({
    title,
    description,
  })

  // 手动设置自动关闭
  setTimeout(() => {
    toastResult.dismiss()
  }, duration)
}