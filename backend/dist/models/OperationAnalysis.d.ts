import mongoose, { Document } from 'mongoose';
export interface IProductAnalysis extends Document {
    _id: mongoose.Types.ObjectId;
    task_id: mongoose.Types.ObjectId;
    product_id: string;
    overall_score: number;
    market_potential: {
        score: number;
        trends: string[];
        seasonality: string;
        competition: 'low' | 'medium' | 'high';
        market_size?: number;
        growth_rate?: number;
    };
    target_audience: {
        demographics: string[];
        interests: string[];
        pain_points: string[];
        buying_behavior: string;
        size_estimate?: number;
    };
    competitor_analysis: {
        main_competitors: string[];
        price_range: {
            min: number;
            max: number;
        };
        differentiators: string[];
        market_gaps: string[];
        competitive_advantages?: string[];
    };
    recommendations: {
        pricing: string;
        positioning: string;
        channels: string[];
        timeline: string;
        risk_factors?: string[];
    };
    analysis_version: string;
    ai_model_used: string;
    confidence_score: number;
    created_at: Date;
    updated_at: Date;
}
export interface IGeneratedContent extends Document {
    _id: mongoose.Types.ObjectId;
    task_id: mongoose.Types.ObjectId;
    content_type: 'title' | 'description' | 'keywords' | 'tags' | 'features';
    content: {
        original_language: string;
        translations: Array<{
            language: string;
            text: string;
            quality_score: number;
        }>;
    };
    generation_config: {
        ai_model: string;
        temperature: number;
        max_tokens: number;
        prompt_template: string;
        target_audience: string;
        tone: 'professional' | 'casual' | 'persuasive';
    };
    quality_metrics: {
        readability_score: number;
        seo_score: number;
        engagement_score: number;
        keyword_density: number;
    };
    status: 'draft' | 'review' | 'approved' | 'rejected' | 'published';
    review_feedback?: string;
    approved_by?: mongoose.Types.ObjectId;
    approved_at?: Date;
    created_at: Date;
    updated_at: Date;
}
export interface IMarketingStrategy extends Document {
    _id: mongoose.Types.ObjectId;
    task_id: mongoose.Types.ObjectId;
    strategy_name: string;
    description: string;
    budget: {
        total_budget: number;
        currency: string;
        allocation: Array<{
            channel: string;
            percentage: number;
            amount: number;
        }>;
    };
    objectives: {
        primary_goal: 'brand_awareness' | 'lead_generation' | 'sales' | 'engagement';
        kpi_targets: Array<{
            metric: string;
            target_value: number;
            measurement_period: string;
        }>;
    };
    channels: Array<{
        channel_name: string;
        channel_type: 'paid_ads' | 'social_media' | 'email' | 'content' | 'influencer';
        budget_allocation: number;
        expected_reach: number;
        expected_conversion_rate: number;
        tactics: string[];
    }>;
    timeline: {
        start_date: Date;
        end_date: Date;
        milestones: Array<{
            date: Date;
            description: string;
            deliverables: string[];
        }>;
    };
    risk_assessment: {
        identified_risks: Array<{
            risk_type: string;
            probability: 'low' | 'medium' | 'high';
            impact: 'low' | 'medium' | 'high';
            mitigation_strategy: string;
        }>;
    };
    created_at: Date;
    updated_at: Date;
}
export interface IPerformanceTracking extends Document {
    _id: mongoose.Types.ObjectId;
    task_id: mongoose.Types.ObjectId;
    tracking_period: {
        start_date: Date;
        end_date: Date;
        frequency: 'daily' | 'weekly' | 'monthly';
    };
    metrics: Array<{
        date: Date;
        platform: string;
        data: {
            impressions?: number;
            clicks?: number;
            conversions?: number;
            revenue?: number;
            cost?: number;
            ctr?: number;
            cvr?: number;
            cpc?: number;
            cpa?: number;
            roas?: number;
            roi?: number;
        };
    }>;
    summary: {
        total_impressions: number;
        total_clicks: number;
        total_conversions: number;
        total_revenue: number;
        total_cost: number;
        average_ctr: number;
        average_cvr: number;
        overall_roas: number;
        overall_roi: number;
    };
    trends: {
        performance_trend: 'improving' | 'stable' | 'declining';
        key_insights: string[];
        recommendations: string[];
    };
    created_at: Date;
    updated_at: Date;
}
export declare const ProductAnalysis: mongoose.Model<IProductAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IProductAnalysis, {}, {}> & IProductAnalysis & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const GeneratedContent: mongoose.Model<IGeneratedContent, {}, {}, {}, mongoose.Document<unknown, {}, IGeneratedContent, {}, {}> & IGeneratedContent & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const MarketingStrategy: mongoose.Model<IMarketingStrategy, {}, {}, {}, mongoose.Document<unknown, {}, IMarketingStrategy, {}, {}> & IMarketingStrategy & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export declare const PerformanceTracking: mongoose.Model<IPerformanceTracking, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceTracking, {}, {}> & IPerformanceTracking & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
declare const _default: {
    ProductAnalysis: mongoose.Model<IProductAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IProductAnalysis, {}, {}> & IProductAnalysis & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
    GeneratedContent: mongoose.Model<IGeneratedContent, {}, {}, {}, mongoose.Document<unknown, {}, IGeneratedContent, {}, {}> & IGeneratedContent & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
    MarketingStrategy: mongoose.Model<IMarketingStrategy, {}, {}, {}, mongoose.Document<unknown, {}, IMarketingStrategy, {}, {}> & IMarketingStrategy & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
    PerformanceTracking: mongoose.Model<IPerformanceTracking, {}, {}, {}, mongoose.Document<unknown, {}, IPerformanceTracking, {}, {}> & IPerformanceTracking & Required<{
        _id: mongoose.Types.ObjectId;
    }> & {
        __v: number;
    }, any>;
};
export default _default;
//# sourceMappingURL=OperationAnalysis.d.ts.map