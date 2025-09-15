// 运营任务状态
export type OperationTaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

// 运营任务类型
export type OperationTaskType = 'full_operation' | 'analysis_only' | 'content_only' | 'marketing_only';

// 任务进度状态
export type TaskProgressStatus = 'pending' | 'in_progress' | 'completed' | 'skipped' | 'failed';

// 任务进度
export interface TaskProgress {
  analysis: TaskProgressStatus;
  content: TaskProgressStatus;
  marketing: TaskProgressStatus;
  tracking: TaskProgressStatus;
}

// 任务结果
export interface TaskResults {
  analysisScore?: number;
  contentGenerated?: number;
  marketingPlansCreated?: number;
  performanceMetrics?: PerformanceMetrics | null;
}

// 性能指标
export interface PerformanceMetrics {
  views: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number; // 点击率
  cvr: number; // 转化率
  roas: number; // 广告支出回报率
}

// 运营任务
export interface OperationTask {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  status: OperationTaskStatus;
  type: OperationTaskType;
  createdAt: Date;
  updatedAt: Date;
  progress: TaskProgress;
  results: TaskResults;
  description?: string;
  tags?: string[];
}

// 商品分析结果
export interface ProductAnalysisResult {
  id: string;
  taskId: string;
  overallScore: number;
  marketPotential: {
    score: number;
    trends: string[];
    seasonality: string;
    competition: 'low' | 'medium' | 'high';
  };
  targetAudience: {
    demographics: string[];
    interests: string[];
    painPoints: string[];
    buyingBehavior: string;
  };
  competitorAnalysis: {
    mainCompetitors: string[];
    priceRange: { min: number; max: number };
    differentiators: string[];
    marketGaps: string[];
  };
  recommendations: {
    pricing: string;
    positioning: string;
    channels: string[];
    timeline: string;
  };
  createdAt: Date;
}

// 内容生成类型
export type ContentType = 'title' | 'description' | 'features' | 'keywords' | 'images' | 'video';

// 生成的内容
export interface GeneratedContent {
  id: string;
  taskId: string;
  type: ContentType;
  platform: string; // 'ozon' | 'wildberries' | 'yandex_market' | 'avito'
  language: string; // 'ru' | 'en'
  content: string;
  metadata?: Record<string, any>;
  status: 'draft' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// 内容生成请求
export interface ContentGenerationRequest {
  taskId: string;
  types: ContentType[];
  platforms: string[];
  languages: string[];
  requirements?: {
    tone?: 'professional' | 'casual' | 'persuasive' | 'informative';
    length?: 'short' | 'medium' | 'long';
    keywords?: string[];
    targetAudience?: string;
  };
}

// 营销策略
export interface MarketingStrategy {
  id: string;
  taskId: string;
  name: string;
  description: string;
  channels: MarketingChannel[];
  budget: {
    total: number;
    allocation: Record<string, number>;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    milestones: Milestone[];
  };
  kpis: KPI[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

// 营销渠道
export interface MarketingChannel {
  id: string;
  name: string;
  type: 'paid_ads' | 'social_media' | 'content_marketing' | 'email' | 'influencer' | 'seo';
  platform: string;
  budget: number;
  expectedReach: number;
  expectedCtr: number;
  expectedCvr: number;
}

// 里程碑
export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  deliverables: string[];
}

// 关键绩效指标
export interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  category: 'traffic' | 'conversion' | 'revenue' | 'engagement';
}

// 创建运营任务请求
export interface CreateOperationTaskRequest {
  productId: string;
  productName: string;
  productImage: string;
  type: OperationTaskType;
  description?: string;
  tags?: string[];
}

// 更新任务进度请求
export interface UpdateTaskProgressRequest {
  taskId: string;
  step: keyof TaskProgress;
  status: TaskProgressStatus;
  results?: Partial<TaskResults>;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 分页响应
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 运营任务查询参数
export interface OperationTaskQuery {
  status?: OperationTaskStatus[];
  type?: OperationTaskType[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}