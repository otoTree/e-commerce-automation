'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useDataCollection } from '@/hooks/useProductsOptimized'
import { LinkIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface SingleProductCollectorProps {
  onTaskCreated?: (taskId: string) => void
}

export const SingleProductCollector: React.FC<SingleProductCollectorProps> = ({ onTaskCreated }) => {
  const [url, setUrl] = useState('')
  const [platform, setPlatform] = useState('other')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { collectProduct } = useDataCollection()

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!url.trim()) {
      setMessage({ type: 'error', text: '请输入商品URL' })
      return
    }

    if (!validateUrl(url)) {
      setMessage({ type: 'error', text: '请输入有效的URL格式' })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await collectProduct(url, platform)
      
      if (result.success) {
        setMessage({ type: 'success', text: `收集任务已创建，任务ID: ${result.task_id}` })
        setUrl('')
        onTaskCreated?.(result.task_id)
      } else {
        setMessage({ type: 'error', text: result.error || '收集任务创建失败' })
      }
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '收集任务创建失败' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    if (message) setMessage(null)
  }

  const detectPlatform = (url: string): string => {
    if (url.includes('1688.com')) return 'alibaba'
    if (url.includes('ozon.ru')) return 'ozon'
    if (url.includes('taobao.com') || url.includes('tmall.com')) return 'taobao'
    return 'other'
  }

  const handleUrlBlur = () => {
    if (url && validateUrl(url)) {
      const detectedPlatform = detectPlatform(url)
      if (detectedPlatform !== 'other') {
        setPlatform(detectedPlatform)
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          单品收集
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-url">商品URL</Label>
            <Input
              id="product-url"
              type="url"
              placeholder="请输入商品页面URL，如：https://detail.1688.com/offer/..."
              value={url}
              onChange={handleUrlChange}
              onBlur={handleUrlBlur}
              disabled={isSubmitting}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">平台</Label>
            <Select value={platform} onValueChange={setPlatform} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="选择平台" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alibaba">1688 (阿里巴巴)</SelectItem>
                <SelectItem value="ozon">OZON</SelectItem>
                <SelectItem value="taobao">淘宝/天猫</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <Button 
            type="submit" 
            disabled={isSubmitting || !url.trim()}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                创建收集任务...
              </>
            ) : (
              '开始收集'
            )}
          </Button>
        </form>

        <div className="mt-4 text-sm text-gray-600">
          <p className="font-medium mb-2">支持的平台：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>1688 (阿里巴巴) - 自动检测</li>
            <li>OZON - 俄罗斯电商平台</li>
            <li>淘宝/天猫 - 自动检测</li>
            <li>其他电商平台</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}