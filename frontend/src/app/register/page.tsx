'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSuccess = () => {
    setSuccess(true)
    setError('')
    // 3秒后跳转到登录页面
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess(false)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              注册成功！
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              您的账户已创建成功，即将跳转到登录页面...
            </p>
          </div>
          
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              注册成功！3秒后自动跳转到登录页面，或者您可以
              <Link href="/login" className="font-medium underline ml-1">
                立即登录
              </Link>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            电商AI助手
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            创建您的新账户
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <RegisterForm 
          onSuccess={handleSuccess}
          onError={handleError}
        />
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            已有账户？
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 ml-1"
            >
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}