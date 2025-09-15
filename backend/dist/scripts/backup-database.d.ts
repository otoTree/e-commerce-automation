#!/usr/bin/env node
/**
 * 数据库备份和恢复脚本
 * 支持MongoDB数据库的备份、恢复和管理
 */
interface BackupOptions {
    outputDir?: string;
    collections?: string[];
    compress?: boolean;
    includeIndexes?: boolean;
}
interface RestoreOptions {
    backupPath: string;
    collections?: string[];
    dropExisting?: boolean;
}
declare class DatabaseBackup {
    private mongoUri;
    private dbName;
    private backupDir;
    constructor();
    /**
     * 从MongoDB URI中提取数据库名称
     */
    private extractDbName;
    /**
     * 确保备份目录存在
     */
    private ensureBackupDir;
    /**
     * 生成备份文件名
     */
    private generateBackupName;
    /**
     * 执行MongoDB备份
     */
    backup(options?: BackupOptions): Promise<string>;
    /**
     * 恢复数据库
     */
    restore(options: RestoreOptions): Promise<void>;
    /**
     * 列出所有备份
     */
    listBackups(): Promise<Array<{
        name: string;
        path: string;
        size: string;
        date: Date;
    }>>;
    /**
     * 删除备份
     */
    deleteBackup(backupName: string): Promise<void>;
    /**
     * 清理旧备份（保留最近N个）
     */
    cleanupOldBackups(keepCount?: number): Promise<void>;
    /**
     * 获取目录大小
     */
    private getDirectorySize;
    /**
     * 格式化字节大小
     */
    private formatBytes;
}
export { DatabaseBackup };
//# sourceMappingURL=backup-database.d.ts.map