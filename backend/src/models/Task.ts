import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

// 任务类型枚举
export const TaskTypeEnum = z.enum(['url', 'keyword', 'batch_url', 'search_1688'])

// 任务状态枚举
export const TaskStatusEnum = z.enum(['pending', 'processing', 'completed', 'failed'])

// Zod 验证模式
export const TaskSchema = z.object({
  type: TaskTypeEnum,
  title: z.string().min(1, 'Task title is required'),
  description: z.string().optional(),
  
  // URL相关字段
  url: z.string().url().optional(),
  urls: z.array(z.string().url()).optional(),
  
  // 关键词相关字段
  keywords: z.array(z.string()).optional(),
  
  // 任务状态和元数据
  status: TaskStatusEnum.default('pending'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  
  // 执行结果
  result: z.any().optional(),
  errorMessage: z.string().optional(),
  
  // 进度跟踪
  progress: z.number().min(0).max(100).default(0),
  totalItems: z.number().int().min(0).optional(),
  processedItems: z.number().int().min(0).default(0),
  
  // 调度相关
  scheduledAt: z.date().optional(),
  startedAt: z.date().optional(),
  completedAt: z.date().optional(),
  
  // 重试机制
  retryCount: z.number().int().min(0).default(0),
  maxRetries: z.number().int().min(0).default(3),
  
  // 元数据
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).default([]),
  
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

// 创建任务的验证模式
export const CreateTaskSchema = TaskSchema.omit({ 
  createdAt: true, 
  updatedAt: true,
  startedAt: true,
  completedAt: true,
  processedItems: true,
  progress: true,
  retryCount: true
}).refine((data) => {
  // 根据任务类型验证必需字段
  if (data.type === 'url' && !data.url) {
    return false
  }
  if (data.type === 'batch_url' && (!data.urls || data.urls.length === 0)) {
    return false
  }
  if (data.type === 'keyword' && (!data.keywords || data.keywords.length === 0)) {
    return false
  }
  return true
}, {
  message: 'Invalid task data: missing required fields for task type'
})

// 更新任务的验证模式
export const UpdateTaskSchema = TaskSchema.partial().omit({ 
  createdAt: true, 
  updatedAt: true 
})

export type TaskType = z.infer<typeof TaskSchema>
export type CreateTaskType = z.infer<typeof CreateTaskSchema>
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>

// Mongoose 接口
export interface ITask extends Document {
  type: 'url' | 'keyword' | 'batch_url' | 'search_1688'
  title: string
  description?: string
  
  // URL相关字段
  url?: string
  urls?: string[]
  
  // 关键词相关字段
  keywords?: string[]
  
  // 任务状态和元数据
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  
  // 执行结果
  result?: any
  errorMessage?: string
  
  // 进度跟踪
  progress: number
  totalItems?: number
  processedItems: number
  
  // 调度相关
  scheduledAt?: Date
  startedAt?: Date
  completedAt?: Date
  
  // 重试机制
  retryCount: number
  maxRetries: number
  
  // 元数据
  metadata?: Record<string, any>
  tags: string[]
  
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema
const mongooseTaskSchema = new Schema<ITask>(
  {
    type: {
      type: String,
      enum: ['url', 'keyword', 'batch_url', 'search_1688'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    
    // URL相关字段
    url: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true // 可选字段
          try {
            new URL(v)
            return true
          } catch {
            return false
          }
        },
        message: 'Invalid URL format'
      }
    },
    urls: [{
      type: String,
      validate: {
        validator: (v: string) => {
          try {
            new URL(v)
            return true
          } catch {
            return false
          }
        },
        message: 'Invalid URL format'
      }
    }],
    
    // 关键词相关字段
    keywords: [{
      type: String,
      trim: true,
    }],
    
    // 任务状态和元数据
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    
    // 执行结果
    result: Schema.Types.Mixed,
    errorMessage: {
      type: String,
    },
    
    // 进度跟踪
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    totalItems: {
      type: Number,
      min: 0,
    },
    processedItems: {
      type: Number,
      min: 0,
      default: 0,
    },
    
    // 调度相关
    scheduledAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    
    // 重试机制
    retryCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    maxRetries: {
      type: Number,
      min: 0,
      default: 3,
    },
    
    // 元数据
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
)

// 索引
mongooseTaskSchema.index({ status: 1 })
mongooseTaskSchema.index({ type: 1 })
mongooseTaskSchema.index({ priority: 1 })
mongooseTaskSchema.index({ createdAt: -1 })
mongooseTaskSchema.index({ scheduledAt: 1 })
mongooseTaskSchema.index({ tags: 1 })

// 复合索引
mongooseTaskSchema.index({ status: 1, priority: -1, createdAt: -1 })

export const Task = mongoose.model<ITask>('Task', mongooseTaskSchema)