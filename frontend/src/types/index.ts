// 通用类型定义

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

// 分页类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 分页响应类型
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination
}

// 用户相关类型
export interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'guest'
  avatar?: string
  createdAt: string
  updatedAt: string
}

// 认证相关类型
export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface LoginResponse {
  token: string
  user: User
  expiresIn: number
}

// 产品相关类型
export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  category: string
  tags: string[]
  stock: number
  sku: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: string
  updatedAt: string
}

// 订单相关类型
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  total: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: Address
  billingAddress: Address
  createdAt: string
  updatedAt: string
}

// 地址类型
export interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

// 数据收集相关类型
export interface DataSource {
  id: string
  name: string
  type: 'website' | 'api' | 'file' | 'database'
  url?: string
  config: Record<string, unknown>
  status: 'active' | 'inactive' | 'error'
  lastSync?: string
  createdAt: string
  updatedAt: string
}

export interface DataExtractionRule {
  id: string
  name: string
  selector: string
  attribute?: string
  transform?: string
  required: boolean
}

export interface DataExtractionConfig {
  id: string
  name: string
  sourceId: string
  rules: DataExtractionRule[]
  schedule?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// 分析相关类型
export interface AnalysisReport {
  id: string
  title: string
  type: 'market' | 'competitor' | 'trend' | 'performance'
  data: Record<string, unknown>
  insights: string[]
  recommendations: string[]
  createdAt: string
  updatedAt: string
}

export interface MetricData {
  label: string
  value: number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  unit?: string
}

// 表单相关类型
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface FormData {
  [key: string]: unknown
}

export interface FormErrors {
  [key: string]: string
}

// 通知类型
export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  actions?: Array<{
    label: string
    action: () => void
  }>
  createdAt: string
}

// 主题类型
export type Theme = 'light' | 'dark' | 'system'

// 语言类型
export type Language = 'zh-CN' | 'en-US' | 'ja-JP'

// 应用设置类型
export interface AppSettings {
  theme: Theme
  language: Language
  notifications: {
    email: boolean
    push: boolean
    desktop: boolean
  }
  privacy: {
    analytics: boolean
    cookies: boolean
  }
}

// 错误类型
export interface AppError {
  code: string
  message: string
  details?: unknown
  timestamp: string
}

// 加载状态类型
export interface LoadingState {
  [key: string]: boolean
}

// 通用状态类型
export interface BaseState {
  loading: boolean
  error: string | null
  lastUpdated?: string
}

// 事件类型
export interface AppEvent {
  type: string
  payload?: unknown
  timestamp: string
}

// 路由类型
export interface Route {
  path: string
  name: string
  component?: string
  meta?: {
    title?: string
    requiresAuth?: boolean
    roles?: string[]
  }
}

// 菜单项类型
export interface MenuItem {
  id: string
  label: string
  icon?: string
  path?: string
  children?: MenuItem[]
  permissions?: string[]
}

// 权限类型
export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

// 角色类型
export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
}

// 文件上传类型
export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  url?: string
  error?: string
}

// 搜索类型
export interface SearchParams {
  query?: string
  filters?: Record<string, unknown>
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
  pagination?: {
    page: number
    pageSize: number
  }
}

export interface SearchResult<T> {
  items: T[]
  total: number
  facets?: Record<string, Array<{ value: string; count: number }>>
}