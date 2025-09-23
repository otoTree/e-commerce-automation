import mongoose, { Document, Schema } from 'mongoose';
// 用户Schema定义
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, '用户名为必填字段'],
        unique: true,
        trim: true,
        minlength: [3, '用户名至少需要3个字符'],
        maxlength: [30, '用户名不能超过30个字符'],
        match: [/^[a-zA-Z0-9_]+$/, '用户名只能包含字母、数字和下划线']
    },
    email: {
        type: String,
        required: [true, '邮箱为必填字段'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, '请输入有效的邮箱地址']
    },
    password: {
        type: String,
        required: [true, '密码为必填字段'],
        minlength: [6, '密码至少需要6个字符']
    },
    firstName: {
        type: String,
        trim: true,
        maxlength: [50, '名字不能超过50个字符']
    },
    lastName: {
        type: String,
        trim: true,
        maxlength: [50, '姓氏不能超过50个字符']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^[+]?[\d\s\-()]+$/, '请输入有效的手机号码']
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'moderator'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLoginAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true, // 自动管理createdAt和updatedAt
    collection: 'users'
});
// 索引定义
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ isActive: 1 });
// 中间件：更新时自动设置updatedAt
UserSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updatedAt = new Date();
    }
    next();
});
// 实例方法：获取用户全名
UserSchema.methods.getFullName = function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
};
// 实例方法：检查用户是否为管理员
UserSchema.methods.isAdmin = function () {
    return this.role === 'admin';
};
// 静态方法：根据用户名或邮箱查找用户
UserSchema.statics.findByUsernameOrEmail = function (identifier) {
    return this.findOne({
        $or: [
            { username: identifier },
            { email: identifier }
        ]
    });
};
// 静态方法：获取活跃用户数量
UserSchema.statics.getActiveUserCount = function () {
    return this.countDocuments({ isActive: true });
};
// 虚拟字段：用户显示名称
UserSchema.virtual('displayName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim() || this.username;
});
// 确保虚拟字段在JSON序列化时包含
UserSchema.set('toJSON', {
    virtuals: true,
    transform: function (doc, ret) {
        // 移除敏感信息
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});
// 创建并导出模型
const User = mongoose.model('User', UserSchema);
export default User;
//# sourceMappingURL=User.js.map