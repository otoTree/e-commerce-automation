import express from 'express'
import { Task, CreateTaskSchema, UpdateTaskSchema, TaskType } from '../models/Task'
import { Search1688Result } from '../models/Search1688Result'
import { TaskChainService, TaskChainConfig } from '../services/task-chain-service'
import { z } from 'zod'

const router = express.Router()

// 创建任务
router.post('/', async (req, res) => {
  try {
    // 验证请求数据
    const validatedData = CreateTaskSchema.parse(req.body)
    
    // 根据任务类型设置totalItems
    let totalItems = 1
    if (validatedData.type === 'batch_url' && validatedData.urls) {
      totalItems = validatedData.urls.length
    } else if (validatedData.type === 'keyword' && validatedData.keywords) {
      totalItems = validatedData.keywords.length
    }
    
    // 创建任务
    const task = new Task({
      ...validatedData,
      totalItems,
    })
    
    await task.save()
    
    return res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
    }
    
    console.error('Error creating task:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取任务列表
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      priority,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query
    
    // 构建查询条件
    const filter: any = {}
    
    if (status) filter.status = status
    if (type) filter.type = type
    if (priority) filter.priority = priority
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags]
      filter.tags = { $in: tagArray }
    }
    
    // 构建排序条件
    const sort: any = {}
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1
    
    // 分页参数
    const pageNum = Math.max(1, parseInt(page as string))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string)))
    const skip = (pageNum - 1) * limitNum
    
    // 查询任务
    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Task.countDocuments(filter)
    ])
    
    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum)
        }
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取单个任务
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const task = await Task.findById(id)
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }
    
    return res.json({
      success: true,
      data: task
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 更新任务
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 验证请求数据
    const validatedData = UpdateTaskSchema.parse(req.body)
    
    const task = await Task.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    )
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }
    
    return res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
    }
    
    console.error('Error updating task:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 删除任务
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const task = await Task.findByIdAndDelete(id)
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }
    
    return res.json({
      success: true,
      message: 'Task deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 批量创建任务
router.post('/batch', async (req, res) => {
  try {
    const { tasks } = req.body
    
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Tasks array is required and cannot be empty'
      })
    }
    
    // 验证所有任务数据
    const validatedTasks = tasks.map(task => CreateTaskSchema.parse(task))
    
    // 为每个任务设置totalItems
    const tasksWithTotalItems = validatedTasks.map(task => {
      let totalItems = 1
      if (task.type === 'batch_url' && task.urls) {
        totalItems = task.urls.length
      } else if (task.type === 'keyword' && task.keywords) {
        totalItems = task.keywords.length
      }
      return { ...task, totalItems }
    })
    
    // 批量插入任务
    const createdTasks = await Task.insertMany(tasksWithTotalItems)
    
    return res.status(201).json({
      success: true,
      data: createdTasks,
      message: `${createdTasks.length} tasks created successfully`
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.issues
      })
    }
    
    console.error('Error creating batch tasks:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 更新任务状态（支持任务链接）
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { 
      status, 
      progress, 
      errorMessage, 
      result,
      // 任务链接配置
      autoCreateBatchTask = true,
      batchTaskTitle,
      batchTaskDescription,
      batchTaskPriority = 'medium',
      batchTaskTags = [],
      minProductCount = 1
    } = req.body
    
    const updateData: any = {}
    
    if (status) {
      updateData.status = status
      
      // 根据状态自动设置时间戳
      if (status === 'processing' && !updateData.startedAt) {
        updateData.startedAt = new Date()
      } else if (status === 'completed' || status === 'failed') {
        updateData.completedAt = new Date()
      }
    }
    
    if (typeof progress === 'number') updateData.progress = progress
    if (errorMessage) updateData.errorMessage = errorMessage
    if (result !== undefined) updateData.result = result
    
    // 构建任务链接配置
    const chainConfig: TaskChainConfig = {
      autoCreateBatchTask,
      batchTaskTitle,
      batchTaskDescription,
      batchTaskPriority,
      batchTaskTags,
      minProductCount
    }
    
    // 使用任务链接服务更新任务
    const { task, chainedTask } = await TaskChainService.updateTaskWithChaining(
      id,
      updateData,
      chainConfig
    )
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }
    
    const response: any = {
      success: true,
      data: task,
      message: 'Task status updated successfully'
    }
    
    // 如果创建了链接任务，包含在响应中
    if (chainedTask) {
      response.chainedTask = chainedTask
      response.message += ` and created chained batch task with ${chainedTask.totalItems} URLs`
    }
    
    return res.json(response)
  } catch (error) {
    console.error('Error updating task status:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取任务统计信息
router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])
    
    const typeStats = await Task.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ])
    
    const priorityStats = await Task.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ])
    
    res.json({
      success: true,
      data: {
        statusStats: stats,
        typeStats,
        priorityStats
      }
    })
  } catch (error) {
    console.error('Error fetching task stats:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 从搜索结果创建批量提取任务
router.post('/from-search-result/:searchResultId', async (req, res) => {
  try {
    const { searchResultId } = req.params
    const { title, description, priority = 'medium', tags = [] } = req.body

    // 使用任务链接服务创建批量任务
    const task = await TaskChainService.createBatchTaskFromSearchResult(searchResultId, {
      batchTaskTitle: title,
      batchTaskDescription: description,
      batchTaskPriority: priority,
      batchTaskTags: tags
    })

    return res.status(201).json({
      success: true,
      data: task,
      message: `Successfully created batch extraction task with ${task.totalItems} URLs from search result`
    })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Search result not found') {
        return res.status(404).json({
          success: false,
          error: 'Search result not found'
        })
      }
      if (error.message === 'Search result has no products to extract') {
        return res.status(400).json({
          success: false,
          error: 'Search result has no products to extract'
        })
      }
    }

    console.error('Error creating task from search result:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 获取任务链信息
router.get('/:id/chain', async (req, res) => {
  try {
    const { id } = req.params
    
    const chainInfo = await TaskChainService.getTaskChain(id)
    
    if (!chainInfo.originalTask) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      })
    }
    
    return res.json({
      success: true,
      data: chainInfo,
      message: 'Task chain information retrieved successfully'
    })
  } catch (error) {
    console.error('Error getting task chain:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// 批量处理任务链接
router.post('/batch-chain', async (req, res) => {
  try {
    const { 
      taskIds, 
      autoCreateBatchTask = true,
      batchTaskTitle,
      batchTaskDescription,
      batchTaskPriority = 'medium',
      batchTaskTags = [],
      minProductCount = 1
    } = req.body
    
    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'taskIds must be a non-empty array'
      })
    }
    
    const config: TaskChainConfig = {
      autoCreateBatchTask,
      batchTaskTitle,
      batchTaskDescription,
      batchTaskPriority,
      batchTaskTags,
      minProductCount
    }
    
    const results = await TaskChainService.batchProcessTaskChains(taskIds, config)
    
    return res.json({
      success: true,
      data: results,
      message: `Processed ${results.processed} tasks, created ${results.created} batch tasks`
    })
  } catch (error) {
    console.error('Error in batch chain processing:', error)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

export default router