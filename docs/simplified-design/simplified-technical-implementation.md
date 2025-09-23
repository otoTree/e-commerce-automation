# 简化技术实现方案

## 1. 项目概述

### 1.1 技术目标
- **全量数据收集**：简化数据收集逻辑，专注全量获取，无增量处理
- **智能分析核心**：实现深度分析和市场热度检测两大核心功能
- **函数式编程**：采用函数式编程范式，避免使用class
- **组件化设计**：前端采用组件化架构，数据模型与逻辑分离

### 1.2 技术栈选择
```
后端技术栈：
├── Node.js + TypeScript
├── Express.js (API框架)
├── MongoDB (数据存储)
├── Redis (缓存)
├── Bull (任务队列)
└── Axios (HTTP客户端)

前端技术栈：
├── React + TypeScript
├── Zustand (状态管理)
├── TanStack Query (数据获取)
├── Tailwind CSS (样式)
└── Recharts (图表)
```

## 2. 数据收集层实现

### 2.1 全量数据收集服务

#### 2.1.1 核心数据收集函数
```typescript
// src/services/dataCollection/fullDataCollector.ts

import axios from 'axios';
import { ProductFullData, CollectionConfig } from '../types/product';

// 全量数据收集主函数
export const collectFullProductData = async (
  productUrl: string,
  config: CollectionConfig
): Promise<ProductFullData> => {
  try {
    // 1. 基础信息收集
    const basicInfo = await collectBasicInfo(productUrl);
    
    // 2. 销售数据收集
    const salesData = await collectSalesData(productUrl);
    
    // 3. 价格信息收集
    const pricingData = await collectPricingData(productUrl);
    
    // 4. 供应商信息收集
    const supplierData = await collectSupplierData(productUrl);
    
    // 5. 图片资源收集
    const imageData = await collectImageData(basicInfo.images);
    
    // 6. 组装完整数据
    const fullData: ProductFullData = {
      id: generateProductId(productUrl),
      source_url: productUrl,
      basic_info: basicInfo,
      sales_data: salesData,
      pricing: pricingData,
      supplier: supplierData,
      images: imageData,
      collected_at: new Date(),
      collection_config: config
    };
    
    return fullData;
  } catch (error) {
    throw new Error(`数据收集失败: ${error.message}`);
  }
};

// 基础信息收集
const collectBasicInfo = async (productUrl: string) => {
  const response = await axios.get(productUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  const html = response.data;
  
  return {
    title: extractTitle(html),
    description: extractDescription(html),
    category: extractCategory(html),
    brand: extractBrand(html),
    model: extractModel(html),
    specifications: extractSpecifications(html),
    features: extractFeatures(html),
    images: extractImageUrls(html),
    tags: extractTags(html)
  };
};

// 销售数据收集
const collectSalesData = async (productUrl: string) => {
  const html = await fetchPageContent(productUrl);
  
  return {
    sales_volume: extractSalesVolume(html),
    rating: extractRating(html),
    review_count: extractReviewCount(html),
    availability: extractAvailability(html),
    shipping_info: extractShippingInfo(html),
    return_policy: extractReturnPolicy(html)
  };
};

// 价格信息收集
const collectPricingData = async (productUrl: string) => {
  const html = await fetchPageContent(productUrl);
  
  return {
    current_price: extractCurrentPrice(html),
    original_price: extractOriginalPrice(html),
    discount_percentage: calculateDiscountPercentage(html),
    currency: extractCurrency(html),
    price_history: [], // 全量收集模式下暂不收集历史价格
    bulk_pricing: extractBulkPricing(html)
  };
};
```

#### 2.1.2 数据提取工具函数
```typescript
// src/utils/dataExtraction/extractors.ts

// 标题提取
export const extractTitle = (html: string): string => {
  const titleRegex = /<title[^>]*>([^<]+)<\/title>/i;
  const match = html.match(titleRegex);
  return match ? match[1].trim() : '';
};

// 价格提取
export const extractCurrentPrice = (html: string): number => {
  // 多种价格格式的正则表达式
  const pricePatterns = [
    /[\$¥€£]\s*(\d+(?:\.\d{2})?)/g,
    /(\d+(?:\.\d{2})?)\s*[\$¥€£]/g,
    /"price":\s*"?(\d+(?:\.\d{2})?)"/g,
    /data-price="(\d+(?:\.\d{2})?)"/g
  ];
  
  for (const pattern of pricePatterns) {
    const matches = Array.from(html.matchAll(pattern));
    if (matches.length > 0) {
      const prices = matches.map(match => parseFloat(match[1]));
      return Math.max(...prices); // 返回最高价格作为当前价格
    }
  }
  
  return 0;
};

// 销量提取
export const extractSalesVolume = (html: string): number => {
  const salesPatterns = [
    /sold[:\s]*(\d+)/i,
    /销量[:\s]*(\d+)/i,
    /"salesCount":\s*(\d+)/g,
    /(\d+)\s*sold/i
  ];
  
  for (const pattern of salesPatterns) {
    const match = html.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  return 0;
};

// 评分提取
export const extractRating = (html: string): number => {
  const ratingPatterns = [
    /"rating":\s*(\d+(?:\.\d+)?)/g,
    /rating[:\s]*(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*stars?/i,
    /★+\s*(\d+(?:\.\d+)?)/g
  ];
  
  for (const pattern of ratingPatterns) {
    const match = html.match(pattern);
    if (match) {
      return parseFloat(match[1]);
    }
  }
  
  return 0;
};

// 图片URL提取
export const extractImageUrls = (html: string): string[] => {
  const imagePatterns = [
    /<img[^>]+src="([^"]+)"/g,
    /"images":\s*\[([^\]]+)\]/g,
    /data-src="([^"]+)"/g
  ];
  
  const imageUrls: string[] = [];
  
  for (const pattern of imagePatterns) {
    const matches = Array.from(html.matchAll(pattern));
    matches.forEach(match => {
      if (match[1] && isValidImageUrl(match[1])) {
        imageUrls.push(match[1]);
      }
    });
  }
  
  // 去重并过滤
  return [...new Set(imageUrls)]
    .filter(url => !url.includes('icon') && !url.includes('logo'))
    .slice(0, 10); // 最多保留10张图片
};

// 验证图片URL有效性
const isValidImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext)) ||
         url.includes('image') ||
         url.includes('photo');
};
```

#### 2.1.3 批量收集处理器
```typescript
// src/services/dataCollection/batchCollector.ts

import { collectFullProductData } from './fullDataCollector';
import { saveProductData } from '../database/productRepository';

// 批量收集配置
interface BatchCollectionConfig {
  batchSize: number;
  delayBetweenRequests: number;
  maxRetries: number;
  concurrency: number;
}

// 批量收集处理器
export const batchCollectProducts = async (
  productUrls: string[],
  config: BatchCollectionConfig = {
    batchSize: 10,
    delayBetweenRequests: 1000,
    maxRetries: 3,
    concurrency: 5
  }
) => {
  const results = [];
  const errors = [];
  
  // 分批处理
  for (let i = 0; i < productUrls.length; i += config.batchSize) {
    const batch = productUrls.slice(i, i + config.batchSize);
    
    console.log(`处理批次 ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(productUrls.length / config.batchSize)}`);
    
    // 并发处理当前批次
    const batchPromises = batch.map(async (url, index) => {
      try {
        // 添加延迟避免请求过于频繁
        await sleep(index * (config.delayBetweenRequests / config.concurrency));
        
        const productData = await collectFullProductData(url, {
          mode: 'full',
          includeImages: true,
          includeReviews: false // 简化版不收集评论详情
        });
        
        // 保存到数据库
        await saveProductData(productData);
        
        return { url, success: true, data: productData };
      } catch (error) {
        console.error(`收集失败: ${url}`, error.message);
        return { url, success: false, error: error.message };
      }
    });
    
    const batchResults = await Promise.allSettled(batchPromises);
    
    // 处理批次结果
    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          results.push(result.value);
        } else {
          errors.push(result.value);
        }
      } else {
        errors.push({
          url: batch[index],
          success: false,
          error: result.reason?.message || '未知错误'
        });
      }
    });
    
    // 批次间延迟
    if (i + config.batchSize < productUrls.length) {
      await sleep(config.delayBetweenRequests);
    }
  }
  
  return {
    total: productUrls.length,
    successful: results.length,
    failed: errors.length,
    results,
    errors
  };
};

// 工具函数：延迟
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
```

### 2.2 数据存储层实现

#### 2.2.1 MongoDB数据模型
```typescript
// src/models/productModel.ts

import { Schema, model } from 'mongoose';

// 产品全量数据Schema
const ProductFullDataSchema = new Schema({
  id: { type: String, required: true, unique: true },
  source_url: { type: String, required: true },
  
  // 基础信息
  basic_info: {
    title: String,
    description: String,
    category: String,
    brand: String,
    model: String,
    specifications: Schema.Types.Mixed,
    features: [String],
    images: [String],
    tags: [String]
  },
  
  // 销售数据
  sales_data: {
    sales_volume: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    review_count: { type: Number, default: 0 },
    availability: String,
    shipping_info: Schema.Types.Mixed,
    return_policy: String
  },
  
  // 价格信息
  pricing: {
    current_price: { type: Number, required: true },
    original_price: Number,
    discount_percentage: Number,
    currency: { type: String, default: 'USD' },
    bulk_pricing: Schema.Types.Mixed
  },
  
  // 供应商信息
  supplier: {
    name: String,
    rating: Number,
    years_in_business: Number,
    location: String,
    contact_info: Schema.Types.Mixed
  },
  
  // 收集元数据
  collected_at: { type: Date, default: Date.now },
  collection_config: Schema.Types.Mixed,
  
  // 分析结果（后续添加）
  analysis_results: {
    competitiveness: Schema.Types.Mixed,
    profit_potential: Schema.Types.Mixed,
    market_positioning: Schema.Types.Mixed,
    market_heat: Schema.Types.Mixed,
    overall_score: Schema.Types.Mixed,
    analyzed_at: Date
  }
}, {
  timestamps: true,
  collection: 'products_full_data'
});

// 创建索引
ProductFullDataSchema.index({ 'basic_info.category': 1 });
ProductFullDataSchema.index({ 'pricing.current_price': 1 });
ProductFullDataSchema.index({ 'sales_data.sales_volume': -1 });
ProductFullDataSchema.index({ collected_at: -1 });

export const ProductFullDataModel = model('ProductFullData', ProductFullDataSchema);
```

#### 2.2.2 数据仓库层
```typescript
// src/repositories/productRepository.ts

import { ProductFullDataModel } from '../models/productModel';
import { ProductFullData, ProductQuery } from '../types/product';

// 保存产品数据
export const saveProductData = async (productData: ProductFullData): Promise<void> => {
  try {
    await ProductFullDataModel.findOneAndUpdate(
      { id: productData.id },
      productData,
      { upsert: true, new: true }
    );
  } catch (error) {
    throw new Error(`保存产品数据失败: ${error.message}`);
  }
};

// 批量保存产品数据
export const batchSaveProductData = async (productsData: ProductFullData[]): Promise<void> => {
  try {
    const operations = productsData.map(product => ({
      updateOne: {
        filter: { id: product.id },
        update: product,
        upsert: true
      }
    }));
    
    await ProductFullDataModel.bulkWrite(operations);
  } catch (error) {
    throw new Error(`批量保存产品数据失败: ${error.message}`);
  }
};

// 查询产品数据
export const findProducts = async (query: ProductQuery) => {
  const {
    category,
    priceRange,
    ratingMin,
    salesVolumeMin,
    limit = 50,
    offset = 0,
    sortBy = 'collected_at',
    sortOrder = 'desc'
  } = query;
  
  // 构建查询条件
  const mongoQuery: any = {};
  
  if (category) {
    mongoQuery['basic_info.category'] = category;
  }
  
  if (priceRange) {
    mongoQuery['pricing.current_price'] = {
      $gte: priceRange.min,
      $lte: priceRange.max
    };
  }
  
  if (ratingMin) {
    mongoQuery['sales_data.rating'] = { $gte: ratingMin };
  }
  
  if (salesVolumeMin) {
    mongoQuery['sales_data.sales_volume'] = { $gte: salesVolumeMin };
  }
  
  // 执行查询
  const products = await ProductFullDataModel
    .find(mongoQuery)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(offset)
    .limit(limit)
    .lean();
  
  const total = await ProductFullDataModel.countDocuments(mongoQuery);
  
  return {
    products,
    total,
    hasMore: offset + limit < total
  };
};

// 获取单个产品数据
export const getProductById = async (productId: string): Promise<ProductFullData | null> => {
  return await ProductFullDataModel.findOne({ id: productId }).lean();
};

// 获取产品统计信息
export const getProductStats = async () => {
  const stats = await ProductFullDataModel.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        avgPrice: { $avg: '$pricing.current_price' },
        avgRating: { $avg: '$sales_data.rating' },
        totalSalesVolume: { $sum: '$sales_data.sales_volume' }
      }
    }
  ]);
  
  const categoryStats = await ProductFullDataModel.aggregate([
    {
      $group: {
        _id: '$basic_info.category',
        count: { $sum: 1 },
        avgPrice: { $avg: '$pricing.current_price' }
      }
    },
    { $sort: { count: -1 } }
  ]);
  
  return {
    overall: stats[0] || {},
    byCategory: categoryStats
  };
};
```

## 3. 智能分析层实现

### 3.1 深度分析服务

#### 3.1.1 竞争力分析实现
```typescript
// src/services/analysis/competitivenessAnalyzer.ts

import { ProductFullData } from '../../types/product';
import { findProducts } from '../../repositories/productRepository';

// 竞争力分析主函数
export const analyzeCompetitiveness = async (productData: ProductFullData) => {
  // 1. 价格竞争力分析
  const priceCompetitiveness = await analyzePriceCompetitiveness(productData);
  
  // 2. 质量指标分析
  const qualityIndicators = analyzeQualityIndicators(productData);
  
  // 3. 供应商可靠性分析
  const supplierReliability = analyzeSupplierReliability(productData.supplier);
  
  // 4. 综合竞争力评分
  const overallScore = calculateCompetitivenessScore({
    priceCompetitiveness,
    qualityIndicators,
    supplierReliability
  });
  
  return {
    price_competitiveness: priceCompetitiveness,
    quality_indicators: qualityIndicators,
    supplier_reliability: supplierReliability,
    overall_score: overallScore,
    analyzed_at: new Date()
  };
};

// 价格竞争力分析
const analyzePriceCompetitiveness = async (productData: ProductFullData) => {
  const { pricing, basic_info } = productData;
  
  // 获取同类产品价格数据
  const competitorProducts = await findProducts({
    category: basic_info.category,
    limit: 100
  });
  
  const competitorPrices = competitorProducts.products
    .map(p => p.pricing.current_price)
    .filter(price => price > 0);
  
  if (competitorPrices.length === 0) {
    return { score: 50, position: 'unknown', analysis: '缺乏竞争对手数据' };
  }
  
  // 计算价格位置
  const sortedPrices = competitorPrices.sort((a, b) => a - b);
  const pricePosition = calculatePricePosition(pricing.current_price, sortedPrices);
  
  // 计算价格优势指数
  const averagePrice = competitorPrices.reduce((sum, price) => sum + price, 0) / competitorPrices.length;
  const priceAdvantage = Math.max(0, (averagePrice - pricing.current_price) / averagePrice * 100);
  
  return {
    score: Math.min(100, priceAdvantage),
    position: pricePosition,
    average_competitor_price: averagePrice,
    price_percentile: calculatePercentile(pricing.current_price, sortedPrices),
    analysis: generatePriceAnalysis(pricing.current_price, averagePrice, pricePosition)
  };
};

// 质量指标分析
const analyzeQualityIndicators = (productData: ProductFullData) => {
  const { sales_data, basic_info } = productData;
  
  // 评分质量分析
  const ratingScore = Math.min(100, sales_data.rating * 20); // 5分制转100分制
  
  // 评论数量可信度
  const reviewCredibility = Math.min(100, Math.log10(sales_data.review_count + 1) * 25);
  
  // 销量信誉度
  const salesCredibility = Math.min(100, Math.log10(sales_data.sales_volume + 1) * 20);
  
  // 产品描述完整性
  const descriptionCompleteness = calculateDescriptionCompleteness(basic_info);
  
  // 图片质量评估
  const imageQuality = calculateImageQuality(basic_info.images);
  
  const overallQuality = (
    ratingScore * 0.3 +
    reviewCredibility * 0.2 +
    salesCredibility * 0.2 +
    descriptionCompleteness * 0.15 +
    imageQuality * 0.15
  );
  
  return {
    rating_score: ratingScore,
    review_credibility: reviewCredibility,
    sales_credibility: salesCredibility,
    description_completeness: descriptionCompleteness,
    image_quality: imageQuality,
    overall_score: overallQuality
  };
};

// 供应商可靠性分析
const analyzeSupplierReliability = (supplierData: any) => {
  if (!supplierData) {
    return { score: 50, analysis: '供应商信息不完整' };
  }
  
  const { rating, years_in_business, location } = supplierData;
  
  // 供应商评分
  const ratingScore = rating ? Math.min(100, rating * 20) : 50;
  
  // 经营年限评分
  const experienceScore = years_in_business ? Math.min(100, years_in_business * 8 + 20) : 50;
  
  // 地理位置优势
  const locationScore = calculateLocationAdvantage(location);
  
  const overallReliability = (ratingScore * 0.4 + experienceScore * 0.4 + locationScore * 0.2);
  
  return {
    rating_score: ratingScore,
    experience_score: experienceScore,
    location_score: locationScore,
    overall_score: overallReliability,
    analysis: generateSupplierAnalysis(supplierData)
  };
};

// 工具函数
const calculatePricePosition = (price: number, sortedPrices: number[]): string => {
  const percentile = calculatePercentile(price, sortedPrices);
  
  if (percentile <= 25) return 'low';
  if (percentile <= 75) return 'medium';
  return 'high';
};

const calculatePercentile = (value: number, sortedArray: number[]): number => {
  const index = sortedArray.findIndex(item => item >= value);
  return index === -1 ? 100 : (index / sortedArray.length) * 100;
};

const calculateDescriptionCompleteness = (basicInfo: any): number => {
  let score = 0;
  
  if (basicInfo.title && basicInfo.title.length > 10) score += 20;
  if (basicInfo.description && basicInfo.description.length > 50) score += 20;
  if (basicInfo.specifications && Object.keys(basicInfo.specifications).length > 0) score += 20;
  if (basicInfo.features && basicInfo.features.length > 0) score += 20;
  if (basicInfo.images && basicInfo.images.length >= 3) score += 20;
  
  return score;
};

const calculateImageQuality = (images: string[]): number => {
  if (!images || images.length === 0) return 0;
  
  let score = Math.min(100, images.length * 15); // 图片数量评分
  
  // 图片URL质量评估（简化版）
  const highQualityImages = images.filter(url => 
    url.includes('large') || url.includes('high') || url.includes('1080')
  );
  
  if (highQualityImages.length > 0) {
    score += 20;
  }
  
  return Math.min(100, score);
};

const calculateLocationAdvantage = (location: string): number => {
  if (!location) return 50;
  
  const locationScores: Record<string, number> = {
    '广东': 90, '浙江': 85, '江苏': 80, '山东': 75, '福建': 70
  };
  
  for (const [province, score] of Object.entries(locationScores)) {
    if (location.includes(province)) {
      return score;
    }
  }
  
  return 60; // 默认分数
};
```

#### 3.1.2 盈利潜力分析实现
```typescript
// src/services/analysis/profitPotentialAnalyzer.ts

import { ProductFullData } from '../../types/product';

// 盈利潜力分析主函数
export const analyzeProfitPotential = async (productData: ProductFullData) => {
  // 1. 成本结构分析
  const costAnalysis = analyzeCostStructure(productData);
  
  // 2. 利润率预测
  const marginPrediction = predictProfitMargin(productData, costAnalysis);
  
  // 3. ROI预测
  const roiPrediction = predictROI(productData, marginPrediction);
  
  // 4. 市场机会评估
  const marketOpportunity = assessMarketOpportunity(productData);
  
  // 5. 综合盈利评分
  const overallScore = calculateProfitScore({
    costAnalysis,
    marginPrediction,
    roiPrediction,
    marketOpportunity
  });
  
  return {
    cost_analysis: costAnalysis,
    margin_prediction: marginPrediction,
    roi_prediction: roiPrediction,
    market_opportunity: marketOpportunity,
    overall_score: overallScore,
    analyzed_at: new Date()
  };
};

// 成本结构分析
const analyzeCostStructure = (productData: ProductFullData) => {
  const { pricing, basic_info, supplier } = productData;
  
  // 产品成本估算（基于类别和价格）
  const productCostRatio = getCategoryCostRatio(basic_info.category);
  const productCost = pricing.current_price * productCostRatio;
  
  // 物流成本估算
  const shippingCost = estimateShippingCost(productData);
  
  // 平台费用估算
  const platformFees = pricing.current_price * 0.15; // 假设平台费用15%
  
  // 营销成本估算
  const marketingCost = pricing.current_price * 0.1; // 假设营销成本10%
  
  const totalCost = productCost + shippingCost + platformFees + marketingCost;
  
  return {
    product_cost: productCost,
    shipping_cost: shippingCost,
    platform_fees: platformFees,
    marketing_cost: marketingCost,
    total_cost: totalCost,
    cost_breakdown: {
      product: (productCost / totalCost * 100).toFixed(1) + '%',
      shipping: (shippingCost / totalCost * 100).toFixed(1) + '%',
      platform: (platformFees / totalCost * 100).toFixed(1) + '%',
      marketing: (marketingCost / totalCost * 100).toFixed(1) + '%'
    }
  };
};

// 利润率预测
const predictProfitMargin = (productData: ProductFullData, costAnalysis: any) => {
  const { pricing } = productData;
  const { total_cost } = costAnalysis;
  
  // 基础利润率
  const basicMargin = (pricing.current_price - total_cost) / pricing.current_price;
  
  // 市场风险调整
  const marketRisk = assessMarketRisk(productData);
  const riskAdjustment = (100 - marketRisk) / 100;
  
  // 调整后利润率
  const adjustedMargin = basicMargin * riskAdjustment;
  
  return {
    basic_margin: basicMargin,
    adjusted_margin: Math.max(0, adjustedMargin),
    risk_adjustment: riskAdjustment,
    margin_level: categorizeMargin(adjustedMargin),
    confidence: calculateMarginConfidence(productData)
  };
};

// ROI预测
const predictROI = (productData: ProductFullData, marginPrediction: any) => {
  const { sales_data, pricing } = productData;
  const { adjusted_margin } = marginPrediction;
  
  // 销量预测（基于当前销量）
  const monthlySales = Math.max(sales_data.sales_volume, 10); // 最少假设10件/月
  
  // 月收入预测
  const monthlyRevenue = monthlySales * pricing.current_price;
  
  // 月利润预测
  const monthlyProfit = monthlyRevenue * adjusted_margin;
  
  // 初始投资估算
  const initialInvestment = estimateInitialInvestment(productData);
  
  // ROI计算
  const monthlyROI = monthlyProfit / initialInvestment;
  const annualROI = monthlyROI * 12;
  
  // 回本周期
  const paybackMonths = initialInvestment / monthlyProfit;
  
  return {
    monthly_sales_forecast: monthlySales,
    monthly_revenue_forecast: monthlyRevenue,
    monthly_profit_forecast: monthlyProfit,
    initial_investment: initialInvestment,
    monthly_roi: monthlyROI,
    annual_roi: annualROI,
    payback_period_months: paybackMonths,
    roi_level: categorizeROI(annualROI)
  };
};

// 市场机会评估
const assessMarketOpportunity = (productData: ProductFullData) => {
  const { basic_info, sales_data } = productData;
  
  // 市场需求评估
  const demandScore = Math.min(100, Math.log10(sales_data.sales_volume + 1) * 30);
  
  // 竞争强度评估（简化版）
  const competitionScore = 70; // 假设中等竞争强度
  
  // 增长潜力评估
  const growthPotential = assessGrowthPotential(productData);
  
  // 市场进入难度
  const entryDifficulty = assessEntryDifficulty(basic_info.category);
  
  const opportunityScore = (
    demandScore * 0.3 +
    (100 - competitionScore) * 0.3 +
    growthPotential * 0.2 +
    (100 - entryDifficulty) * 0.2
  );
  
  return {
    demand_score: demandScore,
    competition_score: competitionScore,
    growth_potential: growthPotential,
    entry_difficulty: entryDifficulty,
    opportunity_score: opportunityScore,
    opportunity_level: categorizeOpportunity(opportunityScore)
  };
};

// 工具函数
const getCategoryCostRatio = (category: string): number => {
  const ratios: Record<string, number> = {
    '电子产品': 0.65,
    '服装': 0.45,
    '家居用品': 0.55,
    '美妆': 0.50,
    '运动户外': 0.60
  };
  return ratios[category] || 0.55;
};

const estimateShippingCost = (productData: ProductFullData): number => {
  // 简化的物流成本估算
  const baseShippingCost = 5; // 基础物流成本
  const weightFactor = 1; // 重量因子（简化）
  const distanceFactor = 1.2; // 距离因子（简化）
  
  return baseShippingCost * weightFactor * distanceFactor;
};

const assessMarketRisk = (productData: ProductFullData): number => {
  // 简化的市场风险评估
  const { sales_data } = productData;
  
  let riskScore = 30; // 基础风险
  
  // 销量风险
  if (sales_data.sales_volume < 50) riskScore += 20;
  
  // 评分风险
  if (sales_data.rating < 4.0) riskScore += 15;
  
  // 评论数量风险
  if (sales_data.review_count < 100) riskScore += 10;
  
  return Math.min(100, riskScore);
};

const estimateInitialInvestment = (productData: ProductFullData): number => {
  const { pricing } = productData;
  
  // 初始库存投资（假设首批进货100件）
  const inventoryInvestment = pricing.current_price * 0.6 * 100; // 成本价60%
  
  // 营销推广投资
  const marketingInvestment = 1000;
  
  // 其他费用
  const otherCosts = 500;
  
  return inventoryInvestment + marketingInvestment + otherCosts;
};

const categorizeMargin = (margin: number): string => {
  if (margin >= 0.3) return 'high';
  if (margin >= 0.15) return 'medium';
  if (margin >= 0.05) return 'low';
  return 'very_low';
};

const categorizeROI = (roi: number): string => {
  if (roi >= 0.5) return 'excellent';
  if (roi >= 0.3) return 'good';
  if (roi >= 0.15) return 'fair';
  return 'poor';
};

const categorizeOpportunity = (score: number): string => {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  if (score >= 40) return 'low';
  return 'very_low';
};
```

### 3.2 市场热度检测服务

#### 3.2.1 搜索趋势分析实现
```typescript
// src/services/analysis/marketHeatDetector.ts

import { ProductFullData } from '../../types/product';
import { findProducts } from '../../repositories/productRepository';

// 市场热度检测主函数
export const detectMarketHeat = async (productData: ProductFullData) => {
  // 1. 搜索趋势分析
  const searchTrends = await analyzeSearchTrends(productData);
  
  // 2. 销售热度分析
  const salesHeat = analyzeSalesHeat(productData);
  
  // 3. 价格波动分析
  const priceVolatility = analyzePriceVolatility(productData);
  
  // 4. 竞争热度分析
  const competitionHeat = await analyzeCompetitionHeat(productData);
  
  // 5. 综合热度评分
  const overallHeat = calculateOverallHeat({
    searchTrends,
    salesHeat,
    priceVolatility,
    competitionHeat
  });
  
  return {
    search_trends: searchTrends,
    sales_heat: salesHeat,
    price_volatility: priceVolatility,
    competition_heat: competitionHeat,
    overall_heat_score: overallHeat.score,
    heat_level: overallHeat.level,
    heat_trend: overallHeat.trend,
    analyzed_at: new Date()
  };
};

// 搜索趋势分析
const analyzeSearchTrends = async (productData: ProductFullData) => {
  const { basic_info } = productData;
  
  // 提取关键词
  const keywords = extractKeywords(basic_info.title);
  
  // 模拟搜索热度数据（实际应用中需要接入搜索API）
  const keywordHeat = await Promise.all(
    keywords.map(async (keyword) => ({
      keyword,
      search_volume: simulateSearchVolume(keyword),
      trend_direction: simulateTrendDirection(),
      competition_level: simulateCompetitionLevel()
    }))
  );
  
  // 计算综合搜索热度
  const avgSearchVolume = keywordHeat.reduce((sum, kw) => sum + kw.search_volume, 0) / keywordHeat.length;
  const trendScore = calculateTrendScore(keywordHeat);
  
  return {
    keywords: keywordHeat,
    avg_search_volume: avgSearchVolume,
    trend_score: trendScore,
    search_heat_level: categorizeSearchHeat(avgSearchVolume)
  };
};

// 销售热度分析
const analyzeSalesHeat = (productData: ProductFullData) => {
  const { sales_data } = productData;
  
  // 销售速度评分
  const salesVelocity = Math.min(100, Math.log10(sales_data.sales_volume + 1) * 25);
  
  // 评论增长速度（简化计算）
  const reviewVelocity = Math.min(100, Math.log10(sales_data.review_count + 1) * 20);
  
  // 评分趋势（基于当前评分）
  const ratingTrend = sales_data.rating >= 4.5 ? 'rising' : 
                     sales_data.rating >= 4.0 ? 'stable' : 'declining';
  
  // 综合销售热度
  const salesHeatScore = (salesVelocity * 0.6 + reviewVelocity * 0.4);
  
  return {
    sales_velocity: salesVelocity,
    review_velocity: reviewVelocity,
    rating_trend: ratingTrend,
    sales_heat_score: salesHeatScore,
    sales_heat_level: categorizeSalesHeat(salesHeatScore)
  };
};

// 价格波动分析
const analyzePriceVolatility = (productData: ProductFullData) => {
  const { pricing } = productData;
  
  // 简化的价格波动分析（实际应用中需要历史价格数据）
  const hasDiscount = pricing.original_price && pricing.original_price > pricing.current_price;
  const discountPercentage = hasDiscount ? 
    (pricing.original_price - pricing.current_price) / pricing.original_price * 100 : 0;
  
  // 价格稳定性评分
  const priceStability = hasDiscount ? Math.max(0, 100 - discountPercentage * 2) : 80;
  
  // 价格吸引力评分
  const priceAttractiveness = hasDiscount ? Math.min(100, discountPercentage * 3) : 50;
  
  return {
    has_discount: hasDiscount,
    discount_percentage: discountPercentage,
    price_stability: priceStability,
    price_attractiveness: priceAttractiveness,
    volatility_level: categorizeVolatility(priceStability)
  };
};

// 竞争热度分析
const analyzeCompetitionHeat = async (productData: ProductFullData) => {
  const { basic_info, pricing } = productData;
  
  // 获取同类产品数量
  const competitorProducts = await findProducts({
    category: basic_info.category,
    priceRange: {
      min: pricing.current_price * 0.8,
      max: pricing.current_price * 1.2
    },
    limit: 100
  });
  
  const competitorCount = competitorProducts.total;
  
  // 竞争密度评分
  const competitionDensity = Math.min(100, competitorCount * 2);
  
  // 新品进入速度（简化计算）
  const newEntryRate = Math.min(100, competitorCount * 0.1);
  
  // 市场集中度
  const marketConcentration = calculateMarketConcentration(competitorProducts.products);
  
  return {
    competitor_count: competitorCount,
    competition_density: competitionDensity,
    new_entry_rate: newEntryRate,
    market_concentration: marketConcentration,
    competition_heat_level: categorizeCompetitionHeat(competitionDensity)
  };
};

// 综合热度计算
const calculateOverallHeat = (heatComponents: any) => {
  const { searchTrends, salesHeat, priceVolatility, competitionHeat } = heatComponents;
  
  // 权重配置
  const weights = {
    search: 0.3,
    sales: 0.4,
    price: 0.15,
    competition: 0.15
  };
  
  // 计算加权平均分
  const overallScore = (
    searchTrends.trend_score * weights.search +
    salesHeat.sales_heat_score * weights.sales +
    priceVolatility.price_attractiveness * weights.price +
    competitionHeat.competition_density * weights.competition
  );
  
  // 确定热度等级
  const heatLevel = categorizeOverallHeat(overallScore);
  
  // 确定趋势方向
  const heatTrend = determineHeatTrend(heatComponents);
  
  return {
    score: overallScore,
    level: heatLevel,
    trend: heatTrend
  };
};

// 工具函数
const extractKeywords = (title: string): string[] => {
  // 简化的关键词提取
  return title
    .toLowerCase()
    .split(/[\s,\-_]+/)
    .filter(word => word.length > 2)
    .slice(0, 5); // 取前5个关键词
};

const simulateSearchVolume = (keyword: string): number => {
  // 模拟搜索量数据
  return Math.floor(Math.random() * 10000) + 1000;
};

const simulateTrendDirection = (): 'rising' | 'stable' | 'declining' => {
  const rand = Math.random();
  if (rand < 0.4) return 'rising';
  if (rand < 0.8) return 'stable';
  return 'declining';
};

const simulateCompetitionLevel = (): 'low' | 'medium' | 'high' => {
  const rand = Math.random();
  if (rand < 0.3) return 'low';
  if (rand < 0.7) return 'medium';
  return 'high';
};

const calculateTrendScore = (keywordHeat: any[]): number => {
  const risingCount = keywordHeat.filter(kw => kw.trend_direction === 'rising').length;
  const totalCount = keywordHeat.length;
  return (risingCount / totalCount) * 100;
};

const calculateMarketConcentration = (products: any[]): number => {
  // 简化的市场集中度计算
  if (products.length === 0) return 0;
  
  const totalSales = products.reduce((sum, p) => sum + (p.sales_data?.sales_volume || 0), 0);
  const topProducts = products
    .sort((a, b) => (b.sales_data?.sales_volume || 0) - (a.sales_data?.sales_volume || 0))
    .slice(0, 5);
  
  const topSales = topProducts.reduce((sum, p) => sum + (p.sales_data?.sales_volume || 0), 0);
  
  return totalSales > 0 ? (topSales / totalSales) * 100 : 0;
};

// 分类函数
const categorizeSearchHeat = (volume: number): string => {
  if (volume >= 5000) return 'high';
  if (volume >= 2000) return 'medium';
  return 'low';
};

const categorizeSalesHeat = (score: number): string => {
  if (score >= 70) return 'hot';
  if (score >= 40) return 'warm';
  return 'cold';
};

const categorizeVolatility = (stability: number): string => {
  if (stability >= 80) return 'low';
  if (stability >= 50) return 'medium';
  return 'high';
};

const categorizeCompetitionHeat = (density: number): string => {
  if (density >= 70) return 'intense';
  if (density >= 40) return 'moderate';
  return 'light';
};

const categorizeOverallHeat = (score: number): string => {
  if (score >= 80) return 'very_hot';
  if (score >= 60) return 'hot';
  if (score >= 40) return 'warm';
  if (score >= 20) return 'cool';
  return 'cold';
};

const determineHeatTrend = (components: any): 'rising' | 'stable' | 'declining' => {
  // 基于各组件趋势综合判断
  const { searchTrends, salesHeat } = components;
  
  if (searchTrends.trend_score > 60 && salesHeat.sales_heat_score > 60) {
    return 'rising';
  } else if (searchTrends.trend_score < 30 || salesHeat.sales_heat_score < 30) {
    return 'declining';
  }
  
  return 'stable';
};
```

## 4. API层实现

### 4.1 数据收集API
```typescript
// src/routes/dataCollection.ts

import { Router } from 'express';
import { collectFullProductData, batchCollectProducts } from '../services/dataCollection/fullDataCollector';
import { saveProductData } from '../repositories/productRepository';

const router = Router();

// 单个产品数据收集
router.post('/collect/single', async (req, res) => {
  try {
    const { productUrl, config } = req.body;
    
    if (!productUrl) {
      return res.status(400).json({ error: '产品URL不能为空' });
    }
    
    const productData = await collectFullProductData(productUrl, config);
    await saveProductData(productData);
    
    res.json({
      success: true,
      data: productData,
      message: '数据收集完成'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 批量产品数据收集
router.post('/collect/batch', async (req, res) => {
  try {
    const { productUrls, config } = req.body;
    
    if (!productUrls || !Array.isArray(productUrls)) {
      return res.status(400).json({ error: '产品URL列表不能为空' });
    }
    
    const result = await batchCollectProducts(productUrls, config);
    
    res.json({
      success: true,
      data: result,
      message: `批量收集完成，成功${result.successful}个，失败${result.failed}个`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

### 4.2 智能分析API
```typescript
// src/routes/analysis.ts

import { Router } from 'express';
import { analyzeCompetitiveness } from '../services/analysis/competitivenessAnalyzer';
import { analyzeProfitPotential } from '../services/analysis/profitPotentialAnalyzer';
import { detectMarketHeat } from '../services/analysis/marketHeatDetector';
import { getProductById } from '../repositories/productRepository';

const router = Router();

// 单个产品完整分析
router.post('/analyze/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    const productData = await getProductById(productId);
    if (!productData) {
      return res.status(404).json({ error: '产品不存在' });
    }
    
    // 并行执行各项分析
    const [competitiveness, profitPotential, marketHeat] = await Promise.all([
      analyzeCompetitiveness(productData),
      analyzeProfitPotential(productData),
      detectMarketHeat(productData)
    ]);
    
    // 计算综合评分
    const overallScore = (
      competitiveness.overall_score * 0.25 +
      profitPotential.overall_score * 0.30 +
      marketHeat.overall_heat_score * 0.45
    );
    
    const analysisResult = {
      product_id: productId,
      competitiveness,
      profit_potential: profitPotential,
      market_heat: marketHeat,
      overall_score: overallScore,
      analyzed_at: new Date()
    };
    
    res.json({
      success: true,
      data: analysisResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 批量分析
router.post('/analyze/batch', async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!productIds || !Array.isArray(productIds)) {
      return res.status(400).json({ error: '产品ID列表不能为空' });
    }
    
    const results = [];
    const errors = [];
    
    for (const productId of productIds) {
      try {
        const productData = await getProductById(productId);
        if (!productData) {
          errors.push({ productId, error: '产品不存在' });
          continue;
        }
        
        const [competitiveness, profitPotential, marketHeat] = await Promise.all([
          analyzeCompetitiveness(productData),
          analyzeProfitPotential(productData),
          detectMarketHeat(productData)
        ]);
        
        const overallScore = (
          competitiveness.overall_score * 0.25 +
          profitPotential.overall_score * 0.30 +
          marketHeat.overall_heat_score * 0.45
        );
        
        results.push({
          product_id: productId,
          overall_score: overallScore,
          competitiveness_score: competitiveness.overall_score,
          profit_score: profitPotential.overall_score,
          heat_score: marketHeat.overall_heat_score
        });
      } catch (error) {
        errors.push({ productId, error: error.message });
      }
    }
    
    res.json({
      success: true,
      data: {
        results,
        errors,
        total: productIds.length,
        successful: results.length,
        failed: errors.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
```

## 5. 前端组件实现

### 5.1 数据收集组件
```typescript
// src/components/DataCollection/ProductCollector.tsx

import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { collectProductData } from '../../api/dataCollection';

interface ProductCollectorProps {
  onCollectionComplete?: (data: any) => void;
}

export const ProductCollector: React.FC<ProductCollectorProps> = ({
  onCollectionComplete
}) => {
  const [productUrl, setProductUrl] = useState('');
  const [isCollecting, setIsCollecting] = useState(false);
  
  const collectMutation = useMutation({
    mutationFn: collectProductData,
    onSuccess: (data) => {
      setIsCollecting(false);
      onCollectionComplete?.(data);
    },
    onError: (error) => {
      setIsCollecting(false);
      console.error('收集失败:', error);
    }
  });
  
  const handleCollect = async () => {
    if (!productUrl.trim()) return;
    
    setIsCollecting(true);
    collectMutation.mutate({
      productUrl: productUrl.trim(),
      config: {
        mode: 'full',
        includeImages: true,
        includeReviews: false
      }
    });
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">产品数据收集</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            产品链接
          </label>
          <input
            type="url"
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
            placeholder="请输入产品页面URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isCollecting}
          />
        </div>
        
        <button
          onClick={handleCollect}
          disabled={!productUrl.trim() || isCollecting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isCollecting ? '收集中...' : '开始收集'}
        </button>
      </div>
      
      {collectMutation.isError && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          收集失败: {collectMutation.error?.message}
        </div>
      )}
    </div>
  );
};
```

### 5.2 智能分析组件
```typescript
// src/components/Analysis/AnalysisResults.tsx

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalysisResultsProps {
  analysisData: {
    competitiveness: any;
    profit_potential: any;
    market_heat: any;
    overall_score: number;
  };
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysisData }) => {
  const { competitiveness, profit_potential, market_heat, overall_score } = analysisData;
  
  const chartData = [
    { name: '竞争力', score: competitiveness.overall_score },
    { name: '盈利潜力', score: profit_potential.overall_score },
    { name: '市场热度', score: market_heat.overall_heat_score },
    { name: '综合评分', score: overall_score }
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreLevel = (score: number) => {
    if (score >= 80) return '优秀';
    if (score >= 60) return '良好';
    if (score >= 40) return '一般';
    return '较差';
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-6">智能分析结果</h3>
      
      {/* 综合评分 */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(overall_score)}`}>
            {overall_score.toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">
            综合评分 - {getScoreLevel(overall_score)}
          </div>
        </div>
      </div>
      
      {/* 评分图表 */}
      <div className="mb-6">
        <h4 className="text-md font-medium mb-3">各维度评分</h4>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="score" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* 详细分析 */}
      <div className="space-y-4">
        {/* 竞争力分析 */}
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium text-gray-900">竞争力分析</h4>
          <div className="text-sm text-gray-600 mt-1">
            <div>价格竞争力: {competitiveness.price_competitiveness?.score?.toFixed(1) || 'N/A'}</div>
            <div>质量指标: {competitiveness.quality_indicators?.overall_score?.toFixed(1) || 'N/A'}</div>
            <div>供应商可靠性: {competitiveness.supplier_reliability?.overall_score?.toFixed(1) || 'N/A'}</div>
          </div>
        </div>
        
        {/* 盈利潜力分析 */}
        <div className="border-l-4 border-green-500 pl-4">
          <h4 className="font-medium text-gray-900">盈利潜力分析</h4>
          <div className="text-sm text-gray-600 mt-1">
            <div>预期利润率: {(profit_potential.margin_prediction?.adjusted_margin * 100)?.toFixed(1) || 'N/A'}%</div>
            <div>年化ROI: {(profit_potential.roi_prediction?.annual_roi * 100)?.toFixed(1) || 'N/A'}%</div>
            <div>回本周期: {profit_potential.roi_prediction?.payback_period_months?.toFixed(1) || 'N/A'}个月</div>
          </div>
        </div>
        
        {/* 市场热度分析 */}
        <div className="border-l-4 border-red-500 pl-4">
          <h4 className="font-medium text-gray-900">市场热度分析</h4>
          <div className="text-sm text-gray-600 mt-1">
            <div>搜索热度: {market_heat.search_trends?.trend_score?.toFixed(1) || 'N/A'}</div>
            <div>销售热度: {market_heat.sales_heat?.sales_heat_score?.toFixed(1) || 'N/A'}</div>
            <div>热度等级: {market_heat.heat_level || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 5.3 产品列表组件
```typescript
// src/components/Products/ProductList.tsx

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../../api/products';

interface ProductListProps {
  onProductSelect?: (product: any) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ onProductSelect }) => {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: { min: 0, max: 1000 },
    ratingMin: 0,
    sortBy: 'collected_at',
    sortOrder: 'desc'
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', filters, currentPage],
    queryFn: () => getProducts({
      ...filters,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    })
  });
  
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        加载失败: {error.message}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* 筛选器 */}
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              分类
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全部分类</option>
              <option value="电子产品">电子产品</option>
              <option value="服装">服装</option>
              <option value="家居用品">家居用品</option>
              <option value="美妆">美妆</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              最低评分
            </label>
            <select
              value={filters.ratingMin}
              onChange={(e) => handleFilterChange('ratingMin', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>不限</option>
              <option value={3}>3分以上</option>
              <option value={4}>4分以上</option>
              <option value={4.5}>4.5分以上</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序方式
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="collected_at">收集时间</option>
              <option value="pricing.current_price">价格</option>
              <option value="sales_data.rating">评分</option>
              <option value="sales_data.sales_volume">销量</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序顺序
            </label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">降序</option>
              <option value="asc">升序</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* 产品列表 */}
      <div className="p-4">
        {data?.products?.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            暂无产品数据
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.products?.map((product: any) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onProductSelect?.(product)}
              >
                {/* 产品图片 */}
                {product.basic_info?.images?.[0] && (
                  <img
                    src={product.basic_info.images[0]}
                    alt={product.basic_info?.title}
                    className="w-full h-32 object-cover rounded-md mb-3"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                
                {/* 产品信息 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                    {product.basic_info?.title || '未知产品'}
                  </h4>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>价格:</span>
                      <span className="font-medium text-green-600">
                        ${product.pricing?.current_price?.toFixed(2) || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>评分:</span>
                      <span className="font-medium">
                        {product.sales_data?.rating?.toFixed(1) || 'N/A'} ⭐
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>销量:</span>
                      <span className="font-medium">
                        {product.sales_data?.sales_volume || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>分类:</span>
                      <span className="font-medium">
                        {product.basic_info?.category || '未分类'}
                      </span>
                    </div>
                  </div>
                  
                  {/* 分析状态 */}
                  {product.analysis_results && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-md">
                      <div className="text-xs text-blue-600">
                        综合评分: {product.analysis_results.overall_score?.score?.toFixed(1) || 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* 分页 */}
        {data?.total > pageSize && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            
            <span className="text-sm text-gray-600">
              第 {currentPage} 页，共 {Math.ceil(data.total / pageSize)} 页
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!data.hasMore}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
```

## 6. 任务调度实现

### 6.1 任务队列配置
```typescript
// src/services/queue/taskQueue.ts

import Bull from 'bull';
import Redis from 'ioredis';

// Redis连接配置
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD
});

// 创建任务队列
export const dataCollectionQueue = new Bull('data-collection', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    }
  }
});

export const analysisQueue = new Bull('analysis', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 2,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

// 任务处理器
dataCollectionQueue.process('collect-product', async (job) => {
  const { productUrl, config } = job.data;
  
  try {
    const { collectFullProductData } = await import('../dataCollection/fullDataCollector');
    const { saveProductData } = await import('../../repositories/productRepository');
    
    job.progress(10);
    
    const productData = await collectFullProductData(productUrl, config);
    job.progress(80);
    
    await saveProductData(productData);
    job.progress(100);
    
    return { success: true, productId: productData.id };
  } catch (error) {
    throw new Error(`数据收集失败: ${error.message}`);
  }
});

analysisQueue.process('analyze-product', async (job) => {
  const { productId } = job.data;
  
  try {
    const { getProductById } = await import('../../repositories/productRepository');
    const { analyzeCompetitiveness } = await import('../analysis/competitivenessAnalyzer');
    const { analyzeProfitPotential } = await import('../analysis/profitPotentialAnalyzer');
    const { detectMarketHeat } = await import('../analysis/marketHeatDetector');
    
    job.progress(10);
    
    const productData = await getProductById(productId);
    if (!productData) {
      throw new Error('产品不存在');
    }
    
    job.progress(30);
    
    const [competitiveness, profitPotential, marketHeat] = await Promise.all([
      analyzeCompetitiveness(productData),
      analyzeProfitPotential(productData),
      detectMarketHeat(productData)
    ]);
    
    job.progress(80);
    
    // 保存分析结果
    const analysisResults = {
      competitiveness,
      profit_potential: profitPotential,
      market_heat: marketHeat,
      overall_score: {
        score: (
          competitiveness.overall_score * 0.25 +
          profitPotential.overall_score * 0.30 +
          marketHeat.overall_heat_score * 0.45
        ),
        analyzed_at: new Date()
      }
    };
    
    // 更新产品数据
    const { ProductFullDataModel } = await import('../../models/productModel');
    await ProductFullDataModel.findOneAndUpdate(
      { id: productId },
      { analysis_results: analysisResults },
      { new: true }
    );
    
    job.progress(100);
    
    return { success: true, analysisResults };
  } catch (error) {
    throw new Error(`分析失败: ${error.message}`);
  }
});

// 队列监控
dataCollectionQueue.on('completed', (job, result) => {
  console.log(`数据收集任务完成: ${job.id}`, result);
});

dataCollectionQueue.on('failed', (job, err) => {
  console.error(`数据收集任务失败: ${job.id}`, err.message);
});

analysisQueue.on('completed', (job, result) => {
  console.log(`分析任务完成: ${job.id}`, result);
});

analysisQueue.on('failed', (job, err) => {
  console.error(`分析任务失败: ${job.id}`, err.message);
});
```

### 6.2 定时任务调度
```typescript
// src/services/scheduler/taskScheduler.ts

import cron from 'node-cron';
import { dataCollectionQueue, analysisQueue } from '../queue/taskQueue';
import { findProducts } from '../../repositories/productRepository';

// 定时数据收集任务
export const scheduleDataCollection = () => {
  // 每天凌晨2点执行数据收集
  cron.schedule('0 2 * * *', async () => {
    console.log('开始执行定时数据收集任务');
    
    try {
      // 获取需要更新的产品列表
      const products = await findProducts({
        limit: 100,
        sortBy: 'collected_at',
        sortOrder: 'asc'
      });
      
      // 添加到收集队列
      for (const product of products.products) {
        await dataCollectionQueue.add('collect-product', {
          productUrl: product.source_url,
          config: {
            mode: 'full',
            includeImages: true,
            includeReviews: false
          }
        }, {
          delay: Math.random() * 60000 // 随机延迟0-60秒
        });
      }
      
      console.log(`已添加 ${products.products.length} 个产品到收集队列`);
    } catch (error) {
      console.error('定时数据收集任务失败:', error);
    }
  });
};

// 定时分析任务
export const scheduleAnalysis = () => {
  // 每天凌晨4点执行分析任务
  cron.schedule('0 4 * * *', async () => {
    console.log('开始执行定时分析任务');
    
    try {
      // 获取需要分析的产品（最近收集但未分析的）
      const { ProductFullDataModel } = await import('../../models/productModel');
      
      const products = await ProductFullDataModel.find({
        $or: [
          { analysis_results: { $exists: false } },
          { 'analysis_results.analyzed_at': { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }
        ]
      }).limit(50).lean();
      
      // 添加到分析队列
      for (const product of products) {
        await analysisQueue.add('analyze-product', {
          productId: product.id
        }, {
          delay: Math.random() * 30000 // 随机延迟0-30秒
        });
      }
      
      console.log(`已添加 ${products.length} 个产品到分析队列`);
    } catch (error) {
      console.error('定时分析任务失败:', error);
    }
  });
};

// 启动所有定时任务
export const startScheduler = () => {
  scheduleDataCollection();
  scheduleAnalysis();
  console.log('任务调度器已启动');
};
```

## 7. 部署配置

### 7.1 Docker配置
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制package文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

### 7.2 Docker Compose配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecommerce-ai
      - REDIS_HOST=redis
      - REDIS_PORT=6379
    depends_on:
      - mongo
      - redis
    volumes:
      - ./logs:/app/logs

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_DATABASE=ecommerce-ai

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  mongo_data:
  redis_data:
```

## 8. 开发时间线

### 第一阶段：基础架构搭建（1-2周）
- 项目初始化和环境配置
- 数据模型设计和数据库配置
- 基础API框架搭建
- 前端项目初始化

### 第二阶段：数据收集模块（2-3周）
- 数据提取工具函数开发
- 全量数据收集服务实现
- 批量收集处理器开发
- 数据存储层实现

### 第三阶段：智能分析模块（3-4周）
- 竞争力分析算法实现
- 盈利潜力分析算法实现
- 市场热度检测算法实现
- 分析结果存储和API接口

### 第四阶段：前端界面开发（2-3周）
- 数据收集界面组件
- 分析结果展示组件
- 产品列表和筛选组件
- 数据可视化图表

### 第五阶段：任务调度和优化（1-2周）
- 任务队列配置
- 定时任务调度
- 性能优化
- 错误处理和监控

### 第六阶段：测试和部署（1周）
- 单元测试和集成测试
- Docker配置和部署
- 生产环境配置
- 文档完善

**总计开发时间：10-15周**

## 9. 技术要点总结

### 9.1 核心优势
- **简化架构**：专注全量收集，避免复杂的增量逻辑
- **函数式编程**：代码结构清晰，易于测试和维护
- **组件化设计**：前端组件可复用，后端服务模块化
- **智能分析**：深度分析和市场热度检测提供决策支持

### 9.2 技术特点
- **TypeScript**：类型安全，提高代码质量
- **异步处理**：使用Promise和async/await处理异步操作
- **任务队列**：使用Bull队列处理批量任务
- **数据可视化**：使用Recharts展示分析结果

### 9.3 扩展性考虑
- **模块化设计**：各功能模块独立，便于扩展
- **配置化**：关键参数可配置，适应不同需求
- **缓存机制**：使用Redis缓存提高性能
- **监控日志**：完善的错误处理和日志记录

这个简化的技术实现方案专注于核心功能，避免了复杂的增量处理和数据质量检查，同时保持了系统的可扩展性和维护性。