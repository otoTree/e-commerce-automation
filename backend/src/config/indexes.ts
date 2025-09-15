import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Task } from '../models/Task.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { Cart } from '../models/Cart.js';

/**
 * 数据库索引配置和优化
 * 统一管理所有模型的索引设置
 */

// 索引配置接口
interface IndexConfig {
  model: string;
  indexes: Array<{
    fields: Record<string, 1 | -1 | 'text'>;
    options?: mongoose.IndexOptions;
    description: string;
  }>;
}

// 索引配置定义
const indexConfigs: IndexConfig[] = [
  {
    model: 'User',
    indexes: [
      {
        fields: { email: 1 },
        options: { unique: true, sparse: true },
        description: '用户邮箱唯一索引'
      },
      {
        fields: { phone: 1 },
        options: { unique: true, sparse: true },
        description: '用户手机号唯一索引'
      },
      {
        fields: { username: 1 },
        options: { unique: true, sparse: true },
        description: '用户名唯一索引'
      },
      {
        fields: { 'profile.wechat_openid': 1 },
        options: { sparse: true },
        description: '微信OpenID索引'
      },
      {
        fields: { status: 1, created_at: -1 },
        description: '用户状态和创建时间复合索引'
      },
      {
        fields: { last_login_at: -1 },
        description: '最后登录时间索引'
      }
    ]
  },
  {
    model: 'Product',
    indexes: [
      {
        fields: { sku: 1 },
        options: { unique: true },
        description: '商品SKU唯一索引'
      },
      {
        fields: { '1688_data.product_id': 1 },
        options: { sparse: true },
        description: '1688商品ID索引'
      },
      {
        fields: { category_id: 1, status: 1 },
        description: '分类和状态复合索引'
      },
      {
        fields: { brand: 1, status: 1 },
        description: '品牌和状态复合索引'
      },
      {
        fields: { price: 1, status: 1 },
        description: '价格和状态复合索引'
      },
      {
        fields: { 'inventory.stock_quantity': 1 },
        description: '库存数量索引'
      },
      {
        fields: { tags: 1 },
        description: '标签索引'
      },
      {
        fields: { name: 'text', description: 'text', 'seo.keywords': 'text' },
        options: { weights: { name: 10, description: 5, 'seo.keywords': 8 } },
        description: '商品全文搜索索引'
      },
      {
        fields: { created_at: -1 },
        description: '创建时间索引'
      },
      {
        fields: { updated_at: -1 },
        description: '更新时间索引'
      }
    ]
  },
  {
    model: 'Category',
    indexes: [
      {
        fields: { slug: 1 },
        options: { unique: true },
        description: '分类slug唯一索引'
      },
      {
        fields: { parent_id: 1, sort_order: 1 },
        description: '父分类和排序复合索引'
      },
      {
        fields: { level: 1, status: 1 },
        description: '层级和状态复合索引'
      },
      {
        fields: { name: 'text', description: 'text' },
        description: '分类全文搜索索引'
      }
    ]
  },
  {
    model: 'Task',
    indexes: [
      {
        fields: { user_id: 1, status: 1 },
        description: '用户和任务状态复合索引'
      },
      {
        fields: { type: 1, status: 1 },
        description: '任务类型和状态复合索引'
      },
      {
        fields: { scheduled_at: 1, status: 1 },
        description: '计划执行时间和状态复合索引'
      },
      {
        fields: { priority: -1, created_at: -1 },
        description: '优先级和创建时间复合索引'
      },
      {
        fields: { 'execution.next_run_at': 1 },
        options: { sparse: true },
        description: '下次执行时间索引'
      }
    ]
  },
  {
    model: 'Order',
    indexes: [
      {
        fields: { order_number: 1 },
        options: { unique: true },
        description: '订单号唯一索引'
      },
      {
        fields: { user_id: 1, status: 1 },
        description: '用户和订单状态复合索引'
      },
      {
        fields: { status: 1, created_at: -1 },
        description: '订单状态和创建时间复合索引'
      },
      {
        fields: { 'payment.status': 1 },
        description: '支付状态索引'
      },
      {
        fields: { 'shipping.tracking_number': 1 },
        options: { sparse: true },
        description: '物流跟踪号索引'
      },
      {
        fields: { created_at: -1 },
        description: '创建时间索引'
      }
    ]
  },
  {
    model: 'Payment',
    indexes: [
      {
        fields: { transaction_id: 1 },
        options: { unique: true },
        description: '交易ID唯一索引'
      },
      {
        fields: { order_id: 1 },
        description: '订单ID索引'
      },
      {
        fields: { user_id: 1, status: 1 },
        description: '用户和支付状态复合索引'
      },
      {
        fields: { method: 1, status: 1 },
        description: '支付方式和状态复合索引'
      },
      {
        fields: { 'gateway.transaction_id': 1 },
        options: { sparse: true },
        description: '网关交易ID索引'
      },
      {
        fields: { created_at: -1 },
        description: '创建时间索引'
      }
    ]
  },
  {
    model: 'Cart',
    indexes: [
      {
        fields: { user_id: 1 },
        options: { unique: true },
        description: '用户购物车唯一索引'
      },
      {
        fields: { 'items.product_id': 1 },
        description: '购物车商品ID索引'
      },
      {
        fields: { updated_at: -1 },
        description: '更新时间索引'
      }
    ]
  }
];

/**
 * 创建数据库索引
 */
export async function createIndexes(): Promise<void> {
  console.log('开始创建数据库索引...');
  
  const models = {
    User,
    Product,
    Category,
    Task,
    Order,
    Payment,
    Cart
  };

  for (const config of indexConfigs) {
    const Model = models[config.model as keyof typeof models];
    if (!Model) {
      console.warn(`模型 ${config.model} 不存在，跳过索引创建`);
      continue;
    }

    console.log(`为模型 ${config.model} 创建索引...`);
    
    for (const indexDef of config.indexes) {
      try {
        await (Model as any).createIndex(indexDef.fields, indexDef.options || {});
        console.log(`✓ ${config.model}: ${indexDef.description}`);
      } catch (error: any) {
        console.error(`✗ ${config.model}: ${indexDef.description} - ${error}`);
      }
    }
  }
  
  console.log('数据库索引创建完成');
}

/**
 * 删除所有索引（除了_id）
 */
export async function dropIndexes(): Promise<void> {
  console.log('开始删除数据库索引...');
  
  const models = {
    User,
    Product,
    Category,
    Task,
    Order,
    Payment,
    Cart
  };

  for (const [modelName, Model] of Object.entries(models)) {
    try {
      await Model.collection.dropIndexes();
      console.log(`✓ ${modelName}: 索引已删除`);
    } catch (error) {
      console.error(`✗ ${modelName}: 删除索引失败 - ${error}`);
    }
  }
  
  console.log('数据库索引删除完成');
}

/**
 * 重建所有索引
 */
export async function rebuildIndexes(): Promise<void> {
  await dropIndexes();
  await createIndexes();
}

/**
 * 获取索引统计信息
 */
export async function getIndexStats(): Promise<Record<string, any>> {
  const models = {
    User,
    Product,
    Category,
    Task,
    Order,
    Payment,
    Cart
  };

  const stats: Record<string, any> = {};

  for (const [modelName, Model] of Object.entries(models)) {
    try {
      const indexes = await Model.collection.listIndexes().toArray();
      const indexStats = await (Model.collection as any).stats();
      
      stats[modelName] = {
        indexes: indexes.map(idx => ({
          name: idx.name,
          keys: idx.key,
          unique: idx.unique || false,
          sparse: idx.sparse || false
        })),
        totalIndexSize: indexStats.totalIndexSize,
        indexSizes: indexStats.indexSizes
      };
    } catch (error: any) {
      stats[modelName] = { error: error.message };
    }
  }

  return stats;
}

/**
 * 性能优化建议
 */
export const performanceOptimizations = {
  // MongoDB 连接优化
  connectionOptions: {
    maxPoolSize: 10, // 连接池大小
    serverSelectionTimeoutMS: 5000, // 服务器选择超时
    socketTimeoutMS: 45000, // Socket超时
    bufferMaxEntries: 0, // 禁用mongoose缓冲
    bufferCommands: false // 禁用命令缓冲
  },
  
  // 查询优化建议
  queryOptimizations: [
    '使用投影(select)只获取需要的字段',
    '使用lean()查询获取普通JavaScript对象',
    '合理使用limit()和skip()进行分页',
    '使用聚合管道优化复杂查询',
    '避免在循环中执行数据库查询',
    '使用批量操作处理大量数据'
  ],
  
  // 索引优化建议
  indexOptimizations: [
    '为经常查询的字段创建索引',
    '使用复合索引优化多字段查询',
    '避免创建过多索引影响写入性能',
    '定期分析慢查询日志',
    '使用部分索引减少索引大小',
    '考虑使用TTL索引自动删除过期数据'
  ]
};