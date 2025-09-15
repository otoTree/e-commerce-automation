# 电商AI助手系统 API 设计文档

## 1. 概述

本文档定义了电商AI助手系统的前后端API接口规范，包括认证授权、商品管理、任务管理、用户管理等核心功能模块的API设计。

### 1.1 基础信息

- **API版本**: v1
- **基础URL**: `https://api.ecommerce-ai.com/v1`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 通用响应格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    request_id: string;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
```

## 2. 认证授权

### 2.1 用户注册

```http
POST /auth/register
```

**请求体**:
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "operator" // optional, default: "operator"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "operator",
      "created_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_string"
  }
}
```

### 2.2 用户登录

```http
POST /auth/login
```

**请求体**:
```json
{
  "email": "string",
  "password": "string"
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "email": "string",
      "role": "operator",
      "last_login": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_string",
    "expires_at": "2024-01-08T00:00:00Z"
  }
}
```

### 2.3 刷新Token

```http
POST /auth/refresh
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "new_jwt_token_string",
    "expires_at": "2024-01-08T00:00:00Z"
  }
}
```

### 2.4 用户登出

```http
POST /auth/logout
```

**请求头**:
```
Authorization: Bearer <token>
```

## 3. 用户管理

### 3.1 获取当前用户信息

```http
GET /users/me
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "operator",
    "preferences": {
      "language": "zh-CN",
      "timezone": "Asia/Shanghai",
      "notification_settings": {
        "email_notifications": true,
        "push_notifications": false
      }
    },
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-01T00:00:00Z"
  }
}
```

### 3.2 更新用户信息

```http
PUT /users/me
```

**请求体**:
```json
{
  "username": "string", // optional
  "preferences": {
    "language": "zh-CN",
    "timezone": "Asia/Shanghai",
    "notification_settings": {
      "email_notifications": true,
      "push_notifications": false
    }
  }
}
```

### 3.3 修改密码

```http
PUT /users/me/password
```

**请求体**:
```json
{
  "current_password": "string",
  "new_password": "string"
}
```

## 4. 商品管理

### 4.1 获取商品列表

```http
GET /products
```

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20, 最大: 100)
- `status`: 商品状态筛选
- `source_platform`: 来源平台筛选
- `min_price`: 最低价格
- `max_price`: 最高价格
- `search`: 搜索关键词
- `sort_by`: 排序字段 (created_at, price, ai_score)
- `sort_order`: 排序方向 (asc, desc)

**响应**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "source_url": "string",
        "source_platform": "1688",
        "images": [
          {
            "id": "string",
            "url": "string",
            "alt_text": "string",
            "is_primary": true
          }
        ],
        "price": {
          "original_price": 100.00,
          "wholesale_price": 80.00,
          "suggested_retail_price": 150.00,
          "currency": "CNY"
        },
        "supplier": {
          "name": "string",
          "rating": 4.5,
          "location": "string"
        },
        "ai_analysis": {
          "quality_score": 85,
          "profit_potential": 75,
          "confidence_level": 90
        },
        "status": "approved",
        "created_at": "2024-01-01T00:00:00Z",
        "analyzed_at": "2024-01-01T00:05:00Z"
      }
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 4.2 获取商品详情

```http
GET /products/{productId}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "title": "string",
    "description": "string",
    "source_url": "string",
    "source_platform": "1688",
    "images": [...],
    "price": {
      "original_price": 100.00,
      "wholesale_price": 80.00,
      "suggested_retail_price": 150.00,
      "currency": "CNY",
      "price_tiers": [
        {
          "min_quantity": 1,
          "max_quantity": 99,
          "unit_price": 100.00
        },
        {
          "min_quantity": 100,
          "unit_price": 90.00
        }
      ]
    },
    "supplier": {
      "id": "string",
      "name": "string",
      "rating": 4.5,
      "location": "string",
      "contact": {
        "phone": "string",
        "email": "string"
      },
      "verification_status": "verified"
    },
    "specifications": [
      {
        "name": "颜色",
        "value": "红色",
        "unit": null
      },
      {
        "name": "尺寸",
        "value": "30x20x10",
        "unit": "cm"
      }
    ],
    "logistics": {
      "shipping_cost": 15.00,
      "shipping_time": "3-7天",
      "weight": 0.5,
      "dimensions": {
        "length": 30,
        "width": 20,
        "height": 10,
        "unit": "cm"
      }
    },
    "market_analysis": {
      "competition_level": "medium",
      "demand_trend": "rising",
      "profit_margin": 45.5,
      "market_size": 1000000
    },
    "ai_analysis": {
      "quality_score": 85,
      "profit_potential": 75,
      "risk_assessment": {
        "overall_risk": "low",
        "factors": [
          "供应商信誉良好",
          "市场需求稳定"
        ]
      },
      "recommendations": [
        "建议调整售价至180元",
        "可考虑批量采购降低成本"
      ],
      "confidence_level": 90
    },
    "status": "approved",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:05:00Z",
    "analyzed_at": "2024-01-01T00:05:00Z"
  }
}
```

### 4.3 创建商品

```http
POST /products
```

**请求体**:
```json
{
  "source_url": "string",
  "source_platform": "1688",
  "title": "string",
  "description": "string",
  "images": [
    {
      "url": "string",
      "alt_text": "string",
      "is_primary": true
    }
  ],
  "price": {
    "original_price": 100.00,
    "wholesale_price": 80.00,
    "currency": "CNY"
  },
  "supplier": {
    "name": "string",
    "rating": 4.5,
    "location": "string"
  },
  "specifications": [
    {
      "name": "颜色",
      "value": "红色"
    }
  ]
}
```

### 4.4 更新商品

```http
PUT /products/{productId}
```

**请求体**: 同创建商品，所有字段可选

### 4.5 删除商品

```http
DELETE /products/{productId}
```

### 4.6 批量操作商品

```http
POST /products/batch
```

**请求体**:
```json
{
  "action": "approve" | "reject" | "delete" | "analyze",
  "product_ids": ["string"],
  "params": {} // 可选的操作参数
}
```

### 4.7 请求AI分析

```http
POST /products/{productId}/analyze
```

**请求体**:
```json
{
  "force_reanalyze": false // 是否强制重新分析
}
```

## 5. 商品集合管理

### 5.1 获取商品集合列表

```http
GET /collections
```

**查询参数**:
- `page`, `limit`: 分页参数
- `search`: 搜索关键词

### 5.2 创建商品集合

```http
POST /collections
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "product_ids": ["string"],
  "filters": [
    {
      "field": "price.original_price",
      "operator": "gt",
      "value": 100
    }
  ]
}
```

### 5.3 更新商品集合

```http
PUT /collections/{collectionId}
```

### 5.4 删除商品集合

```http
DELETE /collections/{collectionId}
```

### 5.5 添加商品到集合

```http
POST /collections/{collectionId}/products
```

**请求体**:
```json
{
  "product_ids": ["string"]
}
```

### 5.6 从集合移除商品

```http
DELETE /collections/{collectionId}/products
```

**请求体**:
```json
{
  "product_ids": ["string"]
}
```

## 6. 运营任务管理

### 6.1 获取任务列表

```http
GET /tasks
```

**查询参数**:
- `page`, `limit`: 分页参数
- `status`: 任务状态筛选
- `type`: 任务类型筛选
- `priority`: 优先级筛选
- `assigned_to`: 分配给用户筛选
- `product_id`: 关联商品筛选

**响应**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "string",
        "product_id": "string",
        "type": "content_optimization",
        "status": "pending",
        "priority": "medium",
        "assigned_to": "string",
        "title": "优化商品标题和描述",
        "description": "string",
        "progress": 0,
        "scheduled_at": "2024-01-02T00:00:00Z",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z"
      }
    ]
  }
}
```

### 6.2 获取任务详情

```http
GET /tasks/{taskId}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "product_id": "string",
    "type": "content_optimization",
    "status": "in_progress",
    "priority": "medium",
    "assigned_to": "string",
    "title": "优化商品标题和描述",
    "description": "string",
    "content": {
      "original_content": [
        {
          "type": "title",
          "content": "原始标题",
          "metadata": {}
        },
        {
          "type": "description",
          "content": "原始描述",
          "metadata": {}
        }
      ],
      "optimized_content": [
        {
          "type": "title",
          "content": "优化后标题",
          "metadata": {
            "seo_score": 85
          }
        }
      ],
      "translations": [
        {
          "language": "en",
          "content": [
            {
              "type": "title",
              "content": "Optimized Title",
              "metadata": {}
            }
          ],
          "quality_score": 90,
          "reviewed": false
        }
      ],
      "target_platforms": [
        {
          "platform": "ozon",
          "config": {
            "category_id": "12345",
            "attributes": {}
          }
        }
      ]
    },
    "ai_suggestions": [
      {
        "id": "string",
        "type": "content_improvement",
        "suggestion": "建议在标题中加入关键词",
        "confidence": 85,
        "applied": false,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "execution_log": [
      {
        "id": "string",
        "action": "AI内容优化",
        "status": "success",
        "message": "成功生成优化内容",
        "timestamp": "2024-01-01T00:05:00Z"
      }
    ],
    "progress": 60,
    "scheduled_at": "2024-01-02T00:00:00Z",
    "started_at": "2024-01-01T08:00:00Z",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T08:30:00Z"
  }
}
```

### 6.3 创建任务

```http
POST /tasks
```

**请求体**:
```json
{
  "product_id": "string",
  "type": "content_optimization",
  "priority": "medium",
  "assigned_to": "string", // optional
  "title": "string",
  "description": "string",
  "scheduled_at": "2024-01-02T00:00:00Z", // optional
  "content": {
    "target_platforms": [
      {
        "platform": "ozon",
        "config": {}
      }
    ]
  }
}
```

### 6.4 更新任务

```http
PUT /tasks/{taskId}
```

**请求体**: 同创建任务，所有字段可选

### 6.5 更新任务状态

```http
PUT /tasks/{taskId}/status
```

**请求体**:
```json
{
  "status": "in_progress" | "completed" | "failed" | "cancelled",
  "message": "string" // optional
}
```

### 6.6 分配任务

```http
PUT /tasks/{taskId}/assign
```

**请求体**:
```json
{
  "assigned_to": "string"
}
```

### 6.7 请求AI建议

```http
POST /tasks/{taskId}/ai-suggestions
```

**请求体**:
```json
{
  "type": "content_improvement" | "seo_optimization" | "translation_fix",
  "context": {} // 可选的上下文信息
}
```

### 6.8 应用AI建议

```http
POST /tasks/{taskId}/ai-suggestions/{suggestionId}/apply
```

### 6.9 更新任务内容

```http
PUT /tasks/{taskId}/content
```

**请求体**:
```json
{
  "optimized_content": [
    {
      "type": "title",
      "content": "新的优化标题",
      "metadata": {}
    }
  ]
}
```

### 6.10 翻译内容

```http
POST /tasks/{taskId}/translate
```

**请求体**:
```json
{
  "target_languages": ["en", "ru", "es"],
  "content_types": ["title", "description"] // optional
}
```

### 6.11 上传到平台

```http
POST /tasks/{taskId}/upload
```

**请求体**:
```json
{
  "platforms": ["ozon"],
  "dry_run": false // 是否为测试运行
}
```

## 7. 营销活动管理

### 7.1 获取活动列表

```http
GET /campaigns
```

### 7.2 创建营销活动

```http
POST /campaigns
```

**请求体**:
```json
{
  "name": "string",
  "description": "string",
  "type": "promotion",
  "product_ids": ["string"],
  "target_platforms": ["ozon"],
  "schedule": {
    "start_date": "2024-01-01T00:00:00Z",
    "end_date": "2024-01-31T23:59:59Z",
    "timezone": "Asia/Shanghai"
  },
  "content_templates": [
    {
      "platform": "ozon",
      "template_type": "title",
      "template_content": "{{product_name}} - 限时优惠 {{discount}}% OFF",
      "variables": [
        {
          "name": "discount",
          "type": "number",
          "default_value": 20
        }
      ]
    }
  ]
}
```

## 8. 系统配置

### 8.1 获取系统配置

```http
GET /system/config
```

**查询参数**:
- `category`: 配置分类筛选

### 8.2 更新系统配置

```http
PUT /system/config/{configId}
```

**请求体**:
```json
{
  "value": "any",
  "description": "string"
}
```

## 9. 文件上传

### 9.1 上传文件

```http
POST /files/upload
```

**请求体**: `multipart/form-data`
- `file`: 文件
- `type`: 文件类型 (image, document, etc.)
- `category`: 文件分类 (product_image, avatar, etc.)

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "string",
    "filename": "string",
    "original_name": "string",
    "mime_type": "string",
    "size": 1024,
    "url": "string",
    "thumbnail_url": "string", // 图片文件才有
    "uploaded_at": "2024-01-01T00:00:00Z"
  }
}
```

### 9.2 删除文件

```http
DELETE /files/{fileId}
```

## 10. 统计分析

### 10.1 获取仪表板统计

```http
GET /analytics/dashboard
```

**查询参数**:
- `period`: 时间周期 (today, week, month, quarter, year)
- `start_date`, `end_date`: 自定义时间范围

**响应**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_products": 1250,
      "active_tasks": 45,
      "completed_tasks_today": 12,
      "revenue": 125000.00
    },
    "trends": {
      "products_added": {
        "current": 150,
        "previous": 120,
        "change_percent": 25.0
      },
      "tasks_completed": {
        "current": 89,
        "previous": 76,
        "change_percent": 17.1
      }
    },
    "charts": {
      "products_by_status": [
        {
          "status": "approved",
          "count": 800
        },
        {
          "status": "pending",
          "count": 300
        }
      ],
      "tasks_by_type": [
        {
          "type": "content_optimization",
          "count": 25
        },
        {
          "type": "translation",
          "count": 15
        }
      ]
    }
  }
}
```

### 10.2 获取商品统计

```http
GET /analytics/products
```

### 10.3 获取任务统计

```http
GET /analytics/tasks
```

## 11. 通知管理

### 11.1 获取通知列表

```http
GET /notifications
```

**查询参数**:
- `page`, `limit`: 分页参数
- `read`: 是否已读筛选
- `type`: 通知类型筛选

### 11.2 标记通知为已读

```http
PUT /notifications/{notificationId}/read
```

### 11.3 批量标记已读

```http
PUT /notifications/mark-read
```

**请求体**:
```json
{
  "notification_ids": ["string"] // 可选，不传则标记全部
}
```

## 12. 审计日志

### 12.1 获取审计日志

```http
GET /audit-logs
```

**查询参数**:
- `page`, `limit`: 分页参数
- `user_id`: 用户筛选
- `action`: 操作类型筛选
- `resource_type`: 资源类型筛选
- `start_date`, `end_date`: 时间范围

## 13. 错误码定义

### 13.1 HTTP状态码

- `200`: 成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未认证
- `403`: 权限不足
- `404`: 资源不存在
- `409`: 资源冲突
- `422`: 数据验证失败
- `429`: 请求频率限制
- `500`: 服务器内部错误

### 13.2 业务错误码

```typescript
enum ErrorCode {
  // 认证相关
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  INSUFFICIENT_PERMISSIONS = 'AUTH_004',
  
  // 用户相关
  USER_NOT_FOUND = 'USER_001',
  USER_ALREADY_EXISTS = 'USER_002',
  INVALID_PASSWORD = 'USER_003',
  
  // 商品相关
  PRODUCT_NOT_FOUND = 'PRODUCT_001',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_002',
  INVALID_PRODUCT_DATA = 'PRODUCT_003',
  PRODUCT_ANALYSIS_FAILED = 'PRODUCT_004',
  
  // 任务相关
  TASK_NOT_FOUND = 'TASK_001',
  TASK_INVALID_STATUS = 'TASK_002',
  TASK_ASSIGNMENT_FAILED = 'TASK_003',
  
  // 文件相关
  FILE_TOO_LARGE = 'FILE_001',
  INVALID_FILE_TYPE = 'FILE_002',
  FILE_UPLOAD_FAILED = 'FILE_003',
  
  // 系统相关
  RATE_LIMIT_EXCEEDED = 'SYSTEM_001',
  SERVICE_UNAVAILABLE = 'SYSTEM_002',
  MAINTENANCE_MODE = 'SYSTEM_003'
}
```

## 14. 请求限制

### 14.1 频率限制

- **认证接口**: 5次/分钟
- **普通接口**: 100次/分钟
- **文件上传**: 10次/分钟
- **AI分析**: 20次/分钟

### 14.2 数据限制

- **请求体大小**: 最大 10MB
- **文件上传**: 单文件最大 50MB
- **批量操作**: 最多 100 个项目
- **分页限制**: 每页最多 100 条记录

## 15. 版本控制

### 15.1 API版本策略

- 使用URL路径版本控制: `/v1/`, `/v2/`
- 向后兼容性保证
- 废弃通知机制

### 15.2 版本迁移

当API版本更新时，会提供：
- 迁移指南文档
- 兼容性检查工具
- 渐进式迁移支持

---

本API文档涵盖了电商AI助手系统的所有核心功能接口，为前端开发和第三方集成提供了完整的技术规范。所有接口都遵循RESTful设计原则，支持标准的HTTP方法和状态码，确保了良好的可用性和可维护性。