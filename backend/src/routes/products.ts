import express from 'express'
import { z } from 'zod'
import { ExtractedProduct } from '../models/ExtractedProduct'

const router = express.Router()

// 查询参数验证模式
const GetProductsQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional(),
  seller: z.string().optional(),
  sortBy: z.enum(['uploadedAt', 'title', 'price']).optional().default('uploadedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

// 获取产品列表
router.get('/', async (req, res) => {
  try {
    // 验证查询参数
    const { page, limit, search, seller, sortBy, sortOrder } = GetProductsQuerySchema.parse(req.query)
    
    // 构建查询条件 - 包含1688和Ozon产品
    const query: any = {
      $or: [
        { productData: { $ne: null } }, // 1688产品
        { ozonProductData: { $ne: null } } // Ozon产品
      ]
    }
    
    // 搜索条件
    if (search) {
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          // 1688产品搜索
          { 'productData.title': { $regex: search, $options: 'i' } },
          { 'productData.productId': { $regex: search, $options: 'i' } },
          // Ozon产品搜索
          { 'ozonProductData.title': { $regex: search, $options: 'i' } },
          { 'ozonProductData.productId': { $regex: search, $options: 'i' } }
        ]
      })
    }
    
    // 卖家筛选
    if (seller) {
      query.$and = query.$and || []
      query.$and.push({
        $or: [
          { 'productData.seller': { $regex: seller, $options: 'i' } },
          { 'ozonProductData.seller': { $regex: seller, $options: 'i' } }
        ]
      })
    }
    
    // 计算分页
    const skip = (page - 1) * limit
    
    // 构建排序条件
    const sort: any = {}
    if (sortBy === 'title') {
      sort['productData.title'] = sortOrder === 'asc' ? 1 : -1
    } else if (sortBy === 'price') {
      sort['productData.price'] = sortOrder === 'asc' ? 1 : -1
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1
    }
    
    // 执行查询
    const [products, total] = await Promise.all([
      ExtractedProduct.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      ExtractedProduct.countDocuments(query)
    ])
    
    // 计算分页信息
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
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
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        details: error.issues
      })
    }
    
    console.error('Error fetching products:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取单个产品详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证ID格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      })
    }
    
    const product = await ExtractedProduct.findById(id).select('-__v').lean()
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      })
    }
    
    return res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 根据产品ID获取产品
router.get('/by-product-id/:productId', async (req, res) => {
  try {
    const { productId } = req.params
    
    const product = await ExtractedProduct.findOne({
      'productData.productId': productId
    }).select('-__v').lean()
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      })
    }
    
    return res.json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error fetching product by productId:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取产品统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const [totalProducts, successfulExtractions, failedExtractions, sellers] = await Promise.all([
      ExtractedProduct.countDocuments(),
      ExtractedProduct.countDocuments({ productData: { $ne: null } }),
      ExtractedProduct.countDocuments({ extractionError: { $ne: null } }),
      ExtractedProduct.distinct('productData.seller', { productData: { $ne: null } })
    ])
    
    return res.json({
      success: true,
      data: {
        totalProducts,
        successfulExtractions,
        failedExtractions,
        totalSellers: sellers.length,
        extractionSuccessRate: totalProducts > 0 ? (successfulExtractions / totalProducts * 100).toFixed(2) : 0
      }
    })
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 删除产品
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证ID格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      })
    }
    
    const product = await ExtractedProduct.findByIdAndDelete(id)
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      })
    }
    
    return res.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router