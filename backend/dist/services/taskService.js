import { Task } from '../models/Task.js';
import mongoose from 'mongoose';
class TaskService {
    crawlTasks = new Map();
    taskQueue = [];
    createTask(url, type) {
        const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const task = {
            id: taskId,
            url,
            type,
            status: 'pending',
            createdAt: new Date()
        };
        this.crawlTasks.set(taskId, task);
        this.taskQueue.push(taskId);
        console.log(`Created crawl task: ${taskId} for ${url}`);
        return task;
    }
    // 创建数据库任务
    async createDatabaseTask(taskData) {
        try {
            console.log('Creating database task with data:', taskData);
            const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const task = new Task({
                ...taskData,
                task_id: taskId,
                status: 'pending'
            });
            console.log('Task object created, attempting to save...');
            const savedTask = await task.save();
            console.log('Task saved to database successfully:', {
                id: savedTask._id,
                task_id: savedTask.task_id,
                title: savedTask.title
            });
            return savedTask;
        }
        catch (error) {
            console.error('Error creating database task:', error);
            throw error;
        }
    }
    getTask(taskId) {
        return this.crawlTasks.get(taskId);
    }
    getAllTasks() {
        return Array.from(this.crawlTasks.values());
    }
    getAvailableTasks(limit = 5) {
        return Array.from(this.crawlTasks.values())
            .filter(task => task.status === 'pending')
            .slice(0, limit);
    }
    assignTasksToExtension(extensionId, tasks) {
        tasks.forEach(task => {
            task.status = 'assigned';
            task.assignedTo = extensionId;
        });
    }
    completeTask(taskId, data, success = true, error) {
        const task = this.crawlTasks.get(taskId);
        if (!task) {
            return false;
        }
        task.status = success ? 'completed' : 'failed';
        task.completedAt = new Date();
        task.data = data;
        if (error) {
            task.error = error;
            console.error(`Task ${taskId} failed:`, error);
        }
        else {
            console.log(`Task ${taskId} completed successfully with ${data?.total || 0} products`);
            // 如果任务成功完成，保存提取的商品数据
            if (success && data && data.products) {
                this.saveProductData(taskId, data);
            }
        }
        // 同时更新数据库中的任务状态
        this.updateDatabaseTaskStatus(taskId, success, data, error);
        return true;
    }
    // 更新数据库任务状态
    async updateDatabaseTaskStatus(taskId, success, data, error) {
        try {
            const task = await Task.findOne({ task_id: taskId });
            if (!task) {
                console.log(`Database task ${taskId} not found, skipping status update`);
                return;
            }
            // 更新任务状态
            task.status = success ? 'completed' : 'failed';
            // 更新最后一次执行记录
            const lastExecution = task.execution_history[task.execution_history.length - 1];
            if (lastExecution) {
                lastExecution.completed_at = new Date();
                lastExecution.status = success ? 'completed' : 'failed';
                if (lastExecution.result) {
                    if (success && data) {
                        lastExecution.result.success = true;
                        lastExecution.result.data = data;
                        if (lastExecution.result.metrics) {
                            lastExecution.result.metrics.items_processed = data.products?.length || 0;
                        }
                    }
                    else if (error) {
                        lastExecution.result.success = false;
                    }
                }
                if (error) {
                    lastExecution.error = {
                        code: 'EXECUTION_ERROR',
                        message: error
                    };
                }
                // 添加完成日志
                lastExecution.logs.push({
                    timestamp: new Date(),
                    level: success ? 'info' : 'error',
                    message: success ? 'Task completed successfully' : `Task failed: ${error}`
                });
            }
            await task.save();
            console.log(`Updated database task ${taskId} status to ${task.status}`);
        }
        catch (dbError) {
            console.error(`Error updating database task ${taskId}:`, dbError);
        }
    }
    // 保存商品数据到数据库
    async saveProductData(taskId, data) {
        try {
            console.log(`Saving ${data.products.length} products from task ${taskId}`);
            // 查找对应的数据库任务
            const task = await Task.findOne({ task_id: taskId });
            if (task) {
                // 更新任务的输出数据
                task.output.structured_data = {
                    format: 'json',
                    data: data.products,
                    record_count: data.products.length
                };
                task.output.statistics = {
                    total_items: data.total || data.products.length,
                    successful_items: data.products.length,
                    failed_items: 0,
                    processing_rate: data.products.length / 60, // 假设1分钟处理时间
                    quality_score: 95
                };
                await task.save();
                console.log(`Saved product data to database for task ${taskId}`);
            }
            // 记录商品信息到日志
            data.products.forEach((product, index) => {
                console.log(`Product ${index + 1}: ${product.title} - ${product.price}`);
            });
        }
        catch (error) {
            console.error(`Error saving product data for task ${taskId}:`, error);
        }
    }
}
export const taskService = new TaskService();
//# sourceMappingURL=taskService.js.map