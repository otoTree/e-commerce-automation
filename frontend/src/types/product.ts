// 商品相关类型定义

export interface Product {
  id: string;
  source_url: string;
  source_platform: '1688' | 'taobao' | 'tmall';
  title: string;
  description: string;
  images: ProductImage[];
  price: ProductPrice;
  supplier: SupplierInfo;
  specifications: ProductSpecification[];
  logistics: LogisticsInfo;
  market_analysis: MarketAnalysis;
  ai_analysis: AIAnalysis;
  status: 'pending' | 'analyzing' | 'approved' | 'rejected' | 'published';
  created_at: Date;
  updated_at: Date;
  analyzed_at?: Date;
}

export interface ProductImage {
  id: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  order: number;
}

export interface ProductPrice {
  original_price: number;
  wholesale_price: number;
  suggested_retail_price: number;
  currency: string;
  price_tiers: PriceTier[];
}

export interface PriceTier {
  min_quantity: number;
  max_quantity?: number;
  unit_price: number;
}

export interface SupplierInfo {
  id: string;
  name: string;
  rating: number;
  location: string;
  contact: ContactInfo;
  verification_status: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  wechat?: string;
}

export interface ProductSpecification {
  name: string;
  value: string;
  unit?: string;
}

export interface LogisticsInfo {
  shipping_cost: number;
  shipping_time: string;
  available_methods: ShippingMethod[];
  weight: number;
  dimensions: Dimensions;
}

export interface ShippingMethod {
  name: string;
  cost: number;
  time: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface MarketAnalysis {
  competition_level: 'low' | 'medium' | 'high';
  demand_trend: 'rising' | 'stable' | 'declining';
  profit_margin: number;
  market_size: number;
  seasonal_factors: SeasonalFactor[];
}

export interface SeasonalFactor {
  season: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AIAnalysis {
  quality_score: number;
  profit_potential: number;
  risk_assessment: RiskAssessment;
  recommendations: string[];
  confidence_level: number;
}

export interface RiskAssessment {
  overall_risk: 'low' | 'medium' | 'high';
  factors: string[];
}

// 商品集合相关类型
export interface ProductCollection {
  id: string;
  name: string;
  description: string;
  user_id: string;
  product_ids: string[];
  filters: ProductFilter[];
  created_at: Date;
  updated_at: Date;
}

export interface ProductFilter {
  field: string;
  operator: 'eq' | 'gt' | 'lt' | 'in' | 'contains';
  value: string | number | boolean | string[] | number[];
}

// API响应类型
export interface ProductListResponse {
  success: boolean;
  data: {
    products: Product[];
  };
  meta: {
    pagination: PaginationMeta;
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



// 组件Props类型
export interface ProductCardProps {
  product: Product;
  variant: 'compact' | 'detailed' | 'grid';
  showActions: boolean;
  onSelect?: (product: Product) => void;
  onAnalyze?: (productId: string) => void;
  onAddToCollection?: (productId: string) => void;
}

export interface ProductListProps {
  products: Product[];
  loading: boolean;
  filters: ProductFilter[];
  sortBy: SortOption;
  viewMode: 'grid' | 'list' | 'table';
  pagination: PaginationConfig;
  onFilterChange: (filters: ProductFilter[]) => void;
  onSortChange: (sortBy: SortOption) => void;
  onProductSelect: (product: Product) => void;
}

export interface ProductDetailProps {
  productId: string;
  showAnalysis: boolean;
  showSupplierInfo: boolean;
  onEdit?: (product: Product) => void;
  onAnalyze?: () => void;
}

export interface ProductAnalysisPanelProps {
  analysis: AIAnalysis;
  marketData: MarketAnalysis;
  showRecommendations: boolean;
  onAcceptRecommendation: (recommendation: string) => void;
}

// 筛选和搜索相关类型
export interface FilterDefinition {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'range';
  options?: { label: string; value: string | number }[];
}

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'product' | 'category' | 'supplier';
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: ProductFilter[];
  created_at: Date;
}

export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
  label: string;
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
}

// 筛选器组件Props
export interface AdvancedFiltersProps {
  availableFilters: FilterDefinition[];
  activeFilters: ProductFilter[];
  onFiltersChange: (filters: ProductFilter[]) => void;
  onReset: () => void;
}

export interface SearchBarProps {
  placeholder: string;
  suggestions: SearchSuggestion[];
  onSearch: (query: string) => void;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
}

export interface SavedSearchesProps {
  searches: SavedSearch[];
  onLoad: (search: SavedSearch) => void;
  onSave: (name: string, filters: ProductFilter[]) => void;
  onDelete: (searchId: string) => void;
}