# 服务器数据接收功能

## 功能概述

浏览器扩展现在支持从服务器接收JSON格式的数据，包括配置信息、任务列表和通知消息等。

## 功能特性

### 1. 数据类型支持
- **配置信息 (config)**: 获取提取规则、设置参数等配置数据
- **任务列表 (tasks)**: 获取待处理的爬取任务
- **通知消息 (notifications)**: 获取系统通知和消息
- **默认数据**: 获取连接状态和可用数据类型

### 2. 主要功能
- 扩展自动注册到服务器
- 实时获取服务器数据
- 支持不同数据类型切换
- 数据格式化显示
- 数据导出功能
- 数据刷新功能

## 使用方法

### 1. 启动后端服务器
确保后端服务器在 `http://localhost:3001` 运行。

### 2. 使用扩展功能
1. 打开浏览器扩展弹窗
2. 点击 "获取服务器数据" 按钮
3. 扩展会自动注册并获取默认数据
4. 使用下拉菜单选择不同的数据类型
5. 点击 "刷新" 按钮更新数据
6. 点击 "导出" 按钮下载JSON文件

## API 端点

### 1. 扩展注册
```
POST /api/extension/register
{
  "extensionId": "browser-extension-{timestamp}"
}
```

### 2. 获取数据
```
GET /api/extension/{extensionId}/data?type={dataType}
```

支持的数据类型:
- `config`: 配置信息
- `tasks`: 任务列表
- `notifications`: 通知消息
- 空值: 默认数据

### 3. 发送数据
```
POST /api/extension/{extensionId}/data
{
  "type": "extraction_result|error_report|analytics",
  "data": {}
}
```

## 数据格式示例

### 配置数据
```json
{
  "success": true,
  "data": {
    "extractionRules": {
      "1688.com": {
        "productSelector": ".search-offer-wrapper",
        "titleSelector": ".title-text div",
        "priceSelector": ".text-main"
      }
    },
    "settings": {
      "maxProducts": 100,
      "timeout": 30000
    }
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### 任务数据
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "task-123",
        "url": "https://example.com",
        "type": "product_extraction",
        "status": "pending"
      }
    ],
    "totalCount": 1
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 错误处理

扩展会处理以下错误情况:
- 服务器连接失败
- 扩展注册失败
- 数据获取失败
- 网络超时

所有错误都会在状态栏显示相应的错误信息。

## 安全考虑

- 扩展只能访问 localhost:3001
- 每个扩展实例都有唯一的ID
- 所有通信都通过HTTPS（如果服务器支持）
- 敏感数据不会被记录或缓存