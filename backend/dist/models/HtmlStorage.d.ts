import { Document } from 'mongoose';
export interface IHtmlStorage extends Document {
    url: string;
    html_content: string;
    page_type: 'product' | 'search' | 'unknown';
    platform: 'alibaba' | 'ozon' | 'other';
    is_parsed: boolean;
    parse_attempts: number;
    parse_errors: string[];
    metadata: {
        collected_at: Date;
        content_length: number;
        user_agent?: string;
        source: 'extension' | 'crawler' | 'manual';
    };
    created_at: Date;
    updated_at: Date;
}
export declare const HtmlStorage: import("mongoose").Model<IHtmlStorage, {}, {}, {}, Document<unknown, {}, IHtmlStorage, {}, {}> & IHtmlStorage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=HtmlStorage.d.ts.map