import { Router } from 'express';
import type { Request, Response } from 'express';
import extensionRoutes from './extension.js';
import taskRoutes from './tasks.js';
import productRoutes from './products.js';
import { extensionService } from '../services/extensionService.js';

const router = Router();

// 基础路由
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'E-commerce AI Backend API is running!' });
});

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 获取已注册扩展列表
router.get('/extensions', (req: Request, res: Response) => {
  const extensions = extensionService.getAllExtensions();
  res.json({ extensions });
});

// 挂载子路由
router.use('/extension', extensionRoutes);
router.use('/tasks', taskRoutes);
router.use('/products', productRoutes);

export default router;