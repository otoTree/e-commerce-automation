import mongoose, { Document } from 'mongoose';
export interface IProductAnalysis extends Document {
    task_id: mongoose.Types.ObjectId;
    product_id: string;
    analysis_id: string;
    overall_score: number;
    market_potential: {
        score: number;
        trends: string[];
        seasonality: string;
        competition: 'low' | 'medium' | 'high';
        market_size: {
            estimated_value: number;
            growth_rate: number;
            currency: string;
        };
    };
    target_audience: {
        demographics: string[];
        interests: string[];
        pain_points: string[];
        buying_behavior: string;
        age_range: {
            min: number;
            max: number;
        };
        gender_distribution: {
            male: number;
            female: number;
            other: number;
        };
    };
    competitor_analysis: {
        main_competitors: Array<{
            name: string;
            price: number;
            rating: number;
            market_share: number;
            strengths: string[];
            weaknesses: string[];
        }>;
        price_range: {
            min: number;
            max: number;
            average: number;
            currency: string;
        };
        differentiators: string[];
        market_gaps: string[];
        competitive_advantage: string;
    };
    swot_analysis: {
        strengths: string[];
        weaknesses: string[];
        opportunities: string[];
        threats: string[];
    };
    recommendations: {
        pricing: {
            suggested_price: number;
            pricing_strategy: 'penetration' | 'skimming' | 'competitive' | 'value_based';
            reasoning: string;
        };
        positioning: {
            value_proposition: string;
            key_messages: string[];
            brand_positioning: string;
        };
        channels: Array<{
            channel: string;
            priority: 'high' | 'medium' | 'low';
            reasoning: string;
            expected_performance: {
                reach: number;
                conversion_rate: number;
                cost_per_acquisition: number;
            };
        }>;
        timeline: {
            launch_date: Date;
            milestones: Array<{
                date: Date;
                description: string;
                deliverables: string[];
            }>;
        };
    };
    risk_assessment: {
        overall_risk: 'low' | 'medium' | 'high';
        risk_factors: Array<{
            factor: string;
            impact: 'low' | 'medium' | 'high';
            probability: 'low' | 'medium' | 'high';
            mitigation: string;
        }>;
    };
    predictions: {
        sales_forecast: {
            monthly_units: number;
            monthly_revenue: number;
            growth_trajectory: 'linear' | 'exponential' | 'plateau';
            confidence_level: number;
        };
        roi_projection: {
            investment_required: number;
            expected_roi: number;
            payback_period: number;
            break_even_point: number;
        };
    };
    analysis_metadata: {
        analysis_type: 'basic' | 'comprehensive' | 'custom';
        data_sources: string[];
        analysis_duration: number;
        confidence_score: number;
        last_updated: Date;
        version: string;
    };
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
}
export declare const ProductAnalysis: mongoose.Model<IProductAnalysis, {}, {}, {}, mongoose.Document<unknown, {}, IProductAnalysis, {}, {}> & IProductAnalysis & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default ProductAnalysis;
//# sourceMappingURL=ProductAnalysis.d.ts.map