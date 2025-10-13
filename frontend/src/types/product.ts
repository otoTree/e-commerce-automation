// 产品数据类型定义
export interface ProductVariant {
  skuId: number;
  color: string;
  type: string;
  weight: number;
  fullName: string;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    volume?: number;
  };
  attributes?: Record<string, unknown>;
}

export interface ProductImage {
  fullPathImageURI?: string;
  imageURI?: string;
  '310x310'?: string;
  '220x220'?: string;
  '48x48'?: string;
  '64x64'?: string;
  '100x100'?: string;
  url?: string;
  src?: string;
  originalUrl?: string;
  thumbnailUrl?: string;
}

export interface ServiceProtection {
  code?: string;
  name: string;
  description?: string;
  type?: string;
  enabled?: boolean;
}

export interface ShippingInfo {
  location: string;
  targetLocation: string;
  cost: number;
  deliveryPromise: string;
  freeShipping: boolean;
}

export interface ProductDescription {
  detailUrl?: string;
  images?: string[];
}

export interface FeatureAttribute {
  fid: number;
  isSpecial: boolean;
  lectotype: boolean;
  name: string;
  outputType: number;
  value: string;
  values: string[];
}

export interface ProductMetadata {
  extractedAt: Date;
  source: 'html' | 'context';
  offerId: number;
}

export interface ProductData {
  productId: string;
  title: string;
  seller: string;
  price?: string;
  variants: ProductVariant[];
  shipping: ShippingInfo;
  protections: ServiceProtection[];
  images?: ProductImage[];
  description?: string | object;
  featureAttributes?: FeatureAttribute[];
  metadata: ProductMetadata;
  // 数据来源和 Ozon 附加数据（统一前后端数据结构）
  source?: '1688' | 'ozon';
  ozonData?: OzonProductData;
}

// Ozon产品数据类型
export interface OzonPrice {
  current?: string;
  currency?: string;
  original?: string;
  withCard?: string;
  withoutCard?: string;
}

export interface OzonRating {
  score?: number;
  reviewCount?: number;
}

export interface OzonAvailability {
  inStock?: boolean;
}

export interface OzonPromotions {
  specialOffer?: string;
  saleEndDate?: string;
}

export interface OzonDelivery {
  freeShipping?: boolean;
}

export interface OzonMetadata {
  extractedAt: Date;
  source: string;
}

export interface OzonProductData {
  productId: string;
  title: string;
  price?: OzonPrice;
  rating?: OzonRating;
  images?: string[];
  availability?: OzonAvailability;
  promotions?: OzonPromotions;
  delivery?: OzonDelivery;
  attributes?: Record<string, unknown>;
  seller?: string;
  metadata?: OzonMetadata;
}

// 提取的产品数据类型
export interface ExtractedProduct {
  _id?: string; // MongoDB unique identifier
  url: string;
  size: number;
  timestamp: string;
  uploadedAt: Date;
  productData: ProductData | null;
  ozonProductData?: OzonProductData | null;
  extractionError: string | null;
}

// API响应类型
export interface ProductUploadResponse {
  success: boolean;
  message: string;
  data: ExtractedProduct;
}

// 插件健康状态类型
export interface PluginHealthStatus {
  isConnected: boolean;
  lastHeartbeat?: Date;
  version?: string;
  status: 'active' | 'inactive' | 'error';
  errorMessage?: string;
  metrics?: {
    pagesProcessed: number;
    successRate: number;
    averageProcessingTime: number;
  };
}

// 任务相关类型定义 - 与后端模型保持一致
export interface Task {
  _id?: string // MongoDB ID
  id?: string // 前端生成的临时ID，用于本地状态管理
  type: 'url' | 'keyword' | 'batch_url' | 'search_1688'
  title: string
  description?: string
  
  // URL相关字段
  url?: string
  urls?: string[]
  
  // 关键词相关字段
  keywords?: string[]
  
  // 任务状态和元数据
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority: 'low' | 'medium' | 'high'
  
  // 执行结果
  result?: unknown
  errorMessage?: string
  
  // 进度跟踪
  progress: number
  totalItems?: number
  processedItems: number
  
  // 调度相关
  scheduledAt?: Date
  startedAt?: Date
  completedAt?: Date
  
  // 重试机制
  retryCount: number
  maxRetries: number
  
  // 元数据
  metadata?: Record<string, unknown>
  tags: string[]
  
  createdAt: Date
  updatedAt: Date
}

export interface TaskFilter {
  status?: 'pending' | 'processing' | 'completed' | 'failed'
  priority?: 'low' | 'medium' | 'high'
  type?: 'url' | 'keyword' | 'batch_url' | 'search_1688'
  assignee?: string
  dateRange?: {
    start: Date
    end: Date
  }
  tags?: string[]
}

export interface TaskStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  completionRate: number; // 完成率百分比
  averageDuration: number; // 平均执行时长（分钟）
}