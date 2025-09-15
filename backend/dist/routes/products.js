import { Router } from 'express';
import { ProductService, process1688Products } from '../services/productService.js';
import {} from '../models/Product.js';
// import { authenticateToken } from './auth.js'; // Temporarily disabled
const router = Router();
// 所有商品路由都需要认证 - 临时禁用以匹配API文档
// router.use(authenticateToken);
// 获取商品列表
router.get('/', async (req, res) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page) : 1,
            limit: Math.min(parseInt(req.query.limit) || 20, 100),
            ...(req.query.status && { status: req.query.status }),
            ...(req.query.search && { search: req.query.search }),
            ...(req.query.minPrice && { minPrice: parseFloat(req.query.minPrice) }),
            ...(req.query.maxPrice && { maxPrice: parseFloat(req.query.maxPrice) }),
            ...(req.query.sortBy && { sortBy: req.query.sortBy }),
            ...(req.query.sortOrder && { sortOrder: req.query.sortOrder })
        };
        const result = await ProductService.getProducts(options);
        res.json({
            success: true,
            data: {
                products: result.products
            },
            meta: {
                pagination: result.pagination,
                timestamp: new Date().toISOString(),
                request_id: `req_${Date.now()}`
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取商品列表失败'
            }
        });
    }
});
// 获取商品统计信息 - 必须在 /:id 之前
router.get('/stats', async (req, res) => {
    try {
        const stats = await ProductService.getProductStats();
        res.json({
            success: true,
            data: stats
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '获取统计信息失败'
        });
    }
});
// 接收1688商品数据
router.post('/import/1688', async (req, res) => {
    try {
        const products = req.body.products || req.body;
        if (!Array.isArray(products)) {
            return res.status(400).json({
                success: false,
                message: '请提供商品数组数据'
            });
        }
        const result = await process1688Products(products);
        res.json({
            success: true,
            data: result,
            message: `成功处理 ${result.success} 个商品，失败 ${result.failed} 个`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '导入商品失败'
        });
    }
});
// 清空所有商品（用于测试）
router.delete('/clear', async (req, res) => {
    try {
        const result = await ProductService.clearAllProducts();
        res.json({
            success: true,
            data: result,
            message: `已清空 ${result.deletedCount} 个商品`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : '清空商品失败'
        });
    }
});
// 创建商品
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        // TODO: 实现商品创建逻辑
        // - 验证商品数据
        // - 创建商品记录
        // - 触发AI分析
        res.status(201).json({
            success: true,
            data: {
                id: 'new_product_id',
                ...productData,
                status: 'pending',
                created_at: new Date().toISOString()
            },
            message: '商品创建成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '创建商品失败'
            }
        });
    }
});
// 批量操作商品
router.post('/batch', async (req, res) => {
    try {
        const { action, product_ids, params } = req.body;
        if (!action || !product_ids || !Array.isArray(product_ids)) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '操作类型和商品ID列表是必需的'
                }
            });
        }
        // TODO: 实现批量操作逻辑
        // - 验证操作类型
        // - 执行批量操作
        // - 返回操作结果
        res.json({
            success: true,
            data: {
                processed: product_ids.length,
                successful: product_ids.length,
                failed: 0,
                results: product_ids.map(id => ({ id, status: 'success' }))
            },
            message: `批量${action}操作完成`
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '批量操作失败'
            }
        });
    }
});
// 根据ID获取单个商品
router.get('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        if (!productId) {
            return res.status(400).json({
                success: false,
                error: {
                    code: 'VALIDATION_ERROR',
                    message: '商品ID是必需的'
                }
            });
        }
        const product = await ProductService.getProductById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: {
                    code: 'PRODUCT_NOT_FOUND',
                    message: '商品不存在'
                }
            });
        }
        res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '获取商品失败'
            }
        });
    }
});
// 更新商品
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        // TODO: 实现商品更新逻辑
        // - 验证商品ID
        // - 验证更新数据
        // - 更新商品记录
        // - 可选：重新触发AI分析
        res.json({
            success: true,
            data: {
                id,
                ...updateData,
                updated_at: new Date().toISOString()
            },
            message: '商品更新成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '更新商品失败'
            }
        });
    }
});
// 删除商品
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // TODO: 实现商品删除逻辑
        // - 验证商品ID
        // - 检查商品是否被使用
        // - 删除商品记录
        // - 清理相关数据
        res.json({
            success: true,
            message: '商品删除成功'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : '删除商品失败'
            }
        });
    }
});
// 请求AI分析
router.post('/:id/analyze', async (req, res) => {
    try {
        const { id } = req.params;
        const { force_reanalyze } = req.body;
        // TODO: 实现AI分析逻辑
        // - 验证商品ID
        // - 检查是否需要重新分析
        // - 调用AI分析服务
        // - 更新分析结果
        res.json({
            success: true,
            data: {
                analysis_id: 'analysis_' + Date.now(),
                status: 'analyzing',
                estimated_completion: new Date(Date.now() + 5 * 60 * 1000).toISOString()
            },
            message: 'AI分析已开始'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error instanceof Error ? error.message : 'AI分析请求失败'
            }
        });
    }
});
export default router;
//# sourceMappingURL=products.js.map