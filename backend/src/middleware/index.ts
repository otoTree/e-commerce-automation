import express, { type Application } from 'express';
import cors from 'cors';

// CORS配置选项
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // 允许的源列表
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.CORS_ORIGIN
    ].filter(Boolean);
    
    // 允许浏览器插件请求（chrome-extension协议）
    if (!origin || 
        allowedOrigins.includes(origin) || 
        origin.startsWith('chrome-extension://') ||
        origin.startsWith('moz-extension://') ||
        origin.startsWith('safari-extension://')) {
      callback(null, true);
    } else {
      callback(new Error('不被CORS策略允许'), false);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ]
};

// 请求日志中间件
const requestLogger = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.originalUrl;
  const userAgent = req.get('User-Agent') || 'Unknown';
  
  console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);
  
  // 记录响应时间
  const startTime = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${duration}ms`);
  });
  
  next();
};

// 错误处理中间件
const errorHandler = (
  error: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error('❌ 服务器错误:', error);
  
  // 如果响应已经发送，则交给默认错误处理器
  if (res.headersSent) {
    return next(error);
  }
  
  // 根据错误类型返回不同的状态码
  let statusCode = 500;
  let message = '内部服务器错误';
  
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = '请求数据验证失败';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = '无效的数据格式';
  } else if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    statusCode = 503;
    message = '数据库服务暂时不可用';
  } else if (error.message.includes('duplicate key')) {
    statusCode = 409;
    message = '数据已存在';
  }
  
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      details: error.message,
      stack: error.stack
    })
  });
};

// 404处理中间件
const notFoundHandler = (req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    error: '请求的资源不存在',
    path: req.originalUrl,
    method: req.method
  });
};

// 安全头中间件
const securityHeaders = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // 设置安全相关的HTTP头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 在生产环境中启用HSTS
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

// 请求体大小限制中间件
const bodyParserConfig = {
  json: { limit: '10mb' },
  urlencoded: { limit: '10mb', extended: true }
};

// 设置所有中间件
export const setupMiddleware = (app: Application): void => {
  // 安全头
  app.use(securityHeaders);
  
  // CORS
  app.use(cors(corsOptions));
  
  // 请求体解析
  app.use(express.json(bodyParserConfig.json));
  app.use(express.urlencoded(bodyParserConfig.urlencoded));
  
  // 静态文件服务（如果需要）
  app.use(express.static('public'));
  
  // 请求日志
  if (process.env.NODE_ENV !== 'test') {
    app.use(requestLogger);
  }
  
  // 健康检查端点（在所有路由之前）
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      message: 'E-commerce AI Backend is healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0'
    });
  });
};

// 设置错误处理中间件（应该在所有路由之后调用）
export const setupErrorHandling = (app: Application): void => {
  // 404处理
  app.use(notFoundHandler);
  
  // 错误处理
  app.use(errorHandler);
};

// 导出中间件函数
export {
  corsOptions,
  requestLogger,
  errorHandler,
  notFoundHandler,
  securityHeaders,
  bodyParserConfig
};