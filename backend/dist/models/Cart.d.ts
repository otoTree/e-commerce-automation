import mongoose, { Document } from 'mongoose';
export interface ICart extends Document {
    cart_id: string;
    user_id?: mongoose.Types.ObjectId;
    session_id?: string;
    items: Array<{
        item_id: string;
        product_id: mongoose.Types.ObjectId;
        variant_id?: string;
        sku: string;
        name: string;
        description?: string;
        image_url?: string;
        unit_price: number;
        sale_price?: number;
        discount_amount: number;
        quantity: number;
        max_quantity?: number;
        attributes: {
            color?: string;
            size?: string;
            [key: string]: any;
        };
        supplier?: {
            supplier_id: mongoose.Types.ObjectId;
            name: string;
            shipping_time?: number;
        };
        stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
        available_quantity: number;
        is_available: boolean;
        availability_message?: string;
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
        added_at: Date;
        updated_at: Date;
        personalization?: {
            custom_text?: string;
            custom_image?: string;
            gift_wrap: boolean;
            gift_message?: string;
        };
        source?: {
            type: 'search' | 'recommendation' | 'category' | 'promotion' | 'wishlist';
            reference_id?: string;
            campaign_id?: mongoose.Types.ObjectId;
        };
    }>;
    summary: {
        total_items: number;
        total_quantity: number;
        subtotal: number;
        total_discount: number;
        estimated_tax: number;
        estimated_shipping: number;
        estimated_total: number;
        total_savings: number;
        total_weight: number;
        total_volume?: number;
    };
    coupons: Array<{
        coupon_id: mongoose.Types.ObjectId;
        code: string;
        discount_type: 'percentage' | 'fixed' | 'free_shipping';
        discount_value: number;
        discount_amount: number;
        applicable_items: string[];
        minimum_amount?: number;
        is_valid: boolean;
        error_message?: string;
        applied_at: Date;
    }>;
    shipping_info: {
        address?: {
            country: string;
            state: string;
            city: string;
            postal_code: string;
        };
        method?: {
            method_id: string;
            name: string;
            cost: number;
            estimated_delivery: Date;
        };
        options: {
            express_delivery: boolean;
            signature_required: boolean;
            insurance: boolean;
            gift_wrap: boolean;
        };
    };
    payment_info: {
        preferred_method?: string;
        installment_plan?: {
            enabled: boolean;
            plan_id?: string;
            installment_count: number;
            monthly_amount: number;
        };
        points_to_use: number;
        points_discount: number;
        gift_cards: Array<{
            card_id: string;
            balance: number;
            amount_to_use: number;
        }>;
    };
    status: 'active' | 'abandoned' | 'converted' | 'merged' | 'expired';
    cart_type: 'regular' | 'wishlist' | 'save_for_later' | 'quick_order';
    session_info: {
        ip_address?: string;
        user_agent?: string;
        device_type?: 'desktop' | 'mobile' | 'tablet';
        location?: {
            country: string;
            region: string;
            city: string;
        };
        source_channel: 'web' | 'mobile_app' | 'api';
        referrer?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
    };
    preferences: {
        currency: string;
        language: string;
        notifications: {
            price_drop: boolean;
            back_in_stock: boolean;
            cart_reminder: boolean;
        };
        display: {
            show_recommendations: boolean;
            show_related_products: boolean;
            compact_view: boolean;
        };
    };
    recommendations: Array<{
        product_id: mongoose.Types.ObjectId;
        recommendation_type: 'frequently_bought_together' | 'customers_also_viewed' | 'similar_products' | 'upsell' | 'cross_sell';
        score: number;
        reason?: string;
        algorithm: {
            name: string;
            version: string;
            confidence: number;
        };
        generated_at: Date;
    }>;
    history: Array<{
        timestamp: Date;
        action: 'item_added' | 'item_removed' | 'item_updated' | 'coupon_applied' | 'coupon_removed' | 'checkout_started' | 'checkout_completed' | 'cart_abandoned';
        details: {
            item_id?: string;
            product_id?: mongoose.Types.ObjectId;
            quantity_change?: number;
            coupon_code?: string;
            [key: string]: any;
        };
        session_id?: string;
        ip_address?: string;
    }>;
    reminders: {
        abandonment: {
            enabled: boolean;
            reminder_count: number;
            last_reminder_sent?: Date;
            next_reminder_at?: Date;
        };
        price_drop: {
            enabled: boolean;
            threshold_percentage: number;
        };
        stock_alert: {
            enabled: boolean;
            low_stock_threshold: number;
        };
    };
    expiration: {
        expires_at?: Date;
        auto_cleanup: boolean;
        expiry_policy: {
            guest_cart_days: number;
            registered_cart_days: number;
            inactive_days: number;
        };
    };
    merge_info?: {
        merged_from: mongoose.Types.ObjectId[];
        merged_at: Date;
        merge_strategy: 'combine_quantities' | 'keep_latest' | 'manual_selection';
    };
    conversion?: {
        converted_to_order: boolean;
        order_id?: mongoose.Types.ObjectId;
        converted_at?: Date;
        conversion_value: number;
    };
    created_at: Date;
    updated_at: Date;
    last_activity_at: Date;
    is_deleted: boolean;
    deleted_at?: Date;
}
export declare const Cart: mongoose.Model<ICart, {}, {}, {}, mongoose.Document<unknown, {}, ICart, {}, {}> & ICart & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Cart;
//# sourceMappingURL=Cart.d.ts.map