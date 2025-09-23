export declare enum ConnectionStatus {
    DISCONNECTED = "disconnected",
    CONNECTING = "connecting",
    CONNECTED = "connected",
    DISCONNECTING = "disconnecting",
    ERROR = "error"
}
export declare const connectDB: () => Promise<void>;
export declare const disconnectDB: () => Promise<void>;
export declare const getConnectionStatus: () => ConnectionStatus;
export declare const checkDatabaseHealth: () => Promise<{
    status: ConnectionStatus;
    latency?: number;
    error?: string;
}>;
export declare const dbUtils: {
    cleanupExpiredData: (collectionName: string, expiryField: string, expiryTime: Date) => Promise<number>;
    getCollectionStats: (collectionName: string) => Promise<any>;
    createIndex: (collectionName: string, indexSpec: any, options?: any) => Promise<string>;
};
declare const _default: {
    connectDB: () => Promise<void>;
    disconnectDB: () => Promise<void>;
    getConnectionStatus: () => ConnectionStatus;
    checkDatabaseHealth: () => Promise<{
        status: ConnectionStatus;
        latency?: number;
        error?: string;
    }>;
    dbUtils: {
        cleanupExpiredData: (collectionName: string, expiryField: string, expiryTime: Date) => Promise<number>;
        getCollectionStats: (collectionName: string) => Promise<any>;
        createIndex: (collectionName: string, indexSpec: any, options?: any) => Promise<string>;
    };
};
export default _default;
//# sourceMappingURL=database.d.ts.map