import { Router, type Request, type Response } from 'express';
import { TaskModel, HtmlStorage, SearchPageData } from '../models/index.js';
import { generateTaskId } from '../utils/taskUtils.js';
import { getProductParser } from '../services/parsers/productParser.js';
import { getSearchPageParser } from '../services/parsers/searchPageParser.js';
import { ProductFullData } from '../models/index.js';

const router = Router();

// 新增接口类型定义
interface CrawlUrlRequest {
  url: string;
  platform?: 'alibaba' | 'ozon' | 'other';
  page_type?: 'product' | 'search' | 'auto';
}

interface SubmitHtmlRequest {
  url: string;
  html_content: string;
  platform?: 'alibaba' | 'ozon' | 'other';
  page_type?: 'product' | 'search' | 'auto';
  metadata?: {
    user_agent?: string;
    timestamp?: string;
    [key: string]: any;
  };
}

// 数据收集相关API接口类型定义
interface CollectProductRequest {
  product_url: string;
  platform?: 'alibaba' | 'ozon' | 'other';
}

interface BatchCollectRequest {
  product_urls: string[];
}

// 关键词收集请求接口
interface KeywordCollectRequest {
  keywords: string[];
  platform: string;
  result_count?: number;
  filters?: {
    min_price?: number;
    max_price?: number;
    [key: string]: string | number | boolean | undefined;
  };
}

interface TaskResponse {
  success: boolean;
  task_id?: string;
  error?: string;
  message?: string;
  warning?: string;
  parse_result?: any;
}

interface TaskStatusResponse {
  success: boolean;
  task?: any;
  error?: string;
}

/**
 * 触发单个商品数据收集
 * POST /api/data-collection/collect
 */
const collectProduct = async (req: Request<{}, TaskResponse, CollectProductRequest>, res: Response<TaskResponse>) => {
  try {
    const { product_url, platform = 'other' } = req.body;
    
    if (!product_url) {
      return res.status(400).json({ 
        success: false, 
        error: '商品URL不能为空' 
      });
    }
    
    // 验证URL格式
    if (!isValidUrl(product_url)) {
      return res.status(400).json({ 
        success: false, 
        error: '无效的URL格式' 
      });
    }
    
    // 创建数据收集任务
    const taskId = generateTaskId();
    const task = new TaskModel({
      task_id: taskId,
      type: 'full_data_collection',
      status: 'pending',
      input: {
        product_urls: [product_url],
        platform
      },
      progress: {
        total_items: 1,
        processed_items: 0,
        percentage: 0
      }
    });
    
    await task.save();
    
    // 任务已创建，等待插件端通过轮询接口获取并处理
    console.log(`单品收集任务已创建: ${taskId}, URL: ${product_url}`);
    
    res.json({ 
      success: true, 
      task_id: taskId 
    });
  } catch (error) {
    console.error('创建数据收集任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 批量收集商品数据
 * POST /api/data-collection/batch-collect
 */
const batchCollectProducts = async (req: Request<{}, TaskResponse, BatchCollectRequest>, res: Response<TaskResponse>) => {
  try {
    const { product_urls } = req.body;
    
    if (!product_urls || !Array.isArray(product_urls) || product_urls.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '商品URL列表不能为空' 
      });
    }
    
    // 验证URL格式
    const invalidUrls = product_urls.filter(url => !isValidUrl(url));
    if (invalidUrls.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: `无效的URL格式: ${invalidUrls.join(', ')}` 
      });
    }
    
    // 创建批量数据收集任务
    const taskId = generateTaskId();
    const task = new TaskModel({
      task_id: taskId,
      type: 'full_data_collection',
      status: 'pending',
      input: {
        product_urls
      },
      progress: {
        total_items: product_urls.length,
        processed_items: 0,
        percentage: 0
      }
    });
    
    await task.save();
    
    // TODO: 这里应该触发实际的批量数据收集任务
    // await scheduleDataCollectionTask(taskId, product_urls);
    
    res.json({ 
      success: true, 
      task_id: taskId 
    });
  } catch (error) {
    console.error('创建批量数据收集任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取收集任务状态
 * GET /api/data-collection/tasks/:taskId
 */
const getTaskStatus = async (req: Request<{ taskId: string }>, res: Response<TaskStatusResponse>) => {
  try {
    const { taskId } = req.params;
    
    const task = await TaskModel.findOne({ task_id: taskId });
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: '任务不存在' 
      });
    }
    
    res.json({ 
      success: true, 
      task: {
        task_id: task.task_id,
        type: task.type,
        status: task.status,
        progress: task.progress,
        meta: task.meta,
        output: task.output
      }
    });
  } catch (error) {
    console.error('获取任务状态失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 关键词收集
 * POST /api/data-collection/collect-keywords
 */
const collectByKeywords = async (req: Request<{}, TaskResponse, KeywordCollectRequest>, res: Response<TaskResponse>) => {
  try {
    const { keywords, platform, result_count = 50, filters = {} } = req.body;
    
    // 验证必需参数
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '关键词列表不能为空' 
      });
    }
    
    if (!platform) {
      return res.status(400).json({ 
        success: false, 
        error: '平台参数不能为空' 
      });
    }
    
    // 验证关键词格式
    const invalidKeywords = keywords.filter(keyword => !keyword || typeof keyword !== 'string' || keyword.trim().length === 0);
    if (invalidKeywords.length > 0) {
      return res.status(400).json({ 
        success: false, 
        error: '关键词格式无效，请确保所有关键词都是非空字符串' 
      });
    }
    
    // 验证结果数量
    if (result_count < 1 || result_count > 500) {
      return res.status(400).json({ 
        success: false, 
        error: '结果数量必须在1-500之间' 
      });
    }
    
    // 创建关键词收集任务
    const taskId = generateTaskId();
    const task = new TaskModel({
      task_id: taskId,
      type: 'keyword_collection',
      status: 'pending',
      input: {
        keywords: keywords.map(k => k.trim()),
        platform,
        result_count,
        filters
      },
      progress: {
        total_items: keywords.length,
        processed_items: 0,
        percentage: 0
      }
    });
    
    await task.save();
    
    // TODO: 这里应该触发实际的关键词收集任务
    // await scheduleKeywordCollectionTask(taskId, keywords, platform, result_count, filters);
    
    res.json({ 
      success: true, 
      task_id: taskId 
    });
  } catch (error) {
    console.error('创建关键词收集任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取所有数据收集任务列表
 * GET /api/data-collection/tasks
 */
const getCollectionTasks = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      type,
      page = 1, 
      limit = 20, 
      sort = '-meta.created_at' 
    } = req.query;
    
    const filter: any = {};
    
    // 支持按任务类型过滤
    if (type) {
      filter.type = type;
    } else {
      // 默认只显示数据收集相关的任务
      filter.type = { $in: ['full_data_collection', 'keyword_collection'] };
    }
    
    if (status) {
      filter.status = status;
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
    
    res.json({
      success: true,
      data: {
        tasks,
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
 * 路由一：发送网址给插件爬虫
 * POST /api/data-collection/crawl-url
 */
const crawlUrl = async (req: Request<{}, TaskResponse, CrawlUrlRequest>, res: Response<TaskResponse>) => {
  try {
    const { url, platform = 'other', page_type = 'auto' } = req.body;
    
    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供有效的URL' 
      });
    }

    // 检测平台和页面类型
    const detectedPlatform = detectPlatform(url);
    const detectedPageType = detectPageType(url);
    
    const finalPlatform = platform === 'other' ? detectedPlatform : platform;
    const finalPageType = page_type === 'auto' ? detectedPageType : page_type;

    // 创建爬虫任务
    const taskId = generateTaskId();
    const task = new TaskModel({
      task_id: taskId,
      task_type: 'crawl_url',
      status: 'pending',
      target_urls: [url],
      platform: finalPlatform,
      metadata: {
        page_type: finalPageType,
        original_platform: platform,
        original_page_type: page_type
      }
    });

    await task.save();

    // TODO: 这里应该发送消息给插件，让插件爬取URL
    // 目前先返回任务ID，插件可以通过轮询或WebSocket获取任务
    
    res.json({
      success: true,
      task_id: taskId
    });

  } catch (error) {
    console.error('创建爬虫任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 路由二：接收HTML数据并存储到数据库
 * POST /api/data-collection/submit-html
 */
const submitHtml = async (req: Request<{}, TaskResponse, SubmitHtmlRequest>, res: Response<TaskResponse>) => {
  try {
    // 详细的请求调试日志
    console.log('=== submitHtml API 调用开始 ===');
    console.log('请求头:', JSON.stringify(req.headers, null, 2));
    console.log('请求体类型:', typeof req.body);
    console.log('请求体内容:', JSON.stringify(req.body, null, 2));
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Content-Length:', req.get('Content-Length'));
    
    const { url, html_content, platform = 'other', page_type = 'auto', metadata = {} } = req.body;
    
    // 参数解析调试
    console.log('解析后的参数:');
    console.log('- url:', url);
    console.log('- html_content 类型:', typeof html_content);
    console.log('- html_content 长度:', html_content ? html_content.length : 'undefined');
    console.log('- html_content 前100字符:', html_content ? html_content.substring(0, 100) : 'undefined');
    console.log('- platform:', platform);
    console.log('- page_type:', page_type);
    console.log('- metadata:', JSON.stringify(metadata, null, 2));
    
    if (!url || !isValidUrl(url)) {
      console.log('❌ URL验证失败:', url);
      return res.status(400).json({ 
        success: false, 
        error: '请提供有效的URL' 
      });
    }

    if (!html_content || html_content.trim().length === 0) {
      console.log('❌ HTML内容验证失败 - html_content:', html_content);
      console.log('❌ html_content 是否为空:', !html_content);
      console.log('❌ html_content trim后长度:', html_content ? html_content.trim().length : 'N/A');
      return res.status(400).json({ 
        success: false, 
        error: '请提供HTML内容' 
      });
    }

    // 检测平台和页面类型
    const detectedPlatform = detectPlatform(url);
    const detectedPageType = detectPageType(url);
    
    const finalPlatform = platform === 'other' ? detectedPlatform : platform;
    const finalPageType = page_type === 'auto' ? detectedPageType : page_type;

    // 存储HTML到数据库
    const htmlStorage = new HtmlStorage({
      url,
      html_content,
      platform: finalPlatform,
      page_type: finalPageType,
      metadata: {
        content_length: html_content.length,
        user_agent: metadata.user_agent || 'Unknown',
        collected_at: metadata.timestamp ? new Date(metadata.timestamp) : new Date(),
        ...metadata
      }
    });

    await htmlStorage.save();

    // 自动触发HTML解析
    try {
      const parseResult = await parseHtmlRecord(htmlStorage, false);
      
      if (parseResult.success) {
        res.json({
          success: true,
          task_id: (htmlStorage._id as any).toString(),
          parse_result: parseResult,
          message: 'HTML存储并解析完成'
        });
      } else {
        res.json({
           success: true,
           task_id: (htmlStorage._id as any).toString(),
           parse_result: parseResult,
           message: 'HTML存储完成，但解析失败',
           warning: parseResult.message || '解析失败'
         });
      }
    } catch (parseError) {
      console.error('自动解析HTML失败:', parseError);
      res.json({
        success: true,
        task_id: (htmlStorage._id as any).toString(),
        message: 'HTML存储完成，但自动解析失败',
        warning: parseError instanceof Error ? parseError.message : '解析异常'
      });
    }

  } catch (error) {
    console.error('存储HTML失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 路由三：HTML解析引擎，支持多种解析规则
 * POST /api/data-collection/parse-html
 */
const parseHtml = async (req: Request<{}, any>, res: Response) => {
  try {
    const { html_storage_id, force_reparse = false } = req.body;
    
    if (!html_storage_id) {
      return res.status(400).json({ 
        success: false, 
        error: '请提供HTML存储ID' 
      });
    }

    // 查找HTML存储记录
    const htmlStorage = await HtmlStorage.findById(html_storage_id);
    if (!htmlStorage) {
      return res.status(404).json({ 
        success: false, 
        error: '未找到HTML存储记录' 
      });
    }

    // 检查是否已解析（除非强制重新解析）
    if (htmlStorage.is_parsed && !force_reparse) {
      return res.json({
        success: true,
        message: 'HTML已解析，跳过重复解析',
        html_storage_id,
        page_type: htmlStorage.page_type
      });
    }

    const startTime = Date.now();
    let parseResult: any = null;

    try {
      if (htmlStorage.page_type === 'product') {
        // 商品页解析
        const parser = getProductParser(htmlStorage.url, htmlStorage.html_content);
        if (!parser) {
          throw new Error(`不支持的商品页URL: ${htmlStorage.url}`);
        }

        parseResult = await parser.parse(htmlStorage.html_content, htmlStorage.url);
        
        if (parseResult.success && parseResult.data) {
          // 保存商品数据到ProductFullData
          const productData = new ProductFullData({
            ...parseResult.data,
            html_storage_id: htmlStorage._id,
            data_source: 'html_parse',
            collection_method: 'backend_parse'
          });
          
          await productData.save();
          
          // 更新HTML存储状态
           htmlStorage.is_parsed = true;
           htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
           await htmlStorage.save();

          return res.json({
            success: true,
            message: '商品页解析完成',
            html_storage_id,
            product_id: (productData._id as any).toString(),
            parse_result: parseResult
          });
        }

      } else if (htmlStorage.page_type === 'search') {
        // 搜索页解析
        const parser = getSearchPageParser(htmlStorage.url);
        if (!parser) {
          throw new Error(`不支持的搜索页URL: ${htmlStorage.url}`);
        }

        parseResult = await parser.parse(htmlStorage.html_content, htmlStorage.url);
        
        if (parseResult.success && parseResult.data) {
          // 保存搜索页数据到SearchPageData
          const searchData = new SearchPageData({
            ...parseResult.data,
            html_storage_id: htmlStorage._id
          });
          
          await searchData.save();
          
          // 更新HTML存储状态
           htmlStorage.is_parsed = true;
           htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
           await htmlStorage.save();

          return res.json({
            success: true,
            message: '搜索页解析完成',
            html_storage_id,
            search_data_id: (searchData._id as any).toString(),
            products_count: parseResult.data.products?.length || 0,
            parse_result: parseResult
          });
        }

      } else {
        throw new Error(`不支持的页面类型: ${htmlStorage.page_type}`);
      }

      // 解析失败的情况
       htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
       htmlStorage.parse_errors = parseResult?.errors || ['解析失败'];
       await htmlStorage.save();

      return res.status(400).json({
        success: false,
        error: '解析失败',
        details: parseResult?.errors || ['未知错误']
      });

    } catch (parseError) {
       // 解析过程中的错误
       htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
       htmlStorage.parse_errors = [parseError instanceof Error ? parseError.message : '解析异常'];
       await htmlStorage.save();

       throw parseError;
     }

  } catch (error) {
    console.error('HTML解析失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 批量解析未处理的HTML
 * POST /api/data-collection/batch-parse
 */
const batchParseHtml = async (req: Request<{}, any>, res: Response) => {
  try {
    const { 
      platform, 
      page_type, 
      limit = 10, 
      force_reparse = false 
    } = req.body;

    // 构建查询条件
    const query: any = {};
    if (platform && platform !== 'all') query.platform = platform;
    if (page_type && page_type !== 'all') query.page_type = page_type;
    
    if (!force_reparse) {
      query.is_parsed = { $ne: true };
    }

    // 查找未解析的HTML记录
    const htmlRecords = await HtmlStorage.find(query)
      .limit(Number(limit))
      .sort({ created_at: 1 });

    if (htmlRecords.length === 0) {
      return res.json({
        success: true,
        message: '没有找到需要解析的HTML记录',
        processed_count: 0
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;

    // 逐个解析
    for (const htmlRecord of htmlRecords) {
      try {
        const parseResponse = await parseHtmlRecord(htmlRecord, force_reparse);
        results.push({
          html_storage_id: (htmlRecord._id as any).toString(),
          success: parseResponse.success,
          message: parseResponse.message,
          page_type: htmlRecord.page_type
        });
        
        if (parseResponse.success) {
          successCount++;
        } else {
          failureCount++;
        }
      } catch (error) {
        results.push({
          html_storage_id: (htmlRecord._id as any).toString(),
          success: false,
          error: error instanceof Error ? error.message : '解析失败'
        });
        failureCount++;
      }
    }

    res.json({
      success: true,
      message: `批量解析完成: 成功${successCount}个，失败${failureCount}个`,
      processed_count: htmlRecords.length,
      success_count: successCount,
      failure_count: failureCount,
      results
    });

  } catch (error) {
    console.error('批量解析失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

// 辅助函数：解析单个HTML记录
const parseHtmlRecord = async (htmlStorage: any, forceReparse = false) => {
  if (htmlStorage.is_parsed && !forceReparse) {
    return {
      success: true,
      message: 'HTML已解析，跳过重复解析'
    };
  }

  const startTime = Date.now();

  try {
    if (htmlStorage.page_type === 'product') {
      const parser = getProductParser(htmlStorage.url, htmlStorage.html_content);
        if (!parser) {
          throw new Error(`不支持的商品页URL: ${htmlStorage.url}`);
        }

      const parseResult = await parser.parse(htmlStorage.html_content, htmlStorage.url);
      
      if (parseResult.success && parseResult.data) {
        const productData = new ProductFullData({
          ...parseResult.data,
          html_storage_id: htmlStorage._id,
          data_source: 'html_parse',
          collection_method: 'backend_parse'
        });
        
        await productData.save();
        
        htmlStorage.is_parsed = true;
         htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
         await htmlStorage.save();

        return {
          success: true,
          message: '商品页解析完成',
          product_id: (productData._id as any).toString()
        };
      }

    } else if (htmlStorage.page_type === 'search') {
      const parser = getSearchPageParser(htmlStorage.url);
      if (!parser) {
        throw new Error(`不支持的搜索页URL: ${htmlStorage.url}`);
      }

      const parseResult = await parser.parse(htmlStorage.html_content, htmlStorage.url);
      
      if (parseResult.success && parseResult.data) {
        const searchData = new SearchPageData({
          ...parseResult.data,
          html_storage_id: htmlStorage._id
        });
        
        await searchData.save();
        
        htmlStorage.is_parsed = true;
         htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
         await htmlStorage.save();

        return {
          success: true,
          message: '搜索页解析完成',
          search_data_id: (searchData._id as any).toString(),
          products_count: parseResult.data.products?.length || 0
        };
      }
    }

    throw new Error('解析失败或数据无效');

  } catch (error) {
     htmlStorage.parse_attempts = (htmlStorage.parse_attempts || 0) + 1;
     htmlStorage.parse_errors = [error instanceof Error ? error.message : '解析异常'];
     await htmlStorage.save();

     throw error;
   }
};

// 辅助函数：检测平台
const detectPlatform = (url: string): 'alibaba' | 'ozon' | 'other' => {
  const urlLower = url.toLowerCase();
  if (urlLower.includes('1688.com') || urlLower.includes('alibaba.com')) {
    return 'alibaba';
  }
  if (urlLower.includes('ozon.ru')) {
    return 'ozon';
  }
  return 'other';
};

// 辅助函数：检测页面类型
const detectPageType = (url: string): 'product' | 'search' | 'other' => {
  const urlLower = url.toLowerCase();
  
  // 商品页面检测
  if (urlLower.includes('/offer/') || 
      urlLower.includes('/product/') || 
      urlLower.includes('detail.1688.com') ||
      urlLower.includes('/item/')) {
    return 'product';
  }
  
  // 搜索页面检测
  if (urlLower.includes('/search') || 
      urlLower.includes('s.1688.com') ||
      urlLower.includes('search.1688.com') ||
      urlLower.includes('/category/')) {
    return 'search';
  }
  
  return 'other';
};

// 辅助函数：验证URL格式
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * 路由四：从搜索页数据集合获取数据并触发解析
 * POST /api/data-collection/process-search-data
 */
const processSearchData = async (req: Request<{}, any>, res: Response) => {
  try {
    const { 
      platform, 
      limit = 10, 
      auto_trigger_product_collection = true 
    } = req.body;

    // 构建查询条件：查找未处理的搜索页数据
    const query: any = {
      is_processed: false,
      processing_status: 'pending'
    };
    
    if (platform && platform !== 'all') {
      query.platform = platform;
    }

    // 查找未处理的搜索页数据
    const searchDataRecords = await SearchPageData.find(query)
      .limit(Number(limit))
      .sort({ created_at: 1 });

    if (searchDataRecords.length === 0) {
      return res.json({
        success: true,
        message: '没有找到需要处理的搜索页数据',
        processed_count: 0
      });
    }

    const results = [];
    let successCount = 0;
    let failureCount = 0;
    let totalProductsTriggered = 0;

    // 逐个处理搜索页数据
    for (const searchData of searchDataRecords) {
      try {
        // 更新处理状态为进行中
        searchData.processing_status = 'in_progress';
        await searchData.save();

        const processResult = await processSearchDataRecord(searchData, auto_trigger_product_collection);
        
        results.push({
          search_data_id: (searchData._id as any).toString(),
          success: processResult.success,
          message: processResult.message,
          products_triggered: processResult.products_triggered || 0
        });
        
        if (processResult.success) {
          successCount++;
          totalProductsTriggered += processResult.products_triggered || 0;
          
          // 更新处理状态为完成
          searchData.processing_status = 'completed';
          searchData.is_processed = true;
        } else {
          failureCount++;
          searchData.processing_status = 'failed';
          searchData.processing_errors = [processResult.error || '处理失败'];
        }
        
        await searchData.save();

      } catch (error) {
        results.push({
          search_data_id: (searchData._id as any).toString(),
          success: false,
          error: error instanceof Error ? error.message : '处理失败'
        });
        failureCount++;
        
        // 更新处理状态为失败
        searchData.processing_status = 'failed';
        searchData.processing_errors = [error instanceof Error ? error.message : '处理异常'];
        await searchData.save();
      }
    }

    res.json({
      success: true,
      message: `搜索页数据处理完成: 成功${successCount}个，失败${failureCount}个`,
      processed_count: searchDataRecords.length,
      success_count: successCount,
      failure_count: failureCount,
      total_products_triggered: totalProductsTriggered,
      results
    });

  } catch (error) {
    console.error('处理搜索页数据失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

// 辅助函数：处理单个搜索页数据记录
const processSearchDataRecord = async (searchData: any, autoTriggerCollection = true) => {
  try {
    const products = searchData.products || [];
    
    if (products.length === 0) {
      return {
        success: true,
        message: '搜索页无商品数据',
        products_triggered: 0
      };
    }

    let triggeredCount = 0;

    if (autoTriggerCollection) {
      // 为每个商品创建收集任务
      for (const product of products) {
        try {
          if (product.product_url) {
            // 检查是否已存在该商品的收集任务
            const existingTask = await TaskModel.findOne({
              target_urls: product.product_url,
              task_type: { $in: ['collect_product', 'crawl_url'] }
            });

            if (!existingTask) {
              // 创建新的商品收集任务
              const taskId = generateTaskId();
              const task = new TaskModel({
                task_id: taskId,
                task_type: 'collect_product',
                status: 'pending',
                target_urls: [product.product_url],
                platform: searchData.platform,
                metadata: {
                  source: 'search_page_processing',
                  search_data_id: searchData._id,
                  product_title: product.title,
                  product_price: product.price,
                  triggered_at: new Date()
                }
              });

              await task.save();
              triggeredCount++;
            }
          }
        } catch (productError) {
          console.error('创建商品收集任务失败:', productError);
          // 继续处理其他商品，不中断整个流程
        }
      }
    }

    return {
      success: true,
      message: `处理完成，触发${triggeredCount}个商品收集任务`,
      products_triggered: triggeredCount
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '处理异常',
      products_triggered: 0
    };
  }
};

// 注册路由
router.post('/crawl-url', crawlUrl);
router.post('/submit-html', submitHtml);
router.post('/parse-html', parseHtml);
router.post('/batch-parse', batchParseHtml);
router.post('/process-search-data', processSearchData);
router.post('/collect', collectProduct);
router.post('/batch-collect', batchCollectProducts);
router.post('/collect-keywords', collectByKeywords);
router.get('/tasks/:taskId', getTaskStatus);
router.get('/tasks', getCollectionTasks);

export default router;