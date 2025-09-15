import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Activity,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import type { DashboardStats, ChartDataPoint } from '../../types';

interface DashboardProps {
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ReactNode;
  description?: string;
}

function StatCard({ title, value, change, icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground">
            {change.type === 'increase' ? (
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1 text-red-500" />
            )}
            <span className={change.type === 'increase' ? 'text-green-500' : 'text-red-500'}>
              {change.value > 0 ? '+' : ''}{change.value}%
            </span>
            <span className="ml-1">较上期</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

interface TaskProgressProps {
  title: string;
  completed: number;
  total: number;
  type: 'success' | 'warning' | 'error';
}

function TaskProgress({ title, completed, total, type }: TaskProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  const colorClass = {
    success: 'text-green-600',
    warning: 'text-orange-600',
    error: 'text-red-600',
  }[type];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title}</span>
        <span className={`text-sm ${colorClass}`}>
          {completed}/{total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}

interface RecentActivityItem {
  id: string;
  type: 'product' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

function RecentActivity({ activities }: { activities: RecentActivityItem[] }) {
  const getIcon = (type: string, status: string) => {
    if (type === 'product') return <Package className="w-4 h-4" />;
    if (type === 'task') return <CheckCircle className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-orange-600';
      case 'error': return 'text-red-600';
      default: return 'text-blue-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className={`mt-1 ${getStatusColor(activity.status)}`}>
            {getIcon(activity.type, activity.status)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {activity.title}
            </p>
            <p className="text-sm text-gray-500">
              {activity.description}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {formatTime(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ className }: DashboardProps) {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // 模拟数据 - 实际应用中应该从API获取
  const [stats, setStats] = useState({
    totalProducts: 1248,
    totalRevenue: 89432.50,
    totalOrders: 342,
    activeUsers: 128,
    pendingTasks: 23,
    completedTasks: 156,
    failedTasks: 8,
    systemHealth: 98.5,
  });

  const [recentActivities] = useState<RecentActivityItem[]>([
    {
      id: '1',
      type: 'product',
      title: '商品信息更新',
      description: '成功更新了 15 个商品的价格信息',
      timestamp: new Date(Date.now() - 300000), // 5分钟前
      status: 'success',
    },
    {
      id: '2',
      type: 'task',
      title: '内容优化任务完成',
      description: '商品 SKU-12345 的内容优化任务已完成',
      timestamp: new Date(Date.now() - 900000), // 15分钟前
      status: 'success',
    },
    {
      id: '3',
      type: 'system',
      title: '系统维护',
      description: '定期数据备份已完成',
      timestamp: new Date(Date.now() - 1800000), // 30分钟前
      status: 'info',
    },
    {
      id: '4',
      type: 'task',
      title: '翻译任务失败',
      description: '商品 SKU-67890 的翻译任务执行失败',
      timestamp: new Date(Date.now() - 3600000), // 1小时前
      status: 'error',
    },
  ]);

  const handleRefresh = async () => {
    setLoading(true);
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLastUpdated(new Date());
    setLoading(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(amount);
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">仪表板</h1>
          <p className="text-muted-foreground mt-2">
            实时监控系统运行状态和业务数据
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">今天</SelectItem>
              <SelectItem value="7d">最近7天</SelectItem>
              <SelectItem value="30d">最近30天</SelectItem>
              <SelectItem value="90d">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* 最后更新时间 */}
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="w-4 h-4 mr-2" />
        最后更新: {lastUpdated.toLocaleString('zh-CN')}
      </div>

      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="商品总数"
          value={stats.totalProducts.toLocaleString()}
          change={{ value: 12.5, type: 'increase' }}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
          description="已上架商品数量"
        />
        
        <StatCard
          title="总收入"
          value={formatCurrency(stats.totalRevenue)}
          change={{ value: 8.2, type: 'increase' }}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="累计销售收入"
        />
        
        <StatCard
          title="订单数量"
          value={stats.totalOrders.toLocaleString()}
          change={{ value: -2.1, type: 'decrease' }}
          icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
          description="总订单数量"
        />
        
        <StatCard
          title="活跃用户"
          value={stats.activeUsers.toLocaleString()}
          change={{ value: 15.3, type: 'increase' }}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="当前活跃用户数"
        />
      </div>

      {/* 任务状态和系统健康 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 任务执行状态 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              任务执行状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <TaskProgress
              title="已完成任务"
              completed={stats.completedTasks}
              total={stats.completedTasks + stats.pendingTasks + stats.failedTasks}
              type="success"
            />
            <TaskProgress
              title="待处理任务"
              completed={stats.pendingTasks}
              total={stats.completedTasks + stats.pendingTasks + stats.failedTasks}
              type="warning"
            />
            <TaskProgress
              title="失败任务"
              completed={stats.failedTasks}
              total={stats.completedTasks + stats.pendingTasks + stats.failedTasks}
              type="error"
            />
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">总体完成率</span>
                <Badge variant="secondary">
                  {Math.round((stats.completedTasks / (stats.completedTasks + stats.pendingTasks + stats.failedTasks)) * 100)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 系统健康状态 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              系统健康状态
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">系统可用性</span>
                <span className="text-sm font-bold text-green-600">
                  {stats.systemHealth}%
                </span>
              </div>
              <Progress value={stats.systemHealth} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <div className="text-xs text-muted-foreground">API 响应率</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">45ms</div>
                <div className="text-xs text-muted-foreground">平均响应时间</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center pt-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                系统运行正常
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 最近活动 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            最近活动
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentActivities.length > 0 ? (
            <RecentActivity activities={recentActivities} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>暂无最近活动</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;