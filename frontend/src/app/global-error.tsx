'use client'

import { useEffect } from 'react'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // 记录全局错误
    console.error('全局错误:', error)
  }, [error])

  const reloadPage = () => {
    window.location.reload()
  }

  const goHome = () => {
    window.location.href = '/'
  }

  return (
    <html lang="zh-CN">
      <body className="antialiased font-sans">
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              应用遇到严重错误
            </h1>
            
            <p className="text-gray-600 mb-6">
              很抱歉，应用遇到了严重的错误。请尝试重新加载页面。
            </p>

            <div className="bg-gray-100 p-3 rounded-lg mb-6 text-left">
              <p className="text-sm font-medium text-gray-700 mb-1">错误信息:</p>
              <p className="text-sm text-gray-600 font-mono break-all">
                {error.message || '未知错误'}
              </p>
              {error.digest && (
                <p className="text-xs text-gray-500 mt-2">
                  错误ID: {error.digest}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <button
                onClick={reset}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                重试
              </button>
              
              <button
                onClick={reloadPage}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
              >
                重新加载页面
              </button>
              
              <button
                onClick={goHome}
                className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                返回首页
              </button>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                错误时间: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}