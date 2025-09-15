import mongoose, { Document, Schema } from 'mongoose';

// 购物车接口定义
export interface ICart extends Document {
  // 基础信息
  cart_id: string;
  
  // 用户信息
  user_id?: mongoose.Types.ObjectId; // 注册用户
  session_id?: string; // 游客用户
  
  // 购物车商品
  items: Array<{
    item_id: string;
    product_id: mongoose.Types.ObjectId;
    variant_id?: string;
    sku: string;
    
    // 商品信息
    name: string;
    description?: string;
    image_url?: string;
    
    // 价格信息
    unit_price: number;
    sale_price?: number;
    discount_amount: number;
    
    // 数量
    quantity: number;
    max_quantity?: number; // 最大购买数量
    
    // 商品属性
    attributes: {
      color?: string;
      size?: string;
      [key: string]: any;
    };
    
    // 供应商信息
    supplier?: {
      supplier_id: mongoose.Types.ObjectId;
      name: string;
      shipping_time?: number; // 发货时间（天）
    };
    
    // 库存状态
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    available_quantity: number;
    
    // 商品状态
    is_available: boolean;
    availability_message?: string;
    
    // 配送信息
    shipping: {
      weight?: number;
      dimensions?: {
        length: number;
        width: number;
        height: number;
      };
      shipping_class?: string;
      free_shipping: boolean;
    };
    
    // 时间戳
    added_at: Date;
    updated_at: Date;
    
    // 个性化信息
    personalization?: {
      custom_text?: string;
      custom_image?: string;
      gift_wrap: boolean;
      gift_message?: string;
    };
    
    // 推荐来源
    source?: {
      type: 'search' | 'recommendation' | 'category' | 'promotion' | 'wishlist';
      reference_id?: string;
      campaign_id?: mongoose.Types.ObjectId;
    };
  }>;
  
  // 购物车统计
  summary: {
    total_items: number;
    total_quantity: number;
    subtotal: number;
    total_discount: number;
    estimated_tax: number;
    estimated_shipping: number;
    estimated_total: number;
    
    // 节省金额
    total_savings: number;
    
    // 重量和体积
    total_weight: number;
    total_volume?: number;
  };
  
  // 优惠券
  coupons: Array<{
    coupon_id: mongoose.Types.ObjectId;
    code: string;
    discount_type: 'percentage' | 'fixed' | 'free_shipping';
    discount_value: number;
    discount_amount: number;
    
    // 适用条件
    applicable_items: string[]; // item_id数组
    minimum_amount?: number;
    
    // 状态
    is_valid: boolean;
    error_message?: string;
    
    applied_at: Date;
  }>;
  
  // 配送信息
  shipping_info: {
    // 配送地址
    address?: {
      country: string;
      state: string;
      city: string;
      postal_code: string;
    };
    
    // 配送方式
    method?: {
      method_id: string;
      name: string;
      cost: number;
      estimated_delivery: Date;
    };
    
    // 配送选项
    options: {
      express_delivery: boolean;
      signature_required: boolean;
      insurance: boolean;
      gift_wrap: boolean;
    };
  };
  
  // 支付信息
  payment_info: {
    // 支付方式偏好
    preferred_method?: string;
    
    // 分期付款
    installment_plan?: {
      enabled: boolean;
      plan_id?: string;
      installment_count: number;
      monthly_amount: number;
    };
    
    // 积分使用
    points_to_use: number;
    points_discount: number;
    
    // 礼品卡
    gift_cards: Array<{
      card_id: string;
      balance: number;
      amount_to_use: number;
    }>;
  };
  
  // 购物车状态
  status: 'active' | 'abandoned' | 'converted' | 'merged' | 'expired';
  
  // 购物车类型
  cart_type: 'regular' | 'wishlist' | 'save_for_later' | 'quick_order';
  
  // 会话信息
  session_info: {
    ip_address?: string;
    user_agent?: string;
    device_type?: 'desktop' | 'mobile' | 'tablet';
    
    // 地理位置
    location?: {
      country: string;
      region: string;
      city: string;
    };
    
    // 来源渠道
    source_channel: 'web' | 'mobile_app' | 'api';
    referrer?: string;
    
    // UTM参数
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
  
  // 个性化设置
  preferences: {
    // 货币
    currency: string;
    
    // 语言
    language: string;
    
    // 通知设置
    notifications: {
      price_drop: boolean;
      back_in_stock: boolean;
      cart_reminder: boolean;
    };
    
    // 显示设置
    display: {
      show_recommendations: boolean;
      show_related_products: boolean;
      compact_view: boolean;
    };
  };
  
  // 推荐商品
  recommendations: Array<{
    product_id: mongoose.Types.ObjectId;
    recommendation_type: 'frequently_bought_together' | 'customers_also_viewed' | 'similar_products' | 'upsell' | 'cross_sell';
    score: number;
    reason?: string;
    
    // 推荐算法信息
    algorithm: {
      name: string;
      version: string;
      confidence: number;
    };
    
    generated_at: Date;
  }>;
  
  // 购物车历史
  history: Array<{
    timestamp: Date;
    action: 'item_added' | 'item_removed' | 'item_updated' | 'coupon_applied' | 'coupon_removed' | 'checkout_started' | 'checkout_completed' | 'cart_abandoned';
    
    // 操作详情
    details: {
      item_id?: string;
      product_id?: mongoose.Types.ObjectId;
      quantity_change?: number;
      coupon_code?: string;
      [key: string]: any;
    };
    
    // 会话信息
    session_id?: string;
    ip_address?: string;
  }>;
  
  // 提醒设置
  reminders: {
    // 放弃购物车提醒
    abandonment: {
      enabled: boolean;
      reminder_count: number;
      last_reminder_sent?: Date;
      next_reminder_at?: Date;
    };
    
    // 价格下降提醒
    price_drop: {
      enabled: boolean;
      threshold_percentage: number;
    };
    
    // 库存提醒
    stock_alert: {
      enabled: boolean;
      low_stock_threshold: number;
    };
  };
  
  // 过期设置
  expiration: {
    expires_at?: Date;
    auto_cleanup: boolean;
    
    // 过期策略
    expiry_policy: {
      guest_cart_days: number;
      registered_cart_days: number;
      inactive_days: number;
    };
  };
  
  // 合并信息
  merge_info?: {
    merged_from: mongoose.Types.ObjectId[];
    merged_at: Date;
    merge_strategy: 'combine_quantities' | 'keep_latest' | 'manual_selection';
  };
  
  // 转化信息
  conversion?: {
    converted_to_order: boolean;
    order_id?: mongoose.Types.ObjectId;
    converted_at?: Date;
    conversion_value: number;
  };
  
  // 通用字段
  created_at: Date;
  updated_at: Date;
  last_activity_at: Date;
  is_deleted: boolean;
  deleted_at?: Date;
}

// 购物车Schema定义
const CartSchema = new Schema<ICart>({
  // 基础信息
  cart_id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // 用户信息
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  session_id: {
    type: String,
    index: true
  },
  
  // 购物车商品
  items: [{
    item_id: { type: String, required: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    variant_id: { type: String },
    sku: { type: String, required: true },
    
    name: { type: String, required: true },
    description: { type: String },
    image_url: { type: String },
    
    unit_price: { type: Number, required: true, min: 0 },
    sale_price: { type: Number, min: 0 },
    discount_amount: { type: Number, min: 0, default: 0 },
    
    quantity: { type: Number, required: true, min: 1 },
    max_quantity: { type: Number, min: 1 },
    
    attributes: {
      color: { type: String },
      size: { type: String }
    },
    
    supplier: {
      supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
      name: { type: String },
      shipping_time: { type: Number, min: 0 }
    },
    
    stock_status: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'],
      default: 'in_stock'
    },
    available_quantity: { type: Number, min: 0, default: 0 },
    
    is_available: { type: Boolean, default: true },
    availability_message: { type: String },
    
    shipping: {
      weight: { type: Number, min: 0 },
      dimensions: {
        length: { type: Number, min: 0 },
        width: { type: Number, min: 0 },
        height: { type: Number, min: 0 }
      },
      shipping_class: { type: String },
      free_shipping: { type: Boolean, default: false }
    },
    
    added_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    
    personalization: {
      custom_text: { type: String },
      custom_image: { type: String },
      gift_wrap: { type: Boolean, default: false },
      gift_message: { type: String }
    },
    
    source: {
      type: {
        type: String,
        enum: ['search', 'recommendation', 'category', 'promotion', 'wishlist']
      },
      reference_id: { type: String },
      campaign_id: { type: Schema.Types.ObjectId, ref: 'Campaign' }
    }
  }],
  
  // 购物车统计
  summary: {
    total_items: { type: Number, min: 0, default: 0 },
    total_quantity: { type: Number, min: 0, default: 0 },
    subtotal: { type: Number, min: 0, default: 0 },
    total_discount: { type: Number, min: 0, default: 0 },
    estimated_tax: { type: Number, min: 0, default: 0 },
    estimated_shipping: { type: Number, min: 0, default: 0 },
    estimated_total: { type: Number, min: 0, default: 0 },
    total_savings: { type: Number, min: 0, default: 0 },
    total_weight: { type: Number, min: 0, default: 0 },
    total_volume: { type: Number, min: 0 }
  },
  
  // 优惠券
  coupons: [{
    coupon_id: { type: Schema.Types.ObjectId, ref: 'Coupon', required: true },
    code: { type: String, required: true },
    discount_type: {
      type: String,
      enum: ['percentage', 'fixed', 'free_shipping'],
      required: true
    },
    discount_value: { type: Number, required: true },
    discount_amount: { type: Number, required: true, min: 0 },
    applicable_items: [{ type: String }],
    minimum_amount: { type: Number, min: 0 },
    is_valid: { type: Boolean, default: true },
    error_message: { type: String },
    applied_at: { type: Date, default: Date.now }
  }],
  
  // 配送信息
  shipping_info: {
    address: {
      country: { type: String },
      state: { type: String },
      city: { type: String },
      postal_code: { type: String }
    },
    
    method: {
      method_id: { type: String },
      name: { type: String },
      cost: { type: Number, min: 0 },
      estimated_delivery: { type: Date }
    },
    
    options: {
      express_delivery: { type: Boolean, default: false },
      signature_required: { type: Boolean, default: false },
      insurance: { type: Boolean, default: false },
      gift_wrap: { type: Boolean, default: false }
    }
  },
  
  // 支付信息
  payment_info: {
    preferred_method: { type: String },
    
    installment_plan: {
      enabled: { type: Boolean, default: false },
      plan_id: { type: String },
      installment_count: { type: Number, min: 1 },
      monthly_amount: { type: Number, min: 0 }
    },
    
    points_to_use: { type: Number, min: 0, default: 0 },
    points_discount: { type: Number, min: 0, default: 0 },
    
    gift_cards: [{
      card_id: { type: String, required: true },
      balance: { type: Number, required: true, min: 0 },
      amount_to_use: { type: Number, required: true, min: 0 }
    }]
  },
  
  // 购物车状态
  status: {
    type: String,
    enum: ['active', 'abandoned', 'converted', 'merged', 'expired'],
    default: 'active'
  },
  
  // 购物车类型
  cart_type: {
    type: String,
    enum: ['regular', 'wishlist', 'save_for_later', 'quick_order'],
    default: 'regular'
  },
  
  // 会话信息
  session_info: {
    ip_address: { type: String },
    user_agent: { type: String },
    device_type: {
      type: String,
      enum: ['desktop', 'mobile', 'tablet']
    },
    
    location: {
      country: { type: String },
      region: { type: String },
      city: { type: String }
    },
    
    source_channel: {
      type: String,
      enum: ['web', 'mobile_app', 'api'],
      default: 'web'
    },
    referrer: { type: String },
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String }
  },
  
  // 个性化设置
  preferences: {
    currency: { type: String, default: 'USD' },
    language: { type: String, default: 'en' },
    
    notifications: {
      price_drop: { type: Boolean, default: true },
      back_in_stock: { type: Boolean, default: true },
      cart_reminder: { type: Boolean, default: true }
    },
    
    display: {
      show_recommendations: { type: Boolean, default: true },
      show_related_products: { type: Boolean, default: true },
      compact_view: { type: Boolean, default: false }
    }
  },
  
  // 推荐商品
  recommendations: [{
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    recommendation_type: {
      type: String,
      enum: ['frequently_bought_together', 'customers_also_viewed', 'similar_products', 'upsell', 'cross_sell'],
      required: true
    },
    score: { type: Number, required: true, min: 0, max: 1 },
    reason: { type: String },
    
    algorithm: {
      name: { type: String, required: true },
      version: { type: String, required: true },
      confidence: { type: Number, required: true, min: 0, max: 1 }
    },
    
    generated_at: { type: Date, default: Date.now }
  }],
  
  // 购物车历史
  history: [{
    timestamp: { type: Date, default: Date.now },
    action: {
      type: String,
      enum: ['item_added', 'item_removed', 'item_updated', 'coupon_applied', 'coupon_removed', 'checkout_started', 'checkout_completed', 'cart_abandoned'],
      required: true
    },
    details: {
      item_id: { type: String },
      product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
      quantity_change: { type: Number },
      coupon_code: { type: String }
    },
    session_id: { type: String },
    ip_address: { type: String }
  }],
  
  // 提醒设置
  reminders: {
    abandonment: {
      enabled: { type: Boolean, default: true },
      reminder_count: { type: Number, min: 0, default: 0 },
      last_reminder_sent: { type: Date },
      next_reminder_at: { type: Date }
    },
    
    price_drop: {
      enabled: { type: Boolean, default: false },
      threshold_percentage: { type: Number, min: 0, max: 100, default: 10 }
    },
    
    stock_alert: {
      enabled: { type: Boolean, default: false },
      low_stock_threshold: { type: Number, min: 0, default: 5 }
    }
  },
  
  // 过期设置
  expiration: {
    expires_at: { type: Date },
    auto_cleanup: { type: Boolean, default: true },
    
    expiry_policy: {
      guest_cart_days: { type: Number, min: 1, default: 7 },
      registered_cart_days: { type: Number, min: 1, default: 30 },
      inactive_days: { type: Number, min: 1, default: 90 }
    }
  },
  
  // 合并信息
  merge_info: {
    merged_from: [{ type: Schema.Types.ObjectId, ref: 'Cart' }],
    merged_at: { type: Date },
    merge_strategy: {
      type: String,
      enum: ['combine_quantities', 'keep_latest', 'manual_selection']
    }
  },
  
  // 转化信息
  conversion: {
    converted_to_order: { type: Boolean, default: false },
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    converted_at: { type: Date },
    conversion_value: { type: Number, min: 0, default: 0 }
  },
  
  // 通用字段
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  last_activity_at: { type: Date, default: Date.now },
  is_deleted: { type: Boolean, default: false },
  deleted_at: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引
CartSchema.index({ cart_id: 1 }, { unique: true });
CartSchema.index({ user_id: 1 });
CartSchema.index({ session_id: 1 });
CartSchema.index({ status: 1 });
CartSchema.index({ cart_type: 1 });
CartSchema.index({ created_at: -1 });
CartSchema.index({ last_activity_at: -1 });
CartSchema.index({ is_deleted: 1 });

// 复合索引
CartSchema.index({ user_id: 1, status: 1 });
CartSchema.index({ session_id: 1, status: 1 });
CartSchema.index({ status: 1, last_activity_at: -1 });
CartSchema.index({ 'expiration.expires_at': 1, status: 1 });

// 中间件
// 保存前生成cart_id
CartSchema.pre('save', function(next) {
  if (!this.cart_id) {
    this.cart_id = `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  next();
});

// 更新时间戳和活动时间
CartSchema.pre('save', function(next) {
  this.updated_at = new Date();
  this.last_activity_at = new Date();
  next();
});

// 保存前计算购物车统计
CartSchema.pre('save', function(next) {
  (this as any).calculateSummary();
  next();
});

// 虚拟字段
// 是否为空购物车
CartSchema.virtual('is_empty').get(function() {
  return this.items.length === 0;
});

// 是否有库存不足的商品
CartSchema.virtual('has_stock_issues').get(function() {
  return this.items.some((item: any) => 
    item.stock_status === 'out_of_stock' || 
    item.quantity > item.available_quantity
  );
});

// 是否有不可用的商品
CartSchema.virtual('has_unavailable_items').get(function() {
  return this.items.some((item: any) => !item.is_available);
});

// 购物车年龄（天）
CartSchema.virtual('age_in_days').get(function() {
  const now = new Date();
  const created = new Date(this.created_at);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
});

// 最后活动时间（小时前）
CartSchema.virtual('hours_since_last_activity').get(function() {
  const now = new Date();
  const lastActivity = new Date(this.last_activity_at);
  return Math.floor((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60));
});

// 静态方法
// 根据用户查找购物车
CartSchema.statics.findByUser = function(userId: string, cartType: string = 'regular') {
  return this.findOne({
    user_id: userId,
    cart_type: cartType,
    status: 'active',
    is_deleted: false
  });
};

// 根据会话查找购物车
CartSchema.statics.findBySession = function(sessionId: string, cartType: string = 'regular') {
  return this.findOne({
    session_id: sessionId,
    cart_type: cartType,
    status: 'active',
    is_deleted: false
  });
};

// 查找放弃的购物车
CartSchema.statics.findAbandonedCarts = function(hoursAgo: number = 24) {
  const cutoffTime = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
  
  return this.find({
    status: 'active',
    last_activity_at: { $lt: cutoffTime },
    'summary.total_items': { $gt: 0 },
    is_deleted: false
  });
};

// 查找过期的购物车
CartSchema.statics.findExpiredCarts = function() {
  return this.find({
    'expiration.expires_at': { $lt: new Date() },
    status: { $ne: 'expired' },
    is_deleted: false
  });
};

// 清理过期购物车
CartSchema.statics.cleanupExpiredCarts = function() {
  return this.updateMany(
    {
      'expiration.expires_at': { $lt: new Date() },
      'expiration.auto_cleanup': true,
      status: { $ne: 'expired' }
    },
    {
      status: 'expired',
      updated_at: new Date()
    }
  );
};

// 实例方法
// 添加商品到购物车
CartSchema.methods.addItem = function(itemData: any) {
  const existingItemIndex = this.items.findIndex(
    (item: any) => 
      item.product_id.toString() === itemData.product_id.toString() &&
      item.variant_id === itemData.variant_id
  );
  
  if (existingItemIndex >= 0) {
    // 更新现有商品数量
    this.items[existingItemIndex].quantity += itemData.quantity || 1;
    this.items[existingItemIndex].updated_at = new Date();
  } else {
    // 添加新商品
    const newItem = {
      item_id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      ...itemData,
      added_at: new Date(),
      updated_at: new Date()
    };
    this.items.push(newItem);
  }
  
  // 记录历史
  this.addHistory('item_added', {
    product_id: itemData.product_id,
    quantity_change: itemData.quantity || 1
  });
  
  return this.save();
};

// 更新商品数量
CartSchema.methods.updateItemQuantity = function(itemId: string, newQuantity: number) {
  const item = this.items.find((item: any) => item.item_id === itemId);
  
  if (!item) {
    throw new Error('Item not found in cart');
  }
  
  const oldQuantity = item.quantity;
  item.quantity = newQuantity;
  item.updated_at = new Date();
  
  // 记录历史
  this.addHistory('item_updated', {
    item_id: itemId,
    product_id: item.product_id,
    quantity_change: newQuantity - oldQuantity
  });
  
  return this.save();
};

// 移除商品
CartSchema.methods.removeItem = function(itemId: string) {
  const itemIndex = this.items.findIndex((item: any) => item.item_id === itemId);
  
  if (itemIndex === -1) {
    throw new Error('Item not found in cart');
  }
  
  const removedItem = this.items[itemIndex];
  this.items.splice(itemIndex, 1);
  
  // 记录历史
  this.addHistory('item_removed', {
    item_id: itemId,
    product_id: removedItem.product_id,
    quantity_change: -removedItem.quantity
  });
  
  return this.save();
};

// 清空购物车
CartSchema.methods.clearCart = function() {
  this.items = [];
  this.coupons = [];
  
  // 记录历史
  this.addHistory('cart_cleared', {});
  
  return this.save();
};

// 应用优惠券
CartSchema.methods.applyCoupon = function(couponData: any) {
  // 检查优惠券是否已应用
  const existingCoupon = this.coupons.find(
    (coupon: any) => coupon.code === couponData.code
  );
  
  if (existingCoupon) {
    throw new Error('Coupon already applied');
  }
  
  this.coupons.push({
    ...couponData,
    applied_at: new Date()
  });
  
  // 记录历史
  this.addHistory('coupon_applied', {
    coupon_code: couponData.code
  });
  
  return this.save();
};

// 移除优惠券
CartSchema.methods.removeCoupon = function(couponCode: string) {
  const couponIndex = this.coupons.findIndex(
    (coupon: any) => coupon.code === couponCode
  );
  
  if (couponIndex === -1) {
    throw new Error('Coupon not found');
  }
  
  this.coupons.splice(couponIndex, 1);
  
  // 记录历史
  this.addHistory('coupon_removed', {
    coupon_code: couponCode
  });
  
  return this.save();
};

// 计算购物车统计
CartSchema.methods.calculateSummary = function() {
  const summary = {
    total_items: this.items.length,
    total_quantity: 0,
    subtotal: 0,
    total_discount: 0,
    estimated_tax: 0,
    estimated_shipping: 0,
    estimated_total: 0,
    total_savings: 0,
    total_weight: 0,
    total_volume: 0
  };
  
  // 计算商品统计
  this.items.forEach((item: any) => {
    summary.total_quantity += item.quantity;
    summary.subtotal += (item.sale_price || item.unit_price) * item.quantity;
    summary.total_discount += item.discount_amount * item.quantity;
    summary.total_weight += (item.shipping.weight || 0) * item.quantity;
    
    // 计算节省金额
    if (item.sale_price && item.sale_price < item.unit_price) {
      summary.total_savings += (item.unit_price - item.sale_price) * item.quantity;
    }
  });
  
  // 计算优惠券折扣
  this.coupons.forEach((coupon: any) => {
    if (coupon.is_valid) {
      summary.total_discount += coupon.discount_amount;
    }
  });
  
  // 计算预估税费（这里需要根据实际税率计算）
  summary.estimated_tax = summary.subtotal * 0.08; // 假设8%税率
  
  // 计算预估运费（这里需要根据实际运费规则计算）
  summary.estimated_shipping = summary.total_weight > 0 ? Math.max(5, summary.total_weight * 0.5) : 0;
  
  // 计算总计
  summary.estimated_total = summary.subtotal - summary.total_discount + summary.estimated_tax + summary.estimated_shipping;
  
  this.summary = summary;
};

// 添加历史记录
CartSchema.methods.addHistory = function(action: string, details: any) {
  this.history.push({
    timestamp: new Date(),
    action,
    details,
    session_id: this.session_id,
    ip_address: this.session_info?.ip_address
  });
};

// 合并购物车
CartSchema.methods.mergeWith = function(otherCart: any, strategy: string = 'combine_quantities') {
  const mergedItems = [...this.items];
  
  otherCart.items.forEach((otherItem: any) => {
    const existingItemIndex = mergedItems.findIndex(
      (item: any) => 
        item.product_id.toString() === otherItem.product_id.toString() &&
        item.variant_id === otherItem.variant_id
    );
    
    if (existingItemIndex >= 0) {
      if (strategy === 'combine_quantities') {
        mergedItems[existingItemIndex].quantity += otherItem.quantity;
      } else if (strategy === 'keep_latest') {
        mergedItems[existingItemIndex] = otherItem;
      }
    } else {
      mergedItems.push(otherItem);
    }
  });
  
  this.items = mergedItems;
  this.merge_info = {
    merged_from: [otherCart._id],
    merged_at: new Date(),
    merge_strategy: strategy as any
  };
  
  // 标记被合并的购物车
  otherCart.status = 'merged';
  
  return Promise.all([this.save(), otherCart.save()]);
};

// 转换为订单
CartSchema.methods.convertToOrder = function(orderId: string) {
  this.conversion = {
    converted_to_order: true,
    order_id: orderId as any,
    converted_at: new Date(),
    conversion_value: this.summary.estimated_total
  };
  
  this.status = 'converted';
  
  // 记录历史
  this.addHistory('checkout_completed', {
    order_id: orderId,
    conversion_value: this.summary.estimated_total
  });
  
  return this.save();
};

// 设置过期时间
CartSchema.methods.setExpiration = function() {
  const policy = this.expiration.expiry_policy;
  const days = this.user_id ? policy.registered_cart_days : policy.guest_cart_days;
  
  this.expiration.expires_at = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  
  return this.save();
};

// 创建并导出模型
export const Cart = mongoose.model<ICart>('Cart', CartSchema);
export default Cart;