import mongoose, { Schema, Document } from 'mongoose';

// 热度历史点接口
interface IHeatPoint {
  heat_score: number;
  date: Date;
}

// 深度分析结果接口
export interface IDeepAnalysisResult extends Document {
  product_id: string;
  
  // 深度分析维度
  deep_analysis: {
    // 商品竞争力分析
    competitiveness: {
      score: number; // 0-100
      factors: {
        price_advantage: number;
        quality_indicators: number;
        supplier_reliability: number;
        product_uniqueness: number;
      };
      insights: string[];
    };
    
    // 盈利潜力分析
    profit_potential: {
      score: number; // 0-100
      estimated_margin: number;
      cost_analysis: {
        product_cost: number;
        shipping_cost: number;
        platform_fees: number;
        marketing_cost: number;
      };
      roi_projection: number;
    };
    
    // 市场定位分析
    market_positioning: {
      target_segment: string;
      price_tier: 'low' | 'mid' | 'high';
      differentiation_points: string[];
      competitive_landscape: string;
    };
  };
  
  // 市场热度检测
  market_heat: {
    current_heat_score: number; // 0-100
    heat_trend: 'rising' | 'stable' | 'declining';
    heat_factors: {
      search_volume_trend: number;
      sales_velocity: number;
      price_stability: number;
      seasonal_factor: number;
    };
    heat_history: IHeatPoint[];
  };
  
  // 综合评分和建议
  overall_assessment: {
    total_score: number; // 0-100
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'avoid';
    confidence_level: number; // 0-1
    key_reasons: string[];
    risk_factors: string[];
  };
  
  // 分析元数据
  analysis_meta: {
    analyzed_at: Date;
    analysis_version: string;
    processing_time: number;
  };
}

// 热度历史点Schema
const HeatPointSchema = new Schema<IHeatPoint>({
  heat_score: { type: Number, required: true, min: 0, max: 100 },
  date: { type: Date, required: true }
}, { _id: false });

// 深度分析结果Schema
const DeepAnalysisResultSchema = new Schema<IDeepAnalysisResult>({
  product_id: { 
    type: String, 
    required: true,
    ref: 'ProductFullData'
  },
  
  deep_analysis: {
    competitiveness: {
      score: { type: Number, required: true, min: 0, max: 100 },
      factors: {
        price_advantage: { type: Number, required: true, min: 0, max: 100 },
        quality_indicators: { type: Number, required: true, min: 0, max: 100 },
        supplier_reliability: { type: Number, required: true, min: 0, max: 100 },
        product_uniqueness: { type: Number, required: true, min: 0, max: 100 }
      },
      insights: [{ type: String }]
    },
    
    profit_potential: {
      score: { type: Number, required: true, min: 0, max: 100 },
      estimated_margin: { type: Number, required: true },
      cost_analysis: {
        product_cost: { type: Number, required: true },
        shipping_cost: { type: Number, required: true },
        platform_fees: { type: Number, required: true },
        marketing_cost: { type: Number, required: true }
      },
      roi_projection: { type: Number, required: true }
    },
    
    market_positioning: {
      target_segment: { type: String, required: true },
      price_tier: { 
        type: String, 
        required: true, 
        enum: ['low', 'mid', 'high'] 
      },
      differentiation_points: [{ type: String }],
      competitive_landscape: { type: String, required: true }
    }
  },
  
  market_heat: {
    current_heat_score: { type: Number, required: true, min: 0, max: 100 },
    heat_trend: { 
      type: String, 
      required: true, 
      enum: ['rising', 'stable', 'declining'] 
    },
    heat_factors: {
      search_volume_trend: { type: Number, required: true },
      sales_velocity: { type: Number, required: true },
      price_stability: { type: Number, required: true },
      seasonal_factor: { type: Number, required: true }
    },
    heat_history: [HeatPointSchema]
  },
  
  overall_assessment: {
    total_score: { type: Number, required: true, min: 0, max: 100 },
    recommendation: { 
      type: String, 
      required: true, 
      enum: ['strong_buy', 'buy', 'hold', 'avoid'] 
    },
    confidence_level: { type: Number, required: true, min: 0, max: 1 },
    key_reasons: [{ type: String }],
    risk_factors: [{ type: String }]
  },
  
  analysis_meta: {
    analyzed_at: { type: Date, required: true, default: Date.now },
    analysis_version: { type: String, required: true, default: '1.0' },
    processing_time: { type: Number, required: true }
  }
}, {
  timestamps: true,
  collection: 'deep_analysis_results'
});

// 创建索引
DeepAnalysisResultSchema.index({ product_id: 1 }, { unique: true });
DeepAnalysisResultSchema.index({ 'overall_assessment.total_score': -1 });
DeepAnalysisResultSchema.index({ 'overall_assessment.recommendation': 1 });
DeepAnalysisResultSchema.index({ 'market_heat.current_heat_score': -1 });
DeepAnalysisResultSchema.index({ 'analysis_meta.analyzed_at': -1 });

export const DeepAnalysisResult = mongoose.model<IDeepAnalysisResult>('DeepAnalysisResult', DeepAnalysisResultSchema);