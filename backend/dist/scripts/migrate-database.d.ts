#!/usr/bin/env node
declare class DatabaseMigrator {
    private db;
    private migrationsCollection;
    private migrations;
    constructor();
    /**
     * 加载所有迁移
     */
    private loadMigrations;
    /**
     * 获取已应用的迁移记录
     */
    private getAppliedMigrations;
    /**
     * 记录迁移应用
     */
    private recordMigration;
    /**
     * 移除迁移记录
     */
    private removeMigrationRecord;
    /**
     * 比较版本号
     */
    private compareVersions;
    /**
     * 执行迁移
     */
    migrate(targetVersion?: string): Promise<void>;
    /**
     * 回滚迁移
     */
    rollback(targetVersion?: string): Promise<void>;
    /**
     * 显示迁移状态
     */
    status(): Promise<void>;
    /**
     * 重置所有迁移（危险操作）
     */
    reset(): Promise<void>;
}
export { DatabaseMigrator };
//# sourceMappingURL=migrate-database.d.ts.map