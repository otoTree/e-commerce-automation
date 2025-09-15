import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 用户接口定义
export interface IUser extends Document {
  // 基础信息
  user_id: string;
  username: string;
  email: string;
  phone?: string;
  password_hash: string;
  
  // 个人信息
  profile: {
    first_name?: string;
    last_name?: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    date_of_birth?: Date;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    
    // 地址信息
    addresses: Array<{
      address_id: string;
      type: 'home' | 'work' | 'billing' | 'shipping' | 'other';
      label?: string;
      recipient_name: string;
      company?: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state_province: string;
      postal_code: string;
      country: string;
      phone?: string;
      is_default: boolean;
      created_at: Date;
      updated_at: Date;
    }>;
    
    // 社交媒体
    social_media: {
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      website?: string;
    };
  };
  
  // 账户设置
  account: {
    status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'deleted';
    email_verified: boolean;
    phone_verified: boolean;
    two_factor_enabled: boolean;
    
    // 验证信息
    verification: {
      email_verification_token?: string;
      email_verification_expires?: Date;
      phone_verification_code?: string;
      phone_verification_expires?: Date;
      password_reset_token?: string;
      password_reset_expires?: Date;
    };
    
    // 安全设置
    security: {
      last_password_change: Date;
      failed_login_attempts: number;
      account_locked_until?: Date;
      login_history: Array<{
        timestamp: Date;
        ip_address: string;
        user_agent: string;
        location?: {
          country?: string;
          region?: string;
          city?: string;
        };
        success: boolean;
        failure_reason?: string;
      }>;
    };
  };
  
  // 用户偏好
  preferences: {
    // 语言和地区
    language: string;
    timezone: string;
    currency: string;
    date_format: string;
    time_format: '12h' | '24h';
    
    // 通知偏好
    notifications: {
      email: {
        marketing: boolean;
        order_updates: boolean;
        security_alerts: boolean;
        product_recommendations: boolean;
        price_alerts: boolean;
        newsletter: boolean;
      };
      sms: {
        order_updates: boolean;
        security_alerts: boolean;
        delivery_notifications: boolean;
      };
      push: {
        enabled: boolean;
        order_updates: boolean;
        promotions: boolean;
        recommendations: boolean;
      };
    };
    
    // 购物偏好
    shopping: {
      preferred_categories: string[];
      price_range: {
        min?: number;
        max?: number;
      };
      preferred_brands: string[];
      size_preferences: {
        clothing?: string;
        shoes?: string;
      };
      delivery_preferences: {
        preferred_time?: string;
        special_instructions?: string;
      };
    };
    
    // 隐私设置
    privacy: {
      profile_visibility: 'public' | 'friends' | 'private';
      show_online_status: boolean;
      allow_friend_requests: boolean;
      data_processing_consent: boolean;
      marketing_consent: boolean;
      analytics_consent: boolean;
    };
  };
  
  // 角色和权限
  roles: Array<{
    role_name: string;
    granted_at: Date;
    granted_by: mongoose.Types.ObjectId;
    expires_at?: Date;
  }>;
  
  permissions: string[];
  
  // 统计信息
  stats: {
    total_orders: number;
    total_spent: number;
    loyalty_points: number;
    referral_count: number;
    review_count: number;
    average_rating: number;
    
    // 活动统计
    activity: {
      last_login: Date;
      last_order: Date;
      last_review: Date;
      total_logins: number;
      days_active: number;
    };
  };
  
  // AI个性化数据
  ai_profile: {
    // 兴趣标签
    interests: Array<{
      category: string;
      weight: number;
      last_updated: Date;
    }>;
    
    // 行为模式
    behavior_patterns: {
      shopping_frequency: 'daily' | 'weekly' | 'monthly' | 'occasional';
      preferred_shopping_time: string;
      price_sensitivity: 'low' | 'medium' | 'high';
      brand_loyalty: 'low' | 'medium' | 'high';
      impulse_buying_tendency: number; // 0-1
    };
    
    // 推荐引擎数据
    recommendations: {
      product_affinity: Map<string, number>;
      category_preferences: Map<string, number>;
      seasonal_patterns: Map<string, number>;
      last_recommendation_update: Date;
    };
  };
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: mongoose.Types.ObjectId;
  
  // 方法
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
  toJSON(): any;
}

// 用户Schema定义
const UserSchema = new Schema<IUser>({
  // 基础信息
  user_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    sparse: true,
    match: /^\+?[1-9]\d{1,14}$/
  },
  password_hash: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // 个人信息
  profile: {
    first_name: { type: String, trim: true, maxlength: 50 },
    last_name: { type: String, trim: true, maxlength: 50 },
    display_name: { type: String, trim: true, maxlength: 100 },
    avatar_url: { type: String },
    bio: { type: String, maxlength: 500 },
    date_of_birth: { type: Date },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer_not_to_say']
    },
    
    addresses: [{
      address_id: { type: String, required: true },
      type: {
        type: String,
        enum: ['home', 'work', 'billing', 'shipping', 'other'],
        required: true
      },
      label: { type: String },
      recipient_name: { type: String, required: true },
      company: { type: String },
      address_line_1: { type: String, required: true },
      address_line_2: { type: String },
      city: { type: String, required: true },
      state_province: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String },
      is_default: { type: Boolean, default: false },
      created_at: { type: Date, default: Date.now },
      updated_at: { type: Date, default: Date.now }
    }],
    
    social_media: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      website: { type: String }
    }
  },
  
  // 账户设置
  account: {
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended', 'pending_verification', 'deleted'],
      default: 'pending_verification'
    },
    email_verified: { type: Boolean, default: false },
    phone_verified: { type: Boolean, default: false },
    two_factor_enabled: { type: Boolean, default: false },
    
    verification: {
      email_verification_token: { type: String },
      email_verification_expires: { type: Date },
      phone_verification_code: { type: String },
      phone_verification_expires: { type: Date },
      password_reset_token: { type: String },
      password_reset_expires: { type: Date }
    },
    
    security: {
      last_password_change: { type: Date, default: Date.now },
      failed_login_attempts: { type: Number, default: 0 },
      account_locked_until: { type: Date },
      login_history: [{
        timestamp: { type: Date, default: Date.now },
        ip_address: { type: String, required: true },
        user_agent: { type: String, required: true },
        location: {
          country: { type: String },
          region: { type: String },
          city: { type: String }
        },
        success: { type: Boolean, required: true },
        failure_reason: { type: String }
      }]
    }
  },
  
  // 用户偏好
  preferences: {
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'UTC' },
    currency: { type: String, default: 'USD' },
    date_format: { type: String, default: 'MM/DD/YYYY' },
    time_format: { type: String, enum: ['12h', '24h'], default: '12h' },
    
    notifications: {
      email: {
        marketing: { type: Boolean, default: true },
        order_updates: { type: Boolean, default: true },
        security_alerts: { type: Boolean, default: true },
        product_recommendations: { type: Boolean, default: true },
        price_alerts: { type: Boolean, default: false },
        newsletter: { type: Boolean, default: false }
      },
      sms: {
        order_updates: { type: Boolean, default: false },
        security_alerts: { type: Boolean, default: false },
        delivery_notifications: { type: Boolean, default: false }
      },
      push: {
        enabled: { type: Boolean, default: true },
        order_updates: { type: Boolean, default: true },
        promotions: { type: Boolean, default: false },
        recommendations: { type: Boolean, default: true }
      }
    },
    
    shopping: {
      preferred_categories: [{ type: String }],
      price_range: {
        min: { type: Number },
        max: { type: Number }
      },
      preferred_brands: [{ type: String }],
      size_preferences: {
        clothing: { type: String },
        shoes: { type: String }
      },
      delivery_preferences: {
        preferred_time: { type: String },
        special_instructions: { type: String }
      }
    },
    
    privacy: {
      profile_visibility: {
        type: String,
        enum: ['public', 'friends', 'private'],
        default: 'private'
      },
      show_online_status: { type: Boolean, default: false },
      allow_friend_requests: { type: Boolean, default: true },
      data_processing_consent: { type: Boolean, default: false },
      marketing_consent: { type: Boolean, default: false },
      analytics_consent: { type: Boolean, default: false }
    }
  },
  
  // 角色和权限
  roles: [{
    role_name: { type: String, required: true },
    granted_at: { type: Date, default: Date.now },
    granted_by: { type: Schema.Types.ObjectId, ref: 'User' },
    expires_at: { type: Date }
  }],
  
  permissions: [{ type: String }],
  
  // 统计信息
  stats: {
    total_orders: { type: Number, default: 0 },
    total_spent: { type: Number, default: 0 },
    loyalty_points: { type: Number, default: 0 },
    referral_count: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0 },
    
    activity: {
      last_login: { type: Date },
      last_order: { type: Date },
      last_review: { type: Date },
      total_logins: { type: Number, default: 0 },
      days_active: { type: Number, default: 0 }
    }
  },
  
  // AI个性化数据
  ai_profile: {
    interests: [{
      category: { type: String, required: true },
      weight: { type: Number, min: 0, max: 1, default: 0.5 },
      last_updated: { type: Date, default: Date.now }
    }],
    
    behavior_patterns: {
      shopping_frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'occasional'],
        default: 'monthly'
      },
      preferred_shopping_time: { type: String },
      price_sensitivity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      brand_loyalty: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
      },
      impulse_buying_tendency: { type: Number, min: 0, max: 1, default: 0.5 }
    },
    
    recommendations: {
      product_affinity: { type: Map, of: Number },
      category_preferences: { type: Map, of: Number },
      seasonal_patterns: { type: Map, of: Number },
      last_recommendation_update: { type: Date, default: Date.now }
    }
  },
  
  // 通用字段
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },
  deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ user_id: 1 }, { unique: true });
UserSchema.index({ 'account.status': 1 });
UserSchema.index({ created_at: -1 });
UserSchema.index({ 'stats.total_spent': -1 });
UserSchema.index({ 'roles.role_name': 1 });
UserSchema.index({ is_deleted: 1 });

// 文本搜索索引
UserSchema.index({
  username: 'text',
  email: 'text',
  'profile.first_name': 'text',
  'profile.last_name': 'text',
  'profile.display_name': 'text'
});

// 中间件
// 保存前哈希密码
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// 更新时间戳
UserSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// 生成用户ID
UserSchema.pre('save', function(next) {
  if (!this.user_id) {
    this.user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// 实例方法
// 比较密码
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// 生成JWT令牌
UserSchema.methods.generateAuthToken = function(): string {
  const payload = {
    userId: this._id,
    email: this.email,
    roles: this.roles.map((role: any) => role.role_name)
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  } as jwt.SignOptions);
};

// 生成刷新令牌
UserSchema.methods.generateRefreshToken = function(): string {
  const payload = {
    userId: this._id,
    type: 'refresh'
  };
  
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  } as jwt.SignOptions);
};

// 自定义toJSON方法
UserSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  
  // 移除敏感信息
  delete userObject.password_hash;
  delete userObject.account.verification;
  delete userObject.account.security.login_history;
  
  return userObject;
};

// 静态方法
// 根据邮箱或用户名查找用户
UserSchema.statics.findByEmailOrUsername = function(identifier: string) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { username: identifier }
    ],
    is_deleted: false
  });
};

// 虚拟字段
// 全名
UserSchema.virtual('profile.full_name').get(function() {
  if (this.profile.first_name && this.profile.last_name) {
    return `${this.profile.first_name} ${this.profile.last_name}`;
  }
  return this.profile.display_name || this.username;
});

// 年龄
UserSchema.virtual('profile.age').get(function() {
  if (this.profile.date_of_birth) {
    const today = new Date();
    const birthDate = new Date(this.profile.date_of_birth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
  return null;
});

// 创建并导出模型
export const User = mongoose.model<IUser>('User', UserSchema);
export default User;