'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone, 
  Eye, 
  EyeOff,
  Save,
  AlertTriangle,
  CheckCircle,
  Mail,
  Key,
  Clock,
  Download,
  Trash2,
  Globe
} from 'lucide-react';

export default function AccountSettingsPage() {
  const [currentTab, setCurrentTab] = useState('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    loginNotifications: true,
    sessionTimeout: 30,
    loginHistory: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    taskComplete: true,
    systemAlerts: true,
    securityAlerts: true,
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReport: true,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    activityLogging: true,
    dataCollection: false,
    thirdPartySharing: false
  });

  const tabs = [
    { id: 'security', name: '安全设置', icon: Shield },
    { id: 'notifications', name: '通知设置', icon: Bell },
    { id: 'privacy', name: '隐私设置', icon: Lock },
    { id: 'data', name: '数据管理', icon: Settings },
  ];

  const handlePasswordUpdate = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不匹配');
      return;
    }
    // 这里添加密码更新逻辑
    alert('密码更新成功');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSecurityToggle = (setting: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const handlePrivacyToggle = (setting: string) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
  };

  const loginHistory = [
    { device: 'Chrome on Windows', location: '北京, 中国', time: '2小时前', status: 'current' },
    { device: 'Safari on iPhone', location: '北京, 中国', time: '1天前', status: 'success' },
    { device: 'Chrome on macOS', location: '上海, 中国', time: '3天前', status: 'success' },
    { device: 'Unknown Device', location: '广州, 中国', time: '1周前', status: 'suspicious' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* 页面标题 */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          账户设置
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          管理您的账户安全、隐私和通知偏好
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* 侧边栏导航 */}
        <div className="lg:w-64">
          <nav className="space-y-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentTab === tab.id
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* 主要内容区域 */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            
            {/* 安全设置 */}
            {currentTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    安全设置
                  </h2>
                </div>

                {/* 密码修改 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    修改密码
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        当前密码
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          新密码
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          确认新密码
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handlePasswordUpdate} className="flex items-center space-x-2">
                      <Save className="h-4 w-4" />
                      <span>更新密码</span>
                    </Button>
                  </div>
                </div>

                {/* 两步验证 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Smartphone className="h-5 w-5 mr-2" />
                    两步验证
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700 dark:text-gray-300">
                        为您的账户添加额外的安全保护
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {securitySettings.twoFactorEnabled ? '已启用' : '未启用'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={securitySettings.twoFactorEnabled}
                        onChange={() => handleSecurityToggle('twoFactorEnabled')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* 登录历史 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    登录历史
                  </h3>
                  <div className="space-y-3">
                    {loginHistory.map((login, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            login.status === 'current' ? 'bg-green-500' :
                            login.status === 'success' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {login.device}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {login.location} · {login.time}
                            </p>
                          </div>
                        </div>
                        {login.status === 'current' && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                            当前会话
                          </span>
                        )}
                        {login.status === 'suspicious' && (
                          <button className="text-red-600 hover:text-red-800 dark:text-red-400">
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 通知设置 */}
            {currentTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    通知设置
                  </h2>
                </div>

                {/* 系统通知 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    系统通知
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'taskComplete', label: '任务完成通知', desc: '当您的任务完成时接收通知' },
                      { key: 'systemAlerts', label: '系统警报', desc: '系统故障或维护通知' },
                      { key: 'securityAlerts', label: '安全警报', desc: '登录异常或安全相关通知' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-900 dark:text-white font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={() => handleNotificationToggle(item.key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 通知方式 */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    通知方式
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', label: '邮件通知', desc: '通过邮件接收通知', icon: Mail },
                      { key: 'pushNotifications', label: '浏览器推送', desc: '浏览器桌面通知', icon: Bell },
                      { key: 'smsNotifications', label: '短信通知', desc: '重要通知通过短信发送', icon: Smartphone },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <item.icon className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{item.label}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                            onChange={() => handleNotificationToggle(item.key)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 隐私设置 */}
            {currentTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    隐私设置
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'activityLogging', label: '活动记录', desc: '记录您的平台使用活动' },
                    { key: 'dataCollection', label: '数据收集', desc: '允许收集使用数据以改善服务' },
                    { key: 'thirdPartySharing', label: '第三方共享', desc: '与合作伙伴共享匿名数据' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{item.label}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings[item.key as keyof typeof privacySettings]}
                          onChange={() => handlePrivacyToggle(item.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 数据管理 */}
            {currentTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    数据管理
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Download className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        导出数据
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      下载您在平台上的所有数据副本
                    </p>
                    <Button variant="outline" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      导出我的数据
                    </Button>
                  </div>

                  <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Trash2 className="h-5 w-5 text-red-600" />
                      <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
                        删除账户
                      </h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      永久删除您的账户和所有相关数据
                    </p>
                    <Button variant="destructive" className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除账户
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
