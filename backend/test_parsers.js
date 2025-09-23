import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { alibaba1688ProductParser, ozonProductParser } from './dist/services/parsers/productParser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试函数
const testParser = async (parser, htmlFile, testName) => {
  console.log(`\n=== 测试 ${testName} ===`);
  
  try {
    // 读取HTML文件
    const htmlPath = path.join(__dirname, 'test_html', htmlFile);
    const html = fs.readFileSync(htmlPath, 'utf-8');
    
    // 解析商品数据
    const result = await parser.parse(html, 'test-url');
    
    console.log('解析结果:');
    console.log('- 成功:', result.success);
    console.log('- 解析时间:', result.parse_duration_ms, 'ms');
    
    if (result.success && result.data) {
      const data = result.data;
      console.log('\n提取的商品信息:');
      console.log('- 标题:', data.title || '未提取到');
      console.log('- 价格:', data.price || '未提取到');
      console.log('- 供应商:', data.supplier?.name || '未提取到');
      console.log('- 供应商位置:', data.supplier?.location || '未提取到');
      console.log('- 销量:', data.salesData?.volume || '未提取到');
      console.log('- 评论数:', data.salesData?.reviewCount || '未提取到');
      console.log('- 评分:', data.salesData?.rating || '未提取到');
      console.log('- 图片数量:', data.images?.length || 0);
      console.log('- 规格数量:', Object.keys(data.specifications || {}).length);
      
      // 显示部分规格信息
      if (data.specifications && Object.keys(data.specifications).length > 0) {
        console.log('- 部分规格:');
        const specs = Object.entries(data.specifications).slice(0, 3);
        specs.forEach(([key, value]) => {
          console.log(`  ${key}: ${value}`);
        });
      }
      
      // 显示部分图片URL
      if (data.images && data.images.length > 0) {
        console.log('- 部分图片URL:');
        data.images.slice(0, 2).forEach((img, index) => {
          console.log(`  ${index + 1}: ${img}`);
        });
      }
    } else {
      console.log('解析失败:', result.error);
    }
    
  } catch (error) {
    console.error('测试出错:', error.message);
  }
};

// 主测试函数
const runTests = async () => {
  console.log('开始测试解析器...\n');
  
  // 测试1688解析器
  await testParser(alibaba1688ProductParser, '1688-test.htm', '1688解析器');
  
  // 测试Ozon解析器
  await testParser(ozonProductParser, 'ozon-test.htm', 'Ozon解析器');
  
  console.log('\n测试完成!');
};

// 运行测试
runTests().catch(console.error);