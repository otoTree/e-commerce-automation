import mongoose, { Document, Schema } from 'mongoose';

// 任务接口定义
export interface ITask extends Document {
  // 基础信息
  task_id: string;
  title: string;
  description?: string;
  type: 'data_collection' | 'content_generation' | 'analysis' | 'optimization' | 'custom';
  
  // 任务配置
  config: {
    // 数据采集配置
    data_collection?: {
      source_urls: string[];
      target_selectors: string[];
      pagination_config?: {
        enabled: boolean;
        max_pages: number;
        page_selector: string;
      };
      filters: {
        price_range?: { min: number; max: number };
        keywords?: string[];
        exclude_keywords?: string[];
      };
    };
    
    // 内容生成配置
    content_generation?: {
      template_id?: mongoose.Types.ObjectId;
      ai_model: string;
      parameters: {
        temperature?: number;
        max_tokens?: number;
        prompt_template: string;
      };
      output_format: 'text' | 'html' | 'markdown' | 'json';
    };
    
    // 分析配置
    analysis?: {
      analysis_type: 'sentiment' | 'keyword' | 'trend' | 'competitor' | 'performance';
      data_sources: string[];
      metrics: string[];
      time_range?: {
        start_date: Date;
        end_date: Date;
      };
    };
    
    // 优化配置
    optimization?: {
      target_metric: string;
      optimization_type: 'price' | 'content' | 'seo' | 'inventory';
      constraints: {
        min_value?: number;
        max_value?: number;
        rules?: string[];
      };
    };
  };
  
  // 执行设置
  execution: {
    // 调度设置
    schedule: {
      type: 'immediate' | 'scheduled' | 'recurring';
      scheduled_at?: Date;
      recurring_pattern?: {
        frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
        interval: number;
        days_of_week?: number[]; // 0-6, 0 = Sunday
        time_of_day?: string; // HH:MM format
      };
      timezone: string;
    };
    
    // 执行限制
    limits: {
      max_execution_time: number; // 秒
      max_memory_usage: number; // MB
      max_concurrent_tasks: number;
      retry_attempts: number;
      retry_delay: number; // 秒
    };
    
    // 通知设置
    notifications: {
      on_start: boolean;
      on_completion: boolean;
      on_error: boolean;
      recipients: Array<{
        type: 'email' | 'webhook' | 'slack';
        address: string;
      }>;
    };
  };
  
  // 状态管理
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // 执行历史
  execution_history: Array<{
    execution_id: string;
    started_at: Date;
    completed_at?: Date;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    
    // 执行结果
    result?: {
      success: boolean;
      data?: any;
      metrics?: {
        execution_time: number;
        memory_used: number;
        items_processed: number;
        errors_count: number;
      };
      output_files?: Array<{
        file_id: mongoose.Types.ObjectId;
        file_type: string;
        file_size: number;
        download_url: string;
      }>;
    };
    
    // 错误信息
    error?: {
      code: string;
      message: string;
      stack?: string;
      context?: any;
    };
    
    // 日志
    logs: Array<{
      timestamp: Date;
      level: 'info' | 'warn' | 'error' | 'debug';
      message: string;
      data?: any;
    }>;
  }>;
  
  // 依赖关系
  dependencies: {
    parent_tasks: mongoose.Types.ObjectId[];
    child_tasks: mongoose.Types.ObjectId[];
    required_resources: Array<{
      type: 'file' | 'data' | 'service';
      resource_id: string;
      required: boolean;
    }>;
  };
  
  // 资源使用
  resources: {
    estimated_cost: number;
    actual_cost: number;
    cpu_usage: number;
    memory_usage: number;
    storage_usage: number;
    api_calls: number;
    
    // 资源限制
    limits: {
      max_cost: number;
      max_cpu: number;
      max_memory: number;
      max_storage: number;
      max_api_calls: number;
    };
  };
  
  // 数据输出
  output: {
    // 结构化数据
    structured_data?: {
      format: 'json' | 'csv' | 'xml';
      schema?: any;
      data: any;
      record_count: number;
    };
    
    // 文件输出
    files?: Array<{
      file_id: mongoose.Types.ObjectId;
      filename: string;
      file_type: string;
      file_size: number;
      download_url: string;
      created_at: Date;
    }>;
    
    // 报告
    reports?: Array<{
      report_id: string;
      title: string;
      type: 'summary' | 'detailed' | 'analysis';
      format: 'html' | 'pdf' | 'json';
      content: any;
      generated_at: Date;
    }>;
    
    // 统计信息
    statistics: {
      total_items: number;
      successful_items: number;
      failed_items: number;
      processing_rate: number; // items per second
      accuracy_score?: number;
      quality_score?: number;
    };
  };
  
  // 质量控制
  quality_control: {
    validation_rules: Array<{
      field: string;
      rule_type: 'required' | 'format' | 'range' | 'custom';
      rule_value: any;
      error_message: string;
    }>;
    
    sampling: {
      enabled: boolean;
      sample_size: number;
      sample_method: 'random' | 'systematic' | 'stratified';
    };
    
    review: {
      required: boolean;
      reviewer_id?: mongoose.Types.ObjectId;
      reviewed_at?: Date;
      review_status: 'pending' | 'approved' | 'rejected';
      review_comments?: string;
    };
  };
  
  // 标签和分类
  tags: string[];
  category: string;
  project_id?: mongoose.Types.ObjectId;
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  created_by: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: mongoose.Types.ObjectId;
}

// 任务Schema定义
const TaskSchema = new Schema<ITask>({
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
TaskSchema.pre('save', function(next) {
  if (!this.task_id) {
    this.task_id = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// 更新时间戳
TaskSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// 虚拟字段
// 是否正在运行
TaskSchema.virtual('is_running').get(function() {
  return this.status === 'running';
});

// 是否已完成
TaskSchema.virtual('is_completed').get(function() {
  return this.status === 'completed';
});

// 是否失败
TaskSchema.virtual('is_failed').get(function() {
  return this.status === 'failed';
});

// 最后执行结果
TaskSchema.virtual('last_execution').get(function() {
  return this.execution_history.length > 0 
    ? this.execution_history[this.execution_history.length - 1] 
    : null;
});

// 成功率
TaskSchema.virtual('success_rate').get(function() {
  if (this.execution_history.length === 0) return 0;
  
  const successful = this.execution_history.filter(exec => 
    exec.status === 'completed' && exec.result?.success
  ).length;
  
  return successful / this.execution_history.length;
});

// 静态方法
// 根据状态查找任务
TaskSchema.statics.findByStatus = function(status: string) {
  return this.find({ status, is_deleted: false });
};

// 根据类型查找任务
TaskSchema.statics.findByType = function(type: string) {
  return this.find({ type, is_deleted: false });
};

// 查找待执行的任务
TaskSchema.statics.findPendingTasks = function() {
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
TaskSchema.statics.search = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $text: { $search: query },
    is_deleted: false,
    ...filters
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// 实例方法
// 开始执行任务
TaskSchema.methods.start = function(executionId?: string) {
  const execution = {
    execution_id: executionId || `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    started_at: new Date(),
    status: 'running' as const,
    logs: [{
      timestamp: new Date(),
      level: 'info' as const,
      message: 'Task execution started'
    }]
  };
  
  this.execution_history.push(execution);
  this.status = 'running';
  
  return this.save();
};

// 完成任务
TaskSchema.methods.complete = function(result: any) {
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
TaskSchema.methods.fail = function(error: any) {
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
TaskSchema.methods.addLog = function(level: string, message: string, data?: any) {
  const lastExecution = this.execution_history[this.execution_history.length - 1];
  if (lastExecution) {
    lastExecution.logs.push({
      timestamp: new Date(),
      level: level as any,
      message,
      data
    });
    return this.save();
  }
};

// 更新进度
TaskSchema.methods.updateProgress = function(processed: number, total: number, data?: any) {
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
export const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;