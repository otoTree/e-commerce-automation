# 开发指南

## 开发环境设置

### 前置要求
- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (本地或云端)
- Git

### 网络代理配置 (国内开发者)
```bash
export https_proxy=http://127.0.0.1:7897
export http_proxy=http://127.0.0.1:7897
export all_proxy=socks5://127.0.0.1:7897
```

### 项目初始化
```bash
# 克隆项目
git clone <repository-url>
cd e-commerce-ai

# 安装依赖
npm run install:all

# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env 文件，填入实际配置

# 启动开发服务器
npm run dev
```

## 开发规范

### 1. 函数式编程原则

#### 使用箭头函数
```javascript
// ✅ 推荐
const calculateTotal = (items) => items.reduce((sum, item) => sum + item.price, 0)

// ❌ 避免
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0)
}
```

#### 避免使用 class
```javascript
// ✅ 推荐 - 使用工厂函数
const createUserService = (database) => ({
  findById: (id) => database.users.findById(id),
  create: (userData) => database.users.create(userData),
  update: (id, data) => database.users.update(id, data)
})

// ❌ 避免 - 使用 class
class UserService {
  constructor(database) {
    this.database = database
  }
  
  findById(id) {
    return this.database.users.findById(id)
  }
}
```

#### 数据不可变性
```javascript
// ✅ 推荐 - 使用展开运算符
const updateProduct = (product, updates) => ({
  ...product,
  ...updates,
  updatedAt: new Date()
})

// ❌ 避免 - 直接修改对象
const updateProduct = (product, updates) => {
  product.name = updates.name
  product.updatedAt = new Date()
  return product
}
```

### 2. 领域驱动设计 (DDD)

#### 目录结构
```
backend/src/
├── domains/           # 领域层
│   ├── user/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── services/
│   └── product/
├── infrastructure/    # 基础设施层
├── application/       # 应用层
└── interfaces/        # 接口层
```

#### 实体设计
```javascript
// domains/product/entities/Product.js
const createProduct = ({
  id,
  title,
  price,
  description,
  images = [],
  specifications = {}
}) => {
  // 验证必要字段
  if (!title || !price) {
    throw new Error('Title and price are required')
  }

  return Object.freeze({
    id,
    title,
    price,
    description,
    images,
    specifications,
    // 领域方法
    calculateDiscountPrice: (discountRate) => price * (1 - discountRate),
    isExpensive: () => price > 1000,
    hasImages: () => images.length > 0
  })
}
```

#### 仓储模式
```javascript
// domains/product/repositories/ProductRepository.js
const createProductRepository = (database) => ({
  findById: async (id) => {
    const data = await database.products.findById(id)
    return data ? createProduct(data) : null
  },
  
  save: async (product) => {
    return await database.products.save(product)
  },
  
  findByCategory: async (category) => {
    const data = await database.products.find({ category })
    return data.map(createProduct)
  }
})
```

### 3. 前端组件化开发

#### 组件结构
```javascript
// components/ProductCard/index.js
const ProductCard = ({ product, onAnalyze, className = '' }) => {
  const { title, price, image, platform } = product
  
  const handleAnalyze = () => {
    onAnalyze?.(product)
  }
  
  return (
    <div className={`product-card ${className}`}>
      <ProductImage src={image} alt={title} />
      <ProductInfo title={title} price={price} platform={platform} />
      <ProductActions onAnalyze={handleAnalyze} />
    </div>
  )
}

// 子组件
const ProductImage = ({ src, alt }) => (
  <div className="product-image">
    <img src={src} alt={alt} loading="lazy" />
  </div>
)

const ProductInfo = ({ title, price, platform }) => (
  <div className="product-info">
    <h3 className="product-title">{title}</h3>
    <p className="product-price">{price}</p>
    <span className="product-platform">{platform}</span>
  </div>
)

const ProductActions = ({ onAnalyze }) => (
  <div className="product-actions">
    <button onClick={onAnalyze} className="analyze-btn">
      分析商品
    </button>
  </div>
)
```

#### Hooks 使用
```javascript
// hooks/useProductAnalysis.js
const useProductAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const analyzeProduct = useCallback(async (productData) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      
      if (!response.ok) {
        throw new Error('Analysis failed')
      }
      
      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsAnalyzing(false)
    }
  }, [])
  
  return {
    isAnalyzing,
    result,
    error,
    analyzeProduct
  }
}
```

### 4. 状态管理 (Zustand)

#### Store 设计
```javascript
// stores/useAnalysisStore.js
const useAnalysisStore = create((set, get) => ({
  // 状态
  currentProduct: null,
  analysisResult: null,
  isAnalyzing: false,
  history: [],
  
  // 动作
  setCurrentProduct: (product) => set({ currentProduct: product }),
  
  analyzeProduct: async (productData) => {
    set({ isAnalyzing: true })
    
    try {
      const result = await analyzeProductAPI(productData)
      set(state => ({
        analysisResult: result,
        history: [...state.history, { product: productData, result, timestamp: Date.now() }]
      }))
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      set({ isAnalyzing: false })
    }
  },
  
  clearHistory: () => set({ history: [] }),
  
  // 选择器
  getRecentAnalysis: () => {
    const { history } = get()
    return history.slice(-5) // 最近5次分析
  }
}))
```

### 5. API 设计规范

#### 路由结构
```javascript
// routes/productRoutes.js
const createProductRoutes = (dependencies) => {
  const { productService, validationMiddleware } = dependencies
  
  const routes = express.Router()
  
  // GET /api/products
  routes.get('/', async (req, res) => {
    try {
      const products = await productService.findAll(req.query)
      res.json({ success: true, data: products })
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  })
  
  // POST /api/products
  routes.post('/', 
    validationMiddleware(ProductSchema),
    async (req, res) => {
      try {
        const product = await productService.create(req.body)
        res.status(201).json({ success: true, data: product })
      } catch (error) {
        res.status(400).json({ success: false, error: error.message })
      }
    }
  )
  
  return routes
}
```

#### 错误处理
```javascript
// middleware/errorHandler.js
const createErrorHandler = () => (error, req, res, next) => {
  console.error('Error:', error)
  
  // Zod 验证错误
  if (error.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.errors
    })
  }
  
  // MongoDB 错误
  if (error.name === 'MongoError') {
    return res.status(500).json({
      success: false,
      error: 'Database error'
    })
  }
  
  // 默认错误
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
}
```

## 测试规范

### 单元测试
```javascript
// __tests__/utils/priceCalculator.test.js
import { calculateDiscount, formatPrice } from '../utils/priceCalculator'

describe('Price Calculator', () => {
  test('should calculate discount correctly', () => {
    expect(calculateDiscount(100, 0.2)).toBe(80)
    expect(calculateDiscount(50, 0.1)).toBe(45)
  })
  
  test('should format price with currency', () => {
    expect(formatPrice(100, 'USD')).toBe('$100.00')
    expect(formatPrice(50.5, 'CNY')).toBe('¥50.50')
  })
})
```

### 组件测试
```javascript
// __tests__/components/ProductCard.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ProductCard from '../components/ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    title: 'Test Product',
    price: 99.99,
    image: 'test.jpg',
    platform: 'test-platform'
  }
  
  test('should render product information', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('99.99')).toBeInTheDocument()
    expect(screen.getByText('test-platform')).toBeInTheDocument()
  })
  
  test('should call onAnalyze when button clicked', () => {
    const mockOnAnalyze = jest.fn()
    render(<ProductCard product={mockProduct} onAnalyze={mockOnAnalyze} />)
    
    fireEvent.click(screen.getByText('分析商品'))
    expect(mockOnAnalyze).toHaveBeenCalledWith(mockProduct)
  })
})
```

## Git 工作流

### 分支策略
- `main`: 生产环境分支
- `develop`: 开发环境分支
- `feature/*`: 功能开发分支
- `hotfix/*`: 紧急修复分支

### 提交规范
```
type(scope): description

feat(auth): add user login functionality
fix(api): resolve price calculation error
docs(readme): update installation guide
style(ui): improve button styling
refactor(utils): optimize price formatter
test(unit): add product service tests
```

### 代码审查清单
- [ ] 遵循函数式编程原则
- [ ] 避免使用 class
- [ ] 组件职责单一
- [ ] 错误处理完善
- [ ] 测试覆盖充分
- [ ] 文档更新及时

## 部署流程

### 开发环境
```bash
# 启动所有服务
npm run dev

# 单独启动前端
npm run dev:frontend

# 单独启动后端
npm run dev:backend
```

### 生产环境
```bash
# 构建项目
npm run build

# 启动生产服务
npm run start
```

### 浏览器插件开发
```bash
# 开发模式
1. 打开 Chrome 扩展管理页面
2. 启用开发者模式
3. 加载已解压的扩展程序
4. 选择 browser-extension 目录

# 发布模式
1. 压缩 browser-extension 目录
2. 上传到 Chrome Web Store
```

## 常见问题

### Q: 如何处理跨域问题？
A: 在后端配置 CORS 中间件，允许前端域名访问。

### Q: 如何优化插件性能？
A: 使用内容脚本懒加载，避免在所有页面注入重型脚本。

### Q: 如何调试浏览器插件？
A: 使用 Chrome DevTools 的扩展调试功能，查看 background 和 content script 的日志。

---

更多问题请参考项目 Wiki 或提交 Issue。