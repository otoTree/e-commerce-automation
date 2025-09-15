import mongoose, { Document, Schema } from 'mongoose';
// 支付Schema定义
const PaymentSchema = new Schema({
    // 基础信息
    payment_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    transaction_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    // 关联订单
    order_id: {
        type: Schema.Types.ObjectId,
        ref: 'Order',
        required: true,
        index: true
    },
    order_number: {
        type: String,
        required: true,
        index: true
    },
    // 客户信息
    customer: {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        email: { type: String, required: true, lowercase: true },
        name: { type: String, required: true },
        phone: { type: String }
    },
    // 支付金额
    amount: {
        currency: { type: String, required: true, default: 'USD' },
        total: { type: Number, required: true, min: 0 },
        subtotal: { type: Number, required: true, min: 0 },
        tax: { type: Number, min: 0, default: 0 },
        shipping: { type: Number, min: 0, default: 0 },
        discount: { type: Number, min: 0, default: 0 },
        original_amount: { type: Number, required: true, min: 0 },
        fees: {
            gateway_fee: { type: Number, min: 0, default: 0 },
            processing_fee: { type: Number, min: 0, default: 0 },
            platform_fee: { type: Number, min: 0, default: 0 },
            total_fee: { type: Number, min: 0, default: 0 }
        },
        exchange_rate: {
            from_currency: { type: String },
            to_currency: { type: String },
            rate: { type: Number, min: 0 },
            converted_amount: { type: Number, min: 0 }
        }
    },
    // 支付方式
    payment_method: {
        type: {
            type: String,
            enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'digital_wallet', 'cryptocurrency', 'cash_on_delivery', 'installment'],
            required: true
        },
        provider: { type: String, required: true },
        card: {
            brand: { type: String },
            last_four: { type: String },
            exp_month: { type: Number, min: 1, max: 12 },
            exp_year: { type: Number },
            fingerprint: { type: String },
            funding: {
                type: String,
                enum: ['credit', 'debit', 'prepaid']
            },
            country: { type: String }
        },
        wallet: {
            provider: { type: String },
            account_id: { type: String },
            wallet_type: { type: String }
        },
        bank_transfer: {
            bank_name: { type: String },
            account_number_masked: { type: String },
            routing_number: { type: String },
            swift_code: { type: String }
        },
        cryptocurrency: {
            currency: { type: String },
            network: { type: String },
            wallet_address: { type: String },
            transaction_hash: { type: String }
        },
        installment: {
            provider: { type: String },
            plan_id: { type: String },
            installment_count: { type: Number, min: 1 },
            installment_amount: { type: Number, min: 0 },
            interest_rate: { type: Number, min: 0 },
            first_payment_date: { type: Date },
            next_payment_date: { type: Date }
        }
    },
    // 支付状态
    status: {
        type: String,
        enum: ['pending', 'processing', 'authorized', 'captured', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded', 'disputed', 'chargeback'],
        default: 'pending'
    },
    // 支付网关信息
    gateway: {
        provider: { type: String, required: true },
        gateway_transaction_id: { type: String, required: true },
        gateway_payment_id: { type: String },
        gateway_response: {
            status_code: { type: String, required: true },
            message: { type: String, required: true },
            raw_response: { type: Schema.Types.Mixed },
            authorization_code: { type: String },
            risk_score: { type: Number, min: 0, max: 100 },
            risk_level: {
                type: String,
                enum: ['low', 'medium', 'high']
            },
            three_d_secure: {
                authenticated: { type: Boolean },
                liability_shift: { type: Boolean },
                version: { type: String }
            }
        },
        gateway_fees: {
            fixed_fee: { type: Number, min: 0, default: 0 },
            percentage_fee: { type: Number, min: 0, default: 0 },
            total_fee: { type: Number, min: 0, default: 0 }
        }
    },
    // 支付时间
    timing: {
        initiated_at: { type: Date, default: Date.now },
        authorized_at: { type: Date },
        captured_at: { type: Date },
        completed_at: { type: Date },
        failed_at: { type: Date },
        cancelled_at: { type: Date },
        expires_at: { type: Date },
        processing_time: { type: Number, min: 0 }
    },
    // 退款信息
    refunds: [{
            refund_id: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 },
            reason: { type: String, required: true },
            status: {
                type: String,
                enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
                default: 'pending'
            },
            method: {
                type: String,
                enum: ['original', 'bank_transfer', 'store_credit'],
                default: 'original'
            },
            requested_at: { type: Date, default: Date.now },
            processed_at: { type: Date },
            completed_at: { type: Date },
            refund_fee: { type: Number, min: 0, default: 0 },
            gateway_refund_id: { type: String },
            initiated_by: {
                user_id: { type: Schema.Types.ObjectId, ref: 'User' },
                user_type: {
                    type: String,
                    enum: ['customer', 'admin', 'system'],
                    required: true
                },
                reason_code: { type: String }
            },
            notes: { type: String }
        }],
    // 争议和拒付
    disputes: [{
            dispute_id: { type: String, required: true },
            type: {
                type: String,
                enum: ['chargeback', 'inquiry', 'retrieval_request'],
                required: true
            },
            reason: { type: String, required: true },
            amount: { type: Number, required: true, min: 0 },
            status: {
                type: String,
                enum: ['open', 'under_review', 'won', 'lost', 'warning_closed'],
                default: 'open'
            },
            created_at: { type: Date, default: Date.now },
            due_date: { type: Date },
            resolved_at: { type: Date },
            evidence_submitted: { type: Boolean, default: false },
            evidence_due_date: { type: Date },
            gateway_dispute_id: { type: String },
            documents: [{
                    document_type: { type: String, required: true },
                    file_url: { type: String, required: true },
                    uploaded_at: { type: Date, default: Date.now }
                }]
        }],
    // 风险评估
    risk_assessment: {
        overall_score: { type: Number, min: 0, max: 100, default: 0 },
        risk_level: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'low'
        },
        factors: [{
                factor_type: { type: String, required: true },
                score: { type: Number, required: true, min: 0 },
                description: { type: String, required: true },
                weight: { type: Number, required: true, min: 0, max: 1 }
            }],
        fraud_detection: {
            provider: { type: String },
            score: { type: Number, min: 0, max: 100 },
            result: {
                type: String,
                enum: ['pass', 'review', 'decline'],
                required: true
            },
            rules_triggered: [{ type: String }],
            device_fingerprint: {
                device_id: { type: String },
                ip_address: { type: String },
                user_agent: { type: String },
                screen_resolution: { type: String },
                timezone: { type: String }
            },
            geolocation: {
                country: { type: String },
                region: { type: String },
                city: { type: String },
                latitude: { type: Number, min: -90, max: 90 },
                longitude: { type: Number, min: -180, max: 180 },
                is_vpn: { type: Boolean, default: false },
                is_proxy: { type: Boolean, default: false }
            }
        },
        velocity_checks: {
            same_card_attempts: { type: Number, min: 0, default: 0 },
            same_ip_attempts: { type: Number, min: 0, default: 0 },
            same_email_attempts: { type: Number, min: 0, default: 0 },
            time_window: { type: Number, min: 0, default: 60 }
        }
    },
    // 合规信息
    compliance: {
        pci_compliant: { type: Boolean, default: true },
        kyc_status: {
            type: String,
            enum: ['pending', 'verified', 'failed']
        },
        aml_status: {
            type: String,
            enum: ['clear', 'flagged', 'under_review']
        },
        tax_reporting: {
            required: { type: Boolean, default: false },
            tax_id: { type: String },
            reporting_threshold: { type: Number, min: 0, default: 0 },
            reported: { type: Boolean, default: false }
        },
        regulatory_flags: [{ type: String }]
    },
    // 通知和回调
    notifications: {
        customer_notified: { type: Boolean, default: false },
        customer_notification_sent_at: { type: Date },
        merchant_notified: { type: Boolean, default: false },
        merchant_notification_sent_at: { type: Date },
        webhooks: [{
                url: { type: String, required: true },
                event_type: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['pending', 'sent', 'failed'],
                    default: 'pending'
                },
                attempts: { type: Number, min: 0, default: 0 },
                last_attempt_at: { type: Date },
                response_code: { type: Number }
            }]
    },
    // 元数据
    metadata: {
        source: {
            channel: {
                type: String,
                enum: ['web', 'mobile', 'api', 'pos', 'phone'],
                required: true
            },
            platform: { type: String },
            version: { type: String },
            referrer: { type: String },
            utm_source: { type: String },
            utm_medium: { type: String },
            utm_campaign: { type: String }
        },
        session: {
            session_id: { type: String },
            ip_address: { type: String, required: true },
            user_agent: { type: String, required: true },
            browser: {
                name: { type: String },
                version: { type: String },
                language: { type: String }
            }
        },
        custom_fields: { type: Schema.Types.Mixed },
        tags: [{ type: String }]
    },
    // 审计日志
    audit_log: [{
            timestamp: { type: Date, default: Date.now },
            action: { type: String, required: true },
            user_id: { type: Schema.Types.ObjectId, ref: 'User' },
            user_type: {
                type: String,
                enum: ['customer', 'admin', 'system'],
                required: true
            },
            details: { type: String, required: true },
            before_state: { type: Schema.Types.Mixed },
            after_state: { type: Schema.Types.Mixed },
            ip_address: { type: String }
        }],
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
PaymentSchema.index({ payment_id: 1 }, { unique: true });
PaymentSchema.index({ transaction_id: 1 }, { unique: true });
PaymentSchema.index({ order_id: 1 });
PaymentSchema.index({ 'customer.user_id': 1 });
PaymentSchema.index({ 'customer.email': 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ 'payment_method.type': 1 });
PaymentSchema.index({ 'gateway.provider': 1 });
PaymentSchema.index({ created_at: -1 });
PaymentSchema.index({ is_deleted: 1 });
// 复合索引
PaymentSchema.index({ status: 1, created_at: -1 });
PaymentSchema.index({ 'customer.user_id': 1, status: 1 });
PaymentSchema.index({ order_id: 1, status: 1 });
PaymentSchema.index({ 'payment_method.type': 1, status: 1 });
// 文本搜索索引
PaymentSchema.index({
    payment_id: 'text',
    transaction_id: 'text',
    'customer.email': 'text'
});
// 中间件
// 保存前生成payment_id和transaction_id
PaymentSchema.pre('save', function (next) {
    if (!this.payment_id) {
        this.payment_id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    if (!this.transaction_id) {
        this.transaction_id = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});
// 更新时间戳
PaymentSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});
// 虚拟字段
// 是否已完成
PaymentSchema.virtual('is_completed').get(function () {
    return this.status === 'completed';
});
// 是否失败
PaymentSchema.virtual('is_failed').get(function () {
    return ['failed', 'cancelled'].includes(this.status);
});
// 是否可退款
PaymentSchema.virtual('is_refundable').get(function () {
    return ['completed', 'captured'].includes(this.status);
});
// 已退款金额
PaymentSchema.virtual('refunded_amount').get(function () {
    return this.refunds
        .filter((refund) => refund.status === 'completed')
        .reduce((total, refund) => total + refund.amount, 0);
});
// 可退款余额
PaymentSchema.virtual('refundable_balance').get(function () {
    const refundedAmount = this.refunds
        .filter((refund) => refund.status === 'completed')
        .reduce((total, refund) => total + refund.amount, 0);
    return Math.max(0, this.amount.total - refundedAmount);
});
// 净收入（扣除手续费和退款）
PaymentSchema.virtual('net_amount').get(function () {
    const refundedAmount = this.refunds
        .filter((refund) => refund.status === 'completed')
        .reduce((total, refund) => total + refund.amount, 0);
    return this.amount.total - this.amount.fees.total_fee - refundedAmount;
});
// 静态方法
// 根据状态查找支付
PaymentSchema.statics.findByStatus = function (status) {
    return this.find({ status, is_deleted: false });
};
// 根据订单查找支付
PaymentSchema.statics.findByOrder = function (orderId) {
    return this.find({ order_id: orderId, is_deleted: false })
        .sort({ created_at: -1 });
};
// 根据客户查找支付
PaymentSchema.statics.findByCustomer = function (userId) {
    return this.find({ 'customer.user_id': userId, is_deleted: false })
        .sort({ created_at: -1 });
};
// 查找失败的支付
PaymentSchema.statics.findFailedPayments = function (timeRange) {
    const query = {
        status: { $in: ['failed', 'cancelled'] },
        is_deleted: false
    };
    if (timeRange) {
        query.created_at = {
            $gte: timeRange.start,
            $lte: timeRange.end
        };
    }
    return this.find(query).sort({ created_at: -1 });
};
// 搜索支付
PaymentSchema.statics.search = function (query, filters = {}) {
    const searchQuery = {
        $text: { $search: query },
        is_deleted: false,
        ...filters
    };
    return this.find(searchQuery, { score: { $meta: 'textScore' } })
        .sort({ score: { $meta: 'textScore' } });
};
// 实例方法
// 更新支付状态
PaymentSchema.methods.updateStatus = function (newStatus, userId, details) {
    const auditEntry = {
        timestamp: new Date(),
        action: 'status_change',
        user_id: userId,
        user_type: userId ? 'admin' : 'system',
        details: details || `Status changed from ${this.status} to ${newStatus}`,
        before_state: { status: this.status },
        after_state: { status: newStatus }
    };
    this.audit_log.push(auditEntry);
    this.status = newStatus;
    // 更新时间戳
    const now = new Date();
    switch (newStatus) {
        case 'authorized':
            this.timing.authorized_at = now;
            break;
        case 'captured':
            this.timing.captured_at = now;
            break;
        case 'completed':
            this.timing.completed_at = now;
            break;
        case 'failed':
            this.timing.failed_at = now;
            break;
        case 'cancelled':
            this.timing.cancelled_at = now;
            break;
    }
    return this.save();
};
// 添加退款
PaymentSchema.methods.addRefund = function (refundData) {
    const refund = {
        refund_id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...refundData,
        requested_at: new Date()
    };
    this.refunds.push(refund);
    // 更新支付状态
    const totalRefunded = this.refunded_amount + refundData.amount;
    if (totalRefunded >= this.amount.total) {
        this.status = 'refunded';
    }
    else if (totalRefunded > 0) {
        this.status = 'partially_refunded';
    }
    return this.save();
};
// 添加争议
PaymentSchema.methods.addDispute = function (disputeData) {
    const dispute = {
        dispute_id: `dis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...disputeData,
        created_at: new Date(),
        evidence_submitted: false,
        documents: []
    };
    this.disputes.push(dispute);
    this.status = 'disputed';
    return this.save();
};
// 计算风险评分
PaymentSchema.methods.calculateRiskScore = function () {
    let totalScore = 0;
    let totalWeight = 0;
    this.risk_assessment.factors.forEach((factor) => {
        totalScore += factor.score * factor.weight;
        totalWeight += factor.weight;
    });
    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    this.risk_assessment.overall_score = Math.round(overallScore);
    // 设置风险等级
    if (overallScore < 30) {
        this.risk_assessment.risk_level = 'low';
    }
    else if (overallScore < 70) {
        this.risk_assessment.risk_level = 'medium';
    }
    else {
        this.risk_assessment.risk_level = 'high';
    }
    return this.save();
};
// 发送通知
PaymentSchema.methods.sendNotification = function (type, eventType) {
    const now = new Date();
    if (type === 'customer') {
        this.notifications.customer_notified = true;
        this.notifications.customer_notification_sent_at = now;
    }
    else {
        this.notifications.merchant_notified = true;
        this.notifications.merchant_notification_sent_at = now;
    }
    // 记录审计日志
    this.audit_log.push({
        timestamp: now,
        action: 'notification_sent',
        user_type: 'system',
        details: `${type} notification sent for event: ${eventType}`
    });
    return this.save();
};
// 创建并导出模型
export const Payment = mongoose.model('Payment', PaymentSchema);
export default Payment;
//# sourceMappingURL=Payment.js.map