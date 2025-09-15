# 任务管理数据模型设计

## 1. 任务模板表 (task_templates)

预定义的任务模板，用于快速创建标准化任务。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 模板唯一标识
  name: String,                     // 模板名称
  description: String,              // 模板描述
  category: String,                 // 模板分类：product, content, analysis, marketing
  
  // 模板配置
  template_config: {
    title_template: String,         // 标题模板（支持变量）
    description_template: String,   // 描述模板
    default_priority: String,       // 默认优先级
    estimated_duration: Number,     // 预估时长（小时）
    required_skills: [String],      // 所需技能
    checklist: [{
      item: String,                 // 检查项
      required: Boolean,            // 是否必需
      order: Number                 // 顺序
    }]
  },
  
  // 工作流配置
  workflow: {
    stages: [{
      name: String,                 // 阶段名称
      description: String,          // 阶段描述
      order: Number,                // 顺序
      required_role: String,        // 所需角色
      auto_assign: Boolean,         // 是否自动分配
      time_limit: Number,           // 时间限制（小时）
      approval_required: Boolean    // 是否需要审批
    }],
    auto_progression: Boolean,      // 是否自动推进
    parallel_execution: Boolean     // 是否支持并行执行
  },
  
  // AI配置
  ai_config: {
    enable_ai_assistance: Boolean,  // 启用AI辅助
    ai_analysis_type: String,       // AI分析类型
    auto_content_generation: Boolean, // 自动内容生成
    quality_check: Boolean,         // 质量检查
    optimization_suggestions: Boolean // 优化建议
  },
  
  // 表单字段配置
  custom_fields: [{
    field_name: String,             // 字段名
    field_type: String,             // 字段类型：text, number, select, date, file
    label: String,                  // 显示标签
    required: Boolean,              // 是否必填
    options: [String],              // 选项（用于select）
    validation: {
      min_length: Number,           // 最小长度
      max_length: Number,           // 最大长度
      pattern: String,              // 正则表达式
      min_value: Number,            // 最小值
      max_value: Number             // 最大值
    }
  }],
  
  // 通知配置
  notification_config: {
    notify_on_create: Boolean,      // 创建时通知
    notify_on_assign: Boolean,      // 分配时通知
    notify_on_complete: Boolean,    // 完成时通知
    notify_on_overdue: Boolean,     // 逾期时通知
    notification_channels: [String] // 通知渠道
  },
  
  // 统计信息
  usage_stats: {
    total_used: Number,             // 总使用次数
    success_rate: Number,           // 成功率
    avg_completion_time: Number,    // 平均完成时间
    last_used_at: Date              // 最后使用时间
  },
  
  // 状态管理
  status: String,                   // 状态：active, inactive, archived
  is_system_template: Boolean,      // 是否系统模板
  is_public: Boolean,               // 是否公开
  
  // 版本控制
  version: String,                  // 版本号
  changelog: [{
    version: String,                // 版本
    changes: String,                // 变更内容
    changed_by: ObjectId,           // 变更人
    changed_at: Date                // 变更时间
  }],
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId
}
```

### 索引设计

```javascript
// 查询索引
db.task_templates.createIndex({ "category": 1, "status": 1 })
db.task_templates.createIndex({ "is_public": 1, "status": 1 })
db.task_templates.createIndex({ "usage_stats.total_used": -1 })
db.task_templates.createIndex({ "is_deleted": 1, "status": 1 })

// 文本搜索索引
db.task_templates.createIndex({ 
  "name": "text", 
  "description": "text",
  "category": "text"
})
```

## 2. 任务主表 (tasks)

系统中所有任务的核心信息。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 任务唯一标识
  task_id: String,                  // 任务编号（可读性强）
  title: String,                    // 任务标题
  description: String,              // 任务描述
  type: String,                     // 任务类型：product_analysis, content_creation, data_extraction, marketing
  
  // 模板关联
  template_id: ObjectId,            // 任务模板ID
  template_version: String,         // 使用的模板版本
  
  // 任务分配
  assignee_id: ObjectId,            // 执行人ID
  assigner_id: ObjectId,            // 分配人ID
  team_id: ObjectId,                // 团队ID
  assigned_at: Date,                // 分配时间
  
  // 优先级和状态
  priority: String,                 // 优先级：low, medium, high, urgent
  status: String,                   // 状态：pending, in_progress, review, completed, cancelled, failed
  progress: Number,                 // 进度百分比（0-100）
  
  // 时间管理
  due_date: Date,                   // 截止日期
  estimated_hours: Number,          // 预估工时
  actual_hours: Number,             // 实际工时
  started_at: Date,                 // 开始时间
  completed_at: Date,               // 完成时间
  
  // 关联对象
  related_objects: [{
    object_type: String,            // 对象类型：product, campaign, collection
    object_id: ObjectId,            // 对象ID
    relationship: String            // 关系类型：primary, secondary, reference
  }],
  
  // 任务数据
  task_data: {
    // 商品分析任务
    product_analysis: {
      product_ids: [ObjectId],      // 商品ID列表
      analysis_type: String,        // 分析类型：price, content, market, seo
      target_markets: [String],     // 目标市场
      competitors: [String],        // 竞争对手
      analysis_depth: String        // 分析深度：basic, detailed, comprehensive
    },
    
    // 内容创建任务
    content_creation: {
      content_type: String,         // 内容类型：description, title, tags, images
      target_language: String,      // 目标语言
      tone: String,                 // 语调：professional, casual, persuasive
      keywords: [String],           // 关键词
      word_count: Number,           // 字数要求
      style_guide: String           // 风格指南
    },
    
    // 数据提取任务
    data_extraction: {
      source_url: String,           // 源URL
      extraction_rules: Mixed,      // 提取规则
      data_format: String,          // 数据格式
      validation_rules: Mixed,      // 验证规则
      output_format: String         // 输出格式
    },
    
    // 营销任务
    marketing: {
      campaign_id: ObjectId,        // 营销活动ID
      channels: [String],           // 营销渠道
      target_audience: Mixed,       // 目标受众
      budget: Number,               // 预算
      kpis: [String]                // 关键指标
    }
  },
  
  // 任务结果
  results: {
    output_data: Mixed,             // 输出数据
    generated_content: [{
      type: String,                 // 内容类型
      content: String,              // 内容
      language: String,             // 语言
      quality_score: Number         // 质量评分
    }],
    analysis_results: Mixed,        // 分析结果
    extracted_data: Mixed,          // 提取的数据
    performance_metrics: Mixed,     // 性能指标
    ai_insights: [{
      type: String,                 // 洞察类型
      content: String,              // 洞察内容
      confidence: Number,           // 置信度
      actionable: Boolean           // 是否可执行
    }]
  },
  
  // AI处理信息
  ai_processing: {
    ai_model_used: String,          // 使用的AI模型
    processing_time: Number,        // 处理时间（秒）
    tokens_used: Number,            // 使用的token数
    cost: Number,                   // 成本
    quality_score: Number,          // 质量评分
    confidence_level: Number,       // 置信度
    requires_human_review: Boolean, // 需要人工审核
    ai_suggestions: [String]        // AI建议
  },
  
  // 质量控制
  quality_control: {
    reviewer_id: ObjectId,          // 审核人ID
    review_status: String,          // 审核状态：pending, approved, rejected, needs_revision
    review_comments: String,        // 审核意见
    quality_score: Number,          // 质量评分
    reviewed_at: Date,              // 审核时间
    revision_count: Number          // 修订次数
  },
  
  // 依赖关系
  dependencies: [{
    task_id: ObjectId,              // 依赖任务ID
    dependency_type: String,        // 依赖类型：blocks, requires, related
    status: String                  // 依赖状态：pending, satisfied, blocked
  }],
  
  // 子任务
  subtasks: [{
    title: String,                  // 子任务标题
    description: String,            // 子任务描述
    status: String,                 // 状态
    assignee_id: ObjectId,          // 执行人
    due_date: Date,                 // 截止日期
    completed_at: Date              // 完成时间
  }],
  
  // 文件附件
  attachments: [{
    file_id: ObjectId,              // 文件ID
    file_name: String,              // 文件名
    file_type: String,              // 文件类型
    file_size: Number,              // 文件大小
    uploaded_by: ObjectId,          // 上传者
    uploaded_at: Date               // 上传时间
  }],
  
  // 评论和沟通
  comments: [{
    comment_id: ObjectId,           // 评论ID
    user_id: ObjectId,              // 评论者ID
    content: String,                // 评论内容
    comment_type: String,           // 评论类型：comment, question, suggestion
    parent_comment_id: ObjectId,    // 父评论ID
    created_at: Date                // 创建时间
  }],
  
  // 标签和分类
  tags: [String],                   // 标签
  labels: [{
    name: String,                   // 标签名
    color: String,                  // 颜色
    category: String                // 分类
  }],
  
  // 通知设置
  notifications: {
    notify_assignee: Boolean,       // 通知执行人
    notify_team: Boolean,           // 通知团队
    reminder_intervals: [Number],   // 提醒间隔（小时）
    escalation_rules: [{
      condition: String,            // 条件
      action: String,               // 动作
      target: ObjectId              // 目标用户
    }]
  },
  
  // 重复任务配置
  recurrence: {
    is_recurring: Boolean,          // 是否重复
    pattern: String,                // 重复模式：daily, weekly, monthly
    interval: Number,               // 间隔
    end_date: Date,                 // 结束日期
    next_occurrence: Date           // 下次执行时间
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
// 唯一索引
db.tasks.createIndex({ "task_id": 1 }, { unique: true })

// 查询索引
db.tasks.createIndex({ "assignee_id": 1, "status": 1, "priority": 1 })
db.tasks.createIndex({ "status": 1, "due_date": 1 })
db.tasks.createIndex({ "type": 1, "status": 1, "created_at": -1 })
db.tasks.createIndex({ "team_id": 1, "status": 1 })
db.tasks.createIndex({ "template_id": 1, "status": 1 })
db.tasks.createIndex({ "priority": 1, "due_date": 1 })
db.tasks.createIndex({ "related_objects.object_type": 1, "related_objects.object_id": 1 })
db.tasks.createIndex({ "is_deleted": 1, "status": 1 })

// 复合索引
db.tasks.createIndex({ 
  "assignee_id": 1, 
  "status": 1, 
  "due_date": 1 
})
db.tasks.createIndex({ 
  "type": 1, 
  "priority": 1, 
  "created_at": -1 
})

// 文本搜索索引
db.tasks.createIndex({ 
  "title": "text", 
  "description": "text",
  "tags": "text"
})
```

## 3. 任务历史表 (task_histories)

记录任务的所有变更历史。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 历史记录唯一标识
  task_id: ObjectId,                // 任务ID
  
  // 变更信息
  action: String,                   // 动作：created, updated, assigned, completed, cancelled
  field_changes: [{
    field_name: String,             // 字段名
    old_value: Mixed,               // 旧值
    new_value: Mixed,               // 新值
    change_type: String             // 变更类型：added, modified, removed
  }],
  
  // 操作者信息
  changed_by: ObjectId,             // 操作者ID
  change_reason: String,            // 变更原因
  change_source: String,            // 变更来源：manual, system, api, ai
  
  // 快照数据
  snapshot: {
    status: String,                 // 状态快照
    assignee_id: ObjectId,          // 执行人快照
    priority: String,               // 优先级快照
    progress: Number,               // 进度快照
    due_date: Date                  // 截止日期快照
  },
  
  // 时间信息
  timestamp: Date,                  // 变更时间
  
  // 系统信息
  ip_address: String,               // IP地址
  user_agent: String,               // 用户代理
  session_id: String,               // 会话ID
  
  // 通用字段
  created_at: Date,
  is_deleted: Boolean
}
```

### 索引设计

```javascript
// 关联索引
db.task_histories.createIndex({ "task_id": 1, "timestamp": -1 })
db.task_histories.createIndex({ "changed_by": 1, "timestamp": -1 })

// 查询索引
db.task_histories.createIndex({ "action": 1, "timestamp": -1 })
db.task_histories.createIndex({ "change_source": 1, "timestamp": -1 })
db.task_histories.createIndex({ "is_deleted": 1 })
```

## 4. 任务评论表 (task_comments)

任务相关的评论和讨论。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 评论唯一标识
  task_id: ObjectId,                // 任务ID
  user_id: ObjectId,                // 评论者ID
  
  // 评论内容
  content: String,                  // 评论内容
  comment_type: String,             // 评论类型：comment, question, suggestion, status_update
  
  // 回复关系
  parent_comment_id: ObjectId,      // 父评论ID
  reply_count: Number,              // 回复数量
  
  // 附件
  attachments: [{
    file_id: ObjectId,              // 文件ID
    file_name: String,              // 文件名
    file_type: String               // 文件类型
  }],
  
  // 提及用户
  mentions: [ObjectId],             // 提及的用户ID列表
  
  // 状态管理
  is_pinned: Boolean,               // 是否置顶
  is_resolved: Boolean,             // 是否已解决（用于问题类评论）
  resolved_by: ObjectId,            // 解决者ID
  resolved_at: Date,                // 解决时间
  
  // 编辑历史
  edit_history: [{
    edited_by: ObjectId,            // 编辑者ID
    edited_at: Date,                // 编辑时间
    old_content: String             // 原内容
  }],
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId
}
```

### 索引设计

```javascript
// 关联索引
db.task_comments.createIndex({ "task_id": 1, "created_at": -1 })
db.task_comments.createIndex({ "user_id": 1, "created_at": -1 })
db.task_comments.createIndex({ "parent_comment_id": 1, "created_at": 1 })

// 查询索引
db.task_comments.createIndex({ "comment_type": 1, "is_resolved": 1 })
db.task_comments.createIndex({ "is_pinned": 1, "created_at": -1 })
db.task_comments.createIndex({ "mentions": 1, "created_at": -1 })
db.task_comments.createIndex({ "is_deleted": 1 })

// 文本搜索索引
db.task_comments.createIndex({ "content": "text" })
```

## 数据关系说明

### 关系类型
- **task_templates ↔ tasks**: 一对多关系
- **users ↔ tasks**: 多对多关系（创建者、执行者、审核者）
- **tasks ↔ task_histories**: 一对多关系
- **tasks ↔ task_comments**: 一对多关系
- **tasks ↔ products**: 多对多关系（通过related_objects）

### 数据一致性
1. 任务状态变更时自动记录历史
2. 删除任务时保留历史记录
3. 任务分配时发送通知
4. 依赖任务完成时自动更新状态

### 查询优化
1. 任务列表查询使用复合索引
2. 历史记录按时间倒序索引
3. 评论支持分页和搜索
4. 热点任务数据缓存

## 业务规则

### 任务生命周期
1. 任务创建后自动分配编号
2. 状态变更必须符合工作流
3. 逾期任务自动提醒和升级
4. 完成任务需要质量审核

### 权限控制
1. 只有执行者和管理员可以更新任务
2. 任务创建者可以取消任务
3. 审核者可以拒绝任务结果
4. 团队成员可以查看团队任务

### AI集成
1. AI任务自动分析和优化
2. 智能任务分配和调度
3. 质量检查和建议生成
4. 性能预测和风险评估