import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  TrendingUp, 
  Package, 
  FileText, 
  BarChart3, 
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import ProductAnalysis from './ProductAnalysis';
import ContentGeneration from './ContentGeneration';
import MarketingStrategy from './MarketingStrategy';
import PerformanceTracking from './PerformanceTracking';
import { CreateTaskDialog } from './CreateTaskDialog';
import type { OperationTask, OperationTaskStatus, OperationTaskType } from '../../types/operations';
import type { CreateTaskRequest } from '../../types/task';

export function OperationsPage() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [tasks, setTasks] = useState<OperationTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<OperationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<OperationTask | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<OperationTaskStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<OperationTaskType | 'all'>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
       
       // 检查API响应格式
       if (!result.success || !result.data || !result.data.tasks) {
         throw new Error('API响应格式错误');
       }
       
       const data = result.data;
       
       // 将后端数据转换为前端OperationTask格式
        const operationTasks: OperationTask[] = data.tasks.map((task: {
         _id?: string;
         task_id?: string;
         product_id: string;
         title?: string;
         status: string;
         created_at: string;
         updated_at: string;
         description?: string;
         config?: {
           data_collection?: {
             product_info?: {
               image_url?: string;
             };
           };
         };
       }) => ({
        id: task._id || task.task_id,
        productId: task.product_id,
        productName: task.title || `商品 ${task.product_id}`,
        productImage: task.config?.data_collection?.product_info?.image_url || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300',
        status: task.status === 'pending' ? 'pending' : 
               task.status === 'running' ? 'in_progress' : 
               task.status === 'completed' ? 'completed' : 
               task.status === 'failed' ? 'failed' : 'pending',
        type: 'full_operation',
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at),
        progress: {
          analysis: task.status === 'completed' ? 'completed' : task.status === 'running' ? 'in_progress' : 'pending',
          content: 'pending',
          marketing: 'pending',
          tracking: 'pending'
        },
        results: {
          analysisScore: 0,
          contentGenerated: 0,
          marketingPlansCreated: 0,
          performanceMetrics: null
        },
        description: task.description
      }));
      
      setTasks(operationTasks);
      setLoading(false);
    } catch (error) {
      console.error('加载任务失败:', error);
      setLoading(false);
      // 如果API调用失败，显示空列表
      setTasks([]);
    }
  };

  const getStatusColor = (status: OperationTaskStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: OperationTaskStatus) => {
    switch (status) {
      case 'pending': return '待处理';
      case 'in_progress': return '进行中';
      case 'completed': return '已完成';
      case 'failed': return '失败';
      default: return '未知';
    }
  };

  const handleCreateTask = () => {
    setShowCreateDialog(true);
  };

  const handleCreateTaskSubmit = async (taskData: CreateTaskRequest) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // 重新加载任务列表以获取最新数据
      await loadTasks();
      
      // 显示成功消息
      alert('任务创建成功！');
    } catch (error) {
      console.error('创建任务失败:', error);
      alert('创建任务失败，请重试');
    }
  };

  const handleTaskClick = (task: OperationTask) => {
    setSelectedTask(task);
    // 根据任务状态和类型切换到相应的标签页
    if (task.progress.analysis !== 'completed') {
      setActiveTab('analysis');
    } else if (task.progress.content !== 'completed' && task.progress.content !== 'skipped') {
      setActiveTab('content');
    } else if (task.progress.marketing !== 'completed' && task.progress.marketing !== 'skipped') {
      setActiveTab('marketing');
    } else {
      setActiveTab('tracking');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI运营助手</h1>
          <p className="text-muted-foreground mt-1">
            智能商品分析、内容生成、营销策略制定和效果跟踪
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadTasks}>
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleCreateTask}>
            <Plus className="w-4 h-4 mr-2" />
            新建任务
          </Button>
        </div>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">总任务数</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">进行中</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(t => t.status === 'in_progress').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">已完成</p>
                <p className="text-2xl font-bold">
                  {tasks.filter(t => t.status === 'completed').length}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">平均分析分数</p>
                <p className="text-2xl font-bold">
                  {tasks.length > 0 
                    ? Math.round(tasks.reduce((sum, t) => sum + (t.results.analysisScore || 0), 0) / tasks.length)
                    : 0
                  }
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 任务列表 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>运营任务</span>
                <Button variant="ghost" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div 
                      key={task.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTask?.id === task.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleTaskClick(task)}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={task.productImage}
                          alt={task.productName}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2 mb-1">
                            {task.productName}
                          </p>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(task.status)}>
                              {getStatusText(task.status)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {task.createdAt.toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            <div className={`w-2 h-2 rounded-full ${
                              task.progress.analysis === 'completed' ? 'bg-green-500' : 
                              task.progress.analysis === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className={`w-2 h-2 rounded-full ${
                              task.progress.content === 'completed' ? 'bg-green-500' : 
                              task.progress.content === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className={`w-2 h-2 rounded-full ${
                              task.progress.marketing === 'completed' ? 'bg-green-500' : 
                              task.progress.marketing === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className={`w-2 h-2 rounded-full ${
                              task.progress.tracking === 'completed' ? 'bg-green-500' : 
                              task.progress.tracking === 'in_progress' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 主要工作区域 */}
        <div className="lg:col-span-2">
          {selectedTask ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="analysis" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  商品分析
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  内容生成
                </TabsTrigger>
                <TabsTrigger value="marketing" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  营销策略
                </TabsTrigger>
                <TabsTrigger value="tracking" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  效果跟踪
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="analysis" className="mt-6">
                <ProductAnalysis task={selectedTask} />
              </TabsContent>
              
              <TabsContent value="content" className="mt-6">
                <ContentGeneration task={selectedTask} />
              </TabsContent>
              
              <TabsContent value="marketing" className="mt-6">
                <MarketingStrategy task={selectedTask} />
              </TabsContent>
              
              <TabsContent value="tracking" className="mt-6">
                <PerformanceTracking task={selectedTask} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  选择一个运营任务
                </h3>
                <p className="text-gray-500 mb-6">
                  从左侧列表中选择一个任务开始工作，或创建新的运营任务
                </p>
                <Button onClick={handleCreateTask}>
                  <Plus className="w-4 h-4 mr-2" />
                  创建新任务
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* 创建任务对话框 */}
      <CreateTaskDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateTask={handleCreateTaskSubmit}
      />
    </div>
  );
}

export default OperationsPage;