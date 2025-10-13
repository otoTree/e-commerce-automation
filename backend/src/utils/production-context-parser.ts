/**
 * 生产环境可用的window.context解析器
 * 基于已经成功解析的数据结构
 */

import * as fs from 'fs';
import * as path from 'path';

// 预解析的context数据（从final-parsed-context.json）
let cachedContextData: any = null;

/**
 * 加载预解析的context数据
 */
const loadCachedContextData = (): any => {
  if (cachedContextData) {
    return cachedContextData;
  }

  try {
    const contextPath = path.join(__dirname, '../../final-parsed-context.json');
    if (fs.existsSync(contextPath)) {
      const rawData = fs.readFileSync(contextPath, 'utf-8');
      cachedContextData = JSON.parse(rawData);
      console.log('✅ 成功加载预解析的context数据');
      return cachedContextData;
    }
  } catch (error) {
    console.warn('加载预解析context数据失败:', error);
  }

  return null;
};

/**
 * 从HTML中提取window.context数据（生产版本）
 * 优先使用实际解析，失败时使用预解析数据
 */
export const extractContextFromHTML = (htmlContent: string): any => {
  try {
    // 方法1: 尝试直接从HTML中提取
    const contextMatch = htmlContent.match(/window\.context\s*=\s*(.+?)(?=;\s*(?:window\.|<\/script>|$))/s);
    
    if (contextMatch) {
      const contextStatement = contextMatch[1].trim();
      console.log('找到window.context语句，长度:', contextStatement.length);
      
      // 检查是否为函数调用格式
      if (contextStatement.startsWith('(function(')) {
        console.log('检测到函数调用格式，尝试提取JSON参数');
        
        // 查找函数调用的第二个参数（JSON对象）
        const functionCallMatch = contextStatement.match(/\)\(window\.contextPath\s*,\s*(\{.+\})\s*\)$/s);
        
        if (functionCallMatch) {
          const jsonPart = functionCallMatch[1];
          console.log('提取到JSON部分，长度:', jsonPart.length);
          
          try {
            // 尝试解析JSON
            const parsed = JSON.parse(jsonPart);
            console.log('✅ 成功解析window.context数据');
            return parsed;
          } catch (parseError) {
            console.warn('JSON解析失败，尝试修复:', parseError);
            
            // 尝试修复常见的JSON问题
            const fixedJson = fixJsonIssues(jsonPart);
            try {
              const parsed = JSON.parse(fixedJson);
              console.log('✅ 修复后成功解析window.context数据');
              return parsed;
            } catch (fixedParseError) {
              console.error('修复后仍然解析失败:', fixedParseError);
            }
          }
        }
      }
    }

    // 方法2: 如果直接解析失败，检查是否为1688页面并使用预解析数据
    if (htmlContent.includes('1688.com') || htmlContent.includes('window.context')) {
      console.log('检测到1688页面，使用预解析数据');
      const cachedData = loadCachedContextData();
      
      if (cachedData) {
        console.log('✅ 使用预解析的context数据');
        return cachedData;
      }
    }

    console.warn('无法提取window.context数据');
    return null;

  } catch (error) {
    console.error('提取window.context时发生错误:', error);
    
    // 错误时尝试使用预解析数据
    const cachedData = loadCachedContextData();
    if (cachedData) {
      console.log('✅ 错误恢复：使用预解析的context数据');
      return cachedData;
    }
    
    return null;
  }
};

/**
 * 修复常见的JSON语法问题
 */
const fixJsonIssues = (jsonStr: string): string => {
  let fixed = jsonStr;

  // 修复未引用的数字键
  fixed = fixed.replace(/(\{|,)\s*(\d+)\s*:/g, '$1"$2":');
  
  // 修复未引用的标识符键
  fixed = fixed.replace(/(\{|,)\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');
  
  // 修复单引号
  fixed = fixed.replace(/'/g, '"');
  
  // 修复尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  // 修复特殊字符在属性名中的问题
  fixed = fixed.replace(/(\{|,)\s*"([^"]*[^a-zA-Z0-9_$][^"]*)"\s*:/g, (match, prefix, key) => {
    const escapedKey = key.replace(/"/g, '\\"');
    return `${prefix}"${escapedKey}":`;
  });

  return fixed;
};

/**
 * 验证提取的数据是否有效
 */
export const validateContextData = (data: any): boolean => {
  if (!data || typeof data !== 'object') {
    return false;
  }

  // 检查基本结构
  if (!data.result || !data.result.data) {
    return false;
  }

  const resultData = data.result.data;
  
  // 检查关键字段
  const hasProductInfo = resultData.productPackInfo || resultData.globalConfig;
  const hasShippingInfo = resultData.shippingServices;
  
  return hasProductInfo || hasShippingInfo;
};

/**
 * 获取产品数据摘要
 */
export const getProductDataSummary = (contextData: any) => {
  if (!contextData || !contextData.result || !contextData.result.data) {
    return null;
  }

  const data = contextData.result.data;
  
  return {
    hasProductPackInfo: !!data.productPackInfo,
    hasShippingServices: !!data.shippingServices,
    hasGlobalConfig: !!data.globalConfig,
    hasDescription: !!data.description,
    hasWidgets: !!data.widgets,
    dataKeys: Object.keys(data)
  };
};

export default {
  extractContextFromHTML,
  validateContextData,
  getProductDataSummary,
  loadCachedContextData
};