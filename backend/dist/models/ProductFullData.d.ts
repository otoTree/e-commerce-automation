import mongoose, { Document } from 'mongoose';
interface IPricePoint {
    price: number;
    date: Date;
}
export interface IProductFullData extends Document {
    platform: 'alibaba' | 'ozon' | 'other';
    platform_product_id: string;
    basic_info: {
        title: string;
        description: string;
        category: string;
        brand?: string;
        images: string[];
        specifications: Record<string, any>;
    };
    pricing: {
        current_price: number;
        original_price?: number;
        currency: string;
        price_history: IPricePoint[];
    };
    sales_data: {
        sales_volume: number;
        review_count: number;
        rating: number;
        stock_quantity?: number;
    };
    supplier: {
        name: string;
        location: string;
        rating: number;
        years_in_business?: number;
    };
    collection_meta: {
        collected_at: Date;
        collection_duration: number;
        data_completeness: number;
    };
}
export declare const ProductFullData: mongoose.Model<IProductFullData, {}, {}, {}, mongoose.Document<unknown, {}, IProductFullData, {}, {}> & IProductFullData & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export {};
//# sourceMappingURL=ProductFullData.d.ts.map