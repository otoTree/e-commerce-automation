import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    task_id: string;
    type: 'full_data_collection' | 'deep_analysis' | 'market_heat_detection' | 'keyword_collection';
    status: 'pending' | 'running' | 'completed' | 'failed';
    input: {
        product_urls?: string[];
        product_ids?: string[];
        analysis_options?: Record<string, any>;
        keywords?: string[];
        platform?: string;
        result_count?: number;
        filters?: Record<string, string | number | boolean>;
    };
    output?: {
        collected_products?: string[];
        analysis_results?: string[];
        error_details?: string;
        success_count?: number;
        failure_count?: number;
    };
    meta: {
        created_at: Date;
        started_at?: Date;
        completed_at?: Date;
        duration?: number;
        retry_count: number;
        max_retries: number;
    };
    progress: {
        total_items: number;
        processed_items: number;
        current_item?: string;
        percentage: number;
    };
}
export declare const TaskModel: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=TaskModel.d.ts.map