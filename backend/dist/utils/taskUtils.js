import { randomBytes } from 'crypto';
/**
 * 生成唯一的任务ID
 */
export const generateTaskId = () => {
    const timestamp = Date.now().toString(36);
    const randomPart = randomBytes(6).toString('hex');
    return `task_${timestamp}_${randomPart}`;
};
/**
 * 验证任务ID格式
 */
export const isValidTaskId = (taskId) => {
    return /^task_[a-z0-9]+_[a-f0-9]{12}$/.test(taskId);
};
/**
 * 从任务ID中提取时间戳
 */
export const extractTimestampFromTaskId = (taskId) => {
    try {
        const parts = taskId.split('_');
        if (parts.length >= 2 && parts[1]) {
            return parseInt(parts[1], 36);
        }
        return null;
    }
    catch {
        return null;
    }
};
/**
 * 计算任务执行时长（毫秒）
 */
export const calculateTaskDuration = (startTime, endTime) => {
    const end = endTime || new Date();
    return end.getTime() - startTime.getTime();
};
/**
 * 格式化任务执行时长为可读字符串
 */
export const formatDuration = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
        return `${hours}小时${minutes % 60}分钟${seconds % 60}秒`;
    }
    else if (minutes > 0) {
        return `${minutes}分钟${seconds % 60}秒`;
    }
    else {
        return `${seconds}秒`;
    }
};
//# sourceMappingURL=taskUtils.js.map