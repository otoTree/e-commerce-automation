import mongoose, { Document } from 'mongoose';
export interface IPayment extends Document {
    payment_id: string;
    transaction_id: string;
    order_id: mongoose.Types.ObjectId;
    order_number: string;
    customer: {
        user_id: mongoose.Types.ObjectId;
        email: string;
        name: string;
        phone?: string;
    };
    amount: {
        currency: string;
        total: number;
        subtotal: number;
        tax: number;
        shipping: number;
        discount: number;
        original_amount: number;
        fees: {
            gateway_fee: number;
            processing_fee: number;
            platform_fee: number;
            total_fee: number;
        };
        exchange_rate?: {
            from_currency: string;
            to_currency: string;
            rate: number;
            converted_amount: number;
        };
    };
    payment_method: {
        type: 'credit_card' | 'debit_card' | 'paypal' | 'stripe' | 'bank_transfer' | 'digital_wallet' | 'cryptocurrency' | 'cash_on_delivery' | 'installment';
        provider: string;
        card?: {
            brand: string;
            last_four: string;
            exp_month: number;
            exp_year: number;
            fingerprint?: string;
            funding: 'credit' | 'debit' | 'prepaid';
            country: string;
        };
        wallet?: {
            provider: string;
            account_id?: string;
            wallet_type: string;
        };
        bank_transfer?: {
            bank_name: string;
            account_number_masked: string;
            routing_number?: string;
            swift_code?: string;
        };
        cryptocurrency?: {
            currency: string;
            network: string;
            wallet_address: string;
            transaction_hash?: string;
        };
        installment?: {
            provider: string;
            plan_id: string;
            installment_count: number;
            installment_amount: number;
            interest_rate: number;
            first_payment_date: Date;
            next_payment_date?: Date;
        };
    };
    status: 'pending' | 'processing' | 'authorized' | 'captured' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded' | 'disputed' | 'chargeback';
    gateway: {
        provider: string;
        gateway_transaction_id: string;
        gateway_payment_id?: string;
        gateway_response: {
            status_code: string;
            message: string;
            raw_response?: any;
            authorization_code?: string;
            risk_score?: number;
            risk_level?: 'low' | 'medium' | 'high';
            three_d_secure?: {
                authenticated: boolean;
                liability_shift: boolean;
                version: string;
            };
        };
        gateway_fees: {
            fixed_fee: number;
            percentage_fee: number;
            total_fee: number;
        };
    };
    timing: {
        initiated_at: Date;
        authorized_at?: Date;
        captured_at?: Date;
        completed_at?: Date;
        failed_at?: Date;
        cancelled_at?: Date;
        expires_at?: Date;
        processing_time?: number;
    };
    refunds: Array<{
        refund_id: string;
        amount: number;
        reason: string;
        status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
        method: 'original' | 'bank_transfer' | 'store_credit';
        requested_at: Date;
        processed_at?: Date;
        completed_at?: Date;
        refund_fee: number;
        gateway_refund_id?: string;
        initiated_by: {
            user_id?: mongoose.Types.ObjectId;
            user_type: 'customer' | 'admin' | 'system';
            reason_code?: string;
        };
        notes?: string;
    }>;
    disputes: Array<{
        dispute_id: string;
        type: 'chargeback' | 'inquiry' | 'retrieval_request';
        reason: string;
        amount: number;
        status: 'open' | 'under_review' | 'won' | 'lost' | 'warning_closed';
        created_at: Date;
        due_date?: Date;
        resolved_at?: Date;
        evidence_submitted: boolean;
        evidence_due_date?: Date;
        gateway_dispute_id?: string;
        documents: Array<{
            document_type: string;
            file_url: string;
            uploaded_at: Date;
        }>;
    }>;
    risk_assessment: {
        overall_score: number;
        risk_level: 'low' | 'medium' | 'high';
        factors: Array<{
            factor_type: string;
            score: number;
            description: string;
            weight: number;
        }>;
        fraud_detection: {
            provider?: string;
            score?: number;
            result: 'pass' | 'review' | 'decline';
            rules_triggered: string[];
            device_fingerprint?: {
                device_id: string;
                ip_address: string;
                user_agent: string;
                screen_resolution?: string;
                timezone?: string;
            };
            geolocation?: {
                country: string;
                region: string;
                city: string;
                latitude?: number;
                longitude?: number;
                is_vpn: boolean;
                is_proxy: boolean;
            };
        };
        velocity_checks: {
            same_card_attempts: number;
            same_ip_attempts: number;
            same_email_attempts: number;
            time_window: number;
        };
    };
    compliance: {
        pci_compliant: boolean;
        kyc_status?: 'pending' | 'verified' | 'failed';
        aml_status?: 'clear' | 'flagged' | 'under_review';
        tax_reporting: {
            required: boolean;
            tax_id?: string;
            reporting_threshold: number;
            reported: boolean;
        };
        regulatory_flags: string[];
    };
    notifications: {
        customer_notified: boolean;
        customer_notification_sent_at?: Date;
        merchant_notified: boolean;
        merchant_notification_sent_at?: Date;
        webhooks: Array<{
            url: string;
            event_type: string;
            status: 'pending' | 'sent' | 'failed';
            attempts: number;
            last_attempt_at?: Date;
            response_code?: number;
        }>;
    };
    metadata: {
        source: {
            channel: 'web' | 'mobile' | 'api' | 'pos' | 'phone';
            platform?: string;
            version?: string;
            referrer?: string;
            utm_source?: string;
            utm_medium?: string;
            utm_campaign?: string;
        };
        session: {
            session_id?: string;
            ip_address: string;
            user_agent: string;
            browser?: {
                name: string;
                version: string;
                language: string;
            };
        };
        custom_fields: {
            [key: string]: any;
        };
        tags: string[];
    };
    audit_log: Array<{
        timestamp: Date;
        action: string;
        user_id?: mongoose.Types.ObjectId;
        user_type: 'customer' | 'admin' | 'system';
        details: string;
        before_state?: any;
        after_state?: any;
        ip_address?: string;
    }>;
    created_at: Date;
    updated_at: Date;
    created_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    is_deleted: boolean;
    deleted_at?: Date;
    deleted_by?: mongoose.Types.ObjectId;
}
export declare const Payment: mongoose.Model<IPayment, {}, {}, {}, mongoose.Document<unknown, {}, IPayment, {}, {}> & IPayment & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Payment;
//# sourceMappingURL=Payment.d.ts.map