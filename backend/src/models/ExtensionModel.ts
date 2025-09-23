import mongoose, { Schema, Document } from 'mongoose';

// 扩展接口
export interface IExtension extends Document {
  extension_id: string;
  name: string;
  version: string;
  status: 'active' | 'inactive' | 'error';
  
  // 扩展信息
  info: {
    user_agent: string;
    browser_version: string;
    platform: string;
    capabilities: string[];
  };
  
  // 连接状态
  connection: {
    last_heartbeat: Date;
    is_online: boolean;
    ip_address?: string;
  };
  
  // 任务统计
  stats: {
    total_tasks: number;
    completed_tasks: number;
    failed_tasks: number;
    last_task_at?: Date;
  };
  
  // 元数据
  meta: {
    registered_at: Date;
    last_active_at: Date;
  };
}

// 扩展Schema
const ExtensionSchema = new Schema<IExtension>({
  extension_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  
  name: { 
    type: String, 
    required: true,
    default: 'E-commerce AI Extension'
  },
  
  version: { 
    type: String, 
    required: true,
    default: '1.0.0'
  },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['active', 'inactive', 'error'],
    default: 'active',
    index: true
  },
  
  info: {
    user_agent: { type: String, required: true },
    browser_version: { type: String, required: true },
    platform: { type: String, required: true },
    capabilities: [{ type: String }]
  },
  
  connection: {
    last_heartbeat: { type: Date, required: true, default: Date.now },
    is_online: { type: Boolean, required: true, default: true },
    ip_address: { type: String }
  },
  
  stats: {
    total_tasks: { type: Number, required: true, default: 0 },
    completed_tasks: { type: Number, required: true, default: 0 },
    failed_tasks: { type: Number, required: true, default: 0 },
    last_task_at: { type: Date }
  },
  
  meta: {
    registered_at: { type: Date, required: true, default: Date.now },
    last_active_at: { type: Date, required: true, default: Date.now }
  }
}, {
  timestamps: true,
  collection: 'extensions'
});

// 创建索引
ExtensionSchema.index({ 'connection.last_heartbeat': -1 });
ExtensionSchema.index({ 'meta.registered_at': -1 });
ExtensionSchema.index({ 'connection.is_online': 1 });

// 添加虚拟字段
ExtensionSchema.virtual('is_healthy').get(function() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return this.connection.is_online && this.connection.last_heartbeat > fiveMinutesAgo;
});

// 添加实例方法
ExtensionSchema.methods.updateHeartbeat = function() {
  this.connection.last_heartbeat = new Date();
  this.connection.is_online = true;
  this.meta.last_active_at = new Date();
  return this.save();
};

ExtensionSchema.methods.markOffline = function() {
  this.connection.is_online = false;
  return this.save();
};

ExtensionSchema.methods.incrementTaskStats = function(success: boolean) {
  this.stats.total_tasks += 1;
  if (success) {
    this.stats.completed_tasks += 1;
  } else {
    this.stats.failed_tasks += 1;
  }
  this.stats.last_task_at = new Date();
  return this.save();
};

export const ExtensionModel = mongoose.model<IExtension>('Extension', ExtensionSchema);