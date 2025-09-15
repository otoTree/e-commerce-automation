import { create } from 'zustand';
import type { OperationTask, TaskContent, Campaign } from '../types';

interface TaskState {
  // 任务数据
  tasks: OperationTask[];
  selectedTask: OperationTask | null;
  
  // 营销活动
  campaigns: Campaign[];
  selectedCampaign: Campaign | null;
  
  // 状态管理
  loading: boolean;
  error: string | null;
  
  // 筛选和分页
  filters: {
    status: string;
    type: string;
    priority: string;
    assignee: string;
    search_query: string;
  };
  
  // Actions - 任务管理
  setTasks: (tasks: OperationTask[]) => void;
  setSelectedTask: (task: OperationTask | null) => void;
  addTask: (task: OperationTask) => void;
  updateTask: (id: string, updates: Partial<OperationTask>) => void;
  removeTask: (id: string) => void;
  
  // Actions - 营销活动管理
  setCampaigns: (campaigns: Campaign[]) => void;
  setSelectedCampaign: (campaign: Campaign | null) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  
  // Actions - 状态管理
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Actions - 筛选
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  clearFilters: () => void;
  
  // Actions - 任务操作
  startTask: (id: string) => void;
  completeTask: (id: string) => void;
  pauseTask: (id: string) => void;
  assignTask: (id: string, assignee: string) => void;
  
  // Actions - 批量操作
  bulkUpdateTasks: (ids: string[], updates: Partial<OperationTask>) => void;
  bulkDeleteTasks: (ids: string[]) => void;
}

const initialFilters = {
  status: '',
  type: '',
  priority: '',
  assignee: '',
  search_query: ''
};

export const useTaskStore = create<TaskState>()((set, get) => ({
  // 初始状态
  tasks: [],
  selectedTask: null,
  campaigns: [],
  selectedCampaign: null,
  loading: false,
  error: null,
  filters: initialFilters,
  
  // Actions - 任务管理
  setTasks: (tasks: OperationTask[]) => set({ tasks }),
  
  setSelectedTask: (task: OperationTask | null) => set({ selectedTask: task }),
  
  addTask: (task: OperationTask) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),
  
  updateTask: (id: string, updates: Partial<OperationTask>) => set((state) => ({
    tasks: state.tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ),
    selectedTask: state.selectedTask?.id === id 
      ? { ...state.selectedTask, ...updates }
      : state.selectedTask
  })),
  
  removeTask: (id: string) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id),
    selectedTask: state.selectedTask?.id === id ? null : state.selectedTask
  })),
  
  // Actions - 营销活动管理
  setCampaigns: (campaigns: Campaign[]) => set({ campaigns }),
  
  setSelectedCampaign: (campaign: Campaign | null) => set({ selectedCampaign: campaign }),
  
  addCampaign: (campaign: Campaign) => set((state) => ({
    campaigns: [campaign, ...state.campaigns]
  })),
  
  updateCampaign: (id: string, updates: Partial<Campaign>) => set((state) => ({
    campaigns: state.campaigns.map(campaign => 
      campaign.id === id ? { ...campaign, ...updates } : campaign
    ),
    selectedCampaign: state.selectedCampaign?.id === id 
      ? { ...state.selectedCampaign, ...updates }
      : state.selectedCampaign
  })),
  
  removeCampaign: (id: string) => set((state) => ({
    campaigns: state.campaigns.filter(campaign => campaign.id !== id),
    selectedCampaign: state.selectedCampaign?.id === id ? null : state.selectedCampaign
  })),
  
  // Actions - 状态管理
  setLoading: (loading: boolean) => set({ loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  // Actions - 筛选
  setFilters: (filters: Partial<TaskState['filters']>) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  clearFilters: () => set({ filters: initialFilters }),
  
  // Actions - 任务操作
  startTask: (id: string) => {
    const { updateTask } = get();
    updateTask(id, { 
      status: 'in_progress',
      started_at: new Date()
    });
  },
  
  completeTask: (id: string) => {
    const { updateTask } = get();
    updateTask(id, { 
      status: 'completed',
      completed_at: new Date()
    });
  },
  
  pauseTask: (id: string) => {
    const { updateTask } = get();
    updateTask(id, { 
      status: 'cancelled'
    });
  },
  
  assignTask: (id: string, assignee: string) => {
    const { updateTask } = get();
    updateTask(id, { assigned_to: assignee });
  },
  
  // Actions - 批量操作
  bulkUpdateTasks: (ids: string[], updates: Partial<OperationTask>) => set((state) => ({
    tasks: state.tasks.map(task => 
      ids.includes(task.id) ? { ...task, ...updates } : task
    )
  })),
  
  bulkDeleteTasks: (ids: string[]) => set((state) => ({
    tasks: state.tasks.filter(task => !ids.includes(task.id))
  }))
}));

// 选择器函数
export const selectTasks = (state: TaskState) => state.tasks;
export const selectSelectedTask = (state: TaskState) => state.selectedTask;
export const selectCampaigns = (state: TaskState) => state.campaigns;
export const selectSelectedCampaign = (state: TaskState) => state.selectedCampaign;
export const selectLoading = (state: TaskState) => state.loading;
export const selectError = (state: TaskState) => state.error;
export const selectFilters = (state: TaskState) => state.filters;

// 计算选择器
export const selectTasksByStatus = (status: string) => (state: TaskState) => 
  state.tasks.filter(task => task.status === status);

export const selectTasksByPriority = (priority: string) => (state: TaskState) => 
  state.tasks.filter(task => task.priority === priority);

export const selectTasksByAssignee = (assignee: string) => (state: TaskState) => 
  state.tasks.filter(task => task.assigned_to === assignee);

export const selectOverdueTasks = (state: TaskState) => 
  state.tasks.filter(task => 
    task.scheduled_at && new Date(task.scheduled_at) < new Date() && task.status !== 'completed'
  );

export const selectTaskStats = (state: TaskState) => {
  const total = state.tasks.length;
  const completed = state.tasks.filter(task => task.status === 'completed').length;
  const inProgress = state.tasks.filter(task => task.status === 'in_progress').length;
  const pending = state.tasks.filter(task => task.status === 'pending').length;
  const overdue = selectOverdueTasks(state).length;
  
  return {
    total,
    completed,
    inProgress,
    pending,
    overdue,
    completionRate: total > 0 ? (completed / total) * 100 : 0
  };
};

// Hook 快捷方式
export const useTasks = () => {
  const {
    tasks,
    loading,
    error,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setLoading,
    setError,
    clearError
  } = useTaskStore();
  
  return {
    tasks,
    loading,
    error,
    setTasks,
    addTask,
    updateTask,
    removeTask,
    setLoading,
    setError,
    clearError
  };
};

export const useTaskOperations = () => {
  const {
    startTask,
    completeTask,
    pauseTask,
    assignTask,
    bulkUpdateTasks,
    bulkDeleteTasks
  } = useTaskStore();
  
  return {
    startTask,
    completeTask,
    pauseTask,
    assignTask,
    bulkUpdateTasks,
    bulkDeleteTasks
  };
};

export const useTaskFilters = () => {
  const { filters, setFilters, clearFilters } = useTaskStore();
  return { filters, setFilters, clearFilters };
};

export const useCampaigns = () => {
  const {
    campaigns,
    selectedCampaign,
    setCampaigns,
    setSelectedCampaign,
    addCampaign,
    updateCampaign,
    removeCampaign
  } = useTaskStore();
  
  return {
    campaigns,
    selectedCampaign,
    setCampaigns,
    setSelectedCampaign,
    addCampaign,
    updateCampaign,
    removeCampaign
  };
};

export const useTaskSelection = () => {
  const { selectedTask, setSelectedTask } = useTaskStore();
  return { selectedTask, setSelectedTask };
};