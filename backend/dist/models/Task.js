import mongoose, { Document, Schema } from 'mongoose';
// 任务Schema定义
const TaskSchema = new Schema({
    // 基础信息
    task_id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        maxlength: 2000
    },
    type: {
        type: String,
        enum: ['data_collection', 'content_generation', 'analysis', 'optimization', 'custom'],
        required: true
    },
    // 任务配置
    config: {
        data_collection: {
            source_urls: [{ type: String }],
            target_selectors: [{ type: String }],
            pagination_config: {
                enabled: { type: Boolean, default: false },
                max_pages: { type: Number, min: 1, default: 1 },
                page_selector: { type: String }
            },
            filters: {
                price_range: {
                    min: { type: Number, min: 0 },
                    max: { type: Number, min: 0 }
                },
                keywords: [{ type: String }],
                exclude_keywords: [{ type: String }]
            }
        },
        content_generation: {
            template_id: { type: Schema.Types.ObjectId, ref: 'TaskTemplate' },
            ai_model: { type: String, default: 'gpt-3.5-turbo' },
            parameters: {
                temperature: { type: Number, min: 0, max: 2, default: 0.7 },
                max_tokens: { type: Number, min: 1, default: 1000 },
                prompt_template: { type: String }
            },
            output_format: {
                type: String,
                enum: ['text', 'html', 'markdown', 'json'],
                default: 'text'
            }
        },
        analysis: {
            analysis_type: {
                type: String,
                enum: ['sentiment', 'keyword', 'trend', 'competitor', 'performance']
            },
            data_sources: [{ type: String }],
            metrics: [{ type: String }],
            time_range: {
                start_date: { type: Date },
                end_date: { type: Date }
            }
        },
        optimization: {
            target_metric: { type: String },
            optimization_type: {
                type: String,
                enum: ['price', 'content', 'seo', 'inventory']
            },
            constraints: {
                min_value: { type: Number },
                max_value: { type: Number },
                rules: [{ type: String }]
            }
        }
    },
    // 执行设置
    execution: {
        schedule: {
            type: {
                type: String,
                enum: ['immediate', 'scheduled', 'recurring'],
                default: 'immediate'
            },
            scheduled_at: { type: Date },
            recurring_pattern: {
                frequency: {
                    type: String,
                    enum: ['hourly', 'daily', 'weekly', 'monthly']
                },
                interval: { type: Number, min: 1, default: 1 },
                days_of_week: [{ type: Number, min: 0, max: 6 }],
                time_of_day: { type: String, match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/ }
            },
            timezone: { type: String, default: 'UTC' }
        },
        limits: {
            max_execution_time: { type: Number, min: 1, default: 3600 },
            max_memory_usage: { type: Number, min: 1, default: 512 },
            max_concurrent_tasks: { type: Number, min: 1, default: 1 },
            retry_attempts: { type: Number, min: 0, default: 3 },
            retry_delay: { type: Number, min: 0, default: 60 }
        },
        notifications: {
            on_start: { type: Boolean, default: false },
            on_completion: { type: Boolean, default: true },
            on_error: { type: Boolean, default: true },
            recipients: [{
                    type: {
                        type: String,
                        enum: ['email', 'webhook', 'slack'],
                        required: true
                    },
                    address: { type: String, required: true }
                }]
        }
    },
    // 状态管理
    status: {
        type: String,
        enum: ['pending', 'running', 'completed', 'failed', 'cancelled', 'paused'],
        default: 'pending'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    // 执行历史
    execution_history: [{
            execution_id: { type: String, required: true },
            started_at: { type: Date, required: true },
            completed_at: { type: Date },
            status: {
                type: String,
                enum: ['running', 'completed', 'failed', 'cancelled'],
                required: true
            },
            result: {
                success: { type: Boolean, required: true },
                data: { type: Schema.Types.Mixed },
                metrics: {
                    execution_time: { type: Number, min: 0 },
                    memory_used: { type: Number, min: 0 },
                    items_processed: { type: Number, min: 0 },
                    errors_count: { type: Number, min: 0 }
                },
                output_files: [{
                        file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true },
                        file_type: { type: String, required: true },
                        file_size: { type: Number, min: 0, required: true },
                        download_url: { type: String, required: true }
                    }]
            },
            error: {
                code: { type: String, required: true },
                message: { type: String, required: true },
                stack: { type: String },
                context: { type: Schema.Types.Mixed }
            },
            logs: [{
                    timestamp: { type: Date, default: Date.now },
                    level: {
                        type: String,
                        enum: ['info', 'warn', 'error', 'debug'],
                        required: true
                    },
                    message: { type: String, required: true },
                    data: { type: Schema.Types.Mixed }
                }]
        }],
    // 依赖关系
    dependencies: {
        parent_tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        child_tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
        required_resources: [{
                type: {
                    type: String,
                    enum: ['file', 'data', 'service'],
                    required: true
                },
                resource_id: { type: String, required: true },
                required: { type: Boolean, default: true }
            }]
    },
    // 资源使用
    resources: {
        estimated_cost: { type: Number, min: 0, default: 0 },
        actual_cost: { type: Number, min: 0, default: 0 },
        cpu_usage: { type: Number, min: 0, default: 0 },
        memory_usage: { type: Number, min: 0, default: 0 },
        storage_usage: { type: Number, min: 0, default: 0 },
        api_calls: { type: Number, min: 0, default: 0 },
        limits: {
            max_cost: { type: Number, min: 0, default: 100 },
            max_cpu: { type: Number, min: 0, default: 80 },
            max_memory: { type: Number, min: 0, default: 1024 },
            max_storage: { type: Number, min: 0, default: 1024 },
            max_api_calls: { type: Number, min: 0, default: 1000 }
        }
    },
    // 数据输出
    output: {
        structured_data: {
            format: {
                type: String,
                enum: ['json', 'csv', 'xml']
            },
            schema: { type: Schema.Types.Mixed },
            data: { type: Schema.Types.Mixed },
            record_count: { type: Number, min: 0, default: 0 }
        },
        files: [{
                file_id: { type: Schema.Types.ObjectId, ref: 'File', required: true },
                filename: { type: String, required: true },
                file_type: { type: String, required: true },
                file_size: { type: Number, min: 0, required: true },
                download_url: { type: String, required: true },
                created_at: { type: Date, default: Date.now }
            }],
        reports: [{
                report_id: { type: String, required: true },
                title: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['summary', 'detailed', 'analysis'],
                    required: true
                },
                format: {
                    type: String,
                    enum: ['html', 'pdf', 'json'],
                    required: true
                },
                content: { type: Schema.Types.Mixed, required: true },
                generated_at: { type: Date, default: Date.now }
            }],
        statistics: {
            total_items: { type: Number, min: 0, default: 0 },
            successful_items: { type: Number, min: 0, default: 0 },
            failed_items: { type: Number, min: 0, default: 0 },
            processing_rate: { type: Number, min: 0, default: 0 },
            accuracy_score: { type: Number, min: 0, max: 1 },
            quality_score: { type: Number, min: 0, max: 1 }
        }
    },
    // 质量控制
    quality_control: {
        validation_rules: [{
                field: { type: String, required: true },
                rule_type: {
                    type: String,
                    enum: ['required', 'format', 'range', 'custom'],
                    required: true
                },
                rule_value: { type: Schema.Types.Mixed, required: true },
                error_message: { type: String, required: true }
            }],
        sampling: {
            enabled: { type: Boolean, default: false },
            sample_size: { type: Number, min: 1, default: 100 },
            sample_method: {
                type: String,
                enum: ['random', 'systematic', 'stratified'],
                default: 'random'
            }
        },
        review: {
            required: { type: Boolean, default: false },
            reviewer_id: { type: Schema.Types.ObjectId, ref: 'User' },
            reviewed_at: { type: Date },
            review_status: {
                type: String,
                enum: ['pending', 'approved', 'rejected'],
                default: 'pending'
            },
            review_comments: { type: String }
        }
    },
    // 标签和分类
    tags: [{ type: String, trim: true }],
    category: { type: String, trim: true },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project' },
    // 通用字段
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
    is_deleted: { type: Boolean, default: false },
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ type: 1 });
TaskSchema.index({ created_by: 1 });
TaskSchema.index({ project_id: 1 });
TaskSchema.index({ 'execution.schedule.scheduled_at': 1 });
TaskSchema.index({ created_at: -1 });
TaskSchema.index({ is_deleted: 1 });
// 复合索引
TaskSchema.index({ status: 1, priority: -1, created_at: -1 });
TaskSchema.index({ type: 1, status: 1 });
TaskSchema.index({ created_by: 1, status: 1 });
// 文本搜索索引
TaskSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text'
});
// 中间件
// 保存前生成task_id
TaskSchema.pre('save', function (next) {
    if (!this.task_id) {
        this.task_id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});
// 更新时间戳
TaskSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
// 虚拟字段
// 是否正在运行
TaskSchema.virtual('is_running').get(function () {
    return this.status === 'running';
});
// 是否已完成
TaskSchema.virtual('is_completed').get(function () {
    return this.status === 'completed';
});
// 是否失败
TaskSchema.virtual('is_failed').get(function () {
    return this.status === 'failed';
});
// 最后执行结果
TaskSchema.virtual('last_execution').get(function () {
    return this.execution_history.length > 0
        ? this.execution_history[this.execution_history.length - 1]
        : null;
});
// 成功率
TaskSchema.virtual('success_rate').get(function () {
    if (this.execution_history.length === 0)
        return 0;
    const successful = this.execution_history.filter(exec => exec.status === 'completed' && exec.result?.success).length;
    return successful / this.execution_history.length;
});
// 静态方法
// 根据状态查找任务
TaskSchema.statics.findByStatus = function (status) {
    return this.find({ status, is_deleted: false });
};
// 根据类型查找任务
TaskSchema.statics.findByType = function (type) {
    return this.find({ type, is_deleted: false });
};
// 查找待执行的任务
TaskSchema.statics.findPendingTasks = function () {
    return this.find({
        status: 'pending',
        $or: [
            { 'execution.schedule.type': 'immediate' },
            {
                'execution.schedule.type': 'scheduled',
                'execution.schedule.scheduled_at': { $lte: new Date() }
            }
        ],
        is_deleted: false
    }).sort({ priority: -1, created_at: 1 });
};
// 搜索任务
TaskSchema.statics.search = function (query, filters = {}) {
    const searchQuery = {
        $text: { $search: query },
        is_deleted: false,
        ...filters
    };
    return this.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
};
// 实例方法
// 开始执行任务
TaskSchema.methods.start = function (executionId) {
    const execution = {
        execution_id: executionId || `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        started_at: new Date(),
        status: 'running',
        logs: [{
                timestamp: new Date(),
                level: 'info',
                message: 'Task execution started'
            }]
    };
    this.execution_history.push(execution);
    this.status = 'running';
    return this.save();
};
// 完成任务
TaskSchema.methods.complete = function (result) {
    const lastExecution = this.execution_history[this.execution_history.length - 1];
    if (lastExecution) {
        lastExecution.completed_at = new Date();
        lastExecution.status = 'completed';
        lastExecution.result = result;
        lastExecution.logs.push({
            timestamp: new Date(),
            level: 'info',
            message: 'Task execution completed successfully'
        });
    }
    this.status = 'completed';
    return this.save();
};
// 任务失败
TaskSchema.methods.fail = function (error) {
    const lastExecution = this.execution_history[this.execution_history.length - 1];
    if (lastExecution) {
        lastExecution.completed_at = new Date();
        lastExecution.status = 'failed';
        lastExecution.error = error;
        lastExecution.logs.push({
            timestamp: new Date(),
            level: 'error',
            message: `Task execution failed: ${error.message}`
        });
    }
    this.status = 'failed';
    return this.save();
};
// 添加日志
TaskSchema.methods.addLog = function (level, message, data) {
    const lastExecution = this.execution_history[this.execution_history.length - 1];
    if (lastExecution) {
        lastExecution.logs.push({
            timestamp: new Date(),
            level: level,
            message,
            data
        });
        return this.save();
    }
};
// 更新进度
TaskSchema.methods.updateProgress = function (processed, total, data) {
    const lastExecution = this.execution_history[this.execution_history.length - 1];
    if (lastExecution && lastExecution.result) {
        lastExecution.result.metrics = {
            ...lastExecution.result.metrics,
            items_processed: processed
        };
        if (data) {
            lastExecution.result.data = data;
        }
        lastExecution.logs.push({
            timestamp: new Date(),
            level: 'info',
            message: `Progress update: ${processed}/${total} items processed`
        });
        return this.save();
    }
};
// 创建并导出模型
export const Task = mongoose.model('Task', TaskSchema);
export default Task;
//# sourceMappingURL=Task.js.map