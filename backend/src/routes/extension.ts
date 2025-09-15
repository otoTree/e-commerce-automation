import { Router } from 'express';
import type { Request, Response } from 'express';
import { extensionService } from '../services/extensionService.js';
import { taskService } from '../services/taskService.js';
import type { ExtensionRegisterRequest, ExtensionHeartbeatRequest } from '../types/index.js';

const router = Router();

// 浏览器扩展注册接口
router.post('/register', (req: Request<{}, {}, ExtensionRegisterRequest>, res: Response) => {
  const { extensionId } = req.body;
  const userAgent = req.headers['user-agent'];
  
  if (!extensionId) {
    return res.status(400).json({ error: 'Extension ID is required' });
  }
  
  extensionService.register(extensionId, userAgent);
  console.log(extensionService.getAllExtensions());
  res.json({ success: true, message: 'Extension registered successfully' });
});

// 扩展心跳接口
router.post('/heartbeat', (req: Request<{}, {}, ExtensionHeartbeatRequest>, res: Response) => {
  const { extensionId } = req.body;
  
  if (!extensionId || !extensionService.isRegistered(extensionId)) {
    return res.status(404).json({ error: 'Extension not registered' });
  }
  
  extensionService.updateHeartbeat(extensionId);
  res.json({ success: true });
});

// 获取待处理任务
router.get('/:extensionId/tasks', (req: Request, res: Response) => {
  const { extensionId } = req.params;
  
  if (!extensionId) {
    return res.status(400).json({ error: 'Extension ID is required' });
  }
  
  if (!extensionService.isRegistered(extensionId)) {
    return res.status(404).json({ error: 'Extension not registered' });
  }
  
  // 查找未分配的任务
  const availableTasks = taskService.getAvailableTasks(5);
  
  // 将任务分配给该扩展
  taskService.assignTasksToExtension(extensionId, availableTasks);
  
  res.json({ 
    success: true,
    tasks: availableTasks,
    timestamp: new Date().toISOString()
  });
});

// 接收任务完成结果
router.post('/:extensionId/tasks/:taskId/complete', (req: Request, res: Response) => {
  const { extensionId, taskId } = req.params;
  const { data, success, error } = req.body;
  
  if (!extensionId || !taskId) {
    return res.status(400).json({ error: 'Extension ID and Task ID are required' });
  }
  
  if (!extensionService.isRegistered(extensionId)) {
    return res.status(404).json({ error: 'Extension not registered' });
  }
  
  const result = taskService.completeTask(taskId, data, success, error);
  
  if (!result) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  console.log(`Extension ${extensionId} completed task ${taskId}:`, success ? 'SUCCESS' : 'FAILED');
  
  res.json({ 
    success: true, 
    message: 'Task result received',
    timestamp: new Date().toISOString()
  });
});

// 获取扩展配置和数据
router.get('/:extensionId/data', (req: Request, res: Response) => {
  const { extensionId } = req.params;
  const { type } = req.query;
  
  if (!extensionId) {
    return res.status(400).json({ error: 'Extension ID is required' });
  }
  
  if (!extensionService.isRegistered(extensionId)) {
    return res.status(404).json({ error: 'Extension not registered' });
  }
  
  // 根据type参数返回不同类型的数据
  let responseData: any = {};
  
  switch (type) {
    case 'config':
      responseData = {
        extractionRules: {
          '1688.com': {
            productSelector: '.search-offer-wrapper',
            titleSelector: '.title-text div',
            priceSelector: '.text-main',
            imageSelector: 'img',
            linkSelector: 'a'
          },
          'taobao.com': {
            productSelector: '.item',
            titleSelector: '.title',
            priceSelector: '.price',
            imageSelector: '.pic img',
            linkSelector: '.title a'
          }
        },
        settings: {
          maxProducts: 100,
          timeout: 30000,
          retryCount: 3
        }
      };
      break;
      
    case 'tasks':
      const pendingTasks = taskService.getAvailableTasks(10);
      responseData = {
        tasks: pendingTasks,
        totalCount: pendingTasks.length
      };
      break;
      
    case 'notifications':
      responseData = {
        messages: [
          {
            id: Date.now(),
            type: 'info',
            title: '系统通知',
            message: '扩展已成功连接到服务器',
            timestamp: new Date().toISOString()
          }
        ]
      };
      break;
      
    default:
      responseData = {
        status: 'connected',
        serverTime: new Date().toISOString(),
        extensionId: extensionId,
        availableDataTypes: ['config', 'tasks', 'notifications']
      };
  }
  
  res.json({
    success: true,
    data: responseData,
    timestamp: new Date().toISOString()
  });
});

// 接收扩展发送的数据
router.post('/:extensionId/data', (req: Request, res: Response) => {
  const { extensionId } = req.params;
  const { type, data } = req.body;
  
  if (!extensionId) {
    return res.status(400).json({ error: 'Extension ID is required' });
  }
  
  if (!extensionService.isRegistered(extensionId)) {
    return res.status(404).json({ error: 'Extension not registered' });
  }
  
  // 处理不同类型的数据
  switch (type) {
    case 'extraction_result':
      console.log(`收到来自扩展 ${extensionId} 的提取结果:`, data);
      // 这里可以保存到数据库或进行其他处理
      break;
      
    case 'error_report':
      console.error(`扩展 ${extensionId} 报告错误:`, data);
      break;
      
    case 'analytics':
      console.log(`扩展 ${extensionId} 分析数据:`, data);
      break;
      
    default:
      console.log(`扩展 ${extensionId} 发送未知类型数据:`, { type, data });
  }
  
  res.json({
    success: true,
    message: 'Data received successfully',
    timestamp: new Date().toISOString()
  });
});

// 获取所有扩展的健康状态
router.get('/health', (req: Request, res: Response) => {
  const extensions = extensionService.getAllExtensions();
  const now = new Date();
  
  const extensionsWithHealth = extensions.map(extension => {
    const timeDiff = now.getTime() - extension.lastSeen.getTime();
    const minutesAgo = Math.floor(timeDiff / (1000 * 60));
    
    let status: 'online' | 'warning' | 'offline';
    if (minutesAgo < 2) {
      status = 'online';
    } else if (minutesAgo < 5) {
      status = 'warning';
    } else {
      status = 'offline';
    }
    
    return {
      id: extension.id,
      status,
      lastSeen: extension.lastSeen,
      minutesAgo,
      userAgent: extension.userAgent
    };
  });
  
  res.json({
    success: true,
    data: {
      extensions: extensionsWithHealth,
      totalCount: extensionsWithHealth.length,
      onlineCount: extensionsWithHealth.filter(e => e.status === 'online').length,
      warningCount: extensionsWithHealth.filter(e => e.status === 'warning').length,
      offlineCount: extensionsWithHealth.filter(e => e.status === 'offline').length
    },
    timestamp: new Date().toISOString()
  });
});

export default router;