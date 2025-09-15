// 统一类型导出文件

// 用户相关类型
export * from './user';

// 商品相关类型
export * from './product';

// 任务相关类型
export * from './task';

// API相关类型
export type {
  ApiResponse,
  SystemConfig,
  AuditLog,
  Notification,
  FileUpload,
  FileUploadRequest,
  DashboardStats,
  ChartDataPoint,
  ErrorCode,
  HttpMethod,
  ApiRequestConfig,
  PaginationParams,
  SortParams,
  SearchParams,
  BatchOperationRequest,
  BatchOperationResponse
} from './api';

// 重新导出有冲突的类型，使用别名
export type {
  PaginationMeta as ApiPaginationMeta,
  TrendData as ApiTrendData
} from './api';

// UI组件类型
export * from './ui';

// 重新导出有冲突的商品类型，使用别名
export type {
  PaginationConfig as ProductPaginationConfig
} from './product';

// 通用工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 状态管理相关类型
export interface StoreState {
  loading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends StoreState {
  data: T | null;
}

export interface ListState<T> extends StoreState {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  filters: Record<string, unknown>;
  sortBy: {
    field: string;
    order: 'asc' | 'desc';
  } | null;
}

// 表单相关类型
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'date' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string | null;
  };
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// 路由相关类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
  title?: string;
  requireAuth?: boolean;
  roles?: string[];
  children?: RouteConfig[];
}

// 主题相关类型
export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: number;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

// 国际化相关类型
export interface I18nConfig {
  locale: string;
  fallbackLocale: string;
  messages: Record<string, Record<string, string>>;
}

// 权限相关类型
export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, unknown>;
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
}

// 事件相关类型
export interface EventHandler<T = unknown> {
  (event: T): void;
}

export interface AsyncEventHandler<T = unknown> {
  (event: T): Promise<void>;
}

// 工具函数类型
export type Debounced<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
};

export type Throttled<T extends (...args: unknown[]) => unknown> = {
  (...args: Parameters<T>): void;
  cancel: () => void;
};