# 浏览器扩展使用指南

## 问题修复说明

### 修复的问题
之前的商品提取功能没有使用获取的页面源码，而是直接在当前页面DOM上执行提取，导致提取失败。

### 修复内容
1. **源码传递**: 修改了 `extractProducts` 函数，确保使用之前通过 `getPageSource` 获取的页面源码
2. **DOM解析**: 使用 `DOMParser` 解析HTML源码字符串，而不是直接操作页面DOM
3. **错误处理**: 添加了源码检查，如果没有先获取源码会提示用户
4. **状态显示**: 在提取结果中显示源码长度，确认使用了正确的源码

## 正确使用步骤

### 1. 获取页面源码
- 打开要提取商品的页面（如1688.com搜索结果页）
- 点击扩展图标打开弹窗
- 点击 **"获取源码"** 按钮
- 等待源码获取完成，会显示源码长度

### 2. 提取商品信息
- 确保已成功获取源码
- 点击 **"提取商品"** 按钮
- 系统会使用获取的源码进行商品信息提取
- 提取结果会显示找到的商品数量和源码长度

### 3. 查看结果
- 提取成功后会显示商品列表
- 每个商品包含：标题、价格、供应商、起订量等信息
- 可以点击商品链接查看详情

## 技术改进

### 修改前的问题
```javascript
// 错误：直接在页面DOM上执行
const items = document.querySelectorAll(selector);
```

### 修改后的解决方案
```javascript
// 正确：使用传入的HTML源码
class SimpleExtractor {
  constructor(rules, htmlSource) {
    this.parser = new DOMParser();
    this.doc = this.parser.parseFromString(htmlSource, 'text/html');
  }
  
  extract() {
    // 使用解析后的文档进行查询
    const items = this.doc.querySelectorAll(selector);
  }
}
```

## 测试方法

1. 使用提供的 `test.html` 文件进行测试
2. 在浏览器中打开 `test.html`
3. 按照上述步骤操作，应该能成功提取到3个测试商品

## 支持的网站

- 1688.com (阿里巴巴)
- 其他使用类似HTML结构的B2B网站
- 可通过修改 `extraction_rules.json` 支持更多网站

## 故障排除

### 如果提取失败
1. 确保先点击"获取源码"按钮
2. 检查页面是否包含商品信息
3. 查看浏览器控制台是否有错误信息
4. 尝试刷新页面后重新操作

### 如果提取结果为空
1. 检查网站的HTML结构是否发生变化
2. 可能需要更新 `extraction_rules.json` 中的选择器
3. 确认页面已完全加载

## 开发者信息

- 修复时间: 2024-12-30
- 主要改进: 源码传递和DOM解析
- 测试状态: 已通过基本功能测试