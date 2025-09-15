'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Activity, AlertTriangle, Wifi, WifiOff } from 'lucide-react';

import { Layout } from '../../components/layout/Layout';

interface ExtensionHealth {
  id: string;
  status: 'online' | 'warning' | 'offline';
  lastSeen: string;
  minutesAgo: number;
  userAgent?: string;
}

interface HealthData {
  extensions: ExtensionHealth[];
  totalCount: number;
  onlineCount: number;
  warningCount: number;
  offlineCount: number;
}

interface HealthResponse {
  success: boolean;
  data: HealthData;
  timestamp: string;
}

export default function CrawlerHealthPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');


  const fetchHealthData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/extension/health');
      if (response.ok) {
        const data: HealthResponse = await response.json();
        if (data.success) {
          setHealthData(data.data);
          setLastUpdated(new Date().toLocaleString());
        }
      } else {
        console.error('API请求失败:', response.status);
      }
    } catch (error) {
      console.error('获取健康数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    // 每30秒自动刷新一次
    const interval = setInterval(fetchHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      online: 'default',
      warning: 'secondary',
      offline: 'destructive'
    } as const;
    
    const labels = {
      online: '在线',
      warning: '警告',
      offline: '离线'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const formatLastSeen = (lastSeen: string, minutesAgo: number) => {
    if (minutesAgo < 1) {
      return '刚刚';
    } else if (minutesAgo < 60) {
      return `${minutesAgo}分钟前`;
    } else {
      const hoursAgo = Math.floor(minutesAgo / 60);
      return `${hoursAgo}小时前`;
    }
  };

  if (loading && !healthData) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
          <span className="ml-2">加载中...</span>
        </div>
      </div>
    );
  }

  return (
<Layout>
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">爬虫设备健康监控</h1>
          <p className="text-muted-foreground mt-2">
            监控所有已注册的浏览器扩展的运行状态
          </p>
        </div>
        <Button onClick={fetchHealthData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总设备数</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthData?.totalCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">在线设备</CardTitle>
            <Wifi className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{healthData?.onlineCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">警告设备</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{healthData?.warningCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">离线设备</CardTitle>
            <WifiOff className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{healthData?.offlineCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* 设备列表 */}
      <Card>
        <CardHeader>
          <CardTitle>设备详情</CardTitle>
          <CardDescription>
            最后更新时间: {lastUpdated}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!healthData?.extensions?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无已注册的爬虫设备
            </div>
          ) : (
            <div className="space-y-4">
              {healthData.extensions.map((extension) => (
                <div
                  key={extension.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(extension.status)}
                    <div>
                      <div className="font-medium">{extension.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {extension.userAgent || '未知浏览器'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatLastSeen(extension.lastSeen, extension.minutesAgo)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(extension.lastSeen).toLocaleString()}
                      </div>
                    </div>
                    {getStatusBadge(extension.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
</Layout>
  );
}