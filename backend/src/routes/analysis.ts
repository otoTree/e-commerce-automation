import { Router, type Request, type Response } from 'express';
import { TaskModel, DeepAnalysisResult, ProductFullData } from '../models/index.js';
import { generateTaskId } from '../utils/taskUtils.js';
import { taskExecutor } from '../services/taskExecutor.js';

const router = Router();

// 分析相关API接口类型定义
interface AnalyzeProductRequest {
  analysis_options?: {
    include_market_heat?: boolean;
    include_profit_analysis?: boolean;
    include_competitiveness?: boolean;
  };
}

interface BatchAnalysisRequest {
  product_ids: string[];
  analysis_options?: {
    include_market_heat?: boolean;
    include_profit_analysis?: boolean;
    include_competitiveness?: boolean;
  };
}

interface AnalysisResponse {
  success: boolean;
  task_id?: string;
  analysis?: any;
  error?: string;
}

/**
 * 触发商品分析
 * POST /api/analysis/products/:productId/analyze
 */
const analyzeProduct = async (req: Request<{ productId: string }, AnalysisResponse, AnalyzeProductRequest>, res: Response<AnalysisResponse>) => {
  try {
    const { productId } = req.params;
    const { analysis_options = {} } = req.body;
    
    // 验证商品是否存在
    const product = await ProductFullData.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        error: '商品不存在' 
      });
    }
    
    // 创建分析任务
    const taskId = generateTaskId();
    const task = new TaskModel({
      task_id: taskId,
      type: 'deep_analysis',
      status: 'pending',
      input: {
        product_ids: [productId],
        analysis_options
      },
      progress: {
        total_items: 1,
        processed_items: 0,
        percentage: 0
      }
    });
    
    await task.save();
    
    // 直接在后端执行分析任务，不需要等待插件轮询
    console.log(`🚀 立即执行分析任务: ${taskId}`);
    taskExecutor.executeTaskById(taskId).catch(error => {
      console.error(`分析任务执行失败: ${taskId}`, error);
    });
    
    res.json({ 
      success: true, 
      task_id: taskId 
    });
  } catch (error) {
    console.error('创建分析任务失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取分析结果
 * GET /api/analysis/products/:productId/analysis
 */
const getAnalysisResult = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const { productId } = req.params;
    
    const analysisResult = await DeepAnalysisResult.findOne({ product_id: productId })
      .sort({ 'analysis_meta.analyzed_at': -1 });
    
    if (!analysisResult) {
      return res.status(404).json({ 
        success: false, 
        error: '分析结果不存在' 
      });
    }
    
    res.json({ 
      success: true, 
      analysis: analysisResult 
    });
  } catch (error) {
    console.error('获取分析结果失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取市场热度数据
 * GET /api/analysis/products/:productId/market-heat
 */
const getMarketHeatData = async (req: Request<{ productId: string }>, res: Response) => {
  try {
    const { productId } = req.params;
    
    const analysisResult = await DeepAnalysisResult.findOne({ product_id: productId })
      .select('market_heat analysis_meta.analyzed_at')
      .sort({ 'analysis_meta.analyzed_at': -1 });
    
    if (!analysisResult) {
      return res.status(404).json({ 
        success: false, 
        error: '市场热度数据不存在' 
      });
    }
    
    res.json({ 
      success: true, 
      heat_data: analysisResult.market_heat 
    });
  } catch (error) {
    console.error('获取市场热度数据失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 批量获取分析结果
 * POST /api/analysis/products/batch-analysis
 */
const getBatchAnalysisResults = async (req: Request<{}, any, BatchAnalysisRequest>, res: Response) => {
  try {
    const { product_ids } = req.body;
    
    if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '商品ID列表不能为空' 
      });
    }
    
    const analysisResults = await DeepAnalysisResult.find({ 
      product_id: { $in: product_ids } 
    }).sort({ 'analysis_meta.analyzed_at': -1 });
    
    // 按product_id分组，每个商品只返回最新的分析结果
    const resultMap = new Map();
    analysisResults.forEach(result => {
      if (!resultMap.has(result.product_id)) {
        resultMap.set(result.product_id, result);
      }
    });
    
    const results = Array.from(resultMap.values());
    
    res.json({ 
      success: true, 
      results: results.map(result => ({
        product_id: result.product_id,
        analysis: result,
        analyzed_at: result.analysis_meta.analyzed_at
      }))
    });
  } catch (error) {
    console.error('批量获取分析结果失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取分析结果列表
 * GET /api/analysis/results
 */
const getAnalysisResults = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      product_id, 
      status 
    } = req.query;
    
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;
    
    // 构建查询条件
    const query: any = {};
    if (product_id) {
      query.product_id = product_id;
    }
    
    // 获取分析结果
    const analysisResults = await DeepAnalysisResult.find(query)
      .sort({ 'analysis_meta.analyzed_at': -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('product_id', 'title price currency category platform');
    
    const total = await DeepAnalysisResult.countDocuments(query);
    
    // 转换为前端期望的格式
    const results = analysisResults.map(result => ({
      id: result._id?.toString() || '',
      productId: result.product_id,
      productTitle: (result.product_id as any)?.title || '未知商品',
      marketHeat: {
        score: result.market_heat?.current_heat_score || 0,
        trend: result.market_heat?.heat_trend || 'stable',
        searchVolume: result.market_heat?.heat_factors?.search_volume_trend || 0,
        competitorCount: 0 // 这个字段在模型中不存在，设为默认值
      },
      profitAnalysis: {
        estimatedProfit: result.deep_analysis?.profit_potential?.estimated_margin || 0,
        profitMargin: result.deep_analysis?.profit_potential?.estimated_margin || 0,
        breakEvenPoint: 0, // 这个字段在模型中不存在，设为默认值
        roi: result.deep_analysis?.profit_potential?.roi_projection || 0
      },
      competitiveness: {
        score: result.deep_analysis?.competitiveness?.score || 0,
        strengths: result.deep_analysis?.competitiveness?.insights || [],
        weaknesses: [], // 这个字段在模型中不存在，设为默认值
        recommendations: result.overall_assessment?.key_reasons || []
      },
      createdAt: result.analysis_meta?.analyzed_at || new Date(),
      status: 'completed' // 已存在的分析结果都是完成状态
    }));
    
    res.json({
      success: true,
      data: results,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('获取分析结果列表失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取分析任务列表
 * GET /api/analysis/tasks
 */
const getAnalysisTasks = async (req: Request, res: Response) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 20, 
      sort = '-meta.created_at' 
    } = req.query;
    
    const filter: any = { type: 'deep_analysis' };
    if (status) {
      filter.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [tasks, total] = await Promise.all([
      TaskModel.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(Number(limit))
        .select('task_id type status progress meta output'),
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
    console.error('获取分析任务列表失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

/**
 * 获取分析统计数据
 * GET /api/analysis/statistics
 */
const getAnalysisStatistics = async (req: Request, res: Response) => {
  try {
    const [
      totalAnalyses,
      recentAnalyses,
      recommendationStats,
      heatTrendStats
    ] = await Promise.all([
      // 总分析数量
      DeepAnalysisResult.countDocuments(),
      
      // 最近7天的分析数量
      DeepAnalysisResult.countDocuments({
        'analysis_meta.analyzed_at': { 
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        }
      }),
      
      // 推荐统计
      DeepAnalysisResult.aggregate([
        {
          $group: {
            _id: '$overall_assessment.recommendation',
            count: { $sum: 1 }
          }
        }
      ]),
      
      // 热度趋势统计
      DeepAnalysisResult.aggregate([
        {
          $group: {
            _id: '$market_heat.heat_trend',
            count: { $sum: 1 },
            avg_heat_score: { $avg: '$market_heat.current_heat_score' }
          }
        }
      ])
    ]);
    
    res.json({
      success: true,
      statistics: {
        total_analyses: totalAnalyses,
        recent_analyses: recentAnalyses,
        recommendation_distribution: recommendationStats.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        heat_trend_distribution: heatTrendStats.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            avg_heat_score: Math.round(item.avg_heat_score * 100) / 100
          };
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('获取分析统计数据失败:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : '内部服务器错误' 
    });
  }
};

// 注册路由
router.post('/products/:productId/analyze', analyzeProduct);
router.get('/products/:productId/analysis', getAnalysisResult);
router.get('/products/:productId/market-heat', getMarketHeatData);
router.post('/products/batch-analysis', getBatchAnalysisResults);
router.get('/results', getAnalysisResults);
router.get('/tasks', getAnalysisTasks);
router.get('/statistics', getAnalysisStatistics);

export default router;