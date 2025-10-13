// 弹窗主要逻辑
class PopupManager {
  constructor() {
    this.elements = {};
    this.connectionStatus = {
      backend: false,
      polling: false
    };
    this.taskStats = {
      pending: 0,
      processing: 0,
      completed: 0
    };
    this.recentTasks = [];
    this.init();
  }

  init() {
    this.initElements();
    this.bindEvents();
    this.checkStatus();
    this.loadTaskStatus();
    // 定期更新状态
    setInterval(() => {
      this.checkStatus();
      this.loadTaskStatus();
    }, 5000);
  }

  initElements() {
    this.elements = {
      analyzeBtn: document.getElementById('analyze-page'),
      compareBtn: document.getElementById('price-compare'),
      reviewBtn: document.getElementById('reviews-summary'),
      uploadBtn: document.getElementById('upload-html'),
      upload1688Btn: document.getElementById('upload-1688-search'),
      settingsBtn: document.getElementById('settings-btn'),
      refreshBtn: document.getElementById('refresh-btn'),
      statusIndicator: document.querySelector('.status-indicator'),
      infoSection: document.getElementById('info-section'),
      analysisResult: document.getElementById('analysis-result'),
      // 连接状态元素
      backendStatus: document.getElementById('backend-status'),
      pollingStatus: document.getElementById('polling-status'),
      backendDot: document.getElementById('backend-dot'),
      pollingDot: document.getElementById('polling-dot'),
      // 任务状态元素
      pendingCount: document.getElementById('pending-count'),
      processingCount: document.getElementById('processing-count'),
      completedCount: document.getElementById('completed-count'),
      recentTasksList: document.getElementById('recent-tasks-list')
    };
  }

  bindEvents() {
    this.elements.analyzeBtn?.addEventListener('click', () => this.analyzePage());
    this.elements.compareBtn?.addEventListener('click', () => this.comparePrices());
    this.elements.reviewBtn?.addEventListener('click', () => this.summarizeReviews());
    this.elements.uploadBtn?.addEventListener('click', () => this.uploadPageHTML());
    this.elements.upload1688Btn?.addEventListener('click', () => this.upload1688SearchData());
    this.elements.settingsBtn?.addEventListener('click', () => this.openSettings());
    this.elements.refreshBtn?.addEventListener('click', () => this.refreshStatus());
  }

  async checkStatus() {
    try {
      // 检查后端API连接状态
      const response = await fetch('http://localhost:3001/health', {
        method: 'GET',
        timeout: 3000
      });
      
      if (response.ok) {
        this.connectionStatus.backend = true;
        this.updateBackendStatus(true);
      } else {
        this.connectionStatus.backend = false;
        this.updateBackendStatus(false);
      }
    } catch (error) {
      console.error('Backend status check failed:', error);
      this.connectionStatus.backend = false;
      this.updateBackendStatus(false);
    }

    // 检查任务轮询状态
    this.checkPollingStatus();
  }

  async checkPollingStatus() {
    try {
      // 向background script查询轮询状态
      const response = await chrome.runtime.sendMessage({
        action: 'getPollingStatus'
      });
      
      console.log('Polling status response:', response);
      this.connectionStatus.polling = response?.isPolling || false;
      this.updatePollingStatus(this.connectionStatus.polling);
    } catch (error) {
      console.error('Polling status check failed:', error);
      this.connectionStatus.polling = false;
      this.updatePollingStatus(false);
    }
  }

  async loadTaskStatus() {
    if (!this.connectionStatus.backend) {
      this.updateTaskStats({ pending: 0, processing: 0, completed: 0 });
      this.updateRecentTasks([]);
      return;
    }

    try {
      // 获取任务统计
      const statsResponse = await fetch('http://localhost:3001/api/tasks/stats/overview');
      if (statsResponse.ok) {
        const stats = await statsResponse.json();
        this.updateTaskStats(stats);
      }

      // 获取最近任务
      const tasksResponse = await fetch('http://localhost:3001/api/tasks?limit=5&sort=-createdAt');
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        this.updateRecentTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error('Failed to load task status:', error);
    }
  }

  updateBackendStatus(isOnline) {
    if (this.elements.backendStatus) {
      this.elements.backendStatus.textContent = isOnline ? '已连接' : '未连接';
    }
    if (this.elements.backendDot) {
      this.elements.backendDot.className = `status-dot ${isOnline ? 'online' : 'offline'}`;
    }
    // 更新主状态指示器
    this.updateMainStatusIndicator();
  }

  updatePollingStatus(isPolling) {
    if (this.elements.pollingStatus) {
      this.elements.pollingStatus.textContent = isPolling ? '运行中' : '已停止';
    }
    if (this.elements.pollingDot) {
      this.elements.pollingDot.className = `status-dot ${isPolling ? 'online' : 'offline'}`;
    }
    // 更新主状态指示器
    this.updateMainStatusIndicator();
  }

  updateMainStatusIndicator() {
    const isHealthy = this.connectionStatus.backend && this.connectionStatus.polling;
    if (this.elements.statusIndicator) {
      this.elements.statusIndicator.style.background = isHealthy ? '#4ade80' : '#ef4444';
      this.elements.statusIndicator.style.boxShadow = isHealthy 
        ? '0 0 6px rgba(74, 222, 128, 0.6)' 
        : '0 0 6px rgba(239, 68, 68, 0.6)';
    }
  }

  updateTaskStats(stats) {
    this.taskStats = {
      pending: stats.pending || 0,
      processing: stats.processing || 0,
      completed: stats.completed || 0
    };

    if (this.elements.pendingCount) {
      this.elements.pendingCount.textContent = this.taskStats.pending;
    }
    if (this.elements.processingCount) {
      this.elements.processingCount.textContent = this.taskStats.processing;
    }
    if (this.elements.completedCount) {
      this.elements.completedCount.textContent = this.taskStats.completed;
    }
  }

  updateRecentTasks(tasks) {
    this.recentTasks = tasks;
    
    if (!this.elements.recentTasksList) return;

    if (tasks.length === 0) {
      this.elements.recentTasksList.innerHTML = '<div class="no-tasks">暂无任务</div>';
      return;
    }

    const tasksHtml = tasks.map(task => {
      const statusClass = this.getTaskStatusClass(task.status);
      const statusText = this.getTaskStatusText(task.status);
      
      return `
        <div class="task-item">
          <span class="task-title" title="${task.title}">${task.title}</span>
          <span class="task-status-badge ${statusClass}">${statusText}</span>
        </div>
      `;
    }).join('');

    this.elements.recentTasksList.innerHTML = tasksHtml;
  }

  getTaskStatusClass(status) {
    const statusMap = {
      'pending': 'pending',
      'processing': 'processing',
      'completed': 'completed',
      'failed': 'failed'
    };
    return statusMap[status] || 'pending';
  }

  getTaskStatusText(status) {
    const statusMap = {
      'pending': '等待中',
      'processing': '处理中',
      'completed': '已完成',
      'failed': '失败'
    };
    return statusMap[status] || '未知';
  }

  refreshStatus() {
    this.checkStatus();
    this.loadTaskStatus();
  }

  async analyzePage() {
    this.showLoading('正在分析当前页面...')
    
    try {
      // 获取当前标签页信息
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      // 向content script发送消息
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'analyzePage'
      })
      
      if (response && response.success) {
        this.showResult('页面分析', response.data)
      } else {
        this.showError('分析失败，请重试')
      }
    } catch (error) {
      console.error('分析页面失败:', error)
      this.showError('分析失败，请检查页面是否支持')
    }
  }

  async comparePrice() {
    this.showLoading('正在比较价格...')
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'comparePrice'
      })
      
      if (response && response.success) {
        this.showResult('价格比较', response.data)
      } else {
        this.showError('价格比较失败')
      }
    } catch (error) {
      console.error('价格比较失败:', error)
      this.showError('价格比较失败，请重试')
    }
  }

  async summarizeReviews() {
    this.showLoading('正在分析评价...')
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'summarizeReviews'
      })
      
      if (response && response.success) {
        this.showResult('评价摘要', response.data)
      } else {
        this.showError('评价分析失败')
      }
    } catch (error) {
      console.error('评价分析失败:', error)
      this.showError('评价分析失败，请重试')
    }
  }

  async uploadPageHTML() {
    try {
      this.showLoading('正在上传页面HTML...')
      
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab) {
        this.showError('无法获取当前标签页')
        return
      }

      // 向content script发送上传HTML的消息
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'uploadPageHTML'
      })

      if (response && response.success) {
        this.showResult('HTML上传成功', `✅ ${response.message}
        
页面URL: ${response.data.url}
文件大小: ${Math.round(response.data.size / 1024)} KB
上传时间: ${new Date(response.data.uploadedAt).toLocaleString()}`)
      } else {
        this.showError(response?.message || 'HTML上传失败')
      }
    } catch (error) {
      console.error('HTML上传失败:', error)
      this.showError('HTML上传失败，请重试')
    }
  }

  async upload1688SearchData() {
    try {
      this.showLoading('正在上传1688搜索数据...')
      
      // 获取当前活动标签页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (!tab) {
        this.showError('无法获取当前标签页')
        return
      }

      // 向content script发送上传1688搜索数据的消息
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: 'upload1688SearchData'
      })

      if (response && response.success) {
        const extractedData = response.data.extractedData
        const backendResult = response.data.backendResult
        
        this.showResult('1688搜索数据上传成功', `✅ ${response.message}
        
页面URL: ${backendResult.data.url}
搜索关键词: ${extractedData.keyword || '未检测到'}
产品数量: ${extractedData.products?.length || 0}
总结果数: ${extractedData.totalCount || '未知'}
当前页码: ${extractedData.pagination?.currentPage || '未知'}
上传时间: ${new Date(backendResult.data.timestamp).toLocaleString()}`)
      } else {
        this.showError(response?.message || '1688搜索数据上传失败')
      }
    } catch (error) {
      console.error('1688搜索数据上传失败:', error)
      this.showError('1688搜索数据上传失败，请重试')
    }
  }

  openSettings() {
    // 打开设置页面
    chrome.tabs.create({
      url: chrome.runtime.getURL('src/popup/settings.html')
    })
  }

  showLoading(message) {
    this.elements.infoSection.style.display = 'block'
    this.elements.analysisResult.innerHTML = `
      <div class="loading"></div>
      <span style="margin-left: 8px;">${message}</span>
    `
  }

  showResult(title, data) {
    this.elements.infoSection.style.display = 'block'
    this.elements.analysisResult.innerHTML = `
      <div>
        <strong>${title}</strong>
        <div style="margin-top: 8px; white-space: pre-wrap;">${data}</div>
      </div>
    `
  }

  showError(message) {
    this.elements.infoSection.style.display = 'block'
    this.elements.analysisResult.innerHTML = `
      <div style="color: #ef4444;">
        ❌ ${message}
      </div>
    `
  }
}

// 初始化弹窗管理器
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager()
})