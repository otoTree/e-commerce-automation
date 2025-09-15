import type { ExtensionInfo } from '../types/index.js';
declare class ExtensionService {
    private registeredExtensions;
    register(extensionId: string, userAgent?: string): void;
    updateHeartbeat(extensionId: string): boolean;
    isRegistered(extensionId: string): boolean;
    getAllExtensions(): ExtensionInfo[];
    cleanupExpiredExtensions(): void;
}
export declare const extensionService: ExtensionService;
export {};
//# sourceMappingURL=extensionService.d.ts.map