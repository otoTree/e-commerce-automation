# 浏览器扩展启动问题修复

## 问题描述

原始代码中存在以下问题，导致浏览器启动时插件无法成功启动：

1. **错误使用 `chrome.runtime.onStartup` 事件**：此事件仅在Chrome浏览器启动时触发，而不是扩展启动时
2. **构造函数中直接调用异步初始化**：可能导致重复初始化和竞态条件
3. **缺乏Service Worker重启后的恢复机制**：Manifest V3中Service Worker会被频繁启动/停止

## 修复方案

### 1. 移除构造函数中的自动初始化
```javascript
// 修改前
constructor() {
    // ...
    this.init(); // ❌ 直接调用可能导致问题
}

// 修改后
constructor() {
    // ...
    this.isInitializing = false; // ✅ 添加状态标志
    // 不在构造函数中直接调用init()
}
```

### 2. 改进初始化逻辑
```javascript
async init() {
    // ✅ 防止重复初始化
    if (this.isInitializing || this.isRegistered) {
        return;
    }
    
    this.isInitializing = true;
    try {
        // 初始化逻辑...
    } finally {
        this.isInitializing = false;
    }
}
```

### 3. 添加自执行初始化函数
```javascript
// ✅ 确保Service Worker启动时扩展能正确初始化
(async function initializeExtension() {
    try {
        if (extensionManager && !extensionManager.isRegistered) {
            await extensionManager.init();
        } else if (extensionManager && extensionManager.isRegistered) {
            // Service Worker重启后恢复心跳和任务轮询
            extensionManager.startHeartbeat();
            extensionManager.startTaskPolling();
        }
    } catch (error) {
        console.error('扩展初始化失败:', error);
    }
})();
```

### 4. 修正事件监听器用途
```javascript
// ✅ 明确chrome.runtime.onStartup的作用
chrome.runtime.onStartup.addListener(() => {
    console.log('浏览器启动，扩展重新初始化');
    // 仅在浏览器启动时打开1688网页，不进行扩展初始化
    openTaobaoPage();
});
```

## 测试方法

### 1. 开发者工具测试
1. 打开 `chrome://extensions/`
2. 启用"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `browser-extension` 文件夹
5. 点击扩展的"背景页面"链接
6. 查看Console中的日志输出

### 2. 使用测试页面
1. 在浏览器中打开 `test_startup.html`
2. 点击"刷新状态"按钮检查扩展状态
3. 点击"测试通信"按钮验证扩展通信

### 3. 预期的日志输出
正常启动时应该看到以下日志：
```
后台脚本已加载，开始初始化
扩展管理器未注册，开始初始化...
生成新的扩展ID: ext_1234567890_abcdefghi
扩展注册成功: Extension registered successfully
心跳检测已启动，间隔: 30000ms
任务轮询已启动，间隔: 10000ms
扩展管理器初始化完成，扩展ID: ext_1234567890_abcdefghi
后台脚本已加载
```

## 验证修复效果

### 场景1：首次安装扩展
- ✅ 扩展应该自动初始化
- ✅ 自动打开1688网页
- ✅ 开始心跳检测和任务轮询

### 场景2：浏览器重启
- ✅ 扩展应该重新初始化
- ✅ 自动打开1688网页
- ✅ 恢复心跳检测和任务轮询

### 场景3：Service Worker重启
- ✅ 扩展应该检测到已注册状态
- ✅ 重新启动心跳检测和任务轮询
- ✅ 不会重复注册

## 注意事项

1. **后端服务**：确保后端服务 `http://localhost:3001` 正在运行，否则注册会失败
2. **权限**：确保manifest.json中包含必要的权限
3. **调试**：使用Chrome开发者工具的Console查看详细日志
4. **Service Worker生命周期**：在Manifest V3中，Service Worker可能会被频繁启动/停止，这是正常行为

## 相关文件

- `src/background/background.js` - 主要修复文件
- `test_startup.html` - 测试页面
- `manifest.json` - 扩展配置文件