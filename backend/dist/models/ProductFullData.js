import mongoose, { Schema, Document } from 'mongoose';
// 价格历史点Schema
const PricePointSchema = new Schema({
    price: { type: Number, required: true },
    date: { type: Date, required: true }
}, { _id: false });
// 商品全量数据Schema
const ProductFullDataSchema = new Schema({
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
export const ProductFullData = mongoose.model('ProductFullData', ProductFullDataSchema);
//# sourceMappingURL=ProductFullData.js.map