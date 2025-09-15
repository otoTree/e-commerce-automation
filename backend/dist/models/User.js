import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, {} from 'jsonwebtoken';
// 用户Schema定义
const UserSchema = new Schema({
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
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password_hash'))
        return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password_hash = await bcrypt.hash(this.password_hash, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// 更新时间戳
UserSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
// 生成用户ID
UserSchema.pre('save', function (next) {
    if (!this.user_id) {
        this.user_id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});
// 实例方法
// 比较密码
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
};
// 生成JWT令牌
UserSchema.methods.generateAuthToken = function () {
    const payload = {
        userId: this._id,
        email: this.email,
        roles: this.roles.map((role) => role.role_name)
    };
    const options = {
        expiresIn: (process.env.JWT_EXPIRES_IN || '24h')
    };
    return jwt.sign(payload, process.env.JWT_SECRET || 'fallback_secret', options);
};
// 生成刷新令牌
UserSchema.methods.generateRefreshToken = function () {
    const payload = {
        userId: this._id,
        type: 'refresh'
    };
    const options = {
        expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d')
    };
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', options);
};
// 自定义toJSON方法
UserSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    // 移除敏感信息
    delete userObject.password_hash;
    delete userObject.account.verification;
    delete userObject.account.security.login_history;
    return userObject;
};
// 静态方法
// 根据邮箱或用户名查找用户
UserSchema.statics.findByEmailOrUsername = function (identifier) {
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
UserSchema.virtual('profile.full_name').get(function () {
    if (this.profile.first_name && this.profile.last_name) {
        return `${this.profile.first_name} ${this.profile.last_name}`;
    }
    return this.profile.display_name || this.username;
});
// 年龄
UserSchema.virtual('profile.age').get(function () {
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
export const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map