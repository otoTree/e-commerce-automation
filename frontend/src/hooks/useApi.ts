import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../lib/api';
import type { Product, ProductQueryOptions } from '../lib/api';
import type { 
  OperationTask, 
  Campaign, 
  User, 
  SystemConfig,
  ApiResponse 
} from '../types';

// 通用API状态类型
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// 通用API Hook
function useApiState<T>(initialData: T | null = null): [
  ApiState<T>,
  (data: T | null) => void,
  (loading: boolean) => void,
  (error: string | null) => void
] {
  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const setData = useCallback((data: T | null) => {
    setState(prev => ({ ...prev, data }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  return [state, setData, setLoading, setError];
}

// 商品相关hooks
export function useProducts(options?: ProductQueryOptions) {
  const [state, setData, setLoading, setError] = useApiState<Product[]>([]);

  // 使用useMemo稳定options引用，避免无限循环
  const stableOptions = useMemo(() => options, [
    options?.search,
    options?.status,
    options?.category,
    options?.page,
    options?.limit
  ]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.products.getProducts(stableOptions);
      if (response.success) {
        // 后端返回的数据结构是 {data: {products: Product[]}}
        const products = response.data?.products || [];
        setData(products);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取商品列表失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [stableOptions, setData, setLoading, setError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    ...state,
    refetch: fetchProducts,
  };
}

export function useProduct(id: string) {
  const [state, setData, setLoading, setError] = useApiState<Product>();

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.products.getProduct(id);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取商品详情失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [id, setData, setLoading, setError]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    ...state,
    refetch: fetchProduct,
  };
}

// 任务相关hooks
export function useTasks(options?: {
  page?: number;
  limit?: number;
  status?: string;
  priority?: string;
  assignee?: string;
}) {
  const [state, setData, setLoading, setError] = useApiState<OperationTask[]>([]);

  // 使用useMemo稳定options引用，避免无限循环
  const stableOptions = useMemo(() => options, [
    options?.page,
    options?.limit,
    options?.status,
    options?.priority,
    options?.assignee
  ]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.tasks.getTasks(stableOptions);
      if (response.success) {
        setData(response.data || []);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取任务列表失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [stableOptions, setData, setLoading, setError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    ...state,
    refetch: fetchTasks,
  };
}

export function useTask(id: string) {
  const [state, setData, setLoading, setError] = useApiState<OperationTask>();

  const fetchTask = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.tasks.getTask(id);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取任务详情失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [id, setData, setLoading, setError]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  return {
    ...state,
    refetch: fetchTask,
  };
}

// 营销活动相关hooks
export function useCampaigns(options?: {
  page?: number;
  limit?: number;
  status?: string;
  type?: string;
}) {
  const [state, setData, setLoading, setError] = useApiState<Campaign[]>([]);

  // 使用useMemo稳定options引用，避免无限循环
  const stableOptions = useMemo(() => options, [
    options?.page,
    options?.limit,
    options?.status,
    options?.type
  ]);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.campaigns.getCampaigns(stableOptions);
      if (response.success) {
        setData(response.data || []);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取营销活动列表失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [stableOptions, setData, setLoading, setError]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return {
    ...state,
    refetch: fetchCampaigns,
  };
}

export function useCampaign(id: string) {
  const [state, setData, setLoading, setError] = useApiState<Campaign>();

  const fetchCampaign = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.campaigns.getCampaign(id);
      if (response.success) {
        setData(response.data || null);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取营销活动详情失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [id, setData, setLoading, setError]);

  useEffect(() => {
    fetchCampaign();
  }, [fetchCampaign]);

  return {
    ...state,
    refetch: fetchCampaign,
  };
}

// 用户相关hooks
export function useCurrentUser() {
  const [state, setData, setLoading, setError] = useApiState<User>();

  const fetchCurrentUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.auth.getCurrentUser();
      if (response.success) {
        setData(response.data || null);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取用户信息失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return {
    ...state,
    refetch: fetchCurrentUser,
  };
}

// 系统配置相关hooks
export function useSystemConfigs() {
  const [state, setData, setLoading, setError] = useApiState<SystemConfig[]>([]);

  const fetchConfigs = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.system.getConfigs();
      if (response.success) {
        setData(response.data || []);
      } else {
        setError('error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '获取系统配置失败');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : '网络错误');
    } finally {
      setLoading(false);
    }
  }, [setData, setLoading, setError]);

  useEffect(() => {
    fetchConfigs();
  }, [fetchConfigs]);

  return {
    ...state,
    refetch: fetchConfigs,
  };
}

// 通用mutation hook
export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>
) {
  const [state, setState] = useState<{
    data: TData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (variables: TVariables) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await mutationFn(variables);
      if (response.success) {
        setState({
          data: response.data || null,
          loading: false,
          error: null,
        });
        return response;
      } else {
        const errorMsg = 'error' in response && response.error ? (typeof response.error === 'string' ? response.error : response.error.message) : '操作失败';
        setState({
          data: null,
          loading: false,
          error: errorMsg,
        });
        throw new Error(errorMsg);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络错误';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
      throw error;
    }
  }, [mutationFn]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}

// 文件上传hook
export function useFileUpload() {
  return useMutation<{ url: string; filename: string }, File>(
    (file: File) => api.files.uploadFile(file)
  );
}

// 认证相关mutations
export function useLogin() {
  return useMutation<{ user: User; token: string }, { email: string; password: string }>(
    (credentials) => api.auth.login(credentials)
  );
}

export function useLogout() {
  return useMutation<Record<string, never>, void>(
    () => api.auth.logout()
  );
}