import mongoose from 'mongoose';
// 数据库连接状态枚举
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["DISCONNECTED"] = "disconnected";
    ConnectionStatus["CONNECTING"] = "connecting";
    ConnectionStatus["CONNECTED"] = "connected";
    ConnectionStatus["DISCONNECTING"] = "disconnecting";
    ConnectionStatus["ERROR"] = "error";
})(ConnectionStatus || (ConnectionStatus = {}));
// 获取数据库配置
const getDatabaseConfig = () => {
    // 优先使用MONGO_URL，如果不存在则使用MONGODB_URI，最后使用默认值
    const mongoUri = process.env.MONGO_URL || process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-ai';
    return {
        uri: mongoUri,
        options: {
            // 连接池配置
            maxPoolSize: 10, // 最大连接数
            minPoolSize: 2, // 最小连接数
            maxIdleTimeMS: 30000, // 连接空闲时间
            // 超时配置
            serverSelectionTimeoutMS: 5000, // 服务器选择超时
            socketTimeoutMS: 45000, // Socket超时
            connectTimeoutMS: 10000, // 连接超时
            // 其他配置
            retryWrites: true, // 启用重试写入
            w: 'majority', // 写入确认级别
            // 压缩配置
            compressors: ['zlib'],
            // 心跳配置
            heartbeatFrequencyMS: 10000,
        }
    };
};
// 连接到MongoDB数据库
export const connectDB = async () => {
    try {
        const config = getDatabaseConfig();
        console.log('正在连接到MongoDB数据库...');
        console.log(`数据库URI: ${config.uri.replace(/\/\/.*@/, '//***:***@')}`); // 隐藏敏感信息
        // 设置mongoose全局配置
        mongoose.set('strictQuery', false); // 允许灵活查询
        // 连接数据库
        await mongoose.connect(config.uri, config.options);
        console.log('✅ MongoDB数据库连接成功');
        // 监听连接事件
        setupConnectionEventListeners();
    }
    catch (error) {
        console.error('❌ MongoDB数据库连接失败:', error);
        // 在开发环境中退出进程，生产环境中可能需要重试逻辑
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1);
        }
        throw error;
    }
};
// 断开数据库连接
export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('📤 MongoDB数据库连接已断开');
    }
    catch (error) {
        console.error('❌ 断开数据库连接时发生错误:', error);
        throw error;
    }
};
// 获取当前连接状态
export const getConnectionStatus = () => {
    const state = mongoose.connection.readyState;
    switch (state) {
        case 0:
            return ConnectionStatus.DISCONNECTED;
        case 1:
            return ConnectionStatus.CONNECTED;
        case 2:
            return ConnectionStatus.CONNECTING;
        case 3:
            return ConnectionStatus.DISCONNECTING;
        default:
            return ConnectionStatus.ERROR;
    }
};
// 检查数据库连接健康状态
export const checkDatabaseHealth = async () => {
    try {
        const status = getConnectionStatus();
        if (status !== ConnectionStatus.CONNECTED) {
            return { status, error: '数据库未连接' };
        }
        // 测试连接延迟
        const startTime = Date.now();
        const db = mongoose.connection.db;
        if (!db) {
            return { status, error: '数据库连接不可用' };
        }
        await db.admin().ping();
        const latency = Date.now() - startTime;
        return { status, latency };
    }
    catch (error) {
        return {
            status: ConnectionStatus.ERROR,
            error: error instanceof Error ? error.message : '未知错误'
        };
    }
};
// 设置连接事件监听器
const setupConnectionEventListeners = () => {
    const connection = mongoose.connection;
    // 连接成功事件
    connection.on('connected', () => {
        console.log('🔗 Mongoose连接已建立');
    });
    // 连接错误事件
    connection.on('error', (error) => {
        console.error('❌ Mongoose连接错误:', error);
    });
    // 连接断开事件
    connection.on('disconnected', () => {
        console.log('📤 Mongoose连接已断开');
    });
    // 重新连接事件
    connection.on('reconnected', () => {
        console.log('🔄 Mongoose已重新连接');
    });
    // 进程退出时优雅关闭连接
    process.on('SIGINT', async () => {
        try {
            await disconnectDB();
            console.log('🛑 应用程序已优雅退出');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ 优雅退出时发生错误:', error);
            process.exit(1);
        }
    });
};
// 数据库工具函数
export const dbUtils = {
    // 清理过期数据
    cleanupExpiredData: async (collectionName, expiryField, expiryTime) => {
        try {
            const db = mongoose.connection.db;
            if (!db) {
                throw new Error('数据库连接不可用');
            }
            const result = await db
                .collection(collectionName)
                .deleteMany({ [expiryField]: { $lt: expiryTime } });
            return result.deletedCount || 0;
        }
        catch (error) {
            console.error(`清理${collectionName}集合过期数据失败:`, error);
            throw error;
        }
    },
    // 获取集合统计信息
    getCollectionStats: async (collectionName) => {
        try {
            const db = mongoose.connection.db;
            if (!db) {
                throw new Error('数据库连接不可用');
            }
            return await db.stats();
        }
        catch (error) {
            console.error(`获取${collectionName}集合统计信息失败:`, error);
            throw error;
        }
    },
    // 创建索引
    createIndex: async (collectionName, indexSpec, options) => {
        try {
            const db = mongoose.connection.db;
            if (!db) {
                throw new Error('数据库连接不可用');
            }
            return await db
                .collection(collectionName)
                .createIndex(indexSpec, options);
        }
        catch (error) {
            console.error(`为${collectionName}集合创建索引失败:`, error);
            throw error;
        }
    }
};
export default {
    connectDB,
    disconnectDB,
    getConnectionStatus,
    checkDatabaseHealth,
    dbUtils
};
//# sourceMappingURL=database.js.map