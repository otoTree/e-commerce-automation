# 页面源码查看器 Chrome 扩展

一个功能强大的Chrome浏览器扩展，用于快速查看、复制和下载当前页面的HTML源码，并支持电商网站商品信息提取。

## 项目结构

```
browser-extension/
├── manifest.json          # 扩展配置文件
├── package.json          # 项目依赖配置
├── package-lock.json     # 依赖锁定文件
├── README.md            # 项目说明文档
├── src/                 # 源代码目录
│   ├── content/         # 内容脚本
│   │   ├── content.js           # 主内容脚本
│   │   └── content_extractor.js # 内容提取器
│   ├── popup/           # 弹窗界面
│   │   ├── popup.html          # 弹窗HTML
│   │   ├── popup.css           # 弹窗样式
│   │   └── popup.js            # 弹窗逻辑
│   └── scripts/         # 工具脚本
│       ├── analyze_structure.js # 结构分析
│       ├── parse_html.js       # HTML解析
│       ├── regex_extract.js    # 正则提取
│       ├── inspect_item.js     # 元素检查
│       └── fix_html.js         # HTML修复
├── assets/              # 资源文件
│   ├── icon.svg                # 扩展图标
│   ├── extraction_rules.json  # 提取规则配置
│   ├── extracted_data.json     # 提取的数据
│   ├── regex_extracted_data.json # 正则提取数据
│   └── popup_test_result.json  # 测试结果
├── docs/                # 文档目录
│   ├── README_extraction.md    # 提取功能说明
│   └── USAGE_GUIDE.md         # 使用指南
└── test/                # 测试文件
    ├── debug_extraction.js     # 调试脚本
    ├── example.html           # 示例HTML
    └── test.html              # 测试页面
```

## 功能特性

- 🔍 **快速获取源码**：一键获取当前页面的完整HTML源码
- 📋 **一键复制**：将源码复制到剪贴板
- 💾 **下载源码**：将源码保存为HTML文件
- 📊 **源码统计**：显示源码字符数和页面信息
- 🛒 **商品提取**：支持1688等电商网站的商品信息提取，包括标题、价格、图片、销量等
- 🎨 **友好界面**：简洁美观的用户界面

## 安装方法

1. 打开Chrome浏览器
2. 进入扩展管理页面 (`chrome://extensions/`)
3. 开启"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本插件的文件夹

## 使用方法

1. 在任意网页上点击浏览器工具栏中的插件图标
2. 点击"获取源码"按钮查看页面源码
3. 点击"提取商品"按钮提取电商网站商品信息
4. 可以使用"复制"按钮复制源码到剪贴板
5. 可以使用"下载"按钮将源码保存为HTML文件

## 开发说明

### 核心文件说明

- `manifest.json`: Chrome扩展的配置文件
- `src/popup/`: 扩展弹窗的前端界面
- `src/content/`: 注入到网页中的内容脚本
- `assets/extraction_rules.json`: 商品提取规则配置

### 添加新的提取规则

在 `assets/extraction_rules.json` 中添加新的网站提取规则：

```json
{
  "sites": {
    "example.com": {
      "selectors": {
        "title": ".product-title",
        "price": ".price",
        "image": ".product-image img"
      }
    }
  }
}
```

## 权限说明

- `activeTab`: 访问当前活动标签页
- `scripting`: 向页面注入脚本

## 许可证

MIT License