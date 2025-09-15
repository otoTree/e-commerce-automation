import { extensionService } from '../services/extensionService.js';
// 清理过期的扩展注册（超过5分钟未心跳）
export const startCleanupTask = () => {
    setInterval(() => {
        extensionService.cleanupExpiredExtensions();
    }, 60000); // 每分钟检查一次
};
//# sourceMappingURL=cleanup.js.map