'use client';

import { useEffect } from 'react';
import { useSystemStore, useTaskStore, useNotificationStore } from '@/store';
import { useAnalytics } from '@/hooks';
import { AnimatedStatCard } from '@/components/ui/animated-stat-card';
import { AnimatedTaskItem } from '@/components/ui/animated-task-item';
import { AnimatedSystemStatus } from '@/components/ui/animated-system-status';
import { AnimatedCard } from '@/components/ui/animated-card';
import { 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Package,
  Activity,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { systemStatus, setSystemStatus } = useSystemStore();
  const { tasks, activeTasks, addTask } = useTaskStore();
  const { addNotification } = useNotificationStore();
  const { data: analytics, isLoading } = useAnalytics();

  // 添加一些示例数据和通知
  useEffect(() => {
    // 模拟系统状态
    setSystemStatus({
      cpu: 45,
      memory: 67,
      disk: 32,
      network: {
        upload: 1.2,
        download: 5.8,
      },
      services: {
        backend: true,
        scriptsService: true,
        database: true,
        redis: false,
      },
    });

    // 添加示例通知
    addNotification({
      type: 'success',
      title: '任务完成',
      message: '商品抓取任务已成功完成，共获取2,345个商品信息',
    });

    addNotification({
      type: 'warning',
      title: '系统提醒',
      message: 'Redis服务连接异常，请检查服务状态',
    });

    addNotification({
      type: 'info',
      title: '新功能上线',
      message: '智能价格分析功能已上线，欢迎体验',
    });

    // 添加示例任务
    addTask({
      id: '1',
      name: '京东商品抓取',
      type: 'crawler',
      status: 'running',
      progress: 75,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    addTask({
      id: '2',
      name: '商品价格分析',
      type: 'analysis',
      status: 'pending',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }, [setSystemStatus, addNotification, addTask]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 dark:text-gray-400 animate-pulse">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8">
      {/* 页面标题 */}
      <AnimatedCard delay={0} className="text-center bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Sparkles className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            仪表板
          </h1>
          <Sparkles className="h-8 w-8 text-purple-600 dark:text-purple-400 animate-pulse animation-delay-500" />
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-400 animate-fade-in">
          欢迎使用电商AI自动化平台 ✨
        </p>
      </AnimatedCard>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 max-w-7xl mx-auto">
        <AnimatedStatCard
          title="总任务数"
          value={analytics?.totalTasks || 156}
          icon={ClipboardList}
          color="blue"
          delay={200}
          trend={{
            value: 12.5,
            type: "up",
            label: "较上周"
          }}
        />

        <AnimatedStatCard
          title="已完成任务"
          value={analytics?.completedTasks || 142}
          icon={CheckCircle}
          color="green"
          delay={300}
          trend={{
            value: 8.3,
            type: "up",
            label: "较上周"
          }}
        />

        <AnimatedStatCard
          title="运行中任务"
          value={analytics?.runningTasks || 3}
          icon={Clock}
          color="yellow"
          delay={400}
          trend={{
            value: 2.1,
            type: "down",
            label: "较上周"
          }}
        />

        <AnimatedStatCard
          title="产品总数"
          value={analytics?.totalProducts || 12845}
          icon={Package}
          color="purple"
          delay={500}
          trend={{
            value: 24.6,
            type: "up",
            label: "较上周"
          }}
        />
      </div>

      {/* 系统状态 */}
      <AnimatedSystemStatus
        systemStatus={systemStatus || {
          cpu: 45,
          memory: 67,
          disk: 32,
          network: {
            upload: 1.2,
            download: 5.8
          },
          services: {
            backend: true,
            scriptsService: true,
            database: true,
            redis: false
          }
        }}
        delay={600}
      />

      {/* 最近任务 */}
      <AnimatedCard
        delay={800}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-lg">
            <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            最近任务
          </h2>
          <div className="ml-auto px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm font-medium rounded-full">
            {activeTasks.length} 个活动任务
          </div>
        </div>
        
        <div className="space-y-4">
          {activeTasks.slice(0, 5).map((task, index) => (
            <AnimatedTaskItem
              key={task.id}
              task={task}
              delay={900 + index * 100}
            />
          ))}
          
          {activeTasks.length === 0 && (
            <AnimatedCard
              delay={1000}
              className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600"
            >
              <Activity className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-500 animate-pulse" />
              <p className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2">
                暂无活动任务
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                创建新任务来开始自动化流程 🚀
              </p>
            </AnimatedCard>
          )}
        </div>
      </AnimatedCard>
    </div>
  );
}