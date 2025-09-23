import * as cheerio from 'cheerio';
import type { ISearchPageData, ISearchProductItem } from '../../models/index.js';

// 搜索页解析结果接口
export interface SearchParseResult {
  success: boolean;
  data?: Partial<ISearchPageData>;
  error?: string;
  parse_duration_ms: number;
}

// 搜索页解析器接口
export interface ISearchPageParser {
  parse: (html: string, url: string) => Promise<SearchParseResult>;
  canParse: (url: string) => boolean;
  platform: string;
}

// 1688搜索页解析器
export const alibaba1688SearchParser: ISearchPageParser = {
  platform: 'alibaba',
  
  canParse: (url: string): boolean => {
    return url.includes('1688.com') && 
           (url.includes('/search/') || url.includes('keywords='));
  },

  parse: async (html: string, url: string): Promise<SearchParseResult> => {
    const startTime = Date.now();
    
    try {
      const $ = cheerio.load(html);
      
      // 提取搜索关键词
      const searchKeyword = extractSearchKeyword(url) || 
                           $('.search-input input').val() as string || 
                           $('.search-keyword').text().trim();
      
      // 提取商品列表
      const products: ISearchProductItem[] = [];
      
      $('.offer-item, .product-item, .sm-offer-item').each((_, element) => {
        const $item = $(element);
        
        const title = $item.find('.offer-title a, .product-title a').text().trim();
        const productUrl = $item.find('.offer-title a, .product-title a').attr('href');
        const priceText = $item.find('.price-now, .offer-price').text().trim();
        const imageUrl = $item.find('.offer-image img, .product-image img').attr('src') || 
                        $item.find('.offer-image img, .product-image img').attr('data-src');
        
        const supplierName = $item.find('.supplier-name, .company-name').text().trim();
        const supplierUrl = $item.find('.supplier-link, .company-link').attr('href');
        const salesInfo = $item.find('.sales-count, .transaction-count').text().trim();
        const location = $item.find('.supplier-location, .company-location').text().trim();
        
        if (title && productUrl) {
          const price = priceText.replace(/[^\d.]/g, '');
          
          const productItem: ISearchProductItem = {
            title,
            price: price || '0',
            currency: 'CNY',
            product_url: normalizeUrl(productUrl)
          };
          
          if (imageUrl) productItem.image_url = normalizeUrl(imageUrl);
          if (supplierName) productItem.supplier_name = supplierName;
          if (supplierUrl) productItem.supplier_url = normalizeUrl(supplierUrl);
          if (salesInfo) productItem.sales_info = salesInfo;
          if (location) productItem.location = location;
          
          products.push(productItem);
        }
      });
      
      // 提取分页信息
      const currentPageText = $('.pagination .current, .page-current').text().trim();
      const currentPage = parseInt(currentPageText) || 1;
      
      const totalPagesText = $('.pagination .total-pages').text().trim();
      const totalPages = parseInt(totalPagesText.replace(/[^\d]/g, '')) || undefined;
      
      const hasNextPage = $('.pagination .next, .page-next').length > 0;
      const nextPageUrl = $('.pagination .next, .page-next').attr('href');
      
      const searchPageData: Partial<ISearchPageData> = {
        search_url: url,
        search_keyword: searchKeyword,
        platform: 'alibaba',
        products,
        pagination_info: (() => {
          const paginationInfo: {
            current_page: number;
            total_pages?: number;
            has_next_page: boolean;
            next_page_url?: string;
          } = {
            current_page: currentPage,
            has_next_page: hasNextPage
          };
          
          if (totalPages !== undefined) paginationInfo.total_pages = totalPages;
          if (nextPageUrl) paginationInfo.next_page_url = normalizeUrl(nextPageUrl);
          
          return paginationInfo;
        })(),
        metadata: {
          parsed_at: new Date(),
          products_count: products.length,
          parse_duration_ms: Date.now() - startTime,
          parser_version: '1.0.0'
        },
        is_processed: false,
        processing_status: 'pending',
        processing_errors: []
      };
      
      return {
        success: true,
        data: searchPageData,
        parse_duration_ms: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
        parse_duration_ms: Date.now() - startTime
      };
    }
  }
};

// Ozon搜索页解析器
export const ozonSearchParser: ISearchPageParser = {
  platform: 'ozon',
  
  canParse: (url: string): boolean => {
    return url.includes('ozon.ru') && 
           (url.includes('/search/') || url.includes('text='));
  },

  parse: async (html: string, url: string): Promise<SearchParseResult> => {
    const startTime = Date.now();
    
    try {
      const $ = cheerio.load(html);
      
      // 提取搜索关键词
      const searchKeyword = extractSearchKeyword(url) || 
                           $('input[name="text"]').val() as string ||
                           $('.search-input').val() as string;
      
      // 提取商品列表
      const products: ISearchProductItem[] = [];
      
      $('[data-widget="searchResultsV2"] .tile, .product-card').each((_, element) => {
        const $item = $(element);
        
        const title = $item.find('.tile-title, .product-title').text().trim();
        const productUrl = $item.find('a').attr('href');
        const priceText = $item.find('.price, .tile-price').text().trim();
        const imageUrl = $item.find('img').attr('src') || $item.find('img').attr('data-src');
        
        const ratingText = $item.find('.rating-value').text().trim();
        const rating = parseFloat(ratingText) || undefined;
        
        const reviewText = $item.find('.reviews-count').text().trim();
        const reviewCount = parseInt(reviewText.replace(/[^\d]/g, '')) || undefined;
        
        if (title && productUrl) {
          const price = priceText.replace(/[^\d.]/g, '');
          
          const productItem: ISearchProductItem = {
            title,
            price: price || '0',
            currency: 'RUB',
            product_url: normalizeUrl(productUrl)
          };
          
          if (imageUrl) productItem.image_url = normalizeUrl(imageUrl);
          if (rating !== undefined) productItem.rating = rating;
          if (reviewCount !== undefined) productItem.review_count = reviewCount;
          
          products.push(productItem);
        }
      });
      
      // 提取分页信息
      const currentPage = 1; // Ozon使用无限滚动，默认为第1页
      const hasNextPage = $('[data-widget="searchPaginator"] .next').length > 0;
      
      const searchPageData: Partial<ISearchPageData> = {
        search_url: url,
        search_keyword: searchKeyword,
        platform: 'ozon',
        products,
        pagination_info: {
          current_page: currentPage,
          has_next_page: hasNextPage
        },
        metadata: {
          parsed_at: new Date(),
          products_count: products.length,
          parse_duration_ms: Date.now() - startTime,
          parser_version: '1.0.0'
        },
        is_processed: false,
        processing_status: 'pending',
        processing_errors: []
      };
      
      return {
        success: true,
        data: searchPageData,
        parse_duration_ms: Date.now() - startTime
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown parsing error',
        parse_duration_ms: Date.now() - startTime
      };
    }
  }
};

// 工具函数
const extractSearchKeyword = (url: string): string => {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('keywords') || 
         urlObj.searchParams.get('text') || 
         urlObj.searchParams.get('q') || 
         '';
};

const normalizeUrl = (url: string, baseUrl?: string): string => {
  if (url.startsWith('http')) {
    return url;
  }
  if (url.startsWith('//')) {
    return `https:${url}`;
  }
  if (url.startsWith('/')) {
    const base = baseUrl || 'https://1688.com';
    return `${base}${url}`;
  }
  return url;
};

// 解析器注册表
export const searchPageParsers: ISearchPageParser[] = [
  alibaba1688SearchParser,
  ozonSearchParser
];

// 获取适合的搜索页解析器
export const getSearchPageParser = (url: string): ISearchPageParser | null => {
  return searchPageParsers.find(parser => parser.canParse(url)) || null;
};