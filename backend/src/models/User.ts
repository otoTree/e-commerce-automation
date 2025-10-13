import mongoose, { Document, Schema } from 'mongoose'
import { z } from 'zod'

// Zod 验证模式
export const UserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin']).default('user'),
  isActive: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const CreateUserSchema = UserSchema.omit({ createdAt: true, updatedAt: true })
export const UpdateUserSchema = UserSchema.partial().omit({ createdAt: true, updatedAt: true })

export type UserType = z.infer<typeof UserSchema>
export type CreateUserType = z.infer<typeof CreateUserSchema>
export type UpdateUserType = z.infer<typeof UpdateUserSchema>

// Mongoose 接口
export interface IUser extends Document {
  name: string
  email: string
  password: string
  role: 'user' | 'admin'
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mongoose Schema
const mongooseUserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// 索引
mongooseUserSchema.index({ email: 1 })

export const User = mongoose.model<IUser>('User', mongooseUserSchema)