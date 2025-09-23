import mongoose, { Document, Schema } from 'mongoose';
// 商品分析Schema
const ProductAnalysisSchema = new Schema({
    task_id: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    product_id: {
        type: String,
        required: true,
        index: true
    },
    analysis_id: {
        type: String,
        required: true,
        unique: true
    },
    overall_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    market_potential: {
        score: { type: Number, required: true, min: 0, max: 100 },
        trends: [{ type: String }],
        seasonality: { type: String },
        competition: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        market_size: {
            estimated_value: { type: Number, min: 0 },
            growth_rate: { type: Number },
            currency: { type: String, default: 'USD' }
        }
    },
    target_audience: {
        demographics: [{ type: String }],
        interests: [{ type: String }],
        pain_points: [{ type: String }],
        buying_behavior: { type: String },
        age_range: {
            min: { type: Number, min: 0, max: 100 },
            max: { type: Number, min: 0, max: 100 }
        },
        gender_distribution: {
            male: { type: Number, min: 0, max: 100, default: 0 },
            female: { type: Number, min: 0, max: 100, default: 0 },
            other: { type: Number, min: 0, max: 100, default: 0 }
        }
    },
    competitor_analysis: {
        main_competitors: [{
                name: { type: String, required: true },
                price: { type: Number, min: 0 },
                rating: { type: Number, min: 0, max: 5 },
                market_share: { type: Number, min: 0, max: 100 },
                strengths: [{ type: String }],
                weaknesses: [{ type: String }]
            }],
        price_range: {
            min: { type: Number, min: 0 },
            max: { type: Number, min: 0 },
            average: { type: Number, min: 0 },
            currency: { type: String, default: 'USD' }
        },
        differentiators: [{ type: String }],
        market_gaps: [{ type: String }],
        competitive_advantage: { type: String }
    },
    swot_analysis: {
        strengths: [{ type: String }],
        weaknesses: [{ type: String }],
        opportunities: [{ type: String }],
        threats: [{ type: String }]
    },
    recommendations: {
        pricing: {
            suggested_price: { type: Number, min: 0 },
            pricing_strategy: {
                type: String,
                enum: ['penetration', 'skimming', 'competitive', 'value_based']
            },
            reasoning: { type: String }
        },
        positioning: {
            value_proposition: { type: String },
            key_messages: [{ type: String }],
            brand_positioning: { type: String }
        },
        channels: [{
                channel: { type: String, required: true },
                priority: {
                    type: String,
                    enum: ['high', 'medium', 'low'],
                    required: true
                },
                reasoning: { type: String },
                expected_performance: {
                    reach: { type: Number, min: 0 },
                    conversion_rate: { type: Number, min: 0, max: 1 },
                    cost_per_acquisition: { type: Number, min: 0 }
                }
            }],
        timeline: {
            launch_date: { type: Date },
            milestones: [{
                    date: { type: Date, required: true },
                    description: { type: String, required: true },
                    deliverables: [{ type: String }]
                }]
        }
    },
    risk_assessment: {
        overall_risk: {
            type: String,
            enum: ['low', 'medium', 'high'],
            required: true
        },
        risk_factors: [{
                factor: { type: String, required: true },
                impact: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    required: true
                },
                probability: {
                    type: String,
                    enum: ['low', 'medium', 'high'],
                    required: true
                },
                mitigation: { type: String }
            }]
    },
    predictions: {
        sales_forecast: {
            monthly_units: { type: Number, min: 0 },
            monthly_revenue: { type: Number, min: 0 },
            growth_trajectory: {
                type: String,
                enum: ['linear', 'exponential', 'plateau']
            },
            confidence_level: { type: Number, min: 0, max: 1 }
        },
        roi_projection: {
            investment_required: { type: Number, min: 0 },
            expected_roi: { type: Number },
            payback_period: { type: Number, min: 0 },
            break_even_point: { type: Number, min: 0 }
        }
    },
    analysis_metadata: {
        analysis_type: {
            type: String,
            enum: ['basic', 'comprehensive', 'custom'],
            default: 'basic'
        },
        data_sources: [{ type: String }],
        analysis_duration: { type: Number, min: 0 },
        confidence_score: { type: Number, min: 0, max: 1 },
        last_updated: { type: Date, default: Date.now },
        version: { type: String, default: '1.0.0' }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
ProductAnalysisSchema.index({ task_id: 1 });
ProductAnalysisSchema.index({ product_id: 1 });
ProductAnalysisSchema.index({ analysis_id: 1 }, { unique: true });
ProductAnalysisSchema.index({ created_at: -1 });
ProductAnalysisSchema.index({ overall_score: -1 });
ProductAnalysisSchema.index({ 'market_potential.score': -1 });
// 复合索引
ProductAnalysisSchema.index({ product_id: 1, created_at: -1 });
ProductAnalysisSchema.index({ task_id: 1, created_at: -1 });
// 虚拟字段
ProductAnalysisSchema.virtual('is_high_potential').get(function () {
    return this.overall_score >= 80;
});
ProductAnalysisSchema.virtual('risk_level').get(function () {
    return this.risk_assessment.overall_risk;
});
// 静态方法
ProductAnalysisSchema.statics.findByProduct = function (productId) {
    return this.find({ product_id: productId }).sort({ created_at: -1 });
};
ProductAnalysisSchema.statics.findByTask = function (taskId) {
    return this.findOne({ task_id: taskId });
};
ProductAnalysisSchema.statics.findHighPotential = function (minScore = 80) {
    return this.find({ overall_score: { $gte: minScore } }).sort({ overall_score: -1 });
};
// 实例方法
ProductAnalysisSchema.methods.updateScore = function (newScore) {
    this.overall_score = newScore;
    this.updated_at = new Date();
    return this.save();
};
ProductAnalysisSchema.methods.addRiskFactor = function (factor) {
    this.risk_assessment.risk_factors.push(factor);
    this.updated_at = new Date();
    return this.save();
};
// 中间件
ProductAnalysisSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updated_at = new Date();
    }
    next();
});
export const ProductAnalysis = mongoose.model('ProductAnalysis', ProductAnalysisSchema);
export default ProductAnalysis;
//# sourceMappingURL=ProductAnalysis.js.map