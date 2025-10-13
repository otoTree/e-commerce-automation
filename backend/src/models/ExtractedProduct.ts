import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

// ===== Zod 验证模式 =====

// 商品变体验证模式
export const VariantSchema = z.object({
  skuId: z.number().int().positive('SKU ID必须为正整数'),
  color: z.string().min(1, '颜色不能为空'),
  type: z.string().min(1, '类型不能为空'),
  weight: z.number().positive('重量必须为正数'),
  fullName: z.string().min(1, '完整名称不能为空'),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    volume: z.number().optional(),
  }).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
})

// 商品属性定义验证模式
export const AttributeSchema = z.object({
  fid: z.number().int(),
  name: z.string().min(1, '属性名称不能为空'),
  label: z.string().min(1, '属性标签不能为空'),
  precision: z.number().int(),
  type: z.enum(['dimension', 'weight', 'color', 'text', 'number']).optional(),
})

// 物流信息验证模式
export const ShippingSchema = z.object({
  location: z.string().min(1, '发货地点不能为空'),
  targetLocation: z.string().min(1, '目标地点不能为空'),
  cost: z.number().min(0, '运费不能为负数'),
  deliveryPromise: z.string().min(1, '发货承诺不能为空'),
  freeShipping: z.boolean(),
})

// 特征属性验证模式
export const FeatureAttributeSchema = z.object({
  fid: z.number().int(),
  isSpecial: z.boolean(),
  lectotype: z.boolean(),
  name: z.string().min(1, '属性名称不能为空'),
  outputType: z.number().int(),
  value: z.string(),
  values: z.array(z.string()),
})

// Ozon商品价格验证模式
export const OzonPriceSchema = z.object({
  current: z.string().optional(),
  currency: z.string().optional(),
  original: z.string().optional(),
  withCard: z.string().optional(),
  withoutCard: z.string().optional(),
})

// Ozon商品评分验证模式
export const OzonRatingSchema = z.object({
  score: z.number().optional(),
  reviewCount: z.number().optional(),
})

// Ozon商品可用性验证模式
export const OzonAvailabilitySchema = z.object({
  inStock: z.boolean().optional(),
})

// Ozon商品促销验证模式
export const OzonPromotionsSchema = z.object({
  specialOffer: z.string().optional(),
  saleEndDate: z.string().optional(),
})

// Ozon商品配送验证模式
export const OzonDeliverySchema = z.object({
  freeShipping: z.boolean().optional(),
})

// Ozon商品元数据验证模式
export const OzonMetadataSchema = z.object({
  extractedAt: z.date(),
  source: z.string(),
})

// Ozon商品数据验证模式
export const OzonProductDataSchema = z.object({
  productId: z.string().min(1, '商品ID不能为空'),
  title: z.string().min(1, '商品标题不能为空'),
  price: OzonPriceSchema.optional(),
  rating: OzonRatingSchema.optional(),
  images: z.array(z.string()).optional(),
  availability: OzonAvailabilitySchema.optional(),
  promotions: OzonPromotionsSchema.optional(),
  delivery: OzonDeliverySchema.optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  seller: z.string().optional(),
  metadata: OzonMetadataSchema.optional(),
})

// 商品图片验证模式
export const ProductImageSchema = z.object({
  fullPathImageURI: z.string().min(1, '图片URL不能为空').optional(),
  imageURI: z.string().min(1, '图片URI不能为空').optional(),
  '310x310': z.string().min(1, '310x310图片URL不能为空').optional(),
  '220x220': z.string().min(1, '220x220图片URL不能为空').optional(),
  '48x48': z.string().min(1, '48x48图片URL不能为空').optional(),
  '64x64': z.string().min(1, '64x64图片URL不能为空').optional(),
  '100x100': z.string().min(1, '100x100图片URL不能为空').optional(),
  url: z.string().min(1, '图片URL不能为空').optional(),
  src: z.string().min(1, '图片源URL不能为空').optional(),
  originalUrl: z.string().min(1, '原始图片URL不能为空').optional(),
  thumbnailUrl: z.string().min(1, '缩略图URL不能为空').optional(),
})

// 服务保障验证模式
export const ProtectionSchema = z.object({
  code: z.string().optional(),
  name: z.string().min(1, '保障名称不能为空'),
  description: z.string().optional(),
  type: z.string().optional(),
  enabled: z.boolean().optional(),
})

// 元数据验证模式
export const MetadataSchema = z.object({
  extractedAt: z.date(),
  source: z.enum(['html', 'context']),
  offerId: z.number().int().positive('Offer ID必须为正整数'),
})

// 提取的商品数据验证模式
export const ExtractedProductSchema = z.object({
  url: z.string().url('URL格式不正确'),
  size: z.number().int().positive('页面大小必须为正整数'),
  timestamp: z.string().datetime('时间戳格式不正确'),
  uploadedAt: z.date(),
  productData: z.object({
    productId: z.string().min(1, '商品ID不能为空'),
    title: z.string().min(1, '商品标题不能为空'),
    seller: z.string().min(1, '卖家信息不能为空'),
    price: z.string().optional(),
    variants: z.array(VariantSchema).min(1, '至少需要一个商品变体'),
    shipping: ShippingSchema,
    protections: z.array(ProtectionSchema),
    images: z.array(ProductImageSchema).optional(), // 新增图片字段
    description: z.string().optional(), // 新增描述字段
    featureAttributes: z.array(FeatureAttributeSchema).optional(), // 新增
    metadata: MetadataSchema,
  }).nullable(),
  ozonProductData: OzonProductDataSchema.nullable().optional(), // 新增Ozon商品数据
  extractionError: z.string().nullable(),
})

export const CreateExtractedProductSchema = ExtractedProductSchema.omit({ uploadedAt: true })
export const UpdateExtractedProductSchema = ExtractedProductSchema.partial()

export type ExtractedProductType = z.infer<typeof ExtractedProductSchema>
export type CreateExtractedProductType = z.infer<typeof CreateExtractedProductSchema>
export type UpdateExtractedProductType = z.infer<typeof UpdateExtractedProductSchema>

// ===== Mongoose 接口 =====

export interface IVariant {
  skuId: number
  color: string
  type: string
  weight: number
  fullName: string
  dimensions?: {
    length?: number
    width?: number
    height?: number
    volume?: number
  }
  attributes?: Record<string, any>
}

export interface IShipping {
  location: string
  targetLocation: string
  cost: number
  deliveryPromise: string
  freeShipping: boolean
}

export interface IProtection {
  code?: string
  name: string
  description?: string
  type?: string
  enabled?: boolean
}

export interface IMetadata {
  extractedAt: Date
  source: 'html' | 'context'
  offerId: number
}

export interface IFeatureAttribute {
  fid: number
  isSpecial: boolean
  lectotype: boolean
  name: string
  outputType: number
  value: string
  values: string[]
}

export interface IAttribute {
  fid: number
  name: string
  label: string
  precision: number
  type?: 'dimension' | 'weight' | 'color' | 'text' | 'number'
}

export interface IProductImage {
  fullPathImageURI?: string
  imageURI?: string
  '310x310'?: string
  '220x220'?: string
  '48x48'?: string
  '64x64'?: string
  '100x100'?: string
  url?: string
  src?: string
  originalUrl?: string
  thumbnailUrl?: string
}

export interface IProductData {
  productId: string
  title: string
  seller: string
  price?: string
  variants: IVariant[]
  shipping: IShipping
  protections: IProtection[]
  images?: IProductImage[] // 新增图片字段
  description?: string | object // 新增描述字段，支持字符串或对象类型
  featureAttributes?: IFeatureAttribute[] // 新增
  metadata: IMetadata
}

export interface IOzonPrice {
  current?: string
  currency?: string
  original?: string
  withCard?: string
  withoutCard?: string
}

export interface IOzonRating {
  score?: number
  reviewCount?: number
}

export interface IOzonAvailability {
  inStock?: boolean
}

export interface IOzonPromotions {
  specialOffer?: string
  saleEndDate?: string
}

export interface IOzonDelivery {
  freeShipping?: boolean
}

export interface IOzonMetadata {
  extractedAt: Date
  source: string
}

export interface IOzonProductData {
  productId: string
  title: string
  price?: IOzonPrice
  rating?: IOzonRating
  images?: string[]
  availability?: IOzonAvailability
  promotions?: IOzonPromotions
  delivery?: IOzonDelivery
  attributes?: Record<string, any>
  seller?: string
  metadata?: IOzonMetadata
}

export interface IExtractedProduct extends Document {
  url: string
  size: number
  timestamp: string
  uploadedAt: Date
  productData: IProductData | null
  ozonProductData?: IOzonProductData | null // 新增Ozon商品数据
  extractionError: string | null
}

// ===== Mongoose 子模式定义 =====

// Ozon价格子模式
const ozonPriceSubSchema = new Schema<IOzonPrice>({
  current: { type: String, trim: true },
  currency: { type: String, trim: true },
  original: { type: String, trim: true },
  withCard: { type: String, trim: true },
  withoutCard: { type: String, trim: true },
}, { _id: false })

// Ozon评分子模式
const ozonRatingSubSchema = new Schema<IOzonRating>({
  score: { type: Number },
  reviewCount: { type: Number },
}, { _id: false })

// Ozon可用性子模式
const ozonAvailabilitySubSchema = new Schema<IOzonAvailability>({
  inStock: { type: Boolean },
}, { _id: false })

// Ozon促销子模式
const ozonPromotionsSubSchema = new Schema<IOzonPromotions>({
  specialOffer: { type: String, trim: true },
  saleEndDate: { type: String, trim: true },
}, { _id: false })

// Ozon配送子模式
const ozonDeliverySubSchema = new Schema<IOzonDelivery>({
  freeShipping: { type: Boolean },
}, { _id: false })

// Ozon元数据子模式
const ozonMetadataSubSchema = new Schema<IOzonMetadata>({
  extractedAt: { type: Date, required: true },
  source: { type: String, required: true },
}, { _id: false })

// Ozon商品数据子模式
const ozonProductDataSubSchema = new Schema<IOzonProductData>({
  productId: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  price: ozonPriceSubSchema,
  rating: ozonRatingSubSchema,
  images: [{ type: String, trim: true }],
  availability: ozonAvailabilitySubSchema,
  promotions: ozonPromotionsSubSchema,
  delivery: ozonDeliverySubSchema,
  attributes: { type: Schema.Types.Mixed },
  seller: { type: String, trim: true },
  metadata: ozonMetadataSubSchema,
}, { _id: false })

// 商品变体子模式
const variantSubSchema = new Schema<IVariant>({
  skuId: { type: Number, required: true },
  color: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true },
  weight: { type: Number, required: true },
  fullName: { type: String, required: true, trim: true },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    volume: { type: Number },
  },
  attributes: { type: Schema.Types.Mixed },
}, { _id: false })

// 物流子模式
const shippingSubSchema = new Schema<IShipping>({
  location: { type: String, required: true, trim: true },
  targetLocation: { type: String, required: true, trim: true },
  cost: { type: Number, required: true, min: 0 },
  deliveryPromise: { type: String, required: true, trim: true },
  freeShipping: { type: Boolean, required: true },
}, { _id: false })

// 保障子模式
const protectionSubSchema = new Schema<IProtection>({
  code: { type: String, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  type: { type: String, trim: true },
  enabled: { type: Boolean },
}, { _id: false })

// 元数据子模式
const metadataSubSchema = new Schema<IMetadata>({
  extractedAt: { type: Date, required: true },
  source: { type: String, enum: ['html', 'context'], required: true },
  offerId: { type: Number, required: true },
}, { _id: false })

// 特征属性子模式
const featureAttributeSubSchema = new Schema<IFeatureAttribute>({
  fid: { type: Number, required: true },
  isSpecial: { type: Boolean, required: true },
  lectotype: { type: Boolean, required: true },
  name: { type: String, required: true, trim: true },
  outputType: { type: Number, required: true },
  value: { type: String, required: true, trim: true },
  values: [{ type: String, trim: true }],
}, { _id: false })

// 属性定义子模式
const attributeSubSchema = new Schema<IAttribute>({
  fid: { type: Number, required: true },
  name: { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  precision: { type: Number, required: true },
  type: { type: String, enum: ['dimension', 'weight', 'color', 'text', 'number'] },
}, { _id: false })

// 商品图片子模式
const productImageSubSchema = new Schema<IProductImage>({
  fullPathImageURI: { type: String, trim: true },
  imageURI: { type: String, trim: true },
  '310x310': { type: String, trim: true },
  '220x220': { type: String, trim: true },
  '48x48': { type: String, trim: true },
  '64x64': { type: String, trim: true },
  '100x100': { type: String, trim: true },
  url: { type: String, trim: true },
  src: { type: String, trim: true },
  originalUrl: { type: String, trim: true },
  thumbnailUrl: { type: String, trim: true },
}, { _id: false })

// 商品数据子模式
const productDataSubSchema = new Schema<IProductData>({
  productId: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  seller: { type: String, required: true, trim: true },
  price: { type: String, trim: true },
  variants: [variantSubSchema],
  shipping: shippingSubSchema,
  protections: [protectionSubSchema],
  images: [productImageSubSchema], // 新增图片字段
  description: { type: Schema.Types.Mixed }, // 新增描述字段，支持字符串或对象类型
  featureAttributes: [featureAttributeSubSchema], // 新增
  metadata: metadataSubSchema,
}, { _id: false })

// 主模式
const mongooseExtractedProductSchema = new Schema<IExtractedProduct>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    timestamp: {
      type: String,
      required: true,
    },
    uploadedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    productData: {
      type: productDataSubSchema,
      default: null,
    },
    ozonProductData: {
      type: ozonProductDataSubSchema,
      default: null,
    },
    extractionError: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

// ===== 索引 =====// 创建索引以提高查询性能
mongooseExtractedProductSchema.index({ url: 1 })
mongooseExtractedProductSchema.index({ 'productData.productId': 1 })
mongooseExtractedProductSchema.index({ 'productData.seller': 1 })
mongooseExtractedProductSchema.index({ 'ozonProductData.productId': 1 }) // 新增Ozon商品ID索引
mongooseExtractedProductSchema.index({ 'ozonProductData.seller': 1 }) // 新增Ozon卖家索引
mongooseExtractedProductSchema.index({ uploadedAt: -1 })
mongooseExtractedProductSchema.index({ 'productData.metadata.offerId': 1 })

export const ExtractedProduct = mongoose.model<IExtractedProduct>('ExtractedProduct', mongooseExtractedProductSchema)