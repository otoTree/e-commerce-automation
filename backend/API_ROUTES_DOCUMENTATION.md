# E-commerce AI Backend API 路由文档

## 概述

本文档详细描述了 E-commerce AI 后端系统的所有 API 路由端点。所有 API 端点都以 `/api` 为前缀。

## 基础信息

- **基础URL**: `http://localhost:3001/api`
- **内容类型**: `application/json`
- **认证方式**: JWT Token (部分端点需要)

## 路由模块结构

```
/api
├── /                          # API 根路径信息
├── /health                    # 健康检查
├── /auth                      # 用户认证模块
├── /data-collection          # 数据收集模块
├── /analysis                 # 数据分析模块
├── /tasks                    # 任务监控模块
├── /products                 # 商品管理模块
├── /listings                 # 商品上架模块
└── /extension                # 扩展管理模块
```

---

## 1. 系统基础端点

### 1.1 API 根路径信息
- **端点**: `GET /api/`
- **描述**: 获取 API 基本信息和可用端点列表
- **认证**: 无需认证
- **响应**:
```json
{
  "success": true,
  "message": "E-commerce AI API",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "data_collection": "/api/data-collection",
    "analysis": "/api/analysis",
    "tasks": "/api/tasks",
    "products": "/api/products",
    "listings": "/api/listings",
    "extension": "/api/extension"
  }
}
```

### 1.2 健康检查
- **端点**: `GET /api/health`
- **描述**: 检查 API 服务状态
- **认证**: 无需认证
- **响应**:
```json
{
  "success": true,
  "message": "E-commerce AI API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

---

## 2. 用户认证模块 (`/api/auth`)

### 2.1 用户注册
- **端点**: `POST /api/auth/register`
- **描述**: 注册新用户账户
- **认证**: 无需认证
- **请求体**:
```json
{
  "username": "string (必填)",
  "email": "string (必填)",
  "password": "string (必填, 最少6位)",
  "firstName": "string (可选)",
  "lastName": "string (可选)",
  "phone": "string (可选)"
}
```

### 2.2 用户登录
- **端点**: `POST /api/auth/login`
- **描述**: 用户登录获取访问令牌
- **认证**: 无需认证

### 2.3 获取用户信息
- **端点**: `GET /api/auth/profile`
- **描述**: 获取当前用户信息
- **认证**: 需要 JWT Token

---

## 3. 数据收集模块 (`/api/data-collection`)

### 3.1 提交 HTML 内容
- **端点**: `POST /api/data-collection/submit-html`
- **描述**: 提交网页 HTML 内容进行存储和后续解析
- **认证**: 无需认证
- **请求体**:
```json
{
  "url": "string (必填)",
  "html_content": "string (必填)",
  "platform": "string (可选, 默认: 'other')",
  "page_type": "string (可选, 默认: 'auto')",
  "metadata": "object (可选)"
}
```

### 3.2 创建爬虫任务
- **端点**: `POST /api/data-collection/crawl-url`
- **描述**: 创建 URL 爬虫任务
- **认证**: 无需认证
- **请求体**:
```json
{
  "url": "string (必填)",
  "platform": "string (可选, 默认: 'other')",
  "page_type": "string (可选, 默认: 'auto')"
}
```

### 3.3 解析 HTML 内容
- **端点**: `POST /api/data-collection/parse-html`
- **描述**: 解析已存储的 HTML 内容
- **认证**: 无需认证
- **请求体**:
```json
{
  "html_storage_id": "string (必填)",
  "force_reparse": "boolean (可选, 默认: false)"
}
```

### 3.4 处理搜索页数据
- **端点**: `POST /api/data-collection/process-search-data`
- **描述**: 批量处理搜索页数据，提取商品链接并触发商品收集
- **认证**: 无需认证
- **请求体**:
```json
{
  "platform": "string (可选)",
  "limit": "number (可选, 默认: 10)",
  "auto_trigger_product_collection": "boolean (可选, 默认: true)"
}
```

---

## 4. 数据分析模块 (`/api/analysis`)

### 4.1 分析单个商品
- **端点**: `POST /api/analysis/products/:productId/analyze`
- **描述**: 触发单个商品的深度分析
- **认证**: 无需认证
- **路径参数**:
  - `productId`: 商品ID
- **请求体**:
```json
{
  "analysis_options": {
    "include_market_heat": "boolean (可选)",
    "include_profit_analysis": "boolean (可选)",
    "include_competitiveness": "boolean (可选)"
  }
}
```

### 4.2 获取分析结果
- **端点**: `GET /api/analysis/products/:productId/analysis`
- **描述**: 获取商品的分析结果
- **认证**: 无需认证
- **路径参数**:
  - `productId`: 商品ID

### 4.3 批量分析商品
- **端点**: `POST /api/analysis/batch-analyze`
- **描述**: 批量分析多个商品
- **认证**: 无需认证
- **请求体**:
```json
{
  "product_ids": ["string"],
  "analysis_options": {
    "include_market_heat": "boolean (可选)",
    "include_profit_analysis": "boolean (可选)",
    "include_competitiveness": "boolean (可选)"
  }
}
```

### 4.4 批量获取分析结果
- **端点**: `POST /api/analysis/batch-results`
- **描述**: 批量获取多个商品的分析结果
- **认证**: 无需认证
- **请求体**:
```json
{
  "product_ids": ["string"]
}
```

---

## 5. 任务监控模块 (`/api/tasks`)

### 5.1 获取任务列表
- **端点**: `GET /api/tasks`
- **描述**: 获取任务列表，支持筛选和分页
- **认证**: 无需认证
- **查询参数**:
  - `status`: 任务状态 (pending|running|completed|failed|paused)
  - `type`: 任务类型
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 20)
  - `sort`: 排序字段 (默认: -meta.created_at)

### 5.2 获取任务详情
- **端点**: `GET /api/tasks/:taskId`
- **描述**: 获取指定任务的详细信息
- **认证**: 无需认证
- **路径参数**:
  - `taskId`: 任务ID

### 5.3 更新任务状态
- **端点**: `PUT /api/tasks/:taskId`
- **描述**: 更新任务状态或进度
- **认证**: 无需认证
- **路径参数**:
  - `taskId`: 任务ID
- **请求体**:
```json
{
  "status": "string (可选)",
  "progress": "number (可选)"
}
```

### 5.4 删除任务
- **端点**: `DELETE /api/tasks/:taskId`
- **描述**: 删除指定任务
- **认证**: 无需认证
- **路径参数**:
  - `taskId`: 任务ID

---

## 6. 商品管理模块 (`/api/products`)

### 6.1 获取商品列表
- **端点**: `GET /api/products`
- **描述**: 获取商品列表，支持筛选和分页
- **认证**: 无需认证
- **查询参数**:
  - `platform`: 平台筛选
  - `category`: 分类筛选
  - `min_price`: 最低价格
  - `max_price`: 最高价格
  - `min_rating`: 最低评分
  - `search`: 搜索关键词
  - `page`: 页码 (默认: 1)
  - `limit`: 每页数量 (默认: 20)
  - `sort`: 排序字段

### 6.2 获取商品详情
- **端点**: `GET /api/products/:productId`
- **描述**: 获取指定商品的详细信息
- **认证**: 无需认证
- **路径参数**:
  - `productId`: 商品ID

### 6.3 更新商品信息
- **端点**: `PUT /api/products/:productId`
- **描述**: 更新商品信息
- **认证**: 无需认证
- **路径参数**:
  - `productId`: 商品ID

### 6.4 删除商品
- **端点**: `DELETE /api/products/:productId`
- **描述**: 删除指定商品
- **认证**: 无需认证
- **路径参数**:
  - `productId`: 商品ID

### 6.5 批量删除商品
- **端点**: `DELETE /api/products/batch`
- **描述**: 批量删除商品
- **认证**: 无需认证
- **请求体**:
```json
{
  "product_ids": ["string"]
}
```

---

## 7. 商品上架模块 (`/api/listings`)

### 7.1 获取已分析商品
- **端点**: `GET /api/listings/analyzed-products`
- **描述**: 获取已完成分析的商品列表，用于上架选择
- **认证**: 无需认证
- **查询参数**:
  - `platform`: 平台筛选
  - `category`: 分类筛选
  - `min_score`: 最低分数
  - `has_analysis`: 是否有分析结果
  - `page`: 页码
  - `limit`: 每页数量
  - `sort`: 排序字段

### 7.2 创建商品上架
- **端点**: `POST /api/listings`
- **描述**: 创建新的商品上架记录
- **认证**: 无需认证
- **请求体**:
```json
{
  "source_product_id": "string (必填)",
  "listing_info": {
    "title": "string",
    "description": "string",
    "category_id": "string",
    "brand": "string",
    "images": ["string"],
    "attributes": "object (可选)",
    "keywords": ["string"] 
  },
  "pricing": {
    "strategy": "string",
    "markup_percentage": "number",
    "min_price": "number (可选)",
    "max_price": "number (可选)"
  },
  "inventory": {
    "stock_quantity": "number",
    "low_stock_threshold": "number (可选)",
    "auto_restock": "boolean (可选)"
  },
  "logistics": {
    "weight": "number"
  }
}
```

### 7.3 获取上架列表
- **端点**: `GET /api/listings`
- **描述**: 获取商品上架列表
- **认证**: 无需认证
- **查询参数**:
  - `status`: 状态筛选
  - `platform`: 平台筛选
  - `created_by`: 创建者筛选
  - `page`: 页码
  - `limit`: 每页数量
  - `sort`: 排序字段

### 7.4 获取上架详情
- **端点**: `GET /api/listings/:listingId`
- **描述**: 获取指定上架记录的详细信息
- **认证**: 无需认证
- **路径参数**:
  - `listingId`: 上架记录ID

### 7.5 更新上架状态
- **端点**: `PUT /api/listings/:listingId/status`
- **描述**: 更新上架记录状态
- **认证**: 无需认证
- **路径参数**:
  - `listingId`: 上架记录ID
- **请求体**:
```json
{
  "status": "string",
  "notes": "string (可选)"
}
```

---

## 8. 扩展管理模块 (`/api/extension`)

### 8.1 扩展注册
- **端点**: `POST /api/extension/register`
- **描述**: 注册浏览器扩展
- **认证**: 无需认证
- **请求体**:
```json
{
  "extension_id": "string (必填)",
  "browser_info": "object (可选)"
}
```

### 8.2 心跳检测
- **端点**: `POST /api/extension/heartbeat`
- **描述**: 扩展心跳检测，保持连接状态
- **认证**: 无需认证
- **请求体**:
```json
{
  "extension_id": "string (必填)"
}
```

### 8.3 轮询任务
- **端点**: `POST /api/extension/tasks/poll`
- **描述**: 扩展轮询待执行任务
- **认证**: 无需认证
- **请求体**:
```json
{
  "extension_id": "string (必填)",
  "capabilities": ["string"] 
}
```

### 8.4 创建任务
- **端点**: `POST /api/extension/tasks`
- **描述**: 创建新的扩展任务
- **认证**: 无需认证
- **请求体**:
```json
{
  "type": "string (必填)",
  "data": {
    "url": "string (可选)",
    "urls": ["string"] ,
    "keywords": ["string"],
    "platform": "string (可选)",
    "resultCount": "number (可选)",
    "filters": "object (可选)"
  }
}
```

### 8.5 提交任务结果
- **端点**: `POST /api/extension/tasks/result`
- **描述**: 提交任务执行结果
- **认证**: 无需认证
- **请求体**:
```json
{
  "taskId": "string (必填)",
  "status": "string (必填)",
  "results": "array (可选)",
  "error": "string (可选)"
}
```

### 8.6 获取扩展状态
- **端点**: `GET /api/extension/status`
- **描述**: 获取扩展状态信息
- **认证**: 无需认证

### 8.7 请求页面源码
- **端点**: `POST /api/extension/request-source`
- **描述**: 请求获取指定页面的源码
- **认证**: 无需认证
- **请求体**:
```json
{
  "url": "string (必填)",
  "extension_id": "string (必填)"
}
```

### 8.8 获取源码任务
- **端点**: `GET /api/extension/source-task/:taskId`
- **描述**: 获取源码获取任务的状态和结果
- **认证**: 无需认证
- **路径参数**:
  - `taskId`: 任务ID

---

## 错误响应格式

所有 API 端点在发生错误时都会返回统一的错误响应格式：

```json
{
  "success": false,
  "error": "错误描述信息",
  "details": "详细错误信息 (仅开发环境)",
  "stack": "错误堆栈 (仅开发环境)"
}
```

## 常见 HTTP 状态码

- `200`: 请求成功
- `201`: 创建成功
- `400`: 请求参数错误
- `401`: 未授权访问
- `403`: 禁止访问
- `404`: 资源不存在
- `409`: 资源冲突
- `500`: 内部服务器错误
- `503`: 服务暂时不可用

## 开发注意事项

1. 所有 API 端点都支持 CORS 跨域请求
2. 请求和响应都使用 JSON 格式
3. 时间戳格式为 ISO 8601 标准
4. 分页查询默认每页 20 条记录
5. 排序字段支持正序 (`field`) 和倒序 (`-field`) 
6. 开发环境下会返回详细的错误信息和堆栈跟踪

---

*文档最后更新时间: 2024-01-01*