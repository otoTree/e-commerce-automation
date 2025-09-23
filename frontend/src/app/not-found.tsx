'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Home, Search, ArrowLeft, FileQuestion } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <FileQuestion className="w-8 h-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">页面未找到</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
            <p className="text-muted-foreground">
              抱歉，您访问的页面不存在或已被移动
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              可能的原因：
            </p>
            <ul className="text-sm text-muted-foreground text-left space-y-1">
              <li>• 页面链接已过期</li>
              <li>• 页面已被删除或移动</li>
              <li>• 输入的网址有误</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回上页
            </Button>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              需要帮助？请联系技术支持
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}