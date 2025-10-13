// 内容脚本 - 与网页交互
class ContentScript {
  constructor() {
    this.init()
  }

  init() {
    // 监听来自popup的消息
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse)
      return true // 保持消息通道开放
    })

    // 页面加载完成后的初始化
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onPageReady())
    } else {
      this.onPageReady()
    }
  }

  onPageReady() {
    // 检测当前网站类型
    this.detectWebsiteType()
    
    // 注入AI助手界面
    this.injectAssistantUI()
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'analyzePage':
          const analysis = await this.analyzePage()
          sendResponse({ success: true, data: analysis })
          break
          
        case 'comparePrice':
          const priceComparison = await this.comparePrice()
          sendResponse({ success: true, data: priceComparison })
          break
          
        case 'summarizeReviews':
          const reviewSummary = await this.summarizeReviews()
          sendResponse({ success: true, data: reviewSummary })
          break

        case 'uploadPageHTML':
          const uploadResult = await this.uploadPageHTML()
          sendResponse(uploadResult)
          break

        case 'upload1688SearchData':
          const upload1688Result = await this.upload1688SearchData()
          sendResponse(upload1688Result)
          break

        case 'autoAnalyze':
          // 自动分析页面
          console.log('Auto analyzing page...')
          const autoAnalysis = await this.analyzePage()
          console.log('Auto analysis result:', autoAnalysis)
          break
          
        default:
          sendResponse({ success: false, error: 'Unknown action' })
      }
    } catch (error) {
      console.error('Content script error:', error)
      sendResponse({ success: false, error: error.message })
    }
  }

  detectWebsiteType() {
    const hostname = window.location.hostname.toLowerCase()
    const url = window.location.href.toLowerCase()
    
    console.log('Detecting website type:', { hostname, url })
    
    // 检测常见电商网站
    const ecommercePatterns = [
      'taobao.com', 'tmall.com', 'jd.com', 'amazon.com', 'amazon.cn',
      'suning.com', 'vip.com', 'dangdang.com', 'gome.com.cn',
      'shopify', 'woocommerce', 'magento', '1688.com'
    ]
    
    this.websiteType = 'unknown'
    
    for (const pattern of ecommercePatterns) {
      if (hostname.includes(pattern)) {
        this.websiteType = 'ecommerce'
        this.platform = pattern
        break
      }
    }
    
    // 检测1688搜索页面 - 扩展检测条件
    if (hostname.includes('1688.com')) {
      // 更宽泛的搜索页面检测条件
      if (url.includes('search') || 
          url.includes('offer_search') || 
          url.includes('selloffer') ||
          url.includes('keywords=') ||
          url.includes('q=') ||
          document.querySelector('.offer-item, .sm-offer-item, .offer-wrapper')) {
        this.is1688SearchPage = true
        this.websiteType = 'search_1688'
        console.log('Detected 1688 search page:', { url, websiteType: this.websiteType })
      }
    }
    
    console.log('Website detection result:', {
      websiteType: this.websiteType,
      platform: this.platform,
      is1688SearchPage: this.is1688SearchPage
    })
    
    // 检测是否为商品详情页
    if (this.websiteType === 'ecommerce') {
      this.isProductPage = this.detectProductPage()
    }
  }

  detectProductPage() {
    // 通用商品页面检测逻辑
    const indicators = [
      'product', 'item', 'goods', 'detail', 'buy', 'cart',
      '商品', '详情', '购买', '加入购物车'
    ]
    
    const pageText = document.body.innerText.toLowerCase()
    const pageUrl = window.location.href.toLowerCase()
    
    return indicators.some(indicator => 
      pageText.includes(indicator) || pageUrl.includes(indicator)
    )
  }

  async analyzePage() {
    const analysis = {
      url: window.location.href,
      title: document.title,
      websiteType: this.websiteType,
      platform: this.platform || 'unknown',
      isProductPage: this.isProductPage,
      is1688SearchPage: this.is1688SearchPage || false
    }

    if (this.isProductPage) {
      // 提取商品信息
      analysis.productInfo = this.extractProductInfo()
    }

    if (this.is1688SearchPage) {
      // 提取1688搜索页面信息
      analysis.searchInfo = this.extract1688SearchInfo()
    }

    return `网站类型: ${analysis.websiteType}
平台: ${analysis.platform}
是否为商品页: ${analysis.isProductPage ? '是' : '否'}
是否为1688搜索页: ${analysis.is1688SearchPage ? '是' : '否'}
页面标题: ${analysis.title}

${analysis.productInfo ? `商品信息:
${JSON.stringify(analysis.productInfo, null, 2)}` : ''}

${analysis.searchInfo ? `搜索信息:
${JSON.stringify(analysis.searchInfo, null, 2)}` : '未检测到搜索信息'}`
  }

  extractProductInfo() {
    const productInfo = {}

    // 尝试提取商品标题
    const titleSelectors = [
      'h1', '.product-title', '.item-title', '.goods-title',
      '[data-testid="product-title"]', '.pdp-product-name'
    ]
    
    for (const selector of titleSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent.trim()) {
        productInfo.title = element.textContent.trim()
        break
      }
    }

    // 尝试提取价格
    const priceSelectors = [
      '.price', '.product-price', '.item-price', '.current-price',
      '[data-testid="price"]', '.price-current', '.sale-price'
    ]
    
    for (const selector of priceSelectors) {
      const element = document.querySelector(selector)
      if (element && element.textContent.trim()) {
        productInfo.price = element.textContent.trim()
        break
      }
    }

    // 尝试提取商品图片
    const imageSelectors = [
      '.product-image img', '.item-image img', '.goods-image img',
      '[data-testid="product-image"]', '.main-image img'
    ]
    
    for (const selector of imageSelectors) {
      const element = document.querySelector(selector)
      if (element && element.src) {
        productInfo.image = element.src
        break
      }
    }

    return productInfo
  }

  extract1688SearchInfo() {
    const searchInfo = {}

    try {
      // 提取搜索关键词
      const urlParams = new URLSearchParams(window.location.search)
      searchInfo.keyword = urlParams.get('keywords') || urlParams.get('q') || ''
      
      // 从页面标题中提取关键词（备用方案）
      if (!searchInfo.keyword) {
        const titleMatch = document.title.match(/(.+?)[-_]/)
        if (titleMatch) {
          searchInfo.keyword = titleMatch[1].trim()
        }
      }

      // 提取搜索结果数量
      const resultCountSelectors = [
        '.sm-floorhead-typeaheadresult',
        '.offer-count',
        '.result-count',
        '[data-spm-anchor-id*="result"]'
      ]
      
      for (const selector of resultCountSelectors) {
        const element = document.querySelector(selector)
        if (element && element.textContent) {
          const countMatch = element.textContent.match(/(\d+)/)
          if (countMatch) {
            searchInfo.totalCount = parseInt(countMatch[1])
            break
          }
        }
      }

      // 提取产品列表
      searchInfo.products = this.extract1688Products()

      // 提取分页信息
      searchInfo.pagination = this.extract1688Pagination()

    } catch (error) {
      console.error('Error extracting 1688 search info:', error)
      searchInfo.error = error.message
    }

    return searchInfo
  }

  extract1688Products() {
    const products = []
    
    try {
      // 1688搜索结果的常见选择器
      const productSelectors = [
        '.offer-item',
        '.sm-offer-item',
        '.offer-wrapper',
        '[data-spm-anchor-id*="offer"]'
      ]
      
      let productElements = []
      for (const selector of productSelectors) {
        productElements = document.querySelectorAll(selector)
        if (productElements.length > 0) break
      }

      productElements.forEach((element, index) => {
        if (index >= 20) return // 限制提取数量
        
        const product = {}
        
        // 提取标题
        const titleSelectors = [
          '.offer-title a',
          '.title a',
          '.offer-title',
          'h3 a',
          'h4 a'
        ]
        
        for (const selector of titleSelectors) {
          const titleEl = element.querySelector(selector)
          if (titleEl && titleEl.textContent.trim()) {
            product.title = titleEl.textContent.trim()
            product.url = titleEl.href
            break
          }
        }

        // 提取价格
        const priceSelectors = [
          '.offer-price',
          '.price',
          '.price-range',
          '[data-spm*="price"]'
        ]
        
        for (const selector of priceSelectors) {
          const priceEl = element.querySelector(selector)
          if (priceEl && priceEl.textContent.trim()) {
            product.price = priceEl.textContent.trim()
            break
          }
        }

        // 提取图片
        const imgSelectors = [
          '.offer-img img',
          '.img img',
          'img[data-src]',
          'img[src]'
        ]
        
        for (const selector of imgSelectors) {
          const imgEl = element.querySelector(selector)
          if (imgEl) {
            product.image = imgEl.dataset.src || imgEl.src
            break
          }
        }

        // 提取供应商信息
        const supplierSelectors = [
          '.offer-company',
          '.company-name',
          '.supplier-name',
          '[data-spm*="company"]'
        ]
        
        for (const selector of supplierSelectors) {
          const supplierEl = element.querySelector(selector)
          if (supplierEl && supplierEl.textContent.trim()) {
            product.supplier = supplierEl.textContent.trim()
            break
          }
        }

        // 提取地区信息
        const locationSelectors = [
          '.offer-location',
          '.location',
          '.area',
          '[data-spm*="location"]'
        ]
        
        for (const selector of locationSelectors) {
          const locationEl = element.querySelector(selector)
          if (locationEl && locationEl.textContent.trim()) {
            product.location = locationEl.textContent.trim()
            break
          }
        }

        // 提取最小起订量
        const moqSelectors = [
          '.offer-moq',
          '.moq',
          '.min-order',
          '[data-spm*="moq"]'
        ]
        
        for (const selector of moqSelectors) {
          const moqEl = element.querySelector(selector)
          if (moqEl && moqEl.textContent.trim()) {
            product.minOrderQuantity = moqEl.textContent.trim()
            break
          }
        }

        if (product.title) {
          products.push(product)
        }
      })
    } catch (error) {
      console.error('Error extracting 1688 products:', error)
    }

    return products
  }

  extract1688Pagination() {
    const pagination = {}
    
    try {
      // 提取当前页码
      const currentPageSelectors = [
        '.pagination .current',
        '.page-current',
        '.active',
        '[aria-current="page"]'
      ]
      
      for (const selector of currentPageSelectors) {
        const element = document.querySelector(selector)
        if (element && element.textContent.trim()) {
          pagination.currentPage = parseInt(element.textContent.trim())
          break
        }
      }

      // 提取总页数
      const totalPagesSelectors = [
        '.pagination a:last-child',
        '.page-total',
        '.total-pages'
      ]
      
      for (const selector of totalPagesSelectors) {
        const element = document.querySelector(selector)
        if (element && element.textContent.trim()) {
          const pageMatch = element.textContent.match(/(\d+)/)
          if (pageMatch) {
            pagination.totalPages = parseInt(pageMatch[1])
            break
          }
        }
      }

      // 检查是否有下一页
      const nextPageSelectors = [
        '.pagination .next',
        '.page-next',
        '[aria-label="下一页"]'
      ]
      
      for (const selector of nextPageSelectors) {
        const element = document.querySelector(selector)
        if (element && !element.classList.contains('disabled')) {
          pagination.hasNextPage = true
          break
        }
      }

    } catch (error) {
      console.error('Error extracting 1688 pagination:', error)
    }

    return pagination
  }

  async comparePrice() {
    if (!this.isProductPage) {
      return '当前页面不是商品页面，无法进行价格比较'
    }

    const productInfo = this.extractProductInfo()
    
    if (!productInfo.title) {
      return '无法获取商品信息，价格比较失败'
    }

    // 这里可以调用后端API进行价格比较
    return `商品: ${productInfo.title}
当前价格: ${productInfo.price || '未知'}

价格比较功能正在开发中...
将来会支持跨平台价格对比`
  }

  async summarizeReviews() {
    if (!this.isProductPage) {
      return '当前页面不是商品页面，无法分析评价'
    }

    // 尝试提取评价信息
    const reviewSelectors = [
      '.review', '.comment', '.feedback', '.evaluation',
      '[data-testid="review"]', '.user-review'
    ]
    
    let reviewCount = 0
    for (const selector of reviewSelectors) {
      const elements = document.querySelectorAll(selector)
      reviewCount += elements.length
    }

    return `找到 ${reviewCount} 条评价信息

评价分析功能正在开发中...
将来会支持:
- 情感分析
- 关键词提取
- 评分统计
- 优缺点总结`
  }

  injectAssistantUI() {
    // 创建浮动助手按钮
    const assistantButton = document.createElement('div')
    assistantButton.id = 'ai-assistant-button'
    assistantButton.innerHTML = '🤖'
    assistantButton.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s ease;
    `
    
    assistantButton.addEventListener('mouseenter', () => {
      assistantButton.style.transform = 'scale(1.1)'
    })
    
    assistantButton.addEventListener('mouseleave', () => {
      assistantButton.style.transform = 'scale(1)'
    })
    
    assistantButton.addEventListener('click', () => {
      // 打开插件弹窗或显示快捷功能
      this.showQuickActions()
    })
    
    document.body.appendChild(assistantButton)
  }

  showQuickActions() {
    // 显示快捷操作面板
    const existingPanel = document.getElementById('ai-quick-panel')
    if (existingPanel) {
      existingPanel.remove()
      return
    }

    const quickPanel = document.createElement('div')
    quickPanel.id = 'ai-quick-panel'
    quickPanel.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 20px;
      width: 200px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      z-index: 10001;
      padding: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `
    
    quickPanel.innerHTML = `
      <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: #374151;">
        AI助手
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <button onclick="this.parentElement.parentElement.remove()" style="
          padding: 8px 12px; border: none; border-radius: 4px; 
          background: #f3f4f6; color: #374151; cursor: pointer;
          font-size: 12px; text-align: left;
        ">🔍 分析页面</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          padding: 8px 12px; border: none; border-radius: 4px; 
          background: #f3f4f6; color: #374151; cursor: pointer;
          font-size: 12px; text-align: left;
        ">💰 价格比较</button>
        <button onclick="this.parentElement.parentElement.remove()" style="
          padding: 8px 12px; border: none; border-radius: 4px; 
          background: #f3f4f6; color: #374151; cursor: pointer;
          font-size: 12px; text-align: left;
        ">⭐ 评价摘要</button>
      </div>
    `
    
    document.body.appendChild(quickPanel)
    
    // 点击外部关闭面板
    setTimeout(() => {
      document.addEventListener('click', (e) => {
        if (!quickPanel.contains(e.target) && e.target.id !== 'ai-assistant-button') {
          quickPanel.remove()
        }
      }, { once: true })
    }, 100)
  }

  async uploadPageHTML() {
    try {
      // 获取页面HTML源码
      const html = document.documentElement.outerHTML
      
      // 获取页面基本信息
      const pageData = {
        url: window.location.href,
        html: html,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        metadata: {
          websiteType: this.websiteType,
          platform: this.platform || 'unknown',
          isProductPage: this.isProductPage,
          htmlSize: html.length
        }
      }

      // 获取后端API地址
      const settings = await this.getSettings()
      const apiEndpoint = settings.apiEndpoint || 'http://localhost:3001'
      
      // 发送HTML到后端
      const response = await fetch(`${apiEndpoint}/api/pages/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pageData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        success: true,
        message: '页面HTML已成功上传到后端',
        data: result.data
      }
    } catch (error) {
      console.error('Upload HTML error:', error)
      return {
        success: false,
        message: `上传失败: ${error.message}`
      }
    }
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(['settings'], (result) => {
        resolve(result.settings || {})
      })
    })
  }

  async upload1688SearchData() {
    try {
      console.log('Starting 1688 search data upload...')
      console.log('Current page info:', {
        url: window.location.href,
        hostname: window.location.hostname,
        is1688SearchPage: this.is1688SearchPage,
        websiteType: this.websiteType
      })
      
      if (!this.is1688SearchPage) {
        console.log('Not a 1688 search page, aborting upload')
        return {
          success: false,
          message: `当前页面不是1688搜索页面。检测结果: websiteType=${this.websiteType}, is1688SearchPage=${this.is1688SearchPage}`
        }
      }

      // 获取页面HTML源码
      const html = document.documentElement.outerHTML
      console.log('HTML content length:', html.length)
      
      // 提取1688搜索数据
      const searchInfo = this.extract1688SearchInfo()
      console.log('Extracted search info:', searchInfo)
      
      // 构建请求数据
      const requestData = {
        url: window.location.href,
        htmlContent: html
      }
      console.log('Request data prepared:', {
        url: requestData.url,
        htmlContentLength: requestData.htmlContent.length
      })

      // 获取后端API地址
      const settings = await this.getSettings()
      const apiEndpoint = settings.apiEndpoint || 'http://localhost:3001'
      console.log('API endpoint:', apiEndpoint)
      
      // 发送数据到后端1688搜索API
      console.log('Sending request to backend...')
      const response = await fetch(`${apiEndpoint}/api/search-1688`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Backend response error:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }

      const result = await response.json()
      console.log('Backend response:', result)
      
      return {
        success: true,
        message: '1688搜索数据已成功上传到后端',
        data: {
          extractedData: searchInfo,
          backendResult: result
        }
      }
    } catch (error) {
      console.error('Upload 1688 search data error:', error)
      return {
        success: false,
        message: `上传失败: ${error.message}`
      }
    }
  }
}

// 初始化内容脚本
new ContentScript()