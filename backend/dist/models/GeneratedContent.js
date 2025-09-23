import mongoose, { Document, Schema } from 'mongoose';
// 生成内容Schema
const GeneratedContentSchema = new Schema({
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
    content_id: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['title', 'description', 'features', 'keywords', 'images', 'video', 'tags', 'specifications'],
        required: true,
        index: true
    },
    platform: {
        type: String,
        required: true,
        index: true
    },
    language: {
        type: String,
        required: true,
        default: 'ru'
    },
    content: {
        raw_content: {
            type: Schema.Types.Mixed,
            required: true
        },
        formatted_content: {
            html: { type: String },
            markdown: { type: String },
            plain_text: { type: String },
            structured_data: { type: Schema.Types.Mixed }
        },
        metadata: {
            word_count: { type: Number, min: 0 },
            character_count: { type: Number, min: 0 },
            readability_score: { type: Number, min: 0, max: 100 },
            seo_score: { type: Number, min: 0, max: 100 },
            keywords_density: { type: Schema.Types.Mixed },
            sentiment_score: { type: Number, min: -1, max: 1 }
        }
    },
    generation_config: {
        ai_model: {
            type: String,
            required: true,
            default: 'gpt-3.5-turbo'
        },
        prompt_template: {
            type: String,
            required: true
        },
        parameters: {
            temperature: { type: Number, min: 0, max: 2, default: 0.7 },
            max_tokens: { type: Number, min: 1, default: 1000 },
            top_p: { type: Number, min: 0, max: 1, default: 1 },
            frequency_penalty: { type: Number, min: -2, max: 2, default: 0 },
            presence_penalty: { type: Number, min: -2, max: 2, default: 0 }
        },
        requirements: {
            tone: {
                type: String,
                enum: ['professional', 'casual', 'persuasive', 'informative', 'friendly']
            },
            style: {
                type: String,
                enum: ['formal', 'informal', 'technical', 'marketing', 'educational']
            },
            length: {
                type: String,
                enum: ['short', 'medium', 'long', 'custom']
            },
            target_audience: { type: String },
            keywords: [{ type: String }],
            avoid_words: [{ type: String }]
        }
    },
    quality_assessment: {
        overall_score: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },
        criteria_scores: {
            relevance: { type: Number, min: 0, max: 100, default: 0 },
            clarity: { type: Number, min: 0, max: 100, default: 0 },
            engagement: { type: Number, min: 0, max: 100, default: 0 },
            seo_optimization: { type: Number, min: 0, max: 100, default: 0 },
            brand_alignment: { type: Number, min: 0, max: 100, default: 0 }
        },
        feedback: [{ type: String }],
        suggestions: [{ type: String }]
    },
    localization: {
        source_language: { type: String },
        translation_quality: { type: Number, min: 0, max: 100 },
        cultural_adaptation: {
            local_references: [{ type: String }],
            cultural_sensitivity_score: { type: Number, min: 0, max: 100 },
            market_specific_terms: [{ type: String }]
        }
    },
    version_info: {
        version: {
            type: String,
            required: true,
            default: '1.0.0'
        },
        parent_version: { type: String },
        changes_summary: { type: String },
        is_latest: {
            type: Boolean,
            default: true
        }
    },
    review_info: {
        status: {
            type: String,
            enum: ['draft', 'review', 'approved', 'rejected', 'published'],
            default: 'draft',
            index: true
        },
        reviewer_id: { type: Schema.Types.ObjectId, ref: 'User' },
        reviewed_at: { type: Date },
        review_comments: { type: String },
        approval_notes: { type: String },
        rejection_reason: { type: String }
    },
    usage_stats: {
        view_count: { type: Number, min: 0, default: 0 },
        copy_count: { type: Number, min: 0, default: 0 },
        download_count: { type: Number, min: 0, default: 0 },
        share_count: { type: Number, min: 0, default: 0 },
        last_accessed: { type: Date, default: Date.now }
    },
    performance_metrics: {
        click_through_rate: { type: Number, min: 0, max: 1 },
        conversion_rate: { type: Number, min: 0, max: 1 },
        engagement_rate: { type: Number, min: 0, max: 1 },
        bounce_rate: { type: Number, min: 0, max: 1 },
        time_on_page: { type: Number, min: 0 }
    },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    published_at: { type: Date },
    created_by: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// 索引
GeneratedContentSchema.index({ task_id: 1 });
GeneratedContentSchema.index({ product_id: 1 });
GeneratedContentSchema.index({ content_id: 1 }, { unique: true });
GeneratedContentSchema.index({ type: 1, platform: 1 });
GeneratedContentSchema.index({ language: 1 });
GeneratedContentSchema.index({ 'review_info.status': 1 });
GeneratedContentSchema.index({ created_at: -1 });
GeneratedContentSchema.index({ 'quality_assessment.overall_score': -1 });
// 复合索引
GeneratedContentSchema.index({ product_id: 1, type: 1, platform: 1 });
GeneratedContentSchema.index({ task_id: 1, created_at: -1 });
GeneratedContentSchema.index({ type: 1, 'review_info.status': 1 });
// 文本搜索索引
GeneratedContentSchema.index({
    'content.formatted_content.plain_text': 'text',
    'generation_config.requirements.keywords': 'text'
});
// 虚拟字段
GeneratedContentSchema.virtual('is_approved').get(function () {
    return this.review_info.status === 'approved';
});
GeneratedContentSchema.virtual('is_published').get(function () {
    return this.review_info.status === 'published';
});
GeneratedContentSchema.virtual('quality_grade').get(function () {
    const score = this.quality_assessment.overall_score;
    if (score >= 90)
        return 'A';
    if (score >= 80)
        return 'B';
    if (score >= 70)
        return 'C';
    if (score >= 60)
        return 'D';
    return 'F';
});
// 静态方法
GeneratedContentSchema.statics.findByProduct = function (productId) {
    return this.find({ product_id: productId }).sort({ created_at: -1 });
};
GeneratedContentSchema.statics.findByTask = function (taskId) {
    return this.find({ task_id: taskId }).sort({ created_at: -1 });
};
GeneratedContentSchema.statics.findByType = function (type, platform) {
    const query = { type };
    if (platform)
        query.platform = platform;
    return this.find(query).sort({ created_at: -1 });
};
GeneratedContentSchema.statics.findApproved = function () {
    return this.find({ 'review_info.status': 'approved' }).sort({ created_at: -1 });
};
GeneratedContentSchema.statics.findHighQuality = function (minScore = 80) {
    return this.find({ 'quality_assessment.overall_score': { $gte: minScore } })
        .sort({ 'quality_assessment.overall_score': -1 });
};
// 实例方法
GeneratedContentSchema.methods.approve = function (reviewerId, notes) {
    this.review_info.status = 'approved';
    this.review_info.reviewer_id = new mongoose.Types.ObjectId(reviewerId);
    this.review_info.reviewed_at = new Date();
    if (notes)
        this.review_info.approval_notes = notes;
    this.updated_at = new Date();
    return this.save();
};
GeneratedContentSchema.methods.reject = function (reviewerId, reason) {
    this.review_info.status = 'rejected';
    this.review_info.reviewer_id = new mongoose.Types.ObjectId(reviewerId);
    this.review_info.reviewed_at = new Date();
    this.review_info.rejection_reason = reason;
    this.updated_at = new Date();
    return this.save();
};
GeneratedContentSchema.methods.publish = function () {
    if (this.review_info.status !== 'approved') {
        throw new Error('Content must be approved before publishing');
    }
    this.review_info.status = 'published';
    this.published_at = new Date();
    this.updated_at = new Date();
    return this.save();
};
GeneratedContentSchema.methods.incrementUsage = function (type) {
    switch (type) {
        case 'view':
            this.usage_stats.view_count += 1;
            break;
        case 'copy':
            this.usage_stats.copy_count += 1;
            break;
        case 'download':
            this.usage_stats.download_count += 1;
            break;
        case 'share':
            this.usage_stats.share_count += 1;
            break;
    }
    this.usage_stats.last_accessed = new Date();
    return this.save();
};
// 中间件
GeneratedContentSchema.pre('save', function (next) {
    if (this.isModified() && !this.isNew) {
        this.updated_at = new Date();
    }
    // 计算内容元数据
    if (this.isModified('content.raw_content')) {
        const content = typeof this.content.raw_content === 'string'
            ? this.content.raw_content
            : JSON.stringify(this.content.raw_content);
        this.content.metadata.character_count = content.length;
        this.content.metadata.word_count = content.split(/\s+/).length;
    }
    next();
});
// 确保只有一个最新版本
GeneratedContentSchema.pre('save', async function (next) {
    if (this.version_info.is_latest && this.isModified('version_info.is_latest')) {
        // 将同一产品和类型的其他内容标记为非最新
        const GeneratedContentModel = this.constructor;
        await GeneratedContentModel.updateMany({
            product_id: this.product_id,
            type: this.type,
            platform: this.platform,
            _id: { $ne: this._id }
        }, { 'version_info.is_latest': false });
    }
    next();
});
export const GeneratedContent = mongoose.model('GeneratedContent', GeneratedContentSchema);
export default GeneratedContent;
//# sourceMappingURL=GeneratedContent.js.map