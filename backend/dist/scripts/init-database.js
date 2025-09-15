#!/usr/bin/env node
import { connectDB } from '../config/database.js';
import { createIndexes, getIndexStats, performanceOptimizations } from '../config/indexes.js';
/**
 * 数据库初始化脚本
 * 用于设置索引、优化配置和数据库初始化
 */
async function initDatabase() {
    console.log('🚀 开始初始化数据库...');
    try {
        // 连接数据库
        console.log('📡 连接数据库...');
        await connectDB();
        console.log('✅ 数据库连接成功');
        // 创建索引
        console.log('\n📊 创建数据库索引...');
        await createIndexes();
        console.log('✅ 索引创建完成');
        // 获取索引统计
        console.log('\n📈 获取索引统计信息...');
        const stats = await getIndexStats();
        console.log('\n📋 索引统计报告:');
        for (const [modelName, modelStats] of Object.entries(stats)) {
            if (modelStats.error) {
                console.log(`❌ ${modelName}: ${modelStats.error}`);
            }
            else {
                console.log(`✅ ${modelName}: ${modelStats.indexes.length} 个索引`);
                if (modelStats.totalIndexSize) {
                    console.log(`   索引总大小: ${(modelStats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
                }
            }
        }
        // 显示性能优化建议
        console.log('\n💡 性能优化建议:');
        console.log('\n🔗 连接优化:');
        Object.entries(performanceOptimizations.connectionOptions).forEach(([key, value]) => {
            console.log(`   ${key}: ${value}`);
        });
        console.log('\n🔍 查询优化:');
        performanceOptimizations.queryOptimizations.forEach((tip, index) => {
            console.log(`   ${index + 1}. ${tip}`);
        });
        console.log('\n📊 索引优化:');
        performanceOptimizations.indexOptimizations.forEach((tip, index) => {
            console.log(`   ${index + 1}. ${tip}`);
        });
        console.log('\n🎉 数据库初始化完成!');
    }
    catch (error) {
        console.error('❌ 数据库初始化失败:', error);
        process.exit(1);
    }
    finally {
        // 关闭数据库连接
        process.exit(0);
    }
}
// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
    initDatabase();
}
export { initDatabase };
//# sourceMappingURL=init-database.js.map