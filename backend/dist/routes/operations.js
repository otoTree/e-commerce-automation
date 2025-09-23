import express from 'express';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { ProductAnalysis, GeneratedContent, MarketingStrategy, PerformanceTracking } from '../models/OperationAnalysis.js';
const router = express.Router();
// 通用的taskId验证函数
const validateTaskId = (taskId) => {
    return typeof taskId === 'string' && mongoose.Types.ObjectId.isValid(taskId);
};
// 通用的任务查找函数
const findTaskById = async (taskId) => {
    if (!validateTaskId(taskId)) {
        throw new Error('Invalid task ID');
    }
    const task = await Task.findById(new mongoose.Types.ObjectId(taskId));
    if (!task) {
        throw new Error('Task not found');
    }
    return task;
};
// 商品分析相关接口
// 获取商品分析列表
router.get('/product-analysis', async (req, res) => {
    try {
        const { taskId, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (taskId && validateTaskId(taskId)) {
            filter.taskId = new mongoose.Types.ObjectId(taskId);
        }
        const analyses = await ProductAnalysis.find(filter)
            .populate('taskId', 'title description')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await ProductAnalysis.countDocuments(filter);
        res.json({
            success: true,
            data: analyses,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取商品分析列表失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 创建商品分析
router.post('/product-analysis', async (req, res) => {
    try {
        const { taskId, productData, analysisType } = req.body;
        if (!validateTaskId(taskId)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        // 验证任务存在
        await findTaskById(taskId);
        const analysis = new ProductAnalysis({
            taskId: new mongoose.Types.ObjectId(taskId),
            productData,
            analysisType,
            status: 'pending'
        });
        await analysis.save();
        res.status(201).json({
            success: true,
            data: analysis,
            message: '商品分析创建成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '创建商品分析失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 获取单个商品分析
router.get('/product-analysis/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的分析ID'
            });
        }
        const analysis = await ProductAnalysis.findById(id)
            .populate('taskId', 'title description');
        if (!analysis) {
            return res.status(404).json({
                success: false,
                message: '商品分析不存在'
            });
        }
        res.json({
            success: true,
            data: analysis
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取商品分析失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 内容生成相关接口
// 获取生成内容列表
router.get('/generated-content', async (req, res) => {
    try {
        const { taskId, contentType, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (taskId && validateTaskId(taskId)) {
            filter.taskId = new mongoose.Types.ObjectId(taskId);
        }
        if (contentType) {
            filter.contentType = contentType;
        }
        const contents = await GeneratedContent.find(filter)
            .populate('taskId', 'title description')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await GeneratedContent.countDocuments(filter);
        res.json({
            success: true,
            data: contents,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取生成内容列表失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 创建生成内容
router.post('/generated-content', async (req, res) => {
    try {
        const { taskId, contentType, prompt, parameters } = req.body;
        if (!validateTaskId(taskId)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        // 验证任务存在
        await findTaskById(taskId);
        const content = new GeneratedContent({
            taskId: new mongoose.Types.ObjectId(taskId),
            contentType,
            prompt,
            parameters,
            status: 'pending'
        });
        await content.save();
        res.status(201).json({
            success: true,
            data: content,
            message: '内容生成任务创建成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '创建内容生成任务失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 营销策略相关接口
// 获取营销策略列表
router.get('/marketing-strategies', async (req, res) => {
    try {
        const { taskId, strategyType, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (taskId && validateTaskId(taskId)) {
            filter.taskId = new mongoose.Types.ObjectId(taskId);
        }
        if (strategyType) {
            filter.strategyType = strategyType;
        }
        const strategies = await MarketingStrategy.find(filter)
            .populate('taskId', 'title description')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await MarketingStrategy.countDocuments(filter);
        res.json({
            success: true,
            data: strategies,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取营销策略列表失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 创建营销策略
router.post('/marketing-strategies', async (req, res) => {
    try {
        const { taskId, strategyType, targetAudience, budget, timeline } = req.body;
        if (!validateTaskId(taskId)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        // 验证任务存在
        await findTaskById(taskId);
        const strategy = new MarketingStrategy({
            taskId: new mongoose.Types.ObjectId(taskId),
            strategyType,
            targetAudience,
            budget,
            timeline,
            status: 'draft'
        });
        await strategy.save();
        res.status(201).json({
            success: true,
            data: strategy,
            message: '营销策略创建成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '创建营销策略失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 效果跟踪相关接口
// 获取效果跟踪列表
router.get('/performance-tracking', async (req, res) => {
    try {
        const { taskId, page = 1, limit = 10 } = req.query;
        const filter = {};
        if (taskId && validateTaskId(taskId)) {
            filter.taskId = new mongoose.Types.ObjectId(taskId);
        }
        const trackings = await PerformanceTracking.find(filter)
            .populate('taskId', 'title description')
            .sort({ createdAt: -1 })
            .limit(Number(limit) * 1)
            .skip((Number(page) - 1) * Number(limit));
        const total = await PerformanceTracking.countDocuments(filter);
        res.json({
            success: true,
            data: trackings,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取效果跟踪列表失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 创建效果跟踪
router.post('/performance-tracking', async (req, res) => {
    try {
        const { taskId, metrics, trackingPeriod } = req.body;
        if (!validateTaskId(taskId)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        // 验证任务存在
        await findTaskById(taskId);
        const tracking = new PerformanceTracking({
            taskId: new mongoose.Types.ObjectId(taskId),
            metrics,
            trackingPeriod,
            status: 'active'
        });
        await tracking.save();
        res.status(201).json({
            success: true,
            data: tracking,
            message: '效果跟踪创建成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '创建效果跟踪失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 更新效果跟踪数据
router.put('/performance-tracking/:id/metrics', async (req, res) => {
    try {
        const { id } = req.params;
        const { metrics } = req.body;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的跟踪ID'
            });
        }
        const tracking = await PerformanceTracking.findById(id);
        if (!tracking) {
            return res.status(404).json({
                success: false,
                message: '效果跟踪不存在'
            });
        }
        // 更新指标数据
        tracking.metrics = { ...tracking.metrics, ...metrics };
        tracking.updated_at = new Date();
        await tracking.save();
        res.json({
            success: true,
            data: tracking,
            message: '效果跟踪数据更新成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '更新效果跟踪数据失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// 任务分析相关接口
// 获取任务分析报告
router.get('/task-analysis/:taskId', async (req, res) => {
    try {
        const { taskId } = req.params;
        if (!validateTaskId(taskId)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        // 验证任务存在
        const task = await findTaskById(taskId);
        // 获取相关的分析数据
        const [productAnalyses, generatedContents, marketingStrategies, performanceTrackings] = await Promise.all([
            ProductAnalysis.find({ taskId: new mongoose.Types.ObjectId(taskId) }),
            GeneratedContent.find({ taskId: new mongoose.Types.ObjectId(taskId) }),
            MarketingStrategy.find({ taskId: new mongoose.Types.ObjectId(taskId) }),
            PerformanceTracking.find({ taskId: new mongoose.Types.ObjectId(taskId) })
        ]);
        const analysisReport = {
            task: {
                id: task._id,
                title: task.title,
                description: task.description,
                status: task.status
            },
            summary: {
                productAnalysesCount: productAnalyses.length,
                generatedContentsCount: generatedContents.length,
                marketingStrategiesCount: marketingStrategies.length,
                performanceTrackingsCount: performanceTrackings.length
            },
            details: {
                productAnalyses,
                generatedContents,
                marketingStrategies,
                performanceTrackings
            }
        };
        res.json({
            success: true,
            data: analysisReport
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: '获取任务分析报告失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
//# sourceMappingURL=operations.js.map