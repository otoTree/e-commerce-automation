"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Task_1 = require("../models/Task");
const zod_1 = require("zod");
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    try {
        const validatedData = Task_1.CreateTaskSchema.parse(req.body);
        let totalItems = 1;
        if (validatedData.type === 'batch_url' && validatedData.urls) {
            totalItems = validatedData.urls.length;
        }
        else if (validatedData.type === 'keyword' && validatedData.keywords) {
            totalItems = validatedData.keywords.length;
        }
        const task = new Task_1.Task({
            ...validatedData,
            totalItems,
        });
        await task.save();
        return res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.issues
            });
        }
        console.error('Error creating task:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, status, type, priority, tags, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (type)
            filter.type = type;
        if (priority)
            filter.priority = priority;
        if (tags) {
            const tagArray = Array.isArray(tags) ? tags : [tags];
            filter.tags = { $in: tagArray };
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;
        const [tasks, total] = await Promise.all([
            Task_1.Task.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limitNum)
                .lean(),
            Task_1.Task.countDocuments(filter)
        ]);
        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task_1.Task.findById(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        return res.json({
            success: true,
            data: task
        });
    }
    catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = Task_1.UpdateTaskSchema.parse(req.body);
        const task = await Task_1.Task.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        return res.json({
            success: true,
            data: task,
            message: 'Task updated successfully'
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.issues
            });
        }
        console.error('Error updating task:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task_1.Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        return res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.post('/batch', async (req, res) => {
    try {
        const { tasks } = req.body;
        if (!Array.isArray(tasks) || tasks.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Tasks array is required and cannot be empty'
            });
        }
        const validatedTasks = tasks.map(task => Task_1.CreateTaskSchema.parse(task));
        const tasksWithTotalItems = validatedTasks.map(task => {
            let totalItems = 1;
            if (task.type === 'batch_url' && task.urls) {
                totalItems = task.urls.length;
            }
            else if (task.type === 'keyword' && task.keywords) {
                totalItems = task.keywords.length;
            }
            return { ...task, totalItems };
        });
        const createdTasks = await Task_1.Task.insertMany(tasksWithTotalItems);
        return res.status(201).json({
            success: true,
            data: createdTasks,
            message: `${createdTasks.length} tasks created successfully`
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: error.issues
            });
        }
        console.error('Error creating batch tasks:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, progress, errorMessage, result } = req.body;
        const updateData = {};
        if (status) {
            updateData.status = status;
            if (status === 'processing' && !updateData.startedAt) {
                updateData.startedAt = new Date();
            }
            else if (status === 'completed' || status === 'failed') {
                updateData.completedAt = new Date();
            }
        }
        if (typeof progress === 'number')
            updateData.progress = progress;
        if (errorMessage)
            updateData.errorMessage = errorMessage;
        if (result !== undefined)
            updateData.result = result;
        const task = await Task_1.Task.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        if (!task) {
            return res.status(404).json({
                success: false,
                error: 'Task not found'
            });
        }
        return res.json({
            success: true,
            data: task,
            message: 'Task status updated successfully'
        });
    }
    catch (error) {
        console.error('Error updating task status:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await Task_1.Task.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);
        const typeStats = await Task_1.Task.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 }
                }
            }
        ]);
        const priorityStats = await Task_1.Task.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json({
            success: true,
            data: {
                statusStats: stats,
                typeStats,
                priorityStats
            }
        });
    }
    catch (error) {
        console.error('Error fetching task stats:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=tasks.js.map