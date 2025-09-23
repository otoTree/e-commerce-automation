import mongoose, { Schema, Document } from 'mongoose';

// 价格历史点接口
interface IPricePoint {
  price: number;
  date: Date;
}

// 商品全量数据接口
export interface IProductFullData extends Document {
  // 基础标识
  platform: 'alibaba' | 'ozon' | 'other';
  platform_product_id: string;
  
  // 基础信息（全量收集）
  basic_info: {
    title: string;
    description: string;
    category: string;
    brand?: string;
    images: string[];
    specifications: Record<string, any>;
  };
  
  // 价格信息（全量收集）
  pricing: {
    current_price: number;
    original_price?: number;
    currency: string;
    price_history: IPricePoint[];
  };
  
  // 销售数据（全量收集）
  sales_data: {
    sales_volume: number;
    review_count: number;
    rating: number;
    stock_quantity?: number;
  };
  
  // 供应商信息（全量收集）
  supplier: {
    name: string;
    location: string;
    rating: number;
    years_in_business?: number;
  };
  
  // 收集元数据
  collection_meta: {
    collected_at: Date;
    collection_duration: number; // 收集耗时（毫秒）
    data_completeness: number; // 数据完整度 0-1
  };
}

// 价格历史点Schema
const PricePointSchema = new Schema<IPricePoint>({
  price: { type: Number, required: true },
  date: { type: Date, required: true }
}, { _id: false });

// 商品全量数据Schema
const ProductFullDataSchema = new Schema<IProductFullData>({
  platform: { 
    type: String, 
    required: true, 
    enum: ['alibaba', 'ozon', 'other'] 
  },
  platform_product_id: { type: String, required: true },
  
  basic_info: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    images: [{ type: String }],
    specifications: { type: Schema.Types.Mixed, default: {} }
  },
  
  pricing: {
    current_price: { type: Number, required: true },
    original_price: { type: Number },
    currency: { type: String, required: true, default: 'CNY' },
    price_history: [PricePointSchema]
  },
  
  sales_data: {
    sales_volume: { type: Number, required: true, default: 0 },
    review_count: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    stock_quantity: { type: Number }
  },
  
  supplier: {
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, default: 0, min: 0, max: 5 },
    years_in_business: { type: Number }
  },
  
  collection_meta: {
    collected_at: { type: Date, required: true, default: Date.now },
    collection_duration: { type: Number, required: true },
    data_completeness: { type: Number, required: true, min: 0, max: 1 }
  }
}, {
  timestamps: true,
  collection: 'product_full_data'
});

// 创建复合索引
ProductFullDataSchema.index({ platform: 1, platform_product_id: 1 }, { unique: true });
ProductFullDataSchema.index({ 'basic_info.category': 1 });
ProductFullDataSchema.index({ 'pricing.current_price': 1 });
ProductFullDataSchema.index({ 'sales_data.sales_volume': -1 });
ProductFullDataSchema.index({ 'collection_meta.collected_at': -1 });

export const ProductFullData = mongoose.model<IProductFullData>('ProductFullData', ProductFullDataSchema);