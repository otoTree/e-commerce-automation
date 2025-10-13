/**
 * 产品特征属性类型定义
 * 基于从1688产品页面提取的featureAttributes数据结构
 */

/**
 * 单个特征属性的数据结构
 */
export interface FeatureAttribute {
  /** 属性ID，唯一标识符 */
  fid: number;
  
  /** 是否为特殊属性 */
  isSpecial: boolean;
  
  /** 是否为lectotype属性 */
  lectotype: boolean;
  
  /** 属性名称 */
  name: string;
  
  /** 输出类型，通常为0表示文本类型 */
  outputType: number;
  
  /** 属性值 */
  value: string;
  
  /** 可选值数组 */
  values: string[];
}

/**
 * 特征属性数组类型
 */
export type FeatureAttributes = FeatureAttribute[];

/**
 * 特征属性提取结果
 */
export interface FeatureAttributesExtractionResult {
  /** 是否提取成功 */
  success: boolean;
  
  /** 提取的属性数组 */
  attributes: FeatureAttributes;
  
  /** 错误信息（如果提取失败） */
  error?: string;
  
  /** 提取的属性数量 */
  count: number;
}

/**
 * 特征属性分类
 */
export interface CategorizedFeatureAttributes {
  /** 基本属性（材质、品牌等） */
  basic: FeatureAttribute[];
  
  /** 规格属性（尺寸、颜色等） */
  specifications: FeatureAttribute[];
  
  /** 特殊属性 */
  special: FeatureAttribute[];
  
  /** 其他属性 */
  others: FeatureAttribute[];
}

/**
 * 属性名称映射，用于标准化属性名称
 */
export const ATTRIBUTE_NAME_MAPPING: Record<string, string> = {
  '材质': 'material',
  '货号': 'itemNumber',
  '加工方式': 'processingMethod',
  '品牌': 'brand',
  '型号': 'model',
  '规格': 'specification',
  '颜色': 'color',
  '尺寸': 'size',
  '重量': 'weight',
  '产地': 'origin',
  '风格': 'style',
  '是否授权的自有品牌': 'isAuthorizedBrand'
};

/**
 * 属性类型枚举
 */
export enum AttributeType {
  TEXT = 0,
  NUMBER = 1,
  BOOLEAN = 2,
  ARRAY = 3
}

/**
 * 特征属性提取配置
 */
export interface FeatureAttributesExtractionConfig {
  /** 是否包含特殊属性 */
  includeSpecial?: boolean;
  
  /** 是否包含lectotype属性 */
  includeLectotype?: boolean;
  
  /** 属性名称过滤器 */
  nameFilter?: string[];
  
  /** 是否标准化属性名称 */
  normalizeNames?: boolean;
}