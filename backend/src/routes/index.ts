import { Router } from 'express';
import dataCollectionRoutes from './dataCollection.js';
import analysisRoutes from './analysis.js';
import taskMonitorRoutes from './taskMonitor.js';
import productManagementRoutes from './productManagement.js';
import productListingRoutes from './productListing.js';
import extensionManagementRoutes from './extensionManagement.js';

const router = Router();

// 挂载各模块路由（不需要API_PREFIX，因为在主应用中已经添加了/api前缀）
router.use('/data-collection', dataCollectionRoutes);
router.use('/analysis', analysisRoutes);
router.use('/tasks', taskMonitorRoutes);
router.use('/products', productManagementRoutes);
router.use('/listings', productListingRoutes);
router.use('/extension', extensionManagementRoutes);

// API健康检查端点
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce AI API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API根路径信息
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce AI API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      data_collection: '/api/data-collection',
      analysis: '/api/analysis',
      tasks: '/api/tasks',
      products: '/api/products',
      listings: '/api/listings',
      extension: '/api/extension'
    },
    documentation: 'https://github.com/your-repo/e-commerce-ai/docs'
  });
});

export default router;