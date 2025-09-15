# 电商页面内容提取系统

本系统基于对阿里巴巴页面的分析，提供了一套完整的内容提取规则和实现方案。

## 文件说明

### 1. `extraction_rules.json`
包含完整的页面分析结果和提取规则配置：
- **页面信息**: 页面类型、主要功能、技术栈分析
- **结构分析**: 页面布局、主要组件、CSS框架
- **提取规则**: 商品列表、分页、元数据的具体选择器
- **JavaScript变量**: 页面中可能包含数据的全局变量
- **数据属性**: HTML元素的data-*属性映射
- **验证规则**: 数据完整性检查规则

### 2. `content_extractor.js`
完整的内容提取器实现：
- **ContentExtractor类**: 主要的提取逻辑
- **多重备用策略**: 当主选择器失败时的备用方案
- **数据验证**: 确保提取数据的完整性
- **错误处理**: 优雅处理各种异常情况

## 使用方法

### 在浏览器扩展中使用

1. **更新manifest.json**，确保包含必要的权限：
```json
{
  "permissions": [
    "activeTab",
    "storage"
  ],
  "web_accessible_resources": [
    {
      "resources": ["extraction_rules.json"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

2. **在content script中引入**：
```javascript
// content.js
// 注入提取器脚本
const script = document.createElement('script');
script.src = chrome.runtime.getURL('content_extractor.js');
document.head.appendChild(script);
```

3. **监听提取结果**：
```javascript
// background.js 或 popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'contentExtracted') {
    console.log('提取的数据:', message.data);
    // 处理提取的数据
  }
});
```

### 直接在页面中使用

```javascript
// 直接在控制台或页面脚本中使用
fetch('./extraction_rules.json')
  .then(response => response.json())
  .then(rules => {
    const extractor = new ContentExtractor(rules);
    return extractor.extract();
  })
  .then(data => {
    console.log('提取结果:', data);
  });
```

## 提取规则说明

### 商品信息提取
系统会尝试提取以下商品信息：
- **标题**: 商品名称
- **价格**: 商品价格（支持多种格式）
- **图片**: 商品主图URL
- **链接**: 商品详情页链接
- **供应商**: 供应商名称
- **最小订购量**: MOQ信息
- **销量**: 年销量信息（如：1294127件（268笔））
- **评分**: 商品评分

### 选择器策略
1. **主选择器**: 基于页面分析的最优选择器
2. **备用选择器**: 当主选择器失败时的备选方案
3. **通用选择器**: 适用于多种页面结构的通用规则
4. **数据属性**: 基于HTML data-*属性的提取

### 数据验证
- **必填字段检查**: 确保关键信息不为空
- **格式验证**: 验证价格、链接等字段格式
- **重复数据过滤**: 避免重复商品

## 扩展和自定义

### 添加新的提取规则
在`extraction_rules.json`中添加新的选择器：

```json
{
  "extraction_rules": {
    "product_list": {
      "fields": {
        "new_field": {
          "selector": ".new-field-selector",
          "attribute": "text",
          "fallback_selectors": [".fallback-selector"]
        }
      }
    }
  }
}
```

### 自定义验证规则
```json
{
  "validation_rules": {
    "required_fields": ["title", "price", "new_field"],
    "format_validation": {
      "new_field": "^[A-Za-z0-9]+$"
    }
  }
}
```

### 处理特殊页面
对于特殊的页面结构，可以：
1. 创建专门的提取规则文件
2. 在ContentExtractor中添加页面检测逻辑
3. 实现特定的提取方法

## 性能优化建议

1. **延迟加载**: 等待页面完全加载后再执行提取
2. **批量处理**: 一次性处理多个商品元素
3. **缓存选择器**: 避免重复查询相同元素
4. **异步处理**: 使用异步方法避免阻塞页面

## 错误处理

系统包含完善的错误处理机制：
- **选择器错误**: 自动尝试备用选择器
- **数据格式错误**: 提供默认值或跳过
- **网络错误**: 重试机制
- **权限错误**: 优雅降级

## 调试技巧

1. **开启控制台日志**: 查看详细的提取过程
2. **检查选择器**: 在控制台测试选择器有效性
3. **验证数据**: 检查提取的数据格式和完整性
4. **性能监控**: 监控提取耗时和成功率

## 注意事项

1. **页面结构变化**: 电商网站可能会更新页面结构，需要定期更新规则
2. **反爬虫机制**: 注意遵守网站的robots.txt和使用条款
3. **数据隐私**: 确保不提取敏感用户信息
4. **性能影响**: 避免过度频繁的提取操作

## 更新日志

- **v1.0.0**: 初始版本，支持阿里巴巴页面基本信息提取
- 后续版本将支持更多电商平台和高级功能