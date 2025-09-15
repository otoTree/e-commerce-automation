// API 基础配置和服务
// 使用Next.js API路由作为代理，而不是直接访问后端
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
const API_TIMEOUT = 30000; // 30秒超时

// 导入类型定义
import type {
  ApiResponse,
  User,
  LoginRequest,
  RegisterRequest,
  OperationTask,
  CreateTaskRequest,
  UpdateTaskRequest,
  Campaign,
  SystemConfig,
  DashboardStats,
  PaginationParams,
  SortParams,
  SearchParams
} from '../types';

// 商品相关类型
export interface Product {
  _id: string;
  id: string; // 后端返回的id字段
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  category: string;
  brand?: string;
  supplier?: string;
  images: string[];
  specifications?: Record<string, string | number | boolean>;
  stock: number;
  sku?: string; // 商品SKU
  status: 'active' | 'inactive' | 'out_of_stock';
  rating?: {
    average: number;
    count: number;
  };
  tags?: string[];
  sales?: string; // 销量信息
  source?: {
    platform: string;
    url: string;
    extractedAt: string;
  };
  discountPercentage?: number;
  inStock?: boolean;
  sourceUrl?: string;
  sourceId?: string;
  sourcePlatform?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number; // MongoDB版本字段
}

// 商品查询选项
export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  search?: string;
  sortBy?: 'createdAt' | 'price' | 'name' | 'rating.average';
  sortOrder?: 'asc' | 'desc';
}

// 商品统计信息
export interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  outOfStockProducts: number;
  totalInventoryValue: number;
  averagePrice: number;
  categoryCounts: Record<string, number>;
  brandCounts: Record<string, number>;
}

// 商品列表API响应数据结构
export interface ProductListResponse {
  products: Product[];
}

// 通用 API 请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 获取认证token
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    signal: AbortSignal.timeout(API_TIMEOUT),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // 处理认证失败
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }
      throw new Error('Authentication failed');
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// 构建查询参数
function buildQueryParams(
  pagination?: PaginationParams,
  sort?: SortParams,
  search?: SearchParams,
  filters?: Record<string, unknown>
): string {
  const params = new URLSearchParams();

  // 分页参数
  if (pagination?.page) params.append('page', pagination.page.toString());
  if (pagination?.limit) params.append('limit', pagination.limit.toString());

  // 排序参数
  if (sort?.sort_by) params.append('sort_by', sort.sort_by);
  if (sort?.sort_order) params.append('sort_order', sort.sort_order);

  // 搜索参数
  if (search?.search) params.append('search', search.search);
  if (search?.filters) {
    Object.entries(search.filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.append(key, value.join(','));
      } else if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  // 额外过滤器
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  return params.toString();
}

// 商品 API 服务
export const productApi = {
  // 获取商品列表
  async getProducts(options: ProductQueryOptions = {}): Promise<ApiResponse<ProductListResponse>> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    
    // 直接返回API响应，后端已经返回正确的ProductListResponse格式
    return apiRequest<ProductListResponse>(endpoint);
  },

  // 获取单个商品
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return apiRequest<Product>(`/products/${id}`);
  },

  // 获取商品统计信息
  async getProductStats(): Promise<ApiResponse<ProductStats>> {
    return apiRequest<ProductStats>('/products/stats');
  },

  // 导入1688商品数据
  async import1688Products(products: unknown[]): Promise<ApiResponse<{ success: number; failed: number }>> {
    return apiRequest<{ success: number; failed: number }>('/products/import/1688', {
      method: 'POST',
      body: JSON.stringify({ products }),
    });
  },

  // 清空所有商品（测试用）
  async clearAllProducts(): Promise<ApiResponse<{ deletedCount: number }>> {
    return apiRequest<{ deletedCount: number }>('/products/clear', {
      method: 'DELETE',
    });
  },
};

// 健康检查
export const healthApi = {
  async check(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
    return apiRequest<{ status: string; timestamp: string }>('/health');
  },
};

// 用户认证 API
export const authApi = {
  // 登录
  async login(credentials: LoginRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // 保存token
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  // 注册
  async register(userData: RegisterRequest): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // 保存token
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },

  // 登出
  async logout(): Promise<ApiResponse<Record<string, never>>> {
    const response = await apiRequest<Record<string, never>>('/auth/logout', {
      method: 'POST',
    });
    
    // 清除token
    localStorage.removeItem('auth_token');
    
    return response;
  },

  // 获取当前用户信息
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiRequest<User>('/auth/me');
  },

  // 刷新token
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await apiRequest<{ token: string }>('/auth/refresh', {
      method: 'POST',
    });
    
    // 更新token
    if (response.success && response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    
    return response;
  },
};

// 任务管理 API
export const taskApi = {
  // 获取任务列表
  async getTasks(
    pagination?: PaginationParams,
    sort?: SortParams,
    search?: SearchParams,
    filters?: { status?: string; type?: string; priority?: string; assigned_to?: string }
  ): Promise<ApiResponse<OperationTask[]>> {
    const queryString = buildQueryParams(pagination, sort, search, filters);
    const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;
    return apiRequest<OperationTask[]>(endpoint);
  },

  // 获取单个任务
  async getTask(id: string): Promise<ApiResponse<OperationTask>> {
    return apiRequest<OperationTask>(`/tasks/${id}`);
  },

  // 创建任务
  async createTask(taskData: CreateTaskRequest): Promise<ApiResponse<OperationTask>> {
    return apiRequest<OperationTask>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // 更新任务
  async updateTask(id: string, updates: UpdateTaskRequest): Promise<ApiResponse<OperationTask>> {
    return apiRequest<OperationTask>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // 删除任务
  async deleteTask(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiRequest<Record<string, never>>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // 批量操作任务
  async batchUpdateTasks(
    ids: string[],
    updates: Partial<OperationTask>
  ): Promise<ApiResponse<{ updated: number }>> {
    return apiRequest<{ updated: number }>('/tasks/batch', {
      method: 'PATCH',
      body: JSON.stringify({ ids, updates }),
    });
  },
};

// 营销活动 API
export const campaignApi = {
  // 获取活动列表
  async getCampaigns(
    pagination?: PaginationParams,
    sort?: SortParams,
    search?: SearchParams
  ): Promise<ApiResponse<Campaign[]>> {
    const queryString = buildQueryParams(pagination, sort, search);
    const endpoint = `/campaigns${queryString ? `?${queryString}` : ''}`;
    return apiRequest<Campaign[]>(endpoint);
  },

  // 获取单个活动
  async getCampaign(id: string): Promise<ApiResponse<Campaign>> {
    return apiRequest<Campaign>(`/campaigns/${id}`);
  },

  // 创建活动
  async createCampaign(campaignData: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    return apiRequest<Campaign>('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  },

  // 更新活动
  async updateCampaign(id: string, updates: Partial<Campaign>): Promise<ApiResponse<Campaign>> {
    return apiRequest<Campaign>(`/campaigns/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // 删除活动
  async deleteCampaign(id: string): Promise<ApiResponse<Record<string, never>>> {
    return apiRequest<Record<string, never>>(`/campaigns/${id}`, {
      method: 'DELETE',
    });
  },
};

// 系统配置 API
export const systemApi = {
  // 获取系统配置
  async getConfigs(): Promise<ApiResponse<SystemConfig[]>> {
    return apiRequest<SystemConfig[]>('/system/configs');
  },

  // 更新系统配置
  async updateConfig(key: string, value: unknown): Promise<ApiResponse<SystemConfig>> {
    return apiRequest<SystemConfig>(`/system/configs/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ value }),
    });
  },

  // 获取仪表板统计数据
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiRequest<DashboardStats>('/system/dashboard/stats');
  },
};

// 文件上传 API
export const fileApi = {
  // 上传文件
  async uploadFile(
    file: File,
    type: 'image' | 'document' | 'video' = 'image'
  ): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return apiRequest<{ url: string; filename: string }>('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // 让浏览器自动设置Content-Type
    });
  },

  // 删除文件
  async deleteFile(filename: string): Promise<ApiResponse<Record<string, never>>> {
    return apiRequest<Record<string, never>>(`/files/${filename}`, {
      method: 'DELETE',
    });
  },
};

// 导出默认 API 实例
export default {
  auth: authApi,
  products: productApi,
  tasks: taskApi,
  campaigns: campaignApi,
  system: systemApi,
  files: fileApi,
  health: healthApi,
};

// 导出工具函数
export { buildQueryParams };