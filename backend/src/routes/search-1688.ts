import express from 'express'
import { z } from 'zod'
import { Search1688Result } from '../models/Search1688Result'
import { extractSearch1688Data } from '../models/search-1688-extractor'
import { Task } from '../models/Task'

const router = express.Router()

// 查询参数验证模式
const GetSearch1688QuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  keyword: z.string().optional(),
  sortBy: z.enum(['uploadedAt', 'keyword', 'totalCount']).optional().default('uploadedAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
})

// 创建搜索结果验证模式
const CreateSearch1688Schema = z.object({
  url: z.string().url('URL格式不正确'),
  htmlContent: z.string().min(1, 'HTML内容不能为空'),
  size: z.number().int().positive('页面大小必须为正整数').optional(),
  timestamp: z.string().datetime('时间戳格式不正确').optional()
})

// 获取1688搜索结果列表
router.get('/', async (req, res) => {
  try {
    // 验证查询参数
    const { page, limit, keyword, sortBy, sortOrder } = GetSearch1688QuerySchema.parse(req.query)
    
    // 构建查询条件
    const query: any = {
      searchData: { $ne: null }
    }
    
    // 关键词搜索
    if (keyword) {
      query['searchData.keyword'] = { $regex: keyword, $options: 'i' }
    }
    
    // 计算分页
    const skip = (page - 1) * limit
    
    // 构建排序条件
    const sort: any = {}
    if (sortBy === 'keyword') {
      sort['searchData.keyword'] = sortOrder === 'asc' ? 1 : -1
    } else if (sortBy === 'totalCount') {
      sort['searchData.totalCount'] = sortOrder === 'asc' ? 1 : -1
    } else {
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1
    }
    
    // 执行查询
    const [searchResults, total] = await Promise.all([
      Search1688Result.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Search1688Result.countDocuments(query)
    ])
    
    // 计算分页信息
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1
    
    return res.json({
      success: true,
      data: {
        searchResults,
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
    
    console.error('Error fetching 1688 search results:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取单个搜索结果详情
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证ID格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search result ID format'
      })
    }
    
    const searchResult = await Search1688Result.findById(id).select('-__v').lean()
    
    if (!searchResult) {
      return res.status(404).json({
        success: false,
        error: 'Search result not found'
      })
    }
    
    return res.json({
      success: true,
      data: searchResult
    })
  } catch (error) {
    console.error('Error fetching search result:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 创建新的搜索结果（提取并保存）
router.post('/', async (req, res) => {
  try {
    // 验证请求体
    const { url, htmlContent, size, timestamp } = CreateSearch1688Schema.parse(req.body)
    
    // 提取搜索数据
    const extractedData = extractSearch1688Data(htmlContent)
    
    // 创建搜索结果记录
    const searchResult = new Search1688Result({
      url,
      size: size || htmlContent.length,
      timestamp: timestamp || new Date().toISOString(),
      searchData: extractedData,
      extractionError: null
    })
    
    // 保存到数据库
    const savedResult = await searchResult.save()
    
    // 自动创建search_1688任务
    const task = new Task({
      type: 'search_1688',
      title: `1688搜索任务 - ${extractedData?.keyword || '未知关键词'}`,
      description: `从1688搜索结果自动创建的任务，包含${extractedData?.products?.length || 0}个产品`,
      status: 'completed',
      priority: 'medium',
      tags: ['auto-created', '1688', 'search'],
      metadata: {
         searchResultId: savedResult._id?.toString() || '',
         keyword: extractedData?.keyword,
         productCount: extractedData?.products?.length || 0,
         url: url
       },
      totalItems: extractedData?.products?.length || 0,
      completedItems: extractedData?.products?.length || 0,
      progress: 100,
      startedAt: new Date(),
      completedAt: new Date()
    })
    
    const savedTask = await task.save()
    
    return res.status(201).json({
      success: true,
      data: {
        searchResult: savedResult,
        task: savedTask
      },
      message: 'Search result and task created successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        details: error.issues
      })
    }
    
    console.error('Error creating search result:', error)
    
    // 如果是提取错误，保存错误信息
    if (req.body.url && req.body.htmlContent) {
      try {
        const errorResult = new Search1688Result({
          url: req.body.url,
          size: req.body.size || req.body.htmlContent.length,
          timestamp: req.body.timestamp || new Date().toISOString(),
          searchData: null,
          extractionError: error instanceof Error ? error.message : 'Unknown extraction error'
        })
        
        await errorResult.save()
        
        return res.status(422).json({
          success: false,
          error: 'Data extraction failed',
          details: error instanceof Error ? error.message : 'Unknown error',
          savedWithError: true
        })
      } catch (saveError) {
        console.error('Error saving extraction error:', saveError)
      }
    }
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 根据关键词获取搜索结果
router.get('/by-keyword/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params
    
    const searchResults = await Search1688Result.find({
      'searchData.keyword': { $regex: keyword, $options: 'i' }
    })
    .sort({ uploadedAt: -1 })
    .select('-__v')
    .lean()
    
    return res.json({
      success: true,
      data: searchResults
    })
  } catch (error) {
    console.error('Error fetching search results by keyword:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取搜索统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const [
      totalSearches,
      successfulExtractions,
      failedExtractions,
      uniqueKeywords,
      totalProducts
    ] = await Promise.all([
      Search1688Result.countDocuments(),
      Search1688Result.countDocuments({ searchData: { $ne: null } }),
      Search1688Result.countDocuments({ extractionError: { $ne: null } }),
      Search1688Result.distinct('searchData.keyword', { searchData: { $ne: null } }),
      Search1688Result.aggregate([
        { $match: { searchData: { $ne: null } } },
        { $group: { _id: null, totalProducts: { $sum: '$searchData.totalCount' } } }
      ])
    ])
    
    return res.json({
      success: true,
      data: {
        totalSearches,
        successfulExtractions,
        failedExtractions,
        uniqueKeywords: uniqueKeywords.length,
        totalProducts: totalProducts[0]?.totalProducts || 0,
        extractionSuccessRate: totalSearches > 0 ? (successfulExtractions / totalSearches * 100).toFixed(2) : 0
      }
    })
  } catch (error) {
    console.error('Error fetching search stats:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 重新提取搜索数据
router.put('/:id/re-extract', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证ID格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search result ID format'
      })
    }
    
    const searchResult = await Search1688Result.findById(id)
    
    if (!searchResult) {
      return res.status(404).json({
        success: false,
        error: 'Search result not found'
      })
    }
    
    // 需要HTML内容才能重新提取
    const { htmlContent } = req.body
    if (!htmlContent) {
      return res.status(400).json({
        success: false,
        error: 'HTML content is required for re-extraction'
      })
    }
    
    try {
      // 重新提取数据
      const extractedData = extractSearch1688Data(htmlContent)
      
      // 更新搜索结果
      searchResult.searchData = extractedData
      searchResult.extractionError = null
      
      const updatedResult = await searchResult.save()
      
      return res.json({
        success: true,
        data: updatedResult,
        message: 'Search data re-extracted successfully'
      })
    } catch (extractionError) {
      // 更新错误信息
      searchResult.extractionError = extractionError instanceof Error ? extractionError.message : 'Re-extraction failed'
      await searchResult.save()
      
      return res.status(422).json({
        success: false,
        error: 'Re-extraction failed',
        details: extractionError instanceof Error ? extractionError.message : 'Unknown error'
      })
    }
  } catch (error) {
    console.error('Error re-extracting search data:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 删除搜索结果
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证ID格式
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid search result ID format'
      })
    }
    
    const searchResult = await Search1688Result.findByIdAndDelete(id)
    
    if (!searchResult) {
      return res.status(404).json({
        success: false,
        error: 'Search result not found'
      })
    }
    
    return res.json({
      success: true,
      message: 'Search result deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting search result:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router