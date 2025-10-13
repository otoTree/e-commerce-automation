const axios = require('axios');
const fs = require('fs');

// 测试API响应是否正确返回简化后的数据
async function testAPIResponse() {
  try {
    console.log('开始测试API响应...');
    
    // 读取测试HTML文件
    const htmlContent = fs.readFileSync('./1688-search.html', 'utf8');
    
    // 准备请求数据
    const requestData = {
      url: 'https://s.1688.com/selloffer/offer_search.htm?keywords=test',
      html: htmlContent,
      title: 'Test 1688 Search',
      timestamp: new Date().toISOString(),
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      metadata: {
        source: 'test'
      }
    };
    
    console.log('请求URL:', requestData.url);
    console.log('HTML内容长度:', requestData.html.length);
    console.log('URL检查:');
    console.log('- 包含1688.com:', requestData.url.includes('1688.com'));
    console.log('- 包含selloffer/offer_search:', requestData.url.includes('selloffer/offer_search'));
    console.log('HTML内容包含关键词检查:');
    console.log('- search-result:', requestData.html.includes('search-result'));
    console.log('- fui-paging:', requestData.html.includes('fui-paging'));
    console.log('- window.data:', requestData.html.includes('window.data'));
    console.log('- search-offer-wrapper:', requestData.html.includes('search-offer-wrapper'));
    
    // 发送POST请求到API
    const response = await axios.post('http://localhost:3001/api/pages/upload', requestData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('API响应状态:', response.status);
    console.log('API响应数据结构:');
    
    const responseData = response.data;
    
    // 检查search1688Data字段
    if (responseData.search1688Data) {
      console.log('✅ search1688Data存在');
      console.log('关键词:', responseData.search1688Data.keyword);
      console.log('产品数量:', responseData.search1688Data.products.length);
      console.log('总数:', responseData.search1688Data.totalCount);
      
      // 检查产品结构
      if (responseData.search1688Data.products.length > 0) {
        const firstProduct = responseData.search1688Data.products[0];
        console.log('第一个产品结构:', Object.keys(firstProduct));
        
        // 验证只包含link字段
        const expectedFields = ['link'];
        const actualFields = Object.keys(firstProduct);
        
        const hasOnlyLinkField = actualFields.length === 1 && actualFields.includes('link');
        
        if (hasOnlyLinkField) {
          console.log('✅ 产品结构正确：只包含link字段');
          console.log('示例链接:', firstProduct.link);
        } else {
          console.log('❌ 产品结构不正确');
          console.log('期望字段:', expectedFields);
          console.log('实际字段:', actualFields);
        }
      } else {
        console.log('⚠️ 没有提取到产品数据');
      }
      
      // 检查分页信息
      if (responseData.search1688Data.pagination) {
        console.log('分页信息:', responseData.search1688Data.pagination);
      }
      
    } else {
      console.log('❌ search1688Data不存在');
    }
    
    console.log('\n测试完成！');
    
  } catch (error) {
    console.error('测试失败:', error.message);
    if (error.response) {
      console.error('响应状态:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
  }
}

testAPIResponse();