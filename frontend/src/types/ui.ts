// 通用UI组件类型定义

import { ReactNode } from 'react';

// 数据表格组件类型
export interface DataTableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading: boolean;
  pagination: PaginationConfig;
  sorting: SortConfig;
  selection: SelectionConfig<T>;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (selected: T[]) => void;
}

export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface PaginationConfig {
  page: number;
  limit: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
}

export interface SortConfig {
  field?: string;
  order?: 'asc' | 'desc';
  multiple?: boolean;
}

export interface SelectionConfig<T> {
  type: 'checkbox' | 'radio';
  selectedRowKeys: string[];
  onSelect?: (record: T, selected: boolean) => void;
  onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
  getCheckboxProps?: (record: T) => { disabled?: boolean };
}

// 统计卡片组件类型
export interface StatsCardProps {
  title: string;
  value: number | string;
  trend?: TrendData;
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'error';
  loading?: boolean;
  onClick?: () => void;
}

export interface TrendData {
  value: number;
  type: 'increase' | 'decrease';
  suffix?: string;
}

// 图表组件类型
export interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'area' | 'donut';
  data: ChartData;
  options?: ChartOptions;
  height?: number;
  responsive?: boolean;
  loading?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  plugins?: {
    legend?: {
      display?: boolean;
      position?: 'top' | 'bottom' | 'left' | 'right';
    };
    tooltip?: {
      enabled?: boolean;
    };
  };
  scales?: {
    x?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      display?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
}

// 模态框组件类型
export interface ModalProps {
  isOpen: boolean;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  maskClosable?: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

// 确认对话框类型
export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  confirmText?: string;
  cancelText?: string;
  confirmButtonType?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

// 通知组件类型
export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  closable?: boolean;
  onClose: () => void;
}

// 加载状态类型
export interface LoadingProps {
  spinning: boolean;
  size?: 'small' | 'default' | 'large';
  tip?: string;
  children?: ReactNode;
}

// 空状态组件类型
export interface EmptyStateProps {
  image?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

// 搜索框组件类型
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  loading?: boolean;
  allowClear?: boolean;
  onSearch: (value: string) => void;
  onChange?: (value: string) => void;
  onClear?: () => void;
}

// 筛选器组件类型
export interface FilterProps {
  filters: FilterItem[];
  values: Record<string, unknown>;
  onChange: (values: Record<string, unknown>) => void;
  onReset: () => void;
}

export interface FilterItem {
  key: string;
  label: string;
  type: 'input' | 'select' | 'date' | 'dateRange' | 'number' | 'numberRange';
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  multiple?: boolean;
}

// 标签组件类型
export interface TagProps {
  children: ReactNode;
  color?: string;
  variant?: 'default' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  closable?: boolean;
  onClose?: () => void;
}

// 徽章组件类型
export interface BadgeProps {
  count?: number;
  showZero?: boolean;
  overflowCount?: number;
  dot?: boolean;
  status?: 'success' | 'processing' | 'default' | 'error' | 'warning';
  color?: string;
  text?: string;
  children?: ReactNode;
}

// 步骤条组件类型
export interface StepsProps {
  current: number;
  direction?: 'horizontal' | 'vertical';
  size?: 'default' | 'small';
  status?: 'wait' | 'process' | 'finish' | 'error';
  items: StepItem[];
  onChange?: (current: number) => void;
}

export interface StepItem {
  title: string;
  description?: string;
  icon?: ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
}

// 进度条组件类型
export interface ProgressProps {
  percent: number;
  status?: 'normal' | 'exception' | 'active' | 'success';
  strokeColor?: string;
  trailColor?: string;
  strokeWidth?: number;
  showInfo?: boolean;
  format?: (percent: number) => ReactNode;
}

// 上传组件类型
export interface UploadProps {
  accept?: string;
  multiple?: boolean;
  maxCount?: number;
  maxSize?: number;
  listType?: 'text' | 'picture' | 'picture-card';
  showUploadList?: boolean;
  beforeUpload?: (file: File) => boolean | Promise<boolean>;
  onChange?: (info: UploadChangeParam) => void;
  onPreview?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
}

export interface UploadFile {
  uid: string;
  name: string;
  status: 'uploading' | 'done' | 'error' | 'removed';
  url?: string;
  thumbUrl?: string;
  response?: unknown;
  error?: Error;
  percent?: number;
  originFileObj?: File;
}

export interface UploadChangeParam {
  file: UploadFile;
  fileList: UploadFile[];
}

// 布局组件类型
export interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export interface HeaderProps extends LayoutProps {
  title?: string;
  extra?: ReactNode;
  breadcrumb?: BreadcrumbItem[];
}

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: ReactNode;
}

export interface SidebarProps extends LayoutProps {
  collapsed?: boolean;
  width?: number;
  collapsedWidth?: number;
  onCollapse?: (collapsed: boolean) => void;
}

export interface ContentProps extends LayoutProps {
  loading?: boolean;
}

// 导航组件类型
export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  path?: string;
  children?: NavigationItem[];
  badge?: string | number;
  disabled?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  selectedKeys?: string[];
  openKeys?: string[];
  mode?: 'horizontal' | 'vertical' | 'inline';
  theme?: 'light' | 'dark';
  onSelect?: (item: NavigationItem) => void;
  onOpenChange?: (openKeys: string[]) => void;
}