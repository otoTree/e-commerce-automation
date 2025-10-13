/**
 * 1688商品数据Zod验证模式
 * 提供类型安全的数据验证和转换
 */

import { z } from 'zod';

// ===== 基础验证模式 =====

/**
 * 商品ID验证
 */
export const ProductIdSchema = z.string()
  .min(8, '商品ID至少8位数字')
  .regex(/^\d+$/, '商品ID必须为纯数字');

/**
 * SKU ID验证
 */
export const SkuIdSchema = z.number()
  .int('SKU ID必须为整数')
  .positive('SKU ID必须为正数');

/**
 * 价格验证
 */
export const PriceSchema = z.number()
  .positive('价格必须为正数')
  .max(1000000, '价格不能超过100万')
  .transform(val => Math.round(val * 100) / 100); // 保留两位小数

/**
 * 重量验证（单位：克）
 */
export const WeightSchema = z.number()
  .positive('重量必须为正数')
  .max(100000, '重量不能超过100kg')
  .int('重量必须为整数');

/**
 * 颜色验证
 */
export const ColorSchema = z.string()
  .min(1, '颜色不能为空')
  .max(20, '颜色名称过长')
  .transform(val => val.trim().toLowerCase());

/**
 * 商品类型验证
 */
export const ProductTypeSchema = z.enum(['with_backrest', 'without_backrest']);

// ===== 复合验证模式 =====

/**
 * 商品变体验证模式
 */
export const ProductVariantSchema = z.object({
  skuId: SkuIdSchema,
  color: ColorSchema,
  type: ProductTypeSchema,
  weight: WeightSchema,
  fullName: z.string().min(1, '完整名称不能为空').max(100, '完整名称过长'),
});

/**
 * 服务保障验证模式
 */
export const ServiceProtectionSchema = z.object({
  code: z.string().min(1, '服务代码不能为空'),
  name: z.string().min(1, '服务名称不能为空'),
  description: z.string().min(1, '服务描述不能为空'),
  type: z.enum(['insurance', 'protect']),
  enabled: z.boolean(),
});

/**
 * 物流信息验证模式
 */
export const ShippingInfoSchema = z.object({
  location: z.string().min(1, '发货地点不能为空'),
  targetLocation: z.string().min(1, '目标地点不能为空'),
  cost: z.number().min(0, '运费不能为负数'),
  deliveryPromise: z.string().min(1, '发货承诺不能为空'),
  freeShipping: z.boolean(),
});

/**
 * 商品描述验证模式
 */
export const ProductDescriptionSchema = z.object({
  detailUrl: z.string().url('详情URL格式不正确').optional(),
  images: z.array(z.string().url('图片URL格式不正确')).optional(),
}).optional();

/**
 * 元数据验证模式
 */
export const MetadataSchema = z.object({
  extractedAt: z.date(),
  source: z.enum(['html', 'context']),
  offerId: z.number().int('Offer ID必须为整数').min(0, 'Offer ID不能为负数'),
});

/**
 * 完整商品数据验证模式
 */
export const ExtractedProductDataSchema = z.object({
  // 基本信息
  productId: ProductIdSchema,
  title: z.string().min(1, '商品标题不能为空').max(200, '商品标题过长'),
  seller: z.string().min(1, '卖家信息不能为空').max(100, '卖家信息过长'),
  
  // SKU信息
  variants: z.array(ProductVariantSchema).min(1, '至少需要一个商品变体'),
  
  // 价格信息
  price: z.string().optional(),
  
  // 物流信息
  shipping: ShippingInfoSchema,
  
  // 服务保障
  protections: z.array(ServiceProtectionSchema),
  
  // 商品详情
  description: ProductDescriptionSchema,
  
  // 元数据
  metadata: MetadataSchema,
});

// ===== 输入验证模式 =====

/**
 * HTML输入验证模式
 */
export const HtmlInputSchema = z.string()
  .min(100, 'HTML内容过短')
  .refine(
    (html) => html.includes('<html') || html.includes('<!DOCTYPE'),
    '不是有效的HTML内容'
  );

/**
 * Context输入验证模式
 */
export const ContextInputSchema = z.object({
  result: z.object({
    data: z.object({
      productPackInfo: z.any(),
      shippingServices: z.any(),
      description: z.any().optional(),
    }),
  }),
}).passthrough(); // 允许额外字段

// ===== 验证函数 =====

/**
 * 验证提取的商品数据
 */
export const validateExtractedData = (data: unknown) => {
  return ExtractedProductDataSchema.safeParse(data);
};

/**
 * 验证HTML输入
 */
export const validateHtmlInput = (html: unknown) => {
  return HtmlInputSchema.safeParse(html);
};

/**
 * 验证Context输入
 */
export const validateContextInput = (context: unknown) => {
  return ContextInputSchema.safeParse(context);
};

/**
 * 验证商品变体数组
 */
export const validateVariants = (variants: unknown) => {
  return z.array(ProductVariantSchema).safeParse(variants);
};

/**
 * 验证服务保障数组
 */
export const validateProtections = (protections: unknown) => {
  return z.array(ServiceProtectionSchema).safeParse(protections);
};

// ===== 数据转换函数 =====

/**
 * 清理和转换商品数据
 */
export const transformProductData = (data: any) => {
  try {
    // 预处理数据
    const preprocessed = {
      ...data,
      title: data.title?.trim() || '',
      seller: data.seller?.trim() || '',
      variants: data.variants?.map((variant: any) => ({
        ...variant,
        color: variant.color?.trim()?.toLowerCase() || '',
        fullName: variant.fullName?.trim() || '',
      })) || [],
      shipping: {
        ...data.shipping,
        location: data.shipping?.location?.trim() || '',
        targetLocation: data.shipping?.targetLocation?.trim() || '',
        deliveryPromise: data.shipping?.deliveryPromise?.trim() || '',
      },
      metadata: {
        ...data.metadata,
        extractedAt: data.metadata?.extractedAt || new Date(),
      },
    };

    return ExtractedProductDataSchema.parse(preprocessed);
  } catch (error) {
    throw new Error(`数据转换失败: ${error}`);
  }
};

// ===== 部分验证模式 =====

/**
 * 基本信息验证（用于快速检查）
 */
export const BasicInfoSchema = z.object({
  productId: ProductIdSchema,
  title: z.string().min(1),
  seller: z.string().min(1),
});

/**
 * SKU信息验证（用于变体检查）
 */
export const SkuInfoSchema = z.object({
  skuId: SkuIdSchema,
  color: ColorSchema,
  weight: WeightSchema,
});

/**
 * 物流基本信息验证
 */
export const BasicShippingSchema = z.object({
  location: z.string().min(1),
  cost: z.number().min(0),
});

// ===== 验证工具函数 =====

/**
 * 检查数据完整性
 */
export const checkDataCompleteness = (data: any): { 
  isComplete: boolean; 
  missing: string[]; 
  score: number; 
} => {
  const missing: string[] = [];
  let score = 0;
  const totalFields = 8;

  // 检查必需字段
  if (!data.productId) missing.push('productId');
  else score++;

  if (!data.title) missing.push('title');
  else score++;

  if (!data.seller) missing.push('seller');
  else score++;

  if (!data.variants?.length) missing.push('variants');
  else score++;

  if (!data.shipping?.location) missing.push('shipping.location');
  else score++;

  if (!data.shipping?.cost && data.shipping?.cost !== 0) missing.push('shipping.cost');
  else score++;

  if (!data.protections) missing.push('protections');
  else score++;

  if (!data.metadata) missing.push('metadata');
  else score++;

  return {
    isComplete: missing.length === 0,
    missing,
    score: Math.round((score / totalFields) * 100),
  };
};

/**
 * 获取验证错误的友好消息
 */
export const getValidationErrorMessage = (error: z.ZodError): string => {
  const messages = error.issues.map((err: any) => {
    const path = err.path.join('.');
    return `${path}: ${err.message}`;
  });

  return `数据验证失败:\n${messages.join('\n')}`;
};

/**
 * 验证并返回友好错误信息
 */
export const validateWithFriendlyError = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  } else {
    return { 
      success: false, 
      error: getValidationErrorMessage(result.error) 
    };
  }
};

// ===== 类型导出 =====

export type ExtractedProductData = z.infer<typeof ExtractedProductDataSchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type ServiceProtection = z.infer<typeof ServiceProtectionSchema>;
export type ShippingInfo = z.infer<typeof ShippingInfoSchema>;
export type ProductDescription = z.infer<typeof ProductDescriptionSchema>;
export type Metadata = z.infer<typeof MetadataSchema>;

// ===== 默认导出 =====

export default {
  // 主要验证模式
  ExtractedProductDataSchema,
  ProductVariantSchema,
  ServiceProtectionSchema,
  ShippingInfoSchema,
  
  // 验证函数
  validateExtractedData,
  validateHtmlInput,
  validateContextInput,
  validateVariants,
  validateProtections,
  
  // 转换函数
  transformProductData,
  
  // 工具函数
  checkDataCompleteness,
  getValidationErrorMessage,
  validateWithFriendlyError,
};