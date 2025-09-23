'use client'

import React, { useState } from 'react'
import { useAuth } from '../../store/authInitializer'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'

interface LoginFormData {
  username: string
  password: string
}

interface LoginFormProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

const initialFormData: LoginFormData = {
  username: '',
  password: ''
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSuccess, 
  onError 
}) => {
  const { login } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>(initialFormData)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }))
    // 清除错误信息
    if (error) setError('')
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    
    if (!formData.username || !formData.password) {
      const errorMsg = '请填写用户名和密码'
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    try {
      setLoading(true)
      await login(formData.username, formData.password)
      
      // 登录成功
      setFormData(initialFormData)
      onSuccess?.()
    } catch (err) {
      const errorMsg = '登录过程中发生错误'
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
          电商AI助手登录
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange('username')}
              placeholder="请输入用户名"
              disabled={loading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="请输入密码"
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default LoginForm