import { Router } from 'express';
import type { Request, Response } from 'express';
import { authenticateToken } from './auth.js';

const router = Router();

// 所有用户路由都需要认证
router.use(authenticateToken);

// 获取当前用户信息
router.get('/me', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // TODO: 从数据库获取完整用户信息
    // - 查询用户详细信息
    // - 包含用户偏好设置
    // - 返回完整用户档案
    
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: {
          language: 'zh-CN',
          timezone: 'Asia/Shanghai',
          notification_settings: {
            email_notifications: true,
            push_notifications: false
          },
          dashboard_layout: {
            widgets: ['stats', 'recent_products', 'tasks'],
            theme: 'light'
          }
        },
        created_at: '2024-01-01T00:00:00Z',
        last_login: new Date().toISOString(),
        is_active: true
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取用户信息失败'
      }
    });
  }
});

// 更新用户信息
router.put('/me', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { username, preferences } = req.body;
    
    // TODO: 实现用户信息更新逻辑
    // - 验证更新数据
    // - 更新用户记录
    // - 返回更新后的用户信息
    
    res.json({
      success: true,
      data: {
        id: user.id,
        username: username || user.username,
        email: user.email,
        role: user.role,
        preferences: preferences || {
          language: 'zh-CN',
          timezone: 'Asia/Shanghai',
          notification_settings: {
            email_notifications: true,
            push_notifications: false
          }
        },
        updated_at: new Date().toISOString()
      },
      message: '用户信息更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '更新用户信息失败'
      }
    });
  }
});

// 修改密码
router.put('/me/password', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '当前密码和新密码都是必需的'
        }
      });
    }
    
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '新密码长度至少为6位'
        }
      });
    }
    
    // TODO: 实现密码修改逻辑
    // - 验证当前密码
    // - 哈希新密码
    // - 更新用户密码
    // - 可选：使所有现有token失效
    
    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '修改密码失败'
      }
    });
  }
});

// 获取用户列表 (仅管理员)
router.get('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '权限不足'
        }
      });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string;
    const role = req.query.role as string;
    
    // TODO: 实现用户列表查询逻辑
    // - 分页查询用户
    // - 支持搜索和筛选
    // - 返回用户列表和分页信息
    
    res.json({
      success: true,
      data: {
        users: [
          {
            id: 'user1',
            username: 'admin',
            email: 'admin@example.com',
            role: 'admin',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            last_login: '2024-01-15T10:30:00Z'
          },
          {
            id: 'user2',
            username: 'operator1',
            email: 'operator1@example.com',
            role: 'operator',
            is_active: true,
            created_at: '2024-01-02T00:00:00Z',
            last_login: '2024-01-15T09:15:00Z'
          }
        ]
      },
      meta: {
        pagination: {
          page,
          limit,
          total: 2,
          total_pages: 1,
          has_next: false,
          has_prev: false
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '获取用户列表失败'
      }
    });
  }
});

// 创建用户 (仅管理员)
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '权限不足'
        }
      });
    }
    
    const { username, email, password, role } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '用户名、邮箱和密码都是必需的'
        }
      });
    }
    
    // TODO: 实现用户创建逻辑
    // - 验证用户数据
    // - 检查用户是否已存在
    // - 创建新用户
    // - 发送欢迎邮件
    
    res.status(201).json({
      success: true,
      data: {
        id: 'new_user_id',
        username,
        email,
        role: role || 'operator',
        is_active: true,
        created_at: new Date().toISOString()
      },
      message: '用户创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '创建用户失败'
      }
    });
  }
});

// 更新用户 (仅管理员)
router.put('/:userId', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '权限不足'
        }
      });
    }
    
    const { username, email, role, is_active } = req.body;
    
    // TODO: 实现用户更新逻辑
    // - 验证用户ID
    // - 更新用户信息
    // - 处理角色变更
    // - 处理账户激活/停用
    
    res.json({
      success: true,
      data: {
        id: userId,
        username,
        email,
        role,
        is_active,
        updated_at: new Date().toISOString()
      },
      message: '用户信息更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '更新用户失败'
      }
    });
  }
});

// 删除用户 (仅管理员)
router.delete('/:userId', async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { userId } = req.params;
    
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: '权限不足'
        }
      });
    }
    
    if (userId === user.id) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_OPERATION',
          message: '不能删除自己的账户'
        }
      });
    }
    
    // TODO: 实现用户删除逻辑
    // - 验证用户ID
    // - 软删除或硬删除用户
    // - 处理相关数据清理
    // - 记录审计日志
    
    res.json({
      success: true,
      message: '用户删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: '删除用户失败'
      }
    });
  }
});

export default router;