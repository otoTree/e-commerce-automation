# E-commerce AI Backend API 文档

## 概述

基于 Express.js 和 TypeScript 构建的电商AI助手后端API服务，提供商品管理、任务调度和浏览器扩展集成功能。

**基础URL**: `http://localhost:3001`

## 认证

目前API不需要认证，所有端点都是公开的。

## 响应格式

所有API响应都遵循统一的JSON格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "pagination": {} // 仅在分页查询时包含
}
```

错误响应格式：
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述"
}
```

## API 端点

### 1. 基础端点

#### 1.1 健康检查

**GET** `/` 或 `/api/health`

检查API服务状态。

**响应示例**:
```json
{
  "message": "E-commerce AI Backend API is running!",
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### 1.2 获取已注册扩展列表

**GET** `/extensions` 或 `/api/extensions`

获取所有已注册的浏览器扩展列表。

**响应示例**:
```json
{
  "extensions": [
    {
      "id": "extension-123",
      "lastSeen": "2024-01-01T00:00:00.000Z",
      "userAgent": "Mozilla/5.0..."
    }
  ]
}
```

### 2. 商品管理 API

基础路径: `/api/products`

#### 2.1 获取商品列表

**GET** `/api/products`

获取商品列表，支持分页、筛选和排序。

**查询参数**:
- `page` (number, 可选): 页码，默认为1
- `limit` (number, 可选): 每页数量，默认为20
- `category` (string, 可选): 商品分类
- `brand` (string, 可选): 品牌
- `minPrice` (number, 可选): 最低价格
- `maxPrice` (number, 可选): 最高价格
- `status` (string, 可选): 商品状态 (`active` | `inactive` | `out_of_stock`)
- `search` (string, 可选): 搜索关键词
- `sortBy` (string, 可选): 排序字段 (`createdAt` | `price` | `name` | `rating.average`)
- `sortOrder` (string, 可选): 排序方向 (`asc` | `desc`)

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "商品名称",
      "description": "商品描述",
      "price": 99.99,
      "originalPrice": 129.99,
      "category": "电子产品",
      "brand": "品牌名",
      "images": ["image1.jpg", "image2.jpg"],
      "specifications": {
        "颜色": "黑色",
        "尺寸": "大"
      },
      "stock": 100,
      "sku": "SKU123456",
      "status": "active",
      "tags": ["热销", "新品"],
      "rating": {
        "average": 4.5,
        "count": 120
      },
      "source": {
        "platform": "1688",
        "url": "https://example.com/product",
        "extractedAt": "2024-01-01T00:00:00.000Z",
        "originalIndex": 1
      },
      "supplier": "供应商名称",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### 2.2 获取商品统计信息

**GET** `/api/products/stats`

获取商品统计数据。

**响应示例**:
```json
{
  "success": true,
  "data": {
    "totalProducts": 1500,
    "activeProducts": 1200,
    "inactiveProducts": 200,
    "outOfStockProducts": 100,
    "averagePrice": 85.50,
    "totalValue": 128250.00,
    "categoriesCount": 25,
    "brandsCount": 50
  }
}
```

#### 2.3 获取单个商品

**GET** `/api/products/:id`

根据商品ID获取商品详情。

**路径参数**:
- `id` (string): 商品ID

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "商品名称",
    // ... 完整商品信息
  }
}
```

#### 2.4 导入1688商品数据

**POST** `/api/products/import/1688`

批量导入1688平台的商品数据。

**请求体**:
```json
{
  "products": [
    {
      "index": 1,
      "link": "https://detail.1688.com/offer/123456.html",
      "image": "https://example.com/image.jpg",
      "title": "商品标题",
      "price": "¥99.99",
      "supplier": "供应商名称"
    }
  ]
}
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "success": 5,
    "failed": 1,
    "errors": [
      {
        "index": 2,
        "error": "价格格式错误"
      }
    ]
  },
  "message": "成功处理 5 个商品，失败 1 个"
}
```

#### 2.5 清空所有商品

**DELETE** `/api/products/clear`

清空数据库中的所有商品（仅用于测试）。

**响应示例**:
```json
{
  "success": true,
  "data": {
    "deletedCount": 150
  },
  "message": "已清空 150 个商品"
}
```

### 3. 任务管理 API

基础路径: `/api/tasks`

#### 3.1 创建爬取任务

**POST** `/api/tasks/create`

创建新的数据爬取任务。

**请求体**:
```json
{
  "url": "https://example.com/products",
  "type": "1688"
}
```

**字段说明**:
- `url` (string, 必需): 要爬取的URL
- `type` (string, 必需): 爬取类型 (`1688` | `taobao` | `tmall`)

**响应示例**:
```json
{
  "success": true,
  "taskId": "task-123456",
  "task": {
    "id": "task-123456",
    "url": "https://example.com/products",
    "type": "1688",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

#### 3.2 完成任务

**POST** `/api/tasks/:taskId/complete`

提交任务执行结果。

**路径参数**:
- `taskId` (string): 任务ID

**请求体**:
```json
{
  "data": {
    "products": [...],
    "total": 50
  },
  "success": true,
  "error": null
}
```

**字段说明**:
- `data` (object, 可选): 爬取到的数据
- `success` (boolean, 必需): 任务是否成功
- `error` (string, 可选): 错误信息

**响应示例**:
```json
{
  "success": true,
  "message": "Task result received"
}
```

#### 3.3 获取任务状态

**GET** `/api/tasks/:taskId`

获取指定任务的状态和详情。

**路径参数**:
- `taskId` (string): 任务ID

**响应示例**:
```json
{
  "task": {
    "id": "task-123456",
    "url": "https://example.com/products",
    "type": "1688",
    "status": "completed",
    "assignedTo": "extension-123",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "completedAt": "2024-01-01T00:05:00.000Z",
    "data": {
      "products": [...],
      "total": 50
    }
  }
}
```

#### 3.4 获取所有任务

**GET** `/api/tasks`

获取所有任务的列表。

**响应示例**:
```json
{
  "tasks": [
    {
      "id": "task-123456",
      "url": "https://example.com/products",
      "type": "1688",
      "status": "completed",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. 浏览器扩展 API

基础路径: `/api/extension`

#### 4.1 扩展注册

**POST** `/api/extension/register`

注册浏览器扩展。

**请求体**:
```json
{
  "extensionId": "extension-123456"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "Extension registered successfully"
}
```

#### 4.2 扩展心跳

**POST** `/api/extension/heartbeat`

更新扩展的活跃状态。

**请求体**:
```json
{
  "extensionId": "extension-123456"
}
```

**响应示例**:
```json
{
  "success": true
}
```

#### 4.3 获取待处理任务

**GET** `/api/extension/:extensionId/tasks`

获取分配给指定扩展的待处理任务。

**路径参数**:
- `extensionId` (string): 扩展ID

**响应示例**:
```json
{
  "tasks": [
    {
      "id": "task-123456",
      "url": "https://example.com/products",
      "type": "1688",
      "status": "assigned",
      "assignedTo": "extension-123456",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 数据模型

### Product (商品)

```typescript
interface IProduct {
  _id: string;
  name: string;                    // 商品名称
  description?: string;            // 商品描述
  price: number;                   // 当前价格
  originalPrice?: number;          // 原价
  category?: string;               // 分类
  brand?: string;                  // 品牌
  images: string[];                // 图片URL数组
  specifications: {                // 规格参数
    [key: string]: string;
  };
  stock: number;                   // 库存数量
  sku: string;                     // SKU编码
  status: 'active' | 'inactive' | 'out_of_stock'; // 状态
  tags: string[];                  // 标签
  rating: {                        // 评分
    average: number;               // 平均分
    count: number;                 // 评分数量
  };
  source: {                        // 数据来源
    platform: string;              // 平台名称
    url: string;                   // 原始URL
    extractedAt: Date;             // 提取时间
    originalIndex?: number;        // 原始索引
  };
  supplier?: string;               // 供应商
  createdAt: Date;                 // 创建时间
  updatedAt: Date;                 // 更新时间
}
```

### CrawlTask (爬取任务)

```typescript
interface CrawlTask {
  id: string;                      // 任务ID
  url: string;                     // 目标URL
  type: '1688' | 'taobao' | 'tmall'; // 任务类型
  status: 'pending' | 'assigned' | 'completed' | 'failed'; // 状态
  assignedTo?: string;             // 分配给的扩展ID
  createdAt: Date;                 // 创建时间
  completedAt?: Date;              // 完成时间
  data?: any;                      // 爬取结果数据
}
```

### ExtensionInfo (扩展信息)

```typescript
interface ExtensionInfo {
  id: string;                      // 扩展ID
  lastSeen: Date;                  // 最后活跃时间
  userAgent?: string;              // 用户代理字符串
}
```

## 错误代码

| HTTP状态码 | 错误类型 | 描述 |
|-----------|---------|------|
| 400 | Bad Request | 请求参数错误 |
| 404 | Not Found | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

## 使用示例

### 获取商品列表

```bash
curl -X GET "http://localhost:3001/api/products?page=1&limit=10&category=电子产品"
```

### 创建爬取任务

```bash
curl -X POST "http://localhost:3001/api/tasks/create" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://s.1688.com/selloffer/offer_search.htm?keywords=手机",
    "type": "1688"
  }'
```

### 导入1688商品数据

```bash
curl -X POST "http://localhost:3001/api/products/import/1688" \
  -H "Content-Type: application/json" \
  -d '{
    "products": [
      {
        "index": 1,
        "link": "https://detail.1688.com/offer/123456.html",
        "image": "https://example.com/image.jpg",
        "title": "智能手机",
        "price": "¥999.00",
        "supplier": "深圳科技有限公司"
      }
    ]
  }'
```

## 开发环境

- **Node.js**: >= 18.0.0
- **MongoDB**: >= 4.4
- **TypeScript**: >= 4.9

## 部署说明

1. 安装依赖: `npm install`
2. 配置环境变量: 复制 `.env.example` 到 `.env`
3. 启动MongoDB服务
4. 运行开发服务器: `npm run dev`
5. 构建生产版本: `npm run build`
6. 启动生产服务器: `npm start`

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实现商品管理API
- 实现任务调度系统
- 实现浏览器扩展集成
- 支持1688商品数据导入

---

**文档版本**: v1.0.0  
**最后更新**: 2024-01-01  
**联系方式**: 开发团队