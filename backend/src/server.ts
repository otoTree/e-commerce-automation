import { startServer } from './app'

// 启动服务器
startServer().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})