import type { CrawlTask } from '../types/index.js';
import { type ITask } from '../models/Task.js';
import mongoose from 'mongoose';
declare class TaskService {
    private crawlTasks;
    private taskQueue;
    createTask(url: string, type: '1688' | 'taobao' | 'tmall'): CrawlTask;
    createDatabaseTask(taskData: {
        title: string;
        description?: string;
        type: 'data_collection' | 'content_generation' | 'analysis' | 'optimization' | 'custom';
        config?: any;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        created_by: mongoose.Types.ObjectId;
    }): Promise<ITask>;
    getTask(taskId: string): CrawlTask | undefined;
    getAllTasks(): CrawlTask[];
    getAvailableTasks(limit?: number): CrawlTask[];
    assignTasksToExtension(extensionId: string, tasks: CrawlTask[]): void;
    completeTask(taskId: string, data?: any, success?: boolean, error?: string): boolean;
    updateDatabaseTaskStatus(taskId: string, success: boolean, data?: any, error?: string): Promise<void>;
    private saveProductData;
}
export declare const taskService: TaskService;
export {};
//# sourceMappingURL=taskService.d.ts.map