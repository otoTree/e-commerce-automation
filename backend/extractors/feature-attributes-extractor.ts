import { 
  FeatureAttribute, 
  FeatureAttributes, 
  FeatureAttributesExtractionResult,
  CategorizedFeatureAttributes,
  FeatureAttributesExtractionConfig,
  ATTRIBUTE_NAME_MAPPING
} from '../types/feature-attributes';

/**
 * 特征属性提取器
 * 从1688产品页面HTML中提取featureAttributes数据
 */
export class FeatureAttributesExtractor {
  
  /**
   * 从HTML内容中提取特征属性
   * @param htmlContent HTML内容
   * @param config 提取配置
   * @returns 提取结果
   */
  static extractFromHtml(
    htmlContent: string, 
    config: FeatureAttributesExtractionConfig = {}
  ): FeatureAttributesExtractionResult {
    try {
      // 查找featureAttributes的位置
      const featureAttributesIndex = htmlContent.indexOf('featureAttributes');
      if (featureAttributesIndex === -1) {
        return {
          success: false,
          attributes: [],
          error: 'featureAttributes not found in HTML content',
          count: 0
        };
      }

      // 找到数组的开始位置
      const startIndex = htmlContent.indexOf('[', featureAttributesIndex);
      if (startIndex === -1) {
        return {
          success: false,
          attributes: [],
          error: 'featureAttributes array start not found',
          count: 0
        };
      }

      // 使用括号匹配找到数组的结束位置
      const arrayContent = this.extractArrayContent(htmlContent, startIndex);
      if (!arrayContent) {
        return {
          success: false,
          attributes: [],
          error: 'Failed to extract featureAttributes array content',
          count: 0
        };
      }

      // 解析JSON数据
      const attributes: FeatureAttributes = JSON.parse(arrayContent);
      
      // 应用配置过滤
      const filteredAttributes = this.applyFilters(attributes, config);

      return {
        success: true,
        attributes: filteredAttributes,
        count: filteredAttributes.length
      };

    } catch (error) {
      return {
        success: false,
        attributes: [],
        error: error instanceof Error ? error.message : 'Unknown error',
        count: 0
      };
    }
  }

  /**
   * 从指定位置提取数组内容
   * @param content HTML内容
   * @param startIndex 数组开始位置
   * @returns 数组内容字符串
   */
  private static extractArrayContent(content: string, startIndex: number): string | null {
    let bracketCount = 0;
    let endIndex = startIndex;
    let inString = false;
    let escapeNext = false;

    for (let i = startIndex; i < content.length; i++) {
      const char = content[i];

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
        if (char === '[') {
          bracketCount++;
        } else if (char === ']') {
          bracketCount--;
          if (bracketCount === 0) {
            endIndex = i;
            break;
          }
        }
      }
    }

    if (endIndex > startIndex) {
      return content.substring(startIndex, endIndex + 1);
    }

    return null;
  }

  /**
   * 应用过滤配置
   * @param attributes 原始属性数组
   * @param config 配置
   * @returns 过滤后的属性数组
   */
  private static applyFilters(
    attributes: FeatureAttributes, 
    config: FeatureAttributesExtractionConfig
  ): FeatureAttributes {
    let filtered = [...attributes];

    // 过滤特殊属性
    if (config.includeSpecial === false) {
      filtered = filtered.filter(attr => !attr.isSpecial);
    }

    // 过滤lectotype属性
    if (config.includeLectotype === false) {
      filtered = filtered.filter(attr => !attr.lectotype);
    }

    // 按属性名称过滤
    if (config.nameFilter && config.nameFilter.length > 0) {
      filtered = filtered.filter(attr => 
        config.nameFilter!.includes(attr.name)
      );
    }

    // 标准化属性名称
    if (config.normalizeNames) {
      filtered = filtered.map(attr => ({
        ...attr,
        name: ATTRIBUTE_NAME_MAPPING[attr.name] || attr.name
      }));
    }

    return filtered;
  }

  /**
   * 将属性按类型分类
   * @param attributes 属性数组
   * @returns 分类后的属性
   */
  static categorizeAttributes(attributes: FeatureAttributes): CategorizedFeatureAttributes {
    const basic: FeatureAttribute[] = [];
    const specifications: FeatureAttribute[] = [];
    const special: FeatureAttribute[] = [];
    const others: FeatureAttribute[] = [];

    // 基本属性关键词
    const basicKeywords = ['材质', '品牌', '产地', '货号', '型号'];
    // 规格属性关键词
    const specKeywords = ['颜色', '尺寸', '规格', '重量', '风格'];

    attributes.forEach(attr => {
      if (attr.isSpecial) {
        special.push(attr);
      } else if (basicKeywords.some(keyword => attr.name.includes(keyword))) {
        basic.push(attr);
      } else if (specKeywords.some(keyword => attr.name.includes(keyword))) {
        specifications.push(attr);
      } else {
        others.push(attr);
      }
    });

    return { basic, specifications, special, others };
  }

  /**
   * 获取属性值映射
   * @param attributes 属性数组
   * @returns 属性名称到值的映射
   */
  static getAttributeValueMap(attributes: FeatureAttributes): Record<string, string> {
    const map: Record<string, string> = {};
    attributes.forEach(attr => {
      map[attr.name] = attr.value;
    });
    return map;
  }

  /**
   * 搜索特定属性
   * @param attributes 属性数组
   * @param searchTerm 搜索词
   * @returns 匹配的属性数组
   */
  static searchAttributes(
    attributes: FeatureAttributes, 
    searchTerm: string
  ): FeatureAttributes {
    const term = searchTerm.toLowerCase();
    return attributes.filter(attr => 
      attr.name.toLowerCase().includes(term) ||
      attr.value.toLowerCase().includes(term) ||
      attr.values.some(value => value.toLowerCase().includes(term))
    );
  }

  /**
   * 验证属性数据完整性
   * @param attributes 属性数组
   * @returns 验证结果
   */
  static validateAttributes(attributes: FeatureAttributes): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    attributes.forEach((attr, index) => {
      if (typeof attr.fid !== 'number') {
        errors.push(`Attribute ${index}: fid must be a number`);
      }
      if (typeof attr.name !== 'string' || attr.name.trim() === '') {
        errors.push(`Attribute ${index}: name must be a non-empty string`);
      }
      if (typeof attr.value !== 'string') {
        errors.push(`Attribute ${index}: value must be a string`);
      }
      if (!Array.isArray(attr.values)) {
        errors.push(`Attribute ${index}: values must be an array`);
      }
      if (typeof attr.isSpecial !== 'boolean') {
        errors.push(`Attribute ${index}: isSpecial must be a boolean`);
      }
      if (typeof attr.lectotype !== 'boolean') {
        errors.push(`Attribute ${index}: lectotype must be a boolean`);
      }
      if (typeof attr.outputType !== 'number') {
        errors.push(`Attribute ${index}: outputType must be a number`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}