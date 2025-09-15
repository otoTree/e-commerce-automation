# 商品集合数据模型设计

## 1. 商品集合表 (collections)

商品集合用于组织和展示相关商品，支持手动和自动规则两种方式。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 集合唯一标识
  handle: String,                   // 集合句柄（URL友好）
  title: String,                    // 集合标题
  description: String,              // 集合描述
  
  // SEO信息
  seo: {
    title: String,                  // SEO标题
    description: String,            // SEO描述
    keywords: [String],             // 关键词
    meta_fields: [{
      key: String,                  // 元字段键
      value: String,                // 元字段值
      namespace: String             // 命名空间
    }]
  },
  
  // 集合类型
  collection_type: String,          // 类型：manual, automatic, smart
  
  // 手动集合配置
  manual_config: {
    sort_order: String,             // 排序方式：manual, best_selling, created, price_asc, price_desc, title_asc, title_desc
    products: [{
      product_id: ObjectId,         // 商品ID
      position: Number,             // 位置
      featured: Boolean,            // 是否精选
      added_at: Date,               // 添加时间
      added_by: ObjectId            // 添加者
    }]
  },
  
  // 自动集合规则
  automatic_rules: {
    conditions: [{
      field: String,                // 字段：title, type, vendor, price, tag, inventory_quantity
      operator: String,             // 操作符：equals, not_equals, contains, not_contains, starts_with, ends_with, greater_than, less_than
      value: String,                // 值
      condition_type: String        // 条件类型：include, exclude
    }],
    match_type: String,             // 匹配类型：all, any
    sort_order: String,             // 排序方式
    max_products: Number,           // 最大商品数
    auto_update: Boolean,           // 自动更新
    last_updated: Date              // 最后更新时间
  },
  
  // 智能集合（AI驱动）
  smart_config: {
    ai_model: String,               // AI模型
    learning_data: {
      user_behavior: Boolean,       // 用户行为数据
      purchase_history: Boolean,    // 购买历史
      browsing_patterns: Boolean,   // 浏览模式
      seasonal_trends: Boolean      // 季节性趋势
    },
    optimization_goals: [String],   // 优化目标：conversion, engagement, revenue, diversity
    personalization: {
      enabled: Boolean,             // 启用个性化
      factors: [String],            // 个性化因素
      fallback_strategy: String     // 回退策略
    },
    performance_metrics: {
      click_through_rate: Number,   // 点击率
      conversion_rate: Number,      // 转化率
      engagement_score: Number,     // 参与度评分
      revenue_per_visitor: Number   // 每访客收入
    }
  },
  
  // 展示设置
  display_settings: {
    layout: String,                 // 布局：grid, list, carousel, masonry
    items_per_page: Number,         // 每页商品数
    show_filters: Boolean,          // 显示筛选器
    show_sorting: Boolean,          // 显示排序
    show_pagination: Boolean,       // 显示分页
    
    // 商品卡片设置
    product_card: {
      show_vendor: Boolean,         // 显示品牌
      show_price: Boolean,          // 显示价格
      show_compare_price: Boolean,  // 显示对比价格
      show_rating: Boolean,         // 显示评分
      show_quick_view: Boolean,     // 显示快速查看
      show_add_to_cart: Boolean,    // 显示加购按钮
      image_aspect_ratio: String    // 图片宽高比
    },
    
    // 筛选器配置
    filters: [{
      type: String,                 // 筛选器类型：price, brand, color, size, rating
      label: String,                // 显示标签
      enabled: Boolean,             // 是否启用
      position: Number,             // 位置
      options: [{
        value: String,              // 选项值
        label: String,              // 选项标签
        count: Number               // 商品数量
      }]
    }]
  },
  
  // 媒体资源
  media: {
    featured_image: {
      url: String,                  // 图片URL
      alt_text: String,             // 替代文本
      width: Number,                // 宽度
      height: Number                // 高度
    },
    banner_image: {
      url: String,                  // 横幅图片URL
      alt_text: String,             // 替代文本
      link_url: String              // 链接URL
    },
    gallery: [{
      type: String,                 // 媒体类型：image, video
      url: String,                  // 媒体URL
      thumbnail_url: String,        // 缩略图URL
      alt_text: String,             // 替代文本
      caption: String,              // 说明文字
      position: Number              // 位置
    }]
  },
  
  // 分类和标签
  categorization: {
    category: String,               // 主分类
    subcategories: [String],        // 子分类
    tags: [String],                 // 标签
    labels: [{
      name: String,                 // 标签名
      color: String,                // 颜色
      description: String           // 描述
    }]
  },
  
  // 可见性设置
  visibility: {
    published: Boolean,             // 是否发布
    published_at: Date,             // 发布时间
    visibility_scope: String,       // 可见范围：public, private, password_protected
    password: String,               // 访问密码（加密）
    
    // 渠道可见性
    channels: [{
      channel_id: ObjectId,         // 渠道ID
      channel_name: String,         // 渠道名称
      visible: Boolean,             // 是否可见
      custom_settings: Mixed        // 自定义设置
    }],
    
    // 地理限制
    geo_restrictions: {
      enabled: Boolean,             // 启用地理限制
      allowed_countries: [String],  // 允许的国家
      blocked_countries: [String],  // 禁止的国家
      allowed_regions: [String],    // 允许的地区
      blocked_regions: [String]     // 禁止的地区
    }
  },
  
  // 时间设置
  scheduling: {
    start_date: Date,               // 开始时间
    end_date: Date,                 // 结束时间
    timezone: String,               // 时区
    recurring: {
      enabled: Boolean,             // 启用重复
      pattern: String,              // 重复模式：daily, weekly, monthly, yearly
      interval: Number,             // 间隔
      end_after: Number,            // 重复次数
      end_date: Date                // 重复结束日期
    }
  },
  
  // 营销设置
  marketing: {
    featured: Boolean,              // 是否精选
    promoted: Boolean,              // 是否推广
    discount_eligible: Boolean,     // 折扣适用
    
    // 促销活动
    promotions: [{
      promotion_id: ObjectId,       // 促销ID
      promotion_type: String,       // 促销类型
      discount_value: Number,       // 折扣值
      start_date: Date,             // 开始时间
      end_date: Date,               // 结束时间
      active: Boolean               // 是否激活
    }],
    
    // 交叉销售
    cross_sell: {
      enabled: Boolean,             // 启用交叉销售
      related_collections: [ObjectId], // 相关集合
      recommendation_engine: String, // 推荐引擎
      max_recommendations: Number    // 最大推荐数
    }
  },
  
  // 统计信息
  analytics: {
    view_count: Number,             // 查看次数
    unique_visitors: Number,        // 独立访客
    conversion_rate: Number,        // 转化率
    revenue: Number,                // 收入
    avg_order_value: Number,        // 平均订单价值
    bounce_rate: Number,            // 跳出率
    time_on_page: Number,           // 页面停留时间
    
    // 商品统计
    product_stats: {
      total_products: Number,       // 总商品数
      active_products: Number,      // 活跃商品数
      out_of_stock: Number,         // 缺货商品数
      avg_price: Number,            // 平均价格
      price_range: {
        min: Number,                // 最低价
        max: Number                 // 最高价
      }
    },
    
    // 性能指标
    performance: {
      load_time: Number,            // 加载时间
      search_performance: Number,   // 搜索性能
      filter_usage: [{
        filter_type: String,        // 筛选器类型
        usage_count: Number,        // 使用次数
        conversion_impact: Number   // 转化影响
      }]
    }
  },
  
  // AI增强功能
  ai_enhancements: {
    auto_tagging: {
      enabled: Boolean,             // 启用自动标签
      confidence_threshold: Number, // 置信度阈值
      last_run: Date,               // 最后运行时间
      tags_generated: [String]      // 生成的标签
    },
    
    content_optimization: {
      title_suggestions: [String],  // 标题建议
      description_suggestions: [String], // 描述建议
      seo_score: Number,            // SEO评分
      optimization_tips: [String]   // 优化建议
    },
    
    personalization: {
      user_segments: [{
        segment_id: ObjectId,       // 用户群体ID
        segment_name: String,       // 群体名称
        custom_content: {
          title: String,            // 自定义标题
          description: String,      // 自定义描述
          featured_products: [ObjectId] // 精选商品
        }
      }]
    }
  },
  
  // 版本控制
  versioning: {
    version: Number,                // 版本号
    draft_changes: Mixed,           // 草稿变更
    published_version: Mixed,       // 已发布版本
    change_log: [{
      version: Number,              // 版本
      changes: String,              // 变更内容
      changed_by: ObjectId,         // 变更人
      changed_at: Date              // 变更时间
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
db.collections.createIndex({ "handle": 1 }, { unique: true })

// 查询索引
db.collections.createIndex({ "collection_type": 1, "visibility.published": 1 })
db.collections.createIndex({ "visibility.published": 1, "created_at": -1 })
db.collections.createIndex({ "categorization.category": 1, "visibility.published": 1 })
db.collections.createIndex({ "categorization.tags": 1, "visibility.published": 1 })
db.collections.createIndex({ "marketing.featured": 1, "visibility.published": 1 })
db.collections.createIndex({ "is_deleted": 1, "visibility.published": 1 })

// 商品关联索引
db.collections.createIndex({ "manual_config.products.product_id": 1 })

// 时间索引
db.collections.createIndex({ "scheduling.start_date": 1, "scheduling.end_date": 1 })
db.collections.createIndex({ "visibility.published_at": -1 })

// 文本搜索索引
db.collections.createIndex({ 
  "title": "text", 
  "description": "text",
  "categorization.tags": "text",
  "seo.keywords": "text"
})

// 地理索引
db.collections.createIndex({ "visibility.geo_restrictions.allowed_countries": 1 })
```

## 2. 集合商品关联表 (collection_products)

记录集合与商品的关联关系，支持复杂的关联逻辑。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 关联记录唯一标识
  collection_id: ObjectId,          // 集合ID
  product_id: ObjectId,             // 商品ID
  
  // 关联类型
  association_type: String,         // 关联类型：manual, automatic, ai_recommended
  
  // 位置和排序
  position: Number,                 // 在集合中的位置
  sort_weight: Number,              // 排序权重
  
  // 展示设置
  display_settings: {
    featured: Boolean,              // 是否精选
    pinned: Boolean,                // 是否置顶
    hidden: Boolean,                // 是否隐藏
    custom_title: String,           // 自定义标题
    custom_description: String,     // 自定义描述
    custom_image_url: String,       // 自定义图片
    badge: {
      text: String,                 // 徽章文本
      color: String,                // 徽章颜色
      background_color: String      // 背景颜色
    }
  },
  
  // 自动关联规则
  auto_association: {
    rule_id: ObjectId,              // 规则ID
    rule_type: String,              // 规则类型
    match_score: Number,            // 匹配分数
    confidence: Number,             // 置信度
    last_evaluated: Date,           // 最后评估时间
    
    // 匹配条件
    match_conditions: [{
      field: String,                // 匹配字段
      operator: String,             // 操作符
      value: String,                // 匹配值
      weight: Number                // 权重
    }]
  },
  
  // AI推荐信息
  ai_recommendation: {
    model_version: String,          // 模型版本
    recommendation_score: Number,   // 推荐分数
    recommendation_reason: [String], // 推荐原因
    user_segment: String,           // 目标用户群体
    performance_prediction: {
      expected_ctr: Number,         // 预期点击率
      expected_conversion: Number,  // 预期转化率
      expected_revenue: Number      // 预期收入
    },
    
    // 学习数据
    learning_features: {
      product_features: Mixed,      // 商品特征
      user_behavior: Mixed,         // 用户行为
      contextual_features: Mixed,   // 上下文特征
      temporal_features: Mixed      // 时间特征
    }
  },
  
  // 性能统计
  performance: {
    impressions: Number,            // 展示次数
    clicks: Number,                 // 点击次数
    conversions: Number,            // 转化次数
    revenue: Number,                // 产生收入
    ctr: Number,                    // 点击率
    conversion_rate: Number,        // 转化率
    
    // 时间段统计
    daily_stats: [{
      date: Date,                   // 日期
      impressions: Number,          // 展示次数
      clicks: Number,               // 点击次数
      conversions: Number,          // 转化次数
      revenue: Number               // 收入
    }]
  },
  
  // 个性化设置
  personalization: {
    user_segments: [{
      segment_id: ObjectId,         // 用户群体ID
      visibility: Boolean,          // 是否可见
      position_override: Number,    // 位置覆盖
      custom_content: Mixed         // 自定义内容
    }],
    
    // A/B测试
    ab_test: {
      test_id: ObjectId,            // 测试ID
      variant: String,              // 变体
      traffic_allocation: Number,   // 流量分配
      performance_metrics: Mixed    // 性能指标
    }
  },
  
  // 时间设置
  scheduling: {
    start_date: Date,               // 开始时间
    end_date: Date,                 // 结束时间
    active: Boolean,                // 是否激活
    timezone: String                // 时区
  },
  
  // 条件设置
  conditions: {
    inventory_threshold: Number,    // 库存阈值
    price_range: {
      min: Number,                  // 最低价格
      max: Number                   // 最高价格
    },
    availability: String,           // 可用性要求
    rating_threshold: Number,       // 评分阈值
    
    // 地理条件
    geo_conditions: {
      countries: [String],          // 适用国家
      regions: [String],            // 适用地区
      exclude_countries: [String],  // 排除国家
      exclude_regions: [String]     // 排除地区
    }
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
// 关联索引
db.collection_products.createIndex({ "collection_id": 1, "position": 1 })
db.collection_products.createIndex({ "product_id": 1, "collection_id": 1 })

// 查询索引
db.collection_products.createIndex({ "collection_id": 1, "display_settings.featured": 1, "position": 1 })
db.collection_products.createIndex({ "association_type": 1, "created_at": -1 })
db.collection_products.createIndex({ "scheduling.active": 1, "scheduling.start_date": 1, "scheduling.end_date": 1 })
db.collection_products.createIndex({ "is_deleted": 1 })

// AI推荐索引
db.collection_products.createIndex({ "ai_recommendation.recommendation_score": -1 })
db.collection_products.createIndex({ "ai_recommendation.user_segment": 1 })

// 性能索引
db.collection_products.createIndex({ "performance.ctr": -1 })
db.collection_products.createIndex({ "performance.conversion_rate": -1 })
```

## 3. 集合规则表 (collection_rules)

定义自动集合的规则和条件。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 规则唯一标识
  collection_id: ObjectId,          // 集合ID
  rule_name: String,                // 规则名称
  rule_type: String,                // 规则类型：inclusion, exclusion, sorting, filtering
  
  // 规则条件
  conditions: [{
    field: String,                  // 字段名：title, type, vendor, price, tag, inventory_quantity, created_at, updated_at
    operator: String,               // 操作符：equals, not_equals, contains, not_contains, starts_with, ends_with, greater_than, less_than, in, not_in
    value: Mixed,                   // 条件值
    data_type: String,              // 数据类型：string, number, date, boolean, array
    case_sensitive: Boolean,        // 是否区分大小写
    
    // 高级条件
    advanced: {
      regex_pattern: String,        // 正则表达式
      date_range: {
        start: Date,                // 开始日期
        end: Date,                  // 结束日期
        relative: String            // 相对时间：last_7_days, last_30_days, last_year
      },
      numeric_range: {
        min: Number,                // 最小值
        max: Number,                // 最大值
        unit: String                // 单位
      }
    }
  }],
  
  // 逻辑关系
  logic: {
    operator: String,               // 逻辑操作符：AND, OR, NOT
    groups: [{
      conditions: [Mixed],          // 条件组
      operator: String              // 组内逻辑
    }]
  },
  
  // 排序规则
  sorting: {
    primary_sort: {
      field: String,                // 主排序字段
      direction: String,            // 排序方向：asc, desc
      weight: Number                // 权重
    },
    secondary_sorts: [{
      field: String,                // 次排序字段
      direction: String,            // 排序方向
      weight: Number                // 权重
    }],
    
    // 自定义排序
    custom_sorting: {
      algorithm: String,            // 排序算法
      parameters: Mixed,            // 算法参数
      ai_enhanced: Boolean          // AI增强
    }
  },
  
  // 限制条件
  limits: {
    max_products: Number,           // 最大商品数
    min_products: Number,           // 最小商品数
    max_per_vendor: Number,         // 每个品牌最大数量
    max_per_category: Number,       // 每个分类最大数量
    diversity_rules: [{
      field: String,                // 多样性字段
      max_percentage: Number,       // 最大占比
      min_count: Number             // 最小数量
    }]
  },
  
  // 执行设置
  execution: {
    auto_update: Boolean,           // 自动更新
    update_frequency: String,       // 更新频率：real_time, hourly, daily, weekly
    last_executed: Date,            // 最后执行时间
    next_execution: Date,           // 下次执行时间
    execution_status: String,       // 执行状态：pending, running, completed, failed
    
    // 执行历史
    execution_history: [{
      executed_at: Date,            // 执行时间
      duration: Number,             // 执行时长（毫秒）
      products_matched: Number,     // 匹配商品数
      products_added: Number,       // 新增商品数
      products_removed: Number,     // 移除商品数
      status: String,               // 执行状态
      error_message: String         // 错误信息
    }]
  },
  
  // 性能监控
  performance: {
    avg_execution_time: Number,     // 平均执行时间
    success_rate: Number,           // 成功率
    impact_score: Number,           // 影响评分
    
    // 质量指标
    quality_metrics: {
      relevance_score: Number,      // 相关性评分
      diversity_score: Number,      // 多样性评分
      freshness_score: Number,      // 新鲜度评分
      user_satisfaction: Number     // 用户满意度
    }
  },
  
  // 优先级和权重
  priority: Number,                 // 优先级
  weight: Number,                   // 权重
  
  // 状态管理
  status: String,                   // 状态：active, inactive, testing
  enabled: Boolean,                 // 是否启用
  
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
db.collection_rules.createIndex({ "collection_id": 1, "priority": -1 })
db.collection_rules.createIndex({ "collection_id": 1, "status": 1, "enabled": 1 })

// 执行索引
db.collection_rules.createIndex({ "execution.auto_update": 1, "execution.next_execution": 1 })
db.collection_rules.createIndex({ "execution.execution_status": 1, "execution.last_executed": -1 })

// 查询索引
db.collection_rules.createIndex({ "rule_type": 1, "status": 1 })
db.collection_rules.createIndex({ "enabled": 1, "status": 1 })
db.collection_rules.createIndex({ "is_deleted": 1 })
```

## 数据关系说明

### 关系类型
- **collections ↔ products**: 多对多关系（通过collection_products）
- **collections ↔ collection_rules**: 一对多关系
- **collections ↔ users**: 多对一关系（创建者）
- **collection_products ↔ products**: 多对一关系
- **collection_products ↔ collections**: 多对一关系

### 数据一致性
1. 商品删除时自动从集合中移除
2. 集合规则变更时自动重新评估商品
3. 商品属性变更时触发自动集合更新
4. 集合发布状态变更时更新相关缓存

### 查询优化
1. 集合商品列表使用位置索引
2. 自动规则执行使用时间索引
3. 热门集合数据预加载
4. 个性化推荐结果缓存

## 业务规则

### 集合类型管理
1. **手动集合**: 完全由管理员手动管理商品
2. **自动集合**: 基于规则自动添加/移除商品
3. **智能集合**: AI驱动的个性化商品推荐

### 商品关联规则
1. 同一商品可以属于多个集合
2. 集合中商品位置可以手动调整
3. 自动集合商品位置由规则决定
4. 智能集合支持个性化排序

### 性能优化
1. 大型集合分页加载
2. 商品图片懒加载
3. 筛选器结果缓存
4. 搜索结果预加载

### AI增强功能
1. **自动标签生成**: 基于商品内容自动生成标签
2. **智能排序**: 根据用户行为优化商品排序
3. **个性化推荐**: 为不同用户群体推荐不同商品
4. **性能预测**: 预测集合的转化率和收入
5. **内容优化**: 自动优化集合标题和描述

### 营销集成
1. 集合可以关联促销活动
2. 支持交叉销售推荐
3. 个性化内容展示
4. A/B测试支持