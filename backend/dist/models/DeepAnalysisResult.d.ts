import mongoose, { Document } from 'mongoose';
interface IHeatPoint {
    heat_score: number;
    date: Date;
}
export interface IDeepAnalysisResult extends Document {
    product_id: string;
    deep_analysis: {
        competitiveness: {
            score: number;
            factors: {
                price_advantage: number;
                quality_indicators: number;
                supplier_reliability: number;
                product_uniqueness: number;
            };
            insights: string[];
        };
        profit_potential: {
            score: number;
            estimated_margin: number;
            cost_analysis: {
                product_cost: number;
                shipping_cost: number;
                platform_fees: number;
                marketing_cost: number;
            };
            roi_projection: number;
        };
        market_positioning: {
            target_segment: string;
            price_tier: 'low' | 'mid' | 'high';
            differentiation_points: string[];
            competitive_landscape: string;
        };
    };
    market_heat: {
        current_heat_score: number;
        heat_trend: 'rising' | 'stable' | 'declining';
        heat_factors: {
            search_volume_trend: number;
            sales_velocity: number;
            price_stability: number;
            seasonal_factor: number;
        };
        heat_history: IHeatPoint[];
    };
    overall_assessment: {
        total_score: number;
        recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
        confidence_level: number;
        key_reasons: string[];
        risk_factors: string[];
    };
    analysis_meta: {
        analyzed_at: Date;
        analysis_version: string;
        processing_time: number;
    };
}
export declare const DeepAnalysisResult: mongoose.Model<IDeepAnalysisResult, {}, {}, {}, mongoose.Document<unknown, {}, IDeepAnalysisResult, {}, {}> & IDeepAnalysisResult & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=DeepAnalysisResult.d.ts.map