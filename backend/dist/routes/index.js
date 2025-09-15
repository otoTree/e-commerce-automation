import { Router } from 'express';
import extensionRoutes from './extension.js';
import taskRoutes from './tasks.js';
import productRoutes from './products.js';
import { extensionService } from '../services/extensionService.js';
const router = Router();
// 基础路由
router.get('/', (req, res) => {
    res.json({ message: 'E-commerce AI Backend API is running!' });
});
router.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// 获取已注册扩展列表
router.get('/extensions', (req, res) => {
    const extensions = extensionService.getAllExtensions();
    res.json({ extensions });
});
// 挂载子路由
router.use('/extension', extensionRoutes);
router.use('/tasks', taskRoutes);
router.use('/products', productRoutes);
export default router;
//# sourceMappingURL=index.js.map