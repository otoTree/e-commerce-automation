import { type IProduct, type I1688ProductData } from '../models/Product.js';
export interface ProductQueryOptions {
    page?: number;
    limit?: number;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: 'active' | 'inactive' | 'out_of_stock';
    search?: string;
    sortBy?: 'createdAt' | 'price' | 'name' | 'rating.average';
    sortOrder?: 'asc' | 'desc';
}
export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: string;
    brand?: string;
    images: string[];
    specifications?: {
        [key: string]: string;
    };
    stock: number;
    sku: string;
    tags?: string[];
    source: {
        platform: string;
        url: string;
        extractedAt?: Date;
    };
    sales?: string | undefined;
}
export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    category?: string;
    brand?: string;
    images?: string[];
    specifications?: {
        [key: string]: string;
    };
    stock?: number;
    status?: 'active' | 'inactive' | 'out_of_stock';
    tags?: string[];
}
export declare class ProductService {
    /**
     * 创建新商品
     */
    static createProduct(productData: CreateProductData): Promise<IProduct>;
    /**
     * 根据ID获取商品
     */
    static getProductById(id: string): Promise<IProduct | null>;
    /**
     * 根据SKU获取商品
     */
    static getProductBySku(sku: string): Promise<IProduct | null>;
    /**
     * 获取商品列表（支持分页和筛选）
     */
    static getProducts(options?: ProductQueryOptions): Promise<{
        products: (import("mongoose").Document<unknown, {}, IProduct, {}, {}> & IProduct & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            current: number;
            total: number;
            count: number;
            totalCount: number;
        };
    }>;
    /**
     * 更新商品
     */
    static updateProduct(id: string, updateData: UpdateProductData): Promise<IProduct | null>;
    /**
     * 删除商品
     */
    static deleteProduct(id: string): Promise<boolean>;
    /**
     * 更新商品库存
     */
    static updateStock(id: string, quantity: number): Promise<IProduct | null>;
    /**
     * 添加商品评分
     */
    static addRating(id: string, rating: number): Promise<IProduct | null>;
    /**
     * 根据分类获取商品
     */
    static getProductsByCategory(category: string): Promise<IProduct[]>;
    /**
     * 根据品牌获取商品
     */
    static getProductsByBrand(brand: string): Promise<IProduct[]>;
    /**
     * 根据价格范围获取商品
     */
    static getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<IProduct[]>;
    /**
     * 获取热门商品（根据评分排序）
     */
    static getPopularProducts(limit?: number): Promise<IProduct[]>;
    /**
     * 获取最新商品
     */
    static getLatestProducts(limit?: number): Promise<IProduct[]>;
    /**
     * 批量导入商品
     */
    static bulkCreateProducts(productsData: CreateProductData[]): Promise<IProduct[]>;
    /**
     * 获取商品统计信息
     */
    static getProductStats(): Promise<{
        totalProducts: number;
        activeProducts: number;
        inactiveProducts: number;
        categoriesCount: number;
        brandsCount: number;
        categories: string[];
        brands: string[];
    }>;
    /**
     * 清空所有商品
     */
    static clearAllProducts(): Promise<{
        deletedCount: number;
    }>;
}
export declare const convert1688ToProduct: (data: I1688ProductData) => CreateProductData;
export declare const process1688Products: (products: I1688ProductData[]) => Promise<{
    success: number;
    failed: number;
    errors: string[];
}>;
export default ProductService;
//# sourceMappingURL=productService.d.ts.map