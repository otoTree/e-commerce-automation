#!/usr/bin/env node

import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * 数据库迁移脚本
 * 处理数据库结构变更、数据迁移和版本管理
 */

interface Migration {
  version: string;
  name: string;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

interface MigrationRecord {
  version: string;
  name: string;
  appliedAt: Date;
  executionTime: number;
}

class DatabaseMigrator {
  private db: mongoose.Connection;
  private migrationsCollection: string = 'migrations';
  private migrations: Migration[] = [];

  constructor() {
    this.db = mongoose.connection;
    this.loadMigrations();
  }

  /**
   * 加载所有迁移
   */
  private loadMigrations(): void {
    // 迁移定义
    this.migrations = [
      {
        version: '1.0.0',
        name: 'initial_setup',
        description: '初始化数据库结构',
        up: async () => {
          console.log('执行初始化设置...');
          // 这里可以添加初始化逻辑
        },
        down: async () => {
          console.log('回滚初始化设置...');
          // 这里可以添加回滚逻辑
        }
      },
      {
        version: '1.1.0',
        name: 'add_user_preferences',
        description: '为用户模型添加偏好设置字段',
        up: async () => {
          console.log('添加用户偏好设置字段...');
          const users = this.db.collection('users');
          await users.updateMany(
            { preferences: { $exists: false } },
            {
              $set: {
                preferences: {
                  language: 'zh-CN',
                  currency: 'CNY',
                  timezone: 'Asia/Shanghai',
                  notifications: {
                    email: true,
                    sms: false,
                    push: true
                  },
                  privacy: {
                    profile_visibility: 'public',
                    show_activity: true,
                    allow_contact: true
                  }
                }
              }
            }
          );
        },
        down: async () => {
          console.log('移除用户偏好设置字段...');
          const users = this.db.collection('users');
          await users.updateMany(
            {},
            { $unset: { preferences: '' } }
          );
        }
      },
      {
        version: '1.2.0',
        name: 'add_product_seo_fields',
        description: '为商品模型添加SEO相关字段',
        up: async () => {
          console.log('添加商品SEO字段...');
          const products = this.db.collection('products');
          await products.updateMany(
            { seo: { $exists: false } },
            {
              $set: {
                seo: {
                  meta_title: '',
                  meta_description: '',
                  keywords: [],
                  canonical_url: '',
                  og_title: '',
                  og_description: '',
                  og_image: ''
                }
              }
            }
          );
        },
        down: async () => {
          console.log('移除商品SEO字段...');
          const products = this.db.collection('products');
          await products.updateMany(
            {},
            { $unset: { seo: '' } }
          );
        }
      },
      {
        version: '1.3.0',
        name: 'add_order_tracking',
        description: '为订单添加物流跟踪功能',
        up: async () => {
          console.log('添加订单物流跟踪字段...');
          const orders = this.db.collection('orders');
          await orders.updateMany(
            { 'shipping.tracking': { $exists: false } },
            {
              $set: {
                'shipping.tracking': {
                  tracking_number: '',
                  carrier: '',
                  tracking_url: '',
                  status: 'pending',
                  events: [],
                  estimated_delivery: null,
                  actual_delivery: null
                }
              }
            }
          );
        },
        down: async () => {
          console.log('移除订单物流跟踪字段...');
          const orders = this.db.collection('orders');
          await orders.updateMany(
            {},
            { $unset: { 'shipping.tracking': '' } }
          );
        }
      },
      {
        version: '1.4.0',
        name: 'add_analytics_events',
        description: '添加分析事件收集',
        up: async () => {
          console.log('创建分析事件集合...');
          const analyticsEvents = this.db.collection('analytics_events');
          
          // 创建索引
          await analyticsEvents.createIndex({ event_type: 1, timestamp: -1 });
          await analyticsEvents.createIndex({ user_id: 1, timestamp: -1 });
          await analyticsEvents.createIndex({ session_id: 1 });
          await analyticsEvents.createIndex({ timestamp: -1 });
          
          console.log('分析事件集合创建完成');
        },
        down: async () => {
          console.log('删除分析事件集合...');
          await this.db.collection('analytics_events').drop();
        }
      },
      {
        version: '1.5.0',
        name: 'optimize_product_search',
        description: '优化商品搜索索引',
        up: async () => {
          console.log('优化商品搜索索引...');
          const products = this.db.collection('products');
          
          // 删除旧的文本索引
          try {
            await products.dropIndex('name_text_description_text');
          } catch (error) {
            console.log('旧索引不存在，跳过删除');
          }
          
          // 创建新的复合文本索引
          await products.createIndex(
            {
              name: 'text',
              description: 'text',
              'seo.keywords': 'text',
              brand: 'text',
              tags: 'text'
            },
            {
              weights: {
                name: 10,
                'seo.keywords': 8,
                brand: 6,
                description: 5,
                tags: 3
              },
              name: 'product_search_index'
            }
          );
          
          console.log('商品搜索索引优化完成');
        },
        down: async () => {
          console.log('回滚商品搜索索引优化...');
          const products = this.db.collection('products');
          await products.dropIndex('product_search_index');
        }
      }
    ];
  }

  /**
   * 获取已应用的迁移记录
   */
  private async getAppliedMigrations(): Promise<MigrationRecord[]> {
    try {
      const migrations = this.db.collection(this.migrationsCollection);
      return await migrations.find({}).sort({ appliedAt: 1 }).toArray() as unknown as MigrationRecord[];
    } catch (error) {
      console.log('迁移记录集合不存在，将创建新的');
      return [];
    }
  }

  /**
   * 记录迁移应用
   */
  private async recordMigration(migration: Migration, executionTime: number): Promise<void> {
    const migrations = this.db.collection(this.migrationsCollection);
    await migrations.insertOne({
      version: migration.version,
      name: migration.name,
      appliedAt: new Date(),
      executionTime
    });
  }

  /**
   * 移除迁移记录
   */
  private async removeMigrationRecord(version: string): Promise<void> {
    const migrations = this.db.collection(this.migrationsCollection);
    await migrations.deleteOne({ version });
  }

  /**
   * 比较版本号
   */
  private compareVersions(a: string, b: string): number {
    const aParts = a.split('.').map(Number);
    const bParts = b.split('.').map(Number);
    
    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
      const aPart = aParts[i] || 0;
      const bPart = bParts[i] || 0;
      
      if (aPart > bPart) return 1;
      if (aPart < bPart) return -1;
    }
    
    return 0;
  }

  /**
   * 执行迁移
   */
  async migrate(targetVersion?: string): Promise<void> {
    console.log('🚀 开始数据库迁移...');
    
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));
    
    // 获取需要执行的迁移
    const pendingMigrations = this.migrations.filter(migration => {
      if (appliedVersions.has(migration.version)) {
        return false;
      }
      
      if (targetVersion) {
        return this.compareVersions(migration.version, targetVersion) <= 0;
      }
      
      return true;
    });
    
    if (pendingMigrations.length === 0) {
      console.log('✅ 没有需要执行的迁移');
      return;
    }
    
    // 按版本号排序
    pendingMigrations.sort((a, b) => this.compareVersions(a.version, b.version));
    
    console.log(`📋 将执行 ${pendingMigrations.length} 个迁移:`);
    pendingMigrations.forEach(m => {
      console.log(`   ${m.version}: ${m.description}`);
    });
    
    // 执行迁移
    for (const migration of pendingMigrations) {
      console.log(`\n🔄 执行迁移 ${migration.version}: ${migration.name}`);
      
      const startTime = Date.now();
      
      try {
        await migration.up();
        const executionTime = Date.now() - startTime;
        
        await this.recordMigration(migration, executionTime);
        console.log(`✅ 迁移 ${migration.version} 完成 (${executionTime}ms)`);
      } catch (error) {
        console.error(`❌ 迁移 ${migration.version} 失败:`, error);
        throw error;
      }
    }
    
    console.log('\n🎉 所有迁移执行完成!');
  }

  /**
   * 回滚迁移
   */
  async rollback(targetVersion?: string): Promise<void> {
    console.log('🔄 开始回滚迁移...');
    
    const appliedMigrations = await this.getAppliedMigrations();
    
    if (appliedMigrations.length === 0) {
      console.log('✅ 没有已应用的迁移需要回滚');
      return;
    }
    
    // 获取需要回滚的迁移
    let migrationsToRollback: MigrationRecord[];
    
    if (targetVersion) {
      migrationsToRollback = appliedMigrations.filter(m => 
        this.compareVersions(m.version, targetVersion) > 0
      );
    } else {
      // 如果没有指定目标版本，只回滚最后一个
      migrationsToRollback = appliedMigrations.slice(-1);
    }
    
    if (migrationsToRollback.length === 0) {
      console.log('✅ 没有需要回滚的迁移');
      return;
    }
    
    // 按版本号倒序排列（从高到低回滚）
    migrationsToRollback.sort((a, b) => this.compareVersions(b.version, a.version));
    
    console.log(`📋 将回滚 ${migrationsToRollback.length} 个迁移:`);
    migrationsToRollback.forEach(m => {
      console.log(`   ${m.version}: ${m.name}`);
    });
    
    // 执行回滚
    for (const migrationRecord of migrationsToRollback) {
      const migration = this.migrations.find(m => m.version === migrationRecord.version);
      
      if (!migration) {
        console.warn(`⚠️  找不到版本 ${migrationRecord.version} 的迁移定义，跳过回滚`);
        continue;
      }
      
      console.log(`\n🔄 回滚迁移 ${migration.version}: ${migration.name}`);
      
      try {
        await migration.down();
        await this.removeMigrationRecord(migration.version);
        console.log(`✅ 迁移 ${migration.version} 回滚完成`);
      } catch (error) {
        console.error(`❌ 迁移 ${migration.version} 回滚失败:`, error);
        throw error;
      }
    }
    
    console.log('\n🎉 迁移回滚完成!');
  }

  /**
   * 显示迁移状态
   */
  async status(): Promise<void> {
    console.log('📊 数据库迁移状态\n');
    
    const appliedMigrations = await this.getAppliedMigrations();
    const appliedVersions = new Set(appliedMigrations.map(m => m.version));
    
    console.log('可用迁移:');
    this.migrations.forEach(migration => {
      const isApplied = appliedVersions.has(migration.version);
      const status = isApplied ? '✅ 已应用' : '⏳ 待执行';
      const appliedInfo = isApplied 
        ? ` (${appliedMigrations.find(m => m.version === migration.version)?.appliedAt.toLocaleString()})`
        : '';
      
      console.log(`  ${status} ${migration.version}: ${migration.description}${appliedInfo}`);
    });
    
    console.log(`\n总计: ${this.migrations.length} 个迁移, ${appliedMigrations.length} 个已应用`);
  }

  /**
   * 重置所有迁移（危险操作）
   */
  async reset(): Promise<void> {
    console.log('⚠️  重置所有迁移记录...');
    
    try {
      await this.db.collection(this.migrationsCollection).drop();
      console.log('✅ 迁移记录已清空');
    } catch (error) {
      console.log('迁移记录集合不存在或已为空');
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  if (!command) {
    console.log('使用方法:');
    console.log('  npm run db:migrate up [version]     # 执行迁移到指定版本（默认最新）');
    console.log('  npm run db:migrate down [version]   # 回滚到指定版本（默认回滚一个）');
    console.log('  npm run db:migrate status           # 显示迁移状态');
    console.log('  npm run db:migrate reset            # 重置迁移记录（危险）');
    return;
  }
  
  try {
    console.log('📡 连接数据库...');
    await connectDB();
    console.log('✅ 数据库连接成功\n');
    
    const migrator = new DatabaseMigrator();
    
    switch (command) {
      case 'up':
      case 'migrate':
        await migrator.migrate(args[1]);
        break;
        
      case 'down':
      case 'rollback':
        await migrator.rollback(args[1]);
        break;
        
      case 'status':
        await migrator.status();
        break;
        
      case 'reset':
        // 确认操作
        console.log('⚠️  这将删除所有迁移记录，但不会回滚已应用的更改!');
        console.log('如果确定要继续，请在5秒内按 Ctrl+C 取消...');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
        await migrator.reset();
        break;
        
      default:
        console.error(`❌ 未知命令: ${command}`);
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 迁移操作失败:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1] || ''}`) {
  main();
}

export { DatabaseMigrator };