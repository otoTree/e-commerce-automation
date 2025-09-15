# 订单和支付数据模型设计

## 1. 订单主表 (orders)

系统中所有订单的核心信息。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 订单唯一标识
  order_number: String,             // 订单号（可读性强）
  order_type: String,               // 订单类型：normal, pre_order, subscription, gift
  
  // 用户信息
  user_id: ObjectId,                // 用户ID
  guest_info: {
    email: String,                  // 游客邮箱
    phone: String,                  // 游客手机
    name: String                    // 游客姓名
  },
  
  // 订单状态
  status: String,                   // 订单状态：pending, confirmed, processing, shipped, delivered, cancelled, refunded
  payment_status: String,           // 支付状态：pending, paid, failed, refunded, partial_refund
  fulfillment_status: String,       // 履约状态：unfulfilled, partial, fulfilled
  
  // 商品信息
  items: [{
    item_id: ObjectId,              // 订单项ID
    product_id: ObjectId,           // 商品ID
    variant_id: ObjectId,           // 变体ID
    sku: String,                    // SKU
    title: String,                  // 商品标题
    variant_title: String,          // 变体标题
    quantity: Number,               // 数量
    price: Number,                  // 单价
    original_price: Number,         // 原价
    discount_amount: Number,        // 折扣金额
    total_price: Number,            // 小计
    weight: Number,                 // 重量
    requires_shipping: Boolean,     // 是否需要配送
    is_gift: Boolean,               // 是否礼品
    gift_message: String,           // 礼品留言
    custom_attributes: [{
      key: String,                  // 自定义属性键
      value: String                 // 自定义属性值
    }]
  }],
  
  // 价格信息
  pricing: {
    subtotal: Number,               // 商品小计
    discount_total: Number,         // 折扣总额
    shipping_cost: Number,          // 运费
    tax_amount: Number,             // 税费
    tip_amount: Number,             // 小费
    total_amount: Number,           // 订单总额
    currency: String,               // 货币代码
    exchange_rate: Number           // 汇率（如果涉及货币转换）
  },
  
  // 折扣信息
  discounts: [{
    discount_id: ObjectId,          // 折扣ID
    code: String,                   // 折扣码
    type: String,                   // 折扣类型：percentage, fixed_amount, free_shipping
    value: Number,                  // 折扣值
    amount: Number,                 // 折扣金额
    description: String,            // 折扣描述
    applied_to: String              // 应用范围：order, shipping, item
  }],
  
  // 配送信息
  shipping: {
    method: String,                 // 配送方式
    carrier: String,                // 承运商
    service_name: String,           // 服务名称
    tracking_number: String,        // 跟踪号
    tracking_url: String,           // 跟踪链接
    estimated_delivery: Date,       // 预计送达时间
    actual_delivery: Date,          // 实际送达时间
    
    // 配送地址
    address: {
      recipient_name: String,       // 收件人姓名
      company: String,              // 公司名称
      address_line_1: String,       // 地址行1
      address_line_2: String,       // 地址行2
      city: String,                 // 城市
      province: String,             // 省/州
      postal_code: String,          // 邮编
      country: String,              // 国家
      phone: String,                // 电话
      is_default: Boolean,          // 是否默认地址
      address_type: String          // 地址类型：home, office, other
    },
    
    // 配送选项
    options: {
      signature_required: Boolean,  // 需要签名
      leave_at_door: Boolean,       // 可放门口
      delivery_instructions: String, // 配送说明
      preferred_time: String        // 偏好时间
    }
  },
  
  // 账单信息
  billing: {
    same_as_shipping: Boolean,      // 与配送地址相同
    address: {
      name: String,                 // 账单姓名
      company: String,              // 公司名称
      address_line_1: String,       // 地址行1
      address_line_2: String,       // 地址行2
      city: String,                 // 城市
      province: String,             // 省/州
      postal_code: String,          // 邮编
      country: String,              // 国家
      phone: String                 // 电话
    }
  },
  
  // 支付信息
  payment_info: {
    payment_method: String,         // 支付方式：credit_card, paypal, apple_pay, bank_transfer
    payment_gateway: String,        // 支付网关
    transaction_id: String,         // 交易ID
    authorization_code: String,     // 授权码
    last_four_digits: String,       // 卡号后四位
    card_brand: String,             // 卡品牌
    installments: Number,           // 分期数
    payment_date: Date,             // 支付时间
    refund_policy: String           // 退款政策
  },
  
  // 税务信息
  tax_info: {
    tax_exempt: Boolean,            // 是否免税
    tax_id: String,                 // 税号
    tax_lines: [{
      title: String,                // 税种名称
      rate: Number,                 // 税率
      amount: Number                // 税额
    }]
  },
  
  // 订单来源
  source: {
    channel: String,                // 渠道：web, mobile, api, pos
    campaign_id: ObjectId,          // 营销活动ID
    referrer: String,               // 来源页面
    utm_source: String,             // UTM来源
    utm_medium: String,             // UTM媒介
    utm_campaign: String,           // UTM活动
    landing_page: String,           // 落地页
    user_agent: String              // 用户代理
  },
  
  // 客户服务
  customer_service: {
    notes: [{
      note_id: ObjectId,            // 备注ID
      content: String,              // 备注内容
      type: String,                 // 备注类型：internal, customer
      created_by: ObjectId,         // 创建者
      created_at: Date              // 创建时间
    }],
    tags: [String],                 // 标签
    priority: String,               // 优先级：low, medium, high
    assigned_agent: ObjectId        // 分配的客服
  },
  
  // 风险评估
  risk_assessment: {
    risk_level: String,             // 风险等级：low, medium, high
    risk_score: Number,             // 风险评分
    fraud_indicators: [String],     // 欺诈指标
    verification_status: String,    // 验证状态：pending, verified, failed
    manual_review: Boolean,         // 需要人工审核
    reviewed_by: ObjectId,          // 审核人
    reviewed_at: Date               // 审核时间
  },
  
  // 履约信息
  fulfillment: {
    warehouse_id: ObjectId,         // 仓库ID
    pick_list_id: ObjectId,         // 拣货单ID
    packed_by: ObjectId,            // 打包人
    packed_at: Date,                // 打包时间
    shipped_by: ObjectId,           // 发货人
    shipped_at: Date,               // 发货时间
    delivery_attempts: Number,      // 配送尝试次数
    delivery_issues: [{
      issue_type: String,           // 问题类型
      description: String,          // 问题描述
      reported_at: Date,            // 报告时间
      resolved: Boolean             // 是否解决
    }]
  },
  
  // 退换货信息
  returns: [{
    return_id: ObjectId,            // 退货ID
    items: [{
      item_id: ObjectId,            // 商品项ID
      quantity: Number,             // 退货数量
      reason: String,               // 退货原因
      condition: String             // 商品状态
    }],
    return_type: String,            // 退货类型：refund, exchange
    status: String,                 // 状态：requested, approved, received, processed
    refund_amount: Number,          // 退款金额
    restocking_fee: Number,         // 重新入库费
    return_shipping_cost: Number,   // 退货运费
    requested_at: Date,             // 申请时间
    processed_at: Date              // 处理时间
  }],
  
  // 时间戳
  timestamps: {
    placed_at: Date,                // 下单时间
    confirmed_at: Date,             // 确认时间
    processed_at: Date,             // 处理时间
    shipped_at: Date,               // 发货时间
    delivered_at: Date,             // 送达时间
    cancelled_at: Date,             // 取消时间
    closed_at: Date                 // 关闭时间
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
db.orders.createIndex({ "order_number": 1 }, { unique: true })

// 查询索引
db.orders.createIndex({ "user_id": 1, "status": 1, "created_at": -1 })
db.orders.createIndex({ "status": 1, "payment_status": 1 })
db.orders.createIndex({ "fulfillment_status": 1, "created_at": -1 })
db.orders.createIndex({ "source.channel": 1, "created_at": -1 })
db.orders.createIndex({ "timestamps.placed_at": -1 })
db.orders.createIndex({ "shipping.tracking_number": 1 })
db.orders.createIndex({ "payment_info.transaction_id": 1 })
db.orders.createIndex({ "is_deleted": 1, "status": 1 })

// 复合索引
db.orders.createIndex({ 
  "user_id": 1, 
  "status": 1, 
  "timestamps.placed_at": -1 
})
db.orders.createIndex({ 
  "status": 1, 
  "payment_status": 1, 
  "created_at": -1 
})

// 文本搜索索引
db.orders.createIndex({ 
  "order_number": "text", 
  "shipping.address.recipient_name": "text",
  "items.title": "text"
})
```

## 2. 支付记录表 (payments)

记录所有支付相关的交易信息。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 支付记录唯一标识
  payment_id: String,               // 支付ID（可读性强）
  order_id: ObjectId,               // 关联订单ID
  
  // 支付信息
  amount: Number,                   // 支付金额
  currency: String,                 // 货币代码
  exchange_rate: Number,            // 汇率
  original_amount: Number,          // 原始金额
  original_currency: String,        // 原始货币
  
  // 支付方式
  payment_method: {
    type: String,                   // 支付类型：credit_card, debit_card, paypal, apple_pay, google_pay, bank_transfer, crypto
    provider: String,               // 支付提供商：stripe, paypal, square, alipay, wechat_pay
    gateway: String,                // 支付网关
    
    // 卡片信息（如适用）
    card_info: {
      last_four: String,            // 后四位
      brand: String,                // 卡品牌：visa, mastercard, amex
      exp_month: Number,            // 过期月份
      exp_year: Number,             // 过期年份
      fingerprint: String,          // 卡片指纹
      funding: String,              // 资金类型：credit, debit, prepaid
      country: String               // 发卡国家
    },
    
    // 数字钱包信息
    wallet_info: {
      wallet_type: String,          // 钱包类型
      account_id: String,           // 账户ID
      email: String                 // 关联邮箱
    },
    
    // 银行转账信息
    bank_info: {
      bank_name: String,            // 银行名称
      account_number: String,       // 账号（加密）
      routing_number: String,       // 路由号
      account_type: String          // 账户类型
    }
  },
  
  // 交易状态
  status: String,                   // 状态：pending, processing, succeeded, failed, cancelled, refunded
  failure_reason: String,           // 失败原因
  failure_code: String,             // 失败代码
  
  // 网关信息
  gateway_data: {
    transaction_id: String,         // 网关交易ID
    authorization_code: String,     // 授权码
    reference_number: String,       // 参考号
    processor_response: String,     // 处理器响应
    avs_result: String,             // AVS验证结果
    cvv_result: String,             // CVV验证结果
    network_transaction_id: String  // 网络交易ID
  },
  
  // 分期付款
  installments: {
    enabled: Boolean,               // 是否启用分期
    plan_id: String,                // 分期计划ID
    total_installments: Number,     // 总期数
    installment_amount: Number,     // 每期金额
    current_installment: Number,    // 当前期数
    next_payment_date: Date,        // 下次付款日期
    interest_rate: Number,          // 利率
    fees: Number                    // 手续费
  },
  
  // 风险评估
  risk_assessment: {
    risk_score: Number,             // 风险评分
    risk_level: String,             // 风险等级
    fraud_score: Number,            // 欺诈评分
    3ds_authentication: {
      required: Boolean,            // 是否需要3DS
      status: String,               // 3DS状态
      version: String,              // 3DS版本
      challenge_required: Boolean,  // 是否需要挑战
      authentication_flow: String   // 认证流程
    },
    device_fingerprint: String,     // 设备指纹
    ip_address: String,             // IP地址
    geolocation: {
      country: String,              // 国家
      region: String,               // 地区
      city: String,                 // 城市
      latitude: Number,             // 纬度
      longitude: Number             // 经度
    }
  },
  
  // 退款信息
  refunds: [{
    refund_id: String,              // 退款ID
    amount: Number,                 // 退款金额
    reason: String,                 // 退款原因
    status: String,                 // 退款状态
    gateway_refund_id: String,      // 网关退款ID
    processed_at: Date,             // 处理时间
    expected_arrival: Date,         // 预计到账时间
    created_by: ObjectId,           // 创建者
    notes: String                   // 备注
  }],
  
  // 手续费
  fees: {
    processing_fee: Number,         // 处理费
    gateway_fee: Number,            // 网关费用
    currency_conversion_fee: Number, // 货币转换费
    chargeback_fee: Number,         // 拒付费用
    total_fees: Number              // 总费用
  },
  
  // 结算信息
  settlement: {
    settlement_id: String,          // 结算ID
    settlement_date: Date,          // 结算日期
    settlement_amount: Number,      // 结算金额
    settlement_currency: String,    // 结算货币
    payout_id: String,              // 付款ID
    payout_date: Date               // 付款日期
  },
  
  // 争议信息
  disputes: [{
    dispute_id: String,             // 争议ID
    type: String,                   // 争议类型：chargeback, inquiry, retrieval
    reason: String,                 // 争议原因
    amount: Number,                 // 争议金额
    status: String,                 // 争议状态
    evidence_due_date: Date,        // 证据截止日期
    created_at: Date,               // 创建时间
    resolved_at: Date               // 解决时间
  }],
  
  // 元数据
  metadata: {
    customer_ip: String,            // 客户IP
    user_agent: String,             // 用户代理
    session_id: String,             // 会话ID
    order_source: String,           // 订单来源
    campaign_id: ObjectId,          // 营销活动ID
    affiliate_id: String,           // 联盟ID
    custom_fields: Mixed            // 自定义字段
  },
  
  // 时间戳
  timestamps: {
    initiated_at: Date,             // 发起时间
    authorized_at: Date,            // 授权时间
    captured_at: Date,              // 捕获时间
    settled_at: Date,               // 结算时间
    failed_at: Date,                // 失败时间
    cancelled_at: Date              // 取消时间
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  created_by: ObjectId,
  updated_by: ObjectId,
  is_deleted: Boolean,
  deleted_at: Date,
  deleted_by: ObjectId
}
```

### 索引设计

```javascript
// 唯一索引
db.payments.createIndex({ "payment_id": 1 }, { unique: true })
db.payments.createIndex({ "gateway_data.transaction_id": 1 }, { unique: true, sparse: true })

// 关联索引
db.payments.createIndex({ "order_id": 1, "status": 1 })
db.payments.createIndex({ "order_id": 1, "created_at": -1 })

// 查询索引
db.payments.createIndex({ "status": 1, "created_at": -1 })
db.payments.createIndex({ "payment_method.type": 1, "status": 1 })
db.payments.createIndex({ "payment_method.provider": 1, "created_at": -1 })
db.payments.createIndex({ "timestamps.captured_at": -1 })
db.payments.createIndex({ "settlement.settlement_date": -1 })
db.payments.createIndex({ "is_deleted": 1 })

// 风险管理索引
db.payments.createIndex({ "risk_assessment.risk_level": 1, "status": 1 })
db.payments.createIndex({ "metadata.customer_ip": 1, "created_at": -1 })
```

## 3. 购物车表 (carts)

用户购物车信息。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 购物车唯一标识
  user_id: ObjectId,                // 用户ID（注册用户）
  session_id: String,               // 会话ID（游客）
  
  // 购物车项目
  items: [{
    item_id: ObjectId,              // 购物车项ID
    product_id: ObjectId,           // 商品ID
    variant_id: ObjectId,           // 变体ID
    quantity: Number,               // 数量
    price: Number,                  // 单价
    original_price: Number,         // 原价
    discount_amount: Number,        // 折扣金额
    
    // 商品快照
    product_snapshot: {
      title: String,                // 商品标题
      image_url: String,            // 商品图片
      sku: String,                  // SKU
      weight: Number,               // 重量
      requires_shipping: Boolean,   // 是否需要配送
      available: Boolean,           // 是否可用
      inventory_quantity: Number    // 库存数量
    },
    
    // 个性化选项
    customizations: [{
      option_name: String,          // 选项名称
      option_value: String,         // 选项值
      additional_price: Number      // 额外价格
    }],
    
    // 时间戳
    added_at: Date,                 // 添加时间
    updated_at: Date                // 更新时间
  }],
  
  // 应用的折扣
  applied_discounts: [{
    discount_code: String,          // 折扣码
    discount_type: String,          // 折扣类型
    discount_value: Number,         // 折扣值
    discount_amount: Number         // 折扣金额
  }],
  
  // 配送信息
  shipping_info: {
    address_id: ObjectId,           // 配送地址ID
    method: String,                 // 配送方式
    cost: Number,                   // 配送费用
    estimated_delivery: Date        // 预计送达时间
  },
  
  // 购物车统计
  totals: {
    item_count: Number,             // 商品数量
    subtotal: Number,               // 小计
    discount_total: Number,         // 折扣总额
    shipping_cost: Number,          // 运费
    tax_amount: Number,             // 税费
    total_amount: Number            // 总金额
  },
  
  // 状态信息
  status: String,                   // 状态：active, abandoned, converted, expired
  currency: String,                 // 货币
  
  // 营销信息
  marketing: {
    source: String,                 // 来源
    campaign_id: ObjectId,          // 营销活动ID
    utm_parameters: {
      utm_source: String,           // UTM来源
      utm_medium: String,           // UTM媒介
      utm_campaign: String,         // UTM活动
      utm_term: String,             // UTM关键词
      utm_content: String           // UTM内容
    }
  },
  
  // 放弃购物车恢复
  recovery: {
    email_sent: Boolean,            // 是否发送邮件
    email_sent_at: Date,            // 邮件发送时间
    recovery_token: String,         // 恢复令牌
    recovery_url: String,           // 恢复链接
    recovered: Boolean,             // 是否已恢复
    recovered_at: Date              // 恢复时间
  },
  
  // 过期设置
  expires_at: Date,                 // 过期时间
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  is_deleted: Boolean,
  deleted_at: Date
}
```

### 索引设计

```javascript
// 用户索引
db.carts.createIndex({ "user_id": 1, "status": 1 })
db.carts.createIndex({ "session_id": 1, "status": 1 })

// 状态索引
db.carts.createIndex({ "status": 1, "updated_at": -1 })
db.carts.createIndex({ "expires_at": 1, "status": 1 })

// 恢复索引
db.carts.createIndex({ "recovery.recovery_token": 1 }, { sparse: true })
db.carts.createIndex({ "recovery.email_sent": 1, "status": 1 })

// 营销索引
db.carts.createIndex({ "marketing.campaign_id": 1, "created_at": -1 })
db.carts.createIndex({ "is_deleted": 1 })
```

## 4. 愿望清单表 (wishlists)

用户收藏的商品列表。

### 字段设计

```javascript
{
  // 基础信息
  _id: ObjectId,                    // 愿望清单唯一标识
  user_id: ObjectId,                // 用户ID
  name: String,                     // 清单名称
  description: String,              // 清单描述
  
  // 商品列表
  items: [{
    product_id: ObjectId,           // 商品ID
    variant_id: ObjectId,           // 变体ID
    added_at: Date,                 // 添加时间
    priority: Number,               // 优先级
    notes: String,                  // 备注
    
    // 价格跟踪
    price_tracking: {
      target_price: Number,         // 目标价格
      current_price: Number,        // 当前价格
      lowest_price: Number,         // 历史最低价
      price_alert: Boolean,         // 价格提醒
      last_price_check: Date        // 最后价格检查时间
    }
  }],
  
  // 清单设置
  settings: {
    is_public: Boolean,             // 是否公开
    is_default: Boolean,            // 是否默认清单
    allow_sharing: Boolean,         // 允许分享
    email_notifications: Boolean,   // 邮件通知
    price_alerts: Boolean           // 价格提醒
  },
  
  // 分享信息
  sharing: {
    share_token: String,            // 分享令牌
    share_url: String,              // 分享链接
    shared_with: [{
      email: String,                // 分享邮箱
      shared_at: Date,              // 分享时间
      access_level: String          // 访问级别：view, edit
    }]
  },
  
  // 统计信息
  stats: {
    item_count: Number,             // 商品数量
    total_value: Number,            // 总价值
    view_count: Number,             // 查看次数
    share_count: Number             // 分享次数
  },
  
  // 通用字段
  created_at: Date,
  updated_at: Date,
  is_deleted: Boolean,
  deleted_at: Date
}
```

### 索引设计

```javascript
// 用户索引
db.wishlists.createIndex({ "user_id": 1, "is_deleted": 1 })
db.wishlists.createIndex({ "user_id": 1, "settings.is_default": 1 })

// 分享索引
db.wishlists.createIndex({ "sharing.share_token": 1 }, { sparse: true })
db.wishlists.createIndex({ "settings.is_public": 1, "created_at": -1 })

// 商品索引
db.wishlists.createIndex({ "items.product_id": 1, "user_id": 1 })
db.wishlists.createIndex({ "items.price_tracking.price_alert": 1 })
```

## 数据关系说明

### 关系类型
- **users ↔ orders**: 一对多关系
- **orders ↔ payments**: 一对多关系
- **orders ↔ products**: 多对多关系（通过items）
- **users ↔ carts**: 一对一关系（活跃购物车）
- **users ↔ wishlists**: 一对多关系

### 数据一致性
1. 订单创建时锁定商品价格和库存
2. 支付成功后更新订单状态
3. 购物车过期自动清理
4. 愿望清单价格自动更新

### 业务规则

#### 订单处理流程
1. 购物车 → 订单创建 → 支付处理 → 订单确认 → 履约发货 → 订单完成
2. 支付失败自动取消订单并释放库存
3. 订单取消后自动处理退款
4. 部分发货支持分批处理

#### 支付安全
1. 敏感信息加密存储
2. 支付令牌化处理
3. 风险评估和欺诈检测
4. 3DS认证支持

#### 购物车管理
1. 游客购物车30天过期
2. 注册用户购物车永久保存
3. 商品下架自动从购物车移除
4. 价格变动实时更新

#### 愿望清单功能
1. 价格跟踪和提醒
2. 库存状态监控
3. 社交分享功能
4. 批量操作支持