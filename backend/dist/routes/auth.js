import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = Router();
// 用户注册接口
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, phone } = req.body;
        // 验证必填字段
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: '用户名、邮箱和密码为必填字段'
            });
        }
        // 验证邮箱格式
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: '请输入有效的邮箱地址'
            });
        }
        // 验证密码强度
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: '密码至少需要6个字符'
            });
        }
        // 检查用户名是否已存在
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(409).json({
                success: false,
                error: '用户名已存在'
            });
        }
        // 检查邮箱是否已存在
        const existingUserByEmail = await User.findOne({ email });
        if (existingUserByEmail) {
            return res.status(409).json({
                success: false,
                error: '邮箱已被注册'
            });
        }
        // 加密密码
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // 创建新用户
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            firstName: firstName || '',
            lastName: lastName || '',
            phone: phone || '',
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newUser.save();
        // 返回成功响应（不包含密码）
        const userResponse = {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt
        };
        res.status(201).json({
            success: true,
            message: '用户注册成功',
            data: {
                user: userResponse
            }
        });
    }
    catch (error) {
        console.error('用户注册错误:', error);
        res.status(500).json({
            success: false,
            error: '注册过程中发生错误，请稍后重试'
        });
    }
});
// 用户登录接口
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // 验证必填字段
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: '用户名和密码为必填字段'
            });
        }
        // 查找用户（支持用户名或邮箱登录）
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '用户名或密码错误'
            });
        }
        // 检查用户是否激活
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                error: '账户已被禁用，请联系管理员'
            });
        }
        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: '用户名或密码错误'
            });
        }
        // 生成JWT token
        const jwtSecret = process.env.JWT_SECRET || 'your-default-secret-key';
        const token = jwt.sign({
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }, jwtSecret, { expiresIn: '24h' });
        // 更新最后登录时间
        user.lastLoginAt = new Date();
        await user.save();
        // 返回成功响应
        const userResponse = {
            id: user._id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            createdAt: user.createdAt,
            lastLoginAt: user.lastLoginAt
        };
        res.json({
            success: true,
            message: '登录成功',
            data: {
                token,
                user: userResponse,
                expiresIn: 24 * 60 * 60 // 24小时，以秒为单位
            }
        });
    }
    catch (error) {
        console.error('用户登录错误:', error);
        res.status(500).json({
            success: false,
            error: '登录过程中发生错误，请稍后重试'
        });
    }
});
// 获取用户信息接口（需要认证）
router.get('/profile', async (req, res) => {
    try {
        // 这里需要添加JWT验证中间件
        // 暂时返回未实现的响应
        res.status(501).json({
            success: false,
            error: '功能暂未实现'
        });
    }
    catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({
            success: false,
            error: '获取用户信息失败'
        });
    }
});
export default router;
//# sourceMappingURL=auth.js.map