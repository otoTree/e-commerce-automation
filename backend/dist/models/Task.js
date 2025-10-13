"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.UpdateTaskSchema = exports.CreateTaskSchema = exports.TaskSchema = exports.TaskStatusEnum = exports.TaskTypeEnum = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const zod_1 = require("zod");
exports.TaskTypeEnum = zod_1.z.enum(['url', 'keyword', 'batch_url', 'search_1688']);
exports.TaskStatusEnum = zod_1.z.enum(['pending', 'processing', 'completed', 'failed']);
exports.TaskSchema = zod_1.z.object({
    type: exports.TaskTypeEnum,
    title: zod_1.z.string().min(1, 'Task title is required'),
    description: zod_1.z.string().optional(),
    url: zod_1.z.string().url().optional(),
    urls: zod_1.z.array(zod_1.z.string().url()).optional(),
    keywords: zod_1.z.array(zod_1.z.string()).optional(),
    status: exports.TaskStatusEnum.default('pending'),
    priority: zod_1.z.enum(['low', 'medium', 'high']).default('medium'),
    result: zod_1.z.any().optional(),
    errorMessage: zod_1.z.string().optional(),
    progress: zod_1.z.number().min(0).max(100).default(0),
    totalItems: zod_1.z.number().int().min(0).optional(),
    processedItems: zod_1.z.number().int().min(0).default(0),
    scheduledAt: zod_1.z.date().optional(),
    startedAt: zod_1.z.date().optional(),
    completedAt: zod_1.z.date().optional(),
    retryCount: zod_1.z.number().int().min(0).default(0),
    maxRetries: zod_1.z.number().int().min(0).default(3),
    metadata: zod_1.z.record(zod_1.z.string(), zod_1.z.any()).optional(),
    tags: zod_1.z.array(zod_1.z.string()).default([]),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
exports.CreateTaskSchema = exports.TaskSchema.omit({
    createdAt: true,
    updatedAt: true,
    startedAt: true,
    completedAt: true,
    processedItems: true,
    progress: true,
    retryCount: true
}).refine((data) => {
    if (data.type === 'url' && !data.url) {
        return false;
    }
    if (data.type === 'batch_url' && (!data.urls || data.urls.length === 0)) {
        return false;
    }
    if (data.type === 'keyword' && (!data.keywords || data.keywords.length === 0)) {
        return false;
    }
    return true;
}, {
    message: 'Invalid task data: missing required fields for task type'
});
exports.UpdateTaskSchema = exports.TaskSchema.partial().omit({
    createdAt: true,
    updatedAt: true
});
const mongooseTaskSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['url', 'keyword', 'batch_url', 'search_1688'],
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        validate: {
            validator: (v) => {
                if (!v)
                    return true;
                try {
                    new URL(v);
                    return true;
                }
                catch {
                    return false;
                }
            },
            message: 'Invalid URL format'
        }
    },
    urls: [{
            type: String,
            validate: {
                validator: (v) => {
                    try {
                        new URL(v);
                        return true;
                    }
                    catch {
                        return false;
                    }
                },
                message: 'Invalid URL format'
            }
        }],
    keywords: [{
            type: String,
            trim: true,
        }],
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    result: mongoose_1.Schema.Types.Mixed,
    errorMessage: {
        type: String,
    },
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
    },
    totalItems: {
        type: Number,
        min: 0,
    },
    processedItems: {
        type: Number,
        min: 0,
        default: 0,
    },
    scheduledAt: {
        type: Date,
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
    retryCount: {
        type: Number,
        min: 0,
        default: 0,
    },
    maxRetries: {
        type: Number,
        min: 0,
        default: 3,
    },
    metadata: {
        type: Map,
        of: mongoose_1.Schema.Types.Mixed,
    },
    tags: [{
            type: String,
            trim: true,
        }],
}, {
    timestamps: true,
});
mongooseTaskSchema.index({ status: 1 });
mongooseTaskSchema.index({ type: 1 });
mongooseTaskSchema.index({ priority: 1 });
mongooseTaskSchema.index({ createdAt: -1 });
mongooseTaskSchema.index({ scheduledAt: 1 });
mongooseTaskSchema.index({ tags: 1 });
mongooseTaskSchema.index({ status: 1, priority: -1, createdAt: -1 });
exports.Task = mongoose_1.default.model('Task', mongooseTaskSchema);
//# sourceMappingURL=Task.js.map