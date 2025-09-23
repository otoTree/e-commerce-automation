'use client'

import React, { useState } from 'react'
import { useAuth } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { RegisterRequest } from '../../types'

interface RegisterFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
  onSwitchToLogin?: () => void
}

const initialFormData: RegisterRequest = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  phone: ''
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validatePassword = (password: string): string[] => {
  const errors: string[] = []
  if (password.length < 8) {
    errors.push('密码至少需要8个字符')
  }
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('密码需要包含小写字母')
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('密码需要包含大写字母')
  }
  if (!/(?=.*\d)/.test(password)) {
    errors.push('密码需要包含数字')
  }
  return errors
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSuccess, 
  onError,
  onSwitchToLogin
}) => {
  const { register } = useAuth()
  const { addUser } = useUserStore()
  const [formData, setFormData] = useState<RegisterRequest>(initialFormData)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (field: 'username' | 'email' | 'password' | 'confirmPassword' | 'firstName' | 'lastName' | 'phone') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // 清除错误信息
    if (error) setError('')
  }

  const validateForm = (): string | null => {
    const { username, email, password, confirmPassword } = formData

    if (!username.trim()) {
      return '请输入用户名'
    }

    if (username.length < 3) {
      return '用户名至少需要3个字符'
    }

    if (!email.trim()) {
      return '请输入邮箱地址'
    }

    if (!validateEmail(email)) {
      return '请输入有效的邮箱地址'
    }

    if (!password) {
      return '请输入密码'
    }

    const passwordErrors = validatePassword(password)
    if (passwordErrors.length > 0) {
      return passwordErrors[0]
    }

    if (password !== confirmPassword) {
      return '两次输入的密码不一致'
    }

    return null
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      onError?.(validationError)
      return
    }

    try {
      setLoading(true)
      
      // 使用认证store的register方法
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone
      })

      if (result.success) {
        // 添加用户到本地状态
        const newUser = {
          id: Date.now().toString(), // 临时ID，实际应该从后端返回
          username: formData.username,
          email: formData.email,
          role: 'user' as const,
          avatar: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        addUser(newUser)
        
        setFormData(initialFormData)
        onSuccess?.()
      } else {
        const errorMsg = result.error || '注册失败，请检查输入信息或稍后重试'
        setError(errorMsg)
        onError?.(errorMsg)
      }
    } catch (err) {
      const errorMsg = '注册过程中发生错误，请重试'
      setError(errorMsg)
      onError?.(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold">
          注册电商AI助手
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">名字</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange('firstName')}
                placeholder="请输入名字"
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">姓氏</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange('lastName')}
                placeholder="请输入姓氏"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">用户名 *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder="请输入用户名（至少3个字符）"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱地址 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="请输入邮箱地址"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">手机号码</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              placeholder="请输入手机号码"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码 *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="请输入密码（至少8位，包含大小写字母和数字）"
              disabled={loading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认密码 *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              placeholder="请再次输入密码"
              disabled={loading}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </Button>
          
          {onSwitchToLogin && (
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                onClick={onSwitchToLogin}
                disabled={loading}
                className="text-sm"
              >
                已有账户？点击登录
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default RegisterForm