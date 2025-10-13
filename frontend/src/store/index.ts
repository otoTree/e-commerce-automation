import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { ProductData, OzonProductData, PluginHealthStatus, ExtractedProduct, Task, TaskFilter, TaskStats } from '@/types/product'

// 统一后端 API 基础地址
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// 用户状态接口
interface User {
  id: string
  name: string
  email: string
}

// 用户状态管理
interface UserState {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User) => void
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'user-store',
    }
  )
)

// 产品数据状态管理
interface ProductState {
  products: ProductData[]
  loading: boolean
  error: string | null
  addProduct: (product: ProductData) => void
  removeProduct: (productId: string) => void
  clearProducts: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductState>()(
  devtools(
    (set, get) => ({
      products: [],
      loading: false,
      error: null,
      
      addProduct: (product: ProductData) => set((state) => ({
        products: [product, ...state.products.filter(p => p.productId !== product.productId)]
      })),
      
      removeProduct: (productId: string) => set((state) => ({
        products: state.products.filter(p => p.productId !== productId)
      })),
      
      clearProducts: () => set({ products: [] }),
      
      setLoading: (loading: boolean) => set({ loading }),
      
      setError: (error: string | null) => set({ error }),
      
      fetchProducts: async () => {
        set({ loading: true, error: null })
        try {
      const response = await fetch(`${API_BASE_URL}/api/products?limit=100`)
          const result = await response.json()
      
      if (result.success && result.data) {
        const extractedProducts = result.data.products || []
        
        // 转换数据格式，将所有数据统一为ProductData格式
        const products: ProductData[] = []
        
        extractedProducts.forEach((item: ExtractedProduct) => {
          // 处理1688数据
          if (item.productData) {
            products.push({
              productId: item.productData.productId,
              title: item.productData.title,
              seller: item.productData.seller,
              price: item.productData.price || '',
              variants: item.productData.variants || [],
              shipping: item.productData.shipping || {
                location: '',
                targetLocation: '',
                cost: 0,
                deliveryPromise: '',
                freeShipping: false
              },
              protections: item.productData.protections || [],
              images: item.productData.images || [],
              description: item.productData.description,
              featureAttributes: item.productData.featureAttributes,
              metadata: item.productData.metadata || {
                extractedAt: new Date(),
                source: 'html' as const,
                offerId: 0
              },
              source: '1688'
            })
          }
          
          // 处理Ozon数据，转换为ProductData格式
          if (item.ozonProductData) {
            const ozonData = item.ozonProductData
            
            // 将Ozon价格转换为字符串格式
            let priceString = ''
            if (ozonData.price?.current) {
              priceString = `${ozonData.price.current}`
              if (ozonData.price.currency) {
                priceString += ` ${ozonData.price.currency}`
              }
            }
            
            // 将Ozon图片转换为ProductImage格式
            const images = (ozonData.images || []).map(imageUrl => ({
              url: imageUrl,
              src: imageUrl,
              originalUrl: imageUrl,
              thumbnailUrl: imageUrl
            }))
            
            // 创建默认的variant（Ozon商品通常没有复杂的变体结构）
            const defaultVariant = {
              skuId: 1,
              color: '默认',
              type: '标准',
              weight: 0,
              fullName: ozonData.title,
              attributes: ozonData.attributes || {}
            }
            
            // 创建默认的shipping信息
            const shipping = {
              location: '俄罗斯',
              targetLocation: '中国',
              cost: 0,
              deliveryPromise: '标准配送',
              freeShipping: ozonData.delivery?.freeShipping || false
            }
            
            // 创建默认的protections
            const protections = []
            if (ozonData.promotions?.specialOffer) {
              protections.push({
                name: '特别优惠',
                description: ozonData.promotions.specialOffer,
                enabled: true
              })
            }
            
            products.push({
              productId: ozonData.productId,
              title: ozonData.title,
              seller: ozonData.seller || 'Ozon卖家',
              price: priceString,
              variants: [defaultVariant],
              shipping,
              protections,
              images,
              metadata: {
                extractedAt: ozonData.metadata?.extractedAt || new Date(),
                source: 'html' as const,
                offerId: parseInt(ozonData.productId) || 0
              },
              source: 'ozon',
              ozonData
            })
          }
        })
        
        set({ 
          products,
          loading: false 
        })
      } else {
        console.error('Failed to fetch products:', result.error)
        set({ loading: false, error: result.error || 'Failed to fetch products' })
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      set({ loading: false, error: error instanceof Error ? error.message : 'Failed to fetch products' })
    }
  },
    }),
    {
      name: 'product-store',
    }
  )
)

// 插件健康状态管理
interface PluginState {
  pluginStatus: PluginHealthStatus | null
  statusHistory: PluginHealthStatus[]
  isMonitoring: boolean
  lastUpdate: Date | null
  updatePluginStatus: (status: PluginHealthStatus) => void
  startMonitoring: () => void
  stopMonitoring: () => void
  clearHistory: () => void
}

export const usePluginStore = create<PluginState>()(
  devtools(
    (set, get) => ({
      pluginStatus: null,
      statusHistory: [],
      isMonitoring: false,
      lastUpdate: null,
      
      updatePluginStatus: (status) => set((state) => ({
        pluginStatus: status,
        statusHistory: [status, ...state.statusHistory.slice(0, 99)], // 保留最近100条记录
        lastUpdate: new Date()
      })),
      
      startMonitoring: () => {
        set({ isMonitoring: true })
        // 这里可以启动定时器或WebSocket连接来监控插件状态
        console.log('Started plugin monitoring')
      },
      
      stopMonitoring: () => {
        set({ isMonitoring: false })
        console.log('Stopped plugin monitoring')
      },
      
      clearHistory: () => set({ statusHistory: [] })
    }),
    {
      name: 'plugin-store',
    }
  )
)

// 购物车商品接口
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

// 购物车状态管理
interface CartState {
  items: CartItem[]
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  devtools(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const { items } = get()
        const existingItem = items.find((i) => i.id === item.id)
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({
            items: [...items, { ...item, quantity: 1 }],
          })
        }
        
        // 重新计算总价
        const newItems = get().items
        const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ total: newTotal })
      },
      removeItem: (id) => {
        const { items } = get()
        const newItems = items.filter((item) => item.id !== id)
        const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ items: newItems, total: newTotal })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        
        const { items } = get()
        const newItems = items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
        const newTotal = newItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        set({ items: newItems, total: newTotal })
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-store',
    }
  )
)

// 任务状态管理
interface TaskState {
  tasks: Task[]
  filteredTasks: Task[]
  currentFilter: TaskFilter
  stats: TaskStats
  isLoading: boolean
  error: string | null
  
  // 基本操作
  addTask: (task: Omit<Task, '_id' | 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'processedItems' | 'retryCount' | 'maxRetries'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  
  // 状态管理
  startTask: (id: string) => void
  completeTask: (id: string, result?: unknown) => void
  failTask: (id: string, errorMessage: string) => void
  updateProgress: (id: string, progress: number, processedItems?: number) => void
  
  // 批量操作
  bulkUpdateStatus: (ids: string[], status: Task['status']) => void
  bulkDelete: (ids: string[]) => void
  
  // 过滤和搜索
  setFilter: (filter: TaskFilter) => void
  clearFilter: () => void
  applyFilter: () => void
  
  // 数据获取
  fetchTasks: () => Promise<void>
  refreshStats: () => void
}

const generateTaskId = () => `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const calculateStats = (tasks: Task[]): TaskStats => {
  const total = tasks.length
  const pending = tasks.filter(t => t.status === 'pending').length
  const processing = tasks.filter(t => t.status === 'processing').length
  const completed = tasks.filter(t => t.status === 'completed').length
  const failed = tasks.filter(t => t.status === 'failed').length
  
  const completionRate = total > 0 ? (completed / total) * 100 : 0
  
  const completedTasks = tasks.filter(t => t.status === 'completed')
  const averageDuration = completedTasks.length > 0 
    ? completedTasks.reduce((sum, t) => {
        const duration = t.completedAt && t.startedAt 
          ? (t.completedAt.getTime() - t.startedAt.getTime()) / (1000 * 60) // 转换为分钟
          : 0
        return sum + duration
      }, 0) / completedTasks.length
    : 0
  
  return {
    total,
    pending,
    processing,
    completed,
    failed,
    completionRate,
    averageDuration
  }
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set, get) => ({
      tasks: [],
      filteredTasks: [],
      currentFilter: {},
      stats: {
        total: 0,
        pending: 0,
        processing: 0,
        completed: 0,
        failed: 0,
        completionRate: 0,
        averageDuration: 0
      },
      isLoading: false,
      error: null,
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: generateTaskId(),
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 0,
          processedItems: 0,
          retryCount: 0,
          maxRetries: 3,
          tags: taskData.tags || []
        }
        
        set((state) => {
          const newTasks = [newTask, ...state.tasks]
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks)
          }
        })
      },
      
      updateTask: (id, updates) => {
        set((state) => {
          const newTasks = state.tasks.map(task => 
            (task.id === id || task._id === id)
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          )
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks)
          }
        })
      },
      
      deleteTask: (id) => {
        set((state) => {
          const newTasks = state.tasks.filter(task => task.id !== id && task._id !== id)
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks)
          }
        })
      },
      
      startTask: (id) => {
        get().updateTask(id, {
          status: 'processing',
          startedAt: new Date(),
          progress: 0
        })
      },
      
      completeTask: (id, result) => {
        const task = get().tasks.find(t => t.id === id || t._id === id)
        const completedAt = new Date()
        
        get().updateTask(id, {
          status: 'completed',
          completedAt,
          progress: 100,
          result
        })
      },
      
      failTask: (id, errorMessage) => {
        get().updateTask(id, {
          status: 'failed',
          errorMessage,
          metadata: {
            ...get().tasks.find(t => t.id === id || t._id === id)?.metadata,
            errorMessage
          }
        })
      },
      
      updateProgress: (id, progress, processedItems) => {
        const updates: Partial<Task> = { progress }
        if (processedItems !== undefined) {
          updates.processedItems = processedItems
        }
        get().updateTask(id, updates)
      },
      
      bulkUpdateStatus: (ids, status) => {
        set((state) => {
          const newTasks = state.tasks.map(task => 
            ids.includes(task.id || task._id || '')
              ? { ...task, status, updatedAt: new Date() }
              : task
          )
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks)
          }
        })
      },
      
      bulkDelete: (ids) => {
        set((state) => {
          const newTasks = state.tasks.filter(task => 
            !ids.includes(task.id || task._id || '')
          )
          return {
            tasks: newTasks,
            stats: calculateStats(newTasks)
          }
        })
      },
      
      setFilter: (filter) => {
        set((state) => ({
          currentFilter: { ...state.currentFilter, ...filter }
        }))
        get().applyFilter()
      },
      
      clearFilter: () => {
        set({ currentFilter: {} })
        get().applyFilter()
      },
      
      applyFilter: () => {
        const { tasks, currentFilter } = get()
        let filtered = [...tasks]
        
        if (currentFilter.status) {
          filtered = filtered.filter(task => task.status === currentFilter.status)
        }
        
        if (currentFilter.priority) {
          filtered = filtered.filter(task => task.priority === currentFilter.priority)
        }
        
        if (currentFilter.type) {
          filtered = filtered.filter(task => task.type === currentFilter.type)
        }
        
        if (currentFilter.tags && currentFilter.tags.length > 0) {
          filtered = filtered.filter(task => 
            currentFilter.tags!.some(tag => task.tags.includes(tag))
          )
        }
        
        if (currentFilter.dateRange) {
          const { start, end } = currentFilter.dateRange
          filtered = filtered.filter(task => {
            const taskDate = task.createdAt
            return taskDate >= start && taskDate <= end
          })
        }
        
        set({ filteredTasks: filtered })
      },
      
      fetchTasks: async () => {
        set({ isLoading: true, error: null })
        try {
          // 暂时使用模拟数据
          const mockTasks: Task[] = [
            {
              id: 'task_1',
              title: '提取1688产品数据',
              description: '从1688平台提取指定产品的详细信息',
              status: 'completed',
              priority: 'high',
              type: 'url',
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
              completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
              progress: 100,
              processedItems: 1,
              retryCount: 0,
              maxRetries: 3,
              metadata: {
                url: 'https://detail.1688.com/offer/123456.html'
              },
              tags: ['1688', '产品提取']
            },
            {
              id: 'task_2',
              title: '插件健康检查',
              description: '检查浏览器插件运行状态',
              status: 'processing',
              priority: 'medium',
              type: 'keyword',
              createdAt: new Date(Date.now() - 30 * 60 * 1000),
              updatedAt: new Date(Date.now() - 5 * 60 * 1000),
              startedAt: new Date(Date.now() - 25 * 60 * 1000),
              progress: 65,
              processedItems: 13,
              retryCount: 0,
              maxRetries: 3,
              tags: ['插件', '监控']
            },
            {
              id: 'task_3',
              title: '数据清洗处理',
              description: '清洗和标准化产品数据',
              status: 'pending',
              priority: 'low',
              type: 'batch_url',
              createdAt: new Date(Date.now() - 10 * 60 * 1000),
              updatedAt: new Date(Date.now() - 10 * 60 * 1000),
              progress: 0,
              processedItems: 0,
              retryCount: 0,
              maxRetries: 3,
              tags: ['数据处理']
            }
          ]
          
          set({ 
            tasks: mockTasks,
            filteredTasks: mockTasks,
            stats: calculateStats(mockTasks),
            isLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : '获取任务列表失败',
            isLoading: false 
          })
        }
      },
      
      refreshStats: () => {
        const { tasks } = get()
        set({ stats: calculateStats(tasks) })
      }
    }),
    {
      name: 'task-store',
    }
  )
)