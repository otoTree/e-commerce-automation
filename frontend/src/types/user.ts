// 用户相关类型定义

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  preferences: UserPreferences;
  created_at: Date;
  updated_at: Date;
  last_login: Date;
  is_active: boolean;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  notification_settings: NotificationSettings;
  dashboard_layout: DashboardLayout;
}

export interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  task_notifications: boolean;
  product_notifications: boolean;
}

export interface DashboardLayout {
  widgets: DashboardWidget[];
  layout: 'grid' | 'list';
  theme: 'light' | 'dark' | 'system';
}

export interface DashboardWidget {
  id: string;
  type: 'stats' | 'chart' | 'tasks' | 'products';
  position: { x: number; y: number };
  size: { width: number; height: number };
  visible: boolean;
}

export interface UserSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  ip_address: string;
  user_agent: string;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'operator';
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}