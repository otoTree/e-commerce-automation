import type { ExtensionInfo } from '../types/index.js';

class ExtensionService {
  private registeredExtensions = new Map<string, ExtensionInfo>();

  register(extensionId: string, userAgent?: string): void {
    this.registeredExtensions.set(extensionId, {
      id: extensionId,
      lastSeen: new Date(),
      userAgent
    });
    console.log(`Extension registered: ${extensionId}`);
  }

  updateHeartbeat(extensionId: string): boolean {
    const extension = this.registeredExtensions.get(extensionId);
    if (!extension) {
      return false;
    }
    extension.lastSeen = new Date();
    return true;
  }

  isRegistered(extensionId: string): boolean {
    return this.registeredExtensions.has(extensionId);
  }

  getAllExtensions(): ExtensionInfo[] {
    return Array.from(this.registeredExtensions.values());
  }

  cleanupExpiredExtensions(): void {
    const now = new Date();
    const expiredExtensions: string[] = [];
    
    this.registeredExtensions.forEach((extension, id) => {
      const timeDiff = now.getTime() - extension.lastSeen.getTime();
      if (timeDiff > 5 * 60 * 1000) { // 5分钟
        expiredExtensions.push(id);
      }
    });
    
    expiredExtensions.forEach(id => {
      this.registeredExtensions.delete(id);
      console.log(`Removed expired extension: ${id}`);
    });
  }
}

export const extensionService = new ExtensionService();