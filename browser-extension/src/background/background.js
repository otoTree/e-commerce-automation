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
          extension_id: this.extensionId,
          browser_info: {
            name: 'Chrome',
            version: navigator.userAgent
          }
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
      return;
    }
    
    try {
      const response = await fetch(`${this.backendUrl}/heartbeat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extension_id: this.extensionId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('心跳发送成功:', data.message);
        
        // 保存心跳时间
        await chrome.storage.local.set({ 
          lastHeartbeat: Date.now()
        });
      } else {
        console.error('心跳发送失败:', response.status);
        
        // 如果心跳失败，可能需要重新注册
        if (response.status === 404) {
          console.log('扩展未注册，尝试重新注册');
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
      const response = await fetch(`${this.backendUrl}/tasks/poll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extension_id: this.extensionId
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.task) {
          console.log('收到新任务:', data.data.task);
          // 处理任务
          await this.processTask(data.data.task);
        } else {
          console.log('暂无待执行任务');
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
    
    // 立即打开任务URL（如果有的话）
    await this.openTaskUrl(task);
    
    try {
      let extractedData = null;
      
      // 根据任务类型处理
      switch (task.type) {
        case 'single_product':
          extractedData = await this.processSingleProductTask(task);
          break;
        case 'batch_collection':
          extractedData = await this.processBatchCollectionTask(task);
          break;
        case 'keyword_search':
          extractedData = await this.processKeywordSearchTask(task);
          break;
        case 'source_extraction':
          // 源码提取任务
          extractedData = await this.processSourceExtractionTask(task);
          break;
        case 'full_data_collection':
          // 检查是否为源码获取请求
          if (task.input?.analysis_options?.request_type === 'get_source') {
            extractedData = await this.processSourceExtractionTask(task);
          } else {
            console.log(`⚠️ 全量数据收集任务 ${task.task_id} 应在后端处理，插件跳过`);
            return;
          }
          break;
        case 'deep_analysis':
          // 分析任务已移至后端处理，插件不再处理此类任务
          console.log(`⚠️ 分析任务 ${task.task_id} 应在后端处理，插件跳过`);
          return;
        case 'market_heat_detection':
          // 市场热度检测任务已移至后端处理，插件不再处理此类任务
          console.log(`⚠️ 市场热度检测任务 ${task.task_id} 应在后端处理，插件跳过`);
          return;
        case 'keyword_collection':
          console.log(`⚠️ 关键词收集任务 ${task.task_id} 应在后端处理，插件跳过`);
          return;
        default:
          throw new Error(`未知任务类型: ${task.type}`);
      }
      
      // 对于源码提取任务，检查结果格式
      if (task.type === 'source_extraction') {
        if (extractedData && extractedData.results && extractedData.results.length > 0) {
          await this.sendTaskResult(task.task_id, extractedData, true);
          console.log(`源码提取任务 ${task.task_id} 完成，处理了 ${extractedData.results.length} 个URL`);
        } else {
          throw new Error('源码提取失败或未找到有效结果');
        }
      } else {
        // 其他任务类型的结果检查
        if (extractedData && extractedData.products && extractedData.products.length > 0) {
          // 发送结果到后端
          await this.sendTaskResult(task.task_id, extractedData, true);
          console.log(`任务 ${task.task_id} 完成，提取到 ${extractedData.products.length} 个商品`);
        } else {
          throw new Error('数据提取失败或未找到商品');
        }
      }
      
    } catch (error) {
      console.error(`任务 ${task.task_id} 处理失败:`, error);
      await this.sendTaskResult(task.task_id, null, false, error.message);
    }
  }

  // 立即打开任务URL
  async openTaskUrl(task) {
    try {
      let url = null;
      
      // 从不同任务类型中提取URL
      if (task.input?.product_urls && task.input.product_urls.length > 0) {
        url = task.input.product_urls[0];
      } else if (task.input?.url) {
        url = task.input.url;
      } else if (task.input?.search_url) {
        url = task.input.search_url;
      }
      
      if (!url) {
        console.log('任务中没有找到URL，跳过自动打开');
        return;
      }
      
      // 检查URL是否有效
      if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
        console.log(`跳过不支持的URL协议: ${url}`);
        return;
      }
      
      console.log(`🚀 立即打开任务URL: ${url}`);
      
      // 获取或创建窗口
      const windows = await chrome.windows.getAll();
      let targetWindow = windows.find(w => w.type === 'normal');
      
      if (!targetWindow) {
        console.log('创建新窗口来打开URL');
        targetWindow = await chrome.windows.create({
          url: url,
          type: 'normal',
          focused: true
        });
      } else {
        // 在现有窗口中创建新标签页
        await chrome.tabs.create({
          url: url,
          windowId: targetWindow.id,
          active: true
        });
      }
      
      console.log(`✅ 已打开任务URL: ${url}`);
      
    } catch (error) {
      console.error('打开任务URL失败:', error);
      // 不抛出错误，让任务继续执行
    }
  }
  
  // 处理单个商品收集任务
  async processSingleProductTask(task) {
    // 修复：从product_urls数组中获取第一个URL
    const { product_urls, platform } = task.input;
    const url = product_urls && product_urls.length > 0 ? product_urls[0] : null;
    
    if (!url) {
      throw new Error('任务中没有提供有效的商品URL');
    }
    
    // 检查URL是否为chrome://协议，如果是则跳过
    if (url.startsWith('chrome://') || url.startsWith('chrome-extension://')) {
      throw new Error(`不支持的URL协议: ${url}`);
    }
    
    console.log(`开始处理单品收集任务，URL: ${url}`);
    
    try {
      // 首先确保有可用的窗口
      const windows = await chrome.windows.getAll();
      let targetWindow = windows.find(w => w.type === 'normal');
      
      if (!targetWindow) {
        console.log('没有找到可用窗口，创建新窗口');
        targetWindow = await chrome.windows.create({
          url: 'about:blank',
          type: 'normal',
          focused: true
        });
        
        // 等待窗口创建完成
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // 等待一段时间确保浏览器状态稳定
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 在指定窗口中创建标签页
      const tab = await chrome.tabs.create({
        url: url,
        windowId: targetWindow.id,
        active: true
      });
      
      console.log(`已在窗口 ${targetWindow.id} 中创建标签页 ${tab.id}，正在加载: ${url}`);
      
      // 等待标签页状态稳定
      await this.waitForTabStable(tab.id);
      
      // 等待页面加载完成
      await this.waitForTabLoad(tab.id);
      console.log(`标签页 ${tab.id} 加载完成`);
      
      // 提取商品数据
      const extractedData = await this.extractProductsFromTab(tab.id);
      console.log(`从标签页 ${tab.id} 提取到数据:`, extractedData);
      
      // 为商品添加平台信息和源URL
      if (extractedData && extractedData.products) {
        extractedData.products.forEach(product => {
          product.platform = platform || 'unknown';
          product.source_url = url;
          product.collected_at = new Date().toISOString();
        });
      }
      
      // 延迟关闭标签页，便于调试
      setTimeout(async () => {
        try {
          await chrome.tabs.remove(tab.id);
          console.log(`已关闭标签页 ${tab.id}`);
        } catch (error) {
          console.log(`关闭标签页 ${tab.id} 失败:`, error);
        }
      }, 5000); // 5秒后关闭
      
      return extractedData;
    } catch (error) {
      console.error('处理单品收集任务失败:', error);
      throw error;
    }
  }
  
  // 等待标签页状态稳定
  async waitForTabStable(tabId) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 20; // 10秒
      
      const checkStable = () => {
        attempts++;
        
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.log(`标签页 ${tabId} 状态检查失败 (尝试 ${attempts}/${maxAttempts}):`, chrome.runtime.lastError.message);
            
            if (attempts >= maxAttempts) {
              reject(new Error(`标签页 ${tabId} 状态检查超时`));
              return;
            }
            
            setTimeout(checkStable, 500);
            return;
          }
          
          console.log(`标签页 ${tabId} 状态稳定 (尝试 ${attempts}/${maxAttempts})`);
          resolve();
        });
      };
      
      checkStable();
    });
  }
  
  // 处理批量收集任务
  async processBatchCollectionTask(task) {
    const { urls } = task.input;
    const allProducts = [];
    
    for (const url of urls) {
      try {
        const tab = await chrome.tabs.create({
          url: url,
          active: true
        });
        
        await this.waitForTabLoad(tab.id);
        const extractedData = await this.extractProductsFromTab(tab.id);
        
        if (extractedData && extractedData.products) {
          allProducts.push(...extractedData.products);
        }
        
        await chrome.tabs.remove(tab.id);
        
        // 添加延迟避免过于频繁的请求
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`批量收集中处理URL ${url} 失败:`, error);
      }
    }
    
    return {
      products: allProducts,
      total: allProducts.length,
      source: 'batch_collection'
    };
  }
  
  // 处理关键词搜索任务
  async processKeywordSearchTask(task) {
    const { keyword, platform, maxResults } = task.input;
    
    // 构建搜索URL
    let searchUrl;
    switch (platform) {
      case 'taobao':
        searchUrl = `https://s.taobao.com/search?q=${encodeURIComponent(keyword)}`;
        break;
      case '1688':
        searchUrl = `https://s.1688.com/selloffer/offer_search.htm?keywords=${encodeURIComponent(keyword)}`;
        break;
      default:
        throw new Error(`不支持的平台: ${platform}`);
    }
    
    const tab = await chrome.tabs.create({
      url: searchUrl,
      active: true
    });
    
    try {
      await this.waitForTabLoad(tab.id);
      const extractedData = await this.extractProductsFromTab(tab.id);
      
      // 限制结果数量
      if (extractedData && extractedData.products && maxResults) {
        extractedData.products = extractedData.products.slice(0, maxResults);
        extractedData.total = extractedData.products.length;
      }
      
      return extractedData;
    } finally {
      await chrome.tabs.remove(tab.id);
    }
  }
  
  // 等待标签页加载完成
  waitForTabLoad(tabId) {
    return new Promise((resolve, reject) => {
      let attempts = 0;
      const maxAttempts = 30; // 最多等待30次，每次500ms，总共15秒
      
      const checkStatus = () => {
        attempts++;
        
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError) {
            console.error('获取标签页状态失败:', chrome.runtime.lastError);
            reject(new Error(`标签页 ${tabId} 不存在或已关闭`));
            return;
          }
          
          console.log(`标签页 ${tabId} 状态检查 (${attempts}/${maxAttempts}): ${tab.status}, URL: ${tab.url}`);
          
          if (tab.status === 'complete') {
            console.log(`标签页 ${tabId} 加载完成，额外等待2秒确保页面完全渲染`);
            // 额外等待2秒确保页面完全加载
            setTimeout(resolve, 2000);
          } else if (attempts >= maxAttempts) {
            console.error(`标签页 ${tabId} 加载超时`);
            reject(new Error(`标签页加载超时，当前状态: ${tab.status}`));
          } else {
            setTimeout(checkStatus, 500);
          }
        });
      };
      
      checkStatus();
    });
  }

  // 使用与popup相同的商品提取逻辑
  async extractProductsFromTab(tabId) {
    try {
      // 尝试发送消息给content script
      let results;
      try {
        results = await chrome.tabs.sendMessage(tabId, { action: 'extractProducts' });
      } catch (error) {
        // 如果连接失败，尝试重新注入content script
        if (error.message.includes('Could not establish connection') || 
            error.message.includes('Receiving end does not exist')) {
          console.log('正在重新加载提取器...');
          
          const injected = await this.injectContentScript(tabId);
          if (!injected) {
            throw new Error('无法注入内容脚本');
          }
          
          // 等待一下让content script初始化
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // 重新尝试发送消息
          results = await chrome.tabs.sendMessage(tabId, { action: 'extractProducts' });
        } else {
          throw error;
        }
      }
      
      if (results && results.success && results.data) {
        return results.data;
      } else {
        const errorMsg = results && results.error ? results.error : '未找到商品信息';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('提取商品失败:', error);
      throw error;
    }
  }

  // 注入content script
  async injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['src/content/content_extractor.js', 'src/content/content.js']
      });
      return true;
    } catch (error) {
      console.error('注入content script失败:', error);
      return false;
    }
  }
  
  // 处理源码提取任务
  async processSourceExtractionTask(task) {
    const { product_urls } = task.input;
    
    if (!product_urls || product_urls.length === 0) {
      throw new Error('没有提供商品URL');
    }

    const results = [];
    
    for (const url of product_urls) {
      try {
        console.log(`正在获取页面源码: ${url}`);
        
        // 打开目标网址
        const tab = await chrome.tabs.create({
          url: url,
          active: false // 在后台打开，避免干扰用户
        });

        await this.waitForTabLoad(tab.id);
        
        // 获取页面HTML源码
        const htmlSource = await this.getPageSource(tab.id);
        
        if (htmlSource) {
          // 提交HTML到后端进行解析
          const submitResult = await this.submitHtmlToBackend(url, htmlSource);
          
          results.push({
            url: url,
            success: true,
            html_length: htmlSource.length,
            task_id: submitResult.task_id
          });
        } else {
          results.push({
            url: url,
            success: false,
            error: '无法获取页面源码'
          });
        }

        await chrome.tabs.remove(tab.id);
        
        // 添加延迟避免过于频繁的请求
        if (product_urls.length > 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`获取页面源码 ${url} 失败:`, error);
        results.push({
          url: url,
          success: false,
          error: error.message
        });
      }
    }

    return {
      results: results,
      total: results.length,
      success_count: results.filter(r => r.success).length,
      source: 'source_extraction'
    };
  }

  // 获取页面HTML源码
  async getPageSource(tabId) {
    try {
      const response = await chrome.tabs.sendMessage(tabId, { action: 'getPageSource' });
      if (response && response.success) {
        return response.source;
      }
      throw new Error('获取页面源码失败');
    } catch (error) {
      console.error('获取页面源码失败:', error);
      throw error;
    }
  }

  // 检测平台类型
  detectPlatform(url) {
    if (url.includes('1688.com') || url.includes('alibaba.com')) return 'alibaba';
    if (url.includes('ozon.ru')) return 'ozon';
    return 'other';
  }

  // 检测页面类型
  detectPageType(html, url) {
    if (html.includes('product') || html.includes('商品') || html.includes('item') || url.includes('/offer/')) {
      return 'product';
    }
    if (html.includes('search') || html.includes('搜索') || html.includes('list') || url.includes('search')) {
      return 'search';
    }
    return 'unknown';
  }

  // 提交HTML到后端
  async submitHtmlToBackend(url, htmlContent) {
    try {
      const platform = this.detectPlatform(url);
      const pageType = this.detectPageType(htmlContent, url);
      
      const payload = {
        url: url,
        html_content: htmlContent,
        platform: platform,
        page_type: pageType,
        metadata: {
          collected_at: new Date(),
          content_length: htmlContent.length,
          user_agent: navigator.userAgent,
          source: 'extension'
        }
      };

      console.log('提交HTML到后端:', {
        url: url,
        platform: platform,
        page_type: pageType,
        content_length: htmlContent.length
      });

      const response = await fetch(`${this.backendUrl}/api/data-collection/submit-html`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || '提交HTML失败');
      }

      console.log('HTML提交成功:', result);
      return result;
    } catch (error) {
      console.error('提交HTML到后端失败:', error);
      throw error;
    }
  }
  
  // 处理全量数据收集任务（单品收集）
  // 已移除：processFullDataCollectionTask 函数
  // 全量数据收集任务现在完全由后端处理，插件只负责源码获取
  
  // 处理深度分析任务
  // 处理关键词收集任务
  // 已移除：processKeywordCollectionTask 函数
  // 关键词收集任务现在完全由后端处理
  
  // 已移除：processFullDataCollectionTask 函数  
  // 全量数据收集任务现在完全由后端处理
  
  // 计算热度分数
  calculateHeatScore(products) {
    if (!products || products.length === 0) return 0;
    
    let score = 0;
    products.forEach(product => {
      // 基于销量、价格、评价等计算热度
      if (product.sales) {
        const sales = parseInt(product.sales.replace(/[^\d]/g, '')) || 0;
        score += Math.min(sales / 100, 50); // 销量贡献，最多50分
      }
      
      if (product.reviews) {
        const reviews = parseInt(product.reviews.replace(/[^\d]/g, '')) || 0;
        score += Math.min(reviews / 50, 30); // 评价数贡献，最多30分
      }
      
      // 价格合理性（中等价格区间得分更高）
      if (product.price) {
        const price = parseFloat(product.price.replace(/[^\d.]/g, '')) || 0;
        if (price > 10 && price < 1000) {
          score += 20;
        }
      }
    });
    
    return Math.round(score / products.length);
  }
  
  // 导航到下一页
  async navigateToNextPage(tabId) {
    try {
      const result = await chrome.tabs.sendMessage(tabId, { action: 'navigateToNextPage' });
      return result && result.success;
    } catch (error) {
      console.error('翻页失败:', error);
      return false;
    }
  }

  
  // 发送任务结果到后端
  async sendTaskResult(taskId, data, success, error = null) {
    try {
      const response = await fetch(`${this.backendUrl}/tasks/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task_id: taskId,
          extension_id: this.extensionId,
          success,
          data,
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
  
  // 手动创建任务
  async createManualTask(taskData) {
    try {
      const response = await fetch(`${this.backendUrl}/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extension_id: this.extensionId,
          type: taskData.type,
          input: taskData.input
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('任务创建成功:', data.task);
        return data.task;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '任务创建失败');
      }
    } catch (error) {
      console.error('创建任务失败:', error);
      throw error;
    }
  }
  
  // 获取任务状态
  async getTaskStatus(taskId) {
    try {
      const response = await fetch(`${this.backendUrl}/tasks/${taskId}/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.task;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '获取任务状态失败');
      }
    } catch (error) {
      console.error('获取任务状态失败:', error);
      throw error;
    }
  }
}

// 创建扩展管理器实例
const extensionManager = new ExtensionManager();

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener((details) => {
  console.log('扩展已安装/更新:', details.reason);
  
  if (details.reason === 'install') {
    console.log('首次安装扩展');
    // 首次安装时打开1688网页 - 已注释，避免自动打开
    // openTaobaoPage();
  } else if (details.reason === 'update') {
    console.log('扩展已更新');
  }
});

// 监听浏览器启动事件（仅在Chrome浏览器启动时触发）
chrome.runtime.onStartup.addListener(() => {
  console.log('浏览器启动，扩展重新初始化');
  // 浏览器启动时打开1688网页 - 已注释，避免自动打开
  // openTaobaoPage();
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
      
    // 新增：手动创建任务
    case 'createTask':
      extensionManager.createManualTask(request.taskData).then((result) => {
        sendResponse({ success: true, task: result });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
      return true;
      
    // 新增：获取任务状态
    case 'getTaskStatus':
      extensionManager.getTaskStatus(request.taskId).then((status) => {
        sendResponse({ success: true, status });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
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
      
    // 新增：处理网址并自动上传HTML源码
    case 'processUrl':
      console.log('收到处理网址的请求:', request.url);
      try {
        processUrlAndUploadHtml(request.url).then((result) => {
          sendResponse({ success: true, result });
        }).catch(error => {
          console.error('处理网址时出错:', error);
          sendResponse({ success: false, error: error.message });
        });
      } catch (error) {
        console.error('处理网址请求时出错:', error);
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

// 处理网址并自动上传HTML源码
const processUrlAndUploadHtml = async (url) => {
  try {
    console.log('开始处理网址:', url);
    
    // 1. 创建新标签页并导航到指定URL
    const tab = await chrome.tabs.create({
      url: url,
      active: false // 在后台打开
    });
    
    console.log('已创建标签页:', tab.id);
    
    // 2. 等待页面加载完成
    await extensionManager.waitForTabLoad(tab.id);
    console.log('页面加载完成');
    
    // 3. 获取页面HTML源码
    const htmlContent = await getPageHtmlContent(tab.id);
    console.log('已获取HTML源码，长度:', htmlContent.length);
    
    // 4. 上传HTML源码到后端
    const uploadResult = await uploadHtmlToBackend(url, htmlContent);
    console.log('HTML源码上传结果:', uploadResult);
    
    // 5. 关闭标签页
    await chrome.tabs.remove(tab.id);
    console.log('已关闭标签页');
    
    return {
      url,
      htmlLength: htmlContent.length,
      uploadResult,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('处理网址失败:', error);
    throw error;
  }
};

// 获取页面HTML内容
const getPageHtmlContent = async (tabId) => {
  try {
    // 注入内容脚本获取HTML
    const results = await chrome.scripting.executeScript({
      target: { tabId },
      function: () => {
        return document.documentElement.outerHTML;
      }
    });
    
    if (results && results[0] && results[0].result) {
      return results[0].result;
    } else {
      throw new Error('无法获取页面HTML内容');
    }
  } catch (error) {
    console.error('获取页面HTML内容失败:', error);
    throw error;
  }
};

// 上传HTML源码到后端
const uploadHtmlToBackend = async (url, htmlContent) => {
  try {
    // 检测页面平台类型
    const detectPlatform = (url) => {
      if (url.includes('1688.com')) return '1688';
      if (url.includes('taobao.com')) return 'taobao';
      if (url.includes('tmall.com')) return 'tmall';
      if (url.includes('ozon.ru')) return 'ozon';
      return 'unknown';
    };

    // 检测页面类型
    const detectPageType = (html, url) => {
      if (html.includes('product') || html.includes('商品') || html.includes('item')) {
        return 'product';
      }
      if (html.includes('search') || html.includes('搜索') || html.includes('list')) {
        return 'search';
      }
      return 'other';
    };

    const platform = detectPlatform(url);
    const pageType = detectPageType(htmlContent, url);

    const payload = {
      url,
      html_content: htmlContent,
      platform,
      page_type: pageType,
      timestamp: new Date().toISOString(),
      source: 'browser-extension-auto'
    };

    const response = await fetch(`${extensionManager.backendUrl}/api/data-collection/submit-html`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('HTML源码上传成功:', result);
    return result;
    
  } catch (error) {
    console.error('上传HTML源码失败:', error);
    throw error;
  }
};

// 自执行初始化函数 - 确保Service Worker启动时扩展能正确初始化
(async function initializeExtension() {
  try {
    console.log('后台脚本已加载，开始初始化');
    
    // 检查扩展管理器是否已经初始化
    if (extensionManager && !extensionManager.isRegistered) {
      console.log('扩展管理器未注册，开始初始化...');
      await extensionManager.init();
      
      // 初始化完成后延迟打开1688网页 - 已注释，避免自动打开
      console.log('扩展初始化完成，延迟2秒后尝试打开1688网页 - 已禁用');
      // setTimeout(async () => {
      //   await openTaobaoPage();
      // }, 2000);
    } else if (extensionManager && extensionManager.isRegistered) {
      console.log('扩展管理器已注册，重新启动心跳和任务轮询');
      // 如果已经注册但service worker重启了，重新启动心跳和任务轮询
      extensionManager.startHeartbeat();
      extensionManager.startTaskPolling();
      
      // Service Worker重启后也尝试打开1688网页 - 已注释，避免自动打开
      console.log('Service Worker重启，延迟1秒后尝试打开1688网页 - 已禁用');
      // setTimeout(async () => {
      //   await openTaobaoPage();
      // }, 1000);
    }
  } catch (error) {
    console.error('扩展初始化失败:', error);
  }
})();

console.log('后台脚本已加载');