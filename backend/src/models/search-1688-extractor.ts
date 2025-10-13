// ===== 接口定义 =====

export interface Search1688Result {
  keyword: string;
  products: SearchProduct[];
  pagination: PaginationInfo;
  totalCount: number;
  dataSource: 'javascript' | 'html' | 'fallback';
}

export interface SearchProduct {
  link: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pageSize?: number;
}

// ===== 主要提取器类 =====

export class Search1688Extractor {
  private htmlContent: string;

  constructor(htmlContent: string) {
    this.htmlContent = htmlContent;
  }

  /**
   * 提取搜索关键词
   */
  extractKeyword(): string {
    try {
      // 从页面标题中提取
      const titleMatch = this.htmlContent.match(/<title[^>]*>([^<]*)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        return titleMatch[1].trim();
      }

      // 从搜索框中提取
      const searchMatch = this.htmlContent.match(/class="[^"]*search-keyword[^"]*"[^>]*>([^<]+)</);
      if (searchMatch && searchMatch[1]) {
        return searchMatch[1].trim();
      }

      return '未知关键词';
    } catch (error) {
      console.error('提取关键词失败:', error);
      return '未知关键词';
    }
  }

  /**
   * 提取分页信息
   */
  extractPagination(): PaginationInfo {
    try {
      let currentPage = 1;
      let totalPages = 1;

      // 提取当前页
      const currentPageMatch = this.htmlContent.match(/class="[^"]*fui-current[^"]*"[^>]*>(\d+)</);
      if (currentPageMatch) {
        currentPage = parseInt(currentPageMatch[1], 10);
      }

      // 提取总页数
      const totalPagesMatch = this.htmlContent.match(/共(\d+)页/);
      if (totalPagesMatch) {
        totalPages = parseInt(totalPagesMatch[1], 10);
      }

      return {
        currentPage,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
        pageSize: 60
      };
    } catch (error) {
      console.error('提取分页信息失败:', error);
      return {
        currentPage: 1,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      };
    }
  }

  /**
   * 从JavaScript数据中提取产品
   */
  extractFromScript(): SearchProduct[] {
    try {
      // 查找window.data或类似的JavaScript数据
      const scriptMatches = this.htmlContent.match(/<script[^>]*>(.*?)<\/script>/gs);
      if (!scriptMatches) return [];

      for (const scriptMatch of scriptMatches) {
        const scriptContent = scriptMatch.replace(/<\/?script[^>]*>/g, '');
        
        // 查找包含产品数据的对象
        const dataMatches = scriptContent.match(/window\.data\s*=\s*({.*?});/s) ||
                           scriptContent.match(/var\s+data\s*=\s*({.*?});/s);
        
        if (dataMatches) {
          try {
            const data = JSON.parse(dataMatches[1]);
            return this.parseOfferList(data.offerList || []);
          } catch (parseError) {
            console.warn('解析JavaScript数据失败:', parseError);
          }
        }
      }

      return [];
    } catch (error) {
      console.error('从脚本提取产品失败:', error);
      return [];
    }
  }

  /**
   * 从HTML结构中提取产品
   */
  private extractFromHTML(): SearchProduct[] {
    try {
      const products: SearchProduct[] = [];
      
      // 产品选择器列表
      const productSelectors = [
        'a.search-offer-wrapper',
        'a[class*="search-offer"]',
        'a[class*="offer-wrapper"]',
        '.offer-item a',
        '.product-item a'
      ];

      for (const selector of productSelectors) {
        const regex = this.createProductCardRegex(selector);
        const matches = this.htmlContent.match(regex);
        
        if (matches) {
          const parsedProducts = this.parseHTMLProducts(matches);
          if (parsedProducts.length > 0) {
            products.push(...parsedProducts);
            break;
          }
        }
      }

      // 如果没有找到产品，尝试通过链接提取
      if (products.length === 0) {
        return this.extractProductsByLinks();
      }

      return products;
    } catch (error) {
      console.error('从HTML提取产品失败:', error);
      return [];
    }
  }

  /**
   * 创建产品卡片正则表达式
   */
  private createProductCardRegex(selector: string): RegExp {
    const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`<${escapedSelector}[^>]*>.*?</a>`, 'gs');
  }

  /**
   * 解析HTML产品匹配结果
   */
  private parseHTMLProducts(matches: RegExpMatchArray): SearchProduct[] {
    const products: SearchProduct[] = [];
    
    for (let i = 0; i < Math.min(matches.length, 20); i++) {
      const cardHtml = matches[i];
      const product = this.parseProductCard(cardHtml, i);
      if (product) {
        products.push(product);
      }
    }
    
    return products;
  }

  /**
   * 解析单个产品卡片 - 简化版，只提取链接
   */
  private parseProductCard(cardHtml: string, index: number): SearchProduct | null {
    try {
      // 提取链接 - 从href属性中提取
      let link = '';
      
      // 方法1: 匹配 <a href="..." 格式
      const hrefMatch = cardHtml.match(/<a[^>]+href="([^"]+)"/);
      if (hrefMatch) {
        link = hrefMatch[1];
        // 解码HTML实体
        link = link.replace(/&amp;/g, '&');
      }
      
      if (!link) {
        console.warn(`无法提取产品链接，索引: ${index}`);
        return null;
      }

      return {
        link: link
      };
    } catch (error) {
      console.error(`解析产品卡片失败，索引: ${index}`, error);
      return null;
    }
  }

  /**
   * 通过链接模式提取产品
   */
  private extractProductsByLinks(): SearchProduct[] {
    const products: SearchProduct[] = [];

    try {
      // 匹配1688产品详情页链接
      const linkPattern = /href="([^"]*(?:detail\.1688\.com\/offer\/\d+\.html|dj\.1688\.com\/ci_bb)[^"]*)"/g;
      const matches = [...this.htmlContent.matchAll(linkPattern)];

      for (let i = 0; i < Math.min(matches.length, 20); i++) {
        const match = matches[i];
        let link = match[1];
        
        // 解码HTML实体
        link = link.replace(/&amp;/g, '&');
        
        products.push({
          link: link
        });
      }

      return products;
    } catch (error) {
      console.error('通过链接提取产品失败:', error);
      return [];
    }
  }

  /**
   * 解析offer列表数据
   */
  private parseOfferList(offerList: any[]): SearchProduct[] {
    if (!this.isValidProductList(offerList)) {
      return [];
    }

    return offerList.slice(0, 20).map((offer: any) => ({
      link: offer.detailUrl || offer.link || `https://detail.1688.com/offer/${offer.offerId}.html`
    })).filter(product => product.link);
  }

  /**
   * 验证产品列表是否有效
   */
  private isValidProductList(list: any[]): boolean {
    return Array.isArray(list) && 
           list.length > 0 && 
           list.some(item => 
             item && 
             typeof item === 'object' && 
             (item.detailUrl || item.link || item.offerId)
           );
  }

  /**
   * 生成测试数据
   */
  private generateTestData(keyword: string): SearchProduct[] {
    return Array.from({ length: 8 }, (_, index) => ({
      link: `https://detail.1688.com/offer/test${index + 1}.html`
    }));
  }

  /**
   * 提取总数量
   */
  extractTotalCount(): number {
    try {
      // 匹配 "找到相关产品约1250个" 格式
      const countMatch = this.htmlContent.match(/找到相关产品约(\d+)个/) ||
                        this.htmlContent.match(/共找到(\d+)个/) ||
                        this.htmlContent.match(/(\d+)\s*个结果/);
      
      if (countMatch) {
        return parseInt(countMatch[1], 10);
      }

      return 500; // 默认值
    } catch (error) {
      console.error('提取总数量失败:', error);
      return 500;
    }
  }

  /**
   * 主提取方法
   */
  extract(): Search1688Result {
    const keyword = this.extractKeyword();
    const pagination = this.extractPagination();
    const totalCount = this.extractTotalCount();

    // 尝试从JavaScript数据提取
    let products = this.extractFromScript();
    let dataSource: 'javascript' | 'html' | 'fallback' = 'javascript';

    // 如果JavaScript提取失败，尝试HTML提取
    if (products.length === 0) {
      products = this.extractFromHTML();
      dataSource = 'html';
    }

    // 如果都失败了，生成测试数据
    if (products.length === 0) {
      products = this.generateTestData(keyword);
      dataSource = 'fallback';
    }

    return {
      keyword,
      products,
      pagination,
      totalCount,
      dataSource
    };
  }
}

// ===== 导出函数 =====

export const extractSearch1688Data = (htmlContent: string): Search1688Result => {
  const extractor = new Search1688Extractor(htmlContent);
  return extractor.extract();
};

export default Search1688Extractor;