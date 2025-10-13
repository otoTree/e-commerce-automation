import mongoose, { Document } from 'mongoose';
import { z } from 'zod';
export declare const ProductSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    price: z.ZodNumber;
    category: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    images: z.ZodDefault<z.ZodArray<z.ZodString>>;
    stock: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    specifications: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
}, z.core.$strip>;
export declare const CreateProductSchema: z.ZodObject<{
    description: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    name: z.ZodString;
    price: z.ZodNumber;
    images: z.ZodDefault<z.ZodArray<z.ZodString>>;
    category: z.ZodString;
    brand: z.ZodOptional<z.ZodString>;
    stock: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    specifications: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, z.core.$strip>;
export declare const UpdateProductSchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    name: z.ZodOptional<z.ZodString>;
    price: z.ZodOptional<z.ZodNumber>;
    images: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
    category: z.ZodOptional<z.ZodString>;
    brand: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    stock: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    specifications: z.ZodOptional<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>>;
}, z.core.$strip>;
export type ProductType = z.infer<typeof ProductSchema>;
export type CreateProductType = z.infer<typeof CreateProductSchema>;
export type UpdateProductType = z.infer<typeof UpdateProductSchema>;
export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    brand?: string;
    images: string[];
    stock: number;
    isActive: boolean;
    tags: string[];
    specifications?: Record<string, string>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Product.d.ts.map