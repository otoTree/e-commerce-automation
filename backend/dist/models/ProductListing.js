import mongoose, { Schema, Document } from 'mongoose';
// 商品上架Schema
const ProductListingSchema = new Schema({
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
ProductListingSchema.virtual('inventory.available_quantity').get(function () {
    return Math.max(0, this.inventory.stock_quantity - this.inventory.reserved_quantity);
});
// 中间件：更新时间戳
ProductListingSchema.pre('save', function (next) {
    this.meta.updated_at = new Date();
    next();
});
// 中间件：计算售价
ProductListingSchema.pre('save', function (next) {
    if (this.pricing.strategy === 'cost_plus') {
        this.pricing.selling_price = this.pricing.cost_price * (1 + this.pricing.markup_percentage / 100);
    }
    next();
});
export const ProductListing = mongoose.model('ProductListing', ProductListingSchema);
//# sourceMappingURL=ProductListing.js.map