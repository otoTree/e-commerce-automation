import React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Package, Search, Plus, AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  const defaultIcon = <Package className="h-12 w-12 text-muted-foreground" />;

  return (
    <div className={cn(
      'flex min-h-[400px] w-full flex-col items-center justify-center p-8 text-center',
      className
    )}>
      <div className="mb-4">
        {icon || defaultIcon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <Button
          variant={action.variant || 'default'}
          onClick={action.onClick}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {action.label}
        </Button>
      )}
    </div>
  );
};

// 预定义的空状态组件
const NoProducts: React.FC<{ onAddProduct?: () => void }> = ({ onAddProduct }) => (
  <EmptyState
    icon={<Package className="h-12 w-12 text-muted-foreground" />}
    title="暂无商品"
    description="还没有添加任何商品，开始创建您的第一个商品吧。"
    action={onAddProduct ? {
      label: '添加商品',
      onClick: onAddProduct,
    } : undefined}
  />
);

const NoSearchResults: React.FC<{ onClearSearch?: () => void }> = ({ onClearSearch }) => (
  <EmptyState
    icon={<Search className="h-12 w-12 text-muted-foreground" />}
    title="未找到相关结果"
    description="尝试调整搜索条件或清除筛选器来查看更多内容。"
    action={onClearSearch ? {
      label: '清除搜索',
      onClick: onClearSearch,
      variant: 'outline',
    } : undefined}
  />
);

const NoWorkflows: React.FC<{ onCreateWorkflow?: () => void }> = ({ onCreateWorkflow }) => (
  <EmptyState
    icon={<AlertCircle className="h-12 w-12 text-muted-foreground" />}
    title="暂无工作流"
    description="还没有创建任何工作流，开始创建您的第一个工作流吧。"
    action={onCreateWorkflow ? {
      label: '创建工作流',
      onClick: onCreateWorkflow,
    } : undefined}
  />
);

const NoCampaigns: React.FC<{ onCreateCampaign?: () => void }> = ({ onCreateCampaign }) => (
  <EmptyState
    icon={<Package className="h-12 w-12 text-muted-foreground" />}
    title="暂无营销活动"
    description="还没有创建任何营销活动，开始创建您的第一个活动吧。"
    action={onCreateCampaign ? {
      label: '创建活动',
      onClick: onCreateCampaign,
    } : undefined}
  />
);

export { 
  EmptyState, 
  NoProducts, 
  NoSearchResults, 
  NoWorkflows, 
  NoCampaigns 
};