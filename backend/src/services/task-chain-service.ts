import { Task, ITask } from '../models/Task'
import { Search1688Result } from '../models/Search1688Result'

export interface TaskChainConfig {
  autoCreateBatchTask?: boolean
  batchTaskTitle?: string
  batchTaskDescription?: string
  batchTaskPriority?: 'low' | 'medium' | 'high'
  batchTaskTags?: string[]
  minProductCount?: number
}

export class TaskChainService {
  /**
   * 处理search_1688任务完成后的链接逻辑
   */
  static async handleSearch1688Completion(
    taskId: string, 
    searchResultId: string,
    config: TaskChainConfig = {}
  ): Promise<ITask | null> {
    try {
      // 获取搜索结果
      const searchResult = await Search1688Result.findById(searchResultId)
      if (!searchResult || !searchResult.searchData?.products) {
        console.log(`No valid search result found for ID: ${searchResultId}`)
        return null
      }

      const products = searchResult.searchData.products
      const minCount = config.minProductCount || 1

      // 检查产品数量是否满足最小要求
      if (products.length < minCount) {
        console.log(`Product count ${products.length} is below minimum ${minCount}`)
        return null
      }

      // 如果配置了自动创建批量任务
      if (config.autoCreateBatchTask !== false) {
        return await this.createBatchTaskFromSearchResult(searchResultId, config)
      }

      return null
    } catch (error) {
      console.error('Error in handleSearch1688Completion:', error)
      throw error
    }
  }

  /**
   * 从搜索结果创建批量任务
   */
  static async createBatchTaskFromSearchResult(
    searchResultId: string,
    config: TaskChainConfig = {}
  ): Promise<ITask> {
    const searchResult = await Search1688Result.findById(searchResultId)
    if (!searchResult) {
      throw new Error('Search result not found')
    }

    if (!searchResult.searchData?.products || searchResult.searchData.products.length === 0) {
      throw new Error('Search result has no products to extract')
    }

    // 提取所有产品链接
    const urls = searchResult.searchData.products.map(product => product.link)

    // 构建任务数据
    const taskData = {
      type: 'batch_url' as const,
      title: config.batchTaskTitle || `批量提取任务 - ${searchResult.searchData.keyword}`,
      description: config.batchTaskDescription || 
        `从搜索关键词"${searchResult.searchData.keyword}"的结果中提取${urls.length}个产品信息`,
      urls,
      priority: config.batchTaskPriority || 'medium',
      tags: [
        ...(config.batchTaskTags || []),
        'auto-created',
        'from-search',
        searchResult.searchData.keyword
      ],
      metadata: {
        sourceSearchResultId: searchResultId,
        sourceKeyword: searchResult.searchData.keyword,
        sourceUrl: searchResult.url,
        extractionTimestamp: searchResult.timestamp,
        autoCreated: true,
        createdBy: 'task-chain-service'
      },
      totalItems: urls.length
    }

    // 创建任务
    const task = new Task(taskData)
    await task.save()

    console.log(`Auto-created batch task ${task._id} with ${urls.length} URLs from search result ${searchResultId}`)
    
    return task
  }

  /**
   * 更新任务状态并触发链接逻辑
   */
  static async updateTaskWithChaining(
    taskId: string,
    updateData: Partial<ITask>,
    chainConfig?: TaskChainConfig
  ): Promise<{ task: ITask; chainedTask?: ITask }> {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
    if (!task) {
      throw new Error('Task not found')
    }

    let chainedTask: ITask | undefined

    // 如果是search_1688任务完成，触发链接逻辑
    if (
      task.type === 'search_1688' && 
      task.status === 'completed' && 
      task.result?.searchResultId &&
      chainConfig
    ) {
      try {
        const result = await this.handleSearch1688Completion(
          taskId,
          task.result.searchResultId,
          chainConfig
        )
        if (result) {
          chainedTask = result
        }
      } catch (error) {
        console.error('Error creating chained task:', error)
        // 不抛出错误，避免影响主任务的更新
      }
    }

    return { task, chainedTask }
  }

  /**
   * 获取任务链信息
   */
  static async getTaskChain(taskId: string): Promise<{
    originalTask: ITask | null
    chainedTasks: ITask[]
  }> {
    const originalTask = await Task.findById(taskId)
    if (!originalTask) {
      return { originalTask: null, chainedTasks: [] }
    }

    // 查找由此任务创建的链接任务
    const chainedTasks = await Task.find({
      'metadata.sourceSearchResultId': originalTask.result?.searchResultId,
      'metadata.autoCreated': true
    }).sort({ createdAt: 1 })

    return { originalTask, chainedTasks }
  }

  /**
   * 批量处理多个search_1688任务的链接
   */
  static async batchProcessTaskChains(
    taskIds: string[],
    config: TaskChainConfig = {}
  ): Promise<{
    processed: number
    created: number
    errors: Array<{ taskId: string; error: string }>
  }> {
    const results = {
      processed: 0,
      created: 0,
      errors: [] as Array<{ taskId: string; error: string }>
    }

    for (const taskId of taskIds) {
      try {
        const task = await Task.findById(taskId)
        if (!task) {
          results.errors.push({ taskId, error: 'Task not found' })
          continue
        }

        if (task.type !== 'search_1688' || task.status !== 'completed') {
          results.errors.push({ taskId, error: 'Task is not a completed search_1688 task' })
          continue
        }

        if (!task.result?.searchResultId) {
          results.errors.push({ taskId, error: 'Task has no search result ID' })
          continue
        }

        const chainedTask = await this.handleSearch1688Completion(
          taskId,
          task.result.searchResultId,
          config
        )

        results.processed++
        if (chainedTask) {
          results.created++
        }
      } catch (error) {
        results.errors.push({ 
          taskId, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        })
      }
    }

    return results
  }
}