// Store 统一导出
export { useUserStore } from './userStore';
export { useProductStore } from './productStore';
export { useTaskStore } from './taskStore';
export { useAppStore } from './appStore';

// 导出用户相关
export {
  selectUser,
  selectIsAuthenticated,
  selectPreferences,
  selectTheme,
  useAuth,
  usePermissions,
  useTheme
} from './userStore';

// 导出商品相关
export {
  selectProducts,
  selectSelectedProduct,
  selectLoading as selectProductsLoading,
  selectPagination as selectProductsPagination,
  selectFilters as selectProductsFilters
} from './productStore';

// 导出任务相关
export {
  selectTasks,
  selectSelectedTask,
  selectLoading as selectTasksLoading,
  selectTasksByStatus,
  selectTasksByPriority,
  selectOverdueTasks
} from './taskStore';

// 导出应用相关
export {
  selectIsLoading,
  selectError,
  selectNotifications,
  selectUnreadNotifications,
  selectSystemConfig,
  selectTheme as selectAppTheme,
  selectLanguage,
  selectSidebarCollapsed,
  selectModalState,
  useLoading,
  useError,
  useNotifications,
  useTheme as useAppTheme,
  useLanguage,
  useSidebarCollapsed,
  useModal
} from './appStore';