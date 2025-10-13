import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import taskRoutes from './routes/tasks'
import pageRoutes from './routes/pages'
import productRoutes from './routes/products'
import search1688Routes from './routes/search-1688'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
// 增加请求体大小限制以支持大型HTML文件上传
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// 数据库连接
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce'
    await mongoose.connect(mongoURI)
    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

// 基础路由
app.get('/', (req, res) => {
  res.json({ message: 'E-commerce API is running!' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API 路由
app.use('/api/tasks', taskRoutes)
app.use('/api/pages', pageRoutes)
app.use('/api/products', productRoutes)
app.use('/api/search-1688', search1688Routes)

// 错误处理中间件
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 处理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// 启动服务器
const startServer = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default app
export { startServer }