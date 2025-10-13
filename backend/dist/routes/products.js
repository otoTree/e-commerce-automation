"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const ExtractedProduct_1 = require("../models/ExtractedProduct");
const router = express_1.default.Router();
const GetProductsQuerySchema = zod_1.z.object({
    page: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: zod_1.z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    search: zod_1.z.string().optional(),
    seller: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['uploadedAt', 'title', 'price']).optional().default('uploadedAt'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc')
});
router.get('/', async (req, res) => {
    try {
        const { page, limit, search, seller, sortBy, sortOrder } = GetProductsQuerySchema.parse(req.query);
        const query = {
            $or: [
                { productData: { $ne: null } },
                { ozonProductData: { $ne: null } }
            ]
        };
        if (search) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { 'productData.title': { $regex: search, $options: 'i' } },
                    { 'productData.productId': { $regex: search, $options: 'i' } },
                    { 'ozonProductData.title': { $regex: search, $options: 'i' } },
                    { 'ozonProductData.productId': { $regex: search, $options: 'i' } }
                ]
            });
        }
        if (seller) {
            query.$and = query.$and || [];
            query.$and.push({
                $or: [
                    { 'productData.seller': { $regex: seller, $options: 'i' } },
                    { 'ozonProductData.seller': { $regex: seller, $options: 'i' } }
                ]
            });
        }
        const skip = (page - 1) * limit;
        const sort = {};
        if (sortBy === 'title') {
            sort['productData.title'] = sortOrder === 'asc' ? 1 : -1;
        }
        else if (sortBy === 'price') {
            sort['productData.price'] = sortOrder === 'asc' ? 1 : -1;
        }
        else {
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        }
        const [products, total] = await Promise.all([
            ExtractedProduct_1.ExtractedProduct.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .select('-__v')
                .lean(),
            ExtractedProduct_1.ExtractedProduct.countDocuments(query)
        ]);
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        return res.json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({
                success: false,
                error: 'Invalid query parameters',
                details: error.issues
            });
        }
        console.error('Error fetching products:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }
        const product = await ExtractedProduct_1.ExtractedProduct.findById(id).select('-__v').lean();
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        return res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/by-product-id/:productId', async (req, res) => {
    try {
        const { productId } = req.params;
        const product = await ExtractedProduct_1.ExtractedProduct.findOne({
            'productData.productId': productId
        }).select('-__v').lean();
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        return res.json({
            success: true,
            data: product
        });
    }
    catch (error) {
        console.error('Error fetching product by productId:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.get('/stats/overview', async (req, res) => {
    try {
        const [totalProducts, successfulExtractions, failedExtractions, sellers] = await Promise.all([
            ExtractedProduct_1.ExtractedProduct.countDocuments(),
            ExtractedProduct_1.ExtractedProduct.countDocuments({ productData: { $ne: null } }),
            ExtractedProduct_1.ExtractedProduct.countDocuments({ extractionError: { $ne: null } }),
            ExtractedProduct_1.ExtractedProduct.distinct('productData.seller', { productData: { $ne: null } })
        ]);
        return res.json({
            success: true,
            data: {
                totalProducts,
                successfulExtractions,
                failedExtractions,
                totalSellers: sellers.length,
                extractionSuccessRate: totalProducts > 0 ? (successfulExtractions / totalProducts * 100).toFixed(2) : 0
            }
        });
    }
    catch (error) {
        console.error('Error fetching product stats:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }
        const product = await ExtractedProduct_1.ExtractedProduct.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                error: 'Product not found'
            });
        }
        return res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map