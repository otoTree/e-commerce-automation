import mongoose, { Document } from 'mongoose';
export type ContentType = 'title' | 'description' | 'features' | 'keywords' | 'images' | 'video' | 'tags' | 'specifications';
export type ContentStatus = 'draft' | 'review' | 'approved' | 'rejected' | 'published';
export interface IGeneratedContent extends Document {
    task_id: mongoose.Types.ObjectId;
    product_id: string;
    content_id: string;
    type: ContentType;
    platform: string;
    language: string;
    content: {
        raw_content: string | string[] | Record<string, any>;
        formatted_content: {
            html?: string;
            markdown?: string;
            plain_text?: string;
            structured_data?: Record<string, any>;
        };
        metadata: {
            word_count?: number;
            character_count?: number;
            readability_score?: number;
            seo_score?: number;
            keywords_density?: Record<string, number>;
            sentiment_score?: number;
        };
    };
    generation_config: {
        ai_model: string;
        prompt_template: string;
        parameters: {
            temperature?: number;
            max_tokens?: number;
            top_p?: number;
            frequency_penalty?: number;
            presence_penalty?: number;
        };
        requirements: {
            tone?: 'professional' | 'casual' | 'persuasive' | 'informative' | 'friendly';
            style?: 'formal' | 'informal' | 'technical' | 'marketing' | 'educational';
            length?: 'short' | 'medium' | 'long' | 'custom';
            target_audience?: string;
            keywords?: string[];
            avoid_words?: string[];
        };
    };
    quality_assessment: {
        overall_score: number;
        criteria_scores: {
            relevance: number;
            clarity: number;
            engagement: number;
            seo_optimization: number;
            brand_alignment: number;
        };
        feedback: string[];
        suggestions: string[];
    };
    localization: {
        source_language?: string;
        translation_quality?: number;
        cultural_adaptation?: {
            local_references: string[];
            cultural_sensitivity_score: number;
            market_specific_terms: string[];
        };
    };
    version_info: {
        version: string;
        parent_version?: string;
        changes_summary?: string;
        is_latest: boolean;
    };
    review_info: {
        status: ContentStatus;
        reviewer_id?: mongoose.Types.ObjectId;
        reviewed_at?: Date;
        review_comments?: string;
        approval_notes?: string;
        rejection_reason?: string;
    };
    usage_stats: {
        view_count: number;
        copy_count: number;
        download_count: number;
        share_count: number;
        last_accessed: Date;
    };
    performance_metrics: {
        click_through_rate?: number;
        conversion_rate?: number;
        engagement_rate?: number;
        bounce_rate?: number;
        time_on_page?: number;
    };
    created_at: Date;
    updated_at: Date;
    published_at?: Date;
    created_by: mongoose.Types.ObjectId;
}
export declare const GeneratedContent: mongoose.Model<IGeneratedContent, {}, {}, {}, mongoose.Document<unknown, {}, IGeneratedContent, {}, {}> & IGeneratedContent & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default GeneratedContent;
//# sourceMappingURL=GeneratedContent.d.ts.map