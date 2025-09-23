'use client'

import { AuthProvider } from '@/store/authStore'
import { Toaster } from '@/components/ui/toaster'
import ErrorBoundary from '@/components/ui/error-boundary'

interface ClientLayoutProps {
  children: React.ReactNode
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <ErrorBoundary
      showDetails={process.env.NODE_ENV === 'development'}
      onError={(error, errorInfo) => {
        // 在生产环境中，可以将错误发送到错误监控服务
        console.error('应用错误:', error, errorInfo)
        
        // 这里可以集成错误监控服务，如 Sentry
        // if (process.env.NODE_ENV === 'production') {
        //   Sentry.captureException(error, { contexts: { errorInfo } })
        // }
      }}
    >
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  )
}