/**
 * 强大的JSON解析器，专门处理1688页面的复杂window.context数据
 * 能够处理$ref引用、格式问题和特殊字符
 */

interface JsonReference {
  $ref: string;
}

interface ParsedContext {
  [key: string]: any;
}

/**
 * 解析JSONPath表达式并获取对应的值
 */
const getValueByPath = (obj: any, path: string): any => {
  try {
    // 移除开头的 $. 
    const cleanPath = path.replace(/^\$\./, '');
    
    // 分割路径
    const parts = cleanPath.split(/[\.\[\]]+/).filter(Boolean);
    
    let current = obj;
    for (const part of parts) {
      if (current === null || current === undefined) {
        return null;
      }
      
      // 处理数组索引
      if (/^\d+$/.test(part)) {
        const index = parseInt(part, 10);
        if (Array.isArray(current) && index < current.length) {
          current = current[index];
        } else {
          return null;
        }
      } else {
        current = current[part];
      }
    }
    
    return current;
  } catch (error) {
    console.warn(`无法解析路径 ${path}:`, error);
    return null;
  }
};

/**
 * 递归解析JSON中的$ref引用
 */
const resolveReferences = (obj: any, rootObj: any, visited = new Set<string>()): any => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (typeof obj === 'object') {
    // 检查是否是$ref对象
    if (obj.$ref && typeof obj.$ref === 'string') {
      // 防止循环引用
      if (visited.has(obj.$ref)) {
        console.warn(`检测到循环引用: ${obj.$ref}`);
        return {};
      }
      
      visited.add(obj.$ref);
      const resolvedValue = getValueByPath(rootObj, obj.$ref);
      visited.delete(obj.$ref);
      
      if (resolvedValue !== null && resolvedValue !== undefined) {
        return resolveReferences(resolvedValue, rootObj, visited);
      } else {
        console.warn(`无法解析引用: ${obj.$ref}`);
        return {};
      }
    }
    
    // 处理数组
    if (Array.isArray(obj)) {
      return obj.map(item => resolveReferences(item, rootObj, visited));
    }
    
    // 处理普通对象
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveReferences(value, rootObj, visited);
    }
    return result;
  }
  
  return obj;
};

/**
 * 清理JSON字符串，移除可能导致解析失败的字符
 */
const cleanJsonString = (jsonStr: string): string => {
  return jsonStr
    // 移除注释
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    // 移除多余的逗号
    .replace(/,(\s*[}\]])/g, '$1')
    // 移除控制字符
    .replace(/[\x00-\x1F\x7F]/g, '')
    // 标准化换行符
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // 移除多余的空白字符
    .replace(/\n\s*\n/g, '\n')
    .trim();
};

/**
 * 尝试修复常见的JSON格式问题
 */
const fixCommonJsonIssues = (jsonStr: string): string => {
  let fixed = jsonStr;
  
  // 1. 修复数字键没有引号的问题
  fixed = fixed.replace(/([{,]\s*)(\d+)(\s*:)/g, '$1"$2"$3');
  
  // 2. 修复未引用的标识符属性名
  fixed = fixed.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)(\s*:)/g, (match, prefix, key, suffix) => {
    // 检查是否已经有引号
    if (prefix.includes('"' + key + '"')) {
      return match; // 已经有引号，不修改
    }
    return prefix + '"' + key + '"' + suffix;
  });
  
  // 3. 修复单引号为双引号
  fixed = fixed.replace(/'/g, '"');
  
  // 4. 移除尾随逗号
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');
  
  // 5. 修复属性名中的特殊字符
  fixed = fixed.replace(/([{,]\s*)"([^"]*[^a-zA-Z0-9_$][^"]*)"/g, (match, prefix, propName, suffix) => {
    // 转义属性名中的特殊字符
    const escapedPropName = propName.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `${prefix}"${escapedPropName}"${suffix}`;
  });
  
  // 6. 转义字符串中的换行符和控制字符
  fixed = fixed.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, (match, content) => {
    const escaped = content
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\f/g, '\\f')
      .replace(/\b/g, '\\b');
    return `"${escaped}"`;
  });
  
  // 7. 修复可能的双重转义
  fixed = fixed.replace(/\\\\/g, '\\');
  
  return fixed;
};

/**
 * 分段解析JSON，处理大型复杂JSON
 */
const parseJsonInSegments = (jsonStr: string): any => {
  try {
    // 首先尝试直接解析
    return JSON.parse(jsonStr);
  } catch (error) {
    console.log('直接解析失败，尝试分段解析...');
    
    // 尝试找到可能的分割点
    const segments: string[] = [];
    let braceCount = 0;
    let currentSegment = '';
    let inString = false;
    let escapeNext = false;
    
    for (let i = 0; i < jsonStr.length; i++) {
      const char = jsonStr[i];
      
      if (escapeNext) {
        escapeNext = false;
        currentSegment += char;
        continue;
      }
      
      if (char === '\\') {
        escapeNext = true;
        currentSegment += char;
        continue;
      }
      
      if (char === '"' && !escapeNext) {
        inString = !inString;
      }
      
      if (!inString) {
        if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
        }
      }
      
      currentSegment += char;
      
      // 如果找到一个完整的对象
      if (!inString && braceCount === 0 && currentSegment.trim().endsWith('}')) {
        segments.push(currentSegment.trim());
        currentSegment = '';
      }
    }
    
    if (currentSegment.trim()) {
      segments.push(currentSegment.trim());
    }
    
    // 尝试解析每个段
    const parsedSegments: any[] = [];
    for (const segment of segments) {
      try {
        const parsed = JSON.parse(segment);
        parsedSegments.push(parsed);
      } catch (segmentError) {
        console.warn(`段解析失败: ${segment.substring(0, 100)}...`);
      }
    }
    
    // 合并解析结果
    if (parsedSegments.length === 1) {
      return parsedSegments[0];
    } else if (parsedSegments.length > 1) {
      return Object.assign({}, ...parsedSegments);
    }
    
    throw error;
  }
};

/**
 * 强大的JSON解析函数
 */
export const parseRobustJson = (jsonStr: string): ParsedContext => {
  try {
    // 1. 清理JSON字符串
    let cleanedJson = cleanJsonString(jsonStr);
    
    // 2. 修复常见问题
    cleanedJson = fixCommonJsonIssues(cleanedJson);
    
    // 3. 首先替换所有$ref为空对象，避免解析失败
    const jsonWithoutRefs = cleanedJson.replace(/\{\s*"\$ref"\s*:\s*"[^"]+"\s*\}/g, '{}');
    
    // 4. 尝试解析
    let parsed: any;
    try {
      parsed = JSON.parse(jsonWithoutRefs);
    } catch (parseError) {
      console.log('标准解析失败，尝试分段解析...');
      parsed = parseJsonInSegments(jsonWithoutRefs);
    }
    
    // 5. 现在尝试解析原始JSON并解决$ref引用
    try {
      const originalParsed = JSON.parse(cleanedJson);
      const resolved = resolveReferences(originalParsed, originalParsed);
      return resolved;
    } catch (refError) {
      console.warn('$ref解析失败，使用简化版本:', refError);
      return parsed;
    }
    
  } catch (error) {
    console.error('JSON解析完全失败:', error);
    throw new Error(`JSON解析失败: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * 从HTML内容中提取并解析window.context数据
 */
export const extractAndParseContext = (html: string): any => {
  try {
    // 方法1: 寻找完整的window.context赋值语句（不依赖分号结尾）
    const contextAssignmentRegex = /window\.context\s*=\s*[\s\S]*?(?=\n|$)/;
    const assignmentMatch = html.match(contextAssignmentRegex);
    
    if (assignmentMatch) {
      console.log('找到window.context赋值语句');
      const statement = assignmentMatch[0];
      console.log(`语句长度: ${statement.length}`);
      
      // 从语句中提取JSON部分
      // 寻找第二个参数（在逗号后面的JSON对象）
      const commaIndex = statement.indexOf(',');
      if (commaIndex !== -1) {
        const afterComma = statement.substring(commaIndex + 1);
        const firstBraceIndex = afterComma.indexOf('{');
        
        if (firstBraceIndex !== -1) {
          const jsonStart = commaIndex + 1 + firstBraceIndex;
          
          // 找到匹配的结束大括号
          let braceCount = 0;
          let jsonEnd = -1;
          let inString = false;
          let escapeNext = false;
          
          for (let i = jsonStart; i < statement.length; i++) {
            const char = statement[i];
            
            if (escapeNext) {
              escapeNext = false;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              continue;
            }
            
            if (char === '"' && !escapeNext) {
              inString = !inString;
              continue;
            }
            
            if (!inString) {
              if (char === '{') {
                braceCount++;
              } else if (char === '}') {
                braceCount--;
                if (braceCount === 0) {
                  jsonEnd = i;
                  break;
                }
              }
            }
          }
          
          if (jsonEnd !== -1) {
            const jsonStr = statement.substring(jsonStart, jsonEnd + 1);
            console.log(`提取的JSON长度: ${jsonStr.length}`);
            const fixedJson = fixCommonJsonIssues(jsonStr);
            console.log(`修复后JSON长度: ${fixedJson.length}`);
            return parseRobustJson(fixedJson);
          } else {
            console.log('未找到匹配的结束大括号');
          }
        } else {
          console.log('未找到第一个大括号');
        }
      } else {
        console.log('未找到逗号分隔符');
      }
    }

    // 方法2: 尝试匹配复杂的函数调用格式（备用）
    const complexFunctionRegex = /window\.context\s*=\s*\(function[^{]*\{[^}]*\}\)\([^,]*,\s*(\{[\s\S]*?\})\s*\)/;
    const complexMatch = html.match(complexFunctionRegex);
    
    if (complexMatch && complexMatch[1]) {
      console.log('使用复杂函数调用格式提取');
      const jsonStr = complexMatch[1];
      const fixedJson = fixCommonJsonIssues(jsonStr);
      return parseRobustJson(fixedJson);
    }

    // 方法3: 直接赋值格式（备用）
    const directAssignmentRegex = /window\.context\s*=\s*(\{[\s\S]*?\});/;
    const directMatch = html.match(directAssignmentRegex);
    
    if (directMatch && directMatch[1]) {
      console.log('使用直接赋值格式提取');
      const jsonStr = directMatch[1];
      const fixedJson = fixCommonJsonIssues(jsonStr);
      return parseRobustJson(fixedJson);
    }

    console.log('未找到window.context数据');
    return null;
  } catch (error) {
    console.error('提取window.context失败:', error);
    return null;
  }
};