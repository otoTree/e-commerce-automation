import mongoose, { Document } from 'mongoose';
export interface ITask extends Document {
    task_id: string;
    title: string;
    description?: string;
    type: 'data_collection' | 'content_generation' | 'analysis' | 'optimization' | 'custom';
    config: {
        data_collection?: {
            source_urls: string[];
            target_selectors: string[];
            pagination_config?: {
                enabled: boolean;
                max_pages: number;
                page_selector: string;
            };
            filters: {
                price_range?: {
                    min: number;
                    max: number;
                };
                keywords?: string[];
                exclude_keywords?: string[];
            };
        };
        content_generation?: {
            template_id?: mongoose.Types.ObjectId;
            ai_model: string;
            parameters: {
                temperature?: number;
                max_tokens?: number;
                prompt_template: string;
            };
            output_format: 'text' | 'html' | 'markdown' | 'json';
        };
        analysis?: {
            analysis_type: 'sentiment' | 'keyword' | 'trend' | 'competitor' | 'performance';
            data_sources: string[];
            metrics: string[];
            time_range?: {
                start_date: Date;
                end_date: Date;
            };
        };
        optimization?: {
            target_metric: string;
            optimization_type: 'price' | 'content' | 'seo' | 'inventory';
            constraints: {
                min_value?: number;
                max_value?: number;
                rules?: string[];
            };
        };
    };
    execution: {
        schedule: {
            type: 'immediate' | 'scheduled' | 'recurring';
            scheduled_at?: Date;
            recurring_pattern?: {
                frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
                interval: number;
                days_of_week?: number[];
                time_of_day?: string;
            };
            timezone: string;
        };
        limits: {
            max_execution_time: number;
            max_memory_usage: number;
            max_concurrent_tasks: number;
            retry_attempts: number;
            retry_delay: number;
        };
        notifications: {
            on_start: boolean;
            on_completion: boolean;
            on_error: boolean;
            recipients: Array<{
                type: 'email' | 'webhook' | 'slack';
                address: string;
            }>;
        };
    };
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled' | 'paused';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    execution_history: Array<{
        execution_id: string;
        started_at: Date;
        completed_at?: Date;
        status: 'running' | 'completed' | 'failed' | 'cancelled';
        result?: {
            success: boolean;
            data?: any;
            metrics?: {
                execution_time: number;
                memory_used: number;
                items_processed: number;
                errors_count: number;
            };
            output_files?: Array<{
                file_id: mongoose.Types.ObjectId;
                file_type: string;
                file_size: number;
                download_url: string;
            }>;
        };
        error?: {
            code: string;
            message: string;
            stack?: string;
            context?: any;
        };
        logs: Array<{
            timestamp: Date;
            level: 'info' | 'warn' | 'error' | 'debug';
            message: string;
            data?: any;
        }>;
    }>;
    dependencies: {
        parent_tasks: mongoose.Types.ObjectId[];
        child_tasks: mongoose.Types.ObjectId[];
        required_resources: Array<{
            type: 'file' | 'data' | 'service';
            resource_id: string;
            required: boolean;
        }>;
    };
    resources: {
        estimated_cost: number;
        actual_cost: number;
        cpu_usage: number;
        memory_usage: number;
        storage_usage: number;
        api_calls: number;
        limits: {
            max_cost: number;
            max_cpu: number;
            max_memory: number;
            max_storage: number;
            max_api_calls: number;
        };
    };
    output: {
        structured_data?: {
            format: 'json' | 'csv' | 'xml';
            schema?: any;
            data: any;
            record_count: number;
        };
        files?: Array<{
            file_id: mongoose.Types.ObjectId;
            filename: string;
            file_type: string;
            file_size: number;
            download_url: string;
            created_at: Date;
        }>;
        reports?: Array<{
            report_id: string;
            title: string;
            type: 'summary' | 'detailed' | 'analysis';
            format: 'html' | 'pdf' | 'json';
            content: any;
            generated_at: Date;
        }>;
        statistics: {
            total_items: number;
            successful_items: number;
            failed_items: number;
            processing_rate: number;
            accuracy_score?: number;
            quality_score?: number;
        };
    };
    quality_control: {
        validation_rules: Array<{
            field: string;
            rule_type: 'required' | 'format' | 'range' | 'custom';
            rule_value: any;
            error_message: string;
        }>;
        sampling: {
            enabled: boolean;
            sample_size: number;
            sample_method: 'random' | 'systematic' | 'stratified';
        };
        review: {
            required: boolean;
            reviewer_id?: mongoose.Types.ObjectId;
            reviewed_at?: Date;
            review_status: 'pending' | 'approved' | 'rejected';
            review_comments?: string;
        };
    };
    tags: string[];
    category: string;
    project_id?: mongoose.Types.ObjectId;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    is_deleted: boolean;
    deleted_at?: Date;
    deleted_by?: mongoose.Types.ObjectId;
}
export declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Task;
//# sourceMappingURL=Task.d.ts.map