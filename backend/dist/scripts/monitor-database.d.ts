#!/usr/bin/env node
interface SlowQuery {
    ts: Date;
    t: {
        $date: string;
    };
    s: string;
    c: string;
    id: number;
    ctx: string;
    msg: string;
    attr: {
        type: string;
        ns: string;
        command: any;
        planSummary?: string;
        keysExamined?: number;
        docsExamined?: number;
        cursorExhausted?: boolean;
        numYields?: number;
        nreturned?: number;
        reslen?: number;
        locks?: any;
        protocol?: string;
        durationMillis: number;
    };
}
declare class DatabaseMonitor {
    private db;
    private monitoringInterval;
    private slowQueryThreshold;
    constructor();
    /**
     * 获取数据库服务器状态
     */
    getServerStatus(): Promise<any>;
    /**
     * 获取数据库统计信息
     */
    getDatabaseStats(): Promise<any>;
    /**
     * 获取集合统计信息
     */
    getCollectionStats(): Promise<Record<string, any>>;
    /**
     * 获取当前操作信息
     */
    getCurrentOperations(): Promise<any[]>;
    /**
     * 分析慢查询
     */
    analyzeSlowQueries(): Promise<SlowQuery[]>;
    /**
     * 格式化字节大小
     */
    private formatBytes;
    /**
     * 格式化数字
     */
    private formatNumber;
    /**
     * 生成性能报告
     */
    generatePerformanceReport(): Promise<void>;
    /**
     * 开始监控
     */
    startMonitoring(intervalMinutes?: number): void;
    /**
     * 停止监控
     */
    stopMonitoring(): void;
}
export { DatabaseMonitor };
//# sourceMappingURL=monitor-database.d.ts.map