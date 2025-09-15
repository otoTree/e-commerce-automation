import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import {
  LayoutDashboard,
  Package,
  CheckSquare,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  User,
  LogOut,
  Moon,
  Sun,
  Monitor,
  ChevronDown,
  Home,
  Activity,
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: '仪表板',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'products',
    label: '商品管理',
    path: '/products',
    icon: Package,
    badge: {
      text: '12',
      variant: 'secondary',
    },
  },
  {
    id: 'selection',
    label: 'AI选品助手',
    path: '/selection',
    icon: CheckSquare,
    badge: {
      text: '2',
      variant: 'default',
    },
  },
  {
    id: 'operations',
    label: 'AI运营助手',
    path: '/operations',
    icon: Settings,
    badge: {
      text: '3',
      variant: 'destructive',
    },
  },
  {
    id: 'crawler-health',
    label: '爬虫健康监控',
    path: '/crawler-health',
    icon: Activity,
  },
  {
    id: 'settings',
    label: '系统设置',
    path: '/settings',
    icon: Settings,
  },
];

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const router = useRouter();
  const pathname = usePathname();

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  const toggleTheme = () => {
    const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
    
    // 这里可以添加实际的主题切换逻辑
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system theme - 检测系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun;
      case 'dark':
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  return (
    <div className="min-h-screen bg-background">
      {/* 移动端侧边栏遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-64 transform bg-card border-r transition-transform duration-200 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* 侧边栏头部 */}
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">电商AI助手</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={isActiveRoute(item.path) ? 'secondary' : 'ghost'}
              className={cn(
                'w-full justify-start h-10',
                isActiveRoute(item.path) && 'bg-secondary text-secondary-foreground'
              )}
              onClick={() => handleNavigation(item.path)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <Badge variant={item.badge.variant} className="ml-2 text-xs">
                  {item.badge.text}
                </Badge>
              )}
            </Button>
          ))}
        </nav>

        {/* 侧边栏底部 */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
            <Avatar className="w-8 h-8">
              <AvatarImage src="/api/placeholder/32/32" alt="用户头像" />
              <AvatarFallback>用户</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">管理员</p>
              <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="lg:ml-64">
        {/* 顶部导航栏 */}
        <header className="sticky top-0 z-30 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-16 items-center justify-between px-6">
            {/* 左侧 */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-4 h-4" />
              </Button>

              {/* 面包屑导航 */}
              <nav className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>首页</span>
                {pathname !== '/' && (
                  <>
                    <span>/</span>
                    <span className="text-foreground">
                      {navigationItems.find(item => 
                        item.path !== '/' && pathname.startsWith(item.path)
                      )?.label || '页面'}
                    </span>
                  </>
                )}
              </nav>
            </div>

            {/* 右侧 */}
            <div className="flex items-center space-x-4">
              {/* 搜索 */}
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Search className="w-4 h-4 mr-2" />
                <span className="text-sm text-muted-foreground">搜索...</span>
                <kbd className="ml-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>

              {/* 通知 */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs" variant="destructive">
                  3
                </Badge>
              </Button>

              {/* 主题切换 */}
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                <ThemeIcon className="w-4 h-4" />
              </Button>

              {/* 用户菜单 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="用户头像" />
                      <AvatarFallback>用户</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">管理员</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        admin@example.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>个人资料</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>设置</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;