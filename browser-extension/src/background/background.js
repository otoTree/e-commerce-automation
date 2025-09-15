// 后台脚本 - 处理扩展的生命周期和与后端的通信

class ExtensionManager {
  constructor() {
    this.extensionId = null;
    this.heartbeatInterval = null;
    this.taskPollingInterval = null;
    this.backendUrl = 'http://localhost:3001/api/extension';
    this.heartbeatIntervalMs = 30000; // 30秒心跳间隔
    this.taskPollingIntervalMs = 10000; // 10秒任务轮询间隔
    this.isRegistered = false;
    this.currentTasks = [];
    this.isInitializing = false; // 添加初始化状态标志
    this.extractedProductsData = null;
    
    // 不在构造函数中直接调用init()，由外部控制初始化时机
  }
  
  async init() {
    // 防止重复初始化
    if (this.isInitializing) {
      console.log('扩展管理器正在初始化中，跳过重复调用');
      return;
    }
    
    if (this.isRegistered) {
      console.log('扩展管理器已经初始化完成');
      return;
    }
    
    this.isInitializing = true;
    
    try {
      // 生成或获取扩展ID
      await this.getOrCreateExtensionId();
      
      // 注册到后端
      await this.registerToBackend();
      
      // 开始心跳检测
      this.startHeartbeat();
      
      // 开始任务轮询
      this.startTaskPolling();
      
      console.log('扩展管理器初始化完成，扩展ID:', this.extensionId);
    } catch (error) {
      console.error('扩展管理器初始化过程中出错:', error);
    } finally {
      this.isInitializing = false;
    }
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
  
  // 开始任务轮询
  startTaskPolling() {
    if (!this.isRegistered) {
      console.log('扩展未注册，跳过任务轮询');
      return;
    }
    
    // 清除现有的轮询间隔
    if (this.taskPollingInterval) {
      clearInterval(this.taskPollingInterval);
    }
    
    // 立即检查一次任务
    this.pollTasks();
    
    // 设置定期轮询
    this.taskPollingInterval = setInterval(() => {
      this.pollTasks();
    }, this.taskPollingIntervalMs);
    
    console.log(`任务轮询已启动，间隔: ${this.taskPollingIntervalMs}ms`);
  }
  
  // 停止任务轮询
  stopTaskPolling() {
    if (this.taskPollingInterval) {
      clearInterval(this.taskPollingInterval);
      this.taskPollingInterval = null;
      console.log('任务轮询已停止');
    }
  }
  
  // 轮询任务
  async pollTasks() {
    if (!this.isRegistered) {
      return;
    }
    
    try {
      const response = await fetch(`${this.backendUrl}/${this.extensionId}/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.tasks && data.tasks.length > 0) {
          console.log(`收到 ${data.tasks.length} 个新任务`);
          this.currentTasks = data.tasks;
          
          // 处理每个任务
          for (const task of data.tasks) {
            this.processTask(task);
          }
        }
      } else {
        console.error('获取任务失败:', response.status);
      }
    } catch (error) {
      console.error('任务轮询请求失败:', error);
    }
  }
  
  // 处理单个任务
  async processTask(task) {
    console.log('开始处理任务:', task);
    
    try {
      // 打开目标网址
      const tab = await chrome.tabs.create({
        url: task.url,
        active: true // 在前台激活打开
      });
      
      // 等待页面加载完成
      await this.waitForTabLoad(tab.id);
      
      // 执行爬虫脚本
      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: this.extractProductData
      });
      
      if (results && results[0] && results[0].result) {
        const extractedData = results[0].result;
        
        // 发送结果到后端
        await this.sendTaskResult(task.id, extractedData, true);
        
        console.log(`任务 ${task.id} 完成，提取到 ${extractedData.total} 个商品`);
      } else {
        throw new Error('数据提取失败');
      }
      
      // 关闭标签页
      await chrome.tabs.remove(tab.id);
      
    } catch (error) {
      console.error(`任务 ${task.id} 处理失败:`, error);
      await this.sendTaskResult(task.id, null, false, error.message);
    }
  }
  
  // 等待标签页加载完成
  waitForTabLoad(tabId) {
    return new Promise((resolve) => {
      const checkStatus = () => {
        chrome.tabs.get(tabId, (tab) => {
          if (tab.status === 'complete') {
            // 额外等待2秒确保页面完全加载
            setTimeout(resolve, 2000);
          } else {
            setTimeout(checkStatus, 500);
          }
        });
      };
      checkStatus();
    });
  }

    // 获取当前标签页信息
  async  getCurrentTab() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab;
    }
    return { url: window.location.href, id: null };
  }

    // 提取商品信息
  async extractProducts() {
    try {
      
      const tab = await getCurrentTab();
      
      if (!tab.id) {
        throw new Error('无法获取当前标签页ID');
      }
      
      // 使用content.js中的1688专用提取器
      let results;
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          // 尝试发送消息给content script
          results = await chrome.tabs.sendMessage(tab.id, { action: 'extractProducts' });
        } catch (error) {
          // 如果连接失败，尝试重新注入content script
          if (error.message.includes('Could not establish connection') || 
              error.message.includes('Receiving end does not exist')) {
            showStatus('正在重新加载提取器...', 'info');
            
            const injected = await injectContentScript(tab.id);
            if (!injected) {
              throw new Error('无法注入内容脚本');
            }
            
            // 等待一下让content script初始化
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 重新尝试发送消息
            results = await chrome.tabs.sendMessage(tab.id, { action: 'extractProducts' });
          } else {
            throw error;
          }
        }
      } else {
        throw new Error('无法在当前环境中执行商品提取');
      }
      
      if (results && results.success && results.data) {
        const extractedData = results.data;
        displayProducts(extractedData);
        
        if (extractedData.error) {
          showStatus(`提取完成，但有错误: ${extractedData.error}`, 'warning');
        } else {
          showStatus(`成功提取 ${extractedData.total} 个商品！`, 'success');
        }
      } else {
        const errorMsg = results && results.error ? results.error : '未找到商品信息';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('提取商品失败:', error);
      showStatus('提取商品失败: ' + error.message, 'error');
    } finally {
      extractProductsBtn.disabled = false;
    }
  }
  
  // 提取商品数据的函数（注入到页面中执行）
  async extractProductData() {
    // 动态加载ContentExtractor
    if (typeof ContentExtractor === 'undefined') {
      // 如果ContentExtractor未加载，使用简单的提取逻辑
      const products = [];
      const productElements = document.querySelectorAll('.sm-offer-item, .offer-item, .item');
      
      productElements.forEach((element, index) => {
        const titleEl = element.querySelector('.offer-title a, .title a, h3 a, .product-title');
        const priceEl = element.querySelector('.price, .offer-price, .sm-offer-priceNum');
        const imageEl = element.querySelector('img');
        const linkEl = element.querySelector('a');
        
        if (titleEl || priceEl) {
          products.push({
            id: `product_${index}`,
            title: titleEl?.textContent?.trim() || '',
            price: priceEl?.textContent?.trim() || '',
            image: imageEl?.src || '',
            link: linkEl?.href || window.location.href,
            supplier: '',
            sales_volume: '',
            location: ''
          });
        }
      });
      
      return {
        products,
        total: products.length,
        page_info: {
          url: window.location.href,
          title: document.title,
          extraction_time: new Date().toISOString()
        }
      };
    }
    
    // 使用ContentExtractor进行提取
    try {
      // 获取提取规则
      const rulesResponse = await fetch(chrome.runtime.getURL('assets/extraction_rules.json'));
      const rules = await rulesResponse.json();
      
      const extractor = new ContentExtractor(rules);
      return await extractor.extract();
    } catch (error) {
      console.error('ContentExtractor提取失败，使用备用方法:', error);
      
      // 备用提取逻辑
      const products = [];
      const productElements = document.querySelectorAll('.sm-offer-item, .offer-item, .item');
      
      productElements.forEach((element, index) => {
        const titleEl = element.querySelector('.offer-title a, .title a, h3 a');
        const priceEl = element.querySelector('.price, .offer-price, .sm-offer-priceNum');
        const imageEl = element.querySelector('img');
        const linkEl = element.querySelector('a');
        
        if (titleEl || priceEl) {
          products.push({
            id: `product_${index}`,
            title: titleEl?.textContent?.trim() || '',
            price: priceEl?.textContent?.trim() || '',
            image: imageEl?.src || '',
            link: linkEl?.href || window.location.href,
            supplier: '',
            sales_volume: '',
            location: ''
          });
        }
      });
      
      return {
        products,
        total: products.length,
        page_info: {
          url: window.location.href,
          title: document.title,
          extraction_time: new Date().toISOString()
        },
        error: error.message
      };
    }
  }
  
  // 发送任务结果到后端
  async sendTaskResult(taskId, data, success, error = null) {
    try {
      const response = await fetch(`${this.backendUrl}/${this.extensionId}/tasks/${taskId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          success,
          error
        })
      });
      
      if (response.ok) {
        console.log(`任务 ${taskId} 结果发送成功`);
      } else {
        console.error(`任务 ${taskId} 结果发送失败:`, response.status);
      }
    } catch (error) {
      console.error(`发送任务 ${taskId} 结果时出错:`, error);
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

// 监听浏览器启动事件（仅在Chrome浏览器启动时触发）
chrome.runtime.onStartup.addListener(() => {
  console.log('浏览器启动，扩展重新初始化');
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
      
    case 'pollTasks':
      extensionManager.pollTasks().then(() => {
        sendResponse({ success: true, message: '任务轮询完成' });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
      
    case 'getCurrentTasks':
      sendResponse({ 
        success: true, 
        tasks: extensionManager.currentTasks,
        count: extensionManager.currentTasks.length
      });
      return true;
      
    case 'openTaobaoPage':
      console.log('收到打开1688页面的请求');
      try {
        openTaobaoPage().then(() => {
          sendResponse({ success: true, message: '1688页面打开请求已处理' });
        }).catch(error => {
          console.error('打开1688页面时出错:', error);
          sendResponse({ success: false, error: error.message });
        });
      } catch (error) {
        console.error('处理打开1688页面请求时出错:', error);
        sendResponse({ success: false, error: error.message });
      }
      return true;
      
    default:
      sendResponse({ success: false, error: '未知的操作' });
  }
});

// 监听扩展卸载事件（清理资源）
chrome.runtime.onSuspend.addListener(() => {
  console.log('扩展即将被挂起，清理资源');
  extensionManager.stopHeartbeat();
  extensionManager.stopTaskPolling();
});

// 添加打开1688网页的函数
async function openTaobaoPage() {
  try {
    console.log('开始尝试打开1688网页...');
    
    // 检查chrome.tabs API是否可用
    if (!chrome.tabs) {
      console.error('chrome.tabs API不可用');
      return;
    }
    
    // 检查是否已经有1688的标签页打开
    console.log('查询现有的1688标签页...');
    const tabs = await chrome.tabs.query({ url: "*://www.1688.com/*" });
    console.log(`找到 ${tabs.length} 个1688标签页`);
    
    if (tabs.length === 0) {
      // 如果没有1688标签页，则创建新的
      console.log('创建新的1688标签页...');
      const newTab = await chrome.tabs.create({
        url: 'https://www.1688.com',
        active: true
      });
      console.log('已自动打开1688网页，标签页ID:', newTab.id);
    } else {
      // 如果已有1688标签页，则激活第一个
      console.log('激活现有的1688标签页，ID:', tabs[0].id);
      await chrome.tabs.update(tabs[0].id, { active: true });
      console.log('已激活现有的1688标签页');
    }
  } catch (error) {
    console.error('打开1688网页失败:', error);
    console.error('错误详情:', error.message);
    console.error('错误堆栈:', error.stack);
  }
}

// 自执行初始化函数 - 确保Service Worker启动时扩展能正确初始化
(async function initializeExtension() {
  try {
    console.log('后台脚本已加载，开始初始化');
    
    // 检查扩展管理器是否已经初始化
    if (extensionManager && !extensionManager.isRegistered) {
      console.log('扩展管理器未注册，开始初始化...');
      await extensionManager.init();
      
      // 初始化完成后延迟打开1688网页
      console.log('扩展初始化完成，延迟2秒后尝试打开1688网页');
      setTimeout(async () => {
        await openTaobaoPage();
      }, 2000);
    } else if (extensionManager && extensionManager.isRegistered) {
      console.log('扩展管理器已注册，重新启动心跳和任务轮询');
      // 如果已经注册但service worker重启了，重新启动心跳和任务轮询
      extensionManager.startHeartbeat();
      extensionManager.startTaskPolling();
      
      // Service Worker重启后也尝试打开1688网页
      console.log('Service Worker重启，延迟1秒后尝试打开1688网页');
      setTimeout(async () => {
        await openTaobaoPage();
      }, 1000);
    }
  } catch (error) {
    console.error('扩展初始化失败:', error);
  }
})();

console.log('后台脚本已加载');