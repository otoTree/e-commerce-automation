'use client';

import { useUIStore, useNotificationStore, useSystemStore } from '@/store';
import { cn } from '@/lib/utils';
import { SimpleDropdown as HeaderDropdown } from '@/components/ui/SimpleDropdown';
import { ChevronDown, Bell, Sun, Moon, User } from 'lucide-react';

export function Header() {
  const { theme, setTheme } = useUIStore();
  const { notifications, unreadCount } = useNotificationStore();
  const { systemStatus } = useSystemStore();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* 左侧：面包屑导航 */}
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            仪表板
          </h1>
        </div>

        {/* 右侧：操作按钮 */}
        <div className="flex items-center space-x-4">
          {/* 系统状态指示器 */}
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              systemStatus?.services.backend ? "bg-green-500" : "bg-red-500"
            )}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {systemStatus?.services.backend ? '在线' : '离线'}
            </span>
          </div>

          {/* 通知菜单 */}
          <HeaderDropdown
            placement="bottom-end"
            trigger={
              <div className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
            }
          >
            <div className="py-2 min-w-[300px]">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">通知</h3>
              </div>
              {notifications?.length > 0 ? (
                <div className="max-h-80 overflow-y-auto">
                  {notifications.slice(0, 5).map((notification, index) => (
                    <div key={index} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0">
                      <p className="text-sm text-gray-900 dark:text-white">{notification.title || '新通知'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.message || '暂无详情'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">暂无新通知</p>
                </div>
              )}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  查看全部通知
                </button>
              </div>
            </div>
          </HeaderDropdown>

          {/* 主题切换按钮 */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {/* 用户菜单 */}
          <HeaderDropdown
            placement="bottom-end"
            trigger={
              <div className="flex items-center space-x-2 p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-600 dark:text-gray-400" />
                </div>
                <span className="text-sm font-medium">管理员</span>
                <ChevronDown size={16} />
              </div>
            }
          >
            <div className="py-2 min-w-[200px]">
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">管理员</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
                  </div>
                </div>
              </div>
              <div className="py-1">
                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  个人资料
                </a>
                <a href="/account-settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  账户设置
                </a>
                <a href="/help-center" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  帮助中心
                </a>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  退出登录
                </a>
              </div>
            </div>
          </HeaderDropdown>
        </div>
      </div>
    </header>
  );
}