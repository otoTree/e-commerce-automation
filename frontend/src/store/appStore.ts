import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, SystemConfig } from '../types';

interface AppState {
  // 应用状态
  isLoading: boolean;
  error: string | null;
  notifications: Notification[];
  systemConfig: SystemConfig | null;
  
  // UI状态
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  language: string;
  
  // 模态框状态
  modals: Record<string, boolean>;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setSystemConfig: (config: SystemConfig) => void;
  
  // UI Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: string) => void;
  
  // Modal Actions
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  toggleModal: (modalId: string) => void;
  closeAllModals: () => void;
}

export const useAppStore = create<AppState>()(persist(
  (set, get) => ({
    // 初始状态
    isLoading: false,
    error: null,
    notifications: [],
    systemConfig: null,
    
    sidebarCollapsed: false,
    theme: 'system',
    language: 'zh-CN',
    
    modals: {},
    
    // Actions
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    
    setError: (error: string | null) => set({ error }),
    
    addNotification: (notification) => {
      const id = Date.now().toString();
      const created_at = new Date();
      const newNotification: Notification = {
        ...notification,
        id,
        user_id: '', // 将在实际使用时从用户状态获取
        created_at
      };
      
      set((state) => ({
        notifications: [newNotification, ...state.notifications]
      }));
      
      // 自动移除通知（除了错误类型）
      if (notification.type !== 'error') {
        setTimeout(() => {
          get().removeNotification(id);
        }, 5000);
      }
    },
    
    removeNotification: (id: string) => set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    })),
    
    clearNotifications: () => set({ notifications: [] }),
    
    setSystemConfig: (config: SystemConfig) => set({ systemConfig: config }),
    
    // UI Actions
    toggleSidebar: () => set((state) => ({ 
      sidebarCollapsed: !state.sidebarCollapsed 
    })),
    
    setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
    
    setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
    
    setLanguage: (language: string) => set({ language }),
    
    // Modal Actions
    openModal: (modalId: string) => set((state) => ({
      modals: { ...state.modals, [modalId]: true }
    })),
    
    closeModal: (modalId: string) => set((state) => ({
      modals: { ...state.modals, [modalId]: false }
    })),
    
    toggleModal: (modalId: string) => set((state) => ({
      modals: { ...state.modals, [modalId]: !state.modals[modalId] }
    })),
    
    closeAllModals: () => set({ modals: {} })
  }),
  {
    name: 'app-store',
    partialize: (state) => ({
      sidebarCollapsed: state.sidebarCollapsed,
      theme: state.theme,
      language: state.language
    })
  }
));

// 选择器函数
export const selectIsLoading = (state: AppState) => state.isLoading;
export const selectError = (state: AppState) => state.error;
export const selectNotifications = (state: AppState) => state.notifications;
export const selectUnreadNotifications = (state: AppState) => 
  state.notifications.filter(n => !n.read);
export const selectSystemConfig = (state: AppState) => state.systemConfig;
export const selectTheme = (state: AppState) => state.theme;
export const selectLanguage = (state: AppState) => state.language;
export const selectSidebarCollapsed = (state: AppState) => state.sidebarCollapsed;
export const selectModalState = (modalId: string) => (state: AppState) => 
  state.modals[modalId] || false;

// Hook 快捷方式
export const useLoading = () => useAppStore(selectIsLoading);
export const useError = () => useAppStore(selectError);
export const useNotifications = () => useAppStore(selectNotifications);
export const useTheme = () => useAppStore(selectTheme);
export const useLanguage = () => useAppStore(selectLanguage);
export const useSidebarCollapsed = () => useAppStore(selectSidebarCollapsed);
export const useModal = (modalId: string) => {
  const isOpen = useAppStore(selectModalState(modalId));
  const openModal = useAppStore(state => state.openModal);
  const closeModal = useAppStore(state => state.closeModal);
  const toggleModal = useAppStore(state => state.toggleModal);
  
  return {
    isOpen,
    open: () => openModal(modalId),
    close: () => closeModal(modalId),
    toggle: () => toggleModal(modalId)
  };
};