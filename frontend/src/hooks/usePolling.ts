import { useCallback, useRef, useEffect } from 'react'

interface PollingOptions<T> {
  interval?: number
  maxAttempts?: number
  onSuccess?: (result: T) => void
  onError?: (error: Error) => void
  onProgress?: (attempt: number, maxAttempts: number) => void
}

export const usePolling = () => {
  const pollingRef = useRef<NodeJS.Timeout | null>(null)
  const isPollingRef = useRef(false)

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current)
      pollingRef.current = null
    }
    isPollingRef.current = false
  }, [])

  const startPolling = useCallback(async <T>(
    pollFunction: () => Promise<T>,
    options: PollingOptions<T> = {}
  ) => {
    const {
      interval = 5000,
      maxAttempts = 10,
      onSuccess,
      onError,
      onProgress
    } = options

    // 停止之前的轮询
    stopPolling()
    isPollingRef.current = true

    let attempt = 0
    let lastError: Error | null = null

    const poll = async () => {
      if (!isPollingRef.current || attempt >= maxAttempts) {
        if (attempt >= maxAttempts && lastError) {
          onError?.(lastError || new Error('轮询超时'))
        }
        return
      }

      attempt++
      onProgress?.(attempt, maxAttempts)

      try {
        const result = await pollFunction()
        if (result && (result as { success?: boolean }).success) {
          stopPolling()
          onSuccess?.(result)
          return
        }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('未知错误')
        
        // 如果是404或网络错误，继续轮询
        if (!lastError.message.includes('404') && !lastError.message.includes('Failed to fetch')) {
          stopPolling()
          onError?.(lastError)
          return
        }
      }

      // 继续下一次轮询
      if (isPollingRef.current) {
        pollingRef.current = setTimeout(poll, interval)
      }
    }

    // 开始轮询
    poll()
  }, [stopPolling])

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [stopPolling])

  return {
    startPolling,
    stopPolling,
    isPolling: () => isPollingRef.current
  }
}