import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

// ===== Zod 验证模式 =====

// 搜索产品验证模式 - 简化版，只保留链接
export const SearchProductSchema = z.object({
  link: z.string().url('商品链接格式不正确'),
})

// 分页信息验证模式
export const PaginationInfoSchema = z.object({
  currentPage: z.number().int().positive('当前页码必须为正整数'),
  totalPages: z.number().int().positive('总页数必须为正整数'),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
  pageSize: z.number().int().positive('页面大小必须为正整数').optional(),
})

// 1688搜索结果验证模式
export const Search1688ResultSchema = z.object({
  url: z.string().url('URL格式不正确'),
  size: z.number().int().positive('页面大小必须为正整数'),
  timestamp: z.string().datetime('时间戳格式不正确'),
  uploadedAt: z.date(),
  searchData: z.object({
    keyword: z.string().min(1, '搜索关键词不能为空'),
    products: z.array(SearchProductSchema),
    pagination: PaginationInfoSchema,
    totalCount: z.number().int().min(0, '总数量不能为负数'),
    dataSource: z.enum(['javascript', 'html', 'fallback']),
  }).nullable(),
  extractionError: z.string().nullable(),
})

export const CreateSearch1688ResultSchema = Search1688ResultSchema.omit({ uploadedAt: true })
export const UpdateSearch1688ResultSchema = Search1688ResultSchema.partial()

export type Search1688ResultType = z.infer<typeof Search1688ResultSchema>
export type CreateSearch1688ResultType = z.infer<typeof CreateSearch1688ResultSchema>
export type UpdateSearch1688ResultType = z.infer<typeof UpdateSearch1688ResultSchema>

// ===== TypeScript 接口定义 =====

// 搜索产品接口 - 简化版，只保留链接
export interface ISearchProduct {
  link: string
}

export interface IPaginationInfo {
  currentPage: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
  pageSize?: number
}

export interface ISearch1688Data {
  keyword: string
  products: ISearchProduct[]
  pagination: IPaginationInfo
  totalCount: number
  dataSource: 'javascript' | 'html' | 'fallback'
}

export interface ISearch1688Result extends Document {
  url: string
  size: number
  timestamp: string
  uploadedAt: Date
  searchData: ISearch1688Data | null
  extractionError: string | null
}

// ===== Mongoose 模式定义 =====

// 搜索产品Mongoose模式 - 简化版，只保留链接
const SearchProductMongooseSchema = new Schema<ISearchProduct>({
  link: { type: String, required: true }
}, { _id: false })

const PaginationInfoMongooseSchema = new Schema<IPaginationInfo>({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  hasNextPage: { type: Boolean, required: true },
  hasPrevPage: { type: Boolean, required: true },
  pageSize: { type: Number }
}, { _id: false })

const Search1688DataMongooseSchema = new Schema<ISearch1688Data>({
  keyword: { type: String, required: true },
  products: [SearchProductMongooseSchema],
  pagination: { type: PaginationInfoMongooseSchema, required: true },
  totalCount: { type: Number, required: true },
  dataSource: { 
    type: String, 
    enum: ['javascript', 'html', 'fallback'], 
    required: true 
  }
}, { _id: false })

const Search1688ResultMongooseSchema = new Schema<ISearch1688Result>({
  url: { type: String, required: true },
  size: { type: Number, required: true },
  timestamp: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  searchData: { type: Search1688DataMongooseSchema, default: null },
  extractionError: { type: String, default: null }
}, {
  timestamps: true,
  collection: 'search1688results'
})

// 创建索引
Search1688ResultMongooseSchema.index({ url: 1 })
Search1688ResultMongooseSchema.index({ 'searchData.keyword': 1 })
Search1688ResultMongooseSchema.index({ uploadedAt: -1 })
Search1688ResultMongooseSchema.index({ timestamp: -1 })

export const Search1688Result = mongoose.model<ISearch1688Result>('Search1688Result', Search1688ResultMongooseSchema)

export default Search1688Result