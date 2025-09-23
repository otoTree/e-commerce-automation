# E-commerce AI Backend API 使用示例

本文档提供了各个 API 端点的实际使用示例，包括请求和响应数据。

## 目录

- [数据收集示例](#数据收集示例)
- [数据分析示例](#数据分析示例)
- [任务监控示例](#任务监控示例)
- [商品管理示例](#商品管理示例)
- [商品上架示例](#商品上架示例)
- [扩展管理示例](#扩展管理示例)

---

## 数据收集示例

### 1. 提交HTML内容

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/data-collection/submit-html \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://detail.1688.com/offer/123456789.html",
    "html_content": "<!DOCTYPE html><html>...</html>",
    "platform": "1688",
    "page_type": "product",
    "metadata": {
      "user_agent": "Mozilla/5.0...",
      "timestamp": "2024-01-01T10:00:00.000Z"
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "html_storage_id": "65a1b2c3d4e5f6789012345a",
  "message": "HTML内容已成功存储"
}
```

### 2. 解析HTML内容

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/data-collection/parse-html \
  -H "Content-Type: application/json" \
  -d '{
    "html_storage_id": "65a1b2c3d4e5f6789012345a",
    "force_reparse": false
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "商品页解析完成",
  "html_storage_id": "65a1b2c3d4e5f6789012345a",
  "product_id": "65a1b2c3d4e5f6789012345b",
  "parse_result": {
    "success": true,
    "data": {
      "title": "高品质棉质T恤",
      "price": {
        "current": 29.90,
        "original": 39.90,
        "currency": "CNY"
      },
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "description": "100%纯棉材质，舒适透气...",
      "specifications": {
        "材质": "100%棉",
        "颜色": "白色",
        "尺码": "S/M/L/XL"
      }
    }
  }
}
```

### 3. 处理搜索页数据

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/data-collection/process-search-data \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "1688",
    "limit": 5,
    "auto_trigger_product_collection": true
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "搜索页数据处理完成",
  "processed_count": 3,
  "success_count": 3,
  "failure_count": 0,
  "total_products_triggered": 45,
  "results": [
    {
      "search_data_id": "65a1b2c3d4e5f6789012345c",
      "success": true,
      "message": "处理成功，触发了15个商品收集任务",
      "products_triggered": 15
    }
  ]
}
```

---

## 数据分析示例

### 1. 分析单个商品

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/analysis/products/65a1b2c3d4e5f6789012345b/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "analysis_options": {
      "include_market_heat": true,
      "include_profit_analysis": true,
      "include_competitiveness": true
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "task_id": "task_65a1b2c3d4e5f6789012345d"
}
```

### 2. 获取分析结果

**请求示例**:
```bash
curl -X GET http://localhost:3001/api/analysis/products/65a1b2c3d4e5f6789012345b/analysis
```

**响应示例**:
```json
{
  "success": true,
  "analysis": {
    "_id": "65a1b2c3d4e5f6789012345e",
    "product_id": "65a1b2c3d4e5f6789012345b",
    "market_heat": {
      "score": 85,
      "trend": "上升",
      "search_volume": 12500,
      "competition_level": "中等"
    },
    "profit_analysis": {
      "estimated_cost": 15.50,
      "suggested_price": 35.00,
      "profit_margin": 55.7,
      "roi_estimate": 125.8
    },
    "competitiveness": {
      "score": 78,
      "advantages": [
        "价格优势明显",
        "质量评价较高"
      ],
      "disadvantages": [
        "品牌知名度较低"
      ]
    },
    "analysis_meta": {
      "analyzed_at": "2024-01-01T10:30:00.000Z",
      "version": "1.0.0"
    }
  }
}
```

### 3. 批量分析商品

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/analysis/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [
      "65a1b2c3d4e5f6789012345b",
      "65a1b2c3d4e5f6789012345f",
      "65a1b2c3d4e5f6789012345g"
    ],
    "analysis_options": {
      "include_market_heat": true,
      "include_profit_analysis": true
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "task_id": "task_65a1b2c3d4e5f6789012345h",
  "message": "批量分析任务已创建，正在处理3个商品"
}
```

---

## 任务监控示例

### 1. 获取任务列表

**请求示例**:
```bash
curl -X GET "http://localhost:3001/api/tasks?status=running&page=1&limit=10"
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345d",
      "task_id": "task_65a1b2c3d4e5f6789012345d",
      "type": "deep_analysis",
      "status": "running",
      "progress": {
        "total_items": 1,
        "processed_items": 0,
        "percentage": 45
      },
      "meta": {
        "created_at": "2024-01-01T10:15:00.000Z",
        "updated_at": "2024-01-01T10:20:00.000Z"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

### 2. 获取任务详情

**请求示例**:
```bash
curl -X GET http://localhost:3001/api/tasks/task_65a1b2c3d4e5f6789012345d
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345d",
    "task_id": "task_65a1b2c3d4e5f6789012345d",
    "type": "deep_analysis",
    "status": "completed",
    "input": {
      "product_ids": ["65a1b2c3d4e5f6789012345b"],
      "analysis_options": {
        "include_market_heat": true,
        "include_profit_analysis": true,
        "include_competitiveness": true
      }
    },
    "output": {
      "analysis_results": [
        {
          "product_id": "65a1b2c3d4e5f6789012345b",
          "analysis_id": "65a1b2c3d4e5f6789012345e",
          "success": true
        }
      ]
    },
    "progress": {
      "total_items": 1,
      "processed_items": 1,
      "percentage": 100
    },
    "meta": {
      "created_at": "2024-01-01T10:15:00.000Z",
      "updated_at": "2024-01-01T10:25:00.000Z",
      "completed_at": "2024-01-01T10:25:00.000Z"
    }
  }
}
```

---

## 商品管理示例

### 1. 获取商品列表

**请求示例**:
```bash
curl -X GET "http://localhost:3001/api/products?platform=1688&min_price=20&max_price=100&page=1&limit=5"
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6789012345b",
      "title": "高品质棉质T恤",
      "platform": "1688",
      "source_url": "https://detail.1688.com/offer/123456789.html",
      "price": {
        "current": 29.90,
        "original": 39.90,
        "currency": "CNY"
      },
      "images": [
        "https://example.com/image1.jpg"
      ],
      "rating": {
        "score": 4.5,
        "count": 128
      },
      "collection_meta": {
        "collected_at": "2024-01-01T10:00:00.000Z",
        "data_source": "html_parse"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 25,
    "pages": 5
  }
}
```

### 2. 获取商品详情

**请求示例**:
```bash
curl -X GET http://localhost:3001/api/products/65a1b2c3d4e5f6789012345b
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "_id": "65a1b2c3d4e5f6789012345b",
    "title": "高品质棉质T恤",
    "platform": "1688",
    "source_url": "https://detail.1688.com/offer/123456789.html",
    "price": {
      "current": 29.90,
      "original": 39.90,
      "currency": "CNY"
    },
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "description": "100%纯棉材质，舒适透气，适合日常穿着...",
    "specifications": {
      "材质": "100%棉",
      "颜色": "白色",
      "尺码": "S/M/L/XL"
    },
    "rating": {
      "score": 4.5,
      "count": 128
    },
    "seller": {
      "name": "优质服装厂",
      "rating": 4.8,
      "location": "广东省广州市"
    },
    "collection_meta": {
      "collected_at": "2024-01-01T10:00:00.000Z",
      "data_source": "html_parse",
      "collection_method": "backend_parse"
    }
  }
}
```

---

## 商品上架示例

### 1. 获取已分析商品

**请求示例**:
```bash
curl -X GET "http://localhost:3001/api/listings/analyzed-products?min_score=70&page=1&limit=5"
```

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "product": {
        "_id": "65a1b2c3d4e5f6789012345b",
        "title": "高品质棉质T恤",
        "platform": "1688",
        "price": {
          "current": 29.90,
          "currency": "CNY"
        },
        "images": ["https://example.com/image1.jpg"]
      },
      "analysis": {
        "market_heat": {
          "score": 85
        },
        "profit_analysis": {
          "profit_margin": 55.7,
          "roi_estimate": 125.8
        },
        "competitiveness": {
          "score": 78
        },
        "overall_score": 82.3
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 12,
    "pages": 3
  }
}
```

### 2. 创建商品上架

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/listings \
  -H "Content-Type: application/json" \
  -d '{
    "source_product_id": "65a1b2c3d4e5f6789012345b",
    "listing_info": {
      "title": "优质纯棉T恤 舒适透气 多色可选",
      "description": "采用100%纯棉材质，舒适透气，适合日常穿着。多种颜色和尺码可选，品质保证。",
      "category_id": "clothing_tshirts",
      "brand": "优选品牌",
      "images": [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg"
      ],
      "attributes": {
        "材质": "100%棉",
        "适用季节": "春夏",
        "风格": "休闲"
      },
      "keywords": ["T恤", "纯棉", "舒适", "透气"]
    },
    "pricing": {
      "strategy": "cost_plus",
      "markup_percentage": 80,
      "min_price": 35.00,
      "max_price": 65.00
    },
    "inventory": {
      "stock_quantity": 100,
      "low_stock_threshold": 10,
      "auto_restock": true
    },
    "logistics": {
      "weight": 0.2
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "listing_id": "65a1b2c3d4e5f6789012345i",
  "message": "商品上架记录创建成功",
  "data": {
    "_id": "65a1b2c3d4e5f6789012345i",
    "source_product_id": "65a1b2c3d4e5f6789012345b",
    "status": "draft",
    "listing_info": {
      "title": "优质纯棉T恤 舒适透气 多色可选",
      "final_price": 53.82
    },
    "created_at": "2024-01-01T11:00:00.000Z"
  }
}
```

---

## 扩展管理示例

### 1. 扩展注册

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/extension/register \
  -H "Content-Type: application/json" \
  -d '{
    "extension_id": "ext_chrome_12345",
    "browser_info": {
      "name": "Chrome",
      "version": "120.0.0.0",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "扩展注册成功",
  "extension_id": "ext_chrome_12345",
  "status": "active"
}
```

### 2. 轮询任务

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/extension/tasks/poll \
  -H "Content-Type: application/json" \
  -d '{
    "extension_id": "ext_chrome_12345",
    "capabilities": ["crawl_product", "crawl_search", "get_source"]
  }'
```

**响应示例**:
```json
{
  "success": true,
  "has_tasks": true,
  "tasks": [
    {
      "task_id": "task_65a1b2c3d4e5f6789012345j",
      "type": "single_product",
      "data": {
        "url": "https://detail.1688.com/offer/987654321.html",
        "platform": "1688"
      },
      "created_at": "2024-01-01T11:10:00.000Z"
    }
  ]
}
```

### 3. 提交任务结果

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/extension/tasks/result \
  -H "Content-Type: application/json" \
  -d '{
    "taskId": "task_65a1b2c3d4e5f6789012345j",
    "status": "completed",
    "results": [
      {
        "url": "https://detail.1688.com/offer/987654321.html",
        "html_content": "<!DOCTYPE html><html>...</html>",
        "metadata": {
          "timestamp": "2024-01-01T11:15:00.000Z",
          "user_agent": "Mozilla/5.0..."
        }
      }
    ]
  }'
```

**响应示例**:
```json
{
  "success": true,
  "message": "任务结果提交成功",
  "task_id": "task_65a1b2c3d4e5f6789012345j",
  "processed_results": 1,
  "html_storage_ids": [
    "65a1b2c3d4e5f6789012345k"
  ]
}
```

---

## 错误响应示例

### 1. 参数验证错误 (400)

**请求示例**:
```bash
curl -X POST http://localhost:3001/api/data-collection/submit-html \
  -H "Content-Type: application/json" \
  -d '{
    "url": "invalid-url",
    "html_content": ""
  }'
```

**响应示例**:
```json
{
  "success": false,
  "error": "请提供有效的URL"
}
```

### 2. 资源不存在 (404)

**请求示例**:
```bash
curl -X GET http://localhost:3001/api/products/invalid_product_id
```

**响应示例**:
```json
{
  "success": false,
  "error": "商品不存在"
}
```

### 3. 内部服务器错误 (500)

**响应示例**:
```json
{
  "success": false,
  "error": "内部服务器错误",
  "details": "Database connection failed",
  "stack": "Error: Database connection failed\n    at ..."
}
```

---

## 使用提示

1. **Content-Type**: 所有POST/PUT请求都需要设置 `Content-Type: application/json`
2. **URL编码**: URL参数需要进行适当的编码
3. **分页**: 使用 `page` 和 `limit` 参数进行分页查询
4. **排序**: 使用 `sort` 参数，支持正序(`field`)和倒序(`-field`)
5. **筛选**: 大部分列表接口都支持多种筛选条件
6. **异步任务**: 分析类操作通常是异步的，需要通过任务ID查询结果

---

*示例文档 - 更多详细信息请查看 [API_ROUTES_DOCUMENTATION.md](./API_ROUTES_DOCUMENTATION.md)*