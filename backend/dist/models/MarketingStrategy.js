import mongoose, { Document, Schema } from 'mongoose';
// 营销策略Schema
const MarketingStrategySchema = new Schema({
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
    strategy_id: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['pricing', 'promotion', 'positioning', 'targeting', 'content', 'advertising', 'seo', 'social_media'],
        required: true,
        index: true
    },
    platform: {
        type: String,
        required: true,
        index: true
    },
    objectives: {
        primary_goal: {
            type: String,
            enum: ['awareness', 'consideration', 'conversion', 'retention', 'advocacy'],
            required: true
        },
        secondary_goals: [{ type: String }],
        kpi_targets: [{
                metric_name: { type: String, required: true },
                target_value: { type: Number, required: true },
                unit: { type: String, required: true },
                timeframe: { type: String, required: true }
            }],
        budget_allocation: {
            total_budget: { type: Number, required: true, min: 0 },
            currency: { type: String, required: true, default: 'RUB' },
            distribution: [{
                    channel: { type: String, required: true },
                    percentage: { type: Number, required: true, min: 0, max: 100 },
                    amount: { type: Number, required: true, min: 0 }
                }]
        }
    },
    target_audience: {
        segments: [{
                segment_id: { type: String, required: true },
                name: { type: String, required: true },
                type: {
                    type: String,
                    enum: ['demographic', 'psychographic', 'behavioral', 'geographic'],
                    required: true
                },
                criteria: {
                    age_range: {
                        min: { type: Number, min: 0, max: 120 },
                        max: { type: Number, min: 0, max: 120 }
                    },
                    gender: {
                        type: String,
                        enum: ['male', 'female', 'all']
                    },
                    income_range: {
                        min: { type: Number, min: 0 },
                        max: { type: Number, min: 0 },
                        currency: { type: String }
                    },
                    location: {
                        countries: [{ type: String }],
                        cities: [{ type: String }],
                        regions: [{ type: String }]
                    },
                    interests: [{ type: String }],
                    behaviors: [{ type: String }],
                    purchase_history: {
                        categories: [{ type: String }],
                        frequency: {
                            type: String,
                            enum: ['low', 'medium', 'high']
                        },
                        value_range: {
                            min: { type: Number, min: 0 },
                            max: { type: Number, min: 0 }
                        }
                    }
                },
                size_estimate: { type: Number, min: 0 },
                priority: {
                    type: String,
                    enum: ['primary', 'secondary', 'tertiary'],
                    required: true
                }
            }],
        personas: [{
                persona_id: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String, required: true },
                demographics: { type: Schema.Types.Mixed },
                pain_points: [{ type: String }],
                motivations: [{ type: String }],
                preferred_channels: [{ type: String }],
                buying_behavior: {
                    decision_factors: [{ type: String }],
                    purchase_triggers: [{ type: String }],
                    research_methods: [{ type: String }],
                    decision_timeline: { type: String }
                }
            }]
    },
    strategy_details: {
        pricing: {
            strategy_type: {
                type: String,
                enum: ['penetration', 'skimming', 'competitive', 'value_based', 'cost_plus']
            },
            base_price: { type: Number, min: 0 },
            currency: { type: String },
            discount_structure: [{
                    type: {
                        type: String,
                        enum: ['percentage', 'fixed_amount', 'tiered']
                    },
                    conditions: { type: Schema.Types.Mixed },
                    value: { type: Number }
                }],
            dynamic_pricing: {
                enabled: { type: Boolean, default: false },
                factors: [{ type: String }],
                rules: [{ type: Schema.Types.Mixed }]
            }
        },
        promotion: {
            campaigns: [{
                    campaign_id: { type: String, required: true },
                    name: { type: String, required: true },
                    type: {
                        type: String,
                        enum: ['discount', 'bundle', 'loyalty', 'referral', 'seasonal'],
                        required: true
                    },
                    description: { type: String },
                    start_date: { type: Date, required: true },
                    end_date: { type: Date, required: true },
                    budget: { type: Number, min: 0 },
                    target_audience: [{ type: String }],
                    channels: [{ type: String }],
                    creative_assets: [{
                            asset_type: {
                                type: String,
                                enum: ['image', 'video', 'text', 'audio']
                            },
                            asset_url: { type: String },
                            description: { type: String }
                        }],
                    performance_tracking: {
                        metrics: [{ type: String }],
                        tracking_urls: { type: Schema.Types.Mixed }
                    }
                }]
        },
        content: {
            content_pillars: [{
                    pillar_name: { type: String, required: true },
                    description: { type: String },
                    content_types: [{ type: String }],
                    posting_frequency: { type: String },
                    target_engagement: { type: Number, min: 0 }
                }],
            content_calendar: [{
                    date: { type: Date, required: true },
                    content_type: { type: String, required: true },
                    title: { type: String, required: true },
                    description: { type: String },
                    platform: { type: String, required: true },
                    status: {
                        type: String,
                        enum: ['planned', 'created', 'scheduled', 'published'],
                        default: 'planned'
                    }
                }],
            brand_guidelines: {
                tone_of_voice: { type: String },
                visual_style: { type: Schema.Types.Mixed },
                messaging_framework: { type: Schema.Types.Mixed }
            }
        },
        seo: {
            target_keywords: [{
                    keyword: { type: String, required: true },
                    search_volume: { type: Number, min: 0 },
                    competition: {
                        type: String,
                        enum: ['low', 'medium', 'high']
                    },
                    difficulty: { type: Number, min: 0, max: 100 },
                    priority: { type: Number, min: 1, max: 10 }
                }],
            content_optimization: {
                title_templates: [{ type: String }],
                meta_description_templates: [{ type: String }],
                header_structure: { type: Schema.Types.Mixed },
                internal_linking_strategy: { type: Schema.Types.Mixed }
            },
            technical_seo: {
                page_speed_targets: { type: Schema.Types.Mixed },
                mobile_optimization: { type: Schema.Types.Mixed },
                schema_markup: { type: Schema.Types.Mixed }
            }
        }
    },
    execution_plan: {
        phases: [{
                phase_id: { type: String, required: true },
                name: { type: String, required: true },
                description: { type: String },
                start_date: { type: Date, required: true },
                end_date: { type: Date, required: true },
                deliverables: [{
                        deliverable_id: { type: String, required: true },
                        name: { type: String, required: true },
                        description: { type: String },
                        due_date: { type: Date, required: true },
                        assigned_to: { type: Schema.Types.ObjectId, ref: 'User' },
                        status: {
                            type: String,
                            enum: ['not_started', 'in_progress', 'completed', 'delayed'],
                            default: 'not_started'
                        },
                        dependencies: [{ type: String }]
                    }],
                milestones: [{
                        milestone_id: { type: String, required: true },
                        name: { type: String, required: true },
                        date: { type: Date, required: true },
                        criteria: [{ type: String }],
                        status: {
                            type: String,
                            enum: ['pending', 'achieved', 'missed'],
                            default: 'pending'
                        }
                    }]
            }],
        resources: {
            human_resources: [{
                    role: { type: String, required: true },
                    count: { type: Number, required: true, min: 1 },
                    skills_required: [{ type: String }],
                    time_allocation: { type: Number, min: 0 }
                }],
            tools_and_platforms: [{
                    tool_name: { type: String, required: true },
                    purpose: { type: String },
                    cost: { type: Number, min: 0 },
                    subscription_type: {
                        type: String,
                        enum: ['monthly', 'yearly', 'one_time']
                    }
                }],
            budget_breakdown: [{
                    category: { type: String, required: true },
                    allocated_amount: { type: Number, required: true, min: 0 },
                    spent_amount: { type: Number, default: 0, min: 0 },
                    remaining_amount: { type: Number, min: 0 }
                }]
        }
    },
    risk_assessment: {
        risks: [{
                risk_id: { type: String, required: true },
                description: { type: String, required: true },
                category: {
                    type: String,
                    enum: ['market', 'competitive', 'operational', 'financial', 'regulatory'],
                    required: true
                },
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
                severity_score: { type: Number, min: 1, max: 10, required: true },
                mitigation_strategies: [{ type: String }],
                contingency_plans: [{ type: String }],
                owner: { type: Schema.Types.ObjectId, ref: 'User', required: true }
            }],
        overall_risk_score: { type: Number, min: 1, max: 10, default: 5 },
        risk_tolerance: {
            type: String,
            enum: ['conservative', 'moderate', 'aggressive'],
            default: 'moderate'
        }
    },
    performance_metrics: {
        current_metrics: [{
                metric_name: { type: String, required: true },
                current_value: { type: Number, required: true },
                target_value: { type: Number, required: true },
                unit: { type: String, required: true },
                trend: {
                    type: String,
                    enum: ['improving', 'stable', 'declining'],
                    default: 'stable'
                },
                last_updated: { type: Date, default: Date.now }
            }],
        historical_data: [{
                date: { type: Date, required: true },
                metrics: { type: Schema.Types.Mixed, required: true }
            }],
        benchmarks: [{
                metric_name: { type: String, required: true },
                industry_average: { type: Number },
                competitor_average: { type: Number },
                best_in_class: { type: Number },
                our_performance: { type: Number, required: true }
            }]
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
        default: 'draft',
        index: true
    },
    approval_workflow: {
        current_stage: { type: String, default: 'draft' },
        approvers: [{
                user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
                role: { type: String, required: true },
                status: {
                    type: String,
                    enum: ['pending', 'approved', 'rejected'],
                    default: 'pending'
                },
                comments: { type: String },
                timestamp: { type: Date }
            }],
        final_approval: {
            approved: { type: Boolean, default: false },
            approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
            approved_at: { type: Date },
            conditions: [{ type: String }]
        }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    activated_at: { type: Date },
    completed_at: { type: Date },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
MarketingStrategySchema.index({ task_id: 1 });
MarketingStrategySchema.index({ product_id: 1 });
MarketingStrategySchema.index({ strategy_id: 1 }, { unique: true });
MarketingStrategySchema.index({ type: 1, platform: 1 });
MarketingStrategySchema.index({ status: 1 });
MarketingStrategySchema.index({ created_at: -1 });
MarketingStrategySchema.index({ 'objectives.primary_goal': 1 });
// 复合索引
MarketingStrategySchema.index({ product_id: 1, type: 1, status: 1 });
MarketingStrategySchema.index({ task_id: 1, created_at: -1 });
MarketingStrategySchema.index({ status: 1, 'execution_plan.phases.end_date': 1 });
// 文本搜索索引
MarketingStrategySchema.index({
    name: 'text',
    description: 'text',
    'target_audience.personas.name': 'text'
});
// 虚拟字段
MarketingStrategySchema.virtual('is_active').get(function () {
    return this.status === 'active';
});
MarketingStrategySchema.virtual('is_approved').get(function () {
    return this.approval_workflow.final_approval.approved;
});
MarketingStrategySchema.virtual('completion_percentage').get(function () {
    if (!this.execution_plan.phases.length)
        return 0;
    const totalDeliverables = this.execution_plan.phases.reduce((sum, phase) => sum + phase.deliverables.length, 0);
    if (totalDeliverables === 0)
        return 0;
    const completedDeliverables = this.execution_plan.phases.reduce((sum, phase) => sum + phase.deliverables.filter(d => d.status === 'completed').length, 0);
    return Math.round((completedDeliverables / totalDeliverables) * 100);
});
MarketingStrategySchema.virtual('budget_utilization').get(function () {
    if (!this.execution_plan.resources.budget_breakdown.length)
        return 0;
    const totalAllocated = this.execution_plan.resources.budget_breakdown.reduce((sum, item) => sum + item.allocated_amount, 0);
    if (totalAllocated === 0)
        return 0;
    const totalSpent = this.execution_plan.resources.budget_breakdown.reduce((sum, item) => sum + item.spent_amount, 0);
    return Math.round((totalSpent / totalAllocated) * 100);
});
// 静态方法
MarketingStrategySchema.statics.findByProduct = function (productId) {
    return this.find({ product_id: productId }).sort({ created_at: -1 });
};
MarketingStrategySchema.statics.findByTask = function (taskId) {
    return this.find({ task_id: taskId }).sort({ created_at: -1 });
};
MarketingStrategySchema.statics.findByType = function (type, platform) {
    const query = { type };
    if (platform)
        query.platform = platform;
    return this.find(query).sort({ created_at: -1 });
};
MarketingStrategySchema.statics.findActive = function () {
    return this.find({ status: 'active' }).sort({ created_at: -1 });
};
MarketingStrategySchema.statics.findPendingApproval = function () {
    return this.find({
        'approval_workflow.final_approval.approved': false,
        status: 'draft'
    }).sort({ created_at: -1 });
};
// 实例方法
MarketingStrategySchema.methods.activate = function () {
    if (!this.approval_workflow.final_approval.approved) {
        throw new Error('Strategy must be approved before activation');
    }
    this.status = 'active';
    this.activated_at = new Date();
    this.updated_at = new Date();
    return this.save();
};
MarketingStrategySchema.methods.pause = function () {
    if (this.status !== 'active') {
        throw new Error('Only active strategies can be paused');
    }
    this.status = 'paused';
    this.updated_at = new Date();
    return this.save();
};
MarketingStrategySchema.methods.complete = function () {
    this.status = 'completed';
    this.completed_at = new Date();
    this.updated_at = new Date();
    return this.save();
};
MarketingStrategySchema.methods.approve = function (approverId, conditions) {
    this.approval_workflow.final_approval.approved = true;
    this.approval_workflow.final_approval.approved_by = new mongoose.Types.ObjectId(approverId);
    this.approval_workflow.final_approval.approved_at = new Date();
    if (conditions)
        this.approval_workflow.final_approval.conditions = conditions;
    this.updated_at = new Date();
    return this.save();
};
MarketingStrategySchema.methods.updateBudgetSpent = function (category, amount) {
    const budgetItem = this.execution_plan.resources.budget_breakdown.find((item) => item.category === category);
    if (budgetItem) {
        budgetItem.spent_amount += amount;
        budgetItem.remaining_amount = budgetItem.allocated_amount - budgetItem.spent_amount;
        this.updated_at = new Date();
        return this.save();
    }
    throw new Error(`Budget category '${category}' not found`);
};
// 中间件
MarketingStrategySchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updated_at = new Date();
    }
    // 计算剩余预算
    if (this.isModified('execution_plan.resources.budget_breakdown')) {
        this.execution_plan.resources.budget_breakdown.forEach((item) => {
            item.remaining_amount = item.allocated_amount - item.spent_amount;
        });
    }
    next();
});
// 验证预算分配总和为100%
MarketingStrategySchema.pre('save', function (next) {
    if (this.isModified('objectives.budget_allocation.distribution')) {
        const totalPercentage = this.objectives.budget_allocation.distribution.reduce((sum, item) => sum + item.percentage, 0);
        if (Math.abs(totalPercentage - 100) > 0.01) {
            return next(new Error('Budget distribution percentages must sum to 100%'));
        }
    }
    next();
});
export const MarketingStrategy = mongoose.model('MarketingStrategy', MarketingStrategySchema);
export default MarketingStrategy;
//# sourceMappingURL=MarketingStrategy.js.map