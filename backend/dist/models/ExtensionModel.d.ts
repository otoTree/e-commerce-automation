import mongoose, { Document } from 'mongoose';
export interface IExtension extends Document {
    extension_id: string;
    name: string;
    version: string;
    status: 'active' | 'inactive' | 'error';
    info: {
        user_agent: string;
        browser_version: string;
        platform: string;
        capabilities: string[];
    };
    connection: {
        last_heartbeat: Date;
        is_online: boolean;
        ip_address?: string;
    };
    stats: {
        total_tasks: number;
        completed_tasks: number;
        failed_tasks: number;
        last_task_at?: Date;
    };
    meta: {
        registered_at: Date;
        last_active_at: Date;
    };
}
export declare const ExtensionModel: mongoose.Model<IExtension, {}, {}, {}, mongoose.Document<unknown, {}, IExtension, {}, {}> & IExtension & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ExtensionModel.d.ts.map