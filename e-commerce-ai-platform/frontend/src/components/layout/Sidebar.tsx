'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUIStore } from '@/store';
import { cn } from '@/lib/utils';
import { EcommerceLogo } from '@/components/ui/EcommerceLogo';
import { 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  ClipboardList, 
  Package, 
  Settings, 
  TrendingUp,
  User
} from 'lucide-react';

// 导航菜单项
const menuItems = [
  {
    name: '仪表板',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: '任务管理',
    href: '/tasks',
    icon: ClipboardList,
  },
  {
    name: '产品管理',
    href: '/products',
    icon: Package,
  },
  {
    name: '脚本管理',
    href: '/scripts',
    icon: Settings,
  },
  {
    name: '数据分析',
    href: '/analytics',
    icon: TrendingUp,
  },
  {
    name: '系统设置',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  return (
    <div className={cn(
      "fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-300 z-40",
      sidebarCollapsed ? "w-16" : "w-64"
    )}>
      {/* Logo区域 */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
        <div className={cn(
          "flex items-center space-x-2",
          sidebarCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <EcommerceLogo size={20} className="text-blue-600" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-gray-900 dark:text-white">
              电商AI平台
            </span>
          )}
        </div>
        
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="收缩侧边栏"
          >
            <ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* 展开按钮 - 仅在收缩状态下显示 */}
      {sidebarCollapsed && (
        <div className="px-2 mt-6">
          <button
            onClick={toggleSidebar}
            className="w-full p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
            title="展开侧边栏"
          >
            <ChevronRight size={20} className="text-gray-500 dark:text-gray-400 mx-auto" />
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
              展开侧边栏
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          </button>
        </div>
      )}

      {/* 导航菜单 */}
      <nav className={cn("mt-6", sidebarCollapsed && "mt-4")}>
        <ul className="space-y-3 px-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors relative group",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                    sidebarCollapsed && "justify-center px-2 py-3"
                  )}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <IconComponent size={20} className="flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                  
                  {/* 悬浮提示 - 仅在收缩状态下显示 */}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                      {item.name}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* 底部用户信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-5 border-t border-gray-200 dark:border-gray-700">
        <div className={cn(
          "flex items-center relative group",
          sidebarCollapsed ? "justify-center" : "space-x-3"
        )}>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-gray-600 dark:text-gray-400" />
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                管理员
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                admin@example.com
              </p>
            </div>
          )}
          
          {/* 用户信息悬浮提示 - 仅在收缩状态下显示 */}
          {sidebarCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap bottom-0">
              管理员 (admin@example.com)
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}