# MongoDB 商品数据库使用指南

## 概述

本项目已集成 MongoDB 数据库用于存储和管理商品信息。数据库连接配置在 `.env` 文件中，商品数据模型支持完整的电商商品信息管理。

## 数据库配置

### 连接信息
- **数据库URL**: `mongodb://root:tpmfzm5z@dbconn.sealosbja.site:33608/?directConnection=true`
- **配置文件**: `/src/config/database.ts`
- **环境变量**: `MONGO_URL` (在 `.env` 文件中)

### 自动连接
服务器启动时会自动连接到 MongoDB 数据库，连接状态会在控制台显示。

## 商品数据模型

### 商品字段结构

```typescript
interface IProduct {
  name: string;              // 商品名称
  description: string;       // 商品描述
  price: number;            // 当前价格
  originalPrice?: number;   // 原价（可选）
  category: string;         // 商品分类
  brand?: string;          // 品牌（可选）
  images: string[];        // 商品图片URL数组
  specifications: {        // 商品规格
    [key: string]: string;
  };
  stock: number;           // 库存数量
  sku: string;            // 商品SKU（唯一）
  status: 'active' | 'inactive' | 'out_of_stock'; // 商品状态
  tags: string[];         // 标签
  rating: {               // 评分信息
    average: number;      // 平均评分
    count: number;        // 评分数量
  };
  source: {               // 来源信息
    platform: string;     // 来源平台
    url: string;         // 来源URL
    extractedAt: Date;   // 提取时间
  };
  createdAt: Date;        // 创建时间
  updatedAt: Date;        // 更新时间
}
```

### 索引优化

数据库已创建以下索引以提高查询性能：
- 全文搜索索引：`name`, `description`
- 分类索引：`category`
- 品牌索引：`brand`
- 价格索引：`price`
- 状态索引：`status`
- 来源平台索引：`source.platform`
- 创建时间索引：`createdAt`

## API 接口

### 基础 CRUD 操作

#### 1. 获取商品列表
```http
GET /api/products
```

**查询参数**:
- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：20）
- `category`: 分类筛选
- `brand`: 品牌筛选
- `minPrice`: 最低价格
- `maxPrice`: 最高价格
- `status`: 状态筛选
- `search`: 全文搜索
- `sortBy`: 排序字段（createdAt, price, name, rating.average）
- `sortOrder`: 排序方向（asc, desc）

**示例**:
```bash
GET /api/products?category=手机数码&minPrice=1000&maxPrice=5000&page=1&limit=10
```

#### 2. 获取单个商品
```http
GET /api/products/:id
```

#### 3. 创建商品
```http
POST /api/products
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "最新款iPhone",
  "price": 7999,
  "originalPrice": 8999,
  "category": "手机数码",
  "brand": "Apple",
  "images": ["https://example.com/image1.jpg"],
  "specifications": {
    "屏幕尺寸": "6.1英寸",
    "存储容量": "128GB"
  },
  "stock": 100,
  "sku": "IPHONE15-PRO-128GB",
  "tags": ["手机", "Apple"],
  "source": {
    "platform": "1688",
    "url": "https://detail.1688.com/offer/example.html"
  }
}
```

#### 4. 更新商品
```http
PUT /api/products/:id
Content-Type: application/json

{
  "price": 7499,
  "stock": 80
}
```

#### 5. 删除商品
```http
DELETE /api/products/:id
```

### 特殊功能接口

#### 6. 更新库存
```http
PATCH /api/products/:id/stock
Content-Type: application/json

{
  "quantity": -5  // 减少5个库存，正数为增加
}
```

#### 7. 添加评分
```http
POST /api/products/:id/rating
Content-Type: application/json

{
  "rating": 4.5  // 0-5之间的评分
}
```

#### 8. 根据分类获取商品
```http
GET /api/products/category/:category
```

#### 9. 根据品牌获取商品
```http
GET /api/products/brand/:brand
```

#### 10. 获取热门商品
```http
GET /api/products/special/popular?limit=10
```

#### 11. 获取最新商品
```http
GET /api/products/special/latest?limit=10
```

#### 12. 批量导入商品
```http
POST /api/products/bulk
Content-Type: application/json

[
  {
    "name": "商品1",
    "description": "描述1",
    // ... 其他字段
  },
  {
    "name": "商品2",
    "description": "描述2",
    // ... 其他字段
  }
]
```

#### 13. 获取统计信息
```http
GET /api/products/special/stats
```

返回数据包括：
- 总商品数量
- 活跃商品数量
- 非活跃商品数量
- 分类数量
- 品牌数量
- 所有分类列表
- 所有品牌列表

## 数据播种

### 运行示例数据

项目提供了示例数据脚本，可以快速填充测试数据：

```bash
# 运行数据播种脚本
npm run seed
```

这将插入5个示例商品，包括：
- iPhone 15 Pro Max
- 小米14 Ultra
- MacBook Pro 16英寸
- AirPods Pro 3代
- 华为MateBook X Pro

### 自定义数据

可以修改 `/src/scripts/seedData.ts` 文件来添加自己的示例数据。

## 开发和测试

### 启动开发服务器
```bash
npm run dev
```

### 测试API

可以使用以下工具测试API：
- **Postman**: 导入API集合进行测试
- **curl**: 命令行测试
- **浏览器**: 直接访问GET接口

### 示例测试命令

```bash
# 获取商品列表
curl http://localhost:3001/api/products

# 获取统计信息
curl http://localhost:3001/api/products/special/stats

# 搜索商品
curl "http://localhost:3001/api/products?search=iPhone&category=手机数码"

# 创建商品
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "测试商品",
    "description": "这是一个测试商品",
    "price": 99.99,
    "category": "测试分类",
    "images": [],
    "stock": 10,
    "sku": "TEST-001",
    "source": {
      "platform": "测试平台",
      "url": "https://example.com"
    }
  }'
```

## 注意事项

1. **数据验证**: 所有API都包含数据验证，确保数据完整性
2. **错误处理**: 完善的错误处理机制，返回详细的错误信息
3. **性能优化**: 使用索引和分页来优化查询性能
4. **数据安全**: 生产环境请更换数据库连接信息
5. **备份**: 定期备份重要数据

## 扩展功能

未来可以考虑添加的功能：
- 商品图片上传和管理
- 商品评论系统
- 库存预警
- 价格历史记录
- 商品推荐算法
- 数据导出功能

## 故障排除

### 常见问题

1. **连接失败**: 检查网络连接和数据库URL
2. **权限错误**: 确认数据库用户权限
3. **数据验证失败**: 检查提交的数据格式
4. **性能问题**: 检查索引使用情况

### 日志查看

服务器启动时会显示数据库连接状态，出现问题时查看控制台日志。