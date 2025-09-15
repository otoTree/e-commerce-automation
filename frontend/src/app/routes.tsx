'use client';

import React from 'react';
import { Dashboard } from '../components/dashboard';
import { ProductsPage } from '../components/products';
import { SelectionPage } from '../components/selection/SelectionPage';
import { OperationsPage } from '../components/operations/OperationsPage';

// 路由配置类型
export interface RouteConfig {
  path: string;
  component: React.ComponentType;
  title: string;
  requireAuth?: boolean;
  roles?: string[];
}

// 应用路由配置
export const routes: RouteConfig[] = [
  {
    path: '/',
    component: Dashboard,
    title: '仪表板',
    requireAuth: true,
  },
  {
    path: '/products',
    component: ProductsPage,
    title: '商品管理',
    requireAuth: true,
  },
  {
    path: '/selection',
    component: SelectionPage,
    title: 'AI选品助手',
    requireAuth: true,
  },
  {
    path: '/operations',
    component: OperationsPage,
    title: 'AI运营助手',
    requireAuth: true,
  },
];

// 根据路径获取路由配置
export function getRouteConfig(path: string): RouteConfig | undefined {
  return routes.find(route => {
    if (route.path === '/') {
      return path === '/';
    }
    return path.startsWith(route.path);
  });
}

// 获取页面标题
export function getPageTitle(path: string): string {
  const route = getRouteConfig(path);
  return route ? route.title : '页面';
}

// 检查路由是否需要认证
export function requiresAuth(path: string): boolean {
  const route = getRouteConfig(path);
  return route?.requireAuth ?? false;
}

// 检查用户是否有权限访问路由
export function hasPermission(path: string, userRoles: string[] = []): boolean {
  const route = getRouteConfig(path);
  
  if (!route?.roles || route.roles.length === 0) {
    return true; // 没有角色限制
  }
  
  return route.roles.some(role => userRoles.includes(role));
}

export default routes;