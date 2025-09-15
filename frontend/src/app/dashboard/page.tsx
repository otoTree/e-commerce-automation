'use client';

import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { TrendingUp, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ComponentType<{ className?: string }>;
}

function StatCard({ title, value, change, changeType, icon: Icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center pt-1">
          <TrendingUp
            className={`h-4 w-4 mr-1 ${
              changeType === 'positive' ? 'text-green-500' : 'text-red-500'
            }`}
          />
          <Badge
            variant={changeType === 'positive' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {change}
          </Badge>
          <span className="text-xs text-muted-foreground ml-2">较上月</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface RecentActivityItem {
  id: string;
  action: string;
  product: string;
  time: string;
  status: 'success' | 'pending' | 'failed';
}

function RecentActivity() {
  const activities: RecentActivityItem[] = [
    {
      id: '1',
      action: '新增商品',
      product: 'iPhone 15 Pro',
      time: '2分钟前',
      status: 'success',
    },
    {
      id: '2',
      action: '更新库存',
      product: 'MacBook Air M2',
      time: '15分钟前',
      status: 'success',
    },
    {
      id: '3',
      action: '处理订单',
      product: 'AirPods Pro',
      time: '1小时前',
      status: 'pending',
    },
    {
      id: '4',
      action: '商品下架',
      product: 'iPad Mini',
      time: '2小时前',
      status: 'failed',
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>最近活动</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={activity.id}>
            <div className="flex items-center justify-between py-2">
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.product}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-muted-foreground">{activity.time}</span>
                <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                  {activity.status === 'success' && '成功'}
                  {activity.status === 'pending' && '处理中'}
                  {activity.status === 'failed' && '失败'}
                </Badge>
              </div>
            </div>
            {index < activities.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const stats = [
    {
      title: '总销售额',
      value: '¥124,563',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: '商品总数',
      value: '1,234',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      title: '订单数量',
      value: '856',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: '活跃用户',
      value: '2,345',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: Users,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表盘</h1>
        <p className="text-gray-600 mt-1">欢迎回来，查看您的业务概况</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>销售趋势</CardTitle>
            <CardDescription>过去30天的销售数据分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">图表区域 - 可集成 Chart.js 或其他图表库</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用功能快捷入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
              <Package className="h-5 w-5" />
              <span>添加商品</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
              <ShoppingCart className="h-5 w-5" />
              <span>处理订单</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col space-y-2">
              <Users className="h-5 w-5" />
              <span>用户管理</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
}