'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Database, 
  Package, 
  BarChart3, 
  TrendingUp,
  Activity,
  Users
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    name: '收集的商品',
    value: '1,234',
    change: '+12%',
    changeType: 'positive' as const,
    icon: Package,
  },
  {
    name: '分析任务',
    value: '89',
    change: '+5%',
    changeType: 'positive' as const,
    icon: BarChart3,
  },
  {
    name: '活跃数据源',
    value: '12',
    change: '+2',
    changeType: 'positive' as const,
    icon: Database,
  },
  {
    name: '系统状态',
    value: '正常',
    change: '99.9%',
    changeType: 'positive' as const,
    icon: Activity,
  },
]

const quickActions = [
  {
    title: '收集商品数据',
    description: '从1688、OZON等平台收集商品信息',
    href: '/data-collection',
    icon: Database,
    color: 'bg-blue-500',
  },
  {
    title: '管理商品',
    description: '查看和管理已收集的商品数据',
    href: '/products',
    icon: Package,
    color: 'bg-green-500',
  },
  {
    title: '数据分析',
    description: '分析商品市场热度和竞争力',
    href: '/analysis',
    icon: BarChart3,
    color: 'bg-purple-500',
  },
  {
    title: '源码提取测试',
    description: '测试浏览器插件获取网页源码功能',
    href: '/dashboard/source-extraction',
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
]

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600">欢迎使用电商AI助手，这里是您的数据概览</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className="h-4 w-4 flex-shrink-0 self-center" />
                        <span className="ml-1">{stat.change}</span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 快速操作 */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action) => (
            <Card key={action.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{action.description}</p>
                <Link href={action.href}>
                  <Button className="w-full">
                    开始使用
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle>最近活动</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Database className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  收集了新的商品数据
                </p>
                <p className="text-sm text-gray-500">
                  从1688平台收集了25个商品信息
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                2小时前
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  完成了批量分析任务
                </p>
                <p className="text-sm text-gray-500">
                  分析了15个商品的市场竞争力
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                4小时前
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <Package className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  更新了商品信息
                </p>
                <p className="text-sm text-gray-500">
                  更新了8个商品的价格和库存信息
                </p>
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                6小时前
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}