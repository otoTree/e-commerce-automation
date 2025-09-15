#!/usr/bin/env node

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import { connectDB } from '../config/database.js';

const execAsync = promisify(exec);

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

class DatabaseBackup {
  private mongoUri: string;
  private dbName: string;
  private backupDir: string;

  constructor() {
    this.mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017';
    this.dbName = this.extractDbName(this.mongoUri);
    this.backupDir = path.join(process.cwd(), 'backups');
  }

  /**
   * 从MongoDB URI中提取数据库名称
   */
  private extractDbName(uri: string): string {
    const match = uri.match(/\/([^/?]+)(\?|$)/);
    return match?.[1] || 'ecommerce';
  }

  /**
   * 确保备份目录存在
   */
  private async ensureBackupDir(): Promise<void> {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`✅ 创建备份目录: ${this.backupDir}`);
    }
  }

  /**
   * 生成备份文件名
   */
  private generateBackupName(prefix: string = 'backup'): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `${prefix}_${this.dbName}_${timestamp}`;
  }

  /**
   * 执行MongoDB备份
   */
  async backup(options: BackupOptions = {}): Promise<string> {
    await this.ensureBackupDir();
    
    const backupName = this.generateBackupName();
    const outputPath = path.join(options.outputDir || this.backupDir, backupName);
    
    console.log(`🔄 开始备份数据库: ${this.dbName}`);
    console.log(`📁 备份路径: ${outputPath}`);
    
    try {
      // 构建mongodump命令
      let command = `mongodump --uri="${this.mongoUri}" --out="${outputPath}"`;
      
      // 如果指定了特定集合
      if (options.collections && options.collections.length > 0) {
        console.log(`📋 备份指定集合: ${options.collections.join(', ')}`);
        // 为每个集合单独备份
        for (const collection of options.collections) {
          const collectionCommand = `mongodump --uri="${this.mongoUri}" --collection="${collection}" --out="${outputPath}"`;
          await execAsync(collectionCommand);
          console.log(`✅ 集合 ${collection} 备份完成`);
        }
      } else {
        // 备份整个数据库
        await execAsync(command);
        console.log('✅ 数据库备份完成');
      }
      
      // 如果需要压缩
      if (options.compress) {
        console.log('🗜️  压缩备份文件...');
        const tarCommand = `tar -czf "${outputPath}.tar.gz" -C "${path.dirname(outputPath)}" "${path.basename(outputPath)}"`;
        await execAsync(tarCommand);
        
        // 删除原始备份目录
        await fs.rm(outputPath, { recursive: true, force: true });
        console.log(`✅ 备份已压缩: ${outputPath}.tar.gz`);
        return `${outputPath}.tar.gz`;
      }
      
      // 生成备份信息文件
      const backupInfo = {
        timestamp: new Date().toISOString(),
        database: this.dbName,
        collections: options.collections || 'all',
        compressed: options.compress || false,
        includeIndexes: options.includeIndexes !== false,
        size: await this.getDirectorySize(outputPath)
      };
      
      await fs.writeFile(
        path.join(outputPath, 'backup-info.json'),
        JSON.stringify(backupInfo, null, 2)
      );
      
      console.log(`✅ 备份完成: ${outputPath}`);
      return outputPath;
      
    } catch (error) {
      console.error('❌ 备份失败:', error);
      throw error;
    }
  }

  /**
   * 恢复数据库
   */
  async restore(options: RestoreOptions): Promise<void> {
    console.log(`🔄 开始恢复数据库: ${this.dbName}`);
    console.log(`📁 备份路径: ${options.backupPath}`);
    
    try {
      let restorePath = options.backupPath;
      
      // 如果是压缩文件，先解压
      if (options.backupPath.endsWith('.tar.gz')) {
        console.log('📦 解压备份文件...');
        const extractDir = path.join(this.backupDir, 'temp_restore');
        await fs.mkdir(extractDir, { recursive: true });
        
        const extractCommand = `tar -xzf "${options.backupPath}" -C "${extractDir}"`;
        await execAsync(extractCommand);
        
        // 找到解压后的数据库目录
        const files = await fs.readdir(extractDir);
        const dbDir = files.find(file => file.startsWith('backup_'));
        if (!dbDir) {
          throw new Error('无法找到数据库备份目录');
        }
        
        restorePath = path.join(extractDir, dbDir, this.dbName);
      } else {
        restorePath = path.join(options.backupPath, this.dbName);
      }
      
      // 检查备份路径是否存在
      await fs.access(restorePath);
      
      // 构建mongorestore命令
      let command = `mongorestore --uri="${this.mongoUri}"`;
      
      if (options.dropExisting) {
        command += ' --drop';
        console.log('⚠️  将删除现有数据');
      }
      
      if (options.collections && options.collections.length > 0) {
        console.log(`📋 恢复指定集合: ${options.collections.join(', ')}`);
        // 为每个集合单独恢复
        for (const collection of options.collections) {
          const collectionPath = path.join(restorePath, `${collection}.bson`);
          try {
            await fs.access(collectionPath);
            const collectionCommand = `${command} --collection="${collection}" "${collectionPath}"`;
            await execAsync(collectionCommand);
            console.log(`✅ 集合 ${collection} 恢复完成`);
          } catch {
            console.warn(`⚠️  集合 ${collection} 的备份文件不存在，跳过`);
          }
        }
      } else {
        // 恢复整个数据库
        command += ` "${restorePath}"`;
        await execAsync(command);
        console.log('✅ 数据库恢复完成');
      }
      
      // 清理临时文件
      if (options.backupPath.endsWith('.tar.gz')) {
        const tempDir = path.join(this.backupDir, 'temp_restore');
        await fs.rm(tempDir, { recursive: true, force: true });
      }
      
    } catch (error) {
      console.error('❌ 恢复失败:', error);
      throw error;
    }
  }

  /**
   * 列出所有备份
   */
  async listBackups(): Promise<Array<{ name: string; path: string; size: string; date: Date }>> {
    try {
      await this.ensureBackupDir();
      const files = await fs.readdir(this.backupDir);
      const backups = [];
      
      for (const file of files) {
        const filePath = path.join(this.backupDir, file);
        const stats = await fs.stat(filePath);
        
        if (file.startsWith('backup_') && (stats.isDirectory() || file.endsWith('.tar.gz'))) {
          backups.push({
            name: file,
            path: filePath,
            size: this.formatBytes(stats.size),
            date: stats.mtime
          });
        }
      }
      
      return backups.sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('❌ 获取备份列表失败:', error);
      return [];
    }
  }

  /**
   * 删除备份
   */
  async deleteBackup(backupName: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupName);
    
    try {
      await fs.access(backupPath);
      
      const stats = await fs.stat(backupPath);
      if (stats.isDirectory()) {
        await fs.rm(backupPath, { recursive: true, force: true });
      } else {
        await fs.unlink(backupPath);
      }
      
      console.log(`✅ 备份已删除: ${backupName}`);
    } catch (error) {
      console.error(`❌ 删除备份失败: ${error}`);
      throw error;
    }
  }

  /**
   * 清理旧备份（保留最近N个）
   */
  async cleanupOldBackups(keepCount: number = 5): Promise<void> {
    const backups = await this.listBackups();
    
    if (backups.length <= keepCount) {
      console.log(`📋 当前有 ${backups.length} 个备份，无需清理`);
      return;
    }
    
    const toDelete = backups.slice(keepCount);
    console.log(`🗑️  清理 ${toDelete.length} 个旧备份...`);
    
    for (const backup of toDelete) {
      await this.deleteBackup(backup.name);
    }
    
    console.log(`✅ 清理完成，保留最近 ${keepCount} 个备份`);
  }

  /**
   * 获取目录大小
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    try {
      const stats = await fs.stat(dirPath);
      if (stats.isFile()) {
        return stats.size;
      }
      
      let totalSize = 0;
      const files = await fs.readdir(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileStats = await fs.stat(filePath);
        
        if (fileStats.isDirectory()) {
          totalSize += await this.getDirectorySize(filePath);
        } else {
          totalSize += fileStats.size;
        }
      }
      
      return totalSize;
    } catch {
      return 0;
    }
  }

  /**
   * 格式化字节大小
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    console.log('  npm run db:backup backup [--compress] [--collections=col1,col2]');
    console.log('  npm run db:backup restore <backup-path> [--drop] [--collections=col1,col2]');
    console.log('  npm run db:backup list');
    console.log('  npm run db:backup cleanup [count]');
    console.log('  npm run db:backup delete <backup-name>');
    return;
  }
  
  const backup = new DatabaseBackup();
  
  try {
    switch (command) {
      case 'backup': {
        const collectionsArg = args.find(arg => arg.startsWith('--collections='))?.split('=')[1]?.split(',');
        const options: BackupOptions = {
          compress: args.includes('--compress'),
          ...(collectionsArg && { collections: collectionsArg })
        };
        
        const backupPath = await backup.backup(options);
        console.log(`🎉 备份成功: ${backupPath}`);
        break;
      }
      
      case 'restore': {
        const backupPath = args[1];
        if (!backupPath) {
          console.error('❌ 请指定备份路径');
          process.exit(1);
        }
        
        const collectionsArg = args.find(arg => arg.startsWith('--collections='))?.split('=')[1]?.split(',');
        const options: RestoreOptions = {
          backupPath,
          dropExisting: args.includes('--drop'),
          ...(collectionsArg && { collections: collectionsArg })
        };
        
        await backup.restore(options);
        console.log('🎉 恢复成功');
        break;
      }
      
      case 'list': {
        const backups = await backup.listBackups();
        if (backups.length === 0) {
          console.log('📋 没有找到备份文件');
        } else {
          console.log('📋 备份列表:');
          backups.forEach((b, index) => {
            console.log(`  ${index + 1}. ${b.name}`);
            console.log(`     大小: ${b.size}`);
            console.log(`     日期: ${b.date.toLocaleString()}`);
            console.log('');
          });
        }
        break;
      }
      
      case 'cleanup': {
        const keepCount = parseInt(args[1] || '5');
        await backup.cleanupOldBackups(keepCount);
        break;
      }
      
      case 'delete': {
        const backupName = args[1];
        if (!backupName) {
          console.error('❌ 请指定要删除的备份名称');
          process.exit(1);
        }
        
        await backup.deleteBackup(backupName);
        break;
      }
      
      default:
        console.error(`❌ 未知命令: ${command}`);
        process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ 操作失败:', error);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1] || ''}`) {
  main();
}

export { DatabaseBackup };