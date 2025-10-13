import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

// Zod 验证模式
export const ProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be positive'),
  category: z.string().min(1, 'Category is required'),
  brand: z.string().optional(),
  images: z.array(z.string().url()).default([]),
  stock: z.number().int().min(0, 'Stock cannot be negative').default(0),
  isActive: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.string()).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateProductSchema = ProductSchema.omit({ createdAt: true, updatedAt: true })
export const UpdateProductSchema = ProductSchema.partial().omit({ createdAt: true, updatedAt: true })

export type ProductType = z.infer<typeof ProductSchema>
export type CreateProductType = z.infer<typeof CreateProductSchema>
export type UpdateProductType = z.infer<typeof UpdateProductSchema>

// Mongoose 接口
export interface IProduct extends Document {
  name: string
  description: string
  price: number
  category: string
  brand?: string
  images: string[]
  stock: number
  isActive: boolean
  tags: string[]
  specifications?: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema
const mongooseProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    images: [{
      type: String,
    }],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    tags: [{
      type: String,
      trim: true,
    }],
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
)

// 索引
mongooseProductSchema.index({ name: 'text', description: 'text' })
mongooseProductSchema.index({ category: 1 })
mongooseProductSchema.index({ price: 1 })
mongooseProductSchema.index({ isActive: 1 })

export const Product = mongoose.model<IProduct>('Product', mongooseProductSchema)