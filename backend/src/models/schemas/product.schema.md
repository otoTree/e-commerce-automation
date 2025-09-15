# 商品相关数据模型设计

## 1. 商品分类表 (categories)

商品分类的层级结构管理。

### 字段设计

```javascript
{
  // 基础字段
  _id: ObjectId,                    // 分类唯一标识
  name: String,                     // 分类名称
  slug: String,                     // URL友好的标识符
  description: String,              // 分类描述
  
  // 层级结构
  parent_id: ObjectId,              // 父分类ID（null表示顶级分类）
  level: Number,                    // 分类层级（0为顶级）
  path: String,                     // 分类路径（如：/electronics/phones/smartphones）
  children_count: Number,           // 子分类数量
  
  // 显示相关
  display_order: Number,            // 显示顺序
  icon_url: String,                 // 分类图标URL
  banner_url: String,               // 分类横幅URL
  color: String,                    // 分类主题色
  
  // 状态管理
  status: String,                   // 状态：active, inactive, hidden
  is_featured: Boolean,             // 是否为推荐分类
  
  // SEO相关
  meta_title: String,               // SEO标题
  meta_description: String,         // SEO描述
  meta_keywords: [String],          // SEO关键词
  
  // 统计信息
  product_count: Number,            // 商品数量
  total_sales: Number,              // 总销量
  avg_rating: Number,               // 平均评分
  
  // 配置信息
  attributes: [{
    name: String,                   // 属性名称
    type: String,                   // 属性类型：text, number, select, multi_select
    required: Boolean,              // 是否必填
    options: [String],              // 选项值（用于select类型）
    unit: String                    // 单位
  }],
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 唯一索引
db.categories.createIndex({ "slug": 1 }, { unique: true })

// 查询索引
db.categories.createIndex({ "parent_id": 1, "display_order": 1 })
db.categories.createIndex({ "status": 1, "is_featured": 1 })
db.categories.createIndex({ "level": 1, "path": 1 })
db.categories.createIndex({ "is_deleted": 1, "status": 1 })

// 文本搜索索引
db.categories.createIndex({ 
  "name": "text", 
  "description": "text", 
  "meta_keywords": "text" 
})
```

## 2. 商品主表 (products)

商品的核心信息表。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 商品唯一标识
  sku: String,                      // 商品SKU（唯一）
  name: String,                     // 商品名称
  slug: String,                     // URL友好标识符
  description: String,              // 商品描述
  short_description: String,        // 简短描述
  
  // 分类关联
  category_id: ObjectId,            // 主分类ID
  category_path: [ObjectId],        // 分类路径数组
  tags: [String],                   // 标签
  
  // 价格信息
  pricing: {
    cost_price: Number,             // 成本价
    base_price: Number,             // 基础价格
    sale_price: Number,             // 销售价格
    market_price: Number,           // 市场价格
    currency: String,               // 货币类型
    tax_rate: Number,               // 税率
    discount: {
      type: String,                 // 折扣类型：percentage, fixed
      value: Number,                // 折扣值
      start_date: Date,             // 开始时间
      end_date: Date                // 结束时间
    }
  },
  
  // 库存管理
  inventory: {
    track_inventory: Boolean,       // 是否跟踪库存
    stock_quantity: Number,         // 库存数量
    reserved_quantity: Number,      // 预留数量
    available_quantity: Number,     // 可用数量
    low_stock_threshold: Number,    // 低库存阈值
    out_of_stock_behavior: String,  // 缺货行为：hide, show, backorder
    allow_backorder: Boolean,       // 是否允许预订
    backorder_limit: Number         // 预订限制
  },
  
  // 物理属性
  physical: {
    weight: Number,                 // 重量（克）
    dimensions: {
      length: Number,               // 长度（厘米）
      width: Number,                // 宽度（厘米）
      height: Number                // 高度（厘米）
    },
    material: String,               // 材质
    color: String,                  // 颜色
    size: String                    // 尺寸
  },
  
  // 媒体资源
  media: {
    images: [{
      url: String,                  // 图片URL
      alt_text: String,             // 替代文本
      is_primary: Boolean,          // 是否为主图
      sort_order: Number            // 排序
    }],
    videos: [{
      url: String,                  // 视频URL
      thumbnail_url: String,        // 缩略图URL
      title: String,                // 视频标题
      duration: Number              // 时长（秒）
    }],
    documents: [{
      url: String,                  // 文档URL
      name: String,                 // 文档名称
      type: String,                 // 文档类型
      size: Number                  // 文件大小
    }]
  },
  
  // 商品状态
  status: String,                   // 状态：draft, active, inactive, archived
  visibility: String,               // 可见性：public, private, hidden
  is_featured: Boolean,             // 是否推荐
  is_digital: Boolean,              // 是否数字商品
  requires_shipping: Boolean,       // 是否需要配送
  
  // 变体管理
  has_variants: Boolean,            // 是否有变体
  variant_attributes: [String],     // 变体属性（如：color, size）
  
  // SEO优化
  seo: {
    meta_title: String,             // SEO标题
    meta_description: String,       // SEO描述
    meta_keywords: [String],        // SEO关键词
    canonical_url: String,          // 规范URL
    og_title: String,               // Open Graph标题
    og_description: String,         // Open Graph描述
    og_image: String                // Open Graph图片
  },
  
  // 销售数据
  sales_data: {
    total_sales: Number,            // 总销量
    total_revenue: Number,          // 总收入
    avg_rating: Number,             // 平均评分
    review_count: Number,           // 评论数量
    view_count: Number,             // 浏览次数
    wishlist_count: Number,         // 收藏次数
    conversion_rate: Number         // 转化率
  },
  
  // AI分析数据
  ai_analysis: {
    quality_score: Number,          // 质量评分
    market_competitiveness: Number, // 市场竞争力
    price_optimization: {
      suggested_price: Number,      // 建议价格
      confidence: Number,           // 置信度
      factors: [String]             // 影响因素
    },
    content_optimization: {
      title_score: Number,          // 标题评分
      description_score: Number,    // 描述评分
      image_score: Number,          // 图片评分
      suggestions: [String]         // 优化建议
    },
    trend_analysis: {
      trend_direction: String,      // 趋势方向：up, down, stable
      seasonality: String,          // 季节性
      demand_forecast: Number       // 需求预测
    },
    last_analysis_at: Date          // 最后分析时间
  },
  
  // 供应商信息
  supplier: {
    supplier_id: ObjectId,          // 供应商ID
    supplier_sku: String,           // 供应商SKU
    lead_time: Number,              // 交货时间（天）
    minimum_order_quantity: Number, // 最小订购量
    supplier_price: Number          // 供应商价格
  },
  
  // 自定义属性
  custom_attributes: [{
    name: String,                   // 属性名
    value: Mixed,                   // 属性值
    type: String                    // 属性类型
  }],
  
  // 发布时间
  published_at: Date,               // 发布时间
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 唯一索引
db.products.createIndex({ "sku": 1 }, { unique: true })
db.products.createIndex({ "slug": 1 }, { unique: true })

// 查询索引
db.products.createIndex({ "category_id": 1, "status": 1 })
db.products.createIndex({ "status": 1, "visibility": 1, "is_featured": 1 })
db.products.createIndex({ "pricing.sale_price": 1 })
db.products.createIndex({ "inventory.available_quantity": 1 })
db.products.createIndex({ "sales_data.total_sales": -1 })
db.products.createIndex({ "sales_data.avg_rating": -1 })
db.products.createIndex({ "created_at": -1 })
db.products.createIndex({ "published_at": -1 })
db.products.createIndex({ "is_deleted": 1, "status": 1 })

// 复合索引
db.products.createIndex({ 
  "category_id": 1, 
  "status": 1, 
  "pricing.sale_price": 1 
})
db.products.createIndex({ 
  "tags": 1, 
  "status": 1, 
  "sales_data.avg_rating": -1 
})

// 文本搜索索引
db.products.createIndex({ 
  "name": "text", 
  "description": "text", 
  "tags": "text",
  "seo.meta_keywords": "text"
})

// 地理位置索引（如果需要）
// db.products.createIndex({ "location": "2dsphere" })
```

## 3. 商品变体表 (product_variants)

商品变体的详细信息。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 变体唯一标识
  product_id: ObjectId,             // 关联商品ID
  sku: String,                      // 变体SKU（唯一）
  name: String,                     // 变体名称
  
  // 变体属性
  attributes: {
    color: String,                  // 颜色
    size: String,                   // 尺寸
    material: String,               // 材质
    style: String,                  // 款式
    // 可扩展其他属性
  },
  
  // 价格信息
  pricing: {
    cost_price: Number,             // 成本价
    base_price: Number,             // 基础价格
    sale_price: Number,             // 销售价格
    price_adjustment: Number,       // 价格调整（相对于主商品）
    currency: String                // 货币类型
  },
  
  // 库存管理
  inventory: {
    stock_quantity: Number,         // 库存数量
    reserved_quantity: Number,      // 预留数量
    available_quantity: Number,     // 可用数量
    low_stock_threshold: Number,    // 低库存阈值
    location: String                // 存储位置
  },
  
  // 物理属性
  physical: {
    weight: Number,                 // 重量
    dimensions: {
      length: Number,               // 长度
      width: Number,                // 宽度
      height: Number                // 高度
    },
    barcode: String,                // 条形码
    qr_code: String                 // 二维码
  },
  
  // 媒体资源
  media: {
    images: [{
      url: String,                  // 图片URL
      alt_text: String,             // 替代文本
      is_primary: Boolean,          // 是否为主图
      sort_order: Number            // 排序
    }]
  },
  
  // 状态管理
  status: String,                   // 状态：active, inactive, out_of_stock
  is_default: Boolean,              // 是否为默认变体
  display_order: Number,            // 显示顺序
  
  // 销售数据
  sales_data: {
    total_sales: Number,            // 总销量
    total_revenue: Number,          // 总收入
    last_sale_date: Date            // 最后销售日期
  },
  
  // 供应商信息
  supplier: {
    supplier_id: ObjectId,          // 供应商ID
    supplier_sku: String,           // 供应商SKU
    lead_time: Number,              // 交货时间
    supplier_price: Number          // 供应商价格
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 唯一索引
db.product_variants.createIndex({ "sku": 1 }, { unique: true })

// 关联索引
db.product_variants.createIndex({ "product_id": 1, "status": 1 })
db.product_variants.createIndex({ "product_id": 1, "is_default": 1 })

// 查询索引
db.product_variants.createIndex({ "status": 1, "inventory.available_quantity": 1 })
db.product_variants.createIndex({ "attributes.color": 1, "attributes.size": 1 })
db.product_variants.createIndex({ "pricing.sale_price": 1 })
db.product_variants.createIndex({ "is_deleted": 1, "status": 1 })
```

## 4. 商品评论表 (product_reviews)

商品评论和评分管理。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 评论唯一标识
  product_id: ObjectId,             // 商品ID
  variant_id: ObjectId,             // 变体ID（可选）
  user_id: ObjectId,                // 用户ID
  order_id: ObjectId,               // 订单ID（可选）
  
  // 评论内容
  rating: Number,                   // 评分（1-5）
  title: String,                    // 评论标题
  content: String,                  // 评论内容
  pros: [String],                   // 优点
  cons: [String],                   // 缺点
  
  // 详细评分
  detailed_ratings: {
    quality: Number,                // 质量评分
    value: Number,                  // 性价比评分
    shipping: Number,               // 物流评分
    service: Number                 // 服务评分
  },
  
  // 媒体资源
  media: {
    images: [{
      url: String,                  // 图片URL
      caption: String               // 图片说明
    }],
    videos: [{
      url: String,                  // 视频URL
      thumbnail_url: String         // 缩略图URL
    }]
  },
  
  // 状态管理
  status: String,                   // 状态：pending, approved, rejected, hidden
  is_verified_purchase: Boolean,    // 是否验证购买
  is_featured: Boolean,             // 是否推荐评论
  
  // 互动数据
  helpful_count: Number,            // 有用数量
  unhelpful_count: Number,          // 无用数量
  reply_count: Number,              // 回复数量
  
  // 商家回复
  merchant_reply: {
    content: String,                // 回复内容
    replied_by: ObjectId,           // 回复者ID
    replied_at: Date                // 回复时间
  },
  
  // 审核信息
  moderation: {
    reviewed_by: ObjectId,          // 审核者ID
    reviewed_at: Date,              // 审核时间
    rejection_reason: String        // 拒绝原因
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId,
  version: Number
}
```

### 索引设计

```javascript
// 关联索引
db.product_reviews.createIndex({ "product_id": 1, "status": 1, "rating": -1 })
db.product_reviews.createIndex({ "user_id": 1, "created_at": -1 })

// 查询索引
db.product_reviews.createIndex({ "status": 1, "is_verified_purchase": 1 })
db.product_reviews.createIndex({ "rating": 1, "helpful_count": -1 })
db.product_reviews.createIndex({ "is_featured": 1, "created_at": -1 })
db.product_reviews.createIndex({ "is_deleted": 1, "status": 1 })

// 文本搜索索引
db.product_reviews.createIndex({ 
  "title": "text", 
  "content": "text" 
})
```

## 数据关系说明

### 关系类型
- **categories**: 自引用层级结构（parent_id）
- **products ↔ categories**: 多对一关系
- **products ↔ product_variants**: 一对多关系
- **products ↔ product_reviews**: 一对多关系
- **users ↔ product_reviews**: 一对多关系

### 数据一致性
1. 删除分类时检查是否有关联商品
2. 删除商品时级联删除变体和评论
3. 更新商品状态时同步更新变体状态
4. 评论统计数据实时更新

### 查询优化
1. 商品列表查询使用复合索引
2. 分类树查询优化路径字段
3. 评论聚合查询使用预计算
4. 热门商品数据缓存

## 业务规则

### 商品管理
1. SKU必须全局唯一
2. 商品发布前必须完成基本信息
3. 库存不足时自动调整状态
4. 价格变更记录历史

### 变体管理
1. 变体SKU必须唯一
2. 至少有一个默认变体
3. 变体属性组合不能重复
4. 变体价格不能低于成本价

### 评论管理
1. 只有购买用户才能评论
2. 评论需要审核后显示
3. 恶意评论自动过滤
4. 商家必须及时回复负面评论