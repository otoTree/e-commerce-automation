import express from 'express';
import { config } from 'dotenv';
import { setupMiddleware, setupErrorHandling } from './middleware/index.js';
import apiRoutes from './routes/index.js';
import { startCleanupTask } from './utils/cleanup.js';
import { connectDB } from './config/database.js';
import './services/taskExecutor.js'; // 启动任务执行器

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Setup middleware
setupMiddleware(app);

// Setup routes
app.use('/api', apiRoutes);

// Setup error handling (must be after routes)
setupErrorHandling(app);

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start cleanup task for expired data
    startCleanupTask();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在端口 ${PORT}`);
      console.log(`📊 API健康检查: http://localhost:${PORT}/api/health`);
      console.log(`📡 数据收集API: http://localhost:${PORT}/api/data-collection`);
      console.log(`🔍 分析API: http://localhost:${PORT}/api/analysis`);
      console.log(`📋 任务监控API: http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 启动服务器
startServer();

export default app;