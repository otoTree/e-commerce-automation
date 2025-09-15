import mongoose, { Document, Schema } from 'mongoose';

// 订单接口定义
export interface IOrder extends Document {
  // 基础信息
  order_id: string;
  order_number: string;
  
  // 客户信息
  customer: {
    user_id: mongoose.Types.ObjectId;
    email: string;
    phone?: string;
    
    // 客户类型
    customer_type: 'registered' | 'guest';
    
    // 客户标签
    tags: string[];
  };
  
  // 订单商品
  items: Array<{
    product_id: mongoose.Types.ObjectId;
    variant_id?: string;
    sku: string;
    name: string;
    
    // 价格信息
    unit_price: number;
    sale_price?: number;
    discount_amount: number;
    tax_amount: number;
    
    // 数量
    quantity: number;
    
    // 小计
    subtotal: number;
    total: number;
    
    // 商品属性
    attributes: {
      color?: string;
      size?: string;
      [key: string]: any;
    };
    
    // 商品图片
    image_url?: string;
    
    // 供应商信息
    supplier?: {
      supplier_id: mongoose.Types.ObjectId;
      name: string;
      commission_rate: number;
    };
    
    // 履约状态
    fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
    
    // 退换货信息
    return_info?: {
      returnable: boolean;
      return_deadline?: Date;
      return_reason?: string;
      return_status?: 'requested' | 'approved' | 'rejected' | 'completed';
    };
  }>;
  
  // 价格明细
  pricing: {
    subtotal: number; // 商品小计
    discount_total: number; // 总折扣
    tax_total: number; // 总税费
    shipping_total: number; // 运费
    handling_fee: number; // 手续费
    total: number; // 订单总额
    
    // 优惠券
    coupons: Array<{
      coupon_id: mongoose.Types.ObjectId;
      code: string;
      discount_type: 'percentage' | 'fixed' | 'free_shipping';
      discount_value: number;
      discount_amount: number;
    }>;
    
    // 积分抵扣
    points_discount?: {
      points_used: number;
      discount_amount: number;
      exchange_rate: number;
    };
    
    // 税费明细
    tax_breakdown: Array<{
      tax_type: string;
      tax_rate: number;
      taxable_amount: number;
      tax_amount: number;
    }>;
  };
  
  // 配送信息
  shipping: {
    // 配送地址
    address: {
      recipient_name: string;
      phone: string;
      country: string;
      state: string;
      city: string;
      postal_code: string;
      address_line1: string;
      address_line2?: string;
      
      // 地理坐标
      coordinates?: {
        latitude: number;
        longitude: number;
      };
    };
    
    // 配送方式
    method: {
      method_id: string;
      name: string;
      carrier: string;
      service_type: 'standard' | 'express' | 'overnight' | 'pickup';
      estimated_delivery: Date;
      tracking_number?: string;
    };
    
    // 配送状态
    status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
    
    // 配送时间
    shipped_at?: Date;
    delivered_at?: Date;
    
    // 配送备注
    notes?: string;
    
    // 配送跟踪
    tracking_events: Array<{
      timestamp: Date;
      status: string;
      location?: string;
      description: string;
    }>;
  };
  
  // 账单信息
  billing: {
    // 账单地址
    address: {
      name: string;
      company?: string;
      country: string;
      state: string;
      city: string;
      postal_code: string;
      address_line1: string;
      address_line2?: string;
    };
    
    // 税务信息
    tax_info: {
      tax_id?: string;
      tax_exempt: boolean;
      tax_certificate?: string;
    };
  };
  
  // 支付信息
  payment: {
    // 支付状态
    status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
    
    // 支付方式
    method: {
      type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'digital_wallet';
      provider: string;
      last_four?: string;
      brand?: string;
    };
    
    // 支付交易
    transactions: Array<{
      transaction_id: string;
      type: 'payment' | 'refund' | 'chargeback';
      amount: number;
      currency: string;
      status: 'pending' | 'completed' | 'failed' | 'cancelled';
      gateway_response?: any;
      processed_at?: Date;
      
      // 手续费
      fees: {
        gateway_fee: number;
        processing_fee: number;
        total_fee: number;
      };
    }>;
    
    // 分期付款
    installments?: {
      enabled: boolean;
      plan_id?: string;
      installment_count: number;
      installment_amount: number;
      next_payment_date?: Date;
    };
  };
  
  // 订单状态
  status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
  
  // 订单来源
  source: {
    channel: 'web' | 'mobile_app' | 'api' | 'admin' | 'marketplace';
    platform?: string;
    campaign_id?: mongoose.Types.ObjectId;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  
  // 订单标签和分类
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // 订单备注
  notes: {
    customer_notes?: string;
    internal_notes?: string;
    gift_message?: string;
  };
  
  // 订单历史
  history: Array<{
    timestamp: Date;
    action: string;
    status_from?: string;
    status_to?: string;
    user_id?: mongoose.Types.ObjectId;
    user_type: 'customer' | 'admin' | 'system';
    description: string;
    metadata?: any;
  }>;
  
  // 风险评估
  risk_assessment: {
    risk_level: 'low' | 'medium' | 'high';
    risk_score: number;
    
    // 风险因素
    risk_factors: Array<{
      factor: string;
      score: number;
      description: string;
    }>;
    
    // 欺诈检测
    fraud_check: {
      checked: boolean;
      score?: number;
      result?: 'pass' | 'review' | 'decline';
      provider?: string;
      details?: any;
    };
  };
  
  // 库存预留
  inventory_reservation: {
    reserved: boolean;
    reserved_at?: Date;
    expires_at?: Date;
    
    // 预留详情
    reservations: Array<{
      product_id: mongoose.Types.ObjectId;
      variant_id?: string;
      quantity: number;
      warehouse_id?: string;
    }>;
  };
  
  // 订单指标
  metrics: {
    // 时间指标
    time_to_ship?: number; // 发货时间（小时）
    time_to_deliver?: number; // 配送时间（小时）
    processing_time?: number; // 处理时间（小时）
    
    // 成本指标
    cost_of_goods: number;
    shipping_cost: number;
    total_cost: number;
    profit_margin: number;
    
    // 客户指标
    customer_lifetime_value?: number;
    customer_acquisition_cost?: number;
  };
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  created_by?: mongoose.Types.ObjectId;
  updated_by?: mongoose.Types.ObjectId;
  is_deleted: boolean;
  deleted_at?: Date;
  deleted_by?: mongoose.Types.ObjectId;
}

// 订单Schema定义
const OrderSchema = new Schema<IOrder>({
  // 基础信息
  order_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  order_number: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // 客户信息
  customer: {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    customer_type: {
      type: String,
      enum: ['registered', 'guest'],
      default: 'registered'
    },
    tags: [{ type: String }]
  },
  
  // 订单商品
  items: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: String },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    
    unit_price: { type: Number, required: true, min: 0 },
    sale_price: { type: Number, min: 0 },
    discount_amount: { type: Number, min: 0, default: 0 },
    tax_amount: { type: Number, min: 0, default: 0 },
    
    quantity: { type: Number, required: true, min: 1 },
    
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    
    attributes: {
      color: { type: String },
      size: { type: String }
    },
    
    image_url: { type: String },
    
    supplier: {
      supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
      name: { type: String },
      commission_rate: { type: Number, min: 0, max: 1 }
    },
    
    fulfillment_status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    
    return_info: {
      returnable: { type: Boolean, default: true },
      return_deadline: { type: Date },
      return_reason: { type: String },
      return_status: {
        type: String,
        enum: ['requested', 'approved', 'rejected', 'completed']
      }
    }
  }],
  
  // 价格明细
  pricing: {
    subtotal: { type: Number, required: true, min: 0 },
    discount_total: { type: Number, min: 0, default: 0 },
    tax_total: { type: Number, min: 0, default: 0 },
    shipping_total: { type: Number, min: 0, default: 0 },
    handling_fee: { type: Number, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },
    
    coupons: [{
      coupon_id: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
      code: { type: String, required: true },
      discount_type: {
        type: String,
        enum: ['percentage', 'fixed', 'free_shipping'],
        required: true
      },
      discount_value: { type: Number, required: true },
      discount_amount: { type: Number, required: true, min: 0 }
    }],
    
    points_discount: {
      points_used: { type: Number, min: 0 },
      discount_amount: { type: Number, min: 0 },
      exchange_rate: { type: Number, min: 0 }
    },
    
    tax_breakdown: [{
      tax_type: { type: String, required: true },
      tax_rate: { type: Number, required: true, min: 0 },
      taxable_amount: { type: Number, required: true, min: 0 },
      tax_amount: { type: Number, required: true, min: 0 }
    }]
  },
  
  // 配送信息
  shipping: {
    address: {
      recipient_name: { type: String, required: true },
      phone: { type: String, required: true },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      postal_code: { type: String, required: true },
      address_line1: { type: String, required: true },
      address_line2: { type: String },
      
      coordinates: {
        latitude: { type: Number, min: -90, max: 90 },
        longitude: { type: Number, min: -180, max: 180 }
      }
    },
    
    method: {
      method_id: { type: String, required: true },
      name: { type: String, required: true },
      carrier: { type: String, required: true },
      service_type: {
        type: String,
        enum: ['standard', 'express', 'overnight', 'pickup'],
        default: 'standard'
      },
      estimated_delivery: { type: Date, required: true },
      tracking_number: { type: String }
    },
    
    status: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed'],
      default: 'pending'
    },
    
    shipped_at: { type: Date },
    delivered_at: { type: Date },
    notes: { type: String },
    
    tracking_events: [{
      timestamp: { type: Date, required: true },
      status: { type: String, required: true },
      location: { type: String },
      description: { type: String, required: true }
    }]
  },
  
  // 账单信息
  billing: {
    address: {
      name: { type: String, required: true },
      company: { type: String },
      country: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      postal_code: { type: String, required: true },
      address_line1: { type: String, required: true },
      address_line2: { type: String }
    },
    
    tax_info: {
      tax_id: { type: String },
      tax_exempt: { type: Boolean, default: false },
      tax_certificate: { type: String }
    }
  },
  
  // 支付信息
  payment: {
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    
    method: {
      type: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery', 'digital_wallet'],
        required: true
      },
      provider: { type: String, required: true },
      last_four: { type: String },
      brand: { type: String }
    },
    
    transactions: [{
      transaction_id: { type: String, required: true },
      type: {
        type: String,
        enum: ['payment', 'refund', 'chargeback'],
        required: true
      },
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true, default: 'USD' },
      status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'cancelled'],
        required: true
      },
      gateway_response: { type: Schema.Types.Mixed },
      processed_at: { type: Date },
      
      fees: {
        gateway_fee: { type: Number, min: 0, default: 0 },
        processing_fee: { type: Number, min: 0, default: 0 },
        total_fee: { type: Number, min: 0, default: 0 }
      }
    }],
    
    installments: {
      enabled: { type: Boolean, default: false },
      plan_id: { type: String },
      installment_count: { type: Number, min: 1 },
      installment_amount: { type: Number, min: 0 },
      next_payment_date: { type: Date }
    }
  },
  
  // 订单状态
  status: {
    type: String,
    enum: ['draft', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  
  // 订单来源
  source: {
    channel: {
      type: String,
      enum: ['web', 'mobile_app', 'api', 'admin', 'marketplace'],
      required: true
    },
    platform: { type: String },
    campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    referrer: { type: String },
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String }
  },
  
  // 订单标签和分类
  tags: [{ type: String }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // 订单备注
  notes: {
    customer_notes: { type: String },
    internal_notes: { type: String },
    gift_message: { type: String }
  },
  
  // 订单历史
  history: [{
    timestamp: { type: Date, default: Date.now },
    action: { type: String, required: true },
    status_from: { type: String },
    status_to: { type: String },
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    user_type: {
      type: String,
      enum: ['customer', 'admin', 'system'],
      required: true
    },
    description: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed }
  }],
  
  // 风险评估
  risk_assessment: {
    risk_level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    risk_score: { type: Number, min: 0, max: 100, default: 0 },
    
    risk_factors: [{
      factor: { type: String, required: true },
      score: { type: Number, required: true, min: 0 },
      description: { type: String, required: true }
    }],
    
    fraud_check: {
      checked: { type: Boolean, default: false },
      score: { type: Number, min: 0, max: 100 },
      result: {
        type: String,
        enum: ['pass', 'review', 'decline']
      },
      provider: { type: String },
      details: { type: Schema.Types.Mixed }
    }
  },
  
  // 库存预留
  inventory_reservation: {
    reserved: { type: Boolean, default: false },
    reserved_at: { type: Date },
    expires_at: { type: Date },
    
    reservations: [{
      product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      variant_id: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      warehouse_id: { type: String }
    }]
  },
  
  // 订单指标
  metrics: {
    time_to_ship: { type: Number, min: 0 },
    time_to_deliver: { type: Number, min: 0 },
    processing_time: { type: Number, min: 0 },
    
    cost_of_goods: { type: Number, min: 0, default: 0 },
    shipping_cost: { type: Number, min: 0, default: 0 },
    total_cost: { type: Number, min: 0, default: 0 },
    profit_margin: { type: Number, default: 0 },
    
    customer_lifetime_value: { type: Number, min: 0 },
    customer_acquisition_cost: { type: Number, min: 0 }
  },
  
  // 通用字段
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date },
  deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
OrderSchema.index({ order_id: 1 }, { unique: true });
OrderSchema.index({ order_number: 1 }, { unique: true });
OrderSchema.index({ 'customer.user_id': 1 });
OrderSchema.index({ 'customer.email': 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ 'payment.status': 1 });
OrderSchema.index({ 'shipping.status': 1 });
OrderSchema.index({ created_at: -1 });
OrderSchema.index({ is_deleted: 1 });

// 复合索引
OrderSchema.index({ status: 1, created_at: -1 });
OrderSchema.index({ 'customer.user_id': 1, status: 1 });
OrderSchema.index({ 'payment.status': 1, 'shipping.status': 1 });

// 文本搜索索引
OrderSchema.index({
  order_number: 'text',
  'customer.email': 'text',
  'shipping.address.recipient_name': 'text'
});

// 中间件
// 保存前生成order_id和order_number
OrderSchema.pre('save', function(next) {
  if (!this.order_id) {
    this.order_id = `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!this.order_number) {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.order_number = `ORD-${timestamp.slice(-8)}-${random}`;
  }
  
  next();
});

// 更新时间戳
OrderSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// 虚拟字段
// 订单总商品数量
OrderSchema.virtual('total_quantity').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// 是否已支付
OrderSchema.virtual('is_paid').get(function() {
  return this.payment.status === 'paid';
});

// 是否已发货
OrderSchema.virtual('is_shipped').get(function() {
  return ['shipped', 'in_transit', 'delivered'].includes(this.shipping.status);
});

// 是否已完成
OrderSchema.virtual('is_completed').get(function() {
  return this.status === 'completed';
});

// 可退款金额
OrderSchema.virtual('refundable_amount').get(function() {
  const paidTransactions = this.payment.transactions.filter(
    (t: any) => t.type === 'payment' && t.status === 'completed'
  );
  const refundedTransactions = this.payment.transactions.filter(
    (t: any) => t.type === 'refund' && t.status === 'completed'
  );
  
  const paidAmount = paidTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  const refundedAmount = refundedTransactions.reduce((sum: number, t: any) => sum + t.amount, 0);
  
  return Math.max(0, paidAmount - refundedAmount);
});

// 静态方法
// 根据状态查找订单
OrderSchema.statics.findByStatus = function(status: string) {
  return this.find({ status, is_deleted: false });
};

// 根据客户查找订单
OrderSchema.statics.findByCustomer = function(userId: string) {
  return this.find({ 'customer.user_id': userId, is_deleted: false })
    .sort({ created_at: -1 });
};

// 查找待处理订单
OrderSchema.statics.findPendingOrders = function() {
  return this.find({
    status: { $in: ['pending', 'confirmed'] },
    is_deleted: false
  }).sort({ priority: -1, created_at: 1 });
};

// 搜索订单
OrderSchema.statics.search = function(query: string, filters: any = {}) {
  const searchQuery: any = {
    $text: { $search: query },
    is_deleted: false,
    ...filters
  };
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

// 实例方法
// 更新订单状态
OrderSchema.methods.updateStatus = function(newStatus: string, userId?: string, description?: string) {
  const historyEntry = {
    timestamp: new Date(),
    action: 'status_change',
    status_from: this.status,
    status_to: newStatus,
    user_id: userId,
    user_type: userId ? 'admin' : 'system',
    description: description || `Status changed from ${this.status} to ${newStatus}`,
    metadata: { previous_status: this.status }
  };
  
  this.history.push(historyEntry);
  this.status = newStatus as any;
  
  return this.save();
};

// 添加支付交易
OrderSchema.methods.addPaymentTransaction = function(transaction: any) {
  this.payment.transactions.push(transaction);
  
  // 更新支付状态
  const completedPayments = this.payment.transactions.filter(
    (t: any) => t.type === 'payment' && t.status === 'completed'
  );
  const totalPaid = completedPayments.reduce((sum: number, t: any) => sum + t.amount, 0);
  
  if (totalPaid >= this.pricing.total) {
    this.payment.status = 'paid';
  } else if (totalPaid > 0) {
    this.payment.status = 'partially_refunded';
  }
  
  return this.save();
};

// 预留库存
OrderSchema.methods.reserveInventory = function() {
  const reservations = this.items.map((item: any) => ({
    product_id: item.product_id,
    variant_id: item.variant_id,
    quantity: item.quantity
  }));
  
  this.inventory_reservation = {
    reserved: true,
    reserved_at: new Date(),
    expires_at: new Date(Date.now() + 30 * 60 * 1000), // 30分钟后过期
    reservations
  };
  
  return this.save();
};

// 释放库存预留
OrderSchema.methods.releaseInventoryReservation = function() {
  this.inventory_reservation.reserved = false;
  this.inventory_reservation.expires_at = new Date();
  
  return this.save();
};

// 计算订单指标
OrderSchema.methods.calculateMetrics = function() {
  // 计算商品成本
  const costOfGoods = this.items.reduce((total: number, item: any) => {
    // 这里应该从商品数据中获取成本价
    return total + (item.unit_price * 0.6 * item.quantity); // 假设成本是售价的60%
  }, 0);
  
  // 计算利润率
  const revenue = this.pricing.total - this.pricing.shipping_total;
  const totalCost = costOfGoods + this.pricing.shipping_total;
  const profitMargin = revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0;
  
  this.metrics = {
    ...this.metrics,
    cost_of_goods: costOfGoods,
    shipping_cost: this.pricing.shipping_total,
    total_cost: totalCost,
    profit_margin: profitMargin
  };
  
  return this.save();
};

// 添加跟踪事件
OrderSchema.methods.addTrackingEvent = function(status: string, location?: string, description?: string) {
  const event = {
    timestamp: new Date(),
    status,
    location,
    description: description || `Package ${status}`
  };
  
  this.shipping.tracking_events.push(event);
  
  // 更新配送状态
  if (['shipped', 'in_transit', 'delivered'].includes(status)) {
    this.shipping.status = status as any;
    
    if (status === 'shipped' && !this.shipping.shipped_at) {
      this.shipping.shipped_at = new Date();
    }
    
    if (status === 'delivered' && !this.shipping.delivered_at) {
      this.shipping.delivered_at = new Date();
      this.status = 'delivered';
    }
  }
  
  return this.save();
};

// 创建并导出模型
export const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;