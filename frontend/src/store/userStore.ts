'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 用户信息接口
export interface User {
  id: string
  username: string
  email: string
  role: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

// 用户状态接口
interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
}

// 用户操作接口
interface UserActions {
  setCurrentUser: (user: User | null) => void
  setUsers: (users: User[]) => void
  addUser: (user: User) => void
  updateUser: (id: string, updates: Partial<User>) => void
  removeUser: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  reset: () => void
}

// 用户 Store 类型
export type UserStore = UserState & UserActions

// 初始状态
const initialState: UserState = {
  currentUser: null,
  users: [],
  loading: false,
  error: null
}

// 创建用户 Store
export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // 设置当前用户
      setCurrentUser: (user) => set({ currentUser: user }),

      // 设置用户列表
      setUsers: (users) => set({ users }),

      // 添加用户
      addUser: (user) => set((state) => ({
        users: [...state.users, user]
      })),

      // 更新用户
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(user => 
          user.id === id ? { ...user, ...updates } : user
        ),
        currentUser: state.currentUser?.id === id 
          ? { ...state.currentUser, ...updates }
          : state.currentUser
      })),

      // 删除用户
      removeUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id),
        currentUser: state.currentUser?.id === id ? null : state.currentUser
      })),

      // 设置加载状态
      setLoading: (loading) => set({ loading }),

      // 设置错误信息
      setError: (error) => set({ error }),

      // 清除错误信息
      clearError: () => set({ error: null }),

      // 重置状态
      reset: () => set(initialState)
    }),
    {
      name: 'user-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users
      })
    }
  )
)

// 用户相关的辅助函数
export const userHelpers = {
  // 根据 ID 查找用户
  findUserById: (users: User[], id: string): User | undefined =>
    users.find(user => user.id === id),

  // 根据邮箱查找用户
  findUserByEmail: (users: User[], email: string): User | undefined =>
    users.find(user => user.email === email),

  // 根据用户名查找用户
  findUserByUsername: (users: User[], username: string): User | undefined =>
    users.find(user => user.username === username),

  // 检查用户是否为管理员
  isAdmin: (user: User | null): boolean =>
    user?.role === 'admin',

  // 格式化用户显示名称
  getDisplayName: (user: User): string =>
    user.username || user.email || '未知用户',

  // 获取用户头像 URL
  getAvatarUrl: (user: User): string =>
    user.avatar || '/default-avatar.png'
}

// 用户 Store 选择器
export const userSelectors = {
  // 获取当前用户
  getCurrentUser: (state: UserStore) => state.currentUser,

  // 获取所有用户
  getUsers: (state: UserStore) => state.users,

  // 获取加载状态
  getLoading: (state: UserStore) => state.loading,

  // 获取错误信息
  getError: (state: UserStore) => state.error,

  // 检查是否已登录
  isLoggedIn: (state: UserStore) => !!state.currentUser,

  // 检查当前用户是否为管理员
  isCurrentUserAdmin: (state: UserStore) => 
    userHelpers.isAdmin(state.currentUser)
}