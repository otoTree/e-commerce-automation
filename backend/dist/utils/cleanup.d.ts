declare const CLEANUP_CONFIG: {
    interval: number;
    taskExpiryTime: number;
    analysisExpiryTime: number;
    enabled: boolean;
};
interface CleanupStats {
    timestamp: Date;
    expiredTasks: number;
    expiredAnalyses: number;
    totalCleaned: number;
    duration: number;
    errors: string[];
}
/**
 * 清理过期任务
 */
declare const cleanupExpiredTasks: () => Promise<number>;
/**
 * 清理过期分析结果
 */
declare const cleanupExpiredAnalyses: () => Promise<number>;
/**
 * 清理临时文件和缓存
 */
declare const cleanupTempData: () => Promise<number>;
/**
 * 执行完整的清理任务
 */
declare const performCleanup: () => Promise<CleanupStats>;
/**
 * 启动清理任务
 */
export declare const startCleanupTask: () => void;
/**
 * 停止清理任务
 */
export declare const stopCleanupTask: () => void;
/**
 * 手动执行清理任务
 */
export declare const runCleanupNow: () => Promise<CleanupStats>;
/**
 * 获取清理任务状态
 */
export declare const getCleanupStatus: () => {
    enabled: boolean;
    running: boolean;
    interval: number;
    lastRun: CleanupStats | null;
    config: {
        interval: number;
        taskExpiryTime: number;
        analysisExpiryTime: number;
        enabled: boolean;
    };
};
/**
 * 更新清理配置
 */
export declare const updateCleanupConfig: (newConfig: Partial<typeof CLEANUP_CONFIG>) => void;
export { CLEANUP_CONFIG, performCleanup, cleanupExpiredTasks, cleanupExpiredAnalyses, cleanupTempData };
declare const _default: {
    startCleanupTask: () => void;
    stopCleanupTask: () => void;
    runCleanupNow: () => Promise<CleanupStats>;
    getCleanupStatus: () => {
        enabled: boolean;
        running: boolean;
        interval: number;
        lastRun: CleanupStats | null;
        config: {
            interval: number;
            taskExpiryTime: number;
            analysisExpiryTime: number;
            enabled: boolean;
        };
    };
    updateCleanupConfig: (newConfig: Partial<typeof CLEANUP_CONFIG>) => void;
};
export default _default;
//# sourceMappingURL=cleanup.d.ts.map