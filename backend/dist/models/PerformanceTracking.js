import mongoose, { Document, Schema } from 'mongoose';
// 效果跟踪Schema
const PerformanceTrackingSchema = new Schema({
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true
    },
    product_id: {
        type: String,
        required: true,
        index: true
    },
    tracking_id: {
        type: String,
        required: true,
        unique: true
    },
    tracking_config: {
        name: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        platform: {
            type: String,
            required: true,
            index: true
        },
        campaign_id: { type: String },
        strategy_id: { type: String },
        tracking_period: {
            start_date: { type: Date, required: true },
            end_date: { type: Date },
            is_ongoing: { type: Boolean, default: true }
        },
        data_collection: {
            frequency: {
                type: String,
                enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
                default: 'daily'
            },
            auto_sync: { type: Boolean, default: true },
            data_sources: [{
                    source_type: {
                        type: String,
                        enum: ['google_analytics', 'yandex_metrica', 'facebook_ads', 'google_ads', 'platform_api', 'manual', 'crm', 'email_marketing'],
                        required: true
                    },
                    source_name: { type: String, required: true },
                    api_endpoint: { type: String },
                    credentials_id: { type: String },
                    last_sync: { type: Date },
                    sync_status: {
                        type: String,
                        enum: ['active', 'inactive', 'error'],
                        default: 'active'
                    },
                    error_message: { type: String }
                }]
        }
    },
    metrics_definition: {
        primary_metrics: [{
                metric_id: { type: String, required: true },
                name: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['traffic', 'conversion', 'engagement', 'revenue', 'cost', 'roi', 'brand', 'customer_satisfaction'],
                    required: true
                },
                description: { type: String, required: true },
                unit: { type: String, required: true },
                calculation_method: { type: String, required: true },
                target_value: { type: Number },
                benchmark_value: { type: Number },
                weight: { type: Number, min: 0, max: 1, default: 1 }
            }],
        secondary_metrics: [{
                metric_id: { type: String, required: true },
                name: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['traffic', 'conversion', 'engagement', 'revenue', 'cost', 'roi', 'brand', 'customer_satisfaction'],
                    required: true
                },
                description: { type: String, required: true },
                unit: { type: String, required: true },
                calculation_method: { type: String, required: true },
                target_value: { type: Number }
            }],
        custom_metrics: [{
                metric_id: { type: String, required: true },
                name: { type: String, required: true },
                formula: { type: String, required: true },
                dependencies: [{ type: String }],
                description: { type: String, required: true },
                unit: { type: String, required: true }
            }]
    },
    performance_data: {
        current_metrics: [{
                metric_id: { type: String, required: true },
                value: { type: Number, required: true },
                timestamp: { type: Date, required: true },
                data_source: { type: String, required: true },
                confidence_level: { type: Number, min: 0, max: 1 }
            }],
        historical_data: [{
                date: { type: Date, required: true },
                period_type: {
                    type: String,
                    enum: ['hour', 'day', 'week', 'month', 'quarter', 'year'],
                    required: true
                },
                metrics: [{
                        metric_id: { type: String, required: true },
                        value: { type: Number, required: true },
                        change_from_previous: { type: Number },
                        change_percentage: { type: Number }
                    }],
                events: [{
                        event_type: { type: String, required: true },
                        description: { type: String, required: true },
                        impact_score: { type: Number, min: -10, max: 10 }
                    }]
            }],
        trends: [{
                metric_id: { type: String, required: true },
                trend_direction: {
                    type: String,
                    enum: ['up', 'down', 'stable', 'volatile'],
                    required: true
                },
                trend_strength: { type: Number, min: -1, max: 1, required: true },
                trend_duration: { type: Number, min: 0, required: true },
                seasonal_pattern: {
                    pattern_type: {
                        type: String,
                        enum: ['weekly', 'monthly', 'quarterly', 'yearly']
                    },
                    peak_periods: [{ type: String }],
                    low_periods: [{ type: String }]
                },
                forecast: {
                    next_period_prediction: { type: Number, required: true },
                    confidence_interval: {
                        lower: { type: Number, required: true },
                        upper: { type: Number, required: true }
                    },
                    forecast_accuracy: { type: Number, min: 0, max: 1 }
                }
            }]
    },
    targets_and_benchmarks: {
        targets: [{
                metric_id: { type: String, required: true },
                target_type: {
                    type: String,
                    enum: ['absolute', 'percentage_increase', 'relative_to_benchmark'],
                    required: true
                },
                target_value: { type: Number, required: true },
                timeframe: { type: String, required: true },
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low'],
                    default: 'medium'
                },
                achievement_status: {
                    type: String,
                    enum: ['not_started', 'in_progress', 'achieved', 'missed', 'exceeded'],
                    default: 'not_started'
                },
                achievement_percentage: { type: Number, min: 0 }
            }],
        benchmarks: [{
                benchmark_type: {
                    type: String,
                    enum: ['industry_average', 'competitor', 'historical', 'best_practice'],
                    required: true
                },
                benchmark_source: { type: String, required: true },
                metrics: [{
                        metric_id: { type: String, required: true },
                        benchmark_value: { type: Number, required: true },
                        our_value: { type: Number, required: true },
                        performance_gap: { type: Number, required: true },
                        performance_ratio: { type: Number, required: true }
                    }],
                last_updated: { type: Date, required: true }
            }]
    },
    insights: {
        automated_insights: [{
                insight_id: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['anomaly', 'trend', 'correlation', 'opportunity', 'risk'],
                    required: true
                },
                title: { type: String, required: true },
                description: { type: String, required: true },
                confidence_score: { type: Number, min: 0, max: 1, required: true },
                impact_level: {
                    type: String,
                    enum: ['low', 'medium', 'high', 'critical'],
                    required: true
                },
                affected_metrics: [{ type: String }],
                recommended_actions: [{ type: String }],
                generated_at: { type: Date, required: true },
                status: {
                    type: String,
                    enum: ['new', 'reviewed', 'acted_upon', 'dismissed'],
                    default: 'new'
                }
            }],
        manual_insights: [{
                insight_id: { type: String, required: true },
                title: { type: String, required: true },
                description: { type: String, required: true },
                category: { type: String, required: true },
                impact_assessment: { type: String, required: true },
                action_items: [{
                        action: { type: String, required: true },
                        priority: {
                            type: String,
                            enum: ['high', 'medium', 'low'],
                            default: 'medium'
                        },
                        assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
                        due_date: { type: Date },
                        status: {
                            type: String,
                            enum: ['pending', 'in_progress', 'completed'],
                            default: 'pending'
                        }
                    }],
                created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                created_at: { type: Date, required: true }
            }],
        correlations: [{
                metric_pair: [{ type: String, required: true }],
                correlation_coefficient: { type: Number, min: -1, max: 1, required: true },
                significance_level: { type: Number, min: 0, max: 1, required: true },
                relationship_type: {
                    type: String,
                    enum: ['positive', 'negative', 'no_correlation'],
                    required: true
                },
                business_interpretation: { type: String, required: true }
            }]
    },
    reporting: {
        automated_reports: [{
                report_id: { type: String, required: true },
                name: { type: String, required: true },
                frequency: {
                    type: String,
                    enum: ['real_time', 'hourly', 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
                    required: true
                },
                recipients: [{
                        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                        email: { type: String, required: true },
                        role: { type: String, required: true }
                    }],
                content_config: {
                    include_summary: { type: Boolean, default: true },
                    include_trends: { type: Boolean, default: true },
                    include_insights: { type: Boolean, default: true },
                    include_recommendations: { type: Boolean, default: true },
                    metrics_to_include: [{ type: String }],
                    chart_types: [{ type: String }]
                },
                delivery_method: {
                    type: String,
                    enum: ['email', 'dashboard', 'api', 'slack'],
                    default: 'email'
                },
                last_sent: { type: Date },
                next_scheduled: { type: Date },
                is_active: { type: Boolean, default: true }
            }],
        dashboard_config: {
            layout: [{
                    widget_id: { type: String, required: true },
                    widget_type: {
                        type: String,
                        enum: ['metric_card', 'chart', 'table', 'gauge', 'text'],
                        required: true
                    },
                    position: {
                        x: { type: Number, required: true },
                        y: { type: Number, required: true },
                        width: { type: Number, required: true },
                        height: { type: Number, required: true }
                    },
                    config: { type: Schema.Types.Mixed }
                }],
            refresh_interval: { type: Number, default: 300 },
            theme: {
                type: String,
                enum: ['light', 'dark', 'auto'],
                default: 'light'
            },
            filters: {
                date_range: {
                    start: { type: Date },
                    end: { type: Date }
                },
                platforms: [{ type: String }],
                metrics: [{ type: String }]
            }
        }
    },
    alerts: {
        alert_rules: [{
                rule_id: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String },
                metric_id: { type: String, required: true },
                condition: {
                    operator: {
                        type: String,
                        enum: ['greater_than', 'less_than', 'equals', 'not_equals', 'percentage_change'],
                        required: true
                    },
                    threshold_value: { type: Number, required: true },
                    comparison_period: { type: String }
                },
                severity: {
                    type: String,
                    enum: ['info', 'warning', 'critical'],
                    default: 'warning'
                },
                notification_channels: [{
                        channel_type: {
                            type: String,
                            enum: ['email', 'sms', 'slack', 'webhook'],
                            required: true
                        },
                        recipients: [{ type: String, required: true }],
                        template: { type: String }
                    }],
                is_active: { type: Boolean, default: true },
                cooldown_period: { type: Number, default: 60 },
                last_triggered: { type: Date }
            }],
        alert_history: [{
                alert_id: { type: String, required: true },
                rule_id: { type: String, required: true },
                triggered_at: { type: Date, required: true },
                metric_value: { type: Number, required: true },
                threshold_value: { type: Number, required: true },
                severity: { type: String, required: true },
                message: { type: String, required: true },
                acknowledged: { type: Boolean, default: false },
                acknowledged_by: { type: Schema.Types.ObjectId, ref: 'User' },
                acknowledged_at: { type: Date },
                resolved: { type: Boolean, default: false },
                resolved_at: { type: Date }
            }]
    },
    data_quality: {
        quality_score: { type: Number, min: 0, max: 100, default: 100 },
        quality_checks: [{
                check_type: {
                    type: String,
                    enum: ['completeness', 'accuracy', 'consistency', 'timeliness', 'validity'],
                    required: true
                },
                status: {
                    type: String,
                    enum: ['passed', 'failed', 'warning'],
                    required: true
                },
                score: { type: Number, min: 0, max: 100, required: true },
                details: { type: String, required: true },
                last_checked: { type: Date, required: true }
            }],
        data_freshness: [{
                source: { type: String, required: true },
                last_updated: { type: Date, required: true },
                expected_frequency: { type: String, required: true },
                delay_minutes: { type: Number, min: 0, required: true },
                status: {
                    type: String,
                    enum: ['fresh', 'stale', 'missing'],
                    required: true
                }
            }],
        anomalies: [{
                detected_at: { type: Date, required: true },
                metric_id: { type: String, required: true },
                anomaly_type: {
                    type: String,
                    enum: ['spike', 'drop', 'missing_data', 'outlier'],
                    required: true
                },
                severity: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    required: true
                },
                description: { type: String, required: true },
                resolved: { type: Boolean, default: false }
            }]
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    last_data_sync: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
PerformanceTrackingSchema.index({ task_id: 1 });
PerformanceTrackingSchema.index({ product_id: 1 });
PerformanceTrackingSchema.index({ tracking_id: 1 }, { unique: true });
PerformanceTrackingSchema.index({ 'tracking_config.platform': 1 });
PerformanceTrackingSchema.index({ created_at: -1 });
PerformanceTrackingSchema.index({ last_data_sync: -1 });
// 复合索引
PerformanceTrackingSchema.index({ product_id: 1, 'tracking_config.platform': 1 });
PerformanceTrackingSchema.index({ task_id: 1, created_at: -1 });
PerformanceTrackingSchema.index({ 'performance_data.current_metrics.metric_id': 1, 'performance_data.current_metrics.timestamp': -1 });
// 文本搜索索引
PerformanceTrackingSchema.index({
    'tracking_config.name': 'text',
    'tracking_config.description': 'text',
    'metrics_definition.primary_metrics.name': 'text'
});
// 虚拟字段
PerformanceTrackingSchema.virtual('is_active').get(function () {
    return this.tracking_config.tracking_period.is_ongoing ||
        (this.tracking_config.tracking_period.end_date &&
            this.tracking_config.tracking_period.end_date > new Date());
});
PerformanceTrackingSchema.virtual('data_freshness_status').get(function () {
    const now = new Date();
    const lastSync = this.last_data_sync;
    const hoursSinceSync = (now.getTime() - lastSync.getTime()) / (1000 * 60 * 60);
    if (hoursSinceSync < 1)
        return 'fresh';
    if (hoursSinceSync < 24)
        return 'recent';
    if (hoursSinceSync < 72)
        return 'stale';
    return 'outdated';
});
PerformanceTrackingSchema.virtual('overall_performance_score').get(function () {
    const targets = this.targets_and_benchmarks.targets;
    if (!targets.length)
        return null;
    const achievedTargets = targets.filter(t => t.achievement_status === 'achieved' || t.achievement_status === 'exceeded');
    return Math.round((achievedTargets.length / targets.length) * 100);
});
// 静态方法
PerformanceTrackingSchema.statics.findByProduct = function (productId) {
    return this.find({ product_id: productId }).sort({ created_at: -1 });
};
PerformanceTrackingSchema.statics.findByTask = function (taskId) {
    return this.find({ task_id: taskId }).sort({ created_at: -1 });
};
PerformanceTrackingSchema.statics.findActive = function () {
    return this.find({ 'tracking_config.tracking_period.is_ongoing': true })
        .sort({ created_at: -1 });
};
PerformanceTrackingSchema.statics.findByPlatform = function (platform) {
    return this.find({ 'tracking_config.platform': platform })
        .sort({ created_at: -1 });
};
PerformanceTrackingSchema.statics.findStaleData = function (hoursThreshold = 24) {
    const cutoffTime = new Date(Date.now() - hoursThreshold * 60 * 60 * 1000);
    return this.find({ last_data_sync: { $lt: cutoffTime } })
        .sort({ last_data_sync: 1 });
};
// 实例方法
PerformanceTrackingSchema.methods.updateMetric = function (metricId, value, dataSource = 'manual') {
    const currentTime = new Date();
    // 更新当前指标
    const existingMetricIndex = this.performance_data.current_metrics.findIndex((metric) => metric.metric_id === metricId);
    const metricData = {
        metric_id: metricId,
        value: value,
        timestamp: currentTime,
        data_source: dataSource
    };
    if (existingMetricIndex >= 0) {
        this.performance_data.current_metrics[existingMetricIndex] = metricData;
    }
    else {
        this.performance_data.current_metrics.push(metricData);
    }
    // 添加到历史数据
    this.performance_data.historical_data.push({
        date: currentTime,
        period_type: 'day',
        metrics: [{
                metric_id: metricId,
                value: value
            }]
    });
    this.last_data_sync = currentTime;
    this.updated_at = currentTime;
    return this.save();
};
PerformanceTrackingSchema.methods.addHistoricalData = function (date, periodType, metrics) {
    this.performance_data.historical_data.push({
        date,
        period_type: periodType,
        metrics
    });
    // 保持历史数据在合理范围内（最多1000条记录）
    if (this.performance_data.historical_data.length > 1000) {
        this.performance_data.historical_data = this.performance_data.historical_data
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 1000);
    }
    this.updated_at = new Date();
    return this.save();
};
PerformanceTrackingSchema.methods.triggerAlert = function (ruleId, metricValue, thresholdValue) {
    const rule = this.alerts.alert_rules.find((r) => r.rule_id === ruleId);
    if (!rule || !rule.is_active)
        return;
    // 检查冷却期
    if (rule.last_triggered) {
        const cooldownMs = rule.cooldown_period * 60 * 1000;
        if (Date.now() - rule.last_triggered.getTime() < cooldownMs) {
            return; // 还在冷却期内
        }
    }
    // 添加到警报历史
    this.alerts.alert_history.push({
        alert_id: new mongoose.Types.ObjectId().toString(),
        rule_id: ruleId,
        triggered_at: new Date(),
        metric_value: metricValue,
        threshold_value: thresholdValue,
        severity: rule.severity,
        message: `${rule.name}: Metric value ${metricValue} ${rule.condition.operator} threshold ${thresholdValue}`
    });
    rule.last_triggered = new Date();
    this.updated_at = new Date();
    return this.save();
};
PerformanceTrackingSchema.methods.calculateTrends = function (metricId, days = 30) {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const relevantData = this.performance_data.historical_data
        .filter((d) => d.date >= cutoffDate)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
    if (relevantData.length < 2)
        return null;
    const values = relevantData
        .map((d) => d.metrics.find((m) => m.metric_id === metricId)?.value)
        .filter((v) => v !== undefined);
    if (values.length < 2)
        return null;
    // 简单的线性趋势计算
    const firstValue = values[0];
    const lastValue = values[values.length - 1];
    const trendStrength = (lastValue - firstValue) / firstValue;
    let trendDirection;
    if (Math.abs(trendStrength) < 0.05) {
        trendDirection = 'stable';
    }
    else if (trendStrength > 0) {
        trendDirection = 'up';
    }
    else {
        trendDirection = 'down';
    }
    // 检查波动性
    const variance = values.reduce((sum, val, idx) => {
        if (idx === 0)
            return 0;
        const change = Math.abs((val - values[idx - 1]) / values[idx - 1]);
        return sum + change;
    }, 0) / (values.length - 1);
    if (variance > 0.2) {
        trendDirection = 'volatile';
    }
    return {
        metric_id: metricId,
        trend_direction: trendDirection,
        trend_strength: Math.min(Math.max(trendStrength, -1), 1),
        trend_duration: days,
        forecast: {
            next_period_prediction: lastValue * (1 + trendStrength * 0.1),
            confidence_interval: {
                lower: lastValue * (1 + trendStrength * 0.05),
                upper: lastValue * (1 + trendStrength * 0.15)
            }
        }
    };
};
// 中间件
PerformanceTrackingSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updated_at = new Date();
    }
    next();
});
export const PerformanceTracking = mongoose.model('PerformanceTracking', PerformanceTrackingSchema);
export default PerformanceTracking;
//# sourceMappingURL=PerformanceTracking.js.map