import { Schema, model, Document } from 'mongoose';
// HTML存储数据模式
const htmlStorageSchema = new Schema({
    url: {
        type: String,
        required: true,
        index: true
    },
    html_content: {
        type: String,
        required: true
    },
    page_type: {
        type: String,
        enum: ['product', 'search', 'unknown'],
        default: 'unknown',
        index: true
    },
    platform: {
        type: String,
        enum: ['alibaba', 'ozon', 'other'],
        required: true,
        index: true
    },
    is_parsed: {
        type: Boolean,
        default: false,
        index: true
    },
    parse_attempts: {
        type: Number,
        default: 0
    },
    parse_errors: [{
            type: String
        }],
    metadata: {
        collected_at: {
            type: Date,
            required: true
        },
        content_length: {
            type: Number,
            required: true
        },
        user_agent: String,
        source: {
            type: String,
            enum: ['extension', 'crawler', 'manual'],
            required: true
        }
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
// 创建复合索引
htmlStorageSchema.index({ platform: 1, page_type: 1, is_parsed: 1 });
htmlStorageSchema.index({ created_at: -1 });
export const HtmlStorage = model('HtmlStorage', htmlStorageSchema);
//# sourceMappingURL=HtmlStorage.js.map