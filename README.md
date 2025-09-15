# E-commerce AI Assistant

一个基于AI的电商助手项目，包含前端、后端和浏览器插件三个子项目。

## 项目结构

```
e-commerce-ai/
├── frontend/          # Next.js 前端项目
├── backend/           # Express.js 后端项目
├── browser-extension/ # 浏览器插件项目
└── README.md         # 项目说明文档
```

## 子项目说明

### 🖥️ Frontend (前端)
- **技术栈**: Next.js 15, TypeScript, Tailwind CSS
- **状态管理**: Zustand
- **UI组件库**: shadcn/ui
- **端口**: 3000

### 🚀 Backend (后端)
- **技术栈**: Express.js, TypeScript, Node.js
- **端口**: 3001
- **功能**: API服务、数据处理、AI集成

### 🔌 Browser Extension (浏览器插件)
- **技术栈**: Vanilla JavaScript, Chrome Extension API
- **功能**: 页面分析、价格追踪、评论分析
- **支持浏览器**: Chrome, Edge, Firefox

## 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装和运行

1. **克隆项目**
```bash
git clone <repository-url>
cd e-commerce-ai
```

2. **启动前端项目**
```bash
cd frontend
npm install
npm run dev
```

3. **启动后端项目**
```bash
cd backend
npm install
npm run dev
```

4. **安装浏览器插件**
   - 打开Chrome浏览器
   - 进入 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `browser-extension` 文件夹

## 开发指南

### 代理配置
如果需要使用代理加速包管理器，请在终端中设置：
```bash
export https_proxy=http://127.0.0.1:7897
export http_proxy=http://127.0.0.1:7897
export all_proxy=socks5://127.0.0.1:7897
```

### 项目特性
- 🎨 现代化UI设计
- 📱 响应式布局
- 🔒 类型安全 (TypeScript)
- 🚀 高性能优化
- 🔧 开发工具完善

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 创建 Issue
- 发送邮件
- 提交 Pull Request