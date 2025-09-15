import { Router } from 'express';
import { taskService } from '../services/taskService.js';
import { authenticateToken } from './auth.js';
import mongoose from 'mongoose';
const router = Router();
// 大部分任务路由需要认证，但AI选品端点暂时开放
// router.use(authenticateToken);
// AI选品推荐 - 必须在所有其他路由之前定义
router.get('/ai-selected-products', async (req, res) => {
    console.log('AI选品路由被调用');
    try {
        // AI选品mock数据
        const aiSelectedProducts = [
            {
                id: 'ai_product_1',
                name: '智能蓝牙耳机 Pro Max',
                price: 299.99,
                originalPrice: 399.99,
                discount: 25,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
                category: '电子产品',
                rating: 4.8,
                reviewCount: 2847,
                aiScore: 95,
                aiReason: '基于用户行为分析，该产品在同类商品中转化率最高，预计ROI可达300%',
                tags: ['热销', '高转化', 'AI推荐'],
                features: ['降噪技术', '长续航', '快充功能'],
                marketTrend: 'rising',
                competitorPrice: 349.99
            },
            {
                id: 'ai_product_2',
                name: '时尚运动手表',
                price: 199.99,
                originalPrice: 249.99,
                discount: 20,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
                category: '运动健康',
                rating: 4.6,
                reviewCount: 1523,
                aiScore: 88,
                aiReason: '运动健康类目增长迅速，该产品用户粘性高，复购率达35%',
                tags: ['新品', '健康', '潮流'],
                features: ['心率监测', '防水设计', '多运动模式'],
                marketTrend: 'rising',
                competitorPrice: 229.99
            },
            {
                id: 'ai_product_3',
                name: '无线充电护眼台灯',
                price: 129.99,
                originalPrice: 159.99,
                discount: 19,
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
                category: '智能家居',
                rating: 4.9,
                reviewCount: 756,
                aiScore: 86,
                aiReason: '护眼概念符合健康趋势，智能家居市场增长稳定，用户满意度极高',
                tags: ['护眼', '智能', '健康'],
                features: ['护眼光源', '智能调节', 'USB充电'],
                marketTrend: 'rising',
                competitorPrice: 149.99
            }
        ];
        // 模拟AI分析统计
        const aiAnalysis = {
            totalProducts: aiSelectedProducts.length,
            averageScore: Math.round(aiSelectedProducts.reduce((sum, p) => sum + p.aiScore, 0) / aiSelectedProducts.length),
            highPotentialCount: aiSelectedProducts.filter(p => p.aiScore >= 85).length,
            risingTrendCount: aiSelectedProducts.filter(p => p.marketTrend === 'rising').length,
            lastUpdated: new Date().toISOString(),
            analysisVersion: '2.1.0'
        };
        res.json({
            success: true,
            data: {
                products: aiSelectedProducts,
                analysis: aiAnalysis
            },
            message: 'AI选品数据获取成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取AI选品数据失败'
            }
        });
    }
});
// 创建任务
router.post('/', async (req, res) => {
    try {
        const taskData = req.body;
        console.log('收到任务创建请求:', JSON.stringify(taskData, null, 2));
        // 基础字段验证
        if (!taskData.title || !taskData.type) {
            console.log('验证失败: 缺少必需字段', { title: taskData.title, type: taskData.type });
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '任务标题和类型是必需的',
                    details: {
                        title: !taskData.title ? '标题不能为空' : null,
                        type: !taskData.type ? '类型不能为空' : null
                    }
                }
            });
        }
        // 验证任务类型并映射前端类型到后端类型
        const typeMapping = {
            'content_optimization': 'content_generation',
            'translation': 'content_generation',
            'upload': 'optimization',
            'monitoring': 'analysis',
            'data_collection': 'data_collection',
            'content_generation': 'content_generation',
            'analysis': 'analysis',
            'optimization': 'optimization',
            'custom': 'custom'
        };
        const mappedType = typeMapping[taskData.type];
        if (!mappedType) {
            console.log('验证失败: 无效的任务类型', taskData.type);
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: `无效的任务类型: ${taskData.type}`,
                    details: {
                        validTypes: Object.keys(typeMapping)
                    }
                }
            });
        }
        // 生成默认标题如果没有提供
        const title = taskData.title || `${taskData.type}任务 - ${new Date().toLocaleString()}`;
        // 构建任务配置，支持复杂字段
        const taskConfig = {};
        // 处理商品ID
        if (taskData.product_id) {
            taskConfig.product_id = taskData.product_id;
        }
        // 处理内容配置
        if (taskData.content) {
            taskConfig.content = taskData.content;
            // 如果有目标平台配置，单独处理
            if (taskData.content.target_platforms) {
                taskConfig.target_platforms = taskData.content.target_platforms;
            }
        }
        // 处理其他配置字段
        if (taskData.config) {
            Object.assign(taskConfig, taskData.config);
        }
        // 处理调度时间
        let scheduledAt = null;
        if (taskData.scheduled_at) {
            scheduledAt = new Date(taskData.scheduled_at);
            if (isNaN(scheduledAt.getTime())) {
                console.log('警告: 无效的调度时间格式', taskData.scheduled_at);
                scheduledAt = null;
            }
        }
        console.log('准备创建任务:', {
            title,
            type: mappedType,
            priority: taskData.priority || 'medium',
            configKeys: Object.keys(taskConfig)
        });
        // 创建数据库任务
        const newTask = await taskService.createDatabaseTask({
            title: title,
            description: taskData.description || '',
            type: mappedType,
            config: taskConfig,
            priority: taskData.priority || 'medium',
            created_by: new mongoose.Types.ObjectId(), // 临时处理，无认证模式
            scheduled_at: scheduledAt
        });
        res.status(201).json({
            success: true,
            data: {
                id: newTask._id,
                task_id: newTask.task_id,
                title: newTask.title,
                description: newTask.description,
                type: newTask.type,
                status: newTask.status,
                priority: newTask.priority,
                created_at: newTask.created_at,
                updated_at: newTask.updated_at
            },
            message: '任务创建成功'
        });
    }
    catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '创建任务失败'
            }
        });
    }
});
// 接收爬取结果
router.post('/:taskId/complete', (req, res) => {
    const { taskId } = req.params;
    const { data, success, error } = req.body;
    if (!taskId) {
        return res.status(400).json({ error: 'Task ID is required' });
    }
    const result = taskService.completeTask(taskId, data, success, error);
    if (!result) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ success: true, message: 'Task result received' });
});
// 获取单个任务详情
router.get('/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '任务ID是必需的'
                }
            });
        }
        // TODO: 实现获取单个任务逻辑
        // - 验证任务ID
        // - 获取任务详情
        // - 包含相关的执行历史和结果
        const task = taskService.getTask(taskId);
        if (!task) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'TASK_NOT_FOUND',
                    message: '任务不存在'
                }
            });
        }
        res.json({
            success: true,
            data: task
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取任务失败'
            }
        });
    }
});
// 更新任务
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // TODO: 实现任务更新逻辑
        // - 验证任务ID和更新数据
        // - 更新任务信息
        // - 记录变更历史
        // - 触发相关通知
        res.json({
            success: true,
            data: {
                id,
                ...updateData,
                updated_at: new Date().toISOString()
            },
            message: '任务更新成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '更新任务失败'
            }
        });
    }
});
// 更新任务状态
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, comment } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '状态是必需的'
                }
            });
        }
        // TODO: 实现状态更新逻辑
        // - 验证状态转换的合法性
        // - 更新任务状态
        // - 记录状态变更历史
        // - 触发状态变更通知
        res.json({
            success: true,
            data: {
                id,
                status,
                updated_at: new Date().toISOString(),
                ...(comment && { comment })
            },
            message: '任务状态更新成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '更新任务状态失败'
            }
        });
    }
});
// 分配任务
router.post('/:id/assign', async (req, res) => {
    try {
        const { id } = req.params;
        const { assignee_id, comment } = req.body;
        if (!assignee_id) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '执行者ID是必需的'
                }
            });
        }
        // TODO: 实现任务分配逻辑
        // - 验证执行者权限
        // - 分配任务
        // - 发送分配通知
        // - 记录分配历史
        res.json({
            success: true,
            data: {
                task_id: id,
                assignee_id,
                assigned_at: new Date().toISOString(),
                ...(comment && { comment })
            },
            message: '任务分配成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '分配任务失败'
            }
        });
    }
});
// 获取AI建议
router.post('/:id/ai-suggestions', async (req, res) => {
    try {
        const { id } = req.params;
        const { context, request_type } = req.body;
        // TODO: 实现AI建议逻辑
        // - 获取任务上下文
        // - 调用AI服务生成建议
        // - 返回建议内容
        // - 记录AI调用历史
        res.json({
            success: true,
            data: {
                suggestions: [
                    {
                        type: 'optimization',
                        content: 'AI建议内容示例',
                        confidence: 0.85,
                        reasoning: 'AI推理过程'
                    }
                ],
                generated_at: new Date().toISOString()
            },
            message: 'AI建议生成成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取AI建议失败'
            }
        });
    }
});
// 内容翻译
router.post('/:id/translate', async (req, res) => {
    try {
        const { id } = req.params;
        const { content, target_language, source_language } = req.body;
        if (!content || !target_language) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '内容和目标语言是必需的'
                }
            });
        }
        // TODO: 实现内容翻译逻辑
        // - 调用翻译服务
        // - 保存翻译结果
        // - 更新任务内容
        // - 记录翻译历史
        res.json({
            success: true,
            data: {
                original_content: content,
                translated_content: '翻译后的内容',
                source_language: source_language || 'auto',
                target_language,
                translated_at: new Date().toISOString()
            },
            message: '内容翻译成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '内容翻译失败'
            }
        });
    }
});
// 获取任务列表
router.get('/', async (req, res) => {
    try {
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const status = req.query.status;
        const type = req.query.type;
        const assignee_id = req.query.assignee_id;
        const options = {
            page,
            limit,
            ...(status && { status }),
            ...(type && { type }),
            ...(assignee_id && { assignee_id })
        };
        // 实现任务列表查询逻辑
        const Task = (await import('../models/Task.js')).default;
        // 构建查询条件
        const query = {};
        if (status)
            query.status = status;
        if (type)
            query.type = type;
        if (assignee_id)
            query.assignee_id = assignee_id;
        // 分页查询
        const skip = (page - 1) * limit;
        const tasks = await Task.find(query)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        // 获取总数
        const total = await Task.countDocuments(query);
        const totalPages = Math.ceil(total / limit);
        // 获取统计信息
        const stats = await Task.aggregate([
            { $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                } }
        ]);
        const statsObj = {
            pending: 0,
            in_progress: 0,
            completed: 0,
            failed: 0
        };
        stats.forEach(stat => {
            if (stat._id in statsObj) {
                statsObj[stat._id] = stat.count;
            }
        });
        const taskList = {
            tasks: tasks.map(task => ({
                id: task._id,
                task_id: task.task_id,
                title: task.title,
                description: task.description,
                type: task.type,
                status: task.status,
                priority: task.priority,
                created_at: task.created_at,
                updated_at: task.updated_at
            })),
            pagination: {
                current_page: page,
                per_page: limit,
                total,
                total_pages: totalPages
            },
            stats: statsObj
        };
        res.json({
            success: true,
            data: taskList
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取任务列表失败'
            }
        });
    }
});
export default router;
//# sourceMappingURL=tasks.js.map