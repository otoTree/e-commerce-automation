# 营销活动数据模型设计

## 1. 营销活动表 (campaigns)

营销活动的核心信息，支持多种类型的营销策略。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 活动唯一标识
  campaign_id: String,              // 活动编号（可读性强）
  name: String,                     // 活动名称
  description: String,              // 活动描述
  
  // 活动类型
  campaign_type: String,            // 活动类型：discount, promotion, flash_sale, bundle, loyalty, referral, seasonal
  
  // 折扣配置
  discount_config: {
    type: String,                   // 折扣类型：percentage, fixed_amount, buy_x_get_y, free_shipping
    value: Number,                  // 折扣值
    
    // 百分比折扣
    percentage_discount: {
      rate: Number,                 // 折扣率（0-100）
      max_discount_amount: Number,  // 最大折扣金额
      apply_to: String              // 应用范围：order, item, shipping
    },
    
    // 固定金额折扣
    fixed_discount: {
      amount: Number,               // 折扣金额
      currency: String,             // 货币
      apply_to: String              // 应用范围
    },
    
    // 买X送Y
    bxgy_config: {
      buy_quantity: Number,         // 购买数量
      get_quantity: Number,         // 赠送数量
      buy_products: [ObjectId],     // 购买商品
      get_products: [ObjectId],     // 赠送商品
      max_uses_per_order: Number,   // 每订单最大使用次数
      discount_on_get: Number       // 赠品折扣率
    },
    
    // 免运费
    free_shipping: {
      threshold: Number,            // 免运费门槛
      regions: [String],            // 适用地区
      shipping_methods: [String]    // 适用配送方式
    }
  },
  
  // 目标设置
  targets: {
    // 商品目标
    products: {
      include_products: [ObjectId], // 包含商品
      exclude_products: [ObjectId], // 排除商品
      include_collections: [ObjectId], // 包含集合
      exclude_collections: [ObjectId], // 排除集合
      include_categories: [String], // 包含分类
      exclude_categories: [String], // 排除分类
      include_vendors: [String],    // 包含品牌
      exclude_vendors: [String],    // 排除品牌
      
      // 商品条件
      product_conditions: [{
        field: String,              // 字段：price, inventory, rating, created_at
        operator: String,           // 操作符
        value: Mixed                // 条件值
      }]
    },
    
    // 用户目标
    customers: {
      include_segments: [ObjectId], // 包含用户群体
      exclude_segments: [ObjectId], // 排除用户群体
      include_users: [ObjectId],    // 包含用户
      exclude_users: [ObjectId],    // 排除用户
      
      // 用户条件
      customer_conditions: [{
        field: String,              // 字段：total_spent, order_count, last_order_date
        operator: String,           // 操作符
        value: Mixed                // 条件值
      }],
      
      // 地理条件
      geo_targeting: {
        countries: [String],        // 目标国家
        regions: [String],          // 目标地区
        cities: [String],           // 目标城市
        exclude_countries: [String], // 排除国家
        exclude_regions: [String],  // 排除地区
        exclude_cities: [String]    // 排除城市
      }
    }
  },
  
  // 使用条件
  usage_conditions: {
    // 订单条件
    order_conditions: {
      minimum_amount: Number,       // 最低订单金额
      minimum_quantity: Number,     // 最低商品数量
      maximum_amount: Number,       // 最高订单金额
      maximum_quantity: Number,     // 最高商品数量
      
      // 商品组合条件
      product_combinations: [{
        products: [ObjectId],       // 商品组合
        min_quantity: Number,       // 最小数量
        required: Boolean           // 是否必需
      }]
    },
    
    // 使用限制
    usage_limits: {
      total_usage_limit: Number,    // 总使用次数限制
      per_customer_limit: Number,   // 每用户使用次数限制
      per_order_limit: Number,      // 每订单使用次数限制
      per_day_limit: Number,        // 每日使用次数限制
      
      // 时间限制
      time_restrictions: {
        days_of_week: [Number],     // 星期限制（0-6）
        hours_of_day: [{
          start: String,            // 开始时间
          end: String               // 结束时间
        }],
        blackout_dates: [Date]      // 禁用日期
      }
    },
    
    // 组合限制
    combination_rules: {
      stackable: Boolean,           // 是否可叠加
      stackable_with: [ObjectId],   // 可叠加的活动
      not_stackable_with: [ObjectId], // 不可叠加的活动
      priority: Number              // 优先级
    }
  },
  
  // 时间设置
  scheduling: {
    start_date: Date,               // 开始时间
    end_date: Date,                 // 结束时间
    timezone: String,               // 时区
    
    // 预热期
    preview_period: {
      enabled: Boolean,             // 启用预热
      start_date: Date,             // 预热开始时间
      preview_message: String       // 预热消息
    },
    
    // 重复设置
    recurring: {
      enabled: Boolean,             // 启用重复
      pattern: String,              // 重复模式：daily, weekly, monthly, yearly
      interval: Number,             // 间隔
      end_after: Number,            // 重复次数
      end_date: Date,               // 重复结束日期
      
      // 重复实例
      instances: [{
        instance_id: String,        // 实例ID
        start_date: Date,           // 开始时间
        end_date: Date,             // 结束时间
        status: String,             // 状态
        performance: Mixed          // 性能数据
      }]
    }
  },
  
  // 优惠码设置
  coupon_config: {
    requires_code: Boolean,         // 是否需要优惠码
    auto_apply: Boolean,            // 自动应用
    
    // 优惠码生成
    code_generation: {
      type: String,                 // 生成类型：single, bulk, dynamic
      prefix: String,               // 前缀
      suffix: String,               // 后缀
      length: Number,               // 长度
      pattern: String,              // 模式
      
      // 批量生成
      bulk_config: {
        quantity: Number,           // 生成数量
        unique_per_customer: Boolean, // 每用户唯一
        expiry_days: Number         // 有效天数
      }
    },
    
    // 优惠码列表
    codes: [{
      code: String,                 // 优惠码
      status: String,               // 状态：active, used, expired, disabled
      usage_count: Number,          // 使用次数
      usage_limit: Number,          // 使用限制
      assigned_to: ObjectId,        // 分配给用户
      created_at: Date,             // 创建时间
      expires_at: Date              // 过期时间
    }]
  },
  
  // 展示设置
  display_settings: {
    // 横幅设置
    banner: {
      enabled: Boolean,             // 启用横幅
      title: String,                // 横幅标题
      subtitle: String,             // 横幅副标题
      image_url: String,            // 横幅图片
      background_color: String,     // 背景颜色
      text_color: String,           // 文字颜色
      position: String,             // 位置：top, bottom, popup
      
      // 动画效果
      animation: {
        type: String,               // 动画类型
        duration: Number,           // 持续时间
        delay: Number               // 延迟时间
      }
    },
    
    // 徽章设置
    badges: [{
      type: String,                 // 徽章类型：sale, new, hot, limited
      text: String,                 // 徽章文本
      color: String,                // 颜色
      background_color: String,     // 背景颜色
      position: String,             // 位置
      conditions: Mixed             // 显示条件
    }],
    
    // 倒计时设置
    countdown: {
      enabled: Boolean,             // 启用倒计时
      display_format: String,       // 显示格式
      urgency_threshold: Number,    // 紧急阈值（小时）
      urgency_message: String       // 紧急消息
    }
  },
  
  // 通知设置
  notifications: {
    // 客户通知
    customer_notifications: {
      email: {
        enabled: Boolean,           // 启用邮件
        template_id: ObjectId,      // 邮件模板
        send_timing: String,        // 发送时机：start, reminder, end
        reminder_schedule: [Number] // 提醒时间表（小时）
      },
      
      sms: {
        enabled: Boolean,           // 启用短信
        template_id: ObjectId,      // 短信模板
        send_timing: String         // 发送时机
      },
      
      push: {
        enabled: Boolean,           // 启用推送
        template_id: ObjectId,      // 推送模板
        send_timing: String         // 发送时机
      }
    },
    
    // 管理员通知
    admin_notifications: {
      performance_alerts: Boolean,  // 性能警报
      usage_alerts: Boolean,        // 使用警报
      budget_alerts: Boolean,       // 预算警报
      alert_thresholds: {
        low_performance: Number,    // 低性能阈值
        high_usage: Number,         // 高使用阈值
        budget_percentage: Number   // 预算百分比
      }
    }
  },
  
  // 预算和成本
  budget: {
    total_budget: Number,           // 总预算
    currency: String,               // 货币
    
    // 预算分配
    allocation: {
      discount_budget: Number,      // 折扣预算
      marketing_budget: Number,     // 营销预算
      operational_budget: Number    // 运营预算
    },
    
    // 成本跟踪
    cost_tracking: {
      spent_amount: Number,         // 已花费金额
      projected_cost: Number,       // 预计成本
      cost_per_acquisition: Number, // 获客成本
      return_on_investment: Number  // 投资回报率
    }
  },
  
  // AI优化设置
  ai_optimization: {
    enabled: Boolean,               // 启用AI优化
    
    // 自动调整
    auto_adjustment: {
      enabled: Boolean,             // 启用自动调整
      adjustment_frequency: String, // 调整频率
      parameters: [String],         // 可调整参数
      
      // 调整规则
      rules: [{
        condition: String,          // 条件
        action: String,             // 动作
        threshold: Number,          // 阈值
        adjustment_value: Number    // 调整值
      }]
    },
    
    // 个性化
    personalization: {
      enabled: Boolean,             // 启用个性化
      user_segments: [ObjectId],    // 用户群体
      
      // 个性化规则
      rules: [{
        segment_id: ObjectId,       // 群体ID
        discount_modifier: Number,  // 折扣修正
        product_recommendations: [ObjectId], // 推荐商品
        custom_message: String      // 自定义消息
      }]
    },
    
    // 预测分析
    predictive_analytics: {
      performance_prediction: {
        expected_conversion_rate: Number, // 预期转化率
        expected_revenue: Number,   // 预期收入
        expected_participants: Number, // 预期参与人数
        confidence_level: Number    // 置信度
      },
      
      // 优化建议
      optimization_suggestions: [{
        type: String,               // 建议类型
        description: String,        // 建议描述
        impact_score: Number,       // 影响评分
        implementation_effort: String, // 实施难度
        expected_improvement: Number // 预期改善
      }]
    }
  },
  
  // 状态管理
  status: String,                   // 状态：draft, scheduled, active, paused, completed, cancelled
  
  // 审批流程
  approval: {
    required: Boolean,              // 需要审批
    status: String,                 // 审批状态：pending, approved, rejected
    approver_id: ObjectId,          // 审批人ID
    approved_at: Date,              // 审批时间
    rejection_reason: String,       // 拒绝原因
    
    // 审批历史
    history: [{
      action: String,               // 动作
      user_id: ObjectId,            // 操作人
      timestamp: Date,              // 时间戳
      comments: String              // 评论
    }]
  },
  
  // 版本控制
  versioning: {
    version: Number,                // 版本号
    parent_campaign_id: ObjectId,   // 父活动ID
    is_template: Boolean,           // 是否模板
    
    // 变更历史
    change_history: [{
      version: Number,              // 版本
      changes: Mixed,               // 变更内容
      changed_by: ObjectId,         // 变更人
      changed_at: Date,             // 变更时间
      change_reason: String         // 变更原因
    }]
  },
  
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
// 唯一索引
db.campaigns.createIndex({ "campaign_id": 1 }, { unique: true })

// 查询索引
db.campaigns.createIndex({ "status": 1, "scheduling.start_date": 1, "scheduling.end_date": 1 })
db.campaigns.createIndex({ "campaign_type": 1, "status": 1 })
db.campaigns.createIndex({ "scheduling.start_date": 1, "scheduling.end_date": 1 })
db.campaigns.createIndex({ "created_by": 1, "status": 1, "created_at": -1 })
db.campaigns.createIndex({ "approval.status": 1, "status": 1 })
db.campaigns.createIndex({ "is_deleted": 1, "status": 1 })

// 优惠码索引
db.campaigns.createIndex({ "coupon_config.codes.code": 1 }, { sparse: true })
db.campaigns.createIndex({ "coupon_config.codes.status": 1, "coupon_config.codes.expires_at": 1 })

// 目标索引
db.campaigns.createIndex({ "targets.products.include_products": 1 })
db.campaigns.createIndex({ "targets.products.include_collections": 1 })
db.campaigns.createIndex({ "targets.customers.include_segments": 1 })

// 文本搜索索引
db.campaigns.createIndex({ 
  "name": "text", 
  "description": "text",
  "campaign_id": "text"
})
```

## 2. 营销活动指标表 (campaign_metrics)

记录营销活动的详细性能指标和分析数据。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 指标记录唯一标识
  campaign_id: ObjectId,            // 活动ID
  date: Date,                       // 统计日期
  
  // 基础指标
  basic_metrics: {
    impressions: Number,            // 展示次数
    clicks: Number,                 // 点击次数
    conversions: Number,            // 转化次数
    participants: Number,           // 参与人数
    
    // 订单指标
    orders: {
      total_orders: Number,         // 总订单数
      new_customer_orders: Number,  // 新客户订单数
      returning_customer_orders: Number, // 老客户订单数
      avg_order_value: Number,      // 平均订单价值
      total_revenue: Number,        // 总收入
      total_discount: Number        // 总折扣金额
    },
    
    // 商品指标
    products: {
      products_sold: Number,        // 销售商品数
      unique_products: Number,      // 独特商品数
      top_selling_products: [{
        product_id: ObjectId,       // 商品ID
        quantity_sold: Number,      // 销售数量
        revenue: Number             // 收入
      }]
    }
  },
  
  // 转化漏斗
  conversion_funnel: {
    awareness: {
      impressions: Number,          // 展示次数
      reach: Number,                // 触达人数
      frequency: Number             // 频次
    },
    
    interest: {
      clicks: Number,               // 点击次数
      page_views: Number,           // 页面浏览
      time_on_page: Number,         // 页面停留时间
      bounce_rate: Number           // 跳出率
    },
    
    consideration: {
      add_to_cart: Number,          // 加购次数
      wishlist_adds: Number,        // 收藏次数
      product_views: Number,        // 商品浏览
      comparison_views: Number      // 对比浏览
    },
    
    purchase: {
      checkout_initiated: Number,   // 开始结账
      checkout_completed: Number,   // 完成结账
      payment_completed: Number,    // 完成支付
      orders_fulfilled: Number      // 订单履约
    },
    
    retention: {
      repeat_purchases: Number,     // 重复购买
      referrals: Number,            // 推荐次数
      reviews_left: Number,         // 留评次数
      loyalty_signups: Number       // 忠诚度注册
    }
  },
  
  // 用户行为分析
  user_behavior: {
    // 用户群体分析
    segments: [{
      segment_id: ObjectId,         // 群体ID
      segment_name: String,         // 群体名称
      participants: Number,         // 参与人数
      conversion_rate: Number,      // 转化率
      avg_order_value: Number,      // 平均订单价值
      total_revenue: Number         // 总收入
    }],
    
    // 地理分析
    geography: [{
      country: String,              // 国家
      region: String,               // 地区
      city: String,                 // 城市
      participants: Number,         // 参与人数
      conversion_rate: Number,      // 转化率
      revenue: Number               // 收入
    }],
    
    // 设备分析
    devices: [{
      device_type: String,          // 设备类型
      browser: String,              // 浏览器
      os: String,                   // 操作系统
      participants: Number,         // 参与人数
      conversion_rate: Number       // 转化率
    }],
    
    // 时间分析
    temporal: {
      hourly_distribution: [{
        hour: Number,               // 小时
        activity: Number,           // 活动量
        conversions: Number         // 转化数
      }],
      
      daily_distribution: [{
        day_of_week: Number,        // 星期
        activity: Number,           // 活动量
        conversions: Number         // 转化数
      }]
    }
  },
  
  // 财务指标
  financial_metrics: {
    // 收入分析
    revenue: {
      gross_revenue: Number,        // 毛收入
      net_revenue: Number,          // 净收入
      discount_amount: Number,      // 折扣金额
      refund_amount: Number,        // 退款金额
      tax_amount: Number,           // 税费
      shipping_revenue: Number      // 运费收入
    },
    
    // 成本分析
    costs: {
      campaign_cost: Number,        // 活动成本
      discount_cost: Number,        // 折扣成本
      operational_cost: Number,     // 运营成本
      acquisition_cost: Number,     // 获客成本
      total_cost: Number            // 总成本
    },
    
    // 盈利能力
    profitability: {
      gross_profit: Number,         // 毛利润
      net_profit: Number,           // 净利润
      profit_margin: Number,        // 利润率
      roi: Number,                  // 投资回报率
      roas: Number                  // 广告支出回报率
    }
  },
  
  // 优惠码使用统计
  coupon_usage: {
    total_codes_generated: Number,  // 生成优惠码总数
    codes_used: Number,             // 使用优惠码数
    usage_rate: Number,             // 使用率
    
    // 优惠码详情
    code_details: [{
      code: String,                 // 优惠码
      usage_count: Number,          // 使用次数
      revenue_generated: Number,    // 产生收入
      first_used: Date,             // 首次使用
      last_used: Date               // 最后使用
    }]
  },
  
  // 竞争分析
  competitive_analysis: {
    market_share: Number,           // 市场份额
    price_competitiveness: Number, // 价格竞争力
    
    // 竞争对手对比
    competitor_comparison: [{
      competitor_name: String,      // 竞争对手名称
      price_difference: Number,     // 价格差异
      feature_comparison: Mixed,    // 功能对比
      market_position: String       // 市场地位
    }]
  },
  
  // AI洞察
  ai_insights: {
    // 性能预测
    predictions: {
      next_period_revenue: Number,  // 下期收入预测
      conversion_trend: String,     // 转化趋势
      optimal_duration: Number,     // 最优持续时间
      recommended_budget: Number    // 推荐预算
    },
    
    // 优化建议
    recommendations: [{
      type: String,                 // 建议类型
      priority: String,             // 优先级
      description: String,          // 描述
      expected_impact: Number,      // 预期影响
      confidence: Number            // 置信度
    }],
    
    // 异常检测
    anomalies: [{
      metric: String,               // 异常指标
      detected_at: Date,            // 检测时间
      severity: String,             // 严重程度
      description: String,          // 描述
      suggested_action: String      // 建议行动
    }]
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  is_deleted: Boolean
}
```

### 索引设计

```javascript
// 关联索引
db.campaign_metrics.createIndex({ "campaign_id": 1, "date": -1 })
db.campaign_metrics.createIndex({ "campaign_id": 1, "created_at": -1 })

// 时间索引
db.campaign_metrics.createIndex({ "date": -1 })
db.campaign_metrics.createIndex({ "created_at": -1 })

// 查询索引
db.campaign_metrics.createIndex({ "is_deleted": 1 })
```

## 3. 营销活动模板表 (campaign_templates)

预定义的营销活动模板，用于快速创建标准化活动。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 模板唯一标识
  template_name: String,            // 模板名称
  description: String,              // 模板描述
  category: String,                 // 模板分类：seasonal, product_launch, clearance, loyalty
  
  // 模板配置
  template_config: {
    campaign_type: String,          // 活动类型
    default_duration: Number,       // 默认持续时间（天）
    
    // 默认折扣设置
    default_discount: {
      type: String,                 // 折扣类型
      value: Number,                // 默认值
      min_value: Number,            // 最小值
      max_value: Number,            // 最大值
      suggested_values: [Number]    // 建议值
    },
    
    // 默认目标设置
    default_targets: {
      product_selection: String,    // 商品选择策略
      customer_segments: [String],  // 目标客户群体
      geo_targeting: [String]       // 地理定位
    },
    
    // 推荐设置
    recommended_settings: {
      budget_range: {
        min: Number,                // 最小预算
        max: Number                 // 最大预算
      },
      timing: {
        best_days: [Number],        // 最佳日期
        best_hours: [Number],       // 最佳时间
        duration: Number            // 推荐持续时间
      }
    }
  },
  
  // 成功案例
  success_cases: [{
    case_id: ObjectId,              // 案例ID
    campaign_name: String,          // 活动名称
    performance_metrics: {
      conversion_rate: Number,      // 转化率
      revenue: Number,              // 收入
      roi: Number                   // 投资回报率
    },
    lessons_learned: [String],      // 经验教训
    best_practices: [String]        // 最佳实践
  }],
  
  // 使用统计
  usage_stats: {
    total_used: Number,             // 总使用次数
    success_rate: Number,           // 成功率
    avg_performance: {
      conversion_rate: Number,      // 平均转化率
      revenue: Number,              // 平均收入
      roi: Number                   // 平均投资回报率
    },
    last_used: Date                 // 最后使用时间
  },
  
  // 状态管理
  status: String,                   // 状态：active, inactive, deprecated
  is_system_template: Boolean,      // 是否系统模板
  is_public: Boolean,               // 是否公开
  
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
db.campaign_templates.createIndex({ "category": 1, "status": 1 })
db.campaign_templates.createIndex({ "is_public": 1, "status": 1 })
db.campaign_templates.createIndex({ "usage_stats.success_rate": -1 })
db.campaign_templates.createIndex({ "is_deleted": 1, "status": 1 })

// 文本搜索索引
db.campaign_templates.createIndex({ 
  "template_name": "text", 
  "description": "text",
  "category": "text"
})
```

## 数据关系说明

### 关系类型
- **campaigns ↔ products**: 多对多关系（通过targets配置）
- **campaigns ↔ users**: 多对多关系（创建者、参与者）
- **campaigns ↔ orders**: 一对多关系
- **campaigns ↔ campaign_metrics**: 一对多关系
- **campaign_templates ↔ campaigns**: 一对多关系

### 数据一致性
1. 活动状态变更时自动记录指标
2. 优惠码使用时实时更新统计
3. 活动结束时生成最终报告
4. 模板使用时更新使用统计

### 查询优化
1. 活动列表查询使用状态和时间索引
2. 指标查询使用活动ID和日期索引
3. 优惠码查询使用代码索引
4. 热门活动数据缓存

## 业务规则

### 活动生命周期
1. **草稿阶段**: 活动创建但未发布
2. **审批阶段**: 等待审批（如需要）
3. **计划阶段**: 已审批，等待开始
4. **活跃阶段**: 活动进行中
5. **暂停阶段**: 临时暂停
6. **完成阶段**: 活动结束
7. **取消阶段**: 活动取消

### 折扣规则
1. 折扣不能超过商品原价
2. 组合折扣需要检查冲突
3. 用户级别折扣优先级管理
4. 自动应用最优折扣

### 使用限制
1. 每用户使用次数限制
2. 总使用次数限制
3. 时间窗口限制
4. 地理位置限制

### AI增强功能
1. **智能定价**: 基于市场数据自动调整折扣
2. **个性化推荐**: 为不同用户群体定制活动
3. **性能预测**: 预测活动效果和ROI
4. **自动优化**: 实时调整活动参数
5. **异常检测**: 识别异常行为和欺诈

### 营销集成
1. 邮件营销自动化
2. 社交媒体推广
3. 搜索引擎营销
4. 联盟营销支持
5. 影响者营销跟踪