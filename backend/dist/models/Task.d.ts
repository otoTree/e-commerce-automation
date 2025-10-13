import mongoose, { Document } from 'mongoose';
import { z } from 'zod';
export declare const TaskTypeEnum: z.ZodEnum<{
    url: "url";
    keyword: "keyword";
    batch_url: "batch_url";
    search_1688: "search_1688";
}>;
export declare const TaskStatusEnum: z.ZodEnum<{
    pending: "pending";
    processing: "processing";
    completed: "completed";
    failed: "failed";
}>;
export declare const TaskSchema: z.ZodObject<{
    type: z.ZodEnum<{
        url: "url";
        keyword: "keyword";
        batch_url: "batch_url";
        search_1688: "search_1688";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    url: z.ZodOptional<z.ZodString>;
    urls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        processing: "processing";
        completed: "completed";
        failed: "failed";
    }>>;
    priority: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    result: z.ZodOptional<z.ZodAny>;
    errorMessage: z.ZodOptional<z.ZodString>;
    progress: z.ZodDefault<z.ZodNumber>;
    totalItems: z.ZodOptional<z.ZodNumber>;
    processedItems: z.ZodDefault<z.ZodNumber>;
    scheduledAt: z.ZodOptional<z.ZodDate>;
    startedAt: z.ZodOptional<z.ZodDate>;
    completedAt: z.ZodOptional<z.ZodDate>;
    retryCount: z.ZodDefault<z.ZodNumber>;
    maxRetries: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export declare const CreateTaskSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<{
        url: "url";
        keyword: "keyword";
        batch_url: "batch_url";
        search_1688: "search_1688";
    }>;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    urls: z.ZodOptional<z.ZodArray<z.ZodString>>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        processing: "processing";
        completed: "completed";
        failed: "failed";
    }>>;
    priority: z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>;
    result: z.ZodOptional<z.ZodAny>;
    errorMessage: z.ZodOptional<z.ZodString>;
    totalItems: z.ZodOptional<z.ZodNumber>;
    scheduledAt: z.ZodOptional<z.ZodDate>;
    maxRetries: z.ZodDefault<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateTaskSchema: z.ZodObject<{
    url: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<{
        url: "url";
        keyword: "keyword";
        batch_url: "batch_url";
        search_1688: "search_1688";
    }>>;
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    urls: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    keywords: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        pending: "pending";
        processing: "processing";
        completed: "completed";
        failed: "failed";
    }>>>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
        low: "low";
        medium: "medium";
        high: "high";
    }>>>;
    result: z.ZodOptional<z.ZodOptional<z.ZodAny>>;
    errorMessage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    progress: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    totalItems: z.ZodOptional<z.ZodOptional<z.ZodNumber>>;
    processedItems: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    scheduledAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    startedAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    completedAt: z.ZodOptional<z.ZodOptional<z.ZodDate>>;
    retryCount: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    maxRetries: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    metadata: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
}, z.core.$strip>;
export type TaskType = z.infer<typeof TaskSchema>;
export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
export interface ITask extends Document {
    type: 'url' | 'keyword' | 'batch_url' | 'search_1688';
    title: string;
    description?: string;
    url?: string;
    urls?: string[];
    keywords?: string[];
    status: 'pending' | 'processing' | 'completed' | 'failed';
    priority: 'low' | 'medium' | 'high';
    result?: any;
    errorMessage?: string;
    progress: number;
    totalItems?: number;
    processedItems: number;
    scheduledAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    retryCount: number;
    maxRetries: number;
    metadata?: Record<string, any>;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Task: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Task.d.ts.map