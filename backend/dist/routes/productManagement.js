import { Router } from 'express';
import { ProductFullData, DeepAnalysisResult } from '../models/index.js';
const router = Router();
/**
 * 获取商品列表
 * GET /api/products
 */
const getProducts = async (req, res) => {
    try {
        const { platform, category, min_price, max_price, min_rating, search, page = 1, limit = 20, sort = '-collection_meta.collected_at' } = req.query;
        // 构建查询条件
        const filter = {};
        if (platform) {
            filter.platform = platform;
        }
        if (category) {
            filter['basic_info.category'] = { $regex: category, $options: 'i' };
        }
        if (min_price !== undefined || max_price !== undefined) {
            filter['pricing.current_price'] = {};
            if (min_price !== undefined) {
                filter['pricing.current_price'].$gte = Number(min_price);
            }
            if (max_price !== undefined) {
                filter['pricing.current_price'].$lte = Number(max_price);
            }
        }
        if (min_rating !== undefined) {
            filter['sales_data.rating'] = { $gte: Number(min_rating) };
        }
        if (search) {
            filter.$or = [
                { 'basic_info.title': { $regex: search, $options: 'i' } },
                { 'basic_info.description': { $regex: search, $options: 'i' } },
                { 'basic_info.brand': { $regex: search, $options: 'i' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [products, total] = await Promise.all([
            ProductFullData.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(Number(limit))
                .select('-basic_info.specifications -pricing.price_history'),
            ProductFullData.countDocuments(filter)
        ]);
        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    current_page: Number(page),
                    total_pages: Math.ceil(total / Number(limit)),
                    total_items: total,
                    items_per_page: Number(limit)
                }
            }
        });
    }
    catch (error) {
        console.error('获取商品列表失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 获取单个商品详情
 * GET /api/products/:productId
 */
const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ProductFullData.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: '商品不存在'
            });
        }
        // 获取最新的分析结果
        const analysisResult = await DeepAnalysisResult.findOne({ product_id: productId })
            .sort({ 'analysis_meta.analyzed_at': -1 });
        res.json({
            success: true,
            data: {
                product,
                analysis: analysisResult
            }
        });
    }
    catch (error) {
        console.error('获取商品详情失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 更新商品信息
 * PUT /api/products/:productId
 */
const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        // 验证更新数据
        const allowedFields = [
            'basic_info.title',
            'basic_info.description',
            'basic_info.category',
            'basic_info.brand',
            'pricing.current_price',
            'pricing.original_price',
            'sales_data.stock_quantity'
        ];
        const updateFields = {};
        Object.keys(updateData).forEach(key => {
            if (allowedFields.includes(key)) {
                updateFields[key] = updateData[key];
            }
        });
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({
                success: false,
                error: '没有有效的更新字段'
            });
        }
        const updatedProduct = await ProductFullData.findByIdAndUpdate(productId, { $set: updateFields }, { new: true, runValidators: true });
        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                error: '商品不存在'
            });
        }
        res.json({
            success: true,
            data: { product: updatedProduct }
        });
    }
    catch (error) {
        console.error('更新商品信息失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 创建商品
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const productData = req.body;
        // 验证必需字段 - 支持前端简单格式
        if (!productData.title) {
            return res.status(400).json({
                success: false,
                error: '商品标题是必需的'
            });
        }
        // 生成唯一的平台商品ID（如果没有提供）
        const platform = productData.platform === 'manual' ? 'other' : (productData.platform || 'other');
        const platform_product_id = productData.platform_product_id ||
            productData.sku ||
            `manual_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        // 检查是否已存在相同的商品（基于title）
        const existingProduct = await ProductFullData.findOne({
            $or: [
                { platform: platform, platform_product_id: platform_product_id },
                { 'basic_info.title': productData.title }
            ]
        });
        if (existingProduct) {
            return res.status(409).json({
                success: false,
                error: '该商品已存在（相同的标题或商品ID）'
            });
        }
        // 转换前端简单格式到后端复杂格式
        const newProductData = {
            platform: platform,
            platform_product_id: platform_product_id,
            basic_info: {
                title: productData.title || '',
                description: productData.description || '',
                category: productData.category || '未分类',
                brand: productData.brand || '',
                images: productData.images || [],
                specifications: productData.specifications || {}
            },
            pricing: {
                current_price: Number(productData.price) || 0,
                original_price: Number(productData.original_price) || Number(productData.price) || 0,
                currency: productData.currency || 'CNY',
                price_history: []
            },
            sales_data: {
                sales_volume: 0,
                review_count: 0,
                rating: 0,
                stock_quantity: Number(productData.stock) || 0
            },
            supplier: {
                name: productData.supplier_name || '未知供应商',
                location: productData.supplier_location || '未知地区',
                rating: 0,
                years_in_business: 0
            },
            collection_meta: {
                collected_at: new Date(),
                collection_duration: 0,
                data_completeness: 1.0
            }
        };
        // 创建并保存新商品
        const product = new ProductFullData(newProductData);
        await product.save();
        res.status(201).json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('创建商品失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 删除商品
 * DELETE /api/products/:productId
 */
const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await ProductFullData.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                error: '商品不存在'
            });
        }
        // 同时删除相关的分析结果
        await DeepAnalysisResult.deleteMany({ product_id: productId });
        res.json({
            success: true,
            data: { message: '商品删除成功' }
        });
    }
    catch (error) {
        console.error('删除商品失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 获取商品统计信息
 * GET /api/products/statistics
 */
const getProductStatistics = async (req, res) => {
    try {
        const [totalProducts, platformStats, categoryStats, priceRangeStats, recentProducts] = await Promise.all([
            // 总商品数量
            ProductFullData.countDocuments(),
            // 平台分布统计
            ProductFullData.aggregate([
                {
                    $group: {
                        _id: '$platform',
                        count: { $sum: 1 },
                        avg_price: { $avg: '$pricing.current_price' }
                    }
                }
            ]),
            // 类别分布统计
            ProductFullData.aggregate([
                {
                    $group: {
                        _id: '$basic_info.category',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            // 价格区间统计
            ProductFullData.aggregate([
                {
                    $bucket: {
                        groupBy: '$pricing.current_price',
                        boundaries: [0, 50, 100, 200, 500, 1000, Infinity],
                        default: 'Other',
                        output: {
                            count: { $sum: 1 },
                            avg_rating: { $avg: '$sales_data.rating' }
                        }
                    }
                }
            ]),
            // 最近收集的商品数量（7天内）
            ProductFullData.countDocuments({
                'collection_meta.collected_at': {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                }
            })
        ]);
        res.json({
            success: true,
            data: {
                total_products: totalProducts,
                recent_products: recentProducts,
                platform_distribution: platformStats.reduce((acc, item) => {
                    acc[item._id] = {
                        count: item.count,
                        avg_price: Math.round(item.avg_price * 100) / 100
                    };
                    return acc;
                }, {}),
                category_distribution: categoryStats.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                price_range_distribution: priceRangeStats
            }
        });
    }
    catch (error) {
        console.error('获取商品统计信息失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
/**
 * 批量删除商品
 * DELETE /api/products/batch
 */
const batchDeleteProducts = async (req, res) => {
    try {
        const { product_ids } = req.body;
        if (!product_ids || !Array.isArray(product_ids) || product_ids.length === 0) {
            return res.status(400).json({
                success: false,
                error: '商品ID列表不能为空'
            });
        }
        const [deletedProducts, deletedAnalyses] = await Promise.all([
            ProductFullData.deleteMany({ _id: { $in: product_ids } }),
            DeepAnalysisResult.deleteMany({ product_id: { $in: product_ids } })
        ]);
        res.json({
            success: true,
            data: {
                deleted_products: deletedProducts.deletedCount,
                deleted_analyses: deletedAnalyses.deletedCount
            }
        });
    }
    catch (error) {
        console.error('批量删除商品失败:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : '内部服务器错误'
        });
    }
};
// 注册路由
router.get('/', getProducts);
router.get('/statistics', getProductStatistics);
router.get('/:productId', getProductById);
router.post('/', createProduct);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);
router.delete('/batch', batchDeleteProducts);
export default router;
//# sourceMappingURL=productManagement.js.map