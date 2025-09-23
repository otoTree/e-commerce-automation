import mongoose, { Schema, Document } from 'mongoose';

// Ozon平台商品上架状态
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'rejected' | 'paused' | 'archived';

// 价格策略类型
export type PricingStrategy = 'cost_plus' | 'market_based' | 'competitive' | 'custom';

// 商品上架接口
export interface IProductListing extends Document {
  // 关联的原始商品ID（来自ProductFullData）
  source_product_id: string;
  
  // 平台信息
  platform: 'ozon';
  platform_listing_id?: string; // Ozon平台生成的商品ID
  
  // 上架商品信息（可编辑的字段）
  listing_info: {
    title: string;
    description: string;
    category_id: string; // Ozon平台分类ID
    brand: string;
    images: string[]; // 图片URL列表
    attributes: Record<string, any>; // 平台特定属性
    keywords: string[]; // SEO关键词
  };
  
  // 定价信息
  pricing: {
    strategy: PricingStrategy;
    cost_price: number; // 成本价（来自1688）
    markup_percentage: number; // 加价百分比
    selling_price: number; // 最终售价
    currency: string;
    min_price?: number; // 最低价格限制
    max_price?: number; // 最高价格限制
  };
  
  // 库存管理
  inventory: {
    stock_quantity: number;
    reserved_quantity: number; // 预留库存
    available_quantity: number; // 可售库存
    low_stock_threshold: number; // 低库存警告阈值
    auto_restock: boolean; // 是否自动补货
  };
  
  // 物流信息
  logistics: {
    weight: number; // 重量（克）
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    shipping_template_id?: string; // 运费模板ID
    processing_time: number; // 处理时间（天）
    delivery_time_min: number; // 最短配送时间（天）
    delivery_time_max: number; // 最长配送时间（天）
  };
  
  // 上架状态
  status: ListingStatus;
  
  // 审核信息
  review_info?: {
    submitted_at?: Date;
    reviewed_at?: Date;
    reviewer_notes?: string;
    rejection_reason?: string;
  };
  
  // 性能数据
  performance: {
    views: number;
    clicks: number;
    orders: number;
    revenue: number;
    conversion_rate: number;
    last_updated: Date;
  };
  
  // 同步信息
  sync_info: {
    last_sync_at?: Date;
    sync_status: 'pending' | 'syncing' | 'success' | 'failed';
    sync_error?: string;
    auto_sync_enabled: boolean;
  };
  
  // 元数据
  meta: {
    created_by: string; // 创建用户ID
    created_at: Date;
    updated_at: Date;
    published_at?: Date; // 发布时间
    archived_at?: Date; // 归档时间
  };
}

// 商品上架Schema
const ProductListingSchema = new Schema<IProductListing>({
  source_product_id: { 
    type: String, 
    required: true,
    ref: 'ProductFullData'
  },
  
  platform: { 
    type: String, 
    required: true, 
    enum: ['ozon'],
    default: 'ozon'
  },
  
  platform_listing_id: { type: String },
  
  listing_info: {
    title: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true, maxlength: 4000 },
    category_id: { type: String, required: true },
    brand: { type: String, required: true },
    images: [{ type: String, required: true }],
    attributes: { type: Schema.Types.Mixed, default: {} },
    keywords: [{ type: String }]
  },
  
  pricing: {
    strategy: { 
      type: String, 
      required: true, 
      enum: ['cost_plus', 'market_based', 'competitive', 'custom'],
      default: 'cost_plus'
    },
    cost_price: { type: Number, required: true, min: 0 },
    markup_percentage: { type: Number, required: true, min: 0, max: 1000 },
    selling_price: { type: Number, required: true, min: 0 },
    currency: { type: String, required: true, default: 'RUB' },
    min_price: { type: Number, min: 0 },
    max_price: { type: Number, min: 0 }
  },
  
  inventory: {
    stock_quantity: { type: Number, required: true, min: 0, default: 0 },
    reserved_quantity: { type: Number, required: true, min: 0, default: 0 },
    low_stock_threshold: { type: Number, required: true, min: 0, default: 10 },
    auto_restock: { type: Boolean, default: false }
  },
  
  logistics: {
    weight: { type: Number, required: true, min: 0 },
    dimensions: {
      length: { type: Number, required: true, min: 0 },
      width: { type: Number, required: true, min: 0 },
      height: { type: Number, required: true, min: 0 }
    },
    shipping_template_id: { type: String },
    processing_time: { type: Number, required: true, min: 1, default: 3 },
    delivery_time_min: { type: Number, required: true, min: 1, default: 7 },
    delivery_time_max: { type: Number, required: true, min: 1, default: 14 }
  },
  
  status: { 
    type: String, 
    required: true, 
    enum: ['draft', 'pending_review', 'active', 'rejected', 'paused', 'archived'],
    default: 'draft'
  },
  
  review_info: {
    submitted_at: { type: Date },
    reviewed_at: { type: Date },
    reviewer_notes: { type: String },
    rejection_reason: { type: String }
  },
  
  performance: {
    views: { type: Number, default: 0, min: 0 },
    clicks: { type: Number, default: 0, min: 0 },
    orders: { type: Number, default: 0, min: 0 },
    revenue: { type: Number, default: 0, min: 0 },
    conversion_rate: { type: Number, default: 0, min: 0, max: 1 },
    last_updated: { type: Date, default: Date.now }
  },
  
  sync_info: {
    last_sync_at: { type: Date },
    sync_status: { 
      type: String, 
      required: true, 
      enum: ['pending', 'syncing', 'success', 'failed'],
      default: 'pending'
    },
    sync_error: { type: String },
    auto_sync_enabled: { type: Boolean, default: true }
  },
  
  meta: {
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    published_at: { type: Date },
    archived_at: { type: Date }
  }
}, {
  timestamps: { createdAt: 'meta.created_at', updatedAt: 'meta.updated_at' }
});

// 索引
ProductListingSchema.index({ source_product_id: 1 });
ProductListingSchema.index({ platform_listing_id: 1 });
ProductListingSchema.index({ status: 1 });
ProductListingSchema.index({ 'meta.created_by': 1 });
ProductListingSchema.index({ 'meta.created_at': -1 });

// 虚拟字段：计算可售库存
ProductListingSchema.virtual('inventory.available_quantity').get(function() {
  return Math.max(0, this.inventory.stock_quantity - this.inventory.reserved_quantity);
});

// 中间件：更新时间戳
ProductListingSchema.pre('save', function(next) {
  this.meta.updated_at = new Date();
  next();
});

// 中间件：计算售价
ProductListingSchema.pre('save', function(next) {
  if (this.pricing.strategy === 'cost_plus') {
    this.pricing.selling_price = this.pricing.cost_price * (1 + this.pricing.markup_percentage / 100);
  }
  next();
});

export const ProductListing = mongoose.model<IProductListing>('ProductListing', ProductListingSchema);