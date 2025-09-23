import { Router, type Request, type Response } from 'express';
import { ProductFullData, DeepAnalysisResult, ProductListing } from '../models/index.js';
import { generateTaskId } from '../utils/taskUtils.js';

const router = Router();

// 商品上架相关API接口类型定义
interface ListingQuery {
  status?: string;
  platform?: string;
  created_by?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

interface AnalyzedProductsQuery {
  platform?: string;
  category?: string;
  min_score?: number;
  has_analysis?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

interface CreateListingRequest {
  source_product_id: string;
  listing_info: {
    title: string;
    description: string;
    category_id: string;
    brand: string;
    images: string[];
    attributes?: Record<string, any>;
    keywords?: string[];
  };
  pricing: {
    strategy: 'cost_plus' | 'market_based' | 'competitive' | 'custom';
    markup_percentage: number;
    min_price?: number;
    max_price?: number;
  };
  inventory: {
    stock_quantity: number;
    low_stock_threshold?: number;
    auto_restock?: boolean;
  };
  logistics: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    processing_time?: number;
    delivery_time_min?: number;
    delivery_time_max?: number;
  };
}

interface ListingResponse {
  success: boolean;
  data?: any;
  error?: string;
}

/**
 * 获取已分析的商品列表（可用于上架）
 * GET /api/listings/analyzed-products
 */
const getAnalyzedProducts = async (req: Request<{}, ListingResponse, {}, AnalyzedProductsQuery>, res: Response<ListingResponse>) => {
  try {
    const {
      platform = 'other',
      category,
      min_score = 0,
      has_analysis = true,
      page = 1,
      limit = 20,
      sort = '-analysis_meta.analyzed_at'
    } = req.query;

    // 获取商品列表
    const skip = (Number(page) - 1) * Number(limit);
    
    let products;
    let total;

    if (has_analysis) {
      // 构建分析结果查询条件
      const analysisFilter: any = {};
      if (min_score) {
        analysisFilter['overall_assessment.total_score'] = { $gte: Number(min_score) };
      }

      // 获取分析结果并关联商品数据
      const analysisResults = await DeepAnalysisResult.find(analysisFilter)
        .populate({
          path: 'product_id',
          model: 'ProductFullData',
          match: { platform: platform },
          select: '-basic_info.specifications -pricing.price_history'
        })
        .sort({ 'analysis_meta.analyzed_at': -1 })
        .skip(skip)
        .limit(Number(limit));

      // 过滤掉没有关联到商品的分析结果
      const validResults = analysisResults.filter(result => result.product_id);

      // 如果有分类过滤条件，进一步过滤
      let filteredResults = validResults;
      if (category) {
        filteredResults = validResults.filter(result => {
          const product = result.product_id as any;
          return product.basic_info?.category?.toLowerCase().includes(category.toLowerCase());
        });
      }

      // 转换为前端期望的格式
      products = filteredResults.map(result => {
        const product = result.product_id as any;
        return {
          _id: product._id,
          platform: product.platform,
          platform_product_id: product.platform_product_id,
          basic_info: product.basic_info,
          pricing: product.pricing,
          sales_data: product.sales_data,
          supplier: product.supplier,
          collection_meta: product.collection_meta,
          analysis: {
            total_score: result.overall_assessment?.total_score || 0,
            recommendation: result.overall_assessment?.recommendation || 'hold',
            confidence_level: result.overall_assessment?.confidence_level || 0,
            analyzed_at: result.analysis_meta?.analyzed_at || new Date()
          }
        };
      });

      // 获取总数（简化版本，不完全准确但足够使用）
      const totalAnalysisResults = await DeepAnalysisResult.countDocuments(analysisFilter);
      total = totalAnalysisResults;
    } else {
      // 获取所有商品（无分析结果要求）
      const productFilter: any = { platform };
      if (category) {
        productFilter['basic_info.category'] = { $regex: category, $options: 'i' };
      }

      [products, total] = await Promise.all([
        ProductFullData.find(productFilter)
          .sort(sort)
          .skip(skip)
          .limit(Number(limit))
          .select('-basic_info.specifications -pricing.price_history'),
        ProductFullData.countDocuments(productFilter)
      ]);
    }

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
  } catch (error) {
    console.error('获取已分析商品列表失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 创建商品上架
 * POST /api/listings
 */
const createListing = async (req: Request<{}, ListingResponse, CreateListingRequest>, res: Response<ListingResponse>) => {
  try {
    const listingData = req.body;
    
    // 验证源商品是否存在
    const sourceProduct = await ProductFullData.findById(listingData.source_product_id);
    if (!sourceProduct) {
      return res.status(404).json({
        success: false,
        error: '源商品不存在'
      });
    }

    // 检查是否已经存在上架记录
    const existingListing = await ProductListing.findOne({
      source_product_id: listingData.source_product_id,
      status: { $nin: ['archived'] }
    });

    if (existingListing) {
      return res.status(409).json({
        success: false,
        error: '该商品已存在上架记录'
      });
    }

    // 创建上架记录
    const listing = new ProductListing({
      source_product_id: listingData.source_product_id,
      platform: 'ozon',
      listing_info: listingData.listing_info,
      pricing: {
        ...listingData.pricing,
        cost_price: sourceProduct.pricing.current_price,
        currency: 'RUB'
      },
      inventory: {
        stock_quantity: listingData.inventory.stock_quantity,
        reserved_quantity: 0,
        available_quantity: listingData.inventory.stock_quantity,
        low_stock_threshold: listingData.inventory.low_stock_threshold || 10,
        auto_restock: listingData.inventory.auto_restock || false
      },
      logistics: {
        weight: listingData.logistics.weight,
        dimensions: listingData.logistics.dimensions,
        processing_time: listingData.logistics.processing_time || 3,
        delivery_time_min: listingData.logistics.delivery_time_min || 7,
        delivery_time_max: listingData.logistics.delivery_time_max || 14
      },
      status: 'draft',
      performance: {
        views: 0,
        clicks: 0,
        orders: 0,
        revenue: 0,
        conversion_rate: 0,
        last_updated: new Date()
      },
      sync_info: {
        sync_status: 'pending',
        auto_sync_enabled: true
      },
      meta: {
        created_by: req.headers['user-id'] as string || 'system',
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    await listing.save();

    res.status(201).json({
      success: true,
      data: { listing }
    });
  } catch (error) {
    console.error('创建商品上架失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 获取上架列表
 * GET /api/listings
 */
const getListings = async (req: Request<{}, ListingResponse, {}, ListingQuery>, res: Response<ListingResponse>) => {
  try {
    const {
      status,
      platform = 'ozon',
      created_by,
      page = 1,
      limit = 20,
      sort = '-meta.created_at'
    } = req.query;

    // 构建查询条件
    const filter: any = { platform };
    
    if (status) {
      filter.status = status;
    }
    
    if (created_by) {
      filter['meta.created_by'] = created_by;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [listings, total] = await Promise.all([
      ProductListing.find(filter)
        .populate('source_product_id', 'basic_info pricing sales_data supplier')
        .sort(sort)
        .skip(skip)
        .limit(Number(limit)),
      ProductListing.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          current_page: Number(page),
          total_pages: Math.ceil(total / Number(limit)),
          total_items: total,
          items_per_page: Number(limit)
        }
      }
    });
  } catch (error) {
    console.error('获取上架列表失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 获取单个上架详情
 * GET /api/listings/:listingId
 */
const getListingById = async (req: Request<{ listingId: string }>, res: Response<ListingResponse>) => {
  try {
    const { listingId } = req.params;

    const listing = await ProductListing.findById(listingId)
      .populate('source_product_id');

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: '上架记录不存在'
      });
    }

    // 获取分析结果
    const analysisResult = await DeepAnalysisResult.findOne({ 
      product_id: listing.source_product_id 
    }).sort({ 'analysis_meta.analyzed_at': -1 });

    res.json({
      success: true,
      data: {
        listing,
        analysis: analysisResult
      }
    });
  } catch (error) {
    console.error('获取上架详情失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 更新上架信息
 * PUT /api/listings/:listingId
 */
const updateListing = async (req: Request<{ listingId: string }>, res: Response<ListingResponse>) => {
  try {
    const { listingId } = req.params;
    const updateData = req.body;

    const listing = await ProductListing.findByIdAndUpdate(
      listingId,
      { 
        $set: {
          ...updateData,
          'meta.updated_at': new Date()
        }
      },
      { new: true, runValidators: true }
    );

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: '上架记录不存在'
      });
    }

    res.json({
      success: true,
      data: { listing }
    });
  } catch (error) {
    console.error('更新上架信息失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 提交上架审核
 * POST /api/listings/:listingId/submit
 */
const submitListing = async (req: Request<{ listingId: string }>, res: Response<ListingResponse>) => {
  try {
    const { listingId } = req.params;

    const listing = await ProductListing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: '上架记录不存在'
      });
    }

    if (listing.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: '只有草稿状态的商品可以提交审核'
      });
    }

    // 更新状态为待审核
    listing.status = 'pending_review';
    listing.review_info = {
      submitted_at: new Date()
    };
    listing.sync_info.sync_status = 'pending';

    await listing.save();

    // TODO: 这里应该触发实际的平台同步任务
    // await scheduleOzonSync(listingId);

    res.json({
      success: true,
      data: { listing }
    });
  } catch (error) {
    console.error('提交上架审核失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

/**
 * 批量操作上架
 * POST /api/listings/batch
 */
const batchOperations = async (req: Request, res: Response<ListingResponse>) => {
  try {
    const { operation, listing_ids, data } = req.body;

    if (!operation || !listing_ids || !Array.isArray(listing_ids)) {
      return res.status(400).json({
        success: false,
        error: '缺少必要参数'
      });
    }

    let updateData: any = {};
    
    switch (operation) {
      case 'update_status':
        if (!data.status) {
          return res.status(400).json({
            success: false,
            error: '缺少状态参数'
          });
        }
        updateData = { status: data.status };
        break;
      
      case 'update_pricing':
        if (!data.pricing) {
          return res.status(400).json({
            success: false,
            error: '缺少定价参数'
          });
        }
        updateData = { pricing: data.pricing };
        break;
      
      default:
        return res.status(400).json({
          success: false,
          error: '不支持的操作类型'
        });
    }

    const result = await ProductListing.updateMany(
      { _id: { $in: listing_ids } },
      { 
        $set: {
          ...updateData,
          'meta.updated_at': new Date()
        }
      }
    );

    res.json({
      success: true,
      data: {
        modified_count: result.modifiedCount,
        matched_count: result.matchedCount
      }
    });
  } catch (error) {
    console.error('批量操作失败:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : '内部服务器错误'
    });
  }
};

// 注册路由
router.get('/analyzed-products', getAnalyzedProducts);
router.post('/', createListing);
router.get('/', getListings);
router.get('/:listingId', getListingById);
router.put('/:listingId', updateListing);
router.post('/:listingId/submit', submitListing);
router.post('/batch', batchOperations);

export default router;