import mongoose, { Schema, Document } from 'mongoose';

// 任务接口
export interface ITask extends Document {
  task_id: string;
  type: 'full_data_collection' | 'deep_analysis' | 'market_heat_detection' | 'keyword_collection';
  status: 'pending' | 'running' | 'completed' | 'failed';
  
  // 任务输入参数
  input: {
    product_urls?: string[];
    product_ids?: string[];
    analysis_options?: Record<string, any>;
    // 关键词收集相关参数
    keywords?: string[];
    platform?: string;
    result_count?: number;
    filters?: Record<string, string | number | boolean>;
  };
  
  // 任务输出结果
  output?: {
    collected_products?: string[];
    analysis_results?: string[];
    error_details?: string;
    success_count?: number;
    failure_count?: number;
  };
  
  // 任务元数据
  meta: {
    created_at: Date;
    started_at?: Date;
    completed_at?: Date;
    duration?: number; // 执行时长（毫秒）
    retry_count: number;
    max_retries: number;
  };
  
  // 进度信息
  progress: {
    total_items: number;
    processed_items: number;
    current_item?: string;
    percentage: number;
  };
}

// 任务Schema
const TaskSchema = new Schema<ITask>({
  task_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  
  type: { 
    type: String, 
    required: true, 
    enum: ['full_data_collection', 'deep_analysis', 'market_heat_detection', 'keyword_collection'] 
  },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['pending', 'running', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  
  input: {
    product_urls: [{ type: String }],
    product_ids: [{ type: String }],
    analysis_options: { type: Schema.Types.Mixed, default: {} },
    // 关键词收集相关字段
    keywords: [{ type: String }],
    platform: { type: String },
    result_count: { type: Number },
    filters: { type: Schema.Types.Mixed, default: {} }
  },
  
  output: {
    collected_products: [{ type: String }],
    analysis_results: [{ type: String }],
    error_details: { type: String },
    success_count: { type: Number, default: 0 },
    failure_count: { type: Number, default: 0 }
  },
  
  meta: {
    created_at: { type: Date, required: true, default: Date.now },
    started_at: { type: Date },
    completed_at: { type: Date },
    duration: { type: Number },
    retry_count: { type: Number, required: true, default: 0 },
    max_retries: { type: Number, required: true, default: 3 }
  },
  
  progress: {
    total_items: { type: Number, required: true, default: 0 },
    processed_items: { type: Number, required: true, default: 0 },
    current_item: { type: String },
    percentage: { type: Number, required: true, default: 0, min: 0, max: 100 }
  }
}, {
  timestamps: true,
  collection: 'tasks'
});

// 创建索引
TaskSchema.index({ 'meta.created_at': -1 });
TaskSchema.index({ type: 1, status: 1 });
TaskSchema.index({ 'meta.completed_at': -1 });

// 添加虚拟字段
TaskSchema.virtual('is_completed').get(function() {
  return this.status === 'completed' || this.status === 'failed';
});

TaskSchema.virtual('is_running').get(function() {
  return this.status === 'running';
});

// 添加实例方法
TaskSchema.methods.updateProgress = function(processedItems: number, currentItem?: string) {
  this.progress.processed_items = processedItems;
  this.progress.current_item = currentItem;
  this.progress.percentage = this.progress.total_items > 0 
    ? Math.round((processedItems / this.progress.total_items) * 100) 
    : 0;
  return this.save();
};

TaskSchema.methods.markAsStarted = function() {
  this.status = 'running';
  this.meta.started_at = new Date();
  return this.save();
};

TaskSchema.methods.markAsCompleted = function(output?: any) {
  this.status = 'completed';
  this.meta.completed_at = new Date();
  if (this.meta.started_at) {
    this.meta.duration = Date.now() - this.meta.started_at.getTime();
  }
  if (output) {
    this.output = { ...this.output, ...output };
  }
  this.progress.percentage = 100;
  return this.save();
};

TaskSchema.methods.markAsFailed = function(errorDetails: string) {
  this.status = 'failed';
  this.meta.completed_at = new Date();
  if (this.meta.started_at) {
    this.meta.duration = Date.now() - this.meta.started_at.getTime();
  }
  this.output = { ...this.output, error_details: errorDetails };
  return this.save();
};

export const TaskModel = mongoose.model<ITask>('Task', TaskSchema);