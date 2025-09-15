class ExtensionService {
    registeredExtensions = new Map();
    register(extensionId, userAgent) {
        this.registeredExtensions.set(extensionId, {
            id: extensionId,
            lastSeen: new Date(),
            userAgent
        });
        console.log(`Extension registered: ${extensionId}`);
    }
    updateHeartbeat(extensionId) {
        const extension = this.registeredExtensions.get(extensionId);
        if (!extension) {
            return false;
        }
        extension.lastSeen = new Date();
        return true;
    }
    isRegistered(extensionId) {
        return this.registeredExtensions.has(extensionId);
    }
    getAllExtensions() {
        return Array.from(this.registeredExtensions.values());
    }
    cleanupExpiredExtensions() {
        const now = new Date();
        const expiredExtensions = [];
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
//# sourceMappingURL=extensionService.js.map