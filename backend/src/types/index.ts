export interface ExtensionInfo {
  id: string;
  lastSeen: Date;
  userAgent?: string | undefined;
}

export interface CrawlTask {
  id: string;
  url: string;
  type: '1688' | 'taobao' | 'tmall';
  status: 'pending' | 'assigned' | 'completed' | 'failed';
  assignedTo?: string;
  createdAt: Date;
  completedAt?: Date;
  data?: any;
  error?: string;
}

export interface TaskCreateRequest {
  url: string;
  type: '1688' | 'taobao' | 'tmall';
}

export interface TaskCompleteRequest {
  data?: any;
  success: boolean;
  error?: string;
}

export interface ProductSubmitRequest {
  url: string;
  timestamp?: string;
  products: any[];
  total?: number;
  source?: string;
}

export interface ExtensionRegisterRequest {
  extensionId: string;
}

export interface ExtensionHeartbeatRequest {
  extensionId: string;
}