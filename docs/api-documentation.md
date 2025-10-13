# API 文档

## 基础信息

- **Base URL**: `http://localhost:3001/api`
- **Content-Type**: `application/json`
- **认证方式**: JWT Token (Bearer)

## 通用响应格式

### 成功响应
```json
{
  "success": true,
  "data": {
    // 响应数据
  },
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE",
  "details": {
    // 详细错误信息
  }
}
```

## 健康检查

### GET /health
检查服务器状态

**响应示例**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "version": "1.0.0"
  }
}
```

## 商品分析

### POST /analyze
分析商品信息

**请求体**:
```json
{
  "url": "https://example.com/product/123",
  "title": "商品标题",
  "price": 99.99,
  "platform": "taobao",
  "images": ["https://example.com/image1.jpg"],
  "description": "商品描述"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
    "analysis": {
      "priceScore": 85,
      "qualityScore": 78,
      "popularityScore": 92,
      "overallScore": 85
    },
    "insights": [
      "价格相比同类商品偏高",
      "用户评价整体较好",
      "销量表现优秀"
    ],
    "recommendations": [
      "建议关注价格变化",
      "可以考虑等待促销活动"
    ]
  }
}
```

**错误码**:
- `INVALID_URL`: 无效的商品URL
- `ANALYSIS_FAILED`: 分析失败
- `RATE_LIMIT_EXCEEDED`: 请求频率超限

## 价格比较

### POST /price-compare
跨平台价格比较

**请求体**:
```json
{
  "productInfo": {
    "title": "商品标题",
    "brand": "品牌名称",
    "model": "型号"
  },
  "platforms": ["taobao", "jd", "amazon"]
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "comparisons": [
      {
        "platform": "taobao",
        "price": 99.99,
        "currency": "CNY",
        "url": "https://taobao.com/item/123",
        "seller": "官方旗舰店",
        "rating": 4.8,
        "sales": 1000
      },
      {
        "platform": "jd",
        "price": 105.00,
        "currency": "CNY",
        "url": "https://jd.com/product/456",
        "seller": "京东自营",
        "rating": 4.9,
        "sales": 800
      }
    ],
    "bestDeal": {
      "platform": "taobao",
      "savings": 5.01,
      "savingsPercentage": 4.8
    },
    "priceRange": {
      "min": 99.99,
      "max": 105.00,
      "average": 102.50
    }
  }
}
```

## 评价摘要

### POST /reviews-summary
生成商品评价摘要

**请求体**:
```json
{
  "productUrl": "https://example.com/product/123",
  "maxReviews": 100
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalReviews": 156,
      "averageRating": 4.3,
      "ratingDistribution": {
        "5": 45,
        "4": 62,
        "3": 28,
        "2": 15,
        "1": 6
      }
    },
    "sentiment": {
      "positive": 68.5,
      "neutral": 20.5,
      "negative": 11.0
    },
    "keyInsights": [
      "用户普遍认为性价比高",
      "物流速度获得好评",
      "部分用户反映包装需要改进"
    ],
    "prosAndCons": {
      "pros": [
        "价格实惠",
        "质量不错",
        "发货快"
      ],
      "cons": [
        "包装简陋",
        "客服响应慢"
      ]
    },
    "topKeywords": [
      { "word": "性价比", "count": 23 },
      { "word": "质量", "count": 18 },
      { "word": "物流", "count": 15 }
    ]
  }
}
```

## 商品管理

### GET /products
获取商品列表

**查询参数**:
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `category`: 商品分类
- `platform`: 平台筛选
- `sort`: 排序方式 (price_asc, price_desc, created_at)

**响应示例**:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "64f1a2b3c4d5e6f7g8h9i0j1",
        "title": "商品标题",
        "price": 99.99,
        "platform": "taobao",
        "category": "electronics",
        "images": ["https://example.com/image1.jpg"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /products/:id
获取单个商品详情

**路径参数**:
- `id`: 商品ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "title": "商品标题",
    "price": 99.99,
    "originalPrice": 129.99,
    "discount": 23.1,
    "platform": "taobao",
    "category": "electronics",
    "brand": "品牌名称",
    "model": "型号",
    "images": ["https://example.com/image1.jpg"],
    "description": "详细描述",
    "specifications": {
      "color": "黑色",
      "size": "M",
      "weight": "500g"
    },
    "seller": {
      "name": "官方旗舰店",
      "rating": 4.8,
      "location": "上海"
    },
    "stats": {
      "views": 1500,
      "sales": 300,
      "favorites": 45
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /products
创建商品记录

**请求体**:
```json
{
  "title": "商品标题",
  "price": 99.99,
  "platform": "taobao",
  "category": "electronics",
  "url": "https://example.com/product/123",
  "images": ["https://example.com/image1.jpg"],
  "description": "商品描述"
}
```

### PUT /products/:id
更新商品信息

**请求体**: 同创建商品，所有字段可选

### DELETE /products/:id
删除商品记录

## 用户管理

### POST /auth/register
用户注册

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名"
}
```

### POST /auth/login
用户登录

**请求体**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "email": "user@example.com",
      "name": "用户名",
      "avatar": "https://example.com/avatar.jpg"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### GET /auth/profile
获取用户信息 (需要认证)

**请求头**:
```
Authorization: Bearer <token>
```

### PUT /auth/profile
更新用户信息 (需要认证)

## 历史记录

### GET /history/analysis
获取分析历史

**查询参数**:
- `page`: 页码
- `limit`: 每页数量
- `startDate`: 开始日期
- `endDate`: 结束日期

### GET /history/price-tracking
获取价格追踪历史

### POST /history/price-tracking
添加价格追踪

**请求体**:
```json
{
  "productId": "64f1a2b3c4d5e6f7g8h9i0j1",
  "targetPrice": 89.99,
  "notifyEmail": true
}
```

## 错误码说明

| 错误码 | HTTP状态码 | 说明 |
|--------|------------|------|
| VALIDATION_ERROR | 400 | 请求参数验证失败 |
| UNAUTHORIZED | 401 | 未授权访问 |
| FORBIDDEN | 403 | 权限不足 |
| NOT_FOUND | 404 | 资源不存在 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务暂不可用 |

## 请求限制

- 每个IP每分钟最多100次请求
- 分析接口每个用户每小时最多50次请求
- 价格比较接口每个用户每小时最多30次请求

## SDK 示例

### JavaScript/Node.js
```javascript
const EcommerceAI = require('ecommerce-ai-sdk')

const client = new EcommerceAI({
  baseURL: 'http://localhost:3001/api',
  apiKey: 'your-api-key'
})

// 分析商品
const analysis = await client.analyze({
  url: 'https://example.com/product/123',
  title: '商品标题',
  price: 99.99
})

// 价格比较
const comparison = await client.priceCompare({
  productInfo: { title: '商品标题' },
  platforms: ['taobao', 'jd']
})
```

### Python
```python
from ecommerce_ai import EcommerceAI

client = EcommerceAI(
    base_url='http://localhost:3001/api',
    api_key='your-api-key'
)

# 分析商品
analysis = client.analyze({
    'url': 'https://example.com/product/123',
    'title': '商品标题',
    'price': 99.99
})

# 价格比较
comparison = client.price_compare({
    'product_info': {'title': '商品标题'},
    'platforms': ['taobao', 'jd']
})
```

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 支持商品分析、价格比较、评价摘要功能
- 提供用户认证和历史记录管理

---

如有疑问，请联系开发团队或查看项目文档。