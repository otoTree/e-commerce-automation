import express from 'express'
import { z } from 'zod'
import { html5Email } from 'zod/v4/core/regexes.cjs'
import { 
  extractProductDataFromHTML, 
  validateExtractedData, 
  cleanExtractedData,
  ExtractedProductData 
} from '../models/product-extractor'
import { extractOzonProductData, OzonProductData } from '../models/ozon-extractor'
import { extractSearch1688Data, Search1688Result as Search1688Data } from '../models/search-1688-extractor'
import { 
  ExtractedProduct, 
  ExtractedProductSchema,
  CreateExtractedProductSchema 
} from '../models/ExtractedProduct'
import { 
  Search1688Result as Search1688Model,
  CreateSearch1688ResultSchema 
} from '../models/Search1688Result'
import { Task } from '../models/Task'

const router = express.Router()

// 页面HTML上传的验证模式
const UploadPageSchema = z.object({
  url: z.string().url('Invalid URL format'),
  html: z.string().min(1, 'HTML content is required'),
  title: z.string().optional(),
  timestamp: z.string().optional(),
  userAgent: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
})

// 上传网页HTML源码
router.post('/upload', async (req, res) => {
  try {
    // 验证请求数据
    const validatedData = UploadPageSchema.parse(req.body)
    
    // 处理HTML数据
    const pageData = {
      ...validatedData,
      timestamp: validatedData.timestamp || new Date().toISOString(),
      uploadedAt: new Date(),
      size: validatedData.html.length
    }
    
    // 这里可以添加HTML处理逻辑，比如：
    // 1. 保存到数据库
    // 2. 提取商品信息
    // 3. 分析页面内容
    // 4. 触发AI分析任务

    console.log('-')
    
    console.log(`Received HTML from ${pageData.url}, size: ${pageData.size} bytes`)
    console.log('-')
    
    // 尝试提取商品数据（1688和Ozon）
    let extractedProductData: ExtractedProductData | null = null
    let ozonProductData: OzonProductData | null = null
    let search1688Data: Search1688Data | null = null
    let extractionError: string | null = null
    
    try {
      // 检查是否为1688页面
      if (pageData.url.includes('1688.com')) {
        // 检查是否为搜索页面
        if (pageData.url.includes('/search/') || 
            pageData.url.includes('selloffer/offer_search') ||
            pageData.html.includes('search-result') || 
            pageData.html.includes('fui-paging') ||
            pageData.html.includes('window.data')) {
          console.log('检测到1688搜索页面，开始提取搜索数据...')
          
          // 提取搜索数据
          const searchData = extractSearch1688Data(pageData.html)
          
          if (searchData && searchData.products.length > 0) {
            search1688Data = searchData
            console.log('1688搜索数据提取成功:', {
              keyword: searchData.keyword,
              productCount: searchData.products.length,
              totalCount: searchData.totalCount,
              currentPage: searchData.pagination.currentPage,
              totalPages: searchData.pagination.totalPages
            })
          } else {
            extractionError = '无法从HTML中提取1688搜索数据或搜索结果为空'
            console.warn('1688搜索数据提取失败:', extractionError)
          }
        } 
        // 检查是否为商品页面
        else if (pageData.html.includes('window.context')) {
          console.log('检测到1688商品页面，开始提取商品数据...')
          
          // 提取商品数据
          const rawData = extractProductDataFromHTML(pageData.html)
          
          if (rawData) {
            // 验证数据完整性
            if (validateExtractedData(rawData)) {
              // 清理和标准化数据
              extractedProductData = cleanExtractedData(rawData)
              console.log('1688商品数据提取成功:', {
                productId: extractedProductData.productId,
                title: extractedProductData.title,
                variantsCount: extractedProductData.variants.length,
                protectionsCount: extractedProductData.protections.length
              })
            } else {
              extractionError = '提取的1688商品数据不完整'
              console.warn('1688商品数据验证失败:', extractionError)
            }
          } else {
            extractionError = '无法从HTML中提取1688商品数据'
            console.warn('1688商品数据提取失败:', extractionError)
          }
        } else {
          console.log('1688页面类型未识别，跳过数据提取')
        }
      } 
      // 检查是否为Ozon页面
      else if (pageData.url.includes('ozon.ru') || pageData.html.includes('ozon')) {
        console.log('检测到Ozon页面，开始提取商品数据...')
        
        // 提取Ozon商品数据
        const ozonData = extractOzonProductData(pageData.html)
        
        if (ozonData) {
          ozonProductData = ozonData
          console.log('Ozon商品数据提取成功:', {
            productId: ozonProductData.productId,
            title: ozonProductData.title,
            price: ozonProductData.price,
            rating: ozonProductData.rating
          })
        } else {
          extractionError = '无法从HTML中提取Ozon商品数据'
          console.warn('Ozon商品数据提取失败:', extractionError)
        }
      } else {
        console.log('非1688或Ozon页面，跳过商品数据提取')
      }
    } catch (error) {
      extractionError = error instanceof Error ? error.message : '商品数据提取过程中发生未知错误'
      console.error('商品数据提取异常:', error)
    }
    // 构建响应数据
    const responseData: any = {
      url: pageData.url,
      size: pageData.size,
      timestamp: pageData.timestamp,
      uploadedAt: pageData.uploadedAt,
      // 添加商品数据提取结果
      productData: extractedProductData ? {
        productId: extractedProductData.productId,
        title: extractedProductData.title,
        seller: extractedProductData.seller,
        price: extractedProductData.price,
        variants: extractedProductData.variants.map(variant => ({
          skuId: variant.skuId,
          color: variant.color,
          type: variant.type,
          weight: variant.weight,
          fullName: variant.fullName,
          dimensions: variant.dimensions,
          attributes: variant.attributes
        })),
        images: extractedProductData.images, // 新增图片数据
        shipping: extractedProductData.shipping,
        protections: extractedProductData.protections,
        description: extractedProductData.description, // 新增描述数据
        featureAttributes: extractedProductData.featureAttributes,
        metadata: extractedProductData.metadata
      } : null,
      // 添加Ozon商品数据
      ozonProductData: ozonProductData ? {
        productId: ozonProductData.productId,
        title: ozonProductData.title,
        price: ozonProductData.price,
        rating: ozonProductData.rating,
        images: ozonProductData.images,
        availability: ozonProductData.availability,
        promotions: ozonProductData.promotions,
        delivery: ozonProductData.delivery,
        attributes: ozonProductData.attributes,
        seller: ozonProductData.seller,
        metadata: ozonProductData.metadata
      } : null,
      // 添加搜索数据提取结果（仅用于响应，不保存到ExtractedProduct）
      search1688Data: search1688Data ? {
        keyword: search1688Data.keyword,
        products: search1688Data.products.map((product: any) => ({
          link: product.link
        })),
        pagination: search1688Data.pagination,
        totalCount: search1688Data.totalCount,
        dataSource: search1688Data.dataSource
      } : null,
      extractionError
    }
    //console.log(responseData.productData?.images)
    //console.log(responseData)

    // 如果成功提取商品数据，保存到MongoDB
    if ((extractedProductData || ozonProductData) && !extractionError) {
      try {
        // 准备要保存的数据（移除uploadedAt用于验证）
        const { uploadedAt, ...dataToValidate } = responseData
        
        // 跳过Zod验证，直接使用数据
        // const validatedData = CreateExtractedProductSchema.parse(dataToValidate)
        const validatedData = dataToValidate
        
        // 检查是否已存在相同的商品数据
        const productId = extractedProductData?.productId || ozonProductData?.productId
        const existingProduct = await ExtractedProduct.findOne({
          $or: [
            { 'productData.productId': productId },
            { 'ozonProductData.productId': productId }
          ],
          url: pageData.url
        })

        if (existingProduct) {
          console.log(`商品 ${productId} 已存在，更新数据...`)
          // 更新现有记录
          await ExtractedProduct.findByIdAndUpdate(
            existingProduct._id,
            { 
              ...validatedData,
              uploadedAt: new Date()
            },
            { new: true }
          )
        } else {
          console.log(`保存新商品数据到MongoDB: ${productId}`)
          // 创建新记录
          const newProduct = new ExtractedProduct({
            ...validatedData,
            uploadedAt: new Date()
          })
          await newProduct.save()
        }
        
        console.log('商品数据已成功保存到MongoDB')
      } catch (dbError) {
        console.error('保存商品数据到MongoDB失败:', dbError)
        console.error('错误详情:', JSON.stringify(dbError, null, 2))
        // 不影响主要响应，只记录错误
      }
    }

    // 如果成功提取1688搜索数据，保存到Search1688Result集合
    if (search1688Data && !extractionError) {
      try {
        // 准备搜索数据
        const search1688Document = {
          url: pageData.url,
          size: pageData.html.length,
          timestamp: pageData.timestamp || new Date().toISOString(),
          searchData: {
            keyword: search1688Data.keyword,
            products: search1688Data.products,
            pagination: search1688Data.pagination,
            totalCount: search1688Data.totalCount,
            dataSource: search1688Data.dataSource
          },
          extractionError: null
        }

        // 检查是否已存在相同的搜索数据
        const existingSearch = await Search1688Model.findOne({
          url: pageData.url,
          'searchData.keyword': search1688Data.keyword
        })

        if (existingSearch) {
          console.log(`搜索数据 ${search1688Data.keyword} 已存在，更新数据...`)
          // 更新现有记录
          await Search1688Model.findByIdAndUpdate(
            existingSearch._id,
            { 
              ...search1688Document,
              uploadedAt: new Date()
            },
            { new: true }
          )
        } else {
          console.log(`保存新搜索数据到MongoDB: ${search1688Data.keyword}`)
          // 创建新记录
          const newSearch = new Search1688Model({
            ...search1688Document,
            uploadedAt: new Date()
          })
          await newSearch.save()
        }
        
        console.log('1688搜索数据已成功保存到Search1688Result集合')
        
        // 自动创建batch_url任务
        try {
          // 提取产品链接
          const productUrls = search1688Data.products.map((product: any) => product.link).filter(Boolean)
          
          const task = new Task({
            type: 'batch_url',
            title: `批量URL任务 - ${search1688Data.keyword || '未知关键词'}`,
            description: `从1688搜索结果自动创建的批量URL任务，包含${productUrls.length}个产品链接`,
            status: 'pending',
            priority: 'medium',
            tags: ['auto-created', '1688', 'batch-url', 'page-upload'],
            urls: productUrls,
            metadata: {
              keyword: search1688Data.keyword,
              productCount: search1688Data.products.length,
              totalCount: search1688Data.totalCount,
              sourceUrl: pageData.url,
              dataSource: search1688Data.dataSource,
              pagination: search1688Data.pagination
            },
            totalItems: productUrls.length,
            completedItems: 0,
            progress: 0
          })
          
          const savedTask = await task.save()
          console.log('自动创建batch_url任务成功:', savedTask._id)
          
          // 将任务信息添加到响应数据中
          responseData.createdTask = {
            id: savedTask._id,
            type: savedTask.type,
            title: savedTask.title,
            status: savedTask.status,
            urlCount: productUrls.length
          }
        } catch (taskError) {
          console.error('创建batch_url任务失败:', taskError)
          // 不影响主要响应，只记录错误
        }
      } catch (dbError) {
        console.error('保存1688搜索数据到MongoDB失败:', dbError)
        console.error('错误详情:', JSON.stringify(dbError, null, 2))
        // 不影响主要响应，只记录错误
      }
    }

    // 简单的响应，后续可以扩展为实际的处理逻辑
    return res.status(200).json({
      success: true,
      message: (extractedProductData || ozonProductData || search1688Data)
        ? 'HTML uploaded and data extracted successfully' 
        : 'HTML uploaded successfully',
      data: responseData
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
    }
    
    console.error('Error uploading HTML:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取页面分析结果
router.get('/analysis/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    
    // 这里可以添加从数据库获取分析结果的逻辑
    
    return res.status(200).json({
      success: true,
      message: 'Analysis retrieved successfully',
      data: {
        url,
        analysis: 'Analysis results would be here'
      }
    })
  } catch (error) {
    console.error('Error retrieving analysis:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router