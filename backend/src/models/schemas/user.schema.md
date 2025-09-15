# 用户相关数据模型设计

## 1. 用户主表 (users)

用户系统的核心表，存储用户基本信息和认证数据。

### 字段设计

```javascript
{
  // 基础字段
  _id: ObjectId,                    // 用户唯一标识
  username: String,                 // 用户名（唯一）
  email: String,                    // 邮箱（唯一）
  phone: String,                    // 手机号（可选，唯一）
  
  // 认证相关
  password_hash: String,            // 密码哈希值
  salt: String,                     // 密码盐值
  email_verified: Boolean,          // 邮箱验证状态
  phone_verified: Boolean,          // 手机验证状态
  
  // 账户状态
  status: String,                   // 账户状态：active, inactive, suspended, banned
  role: String,                     // 用户角色：admin, manager, user, guest
  permissions: [String],            // 权限列表
  
  // 登录相关
  last_login_at: Date,              // 最后登录时间
  last_login_ip: String,            // 最后登录IP
  login_attempts: Number,           // 登录尝试次数
  locked_until: Date,               // 账户锁定到期时间
  
  // 安全相关
  two_factor_enabled: Boolean,      // 是否启用双因子认证
  two_factor_secret: String,        // 双因子认证密钥
  recovery_codes: [String],         // 恢复代码
  
  // 会话管理
  active_sessions: [{
    session_id: String,             // 会话ID
    device_info: String,            // 设备信息
    ip_address: String,             // IP地址
    user_agent: String,             // 用户代理
    created_at: Date,               // 会话创建时间
    last_activity: Date,            // 最后活动时间
    expires_at: Date                // 会话过期时间
  }],
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 唯一索引
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "phone": 1 }, { unique: true, sparse: true })

// 查询索引
db.users.createIndex({ "status": 1, "role": 1 })
db.users.createIndex({ "created_at": -1 })
db.users.createIndex({ "last_login_at": -1 })
db.users.createIndex({ "is_deleted": 1, "status": 1 })
```

## 2. 用户配置表 (user_profiles)

存储用户的详细个人信息和配置。

### 字段设计

```javascript
{
  // 关联字段
  _id: ObjectId,
  user_id: ObjectId,                // 关联users表
  
  // 个人信息
  first_name: String,               // 名
  last_name: String,                // 姓
  display_name: String,             // 显示名称
  avatar_url: String,               // 头像URL
  bio: String,                      // 个人简介
  
  // 联系信息
  address: {
    country: String,                // 国家
    province: String,               // 省/州
    city: String,                   // 城市
    district: String,               // 区/县
    street: String,                 // 街道地址
    postal_code: String,            // 邮政编码
    is_default: Boolean             // 是否默认地址
  },
  
  // 社交信息
  social_links: {
    website: String,                // 个人网站
    linkedin: String,               // LinkedIn
    twitter: String,                // Twitter
    github: String,                 // GitHub
    wechat: String,                 // 微信
    qq: String                      // QQ
  },
  
  // 个人设置
  timezone: String,                 // 时区
  language: String,                 // 语言偏好
  date_format: String,              // 日期格式
  currency: String,                 // 货币偏好
  
  // 业务相关
  company: String,                  // 公司名称
  position: String,                 // 职位
  department: String,               // 部门
  employee_id: String,              // 员工ID
  
  // 统计信息
  profile_completion: Number,       // 资料完整度百分比
  last_profile_update: Date,        // 最后更新资料时间
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 关联索引
db.user_profiles.createIndex({ "user_id": 1 }, { unique: true })

// 查询索引
db.user_profiles.createIndex({ "company": 1, "department": 1 })
db.user_profiles.createIndex({ "address.country": 1, "address.city": 1 })
db.user_profiles.createIndex({ "is_deleted": 1 })
```

## 3. 用户偏好设置表 (user_preferences)

存储用户的系统偏好和个性化设置。

### 字段设计

```javascript
{
  // 关联字段
  _id: ObjectId,
  user_id: ObjectId,                // 关联users表
  
  // 界面偏好
  ui_preferences: {
    theme: String,                  // 主题：light, dark, auto
    sidebar_collapsed: Boolean,     // 侧边栏是否折叠
    table_density: String,          // 表格密度：compact, standard, comfortable
    page_size: Number,              // 默认分页大小
    language: String,               // 界面语言
    font_size: String               // 字体大小：small, medium, large
  },
  
  // 通知偏好
  notification_preferences: {
    email_notifications: {
      task_assigned: Boolean,       // 任务分配通知
      task_completed: Boolean,      // 任务完成通知
      campaign_updates: Boolean,    // 营销活动更新
      system_alerts: Boolean,       // 系统警报
      weekly_reports: Boolean       // 周报
    },
    push_notifications: {
      browser_push: Boolean,        // 浏览器推送
      mobile_push: Boolean,         // 移动推送
      desktop_notifications: Boolean // 桌面通知
    },
    notification_frequency: String, // 通知频率：immediate, hourly, daily, weekly
    quiet_hours: {
      enabled: Boolean,             // 是否启用免打扰
      start_time: String,           // 开始时间 (HH:mm)
      end_time: String              // 结束时间 (HH:mm)
    }
  },
  
  // 工作偏好
  work_preferences: {
    default_task_view: String,      // 默认任务视图：list, board, calendar
    auto_assign_tasks: Boolean,     // 自动分配任务
    task_reminder_time: Number,     // 任务提醒提前时间（分钟）
    working_hours: {
      start_time: String,           // 工作开始时间
      end_time: String,             // 工作结束时间
      working_days: [Number],       // 工作日（0-6，0为周日）
      timezone: String              // 时区
    }
  },
  
  // 数据偏好
  data_preferences: {
    default_date_range: String,     // 默认日期范围：7d, 30d, 90d, 1y
    chart_type: String,             // 默认图表类型：line, bar, pie
    export_format: String,          // 默认导出格式：xlsx, csv, pdf
    decimal_places: Number,         // 小数位数
    number_format: String           // 数字格式：1,000.00, 1000.00, 1 000,00
  },
  
  // AI偏好
  ai_preferences: {
    auto_suggestions: Boolean,      // 自动建议
    ai_analysis_frequency: String,  // AI分析频率：real-time, hourly, daily
    preferred_ai_model: String,     // 偏好的AI模型
    confidence_threshold: Number,   // 置信度阈值
    auto_apply_suggestions: Boolean // 自动应用建议
  },
  
  // 隐私偏好
  privacy_preferences: {
    profile_visibility: String,     // 资料可见性：public, private, team
    activity_tracking: Boolean,     // 活动跟踪
    data_sharing: Boolean,          // 数据共享
    analytics_participation: Boolean // 参与分析
  },
  
  // 快捷键设置
  keyboard_shortcuts: {
    enabled: Boolean,               // 是否启用快捷键
    custom_shortcuts: [{
      action: String,               // 动作名称
      key_combination: String,      // 按键组合
      description: String           // 描述
    }]
  },
  
  // 仪表板配置
  dashboard_config: {
    widgets: [{
      widget_id: String,            // 组件ID
      position: {
        x: Number,                  // X坐标
        y: Number,                  // Y坐标
        width: Number,              // 宽度
        height: Number              // 高度
      },
      settings: Mixed               // 组件设置
    }],
    layout: String,                 // 布局类型
    refresh_interval: Number        // 刷新间隔（秒）
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 关联索引
db.user_preferences.createIndex({ "user_id": 1 }, { unique: true })

// 查询索引
db.user_preferences.createIndex({ "is_deleted": 1 })
db.user_preferences.createIndex({ "updated_at": -1 })
```

## 数据关系说明

### 关系类型
- **users ↔ user_profiles**: 一对一关系
- **users ↔ user_preferences**: 一对一关系

### 数据一致性
1. 创建用户时自动创建对应的profile和preferences记录
2. 删除用户时级联软删除相关记录
3. 使用事务确保数据一致性

### 查询优化
1. 常用查询使用复合索引
2. 大字段（如头像、配置）考虑分离存储
3. 缓存热点数据提升性能

## 业务规则

### 用户注册
1. 用户名和邮箱必须唯一
2. 密码强度验证
3. 邮箱验证流程
4. 自动创建默认配置

### 账户安全
1. 登录失败锁定机制
2. 会话管理和超时
3. 双因子认证支持
4. 密码定期更新提醒

### 数据隐私
1. 敏感信息加密存储
2. 个人信息访问控制
3. 数据导出和删除权限
4. 审计日志记录