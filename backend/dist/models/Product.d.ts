import mongoose, { Document } from 'mongoose';
export interface I1688ProductData {
    index: number;
    link: string;
    image: string;
    title: string;
    price: string;
    supplier: string | null;
    sales: string | null;
}
export interface IProduct extends Document {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    category?: string;
    brand?: string;
    images: string[];
    specifications: {
        [key: string]: string;
    };
    stock: number;
    sku: string;
    status: 'active' | 'inactive' | 'out_of_stock';
    tags: string[];
    rating: {
        average: number;
        count: number;
    };
    source: {
        platform: string;
        url: string;
        extractedAt: Date;
        originalIndex?: number;
    };
    supplier?: string;
    sales?: string;
    createdAt: Date;
    updatedAt: Date;
    updateStock(quantity: number): Promise<IProduct>;
    addRating(rating: number): Promise<IProduct>;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Product;
//# sourceMappingURL=Product.d.ts.map