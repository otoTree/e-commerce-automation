import { Router } from 'express';
import { taskService } from '../services/taskService.js';
import { authenticateToken } from './auth.js';
import mongoose from 'mongoose';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';
const router = Router();
// ==================== 基础任务CRUD操作 ====================
// GET /api/tasks - 获取任务列表
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20, status, type, priority, assigned_to, search, sort_by = 'created_at', sort_order = 'desc' } = req.query;
        // 构建查询条件
        const query = {};
        if (status) {
            query.status = status;
        }
        if (type) {
            query.type = type;
        }
        if (priority) {
            query.priority = priority;
        }
        if (assigned_to) {
            query.assigned_to = assigned_to;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { task_id: { $regex: search, $options: 'i' } }
            ];
        }
        // 计算分页
        const skip = (Number(page) - 1) * Number(limit);
        // 构建排序
        const sortObj = {};
        sortObj[sort_by] = sort_order === 'desc' ? -1 : 1;
        // 查询任务
        const tasks = await Task.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(Number(limit))
            .populate('assigned_to', 'username email')
            .populate('created_by', 'username email');
        // 获取总数
        const total = await Task.countDocuments(query);
        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    totalPages: Math.ceil(total / Number(limit)),
                    hasNext: skip + Number(limit) < total,
                    hasPrev: Number(page) > 1
                }
            }
        });
    }
    catch (error) {
        console.error('获取任务列表失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取任务列表失败'
            }
        });
    }
});
// GET /api/tasks/:id - 获取单个任务详情
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: '无效的任务ID'
            });
        }
        const task = await Task.findOne({
            _id: new mongoose.Types.ObjectId(id)
        })
            .populate('assigned_to', 'username email')
            .populate('created_by', 'username email');
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
        console.error('获取任务详情失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取任务详情失败'
            }
        });
    }
});
// POST /api/tasks - 创建新任务
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, type, priority = 'medium', assigned_to, scheduled_at, config, operation_config } = req.body;
        // 验证必需字段
        if (!title || !type) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '任务标题和类型是必需的'
                }
            });
        }
        // 生成任务ID
        const taskId = `TASK_${Date.now()}_${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
        // 创建任务
        const task = new Task({
            task_id: taskId,
            title,
            description,
            type,
            priority,
            status: 'pending',
            assigned_to: assigned_to ? new mongoose.Types.ObjectId(assigned_to) : undefined,
            scheduled_at: scheduled_at ? new Date(scheduled_at) : undefined,
            config: config || {},
            operation_config: operation_config || {},
            created_by: req.user?.id,
            created_at: new Date(),
            updated_at: new Date()
        });
        await task.save();
        // 填充关联数据
        await task.populate('assigned_to', 'username email');
        await task.populate('created_by', 'username email');
        res.status(201).json({
            success: true,
            data: task,
            message: '任务创建成功'
        });
    }
    catch (error) {
        console.error('创建任务失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '创建任务失败'
            }
        });
    }
});
// PUT /api/tasks/:id - 更新任务
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, type, priority, status, assigned_to, scheduled_at, config, operation_config } = req.body;
        const updateData = {
            updated_at: new Date()
        };
        // 只更新提供的字段
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (type !== undefined)
            updateData.type = type;
        if (priority !== undefined)
            updateData.priority = priority;
        if (status !== undefined)
            updateData.status = status;
        if (assigned_to !== undefined) {
            updateData.assigned_to = assigned_to ? new mongoose.Types.ObjectId(assigned_to) : null;
        }
        if (scheduled_at !== undefined) {
            updateData.scheduled_at = scheduled_at ? new Date(scheduled_at) : null;
        }
        if (config !== undefined)
            updateData.config = config;
        if (operation_config !== undefined)
            updateData.operation_config = operation_config;
        const task = await Task.findOneAndUpdate({
            $or: [
                { _id: (id && mongoose.Types.ObjectId.isValid(id)) ? new mongoose.Types.ObjectId(id) : null },
                { task_id: id }
            ]
        }, updateData, { new: true })
            .populate('assigned_to', 'username email')
            .populate('created_by', 'username email');
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
            data: task,
            message: '任务更新成功'
        });
    }
    catch (error) {
        console.error('更新任务失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '更新任务失败'
            }
        });
    }
});
// PATCH /api/tasks/:id/status - 更新任务状态
router.patch('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, message } = req.body;
        if (!status) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '状态是必需的'
                }
            });
        }
        const updateData = {
            status,
            updated_at: new Date()
        };
        // 根据状态更新相关时间戳
        if (status === 'in_progress' && !updateData.started_at) {
            updateData.started_at = new Date();
        }
        else if (status === 'completed' || status === 'failed') {
            updateData.completed_at = new Date();
        }
        const task = await Task.findOneAndUpdate({
            $or: [
                { _id: (id && mongoose.Types.ObjectId.isValid(id)) ? new mongoose.Types.ObjectId(id) : null },
                { task_id: id }
            ]
        }, updateData, { new: true })
            .populate('assigned_to', 'username email')
            .populate('created_by', 'username email');
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
            data: task,
            message: '任务状态更新成功'
        });
    }
    catch (error) {
        console.error('更新任务状态失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '更新任务状态失败'
            }
        });
    }
});
// DELETE /api/tasks/:id - 删除任务
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({
            $or: [
                { _id: (id && mongoose.Types.ObjectId.isValid(id)) ? new mongoose.Types.ObjectId(id) : null },
                { task_id: id }
            ]
        });
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
            message: '任务删除成功'
        });
    }
    catch (error) {
        console.error('删除任务失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '删除任务失败'
            }
        });
    }
});
// POST /api/tasks/:id/assign - 分配任务
router.post('/:id/assign', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { assigned_to } = req.body;
        if (!assigned_to) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '分配用户ID是必需的'
                }
            });
        }
        // 验证用户是否存在
        const user = await User.findById(assigned_to);
        if (!user) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'USER_NOT_FOUND',
                    message: '指定的用户不存在'
                }
            });
        }
        const task = await Task.findOneAndUpdate({
            $or: [
                { _id: (id && mongoose.Types.ObjectId.isValid(id)) ? new mongoose.Types.ObjectId(id) : null },
                { task_id: id }
            ]
        }, {
            assigned_to: new mongoose.Types.ObjectId(assigned_to),
            updated_at: new Date()
        }, { new: true })
            .populate('assigned_to', 'username email')
            .populate('created_by', 'username email');
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
            data: task,
            message: '任务分配成功'
        });
    }
    catch (error) {
        console.error('分配任务失败:', error);
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '分配任务失败'
            }
        });
    }
});
// ==================== 兼容旧版API ====================
// POST /api/tasks/create - 创建爬取任务（兼容旧版）
router.post('/create', async (req, res) => {
    try {
        const { url, type } = req.body;
        if (!url || !type) {
            return res.status(400).json({
                success: false,
                message: 'URL和类型是必需的'
            });
        }
        const taskId = `task-${Date.now()}`;
        const task = new Task({
            task_id: taskId,
            title: `${type}数据采集任务`,
            description: `从 ${url} 采集数据`,
            type: 'data_collection',
            status: 'pending',
            config: {
                data_collection: {
                    source_urls: [url],
                    target_selectors: [],
                    filters: {}
                }
            },
            created_at: new Date(),
            updated_at: new Date()
        });
        await task.save();
        res.json({
            success: true,
            taskId,
            task: {
                id: taskId,
                url,
                type,
                status: 'pending',
                createdAt: task.created_at
            }
        });
    }
    catch (error) {
        console.error('创建爬取任务失败:', error);
        res.status(500).json({
            success: false,
            message: '创建任务失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
// POST /api/tasks/:taskId/complete - 完成任务（兼容旧版）
router.post('/:taskId/complete', async (req, res) => {
    try {
        const { taskId } = req.params;
        const { data, success, error } = req.body;
        const updateData = {
            status: success ? 'completed' : 'failed',
            completed_at: new Date(),
            updated_at: new Date()
        };
        if (data) {
            updateData.output = {
                structured_data: {
                    format: 'json',
                    data,
                    record_count: Array.isArray(data.products) ? data.products.length : 0
                }
            };
        }
        if (error) {
            updateData.error_message = error;
        }
        await Task.findOneAndUpdate({ task_id: taskId }, updateData);
        res.json({
            success: true,
            message: 'Task result received'
        });
    }
    catch (error) {
        console.error('完成任务失败:', error);
        res.status(500).json({
            success: false,
            message: '更新任务状态失败',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
export default router;
//# sourceMappingURL=tasks.js.map