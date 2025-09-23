import mongoose, { Document } from 'mongoose';
export type StrategyType = 'pricing' | 'promotion' | 'positioning' | 'targeting' | 'content' | 'advertising' | 'seo' | 'social_media';
export type StrategyStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
export type AudienceType = 'demographic' | 'psychographic' | 'behavioral' | 'geographic';
export interface IMarketingStrategy extends Document {
    task_id: mongoose.Types.ObjectId;
    product_id: string;
    strategy_id: string;
    name: string;
    description: string;
    type: StrategyType;
    platform: string;
    objectives: {
        primary_goal: 'awareness' | 'consideration' | 'conversion' | 'retention' | 'advocacy';
        secondary_goals: string[];
        kpi_targets: {
            metric_name: string;
            target_value: number;
            unit: string;
            timeframe: string;
        }[];
        budget_allocation: {
            total_budget: number;
            currency: string;
            distribution: {
                channel: string;
                percentage: number;
                amount: number;
            }[];
        };
    };
    target_audience: {
        segments: {
            segment_id: string;
            name: string;
            type: AudienceType;
            criteria: {
                age_range?: {
                    min: number;
                    max: number;
                };
                gender?: 'male' | 'female' | 'all';
                income_range?: {
                    min: number;
                    max: number;
                    currency: string;
                };
                location?: {
                    countries: string[];
                    cities?: string[];
                    regions?: string[];
                };
                interests?: string[];
                behaviors?: string[];
                purchase_history?: {
                    categories: string[];
                    frequency: 'low' | 'medium' | 'high';
                    value_range?: {
                        min: number;
                        max: number;
                    };
                };
            };
            size_estimate: number;
            priority: 'primary' | 'secondary' | 'tertiary';
        }[];
        personas: {
            persona_id: string;
            name: string;
            description: string;
            demographics: Record<string, any>;
            pain_points: string[];
            motivations: string[];
            preferred_channels: string[];
            buying_behavior: {
                decision_factors: string[];
                purchase_triggers: string[];
                research_methods: string[];
                decision_timeline: string;
            };
        }[];
    };
    strategy_details: {
        pricing?: {
            strategy_type: 'penetration' | 'skimming' | 'competitive' | 'value_based' | 'cost_plus';
            base_price: number;
            currency: string;
            discount_structure: {
                type: 'percentage' | 'fixed_amount' | 'tiered';
                conditions: Record<string, any>;
                value: number;
            }[];
            dynamic_pricing: {
                enabled: boolean;
                factors: string[];
                rules: Record<string, any>[];
            };
        };
        promotion?: {
            campaigns: {
                campaign_id: string;
                name: string;
                type: 'discount' | 'bundle' | 'loyalty' | 'referral' | 'seasonal';
                description: string;
                start_date: Date;
                end_date: Date;
                budget: number;
                target_audience: string[];
                channels: string[];
                creative_assets: {
                    asset_type: 'image' | 'video' | 'text' | 'audio';
                    asset_url: string;
                    description: string;
                }[];
                performance_tracking: {
                    metrics: string[];
                    tracking_urls: Record<string, string>;
                };
            }[];
        };
        content?: {
            content_pillars: {
                pillar_name: string;
                description: string;
                content_types: string[];
                posting_frequency: string;
                target_engagement: number;
            }[];
            content_calendar: {
                date: Date;
                content_type: string;
                title: string;
                description: string;
                platform: string;
                status: 'planned' | 'created' | 'scheduled' | 'published';
            }[];
            brand_guidelines: {
                tone_of_voice: string;
                visual_style: Record<string, any>;
                messaging_framework: Record<string, any>;
            };
        };
        seo?: {
            target_keywords: {
                keyword: string;
                search_volume: number;
                competition: 'low' | 'medium' | 'high';
                difficulty: number;
                priority: number;
            }[];
            content_optimization: {
                title_templates: string[];
                meta_description_templates: string[];
                header_structure: Record<string, any>;
                internal_linking_strategy: Record<string, any>;
            };
            technical_seo: {
                page_speed_targets: Record<string, number>;
                mobile_optimization: Record<string, any>;
                schema_markup: Record<string, any>;
            };
        };
    };
    execution_plan: {
        phases: {
            phase_id: string;
            name: string;
            description: string;
            start_date: Date;
            end_date: Date;
            deliverables: {
                deliverable_id: string;
                name: string;
                description: string;
                due_date: Date;
                assigned_to?: mongoose.Types.ObjectId;
                status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
                dependencies: string[];
            }[];
            milestones: {
                milestone_id: string;
                name: string;
                date: Date;
                criteria: string[];
                status: 'pending' | 'achieved' | 'missed';
            }[];
        }[];
        resources: {
            human_resources: {
                role: string;
                count: number;
                skills_required: string[];
                time_allocation: number;
            }[];
            tools_and_platforms: {
                tool_name: string;
                purpose: string;
                cost: number;
                subscription_type: 'monthly' | 'yearly' | 'one_time';
            }[];
            budget_breakdown: {
                category: string;
                allocated_amount: number;
                spent_amount: number;
                remaining_amount: number;
            }[];
        };
    };
    risk_assessment: {
        risks: {
            risk_id: string;
            description: string;
            category: 'market' | 'competitive' | 'operational' | 'financial' | 'regulatory';
            probability: 'low' | 'medium' | 'high';
            impact: 'low' | 'medium' | 'high';
            severity_score: number;
            mitigation_strategies: string[];
            contingency_plans: string[];
            owner: mongoose.Types.ObjectId;
        }[];
        overall_risk_score: number;
        risk_tolerance: 'conservative' | 'moderate' | 'aggressive';
    };
    performance_metrics: {
        current_metrics: {
            metric_name: string;
            current_value: number;
            target_value: number;
            unit: string;
            trend: 'improving' | 'stable' | 'declining';
            last_updated: Date;
        }[];
        historical_data: {
            date: Date;
            metrics: Record<string, number>;
        }[];
        benchmarks: {
            metric_name: string;
            industry_average: number;
            competitor_average: number;
            best_in_class: number;
            our_performance: number;
        }[];
    };
    status: StrategyStatus;
    approval_workflow: {
        current_stage: string;
        approvers: {
            user_id: mongoose.Types.ObjectId;
            role: string;
            status: 'pending' | 'approved' | 'rejected';
            comments?: string;
            timestamp?: Date;
        }[];
        final_approval: {
            approved: boolean;
            approved_by?: mongoose.Types.ObjectId;
            approved_at?: Date;
            conditions?: string[];
        };
    };
    created_at: Date;
    updated_at: Date;
    activated_at?: Date;
    completed_at?: Date;
    created_by: mongoose.Types.ObjectId;
}
export declare const MarketingStrategy: mongoose.Model<IMarketingStrategy, {}, {}, {}, mongoose.Document<unknown, {}, IMarketingStrategy, {}, {}> & IMarketingStrategy & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default MarketingStrategy;
//# sourceMappingURL=MarketingStrategy.d.ts.map