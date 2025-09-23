// 后台脚本 - 处理扩展的生命周期和与后端的通信

class ExtensionManager {
  constructor() {
    this.extensionId = null;
    this.heartbeatInterval = null;
    this.backendUrl = 'http://localhost:3001/api/extension';
    this.heartbeatIntervalMs = 30000; // 30秒心跳间隔
    this.isRegistered = false;
    
    this.init();
  }
  
  async init() {
    // 生成或获取扩展ID
    await this.getOrCreateExtensionId();
    
    // 注册到后端
    await this.registerToBackend();
    
    // 开始心跳检测
    this.startHeartbeat();
    
    console.log('扩展管理器初始化完成，扩展ID:', this.extensionId);
  }
  
  async getOrCreateExtensionId() {
    try {
      // 尝试从存储中获取已有的扩展ID
      const result = await chrome.storage.local.get(['extensionId']);
      
      if (result.extensionId) {
        this.extensionId = result.extensionId;
        console.log('使用已存在的扩展ID:', this.extensionId);
      } else {
        // 生成新的扩展ID
        this.extensionId = 'ext_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        await chrome.storage.local.set({ extensionId: this.extensionId });
        console.log('生成新的扩展ID:', this.extensionId);
      }
    } catch (error) {
      console.error('获取或创建扩展ID失败:', error);
      // 使用临时ID
      this.extensionId = 'temp_' + Date.now();
    }
  }
  
  async registerToBackend() {
    try {
      const response = await fetch(`${this.backendUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extensionId: this.extensionId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isRegistered = true;
        console.log('扩展注册成功:', data.message);
        
        // 保存注册状态
        await chrome.storage.local.set({ 
          isRegistered: true,
          lastRegistered: Date.now()
        });
      } else {
        const errorData = await response.json();
        console.error('扩展注册失败:', errorData.error);
        this.isRegistered = false;
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      this.isRegistered = false;
      
      // 如果注册失败，5秒后重试
      setTimeout(() => {
        this.registerToBackend();
      }, 5000);
    }
  }
  
  async sendHeartbeat() {
    if (!this.isRegistered) {
      console.log('扩展未注册，跳过心跳检测');
      return;
    }
    
    try {
      const response = await fetch(`${this.backendUrl}/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extensionId: this.extensionId
        })
      });
      
      if (response.ok) {
        console.log('心跳检测成功');
        
        // 更新最后心跳时间
        await chrome.storage.local.set({ 
          lastHeartbeat: Date.now()
        });
      } else {
        const errorData = await response.json();
        console.error('心跳检测失败:', errorData.error);
        
        // 如果心跳失败，可能需要重新注册
        if (response.status === 404) {
          console.log('扩展未在后端注册，尝试重新注册');
          this.isRegistered = false;
          await this.registerToBackend();
        }
      }
    } catch (error) {
      console.error('心跳请求失败:', error);
    }
  }
  
  startHeartbeat() {
    // 清除现有的心跳间隔
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    
    // 立即发送一次心跳
    this.sendHeartbeat();
    
    // 设置定期心跳
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.heartbeatIntervalMs);
    
    console.log(`心跳检测已启动，间隔: ${this.heartbeatIntervalMs}ms`);
  }
  
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
      console.log('心跳检测已停止');
    }
  }
  
  // 获取扩展状态信息
  async getStatus() {
    const storage = await chrome.storage.local.get([
      'extensionId', 'isRegistered', 'lastRegistered', 'lastHeartbeat'
    ]);
    
    return {
      extensionId: this.extensionId,
      isRegistered: this.isRegistered,
      lastRegistered: storage.lastRegistered,
      lastHeartbeat: storage.lastHeartbeat,
      backendUrl: this.backendUrl
    };
  }
}

// 创建扩展管理器实例
const extensionManager = new ExtensionManager();

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展已安装/更新:', details.reason);
  
  if (details.reason === 'install') {
    console.log('首次安装扩展');
    // 首次安装时打开1688网页
    openTaobaoPage();
  } else if (details.reason === 'update') {
    console.log('扩展已更新');
  }
});

// 监听扩展启动事件
chrome.runtime.onStartup.addListener(() => {
  console.log('浏览器启动，扩展重新初始化');
  extensionManager.init();
  // 浏览器启动时打开1688网页
  openTaobaoPage();
});

// 监听来自popup和content脚本的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('收到消息:', request);
  
  switch (request.action) {
    case 'getExtensionStatus':
      extensionManager.getStatus().then(status => {
        sendResponse({ success: true, status });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true; // 保持消息通道开放
      
    case 'forceRegister':
      extensionManager.registerToBackend().then(() => {
        sendResponse({ success: true, message: '重新注册成功' });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
      
    case 'forceHeartbeat':
      extensionManager.sendHeartbeat().then(() => {
        sendResponse({ success: true, message: '心跳检测成功' });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
      
    default:
      sendResponse({ success: false, error: '未知的操作' });
  }
});

// 监听扩展卸载事件（清理资源）
chrome.runtime.onSuspend.addListener(() => {
  console.log('扩展即将被挂起，清理资源');
  extensionManager.stopHeartbeat();
});

// 添加打开1688网页的函数
async function openTaobaoPage() {
  try {
    // 检查是否已经有1688的标签页打开
    const tabs = await chrome.tabs.query({ url: "*://www.1688.com/*" });
    
    if (tabs.length === 0) {
      // 如果没有1688标签页，则创建新的
      await chrome.tabs.create({
        url: 'https://www.1688.com',
        active: true
      });
      console.log('已自动打开1688网页');
    } else {
      // 如果已有1688标签页，则激活第一个
      await chrome.tabs.update(tabs[0].id, { active: true });
      console.log('已激活现有的1688标签页');
    }
  } catch (error) {
    console.error('打开1688网页失败:', error);
  }
}

console.log('后台脚本已加载');