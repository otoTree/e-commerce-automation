const cheerio = require('cheerio');
const fs = require('fs');

// 产品信息接口
interface Product {
  id: string;
  title: string;
  price: string;
  originalPrice?: string;
  imageUrl: string;
  productUrl: string;
  company: string;
  companyUrl?: string;
  location?: string;
  minOrder?: string;
  tags?: string[];
}

// 分页信息接口
interface Pagination {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 搜索结果接口
interface SearchResult {
  keyword: string;
  products: Product[];
  pagination: Pagination;
  totalCount?: number;
  filters?: {
    categories?: string[];
    priceRanges?: string[];
    locations?: string[];
  };
}

/**
 * 1688搜索页面数据提取器
 * 处理动态加载的产品数据和分页信息
 */
export class Search1688Extractor {
  
  /**
   * 从HTML内容中提取搜索数据
   * @param html HTML内容
   * @returns 提取的搜索结果
   */
  static extractFromHtml(html: string): SearchResult {
    const $ = cheerio.load(html);
    
    // 初始化结果对象
    const result: SearchResult = {
      keyword: '',
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    };

    try {
      // 1. 提取搜索关键词
      result.keyword = this.extractKeyword($);

      // 2. 提取产品数据 - 优先从JavaScript对象中提取
      result.products = this.extractProductsFromJS($) || this.extractProductsFromHTML($);

      // 3. 提取分页信息
      result.pagination = this.extractPagination($);

      // 4. 提取筛选信息
      result.filters = this.extractFilters($);

      // 5. 提取总数量
      result.totalCount = this.extractTotalCount($);

    } catch (error) {
      console.error('数据提取过程中出现错误:', error);
    }

    return result;
  }

  /**
   * 从文件中提取搜索数据
   * @param filePath 文件路径
   * @returns 提取的搜索结果
   */
  static extractFromFile(filePath: string): SearchResult {
    try {
      const html = fs.readFileSync(filePath, 'utf-8');
      return this.extractFromHtml(html);
    } catch (error) {
      console.error('读取文件失败:', error);
      return {
        keyword: '',
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };
    }
  }

  /**
   * 提取搜索关键词
   */
  private static extractKeyword($: cheerio.CheerioAPI): string {
    // 尝试多种选择器提取关键词
    const selectors = [
      'input[name="keywords"]',
      'input[id="keywords"]',
      '.search-input input',
      '.search-box input',
      'input[type="text"]'
    ];

    for (const selector of selectors) {
      const value = $(selector).val() as string;
      if (value && value.trim()) {
        return value.trim();
      }
    }

    // 从页面标题中提取
    const title = $('title').text();
    const match = title.match(/^([^_]+)/);
    return match ? match[1].trim() : '';
  }

  /**
   * 从JavaScript对象中提取产品数据
   */
  private static extractProductsFromJS($: cheerio.CheerioAPI): Product[] | null {
    const products: Product[] = [];

    try {
      // 查找包含产品数据的script标签
      $('script').each((_, element) => {
        const scriptContent = $(element).html() || '';
        
        // 查找window.data.offerV2或类似的数据结构
        const patterns = [
          /window\.data\.offerV2\s*=\s*({.*?});/s,
          /window\.data\s*=\s*({.*?offerList.*?});/s,
          /offerList\s*:\s*(\[.*?\])/s,
          /"offerList"\s*:\s*(\[.*?\])/s
        ];

        for (const pattern of patterns) {
          const match = scriptContent.match(pattern);
          if (match) {
            try {
              const data = JSON.parse(match[1]);
              
              // 处理不同的数据结构
              let offerList = [];
              if (data.offerList) {
                offerList = data.offerList;
              } else if (Array.isArray(data)) {
                offerList = data;
              } else if (data.data && data.data.offerList) {
                offerList = data.data.offerList;
              }

              // 转换为Product对象
              offerList.forEach((item: any, index: number) => {
                const product: Product = {
                  id: item.offerId || item.id || `product_${index}`,
                  title: item.subject || item.title || item.name || '',
                  price: this.formatPrice(item.price || item.unitPrice || ''),
                  originalPrice: this.formatPrice(item.originalPrice || item.marketPrice),
                  imageUrl: this.formatImageUrl(item.image || item.imageUrl || item.pic),
                  productUrl: this.formatProductUrl(item.detailUrl || item.url || item.link),
                  company: item.company?.name || item.companyName || item.seller || '',
                  companyUrl: item.company?.url || item.companyUrl || '',
                  location: item.company?.location || item.location || '',
                  minOrder: item.minOrderQuantity || item.minOrder || '',
                  tags: item.tags || []
                };
                
                if (product.title) {
                  products.push(product);
                }
              });

              if (products.length > 0) {
                return false; // 找到数据后停止搜索
              }
            } catch (parseError) {
              console.warn('解析JavaScript数据失败:', parseError);
            }
          }
        }
      });

    } catch (error) {
      console.error('从JavaScript提取产品数据失败:', error);
    }

    return products.length > 0 ? products : null;
  }

  /**
   * 从HTML元素中提取产品数据（备用方案）
   */
  private static extractProductsFromHTML($: cheerio.CheerioAPI): Product[] {
    const products: Product[] = [];

    try {
      // 尝试多种可能的产品容器选择器
      const containerSelectors = [
        '.offer-item',
        '.space-offer-card',
        '.product-item',
        '.goods-item',
        '[data-offer-id]',
        '.search-item',
        '.list-item'
      ];

      let productElements: cheerio.Cheerio<any> | null = null;

      for (const selector of containerSelectors) {
        const elements = $(selector);
        if (elements.length > 0) {
          productElements = elements;
          break;
        }
      }

      if (productElements) {
        productElements.each((index, element) => {
          const $item = $(element);
          
          const product: Product = {
            id: $item.attr('data-offer-id') || 
                $item.attr('data-id') || 
                $item.find('[data-offer-id]').attr('data-offer-id') || 
                `html_product_${index}`,
            title: this.extractTextFromSelectors($item, [
              '.offer-title',
              '.product-title', 
              '.goods-title',
              'h3',
              'h4',
              '.title',
              'a[title]'
            ]),
            price: this.extractTextFromSelectors($item, [
              '.price',
              '.offer-price',
              '.product-price',
              '.price-current',
              '.unit-price'
            ]),
            imageUrl: this.extractImageFromSelectors($item, [
              '.offer-img img',
              '.product-img img',
              '.goods-img img',
              'img'
            ]),
            productUrl: this.extractLinkFromSelectors($item, [
              '.offer-title a',
              '.product-title a',
              'h3 a',
              'h4 a',
              'a'
            ]),
            company: this.extractTextFromSelectors($item, [
              '.company-name',
              '.seller-name',
              '.shop-name',
              '.supplier'
            ])
          };

          if (product.title && product.title.trim()) {
            products.push(product);
          }
        });
      }

    } catch (error) {
      console.error('从HTML提取产品数据失败:', error);
    }

    return products;
  }

  /**
   * 提取分页信息
   */
  private static extractPagination($: cheerio.CheerioAPI): Pagination {
    const pagination: Pagination = {
      currentPage: 1,
      totalPages: 1,
      hasNext: false,
      hasPrev: false
    };

    try {
      // 提取当前页码
      const currentPageSelectors = [
        '.fui-current',
        '.current',
        '.active',
        '.page-current',
        '.pagination .current'
      ];

      for (const selector of currentPageSelectors) {
        const currentPageText = $(selector).text().trim();
        if (currentPageText && !isNaN(Number(currentPageText))) {
          pagination.currentPage = parseInt(currentPageText);
          break;
        }
      }

      // 提取总页数
      const totalPagesSelectors = [
        '.fui-paging-total',
        '.total-pages',
        '.page-total',
        '.pagination-total'
      ];

      for (const selector of totalPagesSelectors) {
        const totalText = $(selector).text().trim();
        const match = totalText.match(/(\d+)/);
        if (match) {
          pagination.totalPages = parseInt(match[1]);
          break;
        }
      }

      // 检查是否有下一页和上一页
      pagination.hasNext = $('.fui-next, .next, .page-next').length > 0 && 
                          !$('.fui-next, .next, .page-next').hasClass('disabled');
      pagination.hasPrev = $('.fui-prev, .prev, .page-prev').length > 0 && 
                          !$('.fui-prev, .prev, .page-prev').hasClass('disabled');

    } catch (error) {
      console.error('提取分页信息失败:', error);
    }

    return pagination;
  }

  /**
   * 提取筛选信息
   */
  private static extractFilters($: cheerio.CheerioAPI): any {
    const filters: any = {};

    try {
      // 提取分类筛选
      const categories: string[] = [];
      $('.sn-row .search-filt-item, .filter-category .filter-item').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          categories.push(text);
        }
      });
      if (categories.length > 0) {
        filters.categories = categories;
      }

      // 提取价格范围
      const priceRanges: string[] = [];
      $('.price-filter .filter-item, .price-range .range-item').each((_, element) => {
        const text = $(element).text().trim();
        if (text) {
          priceRanges.push(text);
        }
      });
      if (priceRanges.length > 0) {
        filters.priceRanges = priceRanges;
      }

    } catch (error) {
      console.error('提取筛选信息失败:', error);
    }

    return Object.keys(filters).length > 0 ? filters : undefined;
  }

  /**
   * 提取总数量
   */
  private static extractTotalCount($: cheerio.CheerioAPI): number | undefined {
    try {
      const selectors = [
        '.search-result-count',
        '.total-count',
        '.result-count',
        '.search-total'
      ];

      for (const selector of selectors) {
        const text = $(selector).text();
        const match = text.match(/(\d+)/);
        if (match) {
          return parseInt(match[1]);
        }
      }
    } catch (error) {
      console.error('提取总数量失败:', error);
    }

    return undefined;
  }

  // 辅助方法
  private static extractTextFromSelectors($element: cheerio.Cheerio<any>, selectors: string[]): string {
    for (const selector of selectors) {
      const text = $element.find(selector).first().text().trim() || 
                   $element.find(selector).first().attr('title')?.trim();
      if (text) {
        return text;
      }
    }
    return '';
  }

  private static extractImageFromSelectors($element: cheerio.Cheerio<any>, selectors: string[]): string {
    for (const selector of selectors) {
      const src = $element.find(selector).first().attr('src') || 
                  $element.find(selector).first().attr('data-src');
      if (src) {
        return this.formatImageUrl(src);
      }
    }
    return '';
  }

  private static extractLinkFromSelectors($element: cheerio.Cheerio<any>, selectors: string[]): string {
    for (const selector of selectors) {
      const href = $element.find(selector).first().attr('href');
      if (href) {
        return this.formatProductUrl(href);
      }
    }
    return '';
  }

  private static formatPrice(price: any): string {
    if (!price) return '';
    return String(price).replace(/[^\d.,]/g, '');
  }

  private static formatImageUrl(url: any): string {
    if (!url) return '';
    const urlStr = String(url);
    if (urlStr.startsWith('//')) {
      return 'https:' + urlStr;
    }
    if (urlStr.startsWith('/')) {
      return 'https://www.1688.com' + urlStr;
    }
    return urlStr;
  }

  private static formatProductUrl(url: any): string {
    if (!url) return '';
    const urlStr = String(url);
    if (urlStr.startsWith('//')) {
      return 'https:' + urlStr;
    }
    if (urlStr.startsWith('/')) {
      return 'https://www.1688.com' + urlStr;
    }
    return urlStr;
  }
}

// 使用示例
export function example() {
  const filePath = '/Users/huangjiarui/Desktop/e-commerce-ai/backend/1688-search.html';
  
  try {
    const result = Search1688Extractor.extractFromFile(filePath);
    
    console.log('搜索关键词:', result.keyword);
    console.log('产品数量:', result.products.length);
    console.log('分页信息:', result.pagination);
    
    if (result.products.length > 0) {
      console.log('第一个产品:', result.products[0]);
    }
    
    if (result.filters) {
      console.log('筛选信息:', result.filters);
    }
    
    return result;
  } catch (error) {
    console.error('提取数据失败:', error);
    return null;
  }
}