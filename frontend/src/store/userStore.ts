import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserPreferences, UserSession } from '../types';

interface UserState {
  // 用户信息
  user: User | null;
  session: UserSession | null;
  preferences: UserPreferences | null;
  
  // 认证状态
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User) => void;
  setSession: (session: UserSession) => void;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  login: (user: User, session: UserSession) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // 权限检查
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  
  // 偏好设置快捷方法
  toggleTheme: () => void;
  setLanguage: (language: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      user: null,
      session: null,
      preferences: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      setUser: (user: User) => set({ user }),
      
      setSession: (session: UserSession) => set({ session }),
      
      setPreferences: (preferences: UserPreferences) => set({ preferences }),
      
      updatePreferences: (updates: Partial<UserPreferences>) => set((state: UserState) => ({
        preferences: state.preferences ? {
          ...state.preferences,
          ...updates
        } : null
      })),
      
      login: (user: User, session: UserSession) => set({
        user,
        session,
        isAuthenticated: true,
        error: null
      }),
      
      logout: () => set({
        user: null,
        session: null,
        isAuthenticated: false,
        error: null
      }),
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      setError: (error: string | null) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // 权限检查
      hasPermission: (permission: string) => {
        const state = get() as UserState;
        if (!state.user) return false;
        
        // 简化权限检查，基于用户角色
        return state.user.role === 'admin' || 
               (state.user.role === 'operator' && permission !== 'admin');
      },
      
      hasRole: (roleName: string) => {
        const state = get() as UserState;
        if (!state.user) return false;
        
        return state.user.role === roleName;
      },
      
      // 偏好设置快捷方法
      toggleTheme: () => set((state: UserState) => {
        if (!state.preferences) return state;
        
        const currentTheme = state.preferences.dashboard_layout.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        return {
          preferences: {
            ...state.preferences,
            dashboard_layout: {
              ...state.preferences.dashboard_layout,
              theme: newTheme
            }
          }
        };
      }),
      
      setLanguage: (language: string) => set((state: UserState) => ({
        preferences: state.preferences ? {
          ...state.preferences,
          language
        } : null
      }))
    }),
    {
      name: 'user-storage',
      partialize: (state: UserState) => ({
        user: state.user,
        preferences: state.preferences,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// 选择器函数
export const selectUser = (state: UserState) => state.user;
export const selectIsAuthenticated = (state: UserState) => state.isAuthenticated;
export const selectPreferences = (state: UserState) => state.preferences;
export const selectTheme = (state: UserState) => state.preferences?.dashboard_layout.theme || 'light';
export const selectLanguage = (state: UserState) => state.preferences?.language || 'zh-CN';
export const selectDashboardLayout = (state: UserState) => state.preferences?.dashboard_layout;

// Hook 快捷方式
export const useAuth = () => {
  const { isAuthenticated, user, login, logout, isLoading, error } = useUserStore();
  return { isAuthenticated, user, login, logout, isLoading, error };
};

export const useTheme = () => {
  const { preferences, toggleTheme, setLanguage } = useUserStore();
  const theme = preferences?.dashboard_layout.theme || 'light';
  const language = preferences?.language || 'zh-CN';
  
  return { theme, language, toggleTheme, setLanguage };
};

export const usePermissions = () => {
  const { hasPermission, hasRole } = useUserStore();
  return { hasPermission, hasRole };
};