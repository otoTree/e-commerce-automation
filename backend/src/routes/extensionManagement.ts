import { Router, type Request, type Response } from 'express';
import crypto from 'crypto';
import { ExtensionModel, TaskModel, ProductFullData } from '../models/index.js';

const router = Router();

// 接口类型定义
interface ExtensionRegistrationRequest {
  name?: string;
  version?: string;
  userAgent: string;
  browserVersion: string;
  platform: string;
  capabilities?: string[];
}

interface TaskCreationRequest {
  type: 'single_product' | 'batch_products' | 'keyword_search';
  data: {
    url?: string;
    urls?: string[];
    keywords?: string[];
    platform?: string;
    resultCount?: number;
    filters?: Record<string, any>;
  };
}

interface TaskResultRequest {
  taskId: string;
  status: 'completed' | 'failed';
  results?: any[];
  error?: string;
}

// 扩展注册
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { extension_id, browser_info } = req.body;

    if (!extension_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数: extension_id'
      });
    }

    // 查找或创建扩展记录
    let extension = await ExtensionModel.findOne({ extension_id });
    
    if (extension) {
      // 更新现有扩展
      extension.connection.last_heartbeat = new Date();
      extension.connection.is_online = true;
      extension.meta.last_active_at = new Date();
      if (browser_info) {
        extension.info.user_agent = browser_info.version || extension.info.user_agent;
        extension.info.browser_version = browser_info.name || extension.info.browser_version;
        extension.info.platform = browser_info.platform || extension.info.platform;
      }
      await extension.save();
      
      return res.json({
        success: true,
        message: '扩展重新注册成功',
        extension_id: extension.extension_id
      });
    } else {
      // 创建新扩展
      extension = new ExtensionModel({
        extension_id,
        info: {
          user_agent: browser_info?.version || 'Unknown',
          browser_version: browser_info?.name || 'Unknown',
          platform: browser_info?.platform || 'Unknown',
          capabilities: ['product_extraction', 'page_navigation']
        },
        connection: {
          last_heartbeat: new Date(),
          is_online: true,
          ip_address: req.ip
        },
        meta: {
          registered_at: new Date(),
          last_active_at: new Date()
        }
      });
      
      await extension.save();
      
      return res.status(201).json({
        success: true,
        message: '扩展注册成功',
        extension_id: extension.extension_id
      });
    }
  } catch (error) {
    console.error('扩展注册失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
});

// 心跳接口
router.post('/heartbeat', async (req: Request, res: Response) => {
  try {
    const { extension_id } = req.body;

    if (!extension_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数: extension_id'
      });
    }

    const extension = await ExtensionModel.findOne({ extension_id });
    if (!extension) {
      return res.status(404).json({
        success: false,
        message: '扩展未找到'
      });
    }

    // 更新心跳时间
    extension.connection.last_heartbeat = new Date();
    extension.connection.is_online = true;
    extension.meta.last_active_at = new Date();
    await extension.save();

    res.json({
      success: true,
      data: {
        message: '心跳更新成功',
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('心跳更新失败:', error);
    res.status(500).json({
      success: false,
      message: '心跳更新失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取待执行任务
router.post('/tasks/poll', async (req: Request, res: Response) => {
  try {
    const { extension_id } = req.body;

    if (!extension_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数: extension_id'
      });
    }

    // 验证扩展是否存在
    const extension = await ExtensionModel.findOne({ extension_id });
    if (!extension) {
      return res.status(404).json({
        success: false,
        message: '扩展未找到'
      });
    }

    // 查找待执行的任务 - 排除分析任务，这些任务在后端直接处理
    const task = await TaskModel.findOne({
      status: 'pending',
      type: { $in: ['full_data_collection', 'keyword_collection'] } // 移除 deep_analysis 和 market_heat_detection
    })
    .sort({ 'meta.created_at': 1 });

    if (!task) {
      return res.json({
        success: true,
        data: {
          task: null,
          message: '暂无待执行任务'
        }
      });
    }

    // 将任务状态更新为进行中
    task.status = 'running';
    task.meta.started_at = new Date();
    await task.save();

    res.json({
      success: true,
      data: {
        task: {
          task_id: task.task_id,
          type: task.type,
          input: task.input,
          created_at: task.meta.created_at
        }
      }
    });
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({
      success: false,
      message: '获取任务失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 创建新任务接口
router.post('/tasks', async (req: Request, res: Response) => {
  try {
    const { type, data }: TaskCreationRequest = req.body;

    // 验证任务类型
    if (!['single_product', 'batch_products', 'keyword_search'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: '无效的任务类型'
      });
    }

    // 生成任务ID
    const taskId = crypto.randomUUID();

    // 根据任务类型创建任务
    let taskType: 'full_data_collection' | 'deep_analysis' | 'market_heat_detection' | 'keyword_collection';
    let input: any = {};
    let totalItems = 0;

    switch (type) {
      case 'single_product':
        if (!data.url) {
          return res.status(400).json({
            success: false,
            message: '单个商品收集需要提供商品URL'
          });
        }
        taskType = 'full_data_collection';
        input.product_urls = [data.url];
        totalItems = 1;
        break;

      case 'batch_products':
        if (!data.urls || data.urls.length === 0) {
          return res.status(400).json({
            success: false,
            message: '批量商品收集需要提供商品URL列表'
          });
        }
        taskType = 'full_data_collection';
        input.product_urls = data.urls;
        totalItems = data.urls.length;
        break;

      case 'keyword_search':
        if (!data.keywords || data.keywords.length === 0) {
          return res.status(400).json({
            success: false,
            message: '关键词搜索需要提供关键词列表'
          });
        }
        taskType = 'keyword_collection';
        input.keywords = data.keywords;
        input.platform = data.platform || 'alibaba';
        input.result_count = data.resultCount || 20;
        input.filters = data.filters || {};
        totalItems = data.keywords.length;
        break;
    }

    // 创建任务
    const task = new TaskModel({
      task_id: taskId,
      type: taskType,
      input,
      progress: {
        total_items: totalItems,
        processed_items: 0,
        percentage: 0
      }
    });

    await task.save();

    res.json({
      success: true,
      data: {
        taskId,
        message: '任务创建成功'
      }
    });
  } catch (error) {
    console.error('创建任务失败:', error);
    res.status(500).json({
      success: false,
      message: '创建任务失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 提交任务结果接口
router.post('/tasks/result', async (req: Request, res: Response) => {
  try {
    const { task_id, extension_id, data, success, error } = req.body;

    if (!task_id || !extension_id) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数: task_id, extension_id'
      });
    }

    // 查找任务
    const task = await TaskModel.findOne({ task_id });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '任务未找到'
      });
    }

    if (success && data) {
      // 保存商品数据
      const savedProducts = await saveProductsData(data);
      
      // 更新任务状态
      task.status = 'completed';
      task.meta.completed_at = new Date();
      if (task.meta.started_at) {
        task.meta.duration = Date.now() - task.meta.started_at.getTime();
      }
      task.output = {
        ...task.output,
        collected_products: savedProducts,
        success_count: savedProducts.length,
        failure_count: data.length - savedProducts.length
      };
      task.progress.percentage = 100;
      await task.save();
    } else {
      // 标记任务失败
      task.status = 'failed';
      task.meta.completed_at = new Date();
      if (task.meta.started_at) {
        task.meta.duration = Date.now() - task.meta.started_at.getTime();
      }
      task.output = { ...task.output, error_details: error || '任务执行失败' };
      await task.save();
    }

    res.json({
      success: true,
      data: {
        message: '任务结果提交成功'
      }
    });
  } catch (error) {
    console.error('提交任务结果失败:', error);
    res.status(500).json({
      success: false,
      message: '提交任务结果失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 保存商品数据的辅助函数
// 获取所有插件状态
router.get('/status', async (req: Request, res: Response) => {
  try {
    const extensions = await ExtensionModel.find({}).sort({ 'connection.last_heartbeat': -1 });
    
    const pluginStatuses = extensions.map(ext => {
      const now = new Date();
      const lastHeartbeat = new Date(ext.connection.last_heartbeat);
      const timeDiff = now.getTime() - lastHeartbeat.getTime();
      
      // 判断插件状态：5分钟内有心跳为在线，否则为离线
      let status: 'online' | 'offline' | 'error' = 'offline';
      if (timeDiff < 5 * 60 * 1000) {
        status = 'online';
      } else if (timeDiff > 24 * 60 * 60 * 1000) {
        status = 'error'; // 超过24小时未心跳视为异常
      }
      
      return {
        extension_id: ext.extension_id,
        status,
        last_heartbeat: ext.connection.last_heartbeat,
        last_task_poll: ext.stats.last_task_at || ext.connection.last_heartbeat,
        tasks_completed: ext.stats.completed_tasks,
        tasks_failed: ext.stats.failed_tasks,
        version: ext.version,
        browser: ext.info.user_agent,
        created_at: ext.meta.registered_at
      };
    });

    res.json({
      success: true,
      data: pluginStatuses
    });
  } catch (error) {
    console.error('获取插件状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取插件状态失败'
    });
  }
});

const saveProductsData = async (products: any[]): Promise<string[]> => {
  const savedProductIds: string[] = [];

  for (const productData of products) {
    try {
      // 验证必需字段
      if (!productData.platform || !productData.platform_product_id || !productData.basic_info?.title) {
        console.warn('商品数据缺少必需字段，跳过保存:', productData);
        continue;
      }

      // 检查商品是否已存在
      const existingProduct = await ProductFullData.findOne({
        platform: productData.platform,
        platform_product_id: productData.platform_product_id
      });

      if (existingProduct) {
        // 更新现有商品的价格历史
        if (productData.pricing?.current_price) {
          existingProduct.pricing.price_history.push({
            price: productData.pricing.current_price,
            date: new Date()
          });
          existingProduct.pricing.current_price = productData.pricing.current_price;
        }
        
        // 更新收集元数据
        existingProduct.collection_meta = {
          collected_at: new Date(),
          collection_duration: productData.collection_meta?.collection_duration || 0,
          data_completeness: productData.collection_meta?.data_completeness || 1
        };

        await existingProduct.save();
        savedProductIds.push((existingProduct._id as any).toString());
      } else {
        // 创建新商品
        const newProduct = new ProductFullData({
          platform: productData.platform,
          platform_product_id: productData.platform_product_id,
          basic_info: productData.basic_info,
          pricing: {
            ...productData.pricing,
            price_history: productData.pricing?.current_price ? [{
              price: productData.pricing.current_price,
              date: new Date()
            }] : []
          },
          sales_data: productData.sales_data || {
            sales_volume: 0,
            review_count: 0,
            rating: 0
          },
          supplier: productData.supplier || {
            name: 'Unknown',
            location: 'Unknown',
            rating: 0
          },
          collection_meta: {
            collected_at: new Date(),
            collection_duration: productData.collection_meta?.collection_duration || 0,
            data_completeness: productData.collection_meta?.data_completeness || 1
          }
        });

        await newProduct.save();
        savedProductIds.push((newProduct._id as any).toString());
      }
    } catch (error) {
      console.error('保存商品数据失败:', error);
    }
  }

  return savedProductIds;
};

// 获取插件状态
router.get('/status', async (req: Request, res: Response) => {
  try {
    const extensions = await ExtensionModel.find({}).sort({ 'meta.registered_at': -1 });
    
    const pluginStatuses = await Promise.all(extensions.map(async (extension) => {
      // 计算插件状态
      const now = new Date();
      const lastHeartbeat = new Date(extension.connection.last_heartbeat);
      const timeDiff = now.getTime() - lastHeartbeat.getTime();
      const minutesDiff = Math.floor(timeDiff / 60000);
      
      let status: 'online' | 'offline' | 'error' = 'offline';
      if (minutesDiff < 2) {
        status = 'online';
      } else if (minutesDiff < 10) {
        status = 'offline';
      } else {
        status = 'error';
      }
      
      // 获取任务统计
      const tasksCompleted = await TaskModel.countDocuments({
        extension_id: extension.extension_id,
        status: 'completed'
      });
      
      const tasksFailed = await TaskModel.countDocuments({
        extension_id: extension.extension_id,
        status: 'failed'
      });
      
      return {
        extension_id: extension.extension_id,
        status,
        last_heartbeat: extension.connection.last_heartbeat,
        last_task_poll: extension.stats.last_task_at || extension.connection.last_heartbeat,
        tasks_completed: tasksCompleted,
        tasks_failed: tasksFailed,
        version: extension.version,
        browser: extension.info.user_agent,
        created_at: extension.meta.registered_at
      };
    }));
    
    res.json({
      success: true,
      data: pluginStatuses,
      message: '获取插件状态成功'
    });
  } catch (error) {
    console.error('获取插件状态失败:', error);
    res.status(500).json({
      success: false,
      message: '获取插件状态失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 后端调用插件获取源码
router.post('/request-source', async (req: Request, res: Response) => {
  try {
    const { url, extension_id } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: '缺少必需参数: url'
      });
    }

    // 如果指定了extension_id，验证扩展是否在线
    if (extension_id) {
      const extension = await ExtensionModel.findOne({ extension_id });
      if (!extension || !extension.connection.is_online) {
        return res.status(404).json({
          success: false,
          message: '指定的扩展不在线或不存在'
        });
      }
    } else {
      // 查找在线的扩展
      const onlineExtension = await ExtensionModel.findOne({
        'connection.is_online': true,
        'connection.last_heartbeat': {
          $gte: new Date(Date.now() - 5 * 60 * 1000) // 5分钟内有心跳
        }
      }).sort({ 'connection.last_heartbeat': -1 });

      if (!onlineExtension) {
        return res.status(503).json({
          success: false,
          message: '没有可用的在线扩展'
        });
      }
    }

    // 创建获取源码任务
    const taskId = crypto.randomUUID();
    const task = new TaskModel({
      task_id: taskId,
      type: 'full_data_collection', // 使用现有的任务类型
      status: 'pending',
      input: {
        product_urls: [url], // 使用现有的字段结构
        analysis_options: {
          request_type: 'get_source',
          requested_by: 'backend_api'
        }
      },
      progress: {
        total_items: 1,
        processed_items: 0,
        percentage: 0
      },
      meta: {
        created_at: new Date(),
        max_retries: 3,
        retry_count: 0
      }
    });

    await task.save();

    // 设置超时处理
    setTimeout(async () => {
      const timeoutTask = await TaskModel.findOne({ task_id: taskId });
      if (timeoutTask && timeoutTask.status === 'pending') {
        timeoutTask.status = 'failed';
        timeoutTask.output = {
          error_details: '任务超时：插件未在指定时间内响应',
          success_count: 0,
          failure_count: 1
        };
        timeoutTask.meta.completed_at = new Date();
        await timeoutTask.save();
      }
    }, 30000); // 30秒超时

    res.json({
      success: true,
      data: {
        task_id: taskId,
        message: '源码获取请求已发送，请等待插件响应',
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('请求源码失败:', error);
    res.status(500).json({
      success: false,
      message: '请求源码失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

// 获取源码任务结果
router.get('/source-task/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const task = await TaskModel.findOne({ task_id: taskId });
    if (!task) {
      return res.status(404).json({
        success: false,
        message: '任务不存在'
      });
    }

    if (task.status === 'pending' || task.status === 'running') {
      return res.json({
        success: true,
        data: {
          status: task.status,
          message: '任务正在处理中...',
          progress: task.progress.percentage
        }
      });
    }

    if (task.status === 'completed') {
      return res.json({
        success: true,
        data: {
          status: 'completed',
          result: task.output,
          html_content: task.output?.analysis_results?.[0], // 从analysis_results获取HTML内容
          url: task.input?.product_urls?.[0], // 从product_urls获取URL
          completed_at: task.meta.completed_at
        }
      });
    }

    if (task.status === 'failed') {
      return res.json({
        success: false,
        data: {
          status: 'failed',
          error: task.output?.error_details || '任务执行失败',
          failed_at: task.meta.completed_at
        }
      });
    }

    res.json({
      success: true,
      data: {
        status: task.status,
        message: '任务状态未知'
      }
    });
  } catch (error) {
    console.error('获取源码任务结果失败:', error);
    res.status(500).json({
      success: false,
      message: '获取任务结果失败',
      error: error instanceof Error ? error.message : '未知错误'
    });
  }
});

export default router;