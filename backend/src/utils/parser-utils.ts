/**
 * 数据解析工具函数
 * 提供HTML解析、字符串处理、数据转换等实用工具
 */

// ===== HTML解析工具 =====

/**
 * 从HTML字符串中提取JavaScript变量
 */
export const extractJSVariable = (html: string, variableName: string): any => {
  try {
    // 匹配 window.variableName = {...}; 或 var variableName = {...};
    const patterns = [
      new RegExp(`window\\.${variableName}\\s*=\\s*({.*?});`, 's'),
      new RegExp(`var\\s+${variableName}\\s*=\\s*({.*?});`, 's'),
      new RegExp(`${variableName}\\s*=\\s*({.*?});`, 's'),
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        return JSON.parse(match[1]);
      }
    }

    return null;
  } catch (error) {
    console.error(`提取变量 ${variableName} 失败:`, error);
    return null;
  }
};

/**
 * 从HTML中提取所有script标签内容
 */
export const extractScriptContents = (html: string): string[] => {
  const scriptRegex = /<script[^>]*>(.*?)<\/script>/gis;
  const scripts: string[] = [];
  let match;

  while ((match = scriptRegex.exec(html)) !== null) {
    scripts.push(match[1]);
  }

  return scripts;
};

/**
 * 从HTML中提取meta标签信息
 */
export const extractMetaTags = (html: string): Record<string, string> => {
  const metaRegex = /<meta\s+([^>]+)>/gi;
  const metas: Record<string, string> = {};
  let match;

  while ((match = metaRegex.exec(html)) !== null) {
    const attributes = parseAttributes(match[1]);
    if (attributes.name && attributes.content) {
      metas[attributes.name] = attributes.content;
    } else if (attributes.property && attributes.content) {
      metas[attributes.property] = attributes.content;
    }
  }

  return metas;
};

/**
 * 解析HTML属性字符串
 */
const parseAttributes = (attributeString: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  const attrRegex = /(\w+)=["']([^"']*)["']/g;
  let match;

  while ((match = attrRegex.exec(attributeString)) !== null) {
    attributes[match[1]] = match[2];
  }

  return attributes;
};

// ===== 字符串处理工具 =====

/**
 * 清理和标准化字符串
 */
export const cleanString = (str: string): string => {
  return str
    .replace(/\s+/g, ' ') // 多个空白字符替换为单个空格
    .replace(/[\r\n\t]/g, ' ') // 换行符和制表符替换为空格
    .trim(); // 去除首尾空白
};

/**
 * 从字符串中提取数字
 */
export const extractNumbers = (str: string): number[] => {
  const matches = str.match(/\d+(\.\d+)?/g);
  return matches ? matches.map(Number) : [];
};

/**
 * 从字符串中提取第一个数字
 */
export const extractFirstNumber = (str: string): number | null => {
  const numbers = extractNumbers(str);
  return numbers.length > 0 ? numbers[0] : null;
};

/**
 * 从字符串中提取价格
 */
export const extractPrice = (str: string): number | null => {
  // 匹配价格格式：¥123.45, $123.45, 123.45元等
  const priceMatch = str.match(/[¥$]?(\d+(?:\.\d{2})?)[元]?/);
  return priceMatch ? parseFloat(priceMatch[1]) : null;
};

/**
 * 从字符串中提取重量
 */
export const extractWeight = (str: string): { value: number; unit: string } | null => {
  const weightMatch = str.match(/(\d+(?:\.\d+)?)\s*(g|kg|克|公斤|千克)/i);
  if (!weightMatch) return null;

  const value = parseFloat(weightMatch[1]);
  const unit = weightMatch[2].toLowerCase();
  
  // 统一转换为克
  const normalizedValue = ['kg', '公斤', '千克'].includes(unit) ? value * 1000 : value;
  
  return {
    value: normalizedValue,
    unit: 'g'
  };
};

/**
 * 从字符串中提取尺寸信息
 */
export const extractDimensions = (str: string): { length?: number; width?: number; height?: number } | null => {
  // 匹配格式：长x宽x高, LxWxH, 100*50*30等
  const dimensionMatch = str.match(/(\d+(?:\.\d+)?)\s*[x*×]\s*(\d+(?:\.\d+)?)\s*[x*×]\s*(\d+(?:\.\d+)?)/i);
  
  if (dimensionMatch) {
    return {
      length: parseFloat(dimensionMatch[1]),
      width: parseFloat(dimensionMatch[2]),
      height: parseFloat(dimensionMatch[3])
    };
  }

  return null;
};

// ===== 颜色处理工具 =====

/**
 * 标准化颜色名称
 */
export const normalizeColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    '红': 'red',
    '蓝': 'blue',
    '绿': 'green',
    '黄': 'yellow',
    '黑': 'black',
    '白': 'white',
    '灰': 'gray',
    '紫': 'purple',
    '粉': 'pink',
    '橙': 'orange',
    '棕': 'brown',
    '银': 'silver',
    '金': 'gold',
  };

  const cleanedColor = cleanString(color);
  
  // 查找映射
  for (const [chinese, english] of Object.entries(colorMap)) {
    if (cleanedColor.includes(chinese)) {
      return english;
    }
  }

  return cleanedColor.toLowerCase();
};

/**
 * 从SKU名称中提取颜色
 */
export const extractColorFromSku = (skuName: string): string => {
  const colors = ['红', '蓝', '绿', '黄', '黑', '白', '灰', '紫', '粉', '橙', '棕', '银', '金'];
  const cleanedSku = cleanString(skuName);
  
  for (const color of colors) {
    if (cleanedSku.includes(color)) {
      return normalizeColor(color);
    }
  }

  // 如果没有找到中文颜色，尝试提取第一个词作为颜色
  const firstWord = cleanedSku.split(/\s+/)[0];
  return normalizeColor(firstWord);
};

// ===== 数据转换工具 =====

/**
 * 安全的JSON解析
 */
export const safeJsonParse = <T = any>(jsonString: string, defaultValue: T | null = null): T | null => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('JSON解析失败:', error);
    return defaultValue;
  }
};

/**
 * 深度合并对象
 */
export const deepMerge = <T extends Record<string, any>>(target: T, source: Partial<T>): T => {
  const result = { ...target };

  for (const key in source) {
    if (source[key] !== undefined) {
      if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
        result[key] = deepMerge(result[key] || ({} as any), source[key] as any);
      } else {
        result[key] = source[key] as any;
      }
    }
  }

  return result;
};

/**
 * 数组去重
 */
export const uniqueArray = <T>(array: T[], keyFn?: (item: T) => any): T[] => {
  if (!keyFn) {
    return [...new Set(array)];
  }

  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

/**
 * 按属性分组数组
 */
export const groupBy = <T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// ===== 验证工具 =====

/**
 * 验证是否为有效的商品ID
 */
export const isValidProductId = (id: string): boolean => {
  return /^\d+$/.test(id) && id.length >= 8;
};

/**
 * 验证是否为有效的价格
 */
export const isValidPrice = (price: number): boolean => {
  return typeof price === 'number' && price > 0 && price < 1000000;
};

/**
 * 验证是否为有效的重量
 */
export const isValidWeight = (weight: number): boolean => {
  return typeof weight === 'number' && weight > 0 && weight < 100000; // 最大100kg
};

/**
 * 验证是否为有效的SKU ID
 */
export const isValidSkuId = (skuId: number): boolean => {
  return typeof skuId === 'number' && skuId > 0;
};

// ===== URL和路径处理工具 =====

/**
 * 提取URL中的参数
 */
export const extractUrlParams = (url: string): Record<string, string> => {
  const params: Record<string, string> = {};
  
  try {
    const urlObj = new URL(url);
    urlObj.searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } catch (error) {
    // 如果不是完整URL，尝试提取查询字符串
    const queryMatch = url.match(/\?(.+)/);
    if (queryMatch) {
      const queryString = queryMatch[1];
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
  }

  return params;
};

/**
 * 构建查询字符串
 */
export const buildQueryString = (params: Record<string, string | number>): string => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&');

  return queryParams ? `?${queryParams}` : '';
};

// ===== 时间处理工具 =====

/**
 * 解析中文时间描述
 */
export const parseChineseTime = (timeStr: string): Date | null => {
  const now = new Date();
  
  // 匹配"X天内发货"
  const daysMatch = timeStr.match(/(\d+)天内/);
  if (daysMatch) {
    const days = parseInt(daysMatch[1]);
    const futureDate = new Date(now);
    futureDate.setDate(now.getDate() + days);
    return futureDate;
  }

  // 匹配"X小时内发货"
  const hoursMatch = timeStr.match(/(\d+)小时内/);
  if (hoursMatch) {
    const hours = parseInt(hoursMatch[1]);
    const futureDate = new Date(now);
    futureDate.setHours(now.getHours() + hours);
    return futureDate;
  }

  return null;
};

/**
 * 格式化时间差
 */
export const formatTimeDiff = (date: Date): string => {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return '已过期';
  } else if (diffDays === 1) {
    return '1天内';
  } else {
    return `${diffDays}天内`;
  }
};

// ===== 导出所有工具函数 =====

export default {
  // HTML解析
  extractJSVariable,
  extractScriptContents,
  extractMetaTags,
  
  // 字符串处理
  cleanString,
  extractNumbers,
  extractFirstNumber,
  extractPrice,
  extractWeight,
  extractDimensions,
  
  // 颜色处理
  normalizeColor,
  extractColorFromSku,
  
  // 数据转换
  safeJsonParse,
  deepMerge,
  uniqueArray,
  groupBy,
  
  // 验证
  isValidProductId,
  isValidPrice,
  isValidWeight,
  isValidSkuId,
  
  // URL处理
  extractUrlParams,
  buildQueryString,
  
  // 时间处理
  parseChineseTime,
  formatTimeDiff,
};