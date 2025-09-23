/**
 * Ozon网站商品数据提取器
 * 专门处理ozon.ru网站的商品信息提取
 */

class OzonProductExtractor {
  constructor() {
    this.platform = 'ozon';
    this.baseUrl = 'https://www.ozon.ru';
  }

  /**
   * 检测是否为Ozon网站
   */
  isOzonSite() {
    return window.location.hostname.includes('ozon.ru');
  }

  /**
   * 等待页面元素加载
   */
  async waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkElement = () => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }
        
        if (Date.now() - startTime > timeout) {
          reject(new Error(`等待元素超时: ${selector}`));
          return;
        }
        
        setTimeout(checkElement, 100);
      };
      
      checkElement();
    });
  }

  /**
   * 等待页面稳定
   */
  async waitForPageStable(timeout = 5000) {
    return new Promise((resolve) => {
      let lastHeight = document.body.scrollHeight;
      let stableCount = 0;
      
      const checkStability = () => {
        const currentHeight = document.body.scrollHeight;
        if (currentHeight === lastHeight) {
          stableCount++;
          if (stableCount >= 3) {
            resolve();
            return;
          }
        } else {
          stableCount = 0;
          lastHeight = currentHeight;
        }
        
        setTimeout(checkStability, 500);
      };
      
      setTimeout(checkStability, 1000);
      setTimeout(resolve, timeout); // 最大等待时间
    });
  }

  /**
   * 提取商品基本信息
   */
  extractBasicInfo() {
    const selectors = {
      title: [
        'h1[data-widget="webProductHeading"]',
        'h1.tsHeadline550Medium',
        'h1[class*="ProductTitle"]',
        'h1',
        '[data-widget="webProductHeading"] h1'
      ],
      price: [
        '[data-widget="webPrice"] .tsHeadline500Medium',
        '.price-current-price',
        '[class*="Price"] [class*="current"]',
        '.price .current',
        '[data-widget="webPrice"] span'
      ],
      originalPrice: [
        '[data-widget="webPrice"] .tsBodyControl400Small',
        '.price-old-price',
        '[class*="Price"] [class*="old"]',
        '.price .old'
      ],
      images: [
        '[data-widget="webGallery"] img',
        '.product-gallery img',
        '[class*="Gallery"] img',
        '.gallery img'
      ],
      rating: [
        '[data-widget="webReviewInfo"] .tsBodyControl400Small',
        '.rating-value',
        '[class*="Rating"] span',
        '.review-rating'
      ],
      reviewCount: [
        '[data-widget="webReviewInfo"] a',
        '.reviews-count',
        '[class*="Review"] [class*="count"]',
        '.review-count'
      ]
    };

    const result = {};

    // 提取标题
    for (const selector of selectors.title) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        result.title = element.textContent.trim();
        break;
      }
    }

    // 提取价格
    for (const selector of selectors.price) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        result.current_price = element.textContent.trim();
        break;
      }
    }

    // 提取原价
    for (const selector of selectors.originalPrice) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        result.original_price = element.textContent.trim();
        break;
      }
    }

    // 提取图片
    const images = [];
    for (const selector of selectors.images) {
      const elements = document.querySelectorAll(selector);
      elements.forEach(img => {
        if (img.src && !img.src.includes('data:image')) {
          images.push(img.src);
        }
      });
      if (images.length > 0) break;
    }
    result.images = [...new Set(images)]; // 去重

    // 提取评分
    for (const selector of selectors.rating) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        const ratingText = element.textContent.trim();
        const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
        if (ratingMatch) {
          result.rating = parseFloat(ratingMatch[1]);
          break;
        }
      }
    }

    // 提取评论数量
    for (const selector of selectors.reviewCount) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        const reviewText = element.textContent.trim();
        const reviewMatch = reviewText.match(/(\d+)/);
        if (reviewMatch) {
          result.review_count = parseInt(reviewMatch[1]);
          break;
        }
      }
    }

    return result;
  }

  /**
   * 提取商品详细信息
   */
  extractDetailedInfo() {
    const result = {};

    // 提取商品描述
    const descriptionSelectors = [
      '[data-widget="webProductDescription"]',
      '.product-description',
      '[class*="Description"]',
      '.description'
    ];

    for (const selector of descriptionSelectors) {
      const element = document.querySelector(selector);
      if (element && element.textContent.trim()) {
        result.description = element.textContent.trim();
        break;
      }
    }

    // 提取商品特性
    const characteristicsSelectors = [
      '[data-widget="webCharacteristics"]',
      '.product-characteristics',
      '[class*="Characteristics"]',
      '.characteristics'
    ];

    for (const selector of characteristicsSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const characteristics = {};
        const items = element.querySelectorAll('dt, dd, .characteristic-item, [class*="characteristic"]');
        
        let currentKey = null;
        items.forEach(item => {
          const text = item.textContent.trim();
          if (item.tagName === 'DT' || item.classList.contains('key')) {
            currentKey = text;
          } else if (item.tagName === 'DD' || item.classList.contains('value')) {
            if (currentKey) {
              characteristics[currentKey] = text;
              currentKey = null;
            }
          }
        });
        
        if (Object.keys(characteristics).length > 0) {
          result.characteristics = characteristics;
          break;
        }
      }
    }

    return result;
  }

  /**
   * 提取供应商信息
   */
  extractSupplierInfo() {
    const result = {};

    const supplierSelectors = [
      '[data-widget="webSeller"]',
      '.seller-info',
      '[class*="Seller"]',
      '.supplier'
    ];

    for (const selector of supplierSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const nameElement = element.querySelector('a, .name, [class*="name"]');
        if (nameElement) {
          result.name = nameElement.textContent.trim();
        }

        const ratingElement = element.querySelector('.rating, [class*="rating"]');
        if (ratingElement) {
          const ratingText = ratingElement.textContent.trim();
          const ratingMatch = ratingText.match(/(\d+(?:\.\d+)?)/);
          if (ratingMatch) {
            result.rating = parseFloat(ratingMatch[1]);
          }
        }
        break;
      }
    }

    return result;
  }

  /**
   * 主提取方法
   */
  async extract() {
    try {
      console.log('开始提取Ozon商品数据...');
      console.log('页面URL:', window.location.href);

      if (!this.isOzonSite()) {
        throw new Error('不是Ozon网站');
      }

      // 等待页面稳定
      await this.waitForPageStable();

      // 提取基本信息
      const basicInfo = this.extractBasicInfo();
      console.log('基本信息:', basicInfo);

      // 提取详细信息
      const detailedInfo = this.extractDetailedInfo();
      console.log('详细信息:', detailedInfo);

      // 提取供应商信息
      const supplierInfo = this.extractSupplierInfo();
      console.log('供应商信息:', supplierInfo);

      // 构建最终结果
      const result = {
        platform: this.platform,
        platform_product_id: this.extractProductId(),
        url: window.location.href,
        basic_info: {
          title: basicInfo.title || '',
          images: basicInfo.images || [],
          description: detailedInfo.description || ''
        },
        pricing: {
          current_price: basicInfo.current_price || '',
          original_price: basicInfo.original_price || '',
          currency: 'RUB'
        },
        sales_data: {
          rating: basicInfo.rating || 0,
          review_count: basicInfo.review_count || 0
        },
        supplier: {
          name: supplierInfo.name || 'Unknown',
          rating: supplierInfo.rating || 0
        },
        characteristics: detailedInfo.characteristics || {},
        collection_meta: {
          collected_at: new Date().toISOString(),
          collection_duration: 0,
          data_completeness: this.calculateCompleteness(basicInfo, detailedInfo, supplierInfo)
        }
      };

      console.log('Ozon商品提取完成:', result);
      return {
        success: true,
        data: result
      };

    } catch (error) {
      console.error('Ozon商品提取失败:', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  /**
   * 从URL提取商品ID
   */
  extractProductId() {
    const url = window.location.href;
    const match = url.match(/\/product\/[^\/]+-(\d+)\//);
    return match ? match[1] : url.split('/').pop() || 'unknown';
  }

  /**
   * 计算数据完整性
   */
  calculateCompleteness(basicInfo, detailedInfo, supplierInfo) {
    let score = 0;
    let total = 0;

    // 基本信息权重
    const basicFields = ['title', 'current_price', 'images'];
    basicFields.forEach(field => {
      total++;
      if (basicInfo[field] && (Array.isArray(basicInfo[field]) ? basicInfo[field].length > 0 : basicInfo[field].trim())) {
        score++;
      }
    });

    // 详细信息权重
    total++;
    if (detailedInfo.description && detailedInfo.description.trim()) {
      score++;
    }

    // 供应商信息权重
    total++;
    if (supplierInfo.name && supplierInfo.name.trim()) {
      score++;
    }

    return total > 0 ? score / total : 0;
  }
}

// 导出提取器类
window.OzonProductExtractor = OzonProductExtractor;