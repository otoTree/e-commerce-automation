# E-commerce AI Backend

基于 Express.js 和 TypeScript 构建的电商AI助手后端API服务。

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **运行时**: Node.js
- **开发工具**: ts-node, nodemon
- **中间件**: CORS, dotenv

## 项目结构

```
src/
├── index.ts           # 应用入口文件
├── routes/            # 路由定义
├── controllers/       # 控制器
├── models/           # 数据模型
├── middleware/       # 中间件
├── services/         # 业务逻辑服务
├── utils/            # 工具函数
└── types/            # TypeScript 类型定义
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 环境配置
复制并配置环境变量：
```bash
cp .env.example .env
```

编辑 `.env` 文件：
```bash
# 服务器配置
PORT=3001

# 数据库配置
# DATABASE_URL=

# JWT 配置
# JWT_SECRET=

# CORS 配置
CORS_ORIGIN=http://localhost:3000
```

### 开发模式
```bash
npm run dev
```

服务器将在 [http://localhost:3001](http://localhost:3001) 启动。

### 构建和生产运行
```bash
npm run build
npm start
```

## 可用脚本

- `npm run dev` - 启动开发服务器 (使用 nodemon 和 ts-node)
- `npm run build` - 编译 TypeScript 到 JavaScript
- `npm start` - 启动生产服务器
- `npm test` - 运行测试 (待实现)

## API 文档

### 📖 完整API文档
查看 <mcfile name="API_ROUTES_DOCUMENTATION.md" path="/Users/huangjiarui/Desktop/e-commerce-ai/backend/API_ROUTES_DOCUMENTATION.md"></mcfile> 获取详细的API文档，包括：
- 所有端点的详细说明
- 请求/响应格式
- 参数说明和验证规则
- 错误代码说明
- 认证要求

### 🚀 快速参考
查看 <mcfile name="API_QUICK_REFERENCE.md" path="/Users/huangjiarui/Desktop/e-commerce-ai/backend/API_QUICK_REFERENCE.md"></mcfile> 获取API快速参考指南，包括：
- 端点概览表格
- 核心参数说明
- 常用响应格式
- 状态码说明

### 💡 使用示例
查看 <mcfile name="API_EXAMPLES.md" path="/Users/huangjiarui/Desktop/e-commerce-ai/backend/API_EXAMPLES.md"></mcfile> 获取实际的API使用示例，包括：
- 完整的请求/响应示例
- cURL命令示例
- 错误处理示例
- 最佳实践建议

### 📮 Postman 集合
导入 [postman_collection.json](./postman_collection.json) 到Postman中，快速测试所有API端点。

### 主要功能

#### ✅ 已实现的端点

**基础功能**
- `GET /api/health` - 健康检查
- `GET /api/extensions` - 获取已注册扩展列表

**商品管理**
- `GET /api/products` - 获取商品列表（支持分页、筛选、排序）
- `GET /api/products/stats` - 获取商品统计信息
- `GET /api/products/:id` - 获取单个商品详情
- `POST /api/products/import/1688` - 导入1688商品数据
- `DELETE /api/products/clear` - 清空所有商品（测试用）

**任务管理**
- `POST /api/tasks/create` - 创建爬取任务
- `GET /api/tasks` - 获取所有任务
- `GET /api/tasks/:taskId` - 获取任务状态
- `POST /api/tasks/:taskId/complete` - 提交任务结果

**浏览器扩展集成**
- `POST /api/extension/register` - 扩展注册
- `POST /api/extension/heartbeat` - 扩展心跳
- `GET /api/extension/:extensionId/tasks` - 获取待处理任务

### 🔄 计划实现的功能

#### 用户认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `PUT /api/auth/profile` - 更新用户信息

#### AI 功能
- `POST /api/ai/analyze` - AI 产品分析
- `POST /api/ai/recommend` - AI 推荐
- `POST /api/ai/price-predict` - 价格预测

#### 高级商品管理
- `POST /api/products` - 手动创建商品
- `PUT /api/products/:id` - 更新商品信息
- `DELETE /api/products/:id` - 删除单个商品

## 开发指南

### 添加新路由

1. 在 `src/routes` 目录创建路由文件：
```typescript
// src/routes/products.ts
import { Router } from 'express';
import { getProducts, getProduct } from '../controllers/products';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

export default router;
```

2. 在主应用中注册路由：
```typescript
// src/index.ts
import productRoutes from './routes/products';

app.use('/api/products', productRoutes);
```

### 创建控制器

```typescript
// src/controllers/products.ts
import { Request, Response } from 'express';

export const getProducts = async (req: Request, res: Response) => {
  try {
    // 业务逻辑
    const products = await ProductService.getAll();
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### 错误处理中间件

```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(error.stack);
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
```

### 类型定义

```typescript
// src/types/index.ts
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

## 数据库集成

### 计划支持的数据库
- PostgreSQL (推荐)
- MongoDB
- MySQL

### 示例配置 (PostgreSQL + Prisma)

```bash
npm install prisma @prisma/client
npx prisma init
```

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 安全性

### 计划实现的安全功能
- JWT 身份验证
- 密码哈希 (bcrypt)
- 请求限制 (rate limiting)
- 输入验证和清理
- CORS 配置
- 安全头部 (helmet)

### 示例中间件

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
```

## 测试

### 测试框架 (计划)
- Jest
- Supertest

### 示例测试

```typescript
// tests/api.test.ts
import request from 'supertest';
import app from '../src/index';

describe('API Endpoints', () => {
  test('GET / should return success message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('E-commerce AI Backend API is running!');
  });
});
```

## 部署

### Docker 部署

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

### 环境变量 (生产)

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://your-frontend-domain.com
```

## 监控和日志

### 计划集成
- Winston (日志)
- Morgan (HTTP 请求日志)
- Prometheus (指标)
- Health checks

## 贡献指南

1. 遵循 TypeScript 最佳实践
2. 添加适当的错误处理
3. 编写清晰的 API 文档
4. 添加单元测试
5. 遵循 RESTful API 设计原则

## 相关链接

- [Express.js 文档](https://expressjs.com)
- [TypeScript 文档](https://www.typescriptlang.org/docs)
- [Node.js 文档](https://nodejs.org/docs)