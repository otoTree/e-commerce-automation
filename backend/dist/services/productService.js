import { Product } from '../models/Product.js';
import { Types } from 'mongoose';
export class ProductService {
    /**
     * 创建新商品
     */
    static async createProduct(productData) {
        try {
            const product = new Product(productData);
            return await product.save();
        }
        catch (error) {
            throw new Error(`创建商品失败: ${error}`);
        }
    }
    /**
     * 根据ID获取商品
     */
    static async getProductById(id) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('无效的商品ID');
            }
            return await Product.findById(id);
        }
        catch (error) {
            throw new Error(`获取商品失败: ${error}`);
        }
    }
    /**
     * 根据SKU获取商品
     */
    static async getProductBySku(sku) {
        try {
            return await Product.findOne({ sku });
        }
        catch (error) {
            throw new Error(`根据SKU获取商品失败: ${error}`);
        }
    }
    /**
     * 获取商品列表（支持分页和筛选）
     */
    static async getProducts(options = {}) {
        try {
            const { page = 1, limit = 20, category, brand, minPrice, maxPrice, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = options;
            // 构建查询条件
            const query = {};
            if (category)
                query.category = category;
            if (brand)
                query.brand = brand;
            if (status)
                query.status = status;
            // 价格范围查询
            if (minPrice !== undefined || maxPrice !== undefined) {
                query.price = {};
                if (minPrice !== undefined)
                    query.price.$gte = minPrice;
                if (maxPrice !== undefined)
                    query.price.$lte = maxPrice;
            }
            // 全文搜索
            if (search) {
                query.$text = { $search: search };
            }
            // 排序
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            // 分页计算
            const skip = (page - 1) * limit;
            // 执行查询
            const [products, total] = await Promise.all([
                Product.find(query)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .exec(),
                Product.countDocuments(query)
            ]);
            return {
                products,
                pagination: {
                    current: page,
                    total: Math.ceil(total / limit),
                    count: products.length,
                    totalCount: total
                }
            };
        }
        catch (error) {
            throw new Error(`获取商品列表失败: ${error}`);
        }
    }
    /**
     * 更新商品
     */
    static async updateProduct(id, updateData) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('无效的商品ID');
            }
            const product = await Product.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
            return product;
        }
        catch (error) {
            throw new Error(`更新商品失败: ${error}`);
        }
    }
    /**
     * 删除商品
     */
    static async deleteProduct(id) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('无效的商品ID');
            }
            const result = await Product.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            throw new Error(`删除商品失败: ${error}`);
        }
    }
    /**
     * 更新商品库存
     */
    static async updateStock(id, quantity) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('无效的商品ID');
            }
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('商品不存在');
            }
            await product.updateStock(quantity);
            return product;
        }
        catch (error) {
            throw new Error(`更新库存失败: ${error}`);
        }
    }
    /**
     * 添加商品评分
     */
    static async addRating(id, rating) {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('无效的商品ID');
            }
            if (rating < 0 || rating > 5) {
                throw new Error('评分必须在0-5之间');
            }
            const product = await Product.findById(id);
            if (!product) {
                throw new Error('商品不存在');
            }
            await product.addRating(rating);
            return product;
        }
        catch (error) {
            throw new Error(`添加评分失败: ${error}`);
        }
    }
    /**
     * 根据分类获取商品
     */
    static async getProductsByCategory(category) {
        try {
            return await Product.find({ category, status: 'active' });
        }
        catch (error) {
            throw new Error(`根据分类获取商品失败: ${error}`);
        }
    }
    /**
     * 根据品牌获取商品
     */
    static async getProductsByBrand(brand) {
        try {
            return await Product.find({ brand, status: 'active' });
        }
        catch (error) {
            throw new Error(`根据品牌获取商品失败: ${error}`);
        }
    }
    /**
     * 根据价格范围获取商品
     */
    static async getProductsByPriceRange(minPrice, maxPrice) {
        try {
            return await Product.find({
                price: { $gte: minPrice, $lte: maxPrice },
                status: 'active'
            });
        }
        catch (error) {
            throw new Error(`根据价格范围获取商品失败: ${error}`);
        }
    }
    /**
     * 获取热门商品（根据评分排序）
     */
    static async getPopularProducts(limit = 10) {
        try {
            return await Product.find({ status: 'active' })
                .sort({ 'rating.average': -1, 'rating.count': -1 })
                .limit(limit)
                .exec();
        }
        catch (error) {
            throw new Error(`获取热门商品失败: ${error}`);
        }
    }
    /**
     * 获取最新商品
     */
    static async getLatestProducts(limit = 10) {
        try {
            return await Product.find({ status: 'active' })
                .sort({ createdAt: -1 })
                .limit(limit)
                .exec();
        }
        catch (error) {
            throw new Error(`获取最新商品失败: ${error}`);
        }
    }
    /**
     * 批量导入商品
     */
    static async bulkCreateProducts(productsData) {
        try {
            const products = await Product.insertMany(productsData);
            return products;
        }
        catch (error) {
            throw new Error(`批量导入商品失败: ${error}`);
        }
    }
    /**
     * 获取商品统计信息
     */
    static async getProductStats() {
        try {
            const [totalProducts, activeProducts, categories, brands] = await Promise.all([
                Product.countDocuments(),
                Product.countDocuments({ status: 'active' }),
                Product.distinct('category'),
                Product.distinct('brand')
            ]);
            return {
                totalProducts,
                activeProducts,
                inactiveProducts: totalProducts - activeProducts,
                categoriesCount: categories.length,
                brandsCount: brands.length,
                categories,
                brands
            };
        }
        catch (error) {
            throw new Error(`获取商品统计失败: ${error}`);
        }
    }
    /**
     * 清空所有商品
     */
    static async clearAllProducts() {
        try {
            const result = await Product.deleteMany({});
            return { deletedCount: result.deletedCount || 0 };
        }
        catch (error) {
            throw new Error(`清空商品失败: ${error}`);
        }
    }
}
// 1688商品数据转换函数
export const convert1688ToProduct = (data) => {
    // 生成SKU（使用链接的最后部分）
    const urlParts = data.link.split('/');
    const offerIdMatch = data.link.match(/offer\/(\d+)\.html/);
    const sku = offerIdMatch ? `1688-${offerIdMatch[1]}` : `1688-${Date.now()}-${data.index}`;
    return {
        name: data.title,
        description: data.title, // 使用标题作为描述
        price: parseFloat(data.price) || 0,
        images: data.image ? [data.image] : [],
        sku,
        stock: 0, // 默认库存为0
        category: '未分类', // 默认分类
        source: {
            platform: '1688',
            url: data.link,
            extractedAt: new Date()
        },
        specifications: {
            supplier: data.supplier || ''
        },
        tags: ['1688', '导入商品'],
        sales: data.sales || undefined // 添加销量字段，处理null值
    };
};
// 批量处理1688商品数据
export const process1688Products = async (products) => {
    const results = {
        success: 0,
        failed: 0,
        errors: []
    };
    for (const productData of products) {
        try {
            const convertedData = convert1688ToProduct(productData);
            // 检查是否已存在相同SKU的商品
            const existingProduct = await Product.findOne({ sku: convertedData.sku });
            if (existingProduct) {
                // 更新现有商品
                await ProductService.updateProduct(existingProduct._id.toString(), {
                    name: convertedData.name,
                    price: convertedData.price,
                    images: convertedData.images,
                    specifications: convertedData.specifications || {}
                });
                // 单独更新销量字段（因为UpdateProductData接口可能不包含sales）
                if (convertedData.sales) {
                    await Product.findByIdAndUpdate(existingProduct._id, { sales: convertedData.sales });
                }
            }
            else {
                // 创建新商品
                await ProductService.createProduct(convertedData);
            }
            results.success++;
        }
        catch (error) {
            results.failed++;
            results.errors.push(`商品 ${productData.title}: ${error instanceof Error ? error.message : '未知错误'}`);
        }
    }
    return results;
};
export default ProductService;
//# sourceMappingURL=productService.js.map