// 内容脚本 - 用于与页面交互
// 这个脚本在每个页面加载时运行

// 1688商品提取器类
class Product1688Extractor {
  constructor(htmlSource) {
    this.htmlSource = htmlSource;
  }
  
  extract() {
    try {
      // 使用经过验证的正则表达式模式
      const productPattern = /<a[^>]*search-offer-wrapper[^>]*>.*?<div class="offer-shop-row">.*?<\/div>/gs;
      const products = this.htmlSource.match(productPattern) || [];
      
      console.log(`找到 ${products.length} 个商品`);
      
      const extractedData = [];
      // 移除数量限制，提取所有产品
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        // 提取链接
        const linkMatch = product.match(/href="([^"]*)"/i);
        const link = linkMatch ? linkMatch[1] : null;
        
        // 提取图片
        const imgMatch = product.match(/<img[^>]*src="([^"]*)"/i);
        const image = imgMatch ? imgMatch[1] : null;
        
        // 提取标题 - 查找 title-text 类中的内容
        const titleMatch = product.match(/<div class="title-text"><div>([^<]*)<\/div><\/div>/i);
        const title = titleMatch ? titleMatch[1].trim() : null;
        
        // 提取价格 - 查找 text-main 类中的内容
        const priceMatch = product.match(/<div class="text-main">([^<]*)<\/div>/i);
        const price = priceMatch ? priceMatch[1].trim() : null;
        
        // 提取供应商 - 查找供应商链接中的文本
        const supplierMatch = product.match(/<div class="desc-text"[^>]*>([^<]*公司)<\/div>/i);
        const supplier = supplierMatch ? supplierMatch[1].trim() : null;
        
        // 提取销量 - 查找销量信息
        const salesMatch = product.match(/<div class="col-desc_after">.*?<div class="desc-text"[^>]*>([^<]*件)<\/div>/is) ||
                          product.match(/<div class="col-desc_after"[^>]*>.*?<div class="desc-text"[^>]*>([^<]*万\+件)<\/div>/is) ||
                          product.match(/<span[^>]*title="[^"]*件"[^>]*>([^<]*)<\/span>/i);
        const sales = salesMatch ? salesMatch[1].trim() : null;
        
        const productData = {
          index: i + 1,
          link,
          image,
          title,
          price,
          supplier,
          sales
        };
        
        extractedData.push(productData);
      }
      
      return {
        products: extractedData,
        total: extractedData.length,
        extraction_time: new Date().toISOString(),
        page_url: window.location.href,
        source_length: this.htmlSource.length
      };
    } catch (error) {
      console.error('商品提取失败:', error);
      return {
        products: [],
        total: 0,
        error: error.message,
        extraction_time: new Date().toISOString(),
        page_url: window.location.href,
        source_length: this.htmlSource.length
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
      sendResponse({ success: false, error: error.message });
    }
  }
  
  if (request.action === 'getPageInfo') {
    try {
      const pageInfo = {
        url: window.location.href,
        title: document.title,
        charset: document.characterSet,
        lastModified: document.lastModified,
        readyState: document.readyState
      };
      sendResponse({ success: true, info: pageInfo });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  
  if (request.action === 'extractProducts') {
    try {
      // 获取页面源码
      const htmlSource = document.documentElement.outerHTML;
      
      // 使用1688专用提取器
      const extractor = new Product1688Extractor(htmlSource);
      const result = extractor.extract();
      
      sendResponse({ success: true, data: result });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
  }
  
  return true; // 保持消息通道开放
});

// 页面加载完成时的处理
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('页面源码查看器：页面加载完成');
  });
} else {
  console.log('页面源码查看器：内容脚本已注入');
}