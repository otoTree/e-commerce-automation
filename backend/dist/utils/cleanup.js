import { TaskModel } from '../models/index.js';
import { dbUtils } from '../config/database.js';
// 清理配置
const CLEANUP_CONFIG = {
    // 清理间隔（毫秒）- 默认每小时执行一次
    interval: parseInt(process.env.CLEANUP_INTERVAL || '3600000'),
    // 任务过期时间（毫秒）- 默认7天
    taskExpiryTime: parseInt(process.env.TASK_EXPIRY_TIME || '604800000'),
    // 分析结果过期时间（毫秒）- 默认30天
    analysisExpiryTime: parseInt(process.env.ANALYSIS_EXPIRY_TIME || '2592000000'),
    // 是否启用清理任务
    enabled: process.env.CLEANUP_ENABLED !== 'false'
};
// 清理任务状态
let cleanupInterval = null;
let isCleanupRunning = false;
let lastCleanupStats = null;
/**
 * 清理过期任务
 */
const cleanupExpiredTasks = async () => {
    try {
        const expiryDate = new Date(Date.now() - CLEANUP_CONFIG.taskExpiryTime);
        // 清理已完成且过期的任务
        const result = await TaskModel.deleteMany({
            status: { $in: ['completed', 'failed'] },
            updated_at: { $lt: expiryDate }
        });
        console.log(`🧹 清理了 ${result.deletedCount} 个过期任务`);
        return result.deletedCount || 0;
    }
    catch (error) {
        console.error('❌ 清理过期任务失败:', error);
        throw error;
    }
};
/**
 * 清理过期分析结果
 */
const cleanupExpiredAnalyses = async () => {
    try {
        const expiryDate = new Date(Date.now() - CLEANUP_CONFIG.analysisExpiryTime);
        // 使用数据库工具清理过期分析结果
        const deletedCount = await dbUtils.cleanupExpiredData('deepanalysisresults', 'analysis_meta.analyzed_at', expiryDate);
        console.log(`🧹 清理了 ${deletedCount} 个过期分析结果`);
        return deletedCount;
    }
    catch (error) {
        console.error('❌ 清理过期分析结果失败:', error);
        throw error;
    }
};
/**
 * 清理临时文件和缓存
 */
const cleanupTempData = async () => {
    try {
        // 这里可以添加清理临时文件、缓存等逻辑
        // 目前返回0，表示没有清理任何临时数据
        return 0;
    }
    catch (error) {
        console.error('❌ 清理临时数据失败:', error);
        throw error;
    }
};
/**
 * 执行完整的清理任务
 */
const performCleanup = async () => {
    const startTime = Date.now();
    const stats = {
        timestamp: new Date(),
        expiredTasks: 0,
        expiredAnalyses: 0,
        totalCleaned: 0,
        duration: 0,
        errors: []
    };
    if (isCleanupRunning) {
        console.log('⏳ 清理任务正在运行中，跳过本次执行');
        return stats;
    }
    isCleanupRunning = true;
    try {
        console.log('🧹 开始执行清理任务...');
        // 清理过期任务
        try {
            stats.expiredTasks = await cleanupExpiredTasks();
        }
        catch (error) {
            const errorMsg = `清理过期任务失败: ${error instanceof Error ? error.message : '未知错误'}`;
            stats.errors.push(errorMsg);
        }
        // 清理过期分析结果
        try {
            stats.expiredAnalyses = await cleanupExpiredAnalyses();
        }
        catch (error) {
            const errorMsg = `清理过期分析结果失败: ${error instanceof Error ? error.message : '未知错误'}`;
            stats.errors.push(errorMsg);
        }
        // 清理临时数据
        try {
            await cleanupTempData();
        }
        catch (error) {
            const errorMsg = `清理临时数据失败: ${error instanceof Error ? error.message : '未知错误'}`;
            stats.errors.push(errorMsg);
        }
        stats.totalCleaned = stats.expiredTasks + stats.expiredAnalyses;
        stats.duration = Date.now() - startTime;
        console.log(`✅ 清理任务完成，总共清理了 ${stats.totalCleaned} 条记录，耗时 ${stats.duration}ms`);
        if (stats.errors.length > 0) {
            console.warn('⚠️ 清理过程中出现错误:', stats.errors);
        }
    }
    catch (error) {
        const errorMsg = `清理任务执行失败: ${error instanceof Error ? error.message : '未知错误'}`;
        stats.errors.push(errorMsg);
        console.error('❌', errorMsg);
    }
    finally {
        isCleanupRunning = false;
        lastCleanupStats = stats;
    }
    return stats;
};
/**
 * 启动清理任务
 */
export const startCleanupTask = () => {
    if (!CLEANUP_CONFIG.enabled) {
        console.log('🚫 清理任务已禁用');
        return;
    }
    if (cleanupInterval) {
        console.log('⚠️ 清理任务已在运行中');
        return;
    }
    console.log(`🚀 启动清理任务，间隔: ${CLEANUP_CONFIG.interval}ms`);
    // 立即执行一次清理
    performCleanup().catch(error => {
        console.error('❌ 初始清理任务失败:', error);
    });
    // 设置定时清理
    cleanupInterval = setInterval(() => {
        performCleanup().catch(error => {
            console.error('❌ 定时清理任务失败:', error);
        });
    }, CLEANUP_CONFIG.interval);
    // 进程退出时清理定时器
    process.on('SIGINT', stopCleanupTask);
    process.on('SIGTERM', stopCleanupTask);
};
/**
 * 停止清理任务
 */
export const stopCleanupTask = () => {
    if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
        console.log('🛑 清理任务已停止');
    }
};
/**
 * 手动执行清理任务
 */
export const runCleanupNow = async () => {
    console.log('🔧 手动执行清理任务');
    return await performCleanup();
};
/**
 * 获取清理任务状态
 */
export const getCleanupStatus = () => {
    return {
        enabled: CLEANUP_CONFIG.enabled,
        running: isCleanupRunning,
        interval: CLEANUP_CONFIG.interval,
        lastRun: lastCleanupStats,
        config: CLEANUP_CONFIG
    };
};
/**
 * 更新清理配置
 */
export const updateCleanupConfig = (newConfig) => {
    Object.assign(CLEANUP_CONFIG, newConfig);
    // 如果间隔时间改变，重启清理任务
    if (newConfig.interval && cleanupInterval) {
        stopCleanupTask();
        startCleanupTask();
    }
    console.log('🔧 清理配置已更新:', CLEANUP_CONFIG);
};
// 导出清理相关函数和配置
export { CLEANUP_CONFIG, performCleanup, cleanupExpiredTasks, cleanupExpiredAnalyses, cleanupTempData };
export default {
    startCleanupTask,
    stopCleanupTask,
    runCleanupNow,
    getCleanupStatus,
    updateCleanupConfig
};
//# sourceMappingURL=cleanup.js.map