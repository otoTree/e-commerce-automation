import { Router, type Request, type Response } from 'express';
import { TaskModel } from '../models/index.js';
import { generateTaskId } from '../utils/taskUtils.js';

const router = Router();

// 任务监控相关API接口类型定义
interface TaskListQuery {
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  type?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface TaskUpdateRequest {
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'paused';
  progress?: number;
}

interface TaskResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * 获取任务列表
 * GET /api/tasks
 */
const getTasks = async (req: Request<{}, TaskResponse, {}, TaskListQuery>, res: Response<TaskResponse>) => {
  try {
    const { 
      status, 
      type,
      page = 1, 
      limit = 20, 
      sort = '-meta.created_at' 
    } = req.query;
    
    const filter: any = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (type) {
      filter.type = type;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [tasks, total] = await Promise.all([
      TaskModel.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit))
        .select('task_id type status progress meta output input'),
      TaskModel.countDocuments(filter)
    ]);
    
    // 转换为前端期望的格式
    const formattedTasks = tasks.map(task => ({
      id: task.task_id,
      type: getTaskTypeLabel(task.type),
      name: getTaskName(task),
      status: task.status,
      progress: task.progress.percentage,
      createdAt: task.meta.created_at.toISOString(),
      updatedAt: task.meta.completed_at?.toISOString() || task.meta.started_at?.toISOString() || task.meta.created_at.toISOString(),
      results: task.output?.success_count || 0,
      errorMessage: task.output?.error_details,
      estimatedTime: calculateEstimatedTime(task),
      actualTime: task.meta.duration ? `${Math.round(task.meta.duration / 1000)}s` : undefined,
      metadata: {
        total_items: task.progress.total_items,
        processed_items: task.progress.processed_items,
        retry_count: task.meta.retry_count,
        max_retries: task.meta.max_retries
      }
    }));
    
    res.json({
      success: true,
      data: {
        tasks: formattedTasks,
        pagination: {
          current_page: Number(page),
          total_pages: Math.ceil(total / Number(limit)),
          total_items: total,
          items_per_page: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('获取任务列表失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取单个任务详情
 * GET /api/tasks/:taskId
 */
const getTaskById = async (req: Request<{ taskId: string }>, res: Response<TaskResponse>) => {
  try {
    const { taskId } = req.params;
    
    const task = await TaskModel.findOne({ task_id: taskId });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: '任务不存在' 
      });
    }
    
    // 转换为前端期望的格式
    const formattedTask = {
      id: task.task_id,
      type: getTaskTypeLabel(task.type),
      name: getTaskName(task),
      status: task.status,
      progress: task.progress.percentage,
      createdAt: task.meta.created_at.toISOString(),
      updatedAt: task.meta.completed_at?.toISOString() || task.meta.started_at?.toISOString() || task.meta.created_at.toISOString(),
      results: task.output?.success_count || 0,
      errorMessage: task.output?.error_details,
      estimatedTime: calculateEstimatedTime(task),
      actualTime: task.meta.duration ? `${Math.round(task.meta.duration / 1000)}s` : undefined,
      metadata: {
        total_items: task.progress.total_items,
        processed_items: task.progress.processed_items,
        retry_count: task.meta.retry_count,
        max_retries: task.meta.max_retries,
        input: task.input,
        output: task.output
      }
    };
    
    res.json({
      success: true,
      data: formattedTask
    });
  } catch (error) {
    console.error('获取任务详情失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 更新任务状态
 * PUT /api/tasks/:taskId
 */
const updateTask = async (req: Request<{ taskId: string }, TaskResponse, TaskUpdateRequest>, res: Response<TaskResponse>) => {
  try {
    const { taskId } = req.params;
    const { status, progress } = req.body;
    
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
      
      // 根据状态更新时间戳
      if (status === 'running' && !updateData['meta.started_at']) {
        updateData['meta.started_at'] = new Date();
      } else if (['completed', 'failed'].includes(status)) {
        updateData['meta.completed_at'] = new Date();
        // 计算执行时长
        const task = await TaskModel.findOne({ task_id: taskId });
        if (task && task.meta.started_at) {
          updateData['meta.duration'] = Date.now() - task.meta.started_at.getTime();
        }
      }
    }
    
    if (progress !== undefined) {
      updateData['progress.percentage'] = progress;
    }
    
    const task = await TaskModel.findOneAndUpdate(
      { task_id: taskId },
      updateData,
      { new: true }
    );
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: '任务不存在' 
      });
    }
    
    res.json({
      success: true,
      data: {
        id: task.task_id,
        status: task.status,
        progress: task.progress.percentage
      }
    });
  } catch (error) {
    console.error('更新任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 删除任务
 * DELETE /api/tasks/:taskId
 */
const deleteTask = async (req: Request<{ taskId: string }>, res: Response<TaskResponse>) => {
  try {
    const { taskId } = req.params;
    
    const task = await TaskModel.findOneAndDelete({ task_id: taskId });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: '任务不存在' 
      });
    }
    
    res.json({
      success: true,
      data: { message: '任务删除成功' }
    });
  } catch (error) {
    console.error('删除任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 批量操作任务
 * POST /api/tasks/batch
 */
const batchUpdateTasks = async (req: Request<{}, TaskResponse, { taskIds: string[], action: string }>, res: Response<TaskResponse>) => {
  try {
    const { taskIds, action } = req.body;
    
    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '任务ID列表不能为空' 
      });
    }
    
    let updateData: any = {};
    
    switch (action) {
      case 'pause':
        updateData.status = 'paused';
        break;
      case 'resume':
        updateData.status = 'pending';
        break;
      case 'cancel':
        updateData.status = 'failed';
        updateData['meta.completed_at'] = new Date();
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          error: '无效的操作类型' 
        });
    }
    
    const result = await TaskModel.updateMany(
      { task_id: { $in: taskIds } },
      updateData
    );
    
    res.json({
      success: true,
      data: {
        message: `成功${action === 'pause' ? '暂停' : action === 'resume' ? '恢复' : '取消'}了 ${result.modifiedCount} 个任务`,
        modified_count: result.modifiedCount
      }
    });
  } catch (error) {
    console.error('批量操作任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 导出任务结果
 * GET /api/tasks/:taskId/export
 */
const exportTaskResults = async (req: Request<{ taskId: string }>, res: Response) => {
  try {
    const { taskId } = req.params;
    const { format = 'json' } = req.query;
    
    const task = await TaskModel.findOne({ task_id: taskId });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: '任务不存在' 
      });
    }
    
    if (task.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        error: '只能导出已完成的任务结果' 
      });
    }
    
    const exportData = {
      task_id: task.task_id,
      type: task.type,
      status: task.status,
      input: task.input,
      output: task.output,
      progress: task.progress,
      meta: task.meta
    };
    
    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="task_${taskId}_results.json"`);
      res.json(exportData);
    } else {
      // 其他格式可以后续扩展
      res.status(400).json({ 
        success: false, 
        error: '不支持的导出格式' 
      });
    }
  } catch (error) {
    console.error('导出任务结果失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

// 辅助函数
const getTaskTypeLabel = (type: string): string => {
  const typeMap: Record<string, string> = {
    'full_data_collection': 'single',
    'keyword_collection': 'keyword',
    'deep_analysis': 'batch'
  };
  return typeMap[type] || 'single';
};

const getTaskName = (task: any): string => {
  if (task.type === 'full_data_collection') {
    const urls = task.input?.product_urls || [];
    return urls.length === 1 ? `单品收集: ${urls[0]}` : `批量收集 (${urls.length}个商品)`;
  } else if (task.type === 'keyword_collection') {
    const keywords = task.input?.keywords || [];
    return `关键词收集: ${keywords.join(', ')}`;
  } else if (task.type === 'deep_analysis') {
    const productIds = task.input?.product_ids || [];
    return `深度分析 (${productIds.length}个商品)`;
  }
  return `任务 ${task.task_id}`;
};

const calculateEstimatedTime = (task: any): string => {
  const totalItems = task.progress.total_items || 1;
  const avgTimePerItem = 30; // 假设每个项目平均30秒
  const estimatedSeconds = totalItems * avgTimePerItem;
  
  if (estimatedSeconds < 60) {
    return `${estimatedSeconds}s`;
  } else if (estimatedSeconds < 3600) {
    return `${Math.round(estimatedSeconds / 60)}m`;
  } else {
    return `${Math.round(estimatedSeconds / 3600)}h`;
  }
};

/**
 * 获取任务统计信息
 * GET /api/tasks/stats
 */
const getTaskStats = async (req: Request, res: Response<TaskResponse>) => {
  try {
    const [
      totalTasks,
      runningTasks,
      completedTasks,
      failedTasks,
      pendingTasks,
      pausedTasks
    ] = await Promise.all([
      TaskModel.countDocuments(),
      TaskModel.countDocuments({ status: 'running' }),
      TaskModel.countDocuments({ status: 'completed' }),
      TaskModel.countDocuments({ status: 'failed' }),
      TaskModel.countDocuments({ status: 'pending' }),
      TaskModel.countDocuments({ status: 'paused' })
    ]);

    // 获取最近24小时的任务统计
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentTasks = await TaskModel.countDocuments({
      'meta.created_at': { $gte: last24Hours }
    });

    // 获取任务类型分布
    const taskTypeStats = await TaskModel.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    // 计算成功率
    const successRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      success: true,
      data: {
        overview: {
          total: totalTasks,
          running: runningTasks,
          completed: completedTasks,
          failed: failedTasks,
          pending: pendingTasks,
          paused: pausedTasks,
          success_rate: successRate
        },
        recent: {
          last_24h: recentTasks
        },
        distribution: {
          by_type: taskTypeStats.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
          }, {} as Record<string, number>)
        }
      }
    });
  } catch (error) {
    console.error('获取任务统计失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

// 路由定义
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:taskId', getTaskById);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.post('/batch', batchUpdateTasks);
router.get('/:taskId/export', exportTaskResults);

export default router;