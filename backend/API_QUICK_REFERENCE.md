# E-commerce AI Backend API 快速参考

## 基础信息
- **基础URL**: `http://localhost:3001/api`
- **内容类型**: `application/json`

## 快速导航

| 模块 | 前缀 | 描述 |
|------|------|------|
| [系统基础](#系统基础) | `/api` | API信息和健康检查 |
| [用户认证](#用户认证) | `/api/auth` | 用户注册、登录、认证 |
| [数据收集](#数据收集) | `/api/data-collection` | HTML提交、解析、爬虫任务 |
| [数据分析](#数据分析) | `/api/analysis` | 商品分析、批量分析 |
| [任务监控](#任务监控) | `/api/tasks` | 任务管理、状态监控 |
| [商品管理](#商品管理) | `/api/products` | 商品CRUD操作 |
| [商品上架](#商品上架) | `/api/listings` | 商品上架管理 |
| [扩展管理](#扩展管理) | `/api/extension` | 浏览器扩展交互 |

---

## 系统基础

| 方法 | 端点 | 描述 |
|------|------|------|
| `GET` | `/api/` | 获取API信息 |
| `GET` | `/api/health` | 健康检查 |

---

## 用户认证

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `POST` | `/api/auth/register` | 用户注册 | ❌ |
| `POST` | `/api/auth/login` | 用户登录 | ❌ |
| `GET` | `/api/auth/profile` | 获取用户信息 | ✅ |

---

## 数据收集

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `POST` | `/api/data-collection/submit-html` | 提交HTML内容 | ❌ |
| `POST` | `/api/data-collection/crawl-url` | 创建爬虫任务 | ❌ |
| `POST` | `/api/data-collection/parse-html` | 解析HTML内容 | ❌ |
| `POST` | `/api/data-collection/process-search-data` | 处理搜索页数据 | ❌ |

### 核心参数

**提交HTML** (`submit-html`):
```json
{
  "url": "string (必填)",
  "html_content": "string (必填)",
  "platform": "string (可选)",
  "page_type": "string (可选)"
}
```

**解析HTML** (`parse-html`):
```json
{
  "html_storage_id": "string (必填)",
  "force_reparse": "boolean (可选)"
}
```

---

## 数据分析

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `POST` | `/api/analysis/products/:productId/analyze` | 分析单个商品 | ❌ |
| `GET` | `/api/analysis/products/:productId/analysis` | 获取分析结果 | ❌ |
| `POST` | `/api/analysis/batch-analyze` | 批量分析商品 | ❌ |
| `POST` | `/api/analysis/batch-results` | 批量获取结果 | ❌ |

### 核心参数

**分析选项**:
```json
{
  "analysis_options": {
    "include_market_heat": "boolean",
    "include_profit_analysis": "boolean", 
    "include_competitiveness": "boolean"
  }
}
```

---

## 任务监控

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/api/tasks` | 获取任务列表 | ❌ |
| `GET` | `/api/tasks/:taskId` | 获取任务详情 | ❌ |
| `PUT` | `/api/tasks/:taskId` | 更新任务状态 | ❌ |
| `DELETE` | `/api/tasks/:taskId` | 删除任务 | ❌ |

### 查询参数

**任务列表** (`/tasks`):
- `status`: pending|running|completed|failed|paused
- `type`: 任务类型
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)
- `sort`: 排序字段 (默认: -meta.created_at)

---

## 商品管理

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/api/products` | 获取商品列表 | ❌ |
| `GET` | `/api/products/:productId` | 获取商品详情 | ❌ |
| `PUT` | `/api/products/:productId` | 更新商品信息 | ❌ |
| `DELETE` | `/api/products/:productId` | 删除商品 | ❌ |
| `DELETE` | `/api/products/batch` | 批量删除商品 | ❌ |

### 查询参数

**商品列表** (`/products`):
- `platform`: 平台筛选
- `category`: 分类筛选
- `min_price`: 最低价格
- `max_price`: 最高价格
- `min_rating`: 最低评分
- `search`: 搜索关键词
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 20)

---

## 商品上架

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/api/listings/analyzed-products` | 获取已分析商品 | ❌ |
| `POST` | `/api/listings` | 创建商品上架 | ❌ |
| `GET` | `/api/listings` | 获取上架列表 | ❌ |
| `GET` | `/api/listings/:listingId` | 获取上架详情 | ❌ |
| `PUT` | `/api/listings/:listingId/status` | 更新上架状态 | ❌ |

### 核心参数

**创建上架** (`/listings`):
```json
{
  "source_product_id": "string (必填)",
  "listing_info": {
    "title": "string",
    "description": "string",
    "category_id": "string",
    "brand": "string",
    "images": ["string"]
  },
  "pricing": {
    "strategy": "cost_plus|market_based|competitive|custom",
    "markup_percentage": "number"
  },
  "inventory": {
    "stock_quantity": "number"
  }
}
```

---

## 扩展管理

| 方法 | 端点 | 描述 | 认证 |
|------|------|------|------|
| `POST` | `/api/extension/register` | 扩展注册 | ❌ |
| `POST` | `/api/extension/heartbeat` | 心跳检测 | ❌ |
| `POST` | `/api/extension/tasks/poll` | 轮询任务 | ❌ |
| `POST` | `/api/extension/tasks` | 创建任务 | ❌ |
| `POST` | `/api/extension/tasks/result` | 提交任务结果 | ❌ |
| `GET` | `/api/extension/status` | 获取扩展状态 | ❌ |
| `POST` | `/api/extension/request-source` | 请求页面源码 | ❌ |
| `GET` | `/api/extension/source-task/:taskId` | 获取源码任务 | ❌ |

### 核心参数

**扩展注册** (`register`):
```json
{
  "extension_id": "string (必填)",
  "browser_info": "object (可选)"
}
```

**创建任务** (`tasks`):
```json
{
  "type": "single_product|batch_products|keyword_search",
  "data": {
    "url": "string (可选)",
    "urls": ["string"],
    "keywords": ["string"],
    "platform": "string (可选)"
  }
}
```

---

## 常用响应格式

### 成功响应
```json
{
  "success": true,
  "data": "响应数据",
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "success": false,
  "error": "错误描述",
  "details": "详细信息 (开发环境)"
}
```

### 分页响应
```json
{
  "success": true,
  "data": ["数据列表"],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

---

## 状态码说明

| 状态码 | 说明 |
|--------|------|
| `200` | 请求成功 |
| `201` | 创建成功 |
| `400` | 请求参数错误 |
| `401` | 未授权访问 |
| `404` | 资源不存在 |
| `409` | 资源冲突 |
| `500` | 内部服务器错误 |

---

## 开发提示

1. **认证**: 大部分端点无需认证，仅用户相关操作需要JWT Token
2. **分页**: 默认每页20条记录，最大100条
3. **排序**: 支持正序(`field`)和倒序(`-field`)
4. **时间**: 使用ISO 8601格式 (`2024-01-01T00:00:00.000Z`)
5. **ID格式**: 使用MongoDB ObjectId格式

---

*快速参考 - 详细文档请查看 [API_ROUTES_DOCUMENTATION.md](./API_ROUTES_DOCUMENTATION.md)*