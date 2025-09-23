import mongoose, { Document } from 'mongoose';
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'rejected' | 'paused' | 'archived';
export type PricingStrategy = 'cost_plus' | 'market_based' | 'competitive' | 'custom';
export interface IProductListing extends Document {
    source_product_id: string;
    platform: 'ozon';
    platform_listing_id?: string;
    listing_info: {
        title: string;
        description: string;
        category_id: string;
        brand: string;
        images: string[];
        attributes: Record<string, any>;
        keywords: string[];
    };
    pricing: {
        strategy: PricingStrategy;
        cost_price: number;
        markup_percentage: number;
        selling_price: number;
        currency: string;
        min_price?: number;
        max_price?: number;
    };
    inventory: {
        stock_quantity: number;
        reserved_quantity: number;
        available_quantity: number;
        low_stock_threshold: number;
        auto_restock: boolean;
    };
    logistics: {
        weight: number;
        dimensions: {
            length: number;
            width: number;
            height: number;
        };
        shipping_template_id?: string;
        processing_time: number;
        delivery_time_min: number;
        delivery_time_max: number;
    };
    status: ListingStatus;
    review_info?: {
        submitted_at?: Date;
        reviewed_at?: Date;
        reviewer_notes?: string;
        rejection_reason?: string;
    };
    performance: {
        views: number;
        clicks: number;
        orders: number;
        revenue: number;
        conversion_rate: number;
        last_updated: Date;
    };
    sync_info: {
        last_sync_at?: Date;
        sync_status: 'pending' | 'syncing' | 'success' | 'failed';
        sync_error?: string;
        auto_sync_enabled: boolean;
    };
    meta: {
        created_by: string;
        created_at: Date;
        updated_at: Date;
        published_at?: Date;
        archived_at?: Date;
    };
}
export declare const ProductListing: mongoose.Model<IProductListing, {}, {}, {}, mongoose.Document<unknown, {}, IProductListing, {}, {}> & IProductListing & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ProductListing.d.ts.map