'use client'

import React from 'react'
import { Button } from '../ui/button'
import { Menu, Bell, User } from 'lucide-react'
import { useAuth } from '../../store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

interface HeaderProps {
  onMenuClick: () => void
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 左侧：移动端菜单按钮 */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-xl font-semibold text-gray-900 lg:ml-0">
            电商AI助手
          </h1>
        </div>

        {/* 右侧：通知和用户菜单 */}
        <div className="flex items-center space-x-4">
          {/* 通知按钮 */}
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>

          {/* 用户菜单 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span className="hidden md:inline">{user?.username || '用户'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>个人设置</DropdownMenuItem>
              <DropdownMenuItem onClick={logout}>
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}