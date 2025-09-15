import mongoose, { Document } from 'mongoose';
export interface IOrder extends Document {
    order_id: string;
    order_number: string;
    customer: {
        user_id: mongoose.Types.ObjectId;
        email: string;
        phone?: string;
        customer_type: 'registered' | 'guest';
        tags: string[];
    };
    items: Array<{
        product_id: mongoose.Types.ObjectId;
        variant_id?: string;
        sku: string;
        name: string;
        unit_price: number;
        sale_price?: number;
        discount_amount: number;
        tax_amount: number;
        quantity: number;
        subtotal: number;
        total: number;
        attributes: {
            color?: string;
            size?: string;
            [key: string]: any;
        };
        image_url?: string;
        supplier?: {
            supplier_id: mongoose.Types.ObjectId;
            name: string;
            commission_rate: number;
        };
        fulfillment_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
        return_info?: {
            returnable: boolean;
            return_deadline?: Date;
            return_reason?: string;
            return_status?: 'requested' | 'approved' | 'rejected' | 'completed';
        };
    }>;
    pricing: {
        subtotal: number;
        discount_total: number;
        tax_total: number;
        shipping_total: number;
        handling_fee: number;
        total: number;
        coupons: Array<{
            coupon_id: mongoose.Types.ObjectId;
            code: string;
            discount_type: 'percentage' | 'fixed' | 'free_shipping';
            discount_value: number;
            discount_amount: number;
        }>;
        points_discount?: {
            points_used: number;
            discount_amount: number;
            exchange_rate: number;
        };
        tax_breakdown: Array<{
            tax_type: string;
            tax_rate: number;
            taxable_amount: number;
            tax_amount: number;
        }>;
    };
    shipping: {
        address: {
            recipient_name: string;
            phone: string;
            country: string;
            state: string;
            city: string;
            postal_code: string;
            address_line1: string;
            address_line2?: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            };
        };
        method: {
            method_id: string;
            name: string;
            carrier: string;
            service_type: 'standard' | 'express' | 'overnight' | 'pickup';
            estimated_delivery: Date;
            tracking_number?: string;
        };
        status: 'pending' | 'processing' | 'shipped' | 'in_transit' | 'delivered' | 'failed';
        shipped_at?: Date;
        delivered_at?: Date;
        notes?: string;
        tracking_events: Array<{
            timestamp: Date;
            status: string;
            location?: string;
            description: string;
        }>;
    };
    billing: {
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
        tax_info: {
            tax_id?: string;
            tax_exempt: boolean;
            tax_certificate?: string;
        };
    };
    payment: {
        status: 'pending' | 'processing' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
        method: {
            type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery' | 'digital_wallet';
            provider: string;
            last_four?: string;
            brand?: string;
        };
        transactions: Array<{
            transaction_id: string;
            type: 'payment' | 'refund' | 'chargeback';
            amount: number;
            currency: string;
            status: 'pending' | 'completed' | 'failed' | 'cancelled';
            gateway_response?: any;
            processed_at?: Date;
            fees: {
                gateway_fee: number;
                processing_fee: number;
                total_fee: number;
            };
        }>;
        installments?: {
            enabled: boolean;
            plan_id?: string;
            installment_count: number;
            installment_amount: number;
            next_payment_date?: Date;
        };
    };
    status: 'draft' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | 'refunded';
    source: {
        channel: 'web' | 'mobile_app' | 'api' | 'admin' | 'marketplace';
        platform?: string;
        campaign_id?: mongoose.Types.ObjectId;
        referrer?: string;
        utm_source?: string;
        utm_medium?: string;
        utm_campaign?: string;
    };
    tags: string[];
    priority: 'low' | 'medium' | 'high' | 'urgent';
    notes: {
        customer_notes?: string;
        internal_notes?: string;
        gift_message?: string;
    };
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
    risk_assessment: {
        risk_level: 'low' | 'medium' | 'high';
        risk_score: number;
        risk_factors: Array<{
            factor: string;
            score: number;
            description: string;
        }>;
        fraud_check: {
            checked: boolean;
            score?: number;
            result?: 'pass' | 'review' | 'decline';
            provider?: string;
            details?: any;
        };
    };
    inventory_reservation: {
        reserved: boolean;
        reserved_at?: Date;
        expires_at?: Date;
        reservations: Array<{
            product_id: mongoose.Types.ObjectId;
            variant_id?: string;
            quantity: number;
            warehouse_id?: string;
        }>;
    };
    metrics: {
        time_to_ship?: number;
        time_to_deliver?: number;
        processing_time?: number;
        cost_of_goods: number;
        shipping_cost: number;
        total_cost: number;
        profit_margin: number;
        customer_lifetime_value?: number;
        customer_acquisition_cost?: number;
    };
    created_at: Date;
    updated_at: Date;
    created_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    is_deleted: boolean;
    deleted_at?: Date;
    deleted_by?: mongoose.Types.ObjectId;
}
export declare const Order: mongoose.Model<IOrder, {}, {}, {}, mongoose.Document<unknown, {}, IOrder, {}, {}> & IOrder & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Order;
//# sourceMappingURL=Order.d.ts.map