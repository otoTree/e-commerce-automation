import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full',
};

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-6 py-4',
  lg: 'px-8 py-6',
};

export function ResponsiveContainer({
  children,
  className,
  maxWidth = 'full',
  padding = 'md',
  center = false,
}: ResponsiveContainerProps) {
  return (
    <div
      className={cn(
        'w-full',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

// 响应式网格组件
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg';
}

const gapClasses = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
};

export function ResponsiveGrid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
}: ResponsiveGridProps) {
  const gridClasses = [];
  
  if (cols.default) gridClasses.push(`grid-cols-${cols.default}`);
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div
      className={cn(
        'grid',
        gapClasses[gap],
        ...gridClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

// 响应式堆栈组件
interface ResponsiveStackProps {
  children: React.ReactNode;
  className?: string;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  gap?: 'sm' | 'md' | 'lg';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

const alignClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export function ResponsiveStack({
  children,
  className,
  direction = { default: 'col', md: 'row' },
  gap = 'md',
  align = 'start',
  justify = 'start',
}: ResponsiveStackProps) {
  const directionClasses = [];
  
  if (direction.default) {
    directionClasses.push(direction.default === 'row' ? 'flex-row' : 'flex-col');
  }
  if (direction.sm) {
    directionClasses.push(direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col');
  }
  if (direction.md) {
    directionClasses.push(direction.md === 'row' ? 'md:flex-row' : 'md:flex-col');
  }
  if (direction.lg) {
    directionClasses.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col');
  }

  return (
    <div
      className={cn(
        'flex',
        gapClasses[gap],
        alignClasses[align],
        justifyClasses[justify],
        ...directionClasses,
        className
      )}
    >
      {children}
    </div>
  );
}

// 响应式隐藏/显示组件
interface ResponsiveVisibilityProps {
  children: React.ReactNode;
  hideOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  showOn?: ('sm' | 'md' | 'lg' | 'xl')[];
  className?: string;
}

export function ResponsiveVisibility({
  children,
  hideOn = [],
  showOn = [],
  className,
}: ResponsiveVisibilityProps) {
  const visibilityClasses = [];
  
  // 默认显示
  if (showOn.length > 0) {
    visibilityClasses.push('hidden');
    showOn.forEach(breakpoint => {
      visibilityClasses.push(`${breakpoint}:block`);
    });
  }
  
  // 隐藏在特定断点
  hideOn.forEach(breakpoint => {
    visibilityClasses.push(`${breakpoint}:hidden`);
  });

  return (
    <div className={cn(...visibilityClasses, className)}>
      {children}
    </div>
  );
}

export default ResponsiveContainer;