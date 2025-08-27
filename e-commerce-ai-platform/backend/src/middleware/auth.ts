import { Context, Next } from 'hono'
import * as jwt from 'jsonwebtoken'
import { config } from '../lib/config'
import { createAuthError, createForbiddenError } from './error'

// JWT载荷接口
export interface JWTPayload {
  userId: string
  email: string
  role: string
  iat?: number
  exp?: number
}

// 扩展Context类型以包含用户信息
declare module 'hono' {
  interface Context {
    user?: JWTPayload
  }
}

// 认证中间件 - 验证JWT令牌
export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createAuthError('缺少认证令牌')
  }
  
  const token = authHeader.substring(7)
  
  try {
    const decoded = jwt.verify(token, config.jwt.secret as string) as JWTPayload
    
    // 检查令牌类型（确保不是刷新令牌）
    if ('type' in decoded && decoded.type === 'refresh') {
      throw createAuthError('无效的令牌类型')
    }
    
    // 将用户信息添加到上下文
    c.user = decoded
    
    await next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createAuthError('无效的认证令牌')
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw createAuthError('认证令牌已过期')
    }
    throw error
  }
}

// 可选认证中间件 - 如果有令牌则验证，没有则继续
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization')
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret as string) as JWTPayload
      
      // 检查令牌类型
      if (!('type' in decoded) || decoded.type !== 'refresh') {
        c.user = decoded
      }
    } catch (error) {
      // 可选认证失败时不抛出错误，只是不设置用户信息
      console.warn('可选认证失败:', error)
    }
  }
  
  await next()
}

// 角色权限中间件
export const requireRole = (...allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    if (!c.user) {
      throw createAuthError('需要认证')
    }
    
    if (!allowedRoles.includes(c.user.role)) {
      throw createForbiddenError(`需要以下角色之一: ${allowedRoles.join(', ')}`)
    }
    
    await next()
  }
}

// 管理员权限中间件
export const requireAdmin = requireRole('admin')

// 用户权限中间件（用户或管理员）
export const requireUser = requireRole('user', 'admin')

// 资源所有者权限中间件
export const requireOwnerOrAdmin = (getUserIdFromParams: (c: Context) => string) => {
  return async (c: Context, next: Next) => {
    if (!c.user) {
      throw createAuthError('需要认证')
    }
    
    const resourceUserId = getUserIdFromParams(c)
    
    // 管理员可以访问所有资源，用户只能访问自己的资源
    if (c.user.role !== 'admin' && c.user.userId !== resourceUserId) {
      throw createForbiddenError('只能访问自己的资源')
    }
    
    await next()
  }
}

// API密钥认证中间件（用于内部服务调用）
export const apiKeyMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header('X-API-Key')
  
  if (!apiKey) {
    throw createAuthError('缺少API密钥')
  }
  
  // 验证API密钥（实际项目中应该从数据库或配置中获取有效的API密钥）
  const validApiKeys = [
    'internal-api-key-12345',
    'crawler-api-key-67890',
    'publisher-api-key-abcde'
  ]
  
  if (!validApiKeys.includes(apiKey)) {
    throw createAuthError('无效的API密钥')
  }
  
  await next()
}

// 速率限制中间件（简单实现）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return async (c: Context, next: Next) => {
    const clientId = c.user?.userId || c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'anonymous'
    const now = Date.now()
    const windowStart = now - windowMs
    
    // 清理过期的记录
    for (const [key, value] of rateLimitStore.entries()) {
      if (value.resetTime < now) {
        rateLimitStore.delete(key)
      }
    }
    
    const current = rateLimitStore.get(clientId)
    
    if (!current || current.resetTime < now) {
      // 新的时间窗口
      rateLimitStore.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      })
    } else {
      // 在当前时间窗口内
      if (current.count >= maxRequests) {
        const resetIn = Math.ceil((current.resetTime - now) / 1000)
        
        return c.json({
          error: '请求过于频繁',
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            limit: maxRequests,
            window: windowMs / 1000,
            reset_in: resetIn
          },
          timestamp: new Date().toISOString()
        }, 429)
      }
      
      current.count++
    }
    
    // 设置响应头
    const remaining = Math.max(0, maxRequests - (rateLimitStore.get(clientId)?.count || 0))
    const resetTime = rateLimitStore.get(clientId)?.resetTime || now + windowMs
    
    c.res.headers.set('X-RateLimit-Limit', maxRequests.toString())
    c.res.headers.set('X-RateLimit-Remaining', remaining.toString())
    c.res.headers.set('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString())
    
    await next()
  }
}

// CORS中间件
export const corsMiddleware = async (c: Context, next: Next): Promise<Response | void> => {
  // 处理预检请求
  if (c.req.method === 'OPTIONS') {
    c.res.headers.set('Access-Control-Allow-Origin', '*')
    c.res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    c.res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
    c.res.headers.set('Access-Control-Max-Age', '86400')
    return new Response(null, { status: 204 })
  }
  
  // 设置CORS头
  c.res.headers.set('Access-Control-Allow-Origin', '*')
  c.res.headers.set('Access-Control-Allow-Credentials', 'true')
  
  await next()
}

// 安全头中间件
export const securityHeadersMiddleware = async (c: Context, next: Next) => {
  await next()
  
  // 设置安全相关的HTTP头
  c.res.headers.set('X-Content-Type-Options', 'nosniff')
  c.res.headers.set('X-Frame-Options', 'DENY')
  c.res.headers.set('X-XSS-Protection', '1; mode=block')
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  c.res.headers.set('Content-Security-Policy', "default-src 'self'")
}

// 请求日志中间件
export const requestLoggerMiddleware = async (c: Context, next: Next) => {
  const start = Date.now()
  const method = c.req.method
  const url = c.req.url
  const userAgent = c.req.header('User-Agent')
  const ip = c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP') || 'unknown'
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip} - ${userAgent}`)
  
  await next()
  
  const duration = Date.now() - start
  const status = c.res.status
  
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${status} - ${duration}ms`)
}