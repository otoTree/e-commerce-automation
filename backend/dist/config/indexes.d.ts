/**
 * 创建数据库索引
 */
export declare function createIndexes(): Promise<void>;
/**
 * 删除所有索引（除了_id）
 */
export declare function dropIndexes(): Promise<void>;
/**
 * 重建所有索引
 */
export declare function rebuildIndexes(): Promise<void>;
/**
 * 获取索引统计信息
 */
export declare function getIndexStats(): Promise<Record<string, any>>;
/**
 * 性能优化建议
 */
export declare const performanceOptimizations: {
    connectionOptions: {
        maxPoolSize: number;
        serverSelectionTimeoutMS: number;
        socketTimeoutMS: number;
        bufferMaxEntries: number;
        bufferCommands: boolean;
    };
    queryOptimizations: string[];
    indexOptimizations: string[];
};
//# sourceMappingURL=indexes.d.ts.map