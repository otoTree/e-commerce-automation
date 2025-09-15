# API 概览

## 快速参考

### 基础信息
- **基础URL**: `http://localhost:3001`
- **数据格式**: JSON
- **认证**: 无需认证

### 主要端点

#### 🏥 健康检查
```
GET /api/health
```

#### 📦 商品管理
```
GET    /api/products           # 获取商品列表
GET    /api/products/stats     # 获取统计信息
GET    /api/products/:id       # 获取单个商品
POST   /api/products/import/1688  # 导入1688商品
DELETE /api/products/clear     # 清空商品（测试用）
```

#### 📋 任务管理
```
POST /api/tasks/create         # 创建爬取任务
GET  /api/tasks               # 获取所有任务
GET  /api/tasks/:taskId       # 获取任务状态
POST /api/tasks/:taskId/complete  # 完成任务
```

#### 🔌 扩展管理
```
GET  /api/extensions          # 获取扩展列表
POST /api/extension/register  # 注册扩展
POST /api/extension/heartbeat # 扩展心跳
GET  /api/extension/:id/tasks # 获取待处理任务
```

### 常用查询参数

#### 商品列表查询
- `page`: 页码
- `limit`: 每页数量
- `category`: 分类筛选
- `brand`: 品牌筛选
- `minPrice`/`maxPrice`: 价格范围
- `search`: 关键词搜索
- `sortBy`: 排序字段
- `sortOrder`: 排序方向

### 响应格式

#### 成功响应
```json
{
  "success": true,
  "data": {},
  "message": "操作成功"
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误"
}
```

### 快速测试

```bash
# 检查API状态
curl http://localhost:3001/api/health

# 获取商品列表
curl "http://localhost:3001/api/products?limit=5"

# 创建爬取任务
curl -X POST http://localhost:3001/api/tasks/create \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","type":"1688"}'
```

---

📖 **完整文档**: 查看 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) 获取详细信息