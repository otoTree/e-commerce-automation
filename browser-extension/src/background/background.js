// 后台脚本 - Service Worker (函数式架构)

// ==================== 状态管理 ====================
let state = {
  taskPollingAlarmName: "taskPolling",
  isInitialized: false,
};

// ==================== 工具函数 ====================
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withRetry = async (fn, maxRetries = 3, delayMs = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await delay(delayMs * Math.pow(2, i)); // 指数退避
    }
  }
};

const safeApiCall = async (apiCall, fallbackValue = null) => {
  try {
    return await withRetry(apiCall);
  } catch (error) {
    console.error("API call failed:", error);
    return fallbackValue;
  }
};

// ==================== 存储管理 ====================
const storage = {
  // 同步存储 - 用于用户设置
  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(["settings"], (result) => {
        if (chrome.runtime.lastError) {
          console.error("Storage error:", chrome.runtime.lastError);
          resolve(getDefaultSettings());
          return;
        }

        const settings = result.settings || getDefaultSettings();
        resolve(settings);
      });
    });
  },

  async saveSettings(settings) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set({ settings }, () => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve();
        }
      });
    });
  },

  // 本地存储 - 用于缓存和临时数据
  async getCache(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  },

  async setCache(key, value, ttl = 24 * 60 * 60 * 1000) {
    // 默认24小时TTL
    const data = {
      value,
      timestamp: Date.now(),
      ttl,
    };
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: data }, resolve);
    });
  },

  async cleanupExpiredCache() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (items) => {
        const now = Date.now();
        const keysToRemove = [];

        Object.entries(items).forEach(([key, data]) => {
          if (data && data.timestamp && data.ttl) {
            if (now - data.timestamp > data.ttl) {
              keysToRemove.push(key);
            }
          }
        });

        if (keysToRemove.length > 0) {
          chrome.storage.local.remove(keysToRemove, () => {
            console.log(
              `Cleaned up ${keysToRemove.length} expired cache items`
            );
            resolve();
          });
        } else {
          resolve();
        }
      });
    });
  },
};

const getDefaultSettings = () => ({
  autoAnalyze: false, // 关闭自动分析
  autoUploadHTML: true, // 开启自动上传HTML功能
  priceAlerts: true,
  reviewSummary: true,
  apiEndpoint: "http://localhost:3001",
  language: "zh-CN",
  taskPollingEnabled: true,
  taskPollingInterval: 10000, // 10秒轮询一次
});

// ==================== 消息处理 ====================
const messageHandlers = {
  async getSettings() {
    const settings = await storage.getSettings();
    return { success: true, data: settings };
  },

  async saveSettings(request) {
    await storage.saveSettings(request.settings);
    await restartTaskPolling();
    return { success: true };
  },

  async analyzeProduct(request) {
    const analysis = await analyzeProduct(request.productData);
    return { success: true, data: analysis };
  },

  async comparePrice(request) {
    const comparison = await comparePrice(request.productData);
    return { success: true, data: comparison };
  },

  async openUrl(request) {
    await openUrl(request.url);
    return { success: true };
  },

  async startTaskPolling() {
    await startTaskPolling();
    return { success: true };
  },

  async stopTaskPolling() {
    await stopTaskPolling();
    return { success: true };
  },

  async getPollingStatus() {
    const isPolling = await isTaskPollingActive();
    return {
      success: true,
      isPolling,
      alarmName: state.taskPollingAlarmName,
    };
  },
};

const handleMessage = async (request, sender, sendResponse) => {
  try {
    const handler = messageHandlers[request.action];
    if (!handler) {
      sendResponse({ success: false, error: "Unknown action" });
      return;
    }

    // 对于异步处理，立即返回true并异步发送响应
    const result = await handler(request, sender);
    sendResponse(result);
  } catch (error) {
    console.error("Message handler error:", error);
    sendResponse({ success: false, error: error.message });
  }
};

// ==================== 标签页管理 ====================

const onTabUpdated = (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    // 检测并处理1688搜索页面
    check1688SearchPage(tab);
  }
};

const onTabActivated = (activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (chrome.runtime.lastError) {
      console.error("Error getting tab:", chrome.runtime.lastError);
      return;
    }
    if (tab.url) {
      // 检测并处理1688搜索页面
      check1688SearchPage(tab);
    }
  });
};

// ==================== API 调用 ====================
const analyzeProduct = async (productData) => {
  const settings = await storage.getSettings();
  const apiEndpoint = settings.apiEndpoint || "http://localhost:3001";

  const response = await fetch(`${apiEndpoint}/api/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

const comparePrice = async (productData) => {
  const settings = await storage.getSettings();
  const apiEndpoint = settings.apiEndpoint || "http://localhost:3001";

  const response = await fetch(`${apiEndpoint}/api/price-compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  return await response.json();
};

// ==================== 任务轮询系统 ====================
const isTaskPollingActive = async () => {
  return new Promise((resolve) => {
    chrome.alarms.get(state.taskPollingAlarmName, (alarm) => {
      resolve(!!alarm);
    });
  });
};

const startTaskPolling = async () => {
  console.log("Starting task polling...");

  const settings = await storage.getSettings();

  if (!settings.taskPollingEnabled) {
    console.log("Task polling is disabled in settings");
    return;
  }

  // 清除现有的alarm
  await stopTaskPolling();

  const intervalMinutes = (settings.taskPollingInterval || 10000) / 60000;

  // 创建新的alarm
  chrome.alarms.create(state.taskPollingAlarmName, {
    delayInMinutes: 0.1, // 立即开始
    periodInMinutes: Math.max(0.1, intervalMinutes), // Chrome最小间隔是0.1分钟
  });

  console.log(`Task polling started with interval: ${intervalMinutes} minutes`);
};

const stopTaskPolling = async () => {
  return new Promise((resolve) => {
    chrome.alarms.clear(state.taskPollingAlarmName, (wasCleared) => {
      if (wasCleared) {
        console.log("Task polling stopped");
      }
      resolve();
    });
  });
};

const restartTaskPolling = async () => {
  await stopTaskPolling();
  await startTaskPolling();
};

const onAlarm = async (alarm) => {
  if (alarm.name === state.taskPollingAlarmName) {
    await checkForPendingTasks();
  }
};

// ==================== 任务处理 ====================
const checkForPendingTasks = async () => {
  try {
    const settings = await storage.getSettings();
    const apiEndpoint = settings.apiEndpoint || "http://localhost:3001";

    const response = await safeApiCall(async () => {
      const res = await fetch(
        `${apiEndpoint}/api/tasks?status=pending&limit=10&sortBy=priority&sortOrder=desc`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch pending tasks: ${res.status}`);
      }

      return await res.json();
    });

    if (response && response.success && response.data.tasks.length > 0) {
      console.log(`Found ${response.data.tasks.length} pending tasks`);

      // 并发处理任务，但限制并发数
      const concurrencyLimit = 3;
      const tasks = response.data.tasks;

      for (let i = 0; i < tasks.length; i += concurrencyLimit) {
        const batch = tasks.slice(i, i + concurrencyLimit);
        await Promise.allSettled(batch.map((task) => processTask(task)));
      }
    }
  } catch (error) {
    console.error("Error checking for pending tasks:", error);
  }
};

const processTask = async (task) => {
  try {
    console.log("Processing task:", task.title, task.type);

    await updateTaskStatus(task._id, "processing");

    switch (task.type) {
      case "url":
        if (task.url) {
          await openUrl(task.url);
          await updateTaskStatus(task._id, "completed", 100, null, {
            message: "URL opened successfully",
            url: task.url,
            timestamp: new Date().toISOString(),
          });
        } else {
          await updateTaskStatus(task._id, "failed", 0, "No URL provided");
        }
        break;

      case "batch_url":
        if (task.urls && task.urls.length > 0) {
          await processBatchUrls(task);
        } else {
          await updateTaskStatus(task._id, "failed", 0, "No URLs provided");
        }
        break;

      case "keyword":
        console.log("Keyword task not implemented yet:", task.keywords);
        await updateTaskStatus(
          task._id,
          "failed",
          0,
          "Keyword task not implemented"
        );
        break;

      case "search_1688":
        console.log("Processing 1688 search task:", task.title);
        if (task.url) {
          await openUrl(task.url);
          await updateTaskStatus(task._id, "completed", 100, null, {
            message: "1688 search page opened and data uploaded",
            url: task.url,
            timestamp: new Date().toISOString(),
          });
        } else {
          await updateTaskStatus(task._id, "failed", 0, "No URL provided for 1688 search task");
        }
        break;

      default:
        await updateTaskStatus(
          task._id,
          "failed",
          0,
          `Unknown task type: ${task.type}`
        );
    }
  } catch (error) {
    console.error("Error processing task:", error);
    await updateTaskStatus(task._id, "failed", 0, error.message);
  }
};

const processBatchUrls = async (task) => {
  const urls = task.urls;
  const totalUrls = urls.length;
  let processedUrls = 0;

  try {
    for (const url of urls) {
      await openUrl(url);
      processedUrls++;

      const progress = Math.round((processedUrls / totalUrls) * 100);
      await updateTaskStatus(task._id, "processing", progress);

      // 添加延迟避免过快打开标签页
      await delay(1000);
    }

    await updateTaskStatus(task._id, "completed", 100, null, {
      message: "All URLs opened successfully",
      totalUrls,
      processedUrls,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    const progress = Math.round((processedUrls / totalUrls) * 100);
    await updateTaskStatus(task._id, "failed", progress, error.message);
  }
};

//上传html源码和检测1688搜索页面
const uploadHtml = async (tab) => {
  setTimeout(() => {
    chrome.tabs
      .sendMessage(tab.id, {
        action: "uploadPageHTML",
      })
      .catch((error) => {
        console.log("Failed to send auto-upload HTML message:", error);
      });
  }, 3000); // 延迟3秒确保页面完全加载
};

// 检测并处理1688搜索页面
const check1688SearchPage = async (tab) => {
  if (!tab.url || !tab.url.includes('1688.com')) {
    return;
  }
  
  console.log('Detected 1688 page, checking if it is a search page:', tab.url);
  
  setTimeout(() => {
    chrome.tabs
      .sendMessage(tab.id, {
        action: "detectWebsiteType",
      })
      .then((response) => {
        if (response && response.is1688SearchPage) {
          console.log('Confirmed 1688 search page, auto-uploading search data');
          // 自动上传1688搜索数据
          chrome.tabs
            .sendMessage(tab.id, {
              action: "upload1688SearchData",
            })
            .catch((error) => {
              console.log("Failed to send auto-upload 1688 search data message:", error);
            });
        }
      })
      .catch((error) => {
        console.log("Failed to detect website type:", error);
      });
  }, 4000); // 延迟4秒确保页面完全加载并检测完成
};

const openUrl = async (url) => {
  return new Promise((resolve, reject) => {
    try {
      chrome.tabs.create({ url, active: true }, (tab) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          console.log("Opened URL in new tab:", url);
          resolve(tab);
        }
        // 上传HTML源码
        uploadHtml(tab);
        // 检测并处理1688搜索页面
        check1688SearchPage(tab);
        // setTimeout(() => {
        //   chrome.tabs
        //     .sendMessage(tab.id, {
        //       action: "uploadPageHTML",
        //     })
        //     .catch((error) => {
        //       console.log("Failed to send auto-upload HTML message:", error);
        //     });
        // }, 3000); // 延迟3秒确保页面完全加载
      });
    } catch (error) {
      reject(error);
    }
  });
};

const updateTaskStatus = async (
  taskId,
  status,
  progress = null,
  errorMessage = null,
  result = null
) => {
  try {
    const settings = await storage.getSettings();
    const apiEndpoint = settings.apiEndpoint || "http://localhost:3001";

    const updateData = { status };
    if (progress !== null) updateData.progress = progress;
    if (errorMessage) updateData.errorMessage = errorMessage;
    if (result) updateData.result = result;

    await safeApiCall(async () => {
      const response = await fetch(
        `${apiEndpoint}/api/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update task status: ${response.status}`);
      }

      console.log(`Task ${taskId} status updated to ${status}`);
      return await response.json();
    });
  } catch (error) {
    console.error("Error updating task status:", error);
  }
};

// ==================== 安装和初始化 ====================
const setDefaultSettings = async () => {
  const defaultSettings = getDefaultSettings();
  await storage.saveSettings(defaultSettings);
  console.log("Default settings saved");
};

const showWelcomeNotification = () => {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "public/icon.svg",
    title: "E-commerce AI Assistant",
    message: "欢迎使用AI购物助手！点击扩展图标开始使用。",
  });
};

const onInstalled = async (details) => {
  console.log("E-commerce AI Assistant installed:", details);

  if (details.reason === "install") {
    await setDefaultSettings();
    showWelcomeNotification();
  } else if (details.reason === "update") {
    console.log(
      "Extension updated to version:",
      chrome.runtime.getManifest().version
    );
  }

  // 启动任务轮询
  await startTaskPolling();
};

// ==================== 初始化 ====================
const init = () => {
  if (state.isInitialized) {
    console.log("Background script already initialized");
    return;
  }

  console.log("Initializing background script...");

  // 注册事件监听器
  chrome.runtime.onInstalled.addListener(onInstalled);
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleMessage(request, sender, sendResponse);
    return true; // 保持消息通道开放以支持异步响应
  });
  chrome.tabs.onUpdated.addListener(onTabUpdated);
  chrome.tabs.onActivated.addListener(onTabActivated);
  chrome.alarms.onAlarm.addListener(onAlarm);

  // 启动任务轮询（如果已安装）
  startTaskPolling();

  // 定期清理过期缓存
  chrome.alarms.create("cleanupCache", {
    delayInMinutes: 60, // 1小时后开始
    periodInMinutes: 60 * 24, // 每24小时清理一次
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "cleanupCache") {
      storage.cleanupExpiredCache();
    }
  });

  state.isInitialized = true;
  console.log("Background script initialized successfully");
};

// 启动应用
init();
