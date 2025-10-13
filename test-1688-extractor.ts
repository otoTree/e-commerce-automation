const { Search1688Extractor } = require('./src/extractors/1688-search-extractor');
const path = require('path');

async function testExtractor() {
  console.log('开始测试1688搜索页面数据提取器...\n');
  
  const htmlFilePath = path.join(__dirname, 'backend', '1688-search.html');
  console.log('HTML文件路径:', htmlFilePath);
  
  try {
    const extractedData = await Search1688Extractor.extractFromFile(htmlFilePath);
    
    console.log('\n=== 提取结果 ===');
    console.log('搜索关键词:', extractedData.keyword);
    console.log('产品总数:', extractedData.totalCount);
    console.log('产品数量:', extractedData.products.length);
    
    console.log('\n=== 分页信息 ===');
    console.log('当前页:', extractedData.pagination.currentPage);
    console.log('总页数:', extractedData.pagination.totalPages);
    console.log('有下一页:', extractedData.pagination.hasNext);
    console.log('有上一页:', extractedData.pagination.hasPrev);
    
    console.log('\n=== 筛选信息 ===');
    console.log('分类数量:', extractedData.filters.categories.length);
    console.log('价格范围数量:', extractedData.filters.priceRanges.length);
    
    console.log('\n=== 前3个产品详情 ===');
    extractedData.products.slice(0, 3).forEach((product, index) => {
      console.log(`\n产品 ${index + 1}:`);
      console.log('  ID:', product.id);
      console.log('  标题:', product.title);
      console.log('  价格:', product.price);
      console.log('  图片URL:', product.imageUrl);
      console.log('  产品URL:', product.productUrl);
      console.log('  公司:', product.company);
      console.log('  位置:', product.location);
      console.log('  最小订单:', product.minOrder);
      console.log('  标签:', product.tags);
    });
    
    console.log('\n=== 数据质量分析 ===');
    const validProducts = extractedData.products.filter(p => p.title && p.price);
    console.log('有效产品数量:', validProducts.length);
    console.log('数据完整性:', `${((validProducts.length / extractedData.products.length) * 100).toFixed(1)}%`);
    
    console.log('\n=== 数据来源分析 ===');
    console.log('数据来源:', extractedData.source);
    
  } catch (error) {
    console.error('提取失败:', error);
  }
}

testExtractor();