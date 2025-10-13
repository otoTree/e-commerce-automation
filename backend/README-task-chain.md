# 任务链接功能文档

## 概述

任务链接功能允许 search_1688 任务完成后自动创建批量网页搜索任务，实现无缝的工作流程衔接。

## 核心组件

### 1. TaskChainService (`src/services/task-chain-service.ts`)

任务链接服务提供以下功能：
- 自动从 search_1688 结果创建批量任务
- 任务链信息查询
- 批量处理任务链接

### 2. 更新的任务路由 (`src/routes/tasks.ts`)

集成了任务链接功能的路由：
- `PATCH /:id/status` - 支持任务链接的状态更新
- `GET /:id/chain` - 获取任务链信息
- `POST /batch-chain` - 批量处理任务链接
- `POST /from-search-result/:searchResultId` - 从搜索结果创建任务

## 使用方法

### 1. 自动任务链接

当更新 search_1688 任务状态为 `completed` 时，可以自动创建批量任务：

```javascript
// 更新任务状态并自动创建批量任务
PATCH /api/tasks/{taskId}/status
{
  "status": "completed",
  "result": {
    "searchResultId": "搜索结果ID"
  },
  "autoCreateBatchTask": true,
  "batchTaskTitle": "自定义批量任务标题",
  "batchTaskDescription": "自定义描述",
  "batchTaskPriority": "high",
  "batchTaskTags": ["custom-tag"],
  "minProductCount": 5
}
```

### 2. 手动创建批量任务

从搜索结果手动创建批量任务：

```javascript
POST /api/tasks/from-search-result/{searchResultId}
{
  "title": "批量提取任务",
  "description": "从搜索结果提取产品信息",
  "priority": "medium",
  "tags": ["manual-created"]
}
```

### 3. 查看任务链信息

获取任务的链接信息：

```javascript
GET /api/tasks/{taskId}/chain
```

响应：
```json
{
  "success": true,
  "data": {
    "originalTask": { /* 原始任务信息 */ },
    "chainedTasks": [ /* 链接的任务列表 */ ]
  }
}
```

### 4. 批量处理任务链接

批量处理多个 search_1688 任务的链接：

```javascript
POST /api/tasks/batch-chain
{
  "taskIds": ["taskId1", "taskId2", "taskId3"],
  "autoCreateBatchTask": true,
  "batchTaskPriority": "medium",
  "minProductCount": 3
}
```

## 配置选项

### TaskChainConfig

```typescript
interface TaskChainConfig {
  autoCreateBatchTask?: boolean        // 是否自动创建批量任务，默认 true
  batchTaskTitle?: string             // 批量任务标题
  batchTaskDescription?: string       // 批量任务描述
  batchTaskPriority?: 'low' | 'medium' | 'high'  // 优先级，默认 medium
  batchTaskTags?: string[]            // 标签数组
  minProductCount?: number            // 最小产品数量，默认 1
}
```

## 任务元数据

自动创建的批量任务会包含以下元数据：

```json
{
  "metadata": {
    "sourceSearchResultId": "原始搜索结果ID",
    "sourceKeyword": "搜索关键词",
    "sourceUrl": "原始URL",
    "extractionTimestamp": "提取时间戳",
    "autoCreated": true,
    "createdBy": "task-chain-service"
  }
}
```

## 工作流程

1. **Search_1688 任务执行**：用户创建并执行 search_1688 任务
2. **任务完成**：任务状态更新为 `completed`，包含搜索结果ID
3. **自动链接**：如果启用自动链接，系统会：
   - 检查搜索结果是否有效
   - 验证产品数量是否满足最小要求
   - 提取所有产品链接
   - 创建批量URL提取任务
4. **批量处理**：新创建的批量任务可以进一步处理产品信息提取

## 错误处理

- 搜索结果不存在：返回 404 错误
- 搜索结果无产品：返回 400 错误
- 产品数量不足：不创建批量任务，记录日志
- 其他错误：记录错误日志，不影响主任务状态更新

## 最佳实践

1. **合理设置最小产品数量**：避免为少量产品创建批量任务
2. **使用有意义的标签**：便于任务管理和筛选
3. **监控任务链状态**：定期检查链接任务的执行情况
4. **批量处理**：对于大量任务，使用批量链接接口提高效率

## 示例场景

### 场景1：电商产品批量分析
1. 创建 search_1688 任务搜索"手机壳"
2. 任务完成后自动创建包含100个产品链接的批量任务
3. 批量任务逐个提取产品详细信息
4. 最终获得完整的产品数据集

### 场景2：市场调研
1. 批量创建多个不同关键词的 search_1688 任务
2. 使用批量链接接口统一处理所有完成的搜索任务
3. 生成综合的市场分析报告