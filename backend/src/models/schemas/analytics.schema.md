# 统计分析数据模型设计

## 概述
本文档定义了电商AI系统中统计分析相关的数据模型，包括数据收集、分析处理、报表生成和洞察发现等功能。

## 数据模型

### 1. 分析事件表 (AnalyticsEvent)

#### 字段设计
```typescript
interface AnalyticsEvent {
  // 基础信息
  event_id: string;                    // 事件唯一标识
  event_type: string;                  // 事件类型
  event_category: string;              // 事件分类
  event_name: string;                  // 事件名称
  
  // 时间信息
  timestamp: Date;                     // 事件发生时间
  date: string;                        // 日期 (YYYY-MM-DD)
  hour: number;                        // 小时 (0-23)
  day_of_week: number;                 // 星期几 (0-6)
  week_of_year: number;                // 年中第几周
  month: number;                       // 月份 (1-12)
  quarter: number;                     // 季度 (1-4)
  year: number;                        // 年份
  
  // 用户信息
  user_id?: ObjectId;                  // 用户ID
  session_id: string;                  // 会话ID
  visitor_id: string;                  // 访客ID
  user_type: 'guest' | 'registered';  // 用户类型
  
  // 设备和环境
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;                        // 操作系统
    browser: string;                   // 浏览器
    screen_resolution: string;         // 屏幕分辨率
    viewport_size: string;             // 视口大小
  };
  
  // 地理位置
  location: {
    country: string;                   // 国家
    region: string;                    // 地区/州
    city: string;                      // 城市
    timezone: string;                  // 时区
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // 流量来源
  traffic_source: {
    source: string;                    // 来源
    medium: string;                    // 媒介
    campaign?: string;                 // 活动
    keyword?: string;                  // 关键词
    referrer?: string;                 // 引荐网址
    landing_page: string;              // 着陆页
  };
  
  // 页面信息
  page: {
    url: string;                       // 页面URL
    path: string;                      // 页面路径
    title: string;                     // 页面标题
    category?: string;                 // 页面分类
  };
  
  // 事件属性
  properties: {
    // 电商相关属性
    product_id?: ObjectId;
    category_id?: ObjectId;
    order_id?: ObjectId;
    cart_value?: number;
    revenue?: number;
    quantity?: number;
    
    // 自定义属性
    [key: string]: any;
  };
  
  // 技术信息
  technical: {
    ip_address: string;                // IP地址
    user_agent: string;                // User Agent
    language: string;                  // 语言
    encoding: string;                  // 编码
    color_depth: number;               // 颜色深度
    java_enabled: boolean;             // Java支持
    cookies_enabled: boolean;          // Cookie支持
  };
  
  // 性能指标
  performance?: {
    page_load_time: number;            // 页面加载时间
    dom_ready_time: number;            // DOM就绪时间
    first_paint_time: number;          // 首次绘制时间
    largest_contentful_paint: number;  // 最大内容绘制
    cumulative_layout_shift: number;   // 累积布局偏移
  };
  
  // 实验信息
  experiments?: Array<{
    experiment_id: string;
    variant_id: string;
    variant_name: string;
  }>;
  
  // 元数据
  metadata: {
    sdk_version?: string;              // SDK版本
    app_version?: string;              // 应用版本
    platform: string;                 // 平台
    environment: 'production' | 'staging' | 'development';
  };
  
  // 数据质量
  data_quality: {
    is_valid: boolean;                 // 数据是否有效
    validation_errors?: string[];      // 验证错误
    confidence_score: number;          // 置信度分数
  };
  
  // 通用字段
  created_at: Date;
  processed_at?: Date;
  is_processed: boolean;
}
```

#### 索引设计
```javascript
// 主要索引
{ event_id: 1 }                      // 唯一索引
{ timestamp: -1 }                    // 时间索引
{ date: 1, hour: 1 }                 // 日期时间索引
{ user_id: 1, timestamp: -1 }        // 用户时间索引
{ session_id: 1 }                    // 会话索引
{ event_type: 1, timestamp: -1 }     // 事件类型时间索引

// 复合索引
{ date: 1, event_type: 1 }           // 日期事件类型
{ user_id: 1, event_type: 1, date: 1 } // 用户事件日期
{ 'properties.product_id': 1, timestamp: -1 } // 商品时间

// 地理位置索引
{ 'location.country': 1, 'location.city': 1 }

// 流量来源索引
{ 'traffic_source.source': 1, 'traffic_source.medium': 1 }
```

### 2. 分析报表表 (AnalyticsReport)

#### 字段设计
```typescript
interface AnalyticsReport {
  // 基础信息
  report_id: string;                   // 报表唯一标识
  name: string;                        // 报表名称
  description?: string;                // 报表描述
  
  // 报表配置
  config: {
    report_type: 'standard' | 'custom' | 'scheduled' | 'real_time';
    category: 'traffic' | 'ecommerce' | 'user_behavior' | 'performance' | 'conversion';
    
    // 数据源
    data_sources: string[];            // 数据源列表
    
    // 时间范围
    time_range: {
      type: 'relative' | 'absolute';
      start_date?: Date;
      end_date?: Date;
      relative_period?: string;        // 'last_7_days', 'last_30_days', etc.
    };
    
    // 维度和指标
    dimensions: Array<{
      name: string;
      display_name: string;
      data_type: 'string' | 'number' | 'date' | 'boolean';
      aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
    }>;
    
    metrics: Array<{
      name: string;
      display_name: string;
      calculation: string;             // 计算公式
      format: 'number' | 'percentage' | 'currency' | 'duration';
      precision?: number;
    }>;
    
    // 过滤条件
    filters: Array<{
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in';
      value: any;
      logic?: 'and' | 'or';
    }>;
    
    // 排序
    sorting: Array<{
      field: string;
      direction: 'asc' | 'desc';
    }>;
    
    // 分组
    grouping?: {
      fields: string[];
      time_granularity?: 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
    };
    
    // 限制
    limits: {
      max_rows?: number;
      max_columns?: number;
      timeout?: number;                // 查询超时时间（秒）
    };
  };
  
  // 报表数据
  data: {
    headers: Array<{
      key: string;
      label: string;
      type: 'string' | 'number' | 'date' | 'boolean';
      format?: string;
    }>;
    
    rows: Array<{
      [key: string]: any;
    }>;
    
    summary?: {
      total_rows: number;
      aggregations: {
        [metric: string]: number;
      };
    };
    
    // 数据质量信息
    quality: {
      completeness: number;            // 数据完整性 (0-1)
      accuracy: number;                // 数据准确性 (0-1)
      freshness: Date;                 // 数据新鲜度
      sample_rate?: number;            // 采样率
    };
  };
  
  // 可视化配置
  visualization: {
    chart_type: 'table' | 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'heatmap' | 'funnel';
    
    // 图表配置
    chart_config: {
      title?: string;
      subtitle?: string;
      x_axis?: {
        label: string;
        type: 'category' | 'datetime' | 'numeric';
      };
      y_axis?: {
        label: string;
        type: 'linear' | 'logarithmic';
        min?: number;
        max?: number;
      };
      
      // 颜色和样式
      colors?: string[];
      theme?: 'light' | 'dark';
      
      // 交互配置
      interactive: boolean;
      drill_down?: {
        enabled: boolean;
        levels: string[];
      };
    };
    
    // 导出配置
    export_options: {
      formats: ('pdf' | 'excel' | 'csv' | 'json')[];
      include_charts: boolean;
      include_raw_data: boolean;
    };
  };
  
  // 调度配置
  schedule?: {
    enabled: boolean;
    frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
    time: string;                      // HH:MM格式
    timezone: string;
    
    // 发送配置
    delivery: {
      method: 'email' | 'webhook' | 'dashboard';
      recipients?: string[];           // 邮件接收者
      webhook_url?: string;            // Webhook URL
    };
    
    // 下次执行时间
    next_run_at?: Date;
    last_run_at?: Date;
  };
  
  // 权限控制
  access_control: {
    owner_id: ObjectId;
    visibility: 'private' | 'shared' | 'public';
    
    // 共享设置
    shared_with: Array<{
      user_id: ObjectId;
      permission: 'view' | 'edit' | 'admin';
      granted_at: Date;
      granted_by: ObjectId;
    }>;
    
    // 部门权限
    department_access?: Array<{
      department_id: string;
      permission: 'view' | 'edit';
    }>;
  };
  
  // 执行历史
  execution_history: Array<{
    execution_id: string;
    started_at: Date;
    completed_at?: Date;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    
    // 性能指标
    performance: {
      execution_time: number;          // 执行时间（毫秒）
      rows_processed: number;          // 处理行数
      memory_usage: number;            // 内存使用（MB）
      cpu_usage: number;               // CPU使用率
    };
    
    // 错误信息
    error?: {
      code: string;
      message: string;
      stack?: string;
    };
    
    // 结果统计
    result_stats?: {
      total_rows: number;
      total_columns: number;
      file_size?: number;              // 导出文件大小（字节）
    };
  }>;
  
  // 标签和分类
  tags: string[];
  category: string;
  
  // 状态
  status: 'draft' | 'active' | 'archived' | 'deprecated';
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  created_by: ObjectId;
  updated_by: ObjectId;
}
```

#### 索引设计
```javascript
// 主要索引
{ report_id: 1 }                     // 唯一索引
{ 'access_control.owner_id': 1 }     // 所有者索引
{ status: 1, updated_at: -1 }        // 状态更新时间索引
{ category: 1, created_at: -1 }      // 分类创建时间索引

// 调度索引
{ 'schedule.enabled': 1, 'schedule.next_run_at': 1 }

// 权限索引
{ 'access_control.shared_with.user_id': 1 }
{ 'access_control.visibility': 1 }

// 标签索引
{ tags: 1 }
```

### 3. 洞察发现表 (AnalyticsInsight)

#### 字段设计
```typescript
interface AnalyticsInsight {
  // 基础信息
  insight_id: string;                  // 洞察唯一标识
  title: string;                       // 洞察标题
  description: string;                 // 洞察描述
  
  // 洞察类型
  type: 'anomaly' | 'trend' | 'correlation' | 'prediction' | 'recommendation' | 'alert';
  category: 'performance' | 'user_behavior' | 'revenue' | 'marketing' | 'product' | 'operational';
  
  // 严重程度
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;                  // 置信度 (0-1)
  
  // 数据源
  data_source: {
    source_type: 'events' | 'reports' | 'external_api';
    source_id?: string;
    time_range: {
      start_date: Date;
      end_date: Date;
    };
    
    // 数据统计
    data_points: number;
    sample_size: number;
  };
  
  // 洞察内容
  content: {
    // 主要发现
    key_findings: Array<{
      finding: string;
      impact: 'positive' | 'negative' | 'neutral';
      magnitude: number;               // 影响程度
      evidence: {
        metric: string;
        current_value: number;
        previous_value?: number;
        change_percentage?: number;
        statistical_significance?: number;
      };
    }>;
    
    // 支持数据
    supporting_data: {
      charts: Array<{
        chart_id: string;
        chart_type: string;
        data_url: string;
        description: string;
      }>;
      
      tables: Array<{
        table_id: string;
        headers: string[];
        rows: any[][];
        description: string;
      }>;
      
      metrics: Array<{
        name: string;
        value: number;
        unit: string;
        comparison?: {
          baseline: number;
          change: number;
          change_type: 'absolute' | 'percentage';
        };
      }>;
    };
    
    // 根因分析
    root_cause_analysis?: {
      primary_causes: Array<{
        cause: string;
        probability: number;
        impact_score: number;
      }>;
      
      contributing_factors: Array<{
        factor: string;
        correlation: number;
        significance: number;
      }>;
    };
    
    // 预测信息
    predictions?: Array<{
      metric: string;
      predicted_value: number;
      prediction_date: Date;
      confidence_interval: {
        lower: number;
        upper: number;
      };
      methodology: string;
    }>;
  };
  
  // 建议行动
  recommendations: Array<{
    recommendation_id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    
    // 预期影响
    expected_impact: {
      metric: string;
      estimated_improvement: number;
      confidence: number;
      timeframe: string;
    };
    
    // 实施信息
    implementation: {
      effort_level: 'low' | 'medium' | 'high';
      estimated_cost?: number;
      required_resources: string[];
      timeline: string;
      
      // 实施步骤
      steps: Array<{
        step_number: number;
        description: string;
        estimated_duration: string;
        dependencies?: string[];
      }>;
    };
    
    // 风险评估
    risks: Array<{
      risk: string;
      probability: number;
      impact: number;
      mitigation: string;
    }>;
    
    // 跟踪状态
    status: 'pending' | 'in_progress' | 'completed' | 'rejected' | 'on_hold';
    assigned_to?: ObjectId;
    due_date?: Date;
  }>;
  
  // 算法信息
  algorithm: {
    name: string;
    version: string;
    parameters: {
      [key: string]: any;
    };
    
    // 模型性能
    performance_metrics?: {
      accuracy?: number;
      precision?: number;
      recall?: number;
      f1_score?: number;
      auc_roc?: number;
    };
    
    // 训练信息
    training_info?: {
      training_date: Date;
      training_data_size: number;
      validation_score: number;
      feature_importance?: Array<{
        feature: string;
        importance: number;
      }>;
    };
  };
  
  // 业务影响
  business_impact: {
    // 财务影响
    financial_impact?: {
      revenue_impact: number;
      cost_impact: number;
      roi_estimate: number;
      currency: string;
    };
    
    // 运营影响
    operational_impact?: {
      efficiency_gain: number;
      time_savings: number;
      resource_optimization: number;
    };
    
    // 客户影响
    customer_impact?: {
      satisfaction_change: number;
      retention_impact: number;
      acquisition_impact: number;
    };
    
    // 影响范围
    affected_areas: string[];
    stakeholders: string[];
  };
  
  // 验证信息
  validation: {
    is_validated: boolean;
    validated_by?: ObjectId;
    validated_at?: Date;
    
    // 验证方法
    validation_method?: string;
    validation_results?: {
      accuracy: number;
      false_positive_rate: number;
      false_negative_rate: number;
    };
    
    // 反馈
    feedback?: Array<{
      user_id: ObjectId;
      rating: number;              // 1-5星评分
      comment?: string;
      feedback_date: Date;
    }>;
  };
  
  // 生命周期
  lifecycle: {
    status: 'active' | 'resolved' | 'dismissed' | 'expired';
    
    // 解决信息
    resolution?: {
      resolved_by: ObjectId;
      resolved_at: Date;
      resolution_method: string;
      outcome: string;
    };
    
    // 跟进计划
    follow_up?: {
      next_review_date: Date;
      review_frequency: string;
      monitoring_metrics: string[];
    };
  };
  
  // 通知设置
  notifications: {
    // 通知对象
    notify_users: ObjectId[];
    notify_roles: string[];
    
    // 通知方式
    notification_methods: ('email' | 'sms' | 'push' | 'slack')[];
    
    // 通知条件
    notification_triggers: Array<{
      condition: string;
      threshold: number;
      frequency: string;
    }>;
  };
  
  // 标签和分类
  tags: string[];
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  expires_at?: Date;
  created_by: ObjectId;
}
```

#### 索引设计
```javascript
// 主要索引
{ insight_id: 1 }                    // 唯一索引
{ type: 1, severity: 1, created_at: -1 } // 类型严重程度时间索引
{ category: 1, 'lifecycle.status': 1 } // 分类状态索引
{ confidence: -1, created_at: -1 }   // 置信度时间索引

// 业务索引
{ 'business_impact.financial_impact.revenue_impact': -1 }
{ 'algorithm.name': 1, 'algorithm.version': 1 }

// 生命周期索引
{ 'lifecycle.status': 1, expires_at: 1 }
{ 'notifications.notify_users': 1 }

// 标签索引
{ tags: 1 }
```

## 数据关系

### 实体关系图
```
AnalyticsEvent ──┐
                 ├─→ AnalyticsReport
                 └─→ AnalyticsInsight

User ──→ AnalyticsReport (owner)
User ──→ AnalyticsInsight (creator)

Product ──→ AnalyticsEvent (properties)
Order ──→ AnalyticsEvent (properties)
Category ──→ AnalyticsEvent (properties)
```

### 数据流向
1. **事件收集**: 用户行为 → AnalyticsEvent
2. **报表生成**: AnalyticsEvent → AnalyticsReport
3. **洞察发现**: AnalyticsEvent + AnalyticsReport → AnalyticsInsight
4. **行动跟踪**: AnalyticsInsight → 业务改进

## 查询优化

### 1. 分区策略
- **时间分区**: 按月或季度分区AnalyticsEvent表
- **类型分区**: 按event_type分区热点数据
- **地理分区**: 按country分区全球数据

### 2. 聚合表设计
```javascript
// 日度聚合表
DailyAnalyticsSummary {
  date: Date,
  event_type: String,
  country: String,
  device_type: String,
  
  // 聚合指标
  total_events: Number,
  unique_users: Number,
  total_sessions: Number,
  avg_session_duration: Number,
  bounce_rate: Number,
  conversion_rate: Number,
  revenue: Number
}

// 小时聚合表
HourlyAnalyticsSummary {
  datetime: Date,
  event_type: String,
  
  // 实时指标
  events_count: Number,
  active_users: Number,
  page_views: Number,
  unique_page_views: Number
}
```

### 3. 缓存策略
- **Redis缓存**: 热点报表数据缓存1小时
- **CDN缓存**: 静态报表图片缓存24小时
- **应用缓存**: 洞察推荐缓存30分钟

## 业务规则

### 1. 数据收集规则
- 事件数据实时收集，批量处理
- 用户隐私数据脱敏处理
- 异常数据自动过滤和标记
- 数据采样率根据流量动态调整

### 2. 报表生成规则
- 标准报表每日自动生成
- 自定义报表按需生成
- 大数据量报表异步处理
- 报表数据保留期限根据类型设定

### 3. 洞察发现规则
- 异常检测算法每小时运行
- 趋势分析每日更新
- 预测模型每周重训练
- 洞察有效期根据类型和置信度设定

### 4. 权限控制规则
- 数据访问基于角色权限
- 敏感数据需要额外授权
- 报表共享需要所有者同意
- 洞察推送基于订阅设置

## 性能优化

### 1. 写入优化
- 批量写入事件数据
- 异步处理非关键数据
- 使用消息队列缓冲高峰流量
- 数据压缩减少存储空间

### 2. 查询优化
- 预计算常用聚合指标
- 使用物化视图加速复杂查询
- 查询结果缓存
- 分页查询大结果集

### 3. 存储优化
- 冷热数据分离存储
- 历史数据归档压缩
- 索引优化减少查询时间
- 数据生命周期管理

## 扩展性设计

### 1. 水平扩展
- 支持分片部署
- 读写分离架构
- 负载均衡策略
- 弹性伸缩能力

### 2. 功能扩展
- 插件化算法框架
- 自定义指标支持
- 第三方数据源集成
- API开放平台

### 3. 技术栈扩展
- 支持多种数据库
- 兼容不同分析引擎
- 云原生部署
- 微服务架构