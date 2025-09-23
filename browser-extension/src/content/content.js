// 内容脚本 - 用于与页面交互
// 这个脚本在每个页面加载时运行

// 1688商品提取器类
class Product1688Extractor {
  constructor(htmlSource) {
    this.htmlSource = htmlSource;
  }
  
  extract() {
    try {
      console.log('开始提取1688商品数据...');
      console.log('页面URL:', window.location.href);
      console.log('HTML源码长度:', this.htmlSource.length);
      
      // 检查是否为1688搜索页面
      if (!window.location.href.includes('1688.com')) {
        console.log('不是1688页面，跳过提取');
        return {
          products: [],
          total: 0,
          error: '不是1688页面',
          extraction_time: new Date().toISOString(),
          page_url: window.location.href,
          source_length: this.htmlSource.length
        };
      }
      
      // 等待页面加载完成
      if (document.readyState !== 'complete') {
        console.log('页面尚未完全加载，等待...');
        return {
          products: [],
          total: 0,
          error: '页面尚未完全加载',
          extraction_time: new Date().toISOString(),
          page_url: window.location.href,
          source_length: this.htmlSource.length
        };
      }
      
      // 尝试多种选择器模式
      const selectors = [
        '.search-offer-wrapper',
        '.offer-item',
        '.offer-wrapper',
        '[data-offer-id]',
        '.list-item'
      ];
      
      let products = [];
      
      // 尝试使用DOM选择器
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        console.log(`选择器 ${selector} 找到 ${elements.length} 个元素`);
        
        if (elements.length > 0) {
          products = Array.from(elements);
          console.log(`使用选择器 ${selector} 找到商品`);
          break;
        }
      }
      
      // 如果DOM选择器没找到，尝试正则表达式
      if (products.length === 0) {
        console.log('DOM选择器未找到商品，尝试正则表达式...');
        const productPattern = /<div[^>]*class="[^"]*offer[^"]*"[^>]*>.*?<\/div>/gs;
        const matches = this.htmlSource.match(productPattern) || [];
        console.log(`正则表达式找到 ${matches.length} 个匹配项`);
        
        if (matches.length === 0) {
          // 尝试更宽泛的模式
          const broadPattern = /<a[^>]*href="[^"]*offer[^"]*"[^>]*>.*?<\/a>/gs;
          const broadMatches = this.htmlSource.match(broadPattern) || [];
          console.log(`宽泛正则表达式找到 ${broadMatches.length} 个匹配项`);
        }
      }
      
      const extractedData = [];
      
      // 处理DOM元素
      if (products.length > 0 && products[0].nodeType) {
        for (let i = 0; i < Math.min(products.length, 20); i++) {
          const element = products[i];
          
          // 提取链接
          const linkElement = element.querySelector('a[href*="offer"]') || element.querySelector('a');
          const link = linkElement ? linkElement.href : null;
          
          // 提取图片
          const imgElement = element.querySelector('img');
          const image = imgElement ? imgElement.src : null;
          
          // 提取标题
          const titleElement = element.querySelector('.title-text') || 
                              element.querySelector('[title]') ||
                              element.querySelector('h3') ||
                              element.querySelector('.title');
          const title = titleElement ? (titleElement.textContent || titleElement.title).trim() : null;
          
          // 提取价格
          const priceElement = element.querySelector('.text-main') ||
                              element.querySelector('.price') ||
                              element.querySelector('[class*="price"]');
          const price = priceElement ? priceElement.textContent.trim() : null;
          
          // 提取供应商
          const supplierElement = element.querySelector('.desc-text') ||
                                 element.querySelector('[class*="company"]') ||
                                 element.querySelector('[class*="supplier"]');
          const supplier = supplierElement ? supplierElement.textContent.trim() : null;
          
          const productData = {
            index: i + 1,
            link,
            image,
            title,
            price,
            supplier,
            sales: null,
            extraction_method: 'DOM'
          };
          
          // 只添加有效数据
          if (title || link) {
            extractedData.push(productData);
          }
        }
      }
      
      console.log(`成功提取 ${extractedData.length} 个商品`);
      
      return {
        products: extractedData,
        total: extractedData.length,
        extraction_time: new Date().toISOString(),
        page_url: window.location.href,
        source_length: this.htmlSource.length,
        page_ready_state: document.readyState,
        debug_info: {
          selectors_tried: selectors,
          dom_elements_found: products.length,
          extraction_method: extractedData.length > 0 ? 'DOM' : 'none'
        }
      };
    } catch (error) {
      console.error('商品提取失败:', error);
      return {
        products: [],
        total: 0,
        error: error.message,
        extraction_time: new Date().toISOString(),
        page_url: window.location.href,
        source_length: this.htmlSource.length,
        page_ready_state: document.readyState
      };
    }
  }
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageSource') {
    try {
      // 获取完整的HTML源码
      const htmlSource = document.documentElement.outerHTML;
      sendResponse({ success: true, source: htmlSource });
    } catch (error) {
      console.error('获取页面源码失败:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // 保持消息通道开放
  }
  
  if (request.action === 'getPageInfo') {
    try {
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        domain: window.location.hostname,
        readyState: document.readyState,
        timestamp: new Date().toISOString()
      };
      sendResponse({ success: true, pageInfo });
    } catch (error) {
      console.error('获取页面信息失败:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
  
  if (request.action === 'extractProducts') {
    console.log('收到商品提取请求');
    
    try {
      // 检测网站类型并使用相应的提取器
      if (window.location.href.includes('ozon.ru')) {
        console.log('检测到Ozon网站，使用Ozon提取器');
        
        // 确保Ozon提取器已加载
        if (typeof window.OzonProductExtractor === 'undefined') {
          // 动态加载Ozon提取器
          const script = document.createElement('script');
          script.src = chrome.runtime.getURL('src/content/ozon_extractor.js');
          document.head.appendChild(script);
          
          // 等待脚本加载
          script.onload = async () => {
            const ozonExtractor = new window.OzonProductExtractor();
            const result = await ozonExtractor.extract();
            
            if (result.success) {
              sendResponse({ 
                success: true, 
                data: {
                  products: [result.data],
                  total: 1,
                  extraction_time: new Date().toISOString(),
                  page_url: window.location.href,
                  platform: 'ozon'
                }
              });
            } else {
              sendResponse({ 
                success: false, 
                error: result.error,
                data: {
                  products: [],
                  total: 0,
                  error: result.error,
                  extraction_time: new Date().toISOString(),
                  page_url: window.location.href,
                  platform: 'ozon'
                }
              });
            }
          };
          
          script.onerror = () => {
            sendResponse({ 
              success: false, 
              error: '无法加载Ozon提取器',
              data: {
                products: [],
                total: 0,
                error: '无法加载Ozon提取器',
                extraction_time: new Date().toISOString(),
                page_url: window.location.href,
                platform: 'ozon'
              }
            });
          };
        } else {
          // 直接使用已加载的Ozon提取器
          const ozonExtractor = new window.OzonProductExtractor();
          ozonExtractor.extract().then(result => {
            if (result.success) {
              sendResponse({ 
                success: true, 
                data: {
                  products: [result.data],
                  total: 1,
                  extraction_time: new Date().toISOString(),
                  page_url: window.location.href,
                  platform: 'ozon'
                }
              });
            } else {
              sendResponse({ 
                success: false, 
                error: result.error,
                data: {
                  products: [],
                  total: 0,
                  error: result.error,
                  extraction_time: new Date().toISOString(),
                  page_url: window.location.href,
                  platform: 'ozon'
                }
              });
            }
          });
        }
      } else if (window.location.href.includes('1688.com')) {
        console.log('检测到1688网站，使用1688提取器');
        
        // 获取页面HTML源码
        const htmlSource = document.documentElement.outerHTML;
        
        // 创建提取器并提取商品
        const extractor = new Product1688Extractor(htmlSource);
        const result = extractor.extract();
        
        console.log('商品提取结果:', result);
        sendResponse({ success: true, data: result });
      } else {
        // 不支持的网站
        sendResponse({ 
          success: false, 
          error: '不支持的网站类型',
          data: {
            products: [],
            total: 0,
            error: '不支持的网站类型',
            extraction_time: new Date().toISOString(),
            page_url: window.location.href,
            platform: 'unknown'
          }
        });
      }
    } catch (error) {
      console.error('商品提取失败:', error);
      sendResponse({ 
        success: false, 
        error: error.message,
        data: {
          products: [],
          total: 0,
          error: error.message,
          extraction_time: new Date().toISOString(),
          page_url: window.location.href
        }
      });
    }
    return true;
  }
});

console.log('1688商品提取内容脚本已加载');