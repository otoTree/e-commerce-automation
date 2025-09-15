// 运营任务相关类型定义

export interface OperationTask {
  id: string;
  product_id: string;
  type: 'content_optimization' | 'translation' | 'upload' | 'monitoring';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  title: string;
  description: string;
  content: TaskContent;
  ai_suggestions: AISuggestion[];
  execution_log: ExecutionLog[];
  progress: number;
  scheduled_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface TaskContent {
  original_content: ContentItem[];
  optimized_content: ContentItem[];
  translations: Translation[];
  target_platforms: TargetPlatform[];
}

export interface ContentItem {
  type: 'title' | 'description' | 'keywords' | 'images';
  content: string | string[];
  metadata: Record<string, string | number | boolean>;
}

export interface Translation {
  language: string;
  content: ContentItem[];
  quality_score: number;
  reviewed: boolean;
}

export interface TargetPlatform {
  platform: string;
  config: PlatformConfig;
}

export interface PlatformConfig {
  category_id?: string;
  attributes?: Record<string, string | number>;
  pricing_strategy?: 'fixed' | 'dynamic' | 'competitive';
  inventory_sync?: boolean;
}

export interface AISuggestion {
  id: string;
  type: 'content_improvement' | 'seo_optimization' | 'translation_fix';
  suggestion: string;
  confidence: number;
  applied: boolean;
  created_at: Date;
}

export interface ExecutionLog {
  id: string;
  action: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  timestamp: Date;
  metadata?: Record<string, string | number | boolean>;
}

// 营销活动相关类型
export interface Campaign {
  id: string;
  name: string;
  description: string;
  type: 'promotion' | 'seasonal' | 'clearance' | 'new_product';
  product_ids: string[];
  target_platforms: string[];
  content_templates: ContentTemplate[];
  schedule: CampaignSchedule;
  performance_metrics: PerformanceMetrics;
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface ContentTemplate {
  platform: string;
  template_type: 'title' | 'description' | 'image' | 'video';
  template_content: string;
  variables: TemplateVariable[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean';
  default_value: string | number | boolean;
  required: boolean;
}

export interface CampaignSchedule {
  start_date: Date;
  end_date: Date;
  timezone: string;
  recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number;
  days_of_week?: number[];
  day_of_month?: number;
}

export interface PerformanceMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
}

// 任务管理组件Props类型
export interface TaskKanbanProps {
  tasks: OperationTask[];
  columns: KanbanColumn[];
  onTaskMove: (taskId: string, newStatus: string) => void;
  onTaskEdit: (task: OperationTask) => void;
  onTaskCreate: () => void;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: string;
  color: string;
  limit?: number;
}

export interface TaskCardProps {
  task: OperationTask;
  compact: boolean;
  showProgress: boolean;
  onStatusChange: (taskId: string, status: string) => void;
  onAssign: (taskId: string, userId: string) => void;
}

export interface TaskDetailProps {
  taskId: string;
  showExecutionLog: boolean;
  showAISuggestions: boolean;
  onContentEdit: (content: TaskContent) => void;
  onApplySuggestion: (suggestionId: string) => void;
}

// 内容编辑组件Props类型
export interface ContentEditorProps {
  content: ContentItem[];
  aiSuggestions: AISuggestion[];
  onContentChange: (content: ContentItem[]) => void;
  onRequestAISuggestion: (type: string) => void;
  onApplySuggestion: (suggestion: AISuggestion) => void;
}

export interface TranslationPanelProps {
  originalContent: ContentItem[];
  translations: Translation[];
  targetLanguages: string[];
  onTranslate: (languages: string[]) => void;
  onEditTranslation: (language: string, content: ContentItem[]) => void;
}

export interface PlatformUploadProps {
  platforms: TargetPlatform[];
  content: TaskContent;
  uploadStatus: UploadStatus[];
  onUpload: (platforms: string[]) => void;
  onRetry: (platform: string) => void;
}

export interface UploadStatus {
  platform: string;
  status: 'pending' | 'uploading' | 'success' | 'failed';
  message?: string;
  progress?: number;
  uploaded_at?: Date;
}

// API请求类型
export interface CreateTaskRequest {
  product_id: string;
  type: 'content_optimization' | 'translation' | 'upload' | 'monitoring';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  title: string;
  description: string;
  scheduled_at?: string;
  content: {
    target_platforms: TargetPlatform[];
  };
}

export interface UpdateTaskRequest {
  type?: 'content_optimization' | 'translation' | 'upload' | 'monitoring';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: string;
  title?: string;
  description?: string;
  scheduled_at?: string;
  content?: TaskContent;
}

export interface TaskStatusUpdateRequest {
  status: 'in_progress' | 'completed' | 'failed' | 'cancelled';
  message?: string;
}

export interface TaskAssignRequest {
  assigned_to: string;
}

export interface AISuggestionRequest {
  type: 'content_improvement' | 'seo_optimization' | 'translation_fix';
  context?: Record<string, string | number | boolean>;
}

export interface TranslationRequest {
  target_languages: string[];
  content_types?: ('title' | 'description' | 'keywords')[];
}

export interface UploadRequest {
  platforms: string[];
  dry_run?: boolean;
}