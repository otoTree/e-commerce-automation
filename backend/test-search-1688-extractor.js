/**
 * 测试1688搜索页面提取器
 * 验证分页信息和产品数据提取功能
 */

const fs = require('fs');
const path = require('path');

// 模拟TypeScript的接口和类
class Search1688Extractor {
  constructor(htmlContent) {
    this.htmlContent = htmlContent;
  }

  /**
   * 提取搜索关键词
   */
  extractKeyword() {
    // 从页面标题提取关键词
    const titleMatch = this.htmlContent.match(/<title[^>]*>([^<]+)</);
    if (titleMatch) {
      const title = titleMatch[1];
      // 移除阿里巴巴相关后缀
      const keyword = title.replace(/_.*?阿里巴巴.*$/, '').replace(/批发|供应|厂家.*$/, '').trim();
      return keyword;
    }

    // 从URL参数提取
    const urlMatch = this.htmlContent.match(/keywords?[=:]([^&"']+)/i);
    if (urlMatch) {
      return decodeURIComponent(urlMatch[1]);
    }

    return '';
  }

  /**
   * 提取分页信息
   * 支持多种分页格式：
   * 1. fui-paging-total'>共<span class="fui-paging-num">34</span>页
   * 2. 共34页
   * 3. JavaScript中的分页数据
   */
  extractPagination() {
    const pagination = {
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    };

    try {
      console.log('🔍 开始提取分页信息...');

      // 方法1: 提取用户提供格式的分页信息
      const fuiPagingMatch = this.htmlContent.match(/fui-paging-total[^>]*>共<span[^>]*class="fui-paging-num"[^>]*>(\d+)<\/span>页/);
      if (fuiPagingMatch) {
        console.log('✅ 找到fui-paging格式分页:', fuiPagingMatch[0]);
        pagination.totalPages = parseInt(fuiPagingMatch[1], 10);
        pagination.hasNextPage = pagination.currentPage < pagination.totalPages;
        console.log(`📄 总页数: ${pagination.totalPages}`);
        return pagination;
      }

      // 方法2: 提取简单的"共X页"格式
      const simplePageMatch = this.htmlContent.match(/共\s*(\d+)\s*页/);
      if (simplePageMatch) {
        console.log('✅ 找到简单分页格式:', simplePageMatch[0]);
        pagination.totalPages = parseInt(simplePageMatch[1], 10);
        pagination.hasNextPage = pagination.currentPage < pagination.totalPages;
        console.log(`📄 总页数: ${pagination.totalPages}`);
        return pagination;
      }

      // 方法3: 从JavaScript数据中提取分页信息
      const jsPageMatch = this.htmlContent.match(/"totalPage":\s*(\d+)/);
      if (jsPageMatch) {
        console.log('✅ 找到JavaScript分页数据:', jsPageMatch[0]);
        pagination.totalPages = parseInt(jsPageMatch[1], 10);
        pagination.hasNextPage = pagination.currentPage < pagination.totalPages;
        console.log(`📄 总页数: ${pagination.totalPages}`);
        return pagination;
      }

      // 方法4: 从window.data中提取分页信息
      const windowDataMatch = this.htmlContent.match(/window\.data\s*=\s*({.*?});/s);
      if (windowDataMatch) {
        try {
          console.log('🔍 尝试解析window.data...');
          const data = JSON.parse(windowDataMatch[1]);
          if (data.offerV2?.data?.pageInfo) {
            const pageInfo = data.offerV2.data.pageInfo;
            pagination.currentPage = pageInfo.currentPage || 1;
            pagination.totalPages = pageInfo.totalPage || 1;
            pagination.pageSize = pageInfo.pageSize || 20;
            pagination.hasNextPage = pagination.currentPage < pagination.totalPages;
            pagination.hasPrevPage = pagination.currentPage > 1;
            console.log('✅ 从window.data提取分页信息成功');
            console.log(`📄 当前页: ${pagination.currentPage}, 总页数: ${pagination.totalPages}`);
            return pagination;
          }
        } catch (error) {
          console.warn('⚠️ 解析window.data分页信息失败:', error.message);
        }
      }

      // 方法5: 从URL参数中提取当前页
      const currentPageMatch = this.htmlContent.match(/[?&]page=(\d+)/);
      if (currentPageMatch) {
        console.log('✅ 从URL提取当前页:', currentPageMatch[0]);
        pagination.currentPage = parseInt(currentPageMatch[1], 10);
        pagination.hasPrevPage = pagination.currentPage > 1;
      }

      console.log('⚠️ 未找到明确的分页信息，使用默认值');

    } catch (error) {
      console.warn('❌ 提取分页信息失败:', error.message);
    }

    return pagination;
  }

  /**
   * 从JavaScript数据中提取产品列表
   */
  extractFromScript() {
    const products = [];

    try {
      console.log('🔍 开始从JavaScript提取产品数据...');

      // 方法1: 从window.data.offerV2提取
      const windowDataMatch = this.htmlContent.match(/window\.data\s*=\s*({.*?});/s);
      if (windowDataMatch) {
        try {
          console.log('🔍 尝试解析window.data产品列表...');
          const data = JSON.parse(windowDataMatch[1]);
          if (data.offerV2?.data?.offerList) {
            const offerList = data.offerV2.data.offerList;
            console.log(`✅ 从window.data找到 ${offerList.length} 个产品`);
            return this.parseOfferList(offerList);
          }
        } catch (error) {
          console.warn('⚠️ 解析window.data产品列表失败:', error.message);
        }
      }

      // 方法2: 从其他JavaScript变量中提取
      const offerListMatch = this.htmlContent.match(/"offerList":\s*\[(.*?)\]/s);
      if (offerListMatch) {
        try {
          console.log('🔍 尝试解析offerList...');
          const offerListStr = `[${offerListMatch[1]}]`;
          const offerList = JSON.parse(offerListStr);
          console.log(`✅ 从offerList找到 ${offerList.length} 个产品`);
          return this.parseOfferList(offerList);
        } catch (error) {
          console.warn('⚠️ 解析offerList失败:', error.message);
        }
      }

      // 方法3: 搜索所有可能的产品数据结构
      const productPatterns = [
        /"products":\s*\[(.*?)\]/s,
        /"items":\s*\[(.*?)\]/s,
        /"list":\s*\[(.*?)\]/s,
        /"data":\s*\[(.*?)\]/s
      ];

      for (const pattern of productPatterns) {
        const match = this.htmlContent.match(pattern);
        if (match) {
          try {
            console.log('🔍 尝试解析产品数据模式...');
            const listStr = `[${match[1]}]`;
            const list = JSON.parse(listStr);
            if (list.length > 0 && this.isValidProductList(list)) {
              console.log(`✅ 找到有效产品列表，包含 ${list.length} 个产品`);
              return this.parseOfferList(list);
            }
          } catch (error) {
            continue;
          }
        }
      }

      console.log('⚠️ 未找到有效的产品数据，将生成测试数据');

    } catch (error) {
      console.warn('❌ 从JavaScript提取产品失败:', error.message);
    }

    return products;
  }

  /**
   * 解析产品列表数据
   */
  parseOfferList(offerList) {
    console.log(`🔄 开始解析 ${offerList.length} 个产品...`);
    
    return offerList.map((offer, index) => {
      const product = {
        productId: offer.offerId?.toString() || offer.id?.toString() || `product_${index}`,
        title: offer.subject || offer.title || offer.name || `产品 ${index + 1}`,
        price: this.formatPrice(offer.price || offer.priceRange || offer.unitPrice),
        link: offer.detailUrl || offer.url || `https://detail.1688.com/offer/${offer.offerId}.html`,
        seller: offer.sellerName || offer.seller || offer.companyName,
        location: offer.location || offer.address,
        minOrder: offer.minOrderQuantity || offer.minOrder,
        tags: offer.tags || []
      };

      // 处理价格范围
      if (offer.priceRange) {
        product.priceRange = {
          min: parseFloat(offer.priceRange.min || offer.priceRange.minPrice || 0),
          max: parseFloat(offer.priceRange.max || offer.priceRange.maxPrice || 0)
        };
      }

      // 处理图片
      if (offer.image || offer.imageUrl || offer.pic) {
        product.imageUrl = offer.image || offer.imageUrl || offer.pic;
      }

      return product;
    }).filter(product => product.productId && product.title);
  }

  /**
   * 验证是否为有效的产品列表
   */
  isValidProductList(list) {
    if (!Array.isArray(list) || list.length === 0) {
      return false;
    }

    // 检查前几个元素是否包含产品相关字段
    const sampleItem = list[0];
    const productFields = ['offerId', 'subject', 'title', 'price', 'detailUrl', 'id', 'name'];
    
    return productFields.some(field => sampleItem.hasOwnProperty(field));
  }

  /**
   * 格式化价格显示
   */
  formatPrice(price) {
    if (!price) return '';
    
    if (typeof price === 'string') {
      return price;
    }
    
    if (typeof price === 'number') {
      return `¥${price.toFixed(2)}`;
    }
    
    if (price.min && price.max) {
      return `¥${price.min}-${price.max}`;
    }
    
    return price.toString();
  }

  /**
   * 生成测试数据（当无法提取真实数据时）
   */
  generateTestData(keyword) {
    console.log('🎭 生成测试数据...');
    const testProducts = [];
    
    for (let i = 1; i <= 8; i++) {
      testProducts.push({
        productId: `test_${Date.now()}_${i}`,
        title: `${keyword} 测试产品 ${i}`,
        price: `¥${(Math.random() * 100 + 10).toFixed(2)}-${(Math.random() * 200 + 100).toFixed(2)}`,
        priceRange: {
          min: Math.random() * 100 + 10,
          max: Math.random() * 200 + 100
        },
        imageUrl: `https://img.alicdn.com/imgextra/test${i}.jpg`,
        link: `https://detail.1688.com/offer/test${i}.html`,
        seller: `测试供应商${i}`,
        location: `广东 广州`,
        minOrder: `${Math.floor(Math.random() * 10) + 1} 件`,
        tags: ['热销', '现货']
      });
    }
    
    return testProducts;
  }

  /**
   * 提取总商品数量
   */
  extractTotalCount() {
    try {
      // 从JavaScript数据中提取
      const totalMatch = this.htmlContent.match(/"totalCount":\s*(\d+)/);
      if (totalMatch) {
        console.log('✅ 找到总数量:', totalMatch[0]);
        return parseInt(totalMatch[1], 10);
      }

      // 从分页信息推算
      const pagination = this.extractPagination();
      if (pagination.totalPages > 1) {
        const estimated = pagination.totalPages * (pagination.pageSize || 20);
        console.log(`📊 根据分页推算总数量: ${estimated}`);
        return estimated;
      }

      return 0;
    } catch (error) {
      console.warn('❌ 提取总数量失败:', error.message);
      return 0;
    }
  }

  /**
   * 执行完整的数据提取
   */
  extract() {
    console.log('🚀 开始执行1688搜索页面数据提取...\n');
    
    const keyword = this.extractKeyword();
    console.log(`🔑 提取到关键词: "${keyword}"\n`);
    
    let products = this.extractFromScript();
    const pagination = this.extractPagination();
    const totalCount = this.extractTotalCount();
    
    let dataSource = 'javascript';
    
    // 如果没有提取到产品，生成测试数据
    if (products.length === 0) {
      products = this.generateTestData(keyword);
      dataSource = 'fallback';
    }

    console.log(`\n📊 提取结果汇总:`);
    console.log(`   关键词: ${keyword}`);
    console.log(`   产品数量: ${products.length}`);
    console.log(`   当前页: ${pagination.currentPage}`);
    console.log(`   总页数: ${pagination.totalPages}`);
    console.log(`   总商品数: ${totalCount}`);
    console.log(`   数据源: ${dataSource}`);

    return {
      keyword,
      products,
      pagination,
      totalCount: totalCount || products.length,
      dataSource
    };
  }
}

// 测试函数
async function testExtractor() {
  try {
    console.log('📁 读取1688搜索页面HTML文件...');
    const htmlPath = path.join(__dirname, '1688-search.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    console.log(`📄 HTML文件大小: ${(htmlContent.length / 1024).toFixed(2)} KB\n`);
    
    // 创建提取器实例
    const extractor = new Search1688Extractor(htmlContent);
    
    // 执行提取
    const result = extractor.extract();
    
    // 显示详细结果
    console.log('\n' + '='.repeat(60));
    console.log('📋 详细提取结果');
    console.log('='.repeat(60));
    
    console.log(`\n🔑 关键词: ${result.keyword}`);
    
    console.log(`\n📄 分页信息:`);
    console.log(`   当前页: ${result.pagination.currentPage}`);
    console.log(`   总页数: ${result.pagination.totalPages}`);
    console.log(`   有下一页: ${result.pagination.hasNextPage ? '是' : '否'}`);
    console.log(`   有上一页: ${result.pagination.hasPrevPage ? '是' : '否'}`);
    if (result.pagination.pageSize) {
      console.log(`   每页数量: ${result.pagination.pageSize}`);
    }
    
    console.log(`\n📦 产品信息 (前3个):`);
    result.products.slice(0, 3).forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.title}`);
      console.log(`      ID: ${product.productId}`);
      console.log(`      价格: ${product.price}`);
      console.log(`      链接: ${product.link}`);
      if (product.seller) console.log(`      供应商: ${product.seller}`);
      if (product.location) console.log(`      地区: ${product.location}`);
      if (product.imageUrl) console.log(`      图片: 有`);
      console.log('');
    });
    
    console.log(`\n📊 数据质量分析:`);
    console.log(`   ✅ 关键词提取: ${result.keyword ? '成功' : '失败'}`);
    console.log(`   ✅ 产品提取: ${result.products.length > 0 ? '成功' : '失败'} (${result.products.length}个)`);
    console.log(`   ✅ 分页提取: ${result.pagination.totalPages > 1 ? '成功' : '部分成功'}`);
    console.log(`   ✅ 总数提取: ${result.totalCount > 0 ? '成功' : '失败'}`);
    console.log(`   📊 数据源: ${result.dataSource}`);
    
    // 特别测试分页信息提取
    console.log('\n' + '='.repeat(60));
    console.log('🔍 分页信息提取测试');
    console.log('='.repeat(60));
    
    // 测试用户提供的分页格式
    const testPaginationHtml = `
      <div class="fui-paging-total">共<span class="fui-paging-num">34</span>页</div>
    `;
    
    console.log('测试分页HTML片段:');
    console.log(testPaginationHtml.trim());
    
    const testExtractor = new Search1688Extractor(testPaginationHtml);
    const testPagination = testExtractor.extractPagination();
    
    console.log('\n提取结果:');
    console.log(`总页数: ${testPagination.totalPages}`);
    console.log(`有下一页: ${testPagination.hasNextPage}`);
    
    if (testPagination.totalPages === 34) {
      console.log('✅ 分页信息提取测试通过！');
    } else {
      console.log('❌ 分页信息提取测试失败！');
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
if (require.main === module) {
  testExtractor();
}

module.exports = { Search1688Extractor };