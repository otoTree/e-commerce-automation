'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useDataCollection } from '@/hooks/useProductsOptimized'
import { SingleProductCollector } from '@/components/data-collection/SingleProductCollector'
import { 
  Database, 
  Plus, 
  Upload, 
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Search,
  Tag,
  X
} from 'lucide-react'

interface Task {
  id: string
  type: 'single' | 'batch' | 'keyword'
  url?: string
  urls?: string[]
  keywords?: string[]
  platform?: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  createdAt: string
  results?: number
}

export default function DataCollectionPage() {
  const [singleUrl, setSingleUrl] = useState('')
  const [platform, setPlatform] = useState('other')
  const [batchUrls, setBatchUrls] = useState('')
  
  // 关键词收集相关状态
  const [keywordInput, setKeywordInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordPlatform, setKeywordPlatform] = useState('alibaba')
  const [maxResults, setMaxResults] = useState(50)
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  
  const [tasks, setTasks] = useState<Task[]>([])
  
  const { collectProduct, batchCollect, collectByKeywords, getTaskStatus, loading, error } = useDataCollection()

  // 处理任务创建
  const handleTaskCreated = (taskId: string) => {
    setTasks(prev => [...prev, {
      id: taskId,
      type: 'single',
      status: 'pending',
      createdAt: new Date().toISOString(),
      results: 0
    }])
  }

  // 添加关键词
  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords(prev => [...prev, keywordInput.trim()])
      setKeywordInput('')
    }
  }

  // 删除关键词
  const removeKeyword = (keyword: string) => {
    setKeywords(prev => prev.filter(k => k !== keyword))
  }

  // 处理关键词输入的回车事件
  const handleKeywordKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  // 关键词收集
  const handleKeywordCollect = async () => {
    if (keywords.length === 0) return
    
    try {
      const result = await collectByKeywords(keywords, keywordPlatform, {
        maxResults,
        priceRange: priceRange.min || priceRange.max ? priceRange : undefined,
        sortBy: 'relevance'
      })
      
      if (result.success) {
        setTasks(prev => [...prev, {
          id: result.task_id,
          type: 'keyword',
          keywords: [...keywords],
          platform: keywordPlatform,
          status: 'pending',
          createdAt: new Date().toISOString(),
          results: 0
        }])
        
        // 清空表单
        setKeywords([])
        setKeywordInput('')
      }
    } catch (err) {
      console.error('关键词收集失败:', err)
    }
  }

  const handleSingleCollect = async () => {
    if (!singleUrl.trim()) return
    
    try {
      const result = await collectProduct(singleUrl, platform)
      if (result.success) {
        setTasks(prev => [...prev, {
          id: result.task_id,
          type: 'single',
          url: singleUrl,
          platform,
          status: 'pending',
          createdAt: new Date().toISOString()
        }])
        setSingleUrl('')
      }
    } catch (err) {
      console.error('收集失败:', err)
    }
  }

  const handleBatchCollect = async () => {
    const urls = batchUrls.split('\n').filter(url => url.trim())
    if (urls.length === 0) return
    
    try {
      const result = await batchCollect(urls)
      if (result.success) {
        setTasks(prev => [...prev, {
          id: result.task_id,
          type: 'batch',
          urls,
          status: 'pending',
          createdAt: new Date().toISOString()
        }])
        setBatchUrls('')
      }
    } catch (err) {
      console.error('批量收集失败:', err)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'running':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Database className="h-6 w-6 mr-2" />
          数据收集
        </h1>
        <p className="text-gray-600">从各大电商平台收集商品数据</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="single" className="space-y-4">
        <TabsList>
          <TabsTrigger value="single">单个收集</TabsTrigger>
          <TabsTrigger value="batch">批量收集</TabsTrigger>
          <TabsTrigger value="keyword">关键词收集</TabsTrigger>
        </TabsList>

        <TabsContent value="single">
          <SingleProductCollector onTaskCreated={handleTaskCreated} />
        </TabsContent>

        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                批量商品收集
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="batch-urls">商品链接列表</Label>
                <Textarea
                  id="batch-urls"
                  placeholder="请输入商品链接，每行一个链接"
                  rows={8}
                  value={batchUrls}
                  onChange={(e) => setBatchUrls(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  每行输入一个商品链接，支持1688、OZON等平台
                </p>
              </div>
              <Button 
                onClick={handleBatchCollect} 
                disabled={loading || !batchUrls.trim()}
                className="w-full md:w-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                批量收集
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keyword">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                关键词收集
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 关键词输入区域 */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="keyword-input">搜索关键词</Label>
                  <div className="flex gap-2">
                    <Input
                      id="keyword-input"
                      placeholder="输入关键词后按回车或点击添加"
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyPress={handleKeywordKeyPress}
                    />
                    <Button 
                      onClick={addKeyword}
                      disabled={!keywordInput.trim()}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 已添加的关键词 */}
                {keywords.length > 0 && (
                  <div>
                    <Label>已添加的关键词</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 搜索配置 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="keyword-platform">搜索平台</Label>
                  <Select value={keywordPlatform} onValueChange={setKeywordPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择平台" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alibaba">1688</SelectItem>
                      <SelectItem value="ozon">OZON</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                      <SelectItem value="taobao">淘宝</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="max-results">最大结果数</Label>
                  <Select value={maxResults.toString()} onValueChange={(value) => setMaxResults(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择结果数量" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                      <SelectItem value="200">200</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 价格范围 */}
              <div>
                <Label>价格范围（可选）</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Input
                    placeholder="最低价格"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    type="number"
                  />
                  <Input
                    placeholder="最高价格"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    type="number"
                  />
                </div>
              </div>

              <Button 
                onClick={handleKeywordCollect} 
                disabled={loading || keywords.length === 0}
                className="w-full md:w-auto"
              >
                <Search className="h-4 w-4 mr-2" />
                开始关键词收集
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {tasks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>收集任务</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(task.status)}
                      <span className="font-medium">
                        任务 #{task.id?.slice(-8)}
                      </span>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === 'pending' && '待处理'}
                        {task.status === 'running' && '进行中'}
                        {task.status === 'completed' && '已完成'}
                        {task.status === 'failed' && '失败'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  {task.type === 'single' ? (
                    <div>
                      <p className="text-sm text-gray-600">
                        平台: {task.platform} | 链接: {task.url}
                      </p>
                    </div>
                  ) : task.type === 'batch' ? (
                    <div>
                      <p className="text-sm text-gray-600">
                        批量收集 ({task.urls?.length} 个链接)
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600">
                        关键词收集 | 平台: {task.platform} | 关键词: {task.keywords?.join(', ')}
                      </p>
                      {task.results !== undefined && (
                        <p className="text-sm text-green-600 mt-1">
                          已收集 {task.results} 个商品
                        </p>
                      )}
                    </div>
                  )}
                  
                  {task.status === 'running' && (
                    <div className="mt-2">
                      <Progress value={33} className="w-full" />
                      <p className="text-xs text-gray-500 mt-1">处理中...</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-sm text-gray-600">
            <h4 className="font-medium mb-2">支持的平台：</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>1688 (阿里巴巴) - 支持商品详情页链接和关键词搜索</li>
              <li>OZON - 支持商品页面链接和关键词搜索</li>
              <li>Amazon - 支持关键词搜索</li>
              <li>淘宝 - 支持关键词搜索</li>
              <li>其他电商平台 - 通用数据提取</li>
            </ul>
            
            <h4 className="font-medium mt-4 mb-2">收集的数据包括：</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>商品基本信息（标题、价格、描述等）</li>
              <li>商品图片和规格参数</li>
              <li>销售数据（销量、评价等）</li>
              <li>供应商信息</li>
            </ul>

            <h4 className="font-medium mt-4 mb-2">关键词收集功能：</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>支持多个关键词同时搜索</li>
              <li>可设置价格范围过滤</li>
              <li>可控制搜索结果数量</li>
              <li>自动去重和数据清洗</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}