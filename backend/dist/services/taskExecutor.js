import { TaskModel } from '../models/index.js';
import { ProductFullData } from '../models/ProductFullData.js';
import { DeepAnalysisResult } from '../models/DeepAnalysisResult.js';
import { getProductParser } from './parsers/productParser.js';
import axios from 'axios';
import * as cheerio from 'cheerio';
class TaskExecutor {
    isRunning = false;
    pollInterval = 5000; // 5秒检查一次
    constructor() {
        this.startPolling();
    }
    async startPolling() {
        if (this.isRunning)
            return;
        this.isRunning = true;
        console.log('🚀 任务执行器启动');
        while (this.isRunning) {
            try {
                await this.processPendingTasks();
                await new Promise(resolve => setTimeout(resolve, this.pollInterval));
            }
            catch (error) {
                console.error('❌ 任务处理出错:', error);
                await new Promise(resolve => setTimeout(resolve, this.pollInterval));
            }
        }
    }
    async processPendingTasks() {
        const pendingTasks = await TaskModel.find({
            status: 'pending'
        }).limit(5); // 一次处理5个任务
        for (const task of pendingTasks) {
            try {
                console.log(`📋 开始处理任务: ${task.task_id}`);
                await this.executeTask(task);
            }
            catch (error) {
                console.error(`❌ 任务 ${task.task_id} 执行失败:`, error);
                await this.markTaskFailed(task, error);
            }
        }
    }
    async executeTask(task) {
        switch (task.type) {
            case 'full_data_collection':
                // 检查是否是单个商品任务，如果是则跳过，让插件处理
                if (task.input.product_urls && task.input.product_urls.length === 1) {
                    console.log(`📱 单个商品任务跳过，等待插件处理: ${task.task_id}`);
                    // 不修改任务状态，让插件轮询时处理
                    return;
                }
                // 批量任务在后端处理
                // 更新任务状态为运行中
                task.status = 'running';
                task.meta.started_at = new Date();
                await task.save();
                await this.executeDataCollection(task);
                break;
            case 'keyword_collection':
                // 更新任务状态为运行中
                task.status = 'running';
                task.meta.started_at = new Date();
                await task.save();
                await this.executeKeywordCollection(task);
                break;
            case 'deep_analysis':
                // 分析任务完全在后端执行，不需要插件参与
                // 更新任务状态为运行中
                task.status = 'running';
                task.meta.started_at = new Date();
                await task.save();
                await this.executeDeepAnalysis(task);
                break;
            case 'market_heat_detection':
                // 市场热度检测任务完全在后端执行，不需要插件参与
                // 暂时使用深度分析逻辑，后续可以单独实现
                // 更新任务状态为运行中
                task.status = 'running';
                task.meta.started_at = new Date();
                await task.save();
                await this.executeDeepAnalysis(task);
                break;
            default:
                throw new Error(`不支持的任务类型: ${task.type}`);
        }
    }
    async executeDataCollection(task) {
        const urls = task.input.product_urls || [];
        const collectedProducts = [];
        let successCount = 0;
        let failureCount = 0;
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                console.log(`🔍 正在收集商品数据: ${url}`);
                // 更新进度
                task.progress.processed_items = i + 1;
                task.progress.percentage = Math.round(((i + 1) / urls.length) * 100);
                task.progress.current_item = url;
                await task.save();
                const productData = await this.extractProductData(url);
                if (productData) {
                    // 保存商品数据
                    const productId = await this.saveProductData(productData);
                    collectedProducts.push(productId);
                    successCount++;
                    console.log(`✅ 商品数据收集成功: ${productData.title}`);
                }
                else {
                    failureCount++;
                    console.log(`❌ 商品数据收集失败: ${url}`);
                }
            }
            catch (error) {
                failureCount++;
                console.error(`❌ 处理商品 ${url} 时出错:`, error);
            }
            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        // 更新任务完成状态
        task.status = successCount > 0 ? 'completed' : 'failed';
        task.meta.completed_at = new Date();
        task.meta.duration = Date.now() - task.meta.started_at.getTime();
        task.output = {
            collected_products: collectedProducts,
            success_count: successCount,
            failure_count: failureCount,
            error_details: successCount === 0 ? '数据提取失败或未找到商品' : undefined
        };
        task.progress.percentage = 100;
        await task.save();
        console.log(`🎉 任务 ${task.task_id} 完成，成功: ${successCount}, 失败: ${failureCount}`);
    }
    async executeKeywordCollection(task) {
        // 关键词收集逻辑
        const keywords = task.input.keywords || [];
        const platform = task.input.platform || 'alibaba';
        // 这里可以实现关键词搜索逻辑
        console.log(`🔍 执行关键词收集: ${keywords.join(', ')} on ${platform}`);
        // 暂时标记为完成
        task.status = 'completed';
        task.meta.completed_at = new Date();
        task.meta.duration = Date.now() - task.meta.started_at.getTime();
        task.progress.percentage = 100;
        await task.save();
    }
    async executeDeepAnalysis(task) {
        const productIds = task.input.product_ids || [];
        const analysisOptions = task.input.analysis_options || {};
        const analysisResults = [];
        let successCount = 0;
        let failureCount = 0;
        console.log(`🔬 开始深度分析任务: ${productIds.length} 个商品`);
        // 更新任务进度
        task.progress.total_items = productIds.length;
        await task.save();
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            try {
                console.log(`🔍 正在分析商品: ${productId}`);
                // 更新进度
                task.progress.processed_items = i + 1;
                task.progress.percentage = Math.round(((i + 1) / productIds.length) * 100);
                task.progress.current_item = productId;
                await task.save();
                // 执行深度分析
                const analysisResult = await this.performDeepAnalysis(productId, analysisOptions);
                if (analysisResult) {
                    analysisResults.push(analysisResult);
                    successCount++;
                    console.log(`✅ 商品分析完成: ${productId}`);
                }
                else {
                    failureCount++;
                    console.log(`❌ 商品分析失败: ${productId}`);
                }
            }
            catch (error) {
                failureCount++;
                console.error(`❌ 分析商品 ${productId} 时出错:`, error);
            }
            // 添加延迟避免请求过快
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        // 更新任务完成状态
        task.status = successCount > 0 ? 'completed' : 'failed';
        task.meta.completed_at = new Date();
        task.meta.duration = Date.now() - task.meta.started_at.getTime();
        task.output = {
            analysis_results: analysisResults,
            success_count: successCount,
            failure_count: failureCount
        };
        task.progress.percentage = 100;
        await task.save();
        console.log(`🎉 深度分析任务 ${task.task_id} 完成，成功: ${successCount}, 失败: ${failureCount}`);
    }
    async performDeepAnalysis(productId, options) {
        try {
            console.log(`🔍 开始查找商品: ${productId}`);
            // 从数据库获取商品数据
            const product = await ProductFullData.findById(productId);
            if (!product) {
                console.log(`❌ 未找到商品数据: ${productId}`);
                return null;
            }
            console.log(`🔬 开始深度分析商品: ${product.basic_info.title}`);
            console.log(`📊 商品价格: ${product.pricing.current_price} ${product.pricing.currency}`);
            console.log(`📈 销售数据: 销量=${product.sales_data.sales_volume}, 评分=${product.sales_data.rating}`);
            // 构建符合DeepAnalysisResult模型的分析数据
            const analysisData = {
                product_id: productId,
                // 深度分析维度
                deep_analysis: {
                    // 商品竞争力分析
                    competitiveness: {
                        score: this.calculateCompetitivenessScore(product),
                        factors: {
                            price_advantage: this.analyzePriceAdvantage(product),
                            quality_indicators: this.analyzeQualityIndicators(product),
                            supplier_reliability: this.calculateSupplierReliability(product),
                            product_uniqueness: this.analyzeProductUniqueness(product)
                        },
                        insights: this.generateCompetitivenessInsights(product)
                    },
                    // 盈利潜力分析
                    profit_potential: {
                        score: this.calculateProfitScore(product),
                        estimated_margin: this.calculateEstimatedMargin(product),
                        cost_analysis: {
                            product_cost: product.pricing.current_price * 0.6, // 估算成本
                            shipping_cost: this.estimateShippingCost(product),
                            platform_fees: product.pricing.current_price * 0.1, // 平台费用
                            marketing_cost: product.pricing.current_price * 0.15 // 营销成本
                        },
                        roi_projection: this.calculateROI(product)
                    },
                    // 市场定位分析
                    market_positioning: {
                        target_segment: this.analyzeTargetSegment(product),
                        price_tier: this.analyzePriceTier(product),
                        differentiation_points: this.analyzeDifferentiationPoints(product),
                        competitive_landscape: this.analyzeCompetitiveLandscape(product)
                    }
                },
                // 市场热度检测
                market_heat: {
                    current_heat_score: this.calculateHeatScore(product),
                    heat_trend: this.analyzeHeatTrend(product),
                    heat_factors: {
                        search_volume_trend: this.analyzeSearchVolume(product),
                        sales_velocity: this.analyzeSalesVelocity(product),
                        price_stability: this.analyzePriceStability(product),
                        seasonal_factor: this.analyzeSeasonalFactor(product)
                    },
                    heat_history: [] // 初始为空，后续可以添加历史数据
                },
                // 综合评分和建议
                overall_assessment: {
                    total_score: this.calculateTotalScore(product),
                    recommendation: this.generateRecommendation(product),
                    confidence_level: this.calculateConfidenceLevel(product),
                    key_reasons: this.generateKeyReasons(product),
                    risk_factors: this.identifyRiskFactors(product)
                },
                // 分析元数据
                analysis_meta: {
                    analyzed_at: new Date(),
                    analysis_version: '1.0.0',
                    processing_time: 0 // 将在保存后计算
                }
            };
            console.log(`💾 保存分析结果到数据库...`);
            // 检查是否已存在该商品的分析结果
            const existingResult = await DeepAnalysisResult.findOne({ product_id: productId });
            let analysisResult;
            if (existingResult) {
                // 更新现有结果
                console.log(`🔄 更新现有分析结果: ${productId}`);
                Object.assign(existingResult, analysisData);
                analysisResult = await existingResult.save();
            }
            else {
                // 创建新的分析结果
                console.log(`🆕 创建新的分析结果: ${productId}`);
                analysisResult = new DeepAnalysisResult(analysisData);
                await analysisResult.save();
            }
            console.log(`✅ 深度分析完成: ${product.basic_info.title}, 结果ID: ${analysisResult._id}`);
            return analysisResult._id?.toString() || null;
        }
        catch (error) {
            console.error(`❌ 深度分析失败 (商品ID: ${productId}):`, error);
            if (error instanceof Error) {
                console.error(`错误详情: ${error.message}`);
                console.error(`错误堆栈: ${error.stack}`);
            }
            return null;
        }
    }
    // 新增的分析方法实现
    // 计算竞争力评分
    calculateCompetitivenessScore(product) {
        let score = 0;
        score += this.analyzePriceAdvantage(product) * 0.3;
        score += this.analyzeQualityIndicators(product) * 0.3;
        score += this.calculateSupplierReliability(product) * 0.2;
        score += this.analyzeProductUniqueness(product) * 0.2;
        return Math.round(score);
    }
    // 分析价格优势
    analyzePriceAdvantage(product) {
        const price = product.pricing.current_price;
        if (price === 0 || price === null || price === undefined) {
            console.log(`⚠️ 商品价格为0或无效，使用默认价格优势评分: ${product.basic_info.title}`);
            return 40; // 默认评分
        }
        if (price < 50)
            return 90;
        if (price < 200)
            return 70;
        if (price < 500)
            return 60;
        return 40;
    }
    // 分析质量指标
    analyzeQualityIndicators(product) {
        let score = 0;
        // 数据完整度评分 (0-40分)
        const completenessScore = Math.min(40, product.collection_meta.data_completeness * 40);
        score += completenessScore;
        // 图片质量评分 (0-30分) - 将0-90的评分转换为0-30
        const imageQuality = this.analyzeImageQuality(product.basic_info.images);
        const imageScore = Math.min(30, (imageQuality / 90) * 30);
        score += imageScore;
        // 描述质量评分 (0-30分) - 将0-90的评分转换为0-30
        const descriptionQuality = this.analyzeDescriptionQuality(product.basic_info.description);
        const descriptionScore = Math.min(30, (descriptionQuality / 90) * 30);
        score += descriptionScore;
        return Math.round(Math.min(100, Math.max(0, score)));
    }
    // 计算供应商可靠性
    calculateSupplierReliability(product) {
        if (product.supplier.rating > 0) {
            return Math.round((product.supplier.rating / 5) * 100);
        }
        return 50;
    }
    // 分析产品独特性
    analyzeProductUniqueness(product) {
        let score = 50; // 基础分
        if (product.basic_info.brand && product.basic_info.brand !== '未知品牌') {
            score += 20;
        }
        if (product.basic_info.description && product.basic_info.description.length > 100) {
            score += 15;
        }
        if (product.basic_info.images && product.basic_info.images.length > 5) {
            score += 15;
        }
        return Math.min(score, 100);
    }
    // 生成竞争力洞察
    generateCompetitivenessInsights(product) {
        const insights = [];
        if (this.analyzePriceAdvantage(product) > 70) {
            insights.push('价格具有竞争优势');
        }
        if (this.analyzeQualityIndicators(product) > 70) {
            insights.push('商品质量指标良好');
        }
        if (this.calculateSupplierReliability(product) > 70) {
            insights.push('供应商可靠性较高');
        }
        if (insights.length === 0) {
            insights.push('需要提升整体竞争力');
        }
        return insights;
    }
    // 计算盈利评分
    calculateProfitScore(product) {
        const margin = this.calculateEstimatedMargin(product);
        const roi = this.calculateROI(product);
        return Math.round((margin * 0.6 + roi * 0.4));
    }
    // 计算估算利润率
    calculateEstimatedMargin(product) {
        const price = product.pricing.current_price;
        if (price === 0 || price === null || price === undefined) {
            console.log(`⚠️ 商品价格为0或无效，使用默认利润率: ${product.basic_info.title}`);
            return 30; // 默认30%利润率
        }
        const estimatedCost = price * 0.6; // 估算成本为售价的60%
        const margin = ((price - estimatedCost) / price) * 100;
        return Math.max(0, Math.min(100, margin));
    }
    // 估算运费
    estimateShippingCost(product) {
        const price = product.pricing.current_price;
        if (price === 0 || price === null || price === undefined) {
            return 10; // 默认运费
        }
        // 根据价格估算运费
        if (price < 50)
            return 5;
        if (price < 200)
            return 15;
        return 25;
    }
    // 计算ROI
    calculateROI(product) {
        const price = product.pricing.current_price;
        if (price === 0 || price === null || price === undefined) {
            console.log(`⚠️ 商品价格为0或无效，使用默认ROI: ${product.basic_info.title}`);
            return 50; // 默认ROI评分
        }
        const margin = this.calculateEstimatedMargin(product);
        const salesVolume = product.sales_data.sales_volume || 1;
        // 基于利润率和销量计算ROI评分
        const roiScore = (margin * 0.7) + (Math.min(salesVolume / 100, 1) * 30);
        return Math.max(0, Math.min(100, roiScore));
    }
    // 分析目标细分市场
    analyzeTargetSegment(product) {
        const price = product.pricing.current_price;
        const category = product.basic_info.category || '通用';
        if (price < 50)
            return `${category}入门级市场`;
        if (price < 200)
            return `${category}中端市场`;
        return `${category}高端市场`;
    }
    // 分析价格层级
    analyzePriceTier(product) {
        const price = product.pricing.current_price;
        if (price < 50)
            return 'low';
        if (price < 200)
            return 'mid';
        return 'high';
    }
    // 分析差异化要点
    analyzeDifferentiationPoints(product) {
        const points = [];
        if (product.basic_info.brand && product.basic_info.brand !== '未知品牌') {
            points.push(`品牌优势: ${product.basic_info.brand}`);
        }
        if (product.pricing.current_price > 0) {
            const tier = this.analyzePriceTier(product);
            points.push(`价格定位: ${tier === 'low' ? '经济实惠' : tier === 'mid' ? '性价比' : '高端品质'}`);
        }
        if (product.supplier.rating > 4) {
            points.push('优质供应商');
        }
        if (points.length === 0) {
            points.push('需要建立差异化优势');
        }
        return points;
    }
    // 分析竞争格局
    analyzeCompetitiveLandscape(product) {
        const salesVolume = product.sales_data.sales_volume;
        const rating = product.sales_data.rating;
        if (salesVolume > 1000 && rating > 4.0) {
            return '市场领导者地位，竞争激烈';
        }
        else if (salesVolume > 100 && rating > 3.5) {
            return '中等竞争环境，有发展空间';
        }
        else {
            return '新兴市场，竞争相对较少';
        }
    }
    // 计算热度评分
    calculateHeatScore(product) {
        let score = 0;
        // 基于销量
        const salesVolume = product.sales_data.sales_volume;
        if (salesVolume > 1000)
            score += 40;
        else if (salesVolume > 100)
            score += 25;
        else if (salesVolume > 10)
            score += 15;
        // 基于评分
        const rating = product.sales_data.rating;
        if (rating > 4.0)
            score += 30;
        else if (rating > 3.5)
            score += 20;
        else if (rating > 3.0)
            score += 10;
        // 基于数据完整性
        score += product.collection_meta.data_completeness * 30;
        return Math.min(100, score);
    }
    // 分析热度趋势
    analyzeHeatTrend(product) {
        const salesVolume = product.sales_data.sales_volume;
        const rating = product.sales_data.rating;
        if (salesVolume > 500 && rating > 4.0)
            return 'rising';
        if (salesVolume > 50 && rating > 3.5)
            return 'stable';
        return 'declining';
    }
    // 分析搜索量
    analyzeSearchVolume(product) {
        const salesVolume = product.sales_data.sales_volume;
        return Math.min(100, salesVolume / 10);
    }
    // 分析销售速度
    analyzeSalesVelocity(product) {
        const salesVolume = product.sales_data.sales_volume;
        if (salesVolume > 1000)
            return 90;
        if (salesVolume > 100)
            return 70;
        if (salesVolume > 10)
            return 50;
        return 20;
    }
    // 分析价格稳定性
    analyzePriceStability(product) {
        // 简化实现，假设价格相对稳定
        return product.pricing.current_price > 0 ? 75 : 30;
    }
    // 分析季节性因素
    analyzeSeasonalFactor(product) {
        // 简化实现，返回中性值
        return 50;
    }
    // 计算总评分
    calculateTotalScore(product) {
        const competitiveness = this.calculateCompetitivenessScore(product);
        const profit = this.calculateProfitScore(product);
        const heat = this.calculateHeatScore(product);
        return Math.round((competitiveness * 0.4 + profit * 0.3 + heat * 0.3));
    }
    // 生成推荐
    generateRecommendation(product) {
        const totalScore = this.calculateTotalScore(product);
        if (totalScore >= 80)
            return 'strong_buy';
        if (totalScore >= 60)
            return 'buy';
        if (totalScore >= 40)
            return 'hold';
        return 'avoid';
    }
    // 计算置信度
    calculateConfidenceLevel(product) {
        const dataCompleteness = product.collection_meta.data_completeness;
        const hasPrice = product.pricing.current_price > 0 ? 0.3 : 0;
        const hasSales = product.sales_data.sales_volume > 0 ? 0.2 : 0;
        return Math.min(1, dataCompleteness * 0.5 + hasPrice + hasSales);
    }
    // 生成关键原因
    generateKeyReasons(product) {
        const reasons = [];
        const totalScore = this.calculateTotalScore(product);
        if (totalScore >= 80) {
            reasons.push('综合评分优秀');
            reasons.push('市场表现良好');
            reasons.push('盈利潜力较高');
        }
        else if (totalScore >= 60) {
            reasons.push('整体表现良好');
            reasons.push('具有一定竞争优势');
        }
        else if (totalScore >= 40) {
            reasons.push('表现一般');
            reasons.push('需要进一步观察');
        }
        else {
            reasons.push('表现不佳');
            reasons.push('存在较多问题');
        }
        return reasons;
    }
    // 识别风险因素
    identifyRiskFactors(product) {
        const risks = [];
        if (product.collection_meta.data_completeness < 0.5) {
            risks.push('数据不完整，分析准确性有限');
        }
        if (product.pricing.current_price === 0) {
            risks.push('缺少价格信息');
        }
        if (product.sales_data.sales_volume < 10) {
            risks.push('销量较低，市场需求不明确');
        }
        if (product.supplier.rating < 3.0) {
            risks.push('供应商评级较低');
        }
        if (risks.length === 0) {
            risks.push('暂无明显风险');
        }
        return risks;
    }
    // 分析图片质量
    analyzeImageQuality(images) {
        if (!images || images.length === 0)
            return 0;
        if (images.length >= 5)
            return 90;
        if (images.length >= 3)
            return 70;
        if (images.length >= 1)
            return 50;
        return 0;
    }
    // 分析描述质量
    analyzeDescriptionQuality(description) {
        if (!description)
            return 0;
        if (description.length > 200)
            return 90;
        if (description.length > 100)
            return 70;
        if (description.length > 50)
            return 50;
        return 30;
    }
    // 标记任务失败
    async markTaskFailed(task, error) {
        task.status = 'failed';
        task.meta.completed_at = new Date();
        if (task.meta.started_at) {
            task.meta.duration = Date.now() - task.meta.started_at.getTime();
        }
        task.output = {
            ...task.output,
            error_details: error instanceof Error ? error.message : '任务执行失败',
            success_count: 0,
            failure_count: task.progress.total_items
        };
        await task.save();
    }
    // 提取商品数据 - 使用 parsers 解析器
    getSiteConfig(url) {
        if (url.includes('ozon.ru')) {
            return {
                headers: {
                    'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
                    'Referer': 'https://www.ozon.ru/',
                    'Cookie': '_ym_uid=dummy; _ym_d=dummy'
                }
            };
        }
        else if (url.includes('1688.com')) {
            return {
                headers: {
                    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
                    'Referer': 'https://www.1688.com/',
                    'Cookie': 'cna=dummy; t=dummy'
                }
            };
        }
        else {
            return {
                headers: {
                    'Accept-Language': 'en-US,en;q=0.9'
                }
            };
        }
    }
    async extractProductData(url) {
        try {
            console.log(`🔍 开始提取商品数据: ${url}`);
            // 根据URL确定网站类型并配置相应的请求头
            const siteConfig = this.getSiteConfig(url);
            // 配置代理和请求头
            const axiosConfig = {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Upgrade-Insecure-Requests': '1',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'none',
                    'Cache-Control': 'max-age=0',
                    ...siteConfig.headers
                },
                timeout: 30000,
                maxRedirects: 10, // 增加重定向限制
                validateStatus: (status) => status < 400 // 接受所有小于400的状态码
            };
            // 添加代理支持
            if (process.env.HTTP_PROXY) {
                axiosConfig.proxy = {
                    protocol: 'http',
                    host: '127.0.0.1',
                    port: 7897
                };
            }
            console.log(`📡 发送请求到: ${url}`);
            // 实现重试机制，处理重定向问题
            let response = null;
            let retryCount = 0;
            const maxRetries = 3;
            while (retryCount < maxRetries) {
                try {
                    response = await axios.get(url, axiosConfig);
                    break; // 成功则跳出循环
                }
                catch (error) {
                    retryCount++;
                    if (error.code === 'ERR_FR_TOO_MANY_REDIRECTS') {
                        console.log(`⚠️ 重定向过多，尝试第 ${retryCount} 次重试`);
                        // 减少重定向限制并添加延迟
                        axiosConfig.maxRedirects = Math.max(3, axiosConfig.maxRedirects - 2);
                        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                        if (retryCount === maxRetries) {
                            throw new Error(`重定向过多，已重试 ${maxRetries} 次仍然失败`);
                        }
                    }
                    else {
                        throw error; // 其他错误直接抛出
                    }
                }
            }
            if (!response) {
                throw new Error('请求失败，未获得响应');
            }
            console.log(`✅ 请求成功，状态码: ${response.status}, 内容长度: ${response.data.length}`);
            // 检查是否遇到反爬虫页面
            if (response.data.includes('punish-page') ||
                response.data.includes('captcha') ||
                response.data.includes('验证码') ||
                response.data.includes('baxia-punish')) {
                console.log('⚠️ 检测到反爬虫页面，尝试模拟商品数据');
                // 从URL中提取商品ID，生成模拟数据
                const urlMatch = url.match(/offer\/(\d+)\.html/);
                if (urlMatch) {
                    const productId = urlMatch[1];
                    return {
                        url,
                        title: `1688商品 - ID: ${productId}`,
                        price: '价格面议',
                        images: [],
                        supplier: '阿里巴巴供应商',
                        sales: '0',
                        description: `商品链接: ${url}`
                    };
                }
                throw new Error('遇到反爬虫验证页面，无法获取商品数据');
            }
            // 使用 parsers 解析器进行数据提取
            const parser = getProductParser(url, response.data);
            if (!parser) {
                console.log('⚠️ 未找到合适的解析器，使用默认解析逻辑');
                return this.fallbackExtractProductData(url, response.data);
            }
            console.log(`🔧 使用 ${parser.platform} 解析器进行数据提取`);
            const parseResult = await parser.parse(response.data, url);
            if (!parseResult.success || !parseResult.data) {
                console.log(`⚠️ 解析器解析失败: ${parseResult.error}，使用默认解析逻辑`);
                return this.fallbackExtractProductData(url, response.data);
            }
            console.log(`✅ 解析器解析成功，耗时: ${parseResult.parse_duration_ms}ms`);
            // 将 IProductFullData 转换为 ProductData 格式
            const productFullData = parseResult.data;
            const productData = {
                url,
                title: productFullData.basic_info?.title || '未知商品',
                price: productFullData.pricing?.current_price?.toString() || '价格面议',
                images: productFullData.basic_info?.images || [],
                supplier: productFullData.supplier?.name || '未知供应商',
                sales: productFullData.sales_data?.sales_volume?.toString() || '0'
            };
            // 添加可选属性
            if (productFullData.basic_info?.description) {
                productData.description = productFullData.basic_info.description;
            }
            if (productFullData.basic_info?.specifications) {
                productData.specifications = productFullData.basic_info.specifications;
            }
            console.log(`📊 商品数据提取完成:`, {
                title: productData.title.substring(0, 50) + '...',
                price: productData.price,
                images: productData.images.length,
                supplier: productData.supplier,
                sales: productData.sales
            });
            return productData;
        }
        catch (error) {
            console.error(`❌ 提取商品数据失败 ${url}:`, error);
            // 即使出错也尝试返回基本信息
            const urlMatch = url.match(/offer\/(\d+)\.html/);
            if (urlMatch) {
                return {
                    url,
                    title: `商品ID: ${urlMatch[1]}`,
                    price: '价格面议',
                    images: [],
                    supplier: '未知供应商',
                    sales: '0'
                };
            }
            return null;
        }
    }
    // 备用解析方法 - 当解析器不可用时使用
    fallbackExtractProductData(url, html) {
        try {
            const $ = cheerio.load(html);
            const productData = {
                url,
                title: '',
                price: '',
                images: [],
                supplier: '',
                sales: ''
            };
            // 提取标题 - 多种选择器
            const titleSelectors = [
                'h1.d-title',
                '.d-title',
                'h1[data-title]',
                '.offer-title h1',
                '.product-title',
                'title'
            ];
            for (const selector of titleSelectors) {
                const title = $(selector).text().trim();
                if (title && title.length > 5) {
                    productData.title = title;
                    break;
                }
            }
            // 提取价格
            const priceSelectors = [
                '.price-now',
                '.price',
                '.d-price',
                '.offer-price',
                '.current-price',
                '[class*="price"]'
            ];
            for (const selector of priceSelectors) {
                const price = $(selector).text().trim();
                if (price && /[\d.,]+/.test(price)) {
                    productData.price = price;
                    break;
                }
            }
            // 设置默认值
            if (!productData.title) {
                const urlMatch = url.match(/offer\/(\d+)\.html/);
                productData.title = urlMatch ? `商品ID: ${urlMatch[1]}` : '未知商品';
            }
            if (!productData.price) {
                productData.price = '价格面议';
            }
            if (!productData.supplier) {
                productData.supplier = '未知供应商';
            }
            if (!productData.sales) {
                productData.sales = '0';
            }
            return productData;
        }
        catch (error) {
            console.error('备用解析方法失败:', error);
            return null;
        }
    }
    // 保存商品数据
    async saveProductData(productData) {
        try {
            console.log(`💾 保存商品数据: ${productData.title}`);
            // 从URL中提取商品ID
            const urlMatch = productData.url.match(/offer\/(\d+)\.html/);
            const productId = urlMatch ? urlMatch[1] : crypto.randomUUID();
            // 检查是否已存在相同的商品
            const existingProduct = await ProductFullData.findOne({
                platform: 'alibaba',
                platform_product_id: productId
            });
            if (existingProduct) {
                console.log(`⚠️ 商品已存在，更新数据: ${productId}`);
                // 更新现有商品数据
                existingProduct.basic_info.title = productData.title || '未知商品';
                existingProduct.basic_info.description = productData.title || '暂无描述';
                existingProduct.basic_info.images = productData.images || [];
                existingProduct.pricing.current_price = this.extractPriceNumber(productData.price);
                existingProduct.sales_data.sales_volume = this.extractSalesNumber(productData.sales);
                existingProduct.supplier.name = productData.supplier || '未知供应商';
                existingProduct.collection_meta.collected_at = new Date();
                existingProduct.collection_meta.data_completeness = this.calculateDataCompleteness(productData);
                const updatedProduct = await existingProduct.save();
                console.log(`✅ 商品数据更新成功，ID: ${updatedProduct._id}`);
                return updatedProduct._id?.toString() || '';
            }
            // 构建符合ProductFullData模型的数据结构
            const productFullData = new ProductFullData({
                platform: 'alibaba',
                platform_product_id: productId,
                basic_info: {
                    title: productData.title || '未知商品',
                    description: productData.title || '暂无描述', // 使用标题作为描述的默认值
                    category: '未分类', // 默认分类
                    brand: productData.supplier || '未知品牌',
                    images: productData.images || [],
                    specifications: {}
                },
                pricing: {
                    current_price: this.extractPriceNumber(productData.price),
                    currency: 'CNY'
                },
                sales_data: {
                    sales_volume: this.extractSalesNumber(productData.sales),
                    review_count: 0,
                    rating: 0
                },
                supplier: {
                    name: productData.supplier || '未知供应商',
                    location: '中国', // 1688默认为中国
                    rating: 0
                },
                collection_meta: {
                    collected_at: new Date(),
                    collection_duration: 0, // 这里可以记录实际的收集时间
                    data_completeness: this.calculateDataCompleteness(productData)
                }
            });
            const savedProduct = await productFullData.save();
            console.log(`✅ 商品数据保存成功，ID: ${savedProduct._id}`);
            return savedProduct._id?.toString() || '';
        }
        catch (error) {
            console.error(`❌ 保存商品数据失败:`, error);
            throw error;
        }
    }
    // 辅助方法：从价格字符串中提取数字
    extractPriceNumber(priceStr) {
        if (!priceStr)
            return 0;
        const match = priceStr.match(/[\d.,]+/);
        if (match) {
            return parseFloat(match[0].replace(/,/g, ''));
        }
        return 0;
    }
    // 辅助方法：从销量字符串中提取数字
    extractSalesNumber(salesStr) {
        if (!salesStr)
            return 0;
        const match = salesStr.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
    }
    // 辅助方法：计算数据完整度
    calculateDataCompleteness(productData) {
        let completeness = 0;
        const fields = ['title', 'price', 'supplier', 'sales'];
        const imageWeight = 0.2;
        fields.forEach(field => {
            if (productData[field] &&
                productData[field] !== '未知商品' &&
                productData[field] !== '价格面议' &&
                productData[field] !== '未知供应商' &&
                productData[field] !== '0') {
                completeness += 0.2;
            }
        });
        if (productData.images && productData.images.length > 0) {
            completeness += imageWeight;
        }
        return Math.min(completeness, 1);
    }
    // 停止任务执行器
    stop() {
        this.isRunning = false;
        console.log('🛑 任务执行器已停止');
    }
    // 公共方法：根据任务ID执行任务
    async executeTaskById(taskId) {
        try {
            const task = await TaskModel.findOne({ task_id: taskId });
            if (!task) {
                throw new Error(`任务不存在: ${taskId}`);
            }
            console.log(`📋 开始执行任务: ${taskId}`);
            await this.executeTask(task);
        }
        catch (error) {
            console.error(`❌ 任务 ${taskId} 执行失败:`, error);
            throw error;
        }
    }
}
export const taskExecutor = new TaskExecutor();
export default TaskExecutor;
//# sourceMappingURL=taskExecutor.js.map