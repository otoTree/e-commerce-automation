import mongoose, { Document, Schema } from 'mongoose';
// 商品分析Schema
const ProductAnalysisSchema = new Schema({
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
    overall_score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    market_potential: {
        score: { type: Number, min: 0, max: 100, required: true },
        trends: [{ type: String }],
        seasonality: { type: String },
        competition: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        market_size: { type: Number, min: 0 },
        growth_rate: { type: Number }
    },
    target_audience: {
        demographics: [{ type: String }],
        interests: [{ type: String }],
        pain_points: [{ type: String }],
        buying_behavior: { type: String, required: true },
        size_estimate: { type: Number, min: 0 }
    },
    competitor_analysis: {
        main_competitors: [{ type: String }],
        price_range: {
            min: { type: Number, min: 0, required: true },
            max: { type: Number, min: 0, required: true }
        },
        differentiators: [{ type: String }],
        market_gaps: [{ type: String }],
        competitive_advantages: [{ type: String }]
    },
    recommendations: {
        pricing: { type: String, required: true },
        positioning: { type: String, required: true },
        channels: [{ type: String }],
        timeline: { type: String, required: true },
        risk_factors: [{ type: String }]
    },
    analysis_version: { type: String, required: true },
    ai_model_used: { type: String, required: true },
    confidence_score: { type: Number, min: 0, max: 1, required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 生成内容Schema
const GeneratedContentSchema = new Schema({
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true
    },
    content_type: {
        type: String,
        enum: ['title', 'description', 'keywords', 'tags', 'features'],
        required: true
    },
    content: {
        original_language: { type: String, required: true },
        translations: [{
                language: { type: String, required: true },
                text: { type: String, required: true },
                quality_score: { type: Number, min: 0, max: 1, required: true }
            }]
    },
    generation_config: {
        ai_model: { type: String, required: true },
        temperature: { type: Number, min: 0, max: 2, required: true },
        max_tokens: { type: Number, min: 1, required: true },
        prompt_template: { type: String, required: true },
        target_audience: { type: String, required: true },
        tone: {
            type: String,
            enum: ['professional', 'casual', 'persuasive'],
            required: true
        }
    },
    quality_metrics: {
        readability_score: { type: Number, min: 0, max: 100, required: true },
        seo_score: { type: Number, min: 0, max: 100, required: true },
        engagement_score: { type: Number, min: 0, max: 100, required: true },
        keyword_density: { type: Number, min: 0, max: 1, required: true }
    },
    status: {
        type: String,
        enum: ['draft', 'review', 'approved', 'rejected', 'published'],
        default: 'draft'
    },
    review_feedback: { type: String },
    approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
    approved_at: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 营销策略Schema
const MarketingStrategySchema = new Schema({
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true
    },
    strategy_name: { type: String, required: true },
    description: { type: String, required: true },
    budget: {
        total_budget: { type: Number, min: 0, required: true },
        currency: { type: String, default: 'USD', required: true },
        allocation: [{
                channel: { type: String, required: true },
                percentage: { type: Number, min: 0, max: 100, required: true },
                amount: { type: Number, min: 0, required: true }
            }]
    },
    objectives: {
        primary_goal: {
            type: String,
            enum: ['brand_awareness', 'lead_generation', 'sales', 'engagement'],
            required: true
        },
        kpi_targets: [{
                metric: { type: String, required: true },
                target_value: { type: Number, required: true },
                measurement_period: { type: String, required: true }
            }]
    },
    channels: [{
            channel_name: { type: String, required: true },
            channel_type: {
                type: String,
                enum: ['paid_ads', 'social_media', 'email', 'content', 'influencer'],
                required: true
            },
            budget_allocation: { type: Number, min: 0, required: true },
            expected_reach: { type: Number, min: 0, required: true },
            expected_conversion_rate: { type: Number, min: 0, max: 1, required: true },
            tactics: [{ type: String }]
        }],
    timeline: {
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        milestones: [{
                date: { type: Date, required: true },
                description: { type: String, required: true },
                deliverables: [{ type: String }]
            }]
    },
    risk_assessment: {
        identified_risks: [{
                risk_type: { type: String, required: true },
                probability: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    required: true
                },
                impact: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    required: true
                },
                mitigation_strategy: { type: String, required: true }
            }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 效果跟踪Schema
const PerformanceTrackingSchema = new Schema({
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
        index: true
    },
    tracking_period: {
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly'],
            required: true
        }
    },
    metrics: [{
            date: { type: Date, required: true },
            platform: { type: String, required: true },
            data: {
                impressions: { type: Number, min: 0 },
                clicks: { type: Number, min: 0 },
                conversions: { type: Number, min: 0 },
                revenue: { type: Number, min: 0 },
                cost: { type: Number, min: 0 },
                ctr: { type: Number, min: 0, max: 1 },
                cvr: { type: Number, min: 0, max: 1 },
                cpc: { type: Number, min: 0 },
                cpa: { type: Number, min: 0 },
                roas: { type: Number, min: 0 },
                roi: { type: Number }
            }
        }],
    summary: {
        total_impressions: { type: Number, min: 0, default: 0 },
        total_clicks: { type: Number, min: 0, default: 0 },
        total_conversions: { type: Number, min: 0, default: 0 },
        total_revenue: { type: Number, min: 0, default: 0 },
        total_cost: { type: Number, min: 0, default: 0 },
        average_ctr: { type: Number, min: 0, max: 1, default: 0 },
        average_cvr: { type: Number, min: 0, max: 1, default: 0 },
        overall_roas: { type: Number, min: 0, default: 0 },
        overall_roi: { type: Number, default: 0 }
    },
    trends: {
        performance_trend: {
            type: String,
            enum: ['improving', 'stable', 'declining'],
            required: true
        },
        key_insights: [{ type: String }],
        recommendations: [{ type: String }]
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 创建索引
ProductAnalysisSchema.index({ task_id: 1, product_id: 1 });
ProductAnalysisSchema.index({ created_at: -1 });
ProductAnalysisSchema.index({ overall_score: -1 });
GeneratedContentSchema.index({ task_id: 1, content_type: 1 });
GeneratedContentSchema.index({ status: 1 });
GeneratedContentSchema.index({ created_at: -1 });
MarketingStrategySchema.index({ task_id: 1 });
MarketingStrategySchema.index({ 'objectives.primary_goal': 1 });
MarketingStrategySchema.index({ created_at: -1 });
PerformanceTrackingSchema.index({ task_id: 1 });
PerformanceTrackingSchema.index({ 'tracking_period.start_date': 1, 'tracking_period.end_date': 1 });
PerformanceTrackingSchema.index({ created_at: -1 });
// 导出模型
export const ProductAnalysis = mongoose.model('ProductAnalysis', ProductAnalysisSchema);
export const GeneratedContent = mongoose.model('GeneratedContent', GeneratedContentSchema);
export const MarketingStrategy = mongoose.model('MarketingStrategy', MarketingStrategySchema);
export const PerformanceTracking = mongoose.model('PerformanceTracking', PerformanceTrackingSchema);
export default {
    ProductAnalysis,
    GeneratedContent,
    MarketingStrategy,
    PerformanceTracking
};
//# sourceMappingURL=OperationAnalysis.js.map