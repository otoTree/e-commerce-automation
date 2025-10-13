# E-commerce AI Assistant

一个基于AI的电商购物助手项目，包含前端、后端和浏览器插件三个部分。

## 项目架构

```
e-commerce-ai/
├── frontend/          # Next.js 前端应用
├── backend/           # Express 后端API
├── browser-extension/ # 浏览器插件
└── docs/             # 项目文档
```

## 技术栈

### 前端 (Next.js)
- **框架**: Next.js 15 + TypeScript
- **UI组件**: shadcn/ui + Tailwind CSS
- **状态管理**: Zustand
- **开发工具**: ESLint + Prettier

### 后端 (Express)
- **框架**: Express + TypeScript
- **数据验证**: Zod
- **数据库**: MongoDB + Mongoose
- **安全**: Helmet + CORS
- **日志**: Morgan

### 浏览器插件
- **架构**: Manifest V3
- **功能**: 页面分析、价格比较、评价摘要
- **UI**: 原生HTML/CSS/JavaScript

## 快速开始

### 环境要求
- Node.js >= 18
- MongoDB
- 现代浏览器 (Chrome/Edge/Firefox)

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 配置环境变量

```bash
# 后端环境配置
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等
```

### 启动开发服务器

```bash
# 启动后端服务 (端口 3001)
cd backend
npm run dev

# 启动前端服务 (端口 3000)
cd ../frontend
npm run dev
```

### 安装浏览器插件

1. 打开浏览器扩展管理页面
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `browser-extension` 目录

## 功能特性

### 🛍️ 智能购物分析
- 自动识别电商网站和商品页面
- 提取商品信息（标题、价格、图片等）
- AI驱动的商品分析和建议

### 💰 价格比较
- 跨平台价格对比
- 历史价格趋势
- 最佳购买时机提醒

### ⭐ 评价智能摘要
- 自动分析用户评价
- 情感分析和关键词提取
- 优缺点总结

### 🤖 AI助手界面
- 浮动助手按钮
- 快捷操作面板
- 实时分析结果展示

## 开发指南

### 代码规范
- 使用函数式编程风格
- 优先使用箭头函数
- 数据模型和业务逻辑分离
- 避免使用class，采用DDD架构
- 前端组件化开发

### 项目结构

#### 前端结构
```
frontend/src/
├── app/           # Next.js App Router
├── components/    # UI组件
├── store/         # Zustand状态管理
└── lib/           # 工具函数
```

#### 后端结构
```
backend/src/
├── app.ts         # Express应用配置
├── server.ts      # 服务器启动文件
├── models/        # 数据模型
├── routes/        # API路由
└── utils/         # 工具函数
```

#### 插件结构
```
browser-extension/src/
├── popup/         # 弹窗界面
├── content/       # 内容脚本
└── background/    # 后台脚本
```

## API文档

### 基础接口
- `GET /` - 服务状态
- `GET /health` - 健康检查

### 商品分析接口
- `POST /api/analyze` - 分析商品信息
- `POST /api/price-compare` - 价格比较
- `POST /api/reviews-summary` - 评价摘要

## 部署

### 前端部署
```bash
cd frontend
npm run build
npm start
```

### 后端部署
```bash
cd backend
npm run build
npm start
```

### 插件打包
浏览器插件无需构建，直接使用源码目录即可。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 Issue
- 发送邮件
- 参与讨论

---

**注意**: 本项目仅供学习和研究使用，请遵守相关网站的使用条款和robots.txt规则。