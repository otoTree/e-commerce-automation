// API通用响应类型

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string | number | boolean>;
  };
  meta?: {
    pagination?: PaginationMeta;
    timestamp: string;
    request_id: string;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 系统配置类型
export interface SystemConfig {
  id: string;
  category: 'ai' | 'platform' | 'notification' | 'security';
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  description: string;
  is_encrypted: boolean;
  updated_by: string;
  updated_at: Date;
}

// 审计日志类型
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
}

// 通知类型
export interface Notification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  action_text?: string;
  created_at: Date;
  read_at?: Date;
}

// 文件上传类型
export interface FileUpload {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  url: string;
  thumbnail_url?: string;
  uploaded_at: Date;
}

export interface FileUploadRequest {
  file: File;
  type: 'image' | 'document' | 'video';
  category: 'product_image' | 'avatar' | 'attachment';
}

// 统计分析类型
export interface DashboardStats {
  overview: {
    total_products: number;
    active_tasks: number;
    completed_tasks_today: number;
    revenue: number;
  };
  trends: {
    products_added: TrendData;
    tasks_completed: TrendData;
    revenue_growth: TrendData;
  };
  charts: {
    products_by_status: ChartDataPoint[];
    tasks_by_type: ChartDataPoint[];
    revenue_by_month: ChartDataPoint[];
  };
}

export interface TrendData {
  current: number;
  previous: number;
  change_percent: number;
  period: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

// 错误码枚举
export enum ErrorCode {
  // 认证相关
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  INSUFFICIENT_PERMISSIONS = 'AUTH_004',
  
  // 用户相关
  USER_NOT_FOUND = 'USER_001',
  USER_ALREADY_EXISTS = 'USER_002',
  INVALID_PASSWORD = 'USER_003',
  
  // 商品相关
  PRODUCT_NOT_FOUND = 'PRODUCT_001',
  PRODUCT_ALREADY_EXISTS = 'PRODUCT_002',
  INVALID_PRODUCT_DATA = 'PRODUCT_003',
  PRODUCT_ANALYSIS_FAILED = 'PRODUCT_004',
  
  // 任务相关
  TASK_NOT_FOUND = 'TASK_001',
  TASK_INVALID_STATUS = 'TASK_002',
  TASK_ASSIGNMENT_FAILED = 'TASK_003',
  
  // 文件相关
  FILE_TOO_LARGE = 'FILE_001',
  INVALID_FILE_TYPE = 'FILE_002',
  FILE_UPLOAD_FAILED = 'FILE_003',
  
  // 系统相关
  RATE_LIMIT_EXCEEDED = 'SYSTEM_001',
  SERVICE_UNAVAILABLE = 'SYSTEM_002',
  MAINTENANCE_MODE = 'SYSTEM_003'
}

// HTTP方法类型
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// API请求配置
export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
}

// 分页请求参数
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 排序参数
export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// 搜索参数
export interface SearchParams {
  search?: string;
  filters?: Record<string, string | number | boolean | string[] | number[]>;
}

// 批量操作请求
export interface BatchOperationRequest {
  action: string;
  ids: string[];
  params?: Record<string, unknown>;
}

// 批量操作响应
export interface BatchOperationResponse {
  success_count: number;
  failed_count: number;
  errors: {
    id: string;
    error: string;
  }[];
}