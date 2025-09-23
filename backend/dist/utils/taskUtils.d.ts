/**
 * 生成唯一的任务ID
 */
export declare const generateTaskId: () => string;
/**
 * 验证任务ID格式
 */
export declare const isValidTaskId: (taskId: string) => boolean;
/**
 * 从任务ID中提取时间戳
 */
export declare const extractTimestampFromTaskId: (taskId: string) => number | null;
/**
 * 计算任务执行时长（毫秒）
 */
export declare const calculateTaskDuration: (startTime: Date, endTime?: Date) => number;
/**
 * 格式化任务执行时长为可读字符串
 */
export declare const formatDuration: (milliseconds: number) => string;
//# sourceMappingURL=taskUtils.d.ts.map