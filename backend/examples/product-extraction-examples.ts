/**
 * 1688商品数据提取使用示例和测试用例
 * 展示如何使用数据提取器、解析工具和验证模式
 */

import fs from 'fs';
import path from 'path';
import {
  extractProductDataFromHTML,
  extractProductDataFromContext,
  extractFromCurrentPage,
  createAutoExtractor,
  validateExtractedData,
  cleanExtractedData,
  formatWeight,
  formatPrice,
  groupVariantsByColor,
  groupVariantsByType,
  ExtractedProductData,
} from '../src/models/product-extractor';

import {
  validateExtractedData as zodValidateData,
  transformProductData,
  checkDataCompleteness,
  validateWithFriendlyError,
  ExtractedProductDataSchema,
} from '../src/schemas/product-schema';

import {
  extractJSVariable,
  cleanString,
  extractPrice,
  extractWeight,
  extractColorFromSku,
  safeJsonParse,
} from '../src/utils/parser-utils';

// ===== 示例数据 =====

/**
 * 模拟的HTML内容（简化版）
 */
const mockHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>红色办公椅 有靠背款 - 阿里巴巴</title>
</head>
<body>
  <script>
    window.context = {
      "result": {
        "data": {
          "productPackInfo": {
            "fields": {
              "pieceWeightScale": {
                "pieceWeightScaleInfo": [
                  {
                    "skuId": 12345,
                    "sku1": "红色 有靠背",
                    "weight": 5000
                  },
                  {
                    "skuId": 12346,
                    "sku1": "蓝色 无靠背",
                    "weight": 4500
                  }
                ]
              }
            }
          },
          "shippingServices": {
            "fields": {
              "location": "广东佛山",
              "targetLocation": "全国",
              "totalCost": 15.5,
              "deliveryLimitText": "48小时内发货",
              "freeDeliverFee": false,
              "protectionInfos": [
                {
                  "serviceCode": "QUALITY_ASSURANCE",
                  "serviceName": "质量保证",
                  "description": "30天质量保证",
                  "type": "protect"
                }
              ]
            }
          },
          "description": {
            "fields": {
              "detailUrl": "https://detail.1688.com/offer/123456789.html"
            }
          }
        }
      }
    };
  </script>
</body>
</html>
`;

/**
 * 模拟的Context对象
 */
const mockContext = {
  result: {
    data: {
      productPackInfo: {
        fields: {
          pieceWeightScale: {
            pieceWeightScaleInfo: [
              {
                skuId: 12345,
                sku1: "红色 有靠背",
                weight: 5000
              },
              {
                skuId: 12346,
                sku1: "蓝色 无靠背",
                weight: 4500
              }
            ]
          }
        }
      },
      shippingServices: {
        fields: {
          location: "广东佛山",
          targetLocation: "全国",
          totalCost: 15.5,
          deliveryLimitText: "48小时内发货",
          freeDeliverFee: false,
          protectionInfos: [
            {
              serviceCode: "QUALITY_ASSURANCE",
              serviceName: "质量保证",
              description: "30天质量保证",
              type: "protect"
            }
          ]
        }
      },
      description: {
        fields: {
          detailUrl: "https://detail.1688.com/offer/123456789.html"
        }
      }
    }
  }
};

// ===== 基础使用示例 =====

/**
 * 示例1: 从HTML字符串提取数据
 */
export const example1_ExtractFromHTML = () => {
  console.log('=== 示例1: 从HTML字符串提取数据 ===');
  
  try {
    const extractedData = extractProductDataFromHTML(mockHtmlContent);
    
    if (extractedData) {
      console.log('✅ 提取成功!');
      console.log('商品ID:', extractedData.productId);
      console.log('商品标题:', extractedData.title);
      console.log('卖家:', extractedData.seller);
      console.log('变体数量:', extractedData.variants.length);
      console.log('物流信息:', extractedData.shipping);
      console.log('服务保障:', extractedData.protections.length, '项');
    } else {
      console.log('❌ 提取失败');
    }
  } catch (error) {
    console.error('❌ 提取过程出错:', error);
  }
  
  console.log('\n');
};

/**
 * 示例2: 从Context对象提取数据
 */
export const example2_ExtractFromContext = () => {
  console.log('=== 示例2: 从Context对象提取数据 ===');
  
  try {
    const extractedData = extractProductDataFromContext(mockContext as any);
    
    console.log('✅ 提取成功!');
    console.log('变体信息:');
    extractedData.variants.forEach((variant, index) => {
      console.log(`  ${index + 1}. ${variant.fullName} - ${formatWeight(variant.weight)} (SKU: ${variant.skuId})`);
    });
    
    console.log('物流信息:');
    console.log(`  发货地: ${extractedData.shipping.location}`);
    console.log(`  运费: ¥${extractedData.shipping.cost}`);
    console.log(`  发货承诺: ${extractedData.shipping.deliveryPromise}`);
    
  } catch (error) {
    console.error('❌ 提取过程出错:', error);
  }
  
  console.log('\n');
};

/**
 * 示例3: 数据验证和清理
 */
export const example3_ValidateAndClean = () => {
  console.log('=== 示例3: 数据验证和清理 ===');
  
  try {
    const rawData = extractProductDataFromContext(mockContext as any);
    
    // 使用内置验证
    const isValid = validateExtractedData(rawData);
    console.log('内置验证结果:', isValid ? '✅ 通过' : '❌ 失败');
    
    // 使用Zod验证
    const zodResult = zodValidateData(rawData);
    console.log('Zod验证结果:', zodResult.success ? '✅ 通过' : '❌ 失败');
    
    if (!zodResult.success) {
      console.log('验证错误:', zodResult.error.issues);
    }
    
    // 清理数据
    const cleanedData = cleanExtractedData(rawData);
    console.log('✅ 数据清理完成');
    
    // 检查数据完整性
    const completeness = checkDataCompleteness(cleanedData);
    console.log(`数据完整性: ${completeness.score}% (缺失: ${completeness.missing.join(', ') || '无'})`);
    
  } catch (error) {
    console.error('❌ 验证过程出错:', error);
  }
  
  console.log('\n');
};

/**
 * 示例4: 数据分组和格式化
 */
export const example4_GroupAndFormat = () => {
  console.log('=== 示例4: 数据分组和格式化 ===');
  
  try {
    const extractedData = extractProductDataFromContext(mockContext as any);
    
    // 按颜色分组
    const colorGroups = groupVariantsByColor(extractedData.variants);
    console.log('按颜色分组:');
    Object.entries(colorGroups).forEach(([color, variants]) => {
      console.log(`  ${color}: ${variants.length}个变体`);
      variants.forEach(v => console.log(`    - ${v.fullName} (${formatWeight(v.weight)})`));
    });
    
    // 按类型分组
    const typeGroups = groupVariantsByType(extractedData.variants);
    console.log('\n按类型分组:');
    Object.entries(typeGroups).forEach(([type, variants]) => {
      const typeName = type === 'with_backrest' ? '有靠背' : '无靠背';
      console.log(`  ${typeName}: ${variants.length}个变体`);
    });
    
  } catch (error) {
    console.error('❌ 分组过程出错:', error);
  }
  
  console.log('\n');
};

// ===== 高级使用示例 =====

/**
 * 示例5: 批量处理多个商品
 */
export const example5_BatchProcessing = () => {
  console.log('=== 示例5: 批量处理多个商品 ===');
  
  const htmlFiles = [mockHtmlContent]; // 实际使用中可以是多个HTML文件
  const results: ExtractedProductData[] = [];
  const errors: string[] = [];
  
  htmlFiles.forEach((html, index) => {
    try {
      const data = extractProductDataFromHTML(html);
      if (data && validateExtractedData(data)) {
        results.push(cleanExtractedData(data));
        console.log(`✅ 文件 ${index + 1} 处理成功`);
      } else {
        errors.push(`文件 ${index + 1}: 数据提取或验证失败`);
      }
    } catch (error) {
      errors.push(`文件 ${index + 1}: ${error}`);
    }
  });
  
  console.log(`\n处理结果: ${results.length}个成功, ${errors.length}个失败`);
  if (errors.length > 0) {
    console.log('错误详情:');
    errors.forEach(error => console.log(`  ❌ ${error}`));
  }
  
  console.log('\n');
};

/**
 * 示例6: 使用解析工具函数
 */
export const example6_ParserUtils = () => {
  console.log('=== 示例6: 使用解析工具函数 ===');
  
  // 提取JavaScript变量
  const contextData = extractJSVariable(mockHtmlContent, 'context');
  console.log('提取的context数据:', contextData ? '✅ 成功' : '❌ 失败');
  
  // 字符串清理
  const messyString = '  红色   办公椅\n\t有靠背  ';
  const cleanedString = cleanString(messyString);
  console.log(`字符串清理: "${messyString}" -> "${cleanedString}"`);
  
  // 价格提取
  const priceText = '¥158.50元';
  const price = extractPrice(priceText);
  console.log(`价格提取: "${priceText}" -> ${price}`);
  
  // 重量提取
  const weightText = '5.5kg';
  const weight = extractWeight(weightText);
  console.log(`重量提取: "${weightText}" ->`, weight);
  
  // 颜色提取
  const skuName = '红色 有靠背 办公椅';
  const color = extractColorFromSku(skuName);
  console.log(`颜色提取: "${skuName}" -> "${color}"`);
  
  console.log('\n');
};

/**
 * 示例7: 错误处理和恢复
 */
export const example7_ErrorHandling = () => {
  console.log('=== 示例7: 错误处理和恢复 ===');
  
  // 测试无效HTML
  const invalidHtml = '<html><body>无效的HTML内容</body></html>';
  const result1 = extractProductDataFromHTML(invalidHtml);
  console.log('无效HTML处理:', result1 ? '意外成功' : '✅ 正确失败');
  
  // 测试无效Context
  const invalidContext = { invalid: 'data' };
  try {
    const result2 = extractProductDataFromContext(invalidContext as any);
    console.log('无效Context处理: 意外成功');
  } catch (error) {
    console.log('无效Context处理: ✅ 正确抛出异常');
  }
  
  // 测试友好错误信息
  const invalidData = {
    productId: '123', // 太短
    title: '', // 空标题
    variants: [], // 空数组
  };
  
  const validationResult = validateWithFriendlyError(ExtractedProductDataSchema, invalidData);
  if (!validationResult.success) {
    console.log('友好错误信息:');
    console.log(validationResult.error);
  }
  
  console.log('\n');
};

// ===== 浏览器环境示例 =====

/**
 * 示例8: 浏览器环境使用（仅在浏览器中运行）
 */
export const example8_BrowserUsage = () => {
  console.log('=== 示例8: 浏览器环境使用 ===');
  
  // 注意：这些函数只能在浏览器环境中使用
  console.log('以下代码仅在浏览器环境中有效:');
  
  console.log(`
// 从当前页面提取数据
const data = extractFromCurrentPage();
if (data) {
  console.log('提取的商品数据:', data);
}

// 创建自动提取器
const stopExtractor = createAutoExtractor((data) => {
  if (data) {
    console.log('自动提取到数据:', data.title);
    // 发送到后端或更新UI
  }
}, { interval: 5000, immediate: true });

// 停止自动提取
// stopExtractor();
  `);
  
  console.log('\n');
};

// ===== 性能测试示例 =====

/**
 * 示例9: 性能测试
 */
export const example9_PerformanceTest = () => {
  console.log('=== 示例9: 性能测试 ===');
  
  const iterations = 100;
  
  // 测试HTML提取性能
  console.time('HTML提取性能');
  for (let i = 0; i < iterations; i++) {
    extractProductDataFromHTML(mockHtmlContent);
  }
  console.timeEnd('HTML提取性能');
  
  // 测试Context提取性能
  console.time('Context提取性能');
  for (let i = 0; i < iterations; i++) {
    extractProductDataFromContext(mockContext as any);
  }
  console.timeEnd('Context提取性能');
  
  // 测试验证性能
  const sampleData = extractProductDataFromContext(mockContext as any);
  console.time('数据验证性能');
  for (let i = 0; i < iterations; i++) {
    zodValidateData(sampleData);
  }
  console.timeEnd('数据验证性能');
  
  console.log('\n');
};

// ===== 实际文件处理示例 =====

/**
 * 示例10: 处理实际的HTML文件
 */
export const example10_ProcessRealFile = async () => {
  console.log('=== 示例10: 处理实际的HTML文件 ===');
  
  const filePath = '/Users/huangjiarui/Desktop/e-commerce-ai/backend/1688-product.html';
  
  try {
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      console.log('❌ 文件不存在:', filePath);
      return;
    }
    
    // 读取文件内容
    const htmlContent = fs.readFileSync(filePath, 'utf-8');
    console.log('✅ 文件读取成功, 大小:', Math.round(htmlContent.length / 1024), 'KB');
    
    // 提取数据
    const extractedData = extractProductDataFromHTML(htmlContent);
    
    if (extractedData) {
      console.log('✅ 数据提取成功!');
      
      // 验证数据
      const validation = zodValidateData(extractedData);
      console.log('数据验证:', validation.success ? '✅ 通过' : '❌ 失败');
      
      // 显示提取结果摘要
      console.log('\n提取结果摘要:');
      console.log('- 商品ID:', extractedData.productId || '未找到');
      console.log('- 商品标题:', extractedData.title || '未找到');
      console.log('- 卖家:', extractedData.seller || '未找到');
      console.log('- 变体数量:', extractedData.variants.length);
      console.log('- 发货地:', extractedData.shipping.location || '未找到');
      console.log('- 运费:', extractedData.shipping.cost || 0);
      console.log('- 服务保障:', extractedData.protections.length, '项');
      
      // 保存提取结果
      const outputPath = path.join(path.dirname(filePath), 'extracted-data.json');
      fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2), 'utf-8');
      console.log('✅ 提取结果已保存到:', outputPath);
      
    } else {
      console.log('❌ 数据提取失败');
    }
    
  } catch (error) {
    console.error('❌ 处理文件时出错:', error);
  }
  
  console.log('\n');
};

// ===== 运行所有示例 =====

/**
 * 运行所有示例
 */
export const runAllExamples = async () => {
  console.log('🚀 开始运行1688商品数据提取示例\n');
  
  example1_ExtractFromHTML();
  example2_ExtractFromContext();
  example3_ValidateAndClean();
  example4_GroupAndFormat();
  example5_BatchProcessing();
  example6_ParserUtils();
  example7_ErrorHandling();
  example8_BrowserUsage();
  example9_PerformanceTest();
  await example10_ProcessRealFile();
  
  console.log('✅ 所有示例运行完成!');
};

// ===== 导出示例函数 =====

export default {
  example1_ExtractFromHTML,
  example2_ExtractFromContext,
  example3_ValidateAndClean,
  example4_GroupAndFormat,
  example5_BatchProcessing,
  example6_ParserUtils,
  example7_ErrorHandling,
  example8_BrowserUsage,
  example9_PerformanceTest,
  example10_ProcessRealFile,
  runAllExamples,
};

// 如果直接运行此文件，执行所有示例
if (require.main === module) {
  runAllExamples().catch(console.error);
}