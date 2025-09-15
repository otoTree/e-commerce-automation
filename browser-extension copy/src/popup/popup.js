document.addEventListener('DOMContentLoaded', function() {
  const getSourceBtn = document.getElementById('getSource');
  const extractProductsBtn = document.getElementById('extractProducts');
  const sendToBackendBtn = document.getElementById('sendToBackend');
  const getServerDataBtn = document.getElementById('getServerData');
  const copySourceBtn = document.getElementById('copySource');
  const downloadSourceBtn = document.getElementById('downloadSource');
  const sourceCodeTextarea = document.getElementById('sourceCode');
  const currentUrlSpan = document.getElementById('currentUrl');
  const sourceLengthSpan = document.getElementById('sourceLength');
  const statusDiv = document.getElementById('status');
  const productsContainer = document.getElementById('productsContainer');
  const productsResult = document.getElementById('productsResult');
  const searchInput = document.getElementById('searchProducts');
  const sortSelect = document.getElementById('sortProducts');
  const exportBtn = document.getElementById('exportProducts');
  const toggleViewBtn = document.getElementById('toggleView');
  
  // 服务器数据相关元素
  const serverDataContainer = document.getElementById('serverDataContainer');
  const serverDataDisplay = document.getElementById('serverDataDisplay');
  const serverDataInfo = document.getElementById('serverDataInfo');
  const dataTypeSelect = document.getElementById('dataTypeSelect');
  const refreshServerDataBtn = document.getElementById('refreshServerData');
  const exportServerDataBtn = document.getElementById('exportServerData');
  
  let currentPageSource = '';
  let currentPageUrl = '';
  let extractedProductsData = null;
  let filteredProducts = [];
  let isCompactView = false;
  
  // 服务器数据相关变量
  let serverData = null;
  let extensionId = null; // 从后台脚本获取
  let extensionStatus = null;
  
  // 显示状态信息
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    setTimeout(() => {
      statusDiv.textContent = '';
      statusDiv.className = 'status';
    }, 3000);
  }
  
  // 更新源码长度显示
  function updateSourceLength(length) {
    sourceLengthSpan.textContent = `源码长度：${length.toLocaleString()} 字符`;
  }
  
  // 获取当前标签页信息
  async function getCurrentTab() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      return tab;
    }
    return { url: window.location.href, id: null };
  }
  
  // 获取页面源码
  async function getPageSource() {
    try {
      showStatus('正在获取页面源码...', 'info');
      getSourceBtn.disabled = true;
      
      const tab = await getCurrentTab();
      currentPageUrl = tab.url;
      currentUrlSpan.textContent = currentPageUrl;
      
      // 注入脚本获取页面源码
      let results;
      if (typeof chrome !== 'undefined' && chrome.scripting && tab.id) {
        results = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: () => {
            return document.documentElement.outerHTML;
          }
        });
      } else {
        // 在非扩展环境中直接获取当前页面源码
        results = [{ result: document.documentElement.outerHTML }];
      }
      
      if (results && results[0] && results[0].result) {
        currentPageSource = results[0].result;
        sourceCodeTextarea.value = currentPageSource;
        updateSourceLength(currentPageSource.length);
        
        // 启用复制和下载按钮
        copySourceBtn.disabled = false;
        downloadSourceBtn.disabled = false;
        
        showStatus('源码获取成功！', 'success');
      } else {
        throw new Error('无法获取页面源码');
      }
    } catch (error) {
      console.error('获取源码失败:', error);
      showStatus('获取源码失败: ' + error.message, 'error');
    } finally {
      getSourceBtn.disabled = false;
    }
  }
  
  // 复制源码到剪贴板
  async function copySourceToClipboard() {
    if (!currentPageSource) {
      showStatus('请先获取页面源码', 'error');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(currentPageSource);
      showStatus('源码已复制到剪贴板！', 'success');
    } catch (error) {
      console.error('复制失败:', error);
      showStatus('复制失败: ' + error.message, 'error');
    }
  }
  
  // 注入content script
  async function injectContentScript(tabId) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ['content.js']
      });
      return true;
    } catch (error) {
      console.error('注入content script失败:', error);
      return false;
    }
  }
  
  // 提取商品信息
  async function extractProducts() {
    try {
      showStatus('正在提取商品信息...', 'info');
      extractProductsBtn.disabled = true;
      
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

  
  // 显示提取的商品信息
  function displayProducts(data) {
    extractedProductsData = data; // 保存提取的商品数据
    filteredProducts = [...data.products]; // 初始化过滤后的商品数据
    sendToBackendBtn.disabled = false; // 启用发送按钮
    if (exportBtn) exportBtn.disabled = false; // 启用导出按钮
    productsContainer.style.display = 'block';
    
    // 更新摘要信息
    const summaryDiv = document.getElementById('productsSummary');
    summaryDiv.innerHTML = `共找到 ${data.total} 个商品${data.source_length ? ` (源码长度: ${data.source_length.toLocaleString()} 字符)` : ''}`;
    
    if (data.products.length === 0) {
      productsResult.innerHTML = '<p class="no-products">未找到商品信息</p>';
      return;
    }
    
    renderProductsList(data.products);
  }
  
  // 渲染商品列表
  function renderProductsList(products) {
    let html = '';
    
    products.forEach((product, index) => {
      // 构建商品状态
      let statusHtml = '';
      if (product.status) {
        const statusClass = product.status === '有库存' ? 'status-available' : 
                           product.status === '库存紧张' ? 'status-limited' : 'status-unavailable';
        statusHtml = `<span class="product-status ${statusClass}">${product.status}</span>`;
      }
      
      // 构建标签
      let tagsHtml = '';
      if (product.tags && product.tags.length > 0) {
        tagsHtml = `<div class="product-tags">${product.tags.map(tag => `<span class="product-tag">${tag}</span>`).join('')}</div>`;
      }
      
      // 构建规格信息
      let specsHtml = '';
      if (product.specifications) {
        specsHtml = `<div class="product-specs">规格: ${product.specifications}</div>`;
      }
      
      html += `
        <div class="product-item" data-index="${index}">
          <div class="product-header">
            <span class="product-index">#${index + 1}</span>
            <div class="product-main">
              <h4 class="product-title">${product.title || '无标题'} ${statusHtml}</h4>
              <div class="product-content">
                <div class="product-details">
                  <div class="product-info-grid">
                    ${product.price ? `<div class="product-info-item product-price"><span class="product-info-label">价格:</span>${product.price}</div>` : ''}
                    ${product.sales ? `<div class="product-info-item product-sales"><span class="product-info-label">销量:</span>${product.sales}</div>` : ''}
                    ${product.rating ? `<div class="product-info-item product-rating"><span class="product-info-label">评分:</span>${product.rating}</div>` : ''}
                    ${product.reviewCount ? `<div class="product-info-item"><span class="product-info-label">评价:</span>${product.reviewCount}</div>` : ''}
                    ${product.supplier ? `<div class="product-info-item product-supplier"><span class="product-info-label">供应商:</span>${product.supplier}</div>` : ''}
                    ${product.location ? `<div class="product-info-item product-location"><span class="product-info-label">发货地:</span>${product.location}</div>` : ''}
                    ${product.moq ? `<div class="product-info-item product-moq"><span class="product-info-label">起订量:</span>${product.moq}</div>` : ''}
                    ${product.delivery ? `<div class="product-info-item"><span class="product-info-label">发货:</span>${product.delivery}</div>` : ''}
                  </div>
                  ${specsHtml}
                  ${tagsHtml}
                  ${product.link ? `<div class="product-link"><a href="${product.link}" target="_blank">🔗 查看详情</a></div>` : ''}
                </div>
                ${product.image ? `<div class="product-image"><img src="${product.image}" alt="商品图片" loading="lazy"></div>` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    });
    
    productsResult.innerHTML = html;
  }

  // 发送商品信息到后端
  async function sendProductsToBackend() {
    if (!extractedProductsData || !extractedProductsData.products || extractedProductsData.products.length === 0) {
      showStatus('请先提取商品信息', 'error');
      return;
    }

    try {
      showStatus('正在发送商品信息到后端...', 'info');
      sendToBackendBtn.disabled = true;

      const payload = {
        url: currentPageUrl,
        timestamp: new Date().toISOString(),
        products: extractedProductsData.products,
        total: extractedProductsData.total,
        source: 'browser-extension'
      };

      const response = await fetch('http://localhost:3001/api/products/import/1688', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      showStatus(`成功发送 ${extractedProductsData.total} 个商品到后端！`, 'success');
      console.log('发送结果:', result);
    } catch (error) {
      console.error('发送到后端失败:', error);
      showStatus('发送到后端失败: ' + error.message, 'error');
    } finally {
      sendToBackendBtn.disabled = false;
    }
  }

  // 下载源码文件
  function downloadSource() {
    if (!currentPageSource) {
      showStatus('请先获取页面源码', 'error');
      return;
    }
    
    try {
      const blob = new Blob([currentPageSource], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // 生成文件名
      const urlObj = new URL(currentPageUrl);
      const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[^0-9]/g, '');
      const filename = `${hostname}_${timestamp}.html`;
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      showStatus('源码文件下载成功！', 'success');
    } catch (error) {
      console.error('下载失败:', error);
      showStatus('下载失败: ' + error.message, 'error');
    }
  }

  // 获取服务器数据
  async function getServerData() {
    try {
      showStatus('正在连接服务器...', 'info');
      getServerDataBtn.disabled = true;
      
      // 首先注册扩展
      await registerExtension();
      
      // 获取默认数据
      const dataType = dataTypeSelect.value || '';
      const response = await fetch(`http://localhost:3001/api/extension/${extensionId}/data?type=${dataType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      serverData = result;
      
      // 显示数据
      displayServerData(result);
      
      // 显示服务器数据容器
      serverDataContainer.style.display = 'block';
      
      // 启用相关按钮
      refreshServerDataBtn.disabled = false;
      exportServerDataBtn.disabled = false;
      
      showStatus('服务器数据获取成功！', 'success');
    } catch (error) {
      console.error('获取服务器数据失败:', error);
      showStatus('获取服务器数据失败: ' + error.message, 'error');
    } finally {
      getServerDataBtn.disabled = false;
    }
  }

  // 注册扩展
  async function registerExtension() {
    try {
      const response = await fetch('http://localhost:3001/api/extension/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          extensionId: extensionId
        })
      });

      if (!response.ok) {
        throw new Error(`注册失败: ${response.status}`);
      }

      console.log('扩展注册成功');
    } catch (error) {
      console.error('扩展注册失败:', error);
      throw error;
    }
  }

  // 显示服务器数据
  function displayServerData(data) {
    if (!data) {
      serverDataDisplay.value = '暂无数据';
      serverDataInfo.textContent = '';
      return;
    }

    // 格式化JSON数据
    const formattedData = JSON.stringify(data, null, 2);
    serverDataDisplay.value = formattedData;
    
    // 显示数据信息
    const dataSize = new Blob([formattedData]).size;
    const timestamp = data.timestamp || new Date().toISOString();
    serverDataInfo.innerHTML = `
      <div class="data-info">
        <span>数据大小: ${dataSize} 字节</span>
        <span>更新时间: ${new Date(timestamp).toLocaleString()}</span>
        <span>扩展ID: ${extensionId}</span>
      </div>
    `;
  }

  // 数据类型选择变化
  async function onDataTypeChange() {
    if (!serverData) {
      return;
    }
    
    const selectedType = dataTypeSelect.value;
    if (!selectedType) {
      displayServerData(serverData);
      return;
    }
    
    try {
      showStatus('正在获取指定类型数据...', 'info');
      
      const response = await fetch(`http://localhost:3001/api/extension/${extensionId}/data?type=${selectedType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      displayServerData(result);
      showStatus('数据获取成功！', 'success');
    } catch (error) {
      console.error('获取指定类型数据失败:', error);
      showStatus('获取数据失败: ' + error.message, 'error');
    }
  }

  // 刷新服务器数据
  async function refreshServerData() {
    await getServerData();
  }

  // 导出服务器数据
  function exportServerData() {
    if (!serverData) {
      showStatus('暂无服务器数据可导出', 'error');
      return;
    }
    
    try {
      const dataToExport = serverDataDisplay.value;
      const blob = new Blob([dataToExport], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 生成文件名
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[^0-9]/g, '');
      const dataType = dataTypeSelect.value || 'default';
      const filename = `server_data_${dataType}_${timestamp}.json`;
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      showStatus('服务器数据导出成功！', 'success');
    } catch (error) {
      console.error('导出失败:', error);
      showStatus('导出失败: ' + error.message, 'error');
    }
  }
  
  // 初始化
  async function init() {
    // 检查是否在扩展环境中
    if (typeof chrome === 'undefined' || !chrome.tabs) {
      currentUrlSpan.textContent = '请在Chrome扩展环境中使用';
      getSourceBtn.disabled = true;
      return;
    }
    
    try {
      const tab = await getCurrentTab();
      currentPageUrl = tab.url;
      currentUrlSpan.textContent = currentPageUrl;
      
      // 获取扩展状态
      await getExtensionStatus();
    } catch (error) {
      console.error('初始化失败:', error);
      currentUrlSpan.textContent = '无法获取当前页面URL';
    }
  }
  
  // 获取扩展状态
  async function getExtensionStatus() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'getExtensionStatus' });
      if (response.success) {
        extensionStatus = response.status;
        extensionId = response.status.extensionId;
        updateExtensionStatusDisplay();
      } else {
        console.error('获取扩展状态失败:', response.error);
        showStatus('无法获取扩展状态', 'error');
      }
    } catch (error) {
      console.error('获取扩展状态失败:', error);
      showStatus('扩展通信失败', 'error');
    }
  }
  
  // 更新扩展状态显示
  function updateExtensionStatusDisplay() {
    if (!extensionStatus) return;
    
    // 创建状态显示元素（如果不存在）
    let statusContainer = document.getElementById('extensionStatusContainer');
    if (!statusContainer) {
      statusContainer = document.createElement('div');
      statusContainer.id = 'extensionStatusContainer';
      statusContainer.className = 'extension-status';
      
      // 插入到页面顶部
      const firstSection = document.querySelector('.section');
      if (firstSection) {
        firstSection.parentNode.insertBefore(statusContainer, firstSection);
      }
    }
    
    const isRegistered = extensionStatus.isRegistered;
    const lastHeartbeat = extensionStatus.lastHeartbeat;
    const timeSinceHeartbeat = lastHeartbeat ? Date.now() - lastHeartbeat : null;
    
    statusContainer.innerHTML = `
      <h3>扩展状态</h3>
      <div class="status-item">
        <span class="status-label">扩展ID:</span>
        <span class="status-value">${extensionStatus.extensionId}</span>
      </div>
      <div class="status-item">
        <span class="status-label">注册状态:</span>
        <span class="status-value ${isRegistered ? 'status-success' : 'status-error'}">
          ${isRegistered ? '已注册' : '未注册'}
        </span>
      </div>
      <div class="status-item">
        <span class="status-label">后端地址:</span>
        <span class="status-value">${extensionStatus.backendUrl}</span>
      </div>
      <div class="status-item">
        <span class="status-label">最后心跳:</span>
        <span class="status-value">
          ${lastHeartbeat ? 
            `${Math.floor(timeSinceHeartbeat / 1000)}秒前` : 
            '无记录'
          }
        </span>
      </div>
      <div class="status-actions">
        <button id="forceRegisterBtn" class="btn btn-small">重新注册</button>
        <button id="forceHeartbeatBtn" class="btn btn-small">发送心跳</button>
        <button id="refreshStatusBtn" class="btn btn-small">刷新状态</button>
      </div>
    `;
    
    // 绑定按钮事件
    const forceRegisterBtn = document.getElementById('forceRegisterBtn');
    const forceHeartbeatBtn = document.getElementById('forceHeartbeatBtn');
    const refreshStatusBtn = document.getElementById('refreshStatusBtn');
    
    if (forceRegisterBtn) {
      forceRegisterBtn.addEventListener('click', forceRegister);
    }
    if (forceHeartbeatBtn) {
      forceHeartbeatBtn.addEventListener('click', forceHeartbeat);
    }
    if (refreshStatusBtn) {
      refreshStatusBtn.addEventListener('click', getExtensionStatus);
    }
  }
  
  // 强制重新注册
  async function forceRegister() {
    try {
      showStatus('正在重新注册...', 'info');
      const response = await chrome.runtime.sendMessage({ action: 'forceRegister' });
      if (response.success) {
        showStatus('重新注册成功', 'success');
        await getExtensionStatus(); // 刷新状态
      } else {
        showStatus('重新注册失败: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('重新注册失败:', error);
      showStatus('重新注册失败', 'error');
    }
  }
  
  // 强制发送心跳
  async function forceHeartbeat() {
    try {
      showStatus('正在发送心跳...', 'info');
      const response = await chrome.runtime.sendMessage({ action: 'forceHeartbeat' });
      if (response.success) {
        showStatus('心跳发送成功', 'success');
        await getExtensionStatus(); // 刷新状态
      } else {
        showStatus('心跳发送失败: ' + response.error, 'error');
      }
    } catch (error) {
      console.error('心跳发送失败:', error);
      showStatus('心跳发送失败', 'error');
    }
  }
  
  // 搜索商品
  function searchProducts() {
    if (!extractedProductsData || !extractedProductsData.products) return;
    
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      filteredProducts = [...extractedProductsData.products];
    } else {
      filteredProducts = extractedProductsData.products.filter(product => {
        return (product.title && product.title.toLowerCase().includes(query)) ||
               (product.supplier && product.supplier.toLowerCase().includes(query)) ||
               (product.specifications && product.specifications.toLowerCase().includes(query)) ||
               (product.tags && product.tags.some(tag => tag.toLowerCase().includes(query)));
      });
    }
    
    sortAndRenderProducts();
  }
  
  // 排序商品
  function sortProducts(products) {
    const sortType = sortSelect.value;
    const sorted = [...products];
    
    switch (sortType) {
      case 'price-asc':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
          const priceB = parseFloat(b.price?.replace(/[^\d.]/g, '') || '0');
          return priceB - priceA;
        });
        break;
      case 'sales-desc':
        sorted.sort((a, b) => {
          const salesA = parseInt(a.sales?.replace(/[^\d]/g, '') || '0');
          const salesB = parseInt(b.sales?.replace(/[^\d]/g, '') || '0');
          return salesB - salesA;
        });
        break;
      case 'rating-desc':
        sorted.sort((a, b) => {
          const ratingA = parseFloat(a.rating?.replace(/[^\d.]/g, '') || '0');
          const ratingB = parseFloat(b.rating?.replace(/[^\d.]/g, '') || '0');
          return ratingB - ratingA;
        });
        break;
      default:
        // 保持原始顺序
        break;
    }
    
    return sorted;
  }
  
  // 排序并渲染商品
  function sortAndRenderProducts() {
    const sorted = sortProducts(filteredProducts);
    renderProductsList(sorted);
    
    // 更新摘要信息
    const summaryDiv = document.getElementById('productsSummary');
    const total = extractedProductsData ? extractedProductsData.total : 0;
    const filtered = sorted.length;
    summaryDiv.innerHTML = `共找到 ${total} 个商品${filtered !== total ? ` (筛选后: ${filtered} 个)` : ''}${extractedProductsData?.source_length ? ` (源码长度: ${extractedProductsData.source_length.toLocaleString()} 字符)` : ''}`;
  }
  
  // 导出商品数据
  function exportProducts() {
    if (!extractedProductsData || !extractedProductsData.products || extractedProductsData.products.length === 0) {
      showStatus('没有可导出的商品数据', 'error');
      return;
    }
    
    try {
      const exportData = {
        url: currentPageUrl,
        timestamp: new Date().toISOString(),
        total: extractedProductsData.total,
        products: extractedProductsData.products
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 生成文件名
      const urlObj = new URL(currentPageUrl);
      const hostname = urlObj.hostname.replace(/[^a-zA-Z0-9]/g, '_');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[^0-9]/g, '');
      const filename = `products_${hostname}_${timestamp}.json`;
      
      // 创建下载链接
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      URL.revokeObjectURL(url);
      showStatus(`成功导出 ${extractedProductsData.total} 个商品数据！`, 'success');
    } catch (error) {
      console.error('导出失败:', error);
      showStatus('导出失败: ' + error.message, 'error');
    }
  }
  
  // 切换视图模式
  function toggleView() {
    isCompactView = !isCompactView;
    toggleViewBtn.textContent = isCompactView ? '详细视图' : '紧凑视图';
    
    if (isCompactView) {
      productsResult.classList.add('compact-view');
    } else {
      productsResult.classList.remove('compact-view');
    }
    
    // 重新渲染当前显示的商品
    if (filteredProducts.length > 0) {
      sortAndRenderProducts();
    }
  }
  
  // 绑定事件
  getSourceBtn.addEventListener('click', getPageSource);
  extractProductsBtn.addEventListener('click', extractProducts);
  sendToBackendBtn.addEventListener('click', sendProductsToBackend);
  copySourceBtn.addEventListener('click', copySourceToClipboard);
  downloadSourceBtn.addEventListener('click', downloadSource);
  
  // 新功能事件绑定
  if (searchInput) {
    searchInput.addEventListener('input', searchProducts);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', sortAndRenderProducts);
  }
  if (exportBtn) {
    exportBtn.addEventListener('click', exportProducts);
  }
  if (toggleViewBtn) {
    toggleViewBtn.addEventListener('click', toggleView);
  }
  
  // 服务器数据相关事件绑定
  if (getServerDataBtn) {
    getServerDataBtn.addEventListener('click', getServerData);
  }
  if (dataTypeSelect) {
    dataTypeSelect.addEventListener('change', onDataTypeChange);
  }
  if (refreshServerDataBtn) {
    refreshServerDataBtn.addEventListener('click', refreshServerData);
  }
  if (exportServerDataBtn) {
    exportServerDataBtn.addEventListener('click', exportServerData);
  }
  
  // 初始化时禁用相关按钮
  sendToBackendBtn.disabled = true;
  if (exportBtn) exportBtn.disabled = true;
  if (refreshServerDataBtn) refreshServerDataBtn.disabled = true;
  if (exportServerDataBtn) exportServerDataBtn.disabled = true;
  
  // 初始化插件
  init();
});