import { Document } from 'mongoose';
export interface ISearchProductItem {
    title: string;
    price: string;
    currency: string;
    product_url: string;
    image_url?: string;
    supplier_name?: string;
    supplier_url?: string;
    sales_info?: string;
    rating?: number;
    review_count?: number;
    location?: string;
}
export interface ISearchPageData extends Document {
    search_url: string;
    search_keyword: string;
    platform: 'alibaba' | 'ozon' | 'other';
    html_storage_id: string;
    products: ISearchProductItem[];
    pagination_info: {
        current_page: number;
        total_pages?: number;
        total_results?: number;
        has_next_page: boolean;
        next_page_url?: string;
    };
    metadata: {
        parsed_at: Date;
        products_count: number;
        parse_duration_ms: number;
        parser_version: string;
    };
    is_processed: boolean;
    processing_status: 'pending' | 'in_progress' | 'completed' | 'failed';
    processing_errors: string[];
    created_at: Date;
    updated_at: Date;
}
export declare const SearchPageData: import("mongoose").Model<ISearchPageData, {}, {}, {}, Document<unknown, {}, ISearchPageData, {}, {}> & ISearchPageData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SearchPageData.d.ts.map