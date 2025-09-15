import { create } from 'zustand';
import type { Product, ProductListResponse, PaginationMeta, ProductFilter, PaginationConfig } from '../types';

interface FilterState {
  category: string;
  status: string;
  price_range: { min: number; max: number };
  search_query: string;
  sort_by: string;
  sort_order: 'asc' | 'desc';
  filters: ProductFilter[];
}

interface ProductState {
  // 商品数据
  products: Product[];
  selectedProduct: Product | null;
  
  // 列表状态
  loading: boolean;
  error: string | null;
  
  // 分页和筛选
  pagination: PaginationConfig;
  filters: FilterState;
  
  // Actions
  setProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  
  // 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 分页
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setPagination: (pagination: Partial<PaginationConfig>) => void;
  
  // 筛选
  setFilters: (filters: Partial<FilterState>) => void;
  addFilter: (filter: ProductFilter) => void;
  removeFilter: (key: string) => void;
  clearFilters: () => void;
  
  // 排序
  setSortBy: (field: string, order: 'asc' | 'desc') => void;
  
  // 搜索
  setSearchQuery: (query: string) => void;
  
  // 批量操作
  selectProducts: (ids: string[]) => void;
  clearSelection: () => void;
  getSelectedProducts: () => Product[];
}

const initialPagination: PaginationConfig = {
  page: 1,
  limit: 20,
  total: 0
};

const initialFilters: FilterState = {
  category: '',
  status: '',
  price_range: { min: 0, max: 0 },
  search_query: '',
  sort_by: 'created_at',
  sort_order: 'desc',
  filters: []
};

export const useProductStore = create<ProductState>()((set, get) => ({
  // 初始状态
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: initialPagination,
  filters: initialFilters,
  
  // Actions
  setProducts: (products: Product[]) => set({ products }),
  
  setSelectedProduct: (product: Product | null) => set({ selectedProduct: product }),
  
  addProduct: (product: Product) => set((state) => ({
    products: [product, ...state.products]
  })),
  
  updateProduct: (id: string, updates: Partial<Product>) => set((state) => ({
    products: state.products.map(product => 
      product.id === id ? { ...product, ...updates } : product
    ),
    selectedProduct: state.selectedProduct?.id === id 
      ? { ...state.selectedProduct, ...updates }
      : state.selectedProduct
  })),
  
  removeProduct: (id: string) => set((state) => ({
    products: state.products.filter(product => product.id !== id),
    selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct
  })),
  
  // 状态管理
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // 分页
  setPage: (page: number) => set((state) => ({
    pagination: { ...state.pagination, page }
  })),
  
  setPageSize: (limit: number) => set((state) => ({
    pagination: { ...state.pagination, limit, page: 1 }
  })),
  
  setPagination: (pagination: Partial<PaginationConfig>) => set((state) => ({
    pagination: { ...state.pagination, ...pagination }
  })),
  
  // 筛选
  setFilters: (filters: Partial<FilterState>) => set((state) => ({
    filters: { ...state.filters, ...filters },
    pagination: { ...state.pagination, page: 1 } // 重置到第一页
  })),
  
  addFilter: (filter: ProductFilter) => set((state) => {
    const existingIndex = state.filters.filters.findIndex((f: ProductFilter) => f.field === filter.field);
    const newFilters = [...state.filters.filters];
    
    if (existingIndex >= 0) {
      newFilters[existingIndex] = filter;
    } else {
      newFilters.push(filter);
    }
    
    return {
      filters: {
        ...state.filters,
        filters: newFilters
      },
      pagination: { ...state.pagination, page: 1 }
    };
  }),
  
  removeFilter: (field: string) => set((state) => ({
    filters: {
      ...state.filters,
      filters: state.filters.filters.filter((f: ProductFilter) => f.field !== field)
    },
    pagination: { ...state.pagination, page: 1 }
  })),
  
  clearFilters: () => set((state) => ({
    filters: initialFilters,
    pagination: { ...state.pagination, page: 1 }
  })),
  
  // 排序
  setSortBy: (field: string, order: 'asc' | 'desc') => set((state) => ({
    filters: {
      ...state.filters,
      sort_by: field,
      sort_order: order
    },
    pagination: { ...state.pagination, page: 1 }
  })),
  
  // 搜索
  setSearchQuery: (query: string) => set((state) => ({
    filters: {
      ...state.filters,
      search_query: query
    },
    pagination: { ...state.pagination, page: 1 }
  })),
  
  // 批量操作
  selectProducts: (ids: string[]) => {
    // 这里可以添加选中状态的管理
    // 暂时简化实现
  },
  
  clearSelection: () => {
    // 清除选中状态
  },
  
  getSelectedProducts: () => {
    // 返回选中的商品
    return [];
  }
}));

// 选择器函数
export const selectProducts = (state: ProductState) => state.products;
export const selectSelectedProduct = (state: ProductState) => state.selectedProduct;
export const selectLoading = (state: ProductState) => state.loading;
export const selectError = (state: ProductState) => state.error;
export const selectPagination = (state: ProductState) => state.pagination;
export const selectFilters = (state: ProductState) => state.filters;

// Hook 快捷方式
export const useProducts = () => {
  const { 
    products, 
    loading, 
    error, 
    setProducts, 
    addProduct, 
    updateProduct, 
    removeProduct,
    setLoading,
    setError,
    clearError
  } = useProductStore();
  
  return {
    products,
    loading,
    error,
    setProducts,
    addProduct,
    updateProduct,
    removeProduct,
    setLoading,
    setError,
    clearError
  };
};

export const useProductFilters = () => {
  const {
    filters,
    pagination,
    setFilters,
    addFilter,
    removeFilter,
    clearFilters,
    setSortBy,
    setSearchQuery,
    setPage,
    setPageSize
  } = useProductStore();
  
  return {
    filters,
    pagination,
    setFilters,
    addFilter,
    removeFilter,
    clearFilters,
    setSortBy,
    setSearchQuery,
    setPage,
    setPageSize
  };
};

export const useProductSelection = () => {
  const { selectedProduct, setSelectedProduct } = useProductStore();
  return { selectedProduct, setSelectedProduct };
};