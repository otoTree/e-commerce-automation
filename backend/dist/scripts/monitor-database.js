#!/usr/bin/env node
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import { getIndexStats } from '../config/indexes.js';
class DatabaseMonitor {
    db;
    monitoringInterval = null;
    slowQueryThreshold = 100; // 慢查询阈值（毫秒）
    constructor() {
        this.db = mongoose.connection;
    }
    /**
     * 获取数据库服务器状态
     */
    async getServerStatus() {
        try {
            const admin = this.db.db?.admin();
            if (!admin)
                return null;
            const status = await admin.serverStatus();
            return status;
        }
        catch (error) {
            console.error('获取服务器状态失败:', error);
            return null;
        }
    }
    /**
     * 获取数据库统计信息
     */
    async getDatabaseStats() {
        try {
            const stats = await this.db.db?.stats();
            return stats;
        }
        catch (error) {
            console.error('获取数据库统计失败:', error);
            return null;
        }
    }
    /**
     * 获取集合统计信息
     */
    async getCollectionStats() {
        const collections = ['users', 'products', 'categories', 'tasks', 'orders', 'payments', 'carts'];
        const stats = {};
        for (const collectionName of collections) {
            try {
                const collection = this.db.db?.collection(collectionName);
                if (!collection)
                    continue;
                const collStats = await collection.stats();
                stats[collectionName] = {
                    count: collStats.count,
                    size: collStats.size,
                    avgObjSize: collStats.avgObjSize,
                    storageSize: collStats.storageSize,
                    totalIndexSize: collStats.totalIndexSize,
                    indexCount: collStats.nindexes
                };
            }
            catch (error) {
                stats[collectionName] = { error: `获取统计失败: ${error}` };
            }
        }
        return stats;
    }
    /**
     * 获取当前操作信息
     */
    async getCurrentOperations() {
        try {
            const admin = this.db.db?.admin();
            if (!admin)
                return [];
            const currentOp = await admin.command({ currentOp: 1 });
            return currentOp.inprog || [];
        }
        catch (error) {
            console.error('获取当前操作失败:', error);
            return [];
        }
    }
    /**
     * 分析慢查询
     */
    async analyzeSlowQueries() {
        try {
            // 启用慢查询日志
            const admin = this.db.db?.admin();
            if (!admin)
                return [];
            await admin.command({
                profile: 2,
                slowms: this.slowQueryThreshold
            });
            // 查询慢查询日志
            const profilerCollection = this.db.db?.collection('system.profile');
            if (!profilerCollection)
                return [];
            const slowQueries = await profilerCollection
                .find({
                'attr.durationMillis': { $gte: this.slowQueryThreshold }
            })
                .sort({ ts: -1 })
                .limit(50)
                .toArray();
            return slowQueries;
        }
        catch (error) {
            console.error('分析慢查询失败:', error);
            return [];
        }
    }
    /**
     * 格式化字节大小
     */
    formatBytes(bytes) {
        if (bytes === 0)
            return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    /**
     * 格式化数字
     */
    formatNumber(num) {
        return num.toLocaleString();
    }
    /**
     * 生成性能报告
     */
    async generatePerformanceReport() {
        console.log('\n📊 数据库性能报告');
        console.log('='.repeat(50));
        console.log(`生成时间: ${new Date().toLocaleString()}`);
        // 服务器状态
        const serverStatus = await this.getServerStatus();
        if (serverStatus) {
            console.log('\n🖥️  服务器状态:');
            console.log(`   版本: ${serverStatus.version}`);
            console.log(`   运行时间: ${Math.floor(serverStatus.uptime / 3600)} 小时`);
            console.log(`   当前连接数: ${serverStatus.connections.current}`);
            console.log(`   可用连接数: ${serverStatus.connections.available}`);
            if (serverStatus.mem) {
                console.log(`   内存使用: ${this.formatBytes(serverStatus.mem.resident * 1024 * 1024)}`);
                console.log(`   虚拟内存: ${this.formatBytes(serverStatus.mem.virtual * 1024 * 1024)}`);
            }
            if (serverStatus.opcounters) {
                console.log('\n📈 操作统计:');
                console.log(`   插入: ${this.formatNumber(serverStatus.opcounters.insert)}`);
                console.log(`   查询: ${this.formatNumber(serverStatus.opcounters.query)}`);
                console.log(`   更新: ${this.formatNumber(serverStatus.opcounters.update)}`);
                console.log(`   删除: ${this.formatNumber(serverStatus.opcounters.delete)}`);
            }
        }
        // 数据库统计
        const dbStats = await this.getDatabaseStats();
        if (dbStats) {
            console.log('\n💾 数据库统计:');
            console.log(`   集合数: ${dbStats.collections}`);
            console.log(`   文档数: ${this.formatNumber(dbStats.objects)}`);
            console.log(`   数据大小: ${this.formatBytes(dbStats.dataSize)}`);
            console.log(`   存储大小: ${this.formatBytes(dbStats.storageSize)}`);
            console.log(`   索引大小: ${this.formatBytes(dbStats.indexSize)}`);
            console.log(`   平均文档大小: ${this.formatBytes(dbStats.avgObjSize)}`);
        }
        // 集合统计
        const collectionStats = await this.getCollectionStats();
        console.log('\n📚 集合统计:');
        for (const [collectionName, stats] of Object.entries(collectionStats)) {
            if (stats.error) {
                console.log(`   ${collectionName}: ${stats.error}`);
            }
            else {
                console.log(`   ${collectionName}:`);
                console.log(`     文档数: ${this.formatNumber(stats.count)}`);
                console.log(`     数据大小: ${this.formatBytes(stats.size)}`);
                console.log(`     索引数: ${stats.indexCount}`);
                console.log(`     索引大小: ${this.formatBytes(stats.totalIndexSize)}`);
            }
        }
        // 索引统计
        const indexStats = await getIndexStats();
        console.log('\n🔍 索引统计:');
        for (const [modelName, stats] of Object.entries(indexStats)) {
            if (stats.error) {
                console.log(`   ${modelName}: ${stats.error}`);
            }
            else {
                console.log(`   ${modelName}: ${stats.indexes.length} 个索引`);
                if (stats.totalIndexSize) {
                    console.log(`     总大小: ${this.formatBytes(stats.totalIndexSize)}`);
                }
            }
        }
        // 当前操作
        const currentOps = await this.getCurrentOperations();
        console.log('\n⚡ 当前操作:');
        if (currentOps.length === 0) {
            console.log('   无活跃操作');
        }
        else {
            currentOps.forEach((op, index) => {
                console.log(`   ${index + 1}. ${op.op} on ${op.ns} (${op.secs_running}s)`);
            });
        }
        // 慢查询分析
        const slowQueries = await this.analyzeSlowQueries();
        console.log('\n🐌 慢查询分析:');
        if (slowQueries.length === 0) {
            console.log('   无慢查询记录');
        }
        else {
            console.log(`   发现 ${slowQueries.length} 个慢查询:`);
            slowQueries.slice(0, 5).forEach((query, index) => {
                console.log(`   ${index + 1}. ${query.attr.type} on ${query.attr.ns}`);
                console.log(`      耗时: ${query.attr.durationMillis}ms`);
                if (query.attr.docsExamined) {
                    console.log(`      检查文档: ${query.attr.docsExamined}`);
                }
                if (query.attr.keysExamined) {
                    console.log(`      检查键: ${query.attr.keysExamined}`);
                }
            });
        }
        console.log('\n' + '='.repeat(50));
    }
    /**
     * 开始监控
     */
    startMonitoring(intervalMinutes = 5) {
        console.log(`🔄 开始数据库监控 (每 ${intervalMinutes} 分钟)`);
        this.monitoringInterval = setInterval(async () => {
            await this.generatePerformanceReport();
        }, intervalMinutes * 60 * 1000);
        // 立即生成一次报告
        this.generatePerformanceReport();
    }
    /**
     * 停止监控
     */
    stopMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
            console.log('⏹️  数据库监控已停止');
        }
    }
}
/**
 * 主函数
 */
async function main() {
    try {
        console.log('🚀 启动数据库性能监控...');
        // 连接数据库
        await connectDB();
        console.log('✅ 数据库连接成功');
        // 创建监控实例
        const monitor = new DatabaseMonitor();
        // 检查命令行参数
        const args = process.argv.slice(2);
        const command = args[0] || 'report';
        switch (command) {
            case 'report':
                await monitor.generatePerformanceReport();
                break;
            case 'monitor':
                const interval = parseInt(args[1] || '5') || 5;
                monitor.startMonitoring(interval);
                // 优雅关闭
                process.on('SIGINT', () => {
                    console.log('\n收到中断信号，正在关闭监控...');
                    monitor.stopMonitoring();
                    process.exit(0);
                });
                break;
            default:
                console.log('使用方法:');
                console.log('  npm run monitor:db report    # 生成性能报告');
                console.log('  npm run monitor:db monitor [间隔分钟]  # 开始监控');
                break;
        }
    }
    catch (error) {
        console.error('❌ 监控启动失败:', error);
        process.exit(1);
    }
}
// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1] || ''}`) {
    main();
}
export { DatabaseMonitor };
//# sourceMappingURL=monitor-database.js.map