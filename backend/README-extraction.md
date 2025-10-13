# 1688商品数据提取方法

这是一个完整的1688商品数据提取解决方案，提供从HTML页面或JavaScript对象中提取、验证和处理商品数据的功能。

## 📁 项目结构

```
backend/
├── src/
│   ├── models/
│   │   ├── product-data-analysis.ts    # 数据结构定义
│   │   └── product-extractor.ts        # 核心提取器
│   ├── utils/
│   │   └── parser-utils.ts            # 解析工具函数
│   └── schemas/
│       └── product-schema.ts          # Zod验证模式
├── examples/
│   └── product-extraction-examples.ts # 使用示例
└── README-extraction.md              # 本文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install zod
```

### 2. 基本使用

```typescript
import { 
  extractProductDataFromHTML, 
  extractProductDataFromContext 
} from './src/models/product-extractor';

// 从HTML字符串提取数据
const htmlContent = '...'; // 1688商品页面HTML
const productData = extractProductDataFromHTML(htmlContent);

// 从window.context对象提取数据
const context = window.context; // 浏览器环境中的context对象
const productData2 = extractProductDataFromContext(context);
```

## 📊 数据结构

### 提取的商品数据结构

```typescript
interface ExtractedProductData {
  // 基本信息
  productId: string;           // 商品ID
  title: string;               // 商品标题
  seller: string;              // 卖家信息
  
  // SKU变体信息
  variants: ProductVariant[];  // 商品变体数组
  
  // 价格信息
  price?: string;              // 价格（可选）
  
  // 物流信息
  shipping: {
    location: string;          // 发货地点
    targetLocation: string;    // 目标地点
    cost: number;             // 运费
    deliveryPromise: string;   // 发货承诺
    freeShipping: boolean;     // 是否包邮
  };
  
  // 服务保障
  protections: ServiceProtection[];
  
  // 商品详情
  description?: {
    detailUrl?: string;        // 详情页URL
    images?: string[];         // 商品图片
  };
  
  // 元数据
  metadata: {
    extractedAt: Date;         // 提取时间
    source: 'html' | 'context'; // 数据源
    offerId: number;           // Offer ID
  };
}
```

### 商品变体结构

```typescript
interface ProductVariant {
  skuId: number;               // SKU ID
  color: string;               // 颜色
  type: 'with_backrest' | 'without_backrest'; // 类型
  weight: number;              // 重量（克）
  fullName: string;            // 完整名称
}
```

## 🔧 核心功能

### 1. 数据提取器 (`product-extractor.ts`)

#### 主要函数

- `extractProductDataFromHTML(html: string)` - 从HTML字符串提取数据
- `extractProductDataFromContext(context: ProductContext)` - 从Context对象提取数据
- `extractFromCurrentPage()` - 在浏览器环境中从当前页面提取数据
- `createAutoExtractor(callback, options)` - 创建自动提取器

#### 验证和清理

- `validateExtractedData(data)` - 验证提取的数据
- `cleanExtractedData(data)` - 清理和标准化数据

#### 工具函数

- `formatWeight(weightInGrams)` - 格式化重量显示
- `formatPrice(price)` - 格式化价格显示
- `groupVariantsByColor(variants)` - 按颜色分组变体
- `groupVariantsByType(variants)` - 按类型分组变体

### 2. 解析工具 (`parser-utils.ts`)

#### HTML解析

- `extractJSVariable(html, variableName)` - 提取JavaScript变量
- `extractScriptContents(html)` - 提取script标签内容
- `extractMetaTags(html)` - 提取meta标签信息

#### 字符串处理

- `cleanString(str)` - 清理和标准化字符串
- `extractNumbers(str)` - 从字符串中提取数字
- `extractPrice(str)` - 从字符串中提取价格
- `extractWeight(str)` - 从字符串中提取重量
- `extractColorFromSku(skuName)` - 从SKU名称中提取颜色

#### 数据转换

- `safeJsonParse(jsonString)` - 安全的JSON解析
- `deepMerge(target, source)` - 深度合并对象
- `uniqueArray(array)` - 数组去重
- `groupBy(array, keyFn)` - 按属性分组数组

### 3. 数据验证 (`product-schema.ts`)

#### Zod验证模式

- `ExtractedProductDataSchema` - 完整商品数据验证
- `ProductVariantSchema` - 商品变体验证
- `ServiceProtectionSchema` - 服务保障验证
- `ShippingInfoSchema` - 物流信息验证

#### 验证函数

- `validateExtractedData(data)` - 验证提取的数据
- `transformProductData(data)` - 转换和清理数据
- `checkDataCompleteness(data)` - 检查数据完整性
- `validateWithFriendlyError(schema, data)` - 友好错误信息验证

## 💡 使用示例

### 示例1: 基本数据提取

```typescript
import { extractProductDataFromHTML } from './src/models/product-extractor';

const htmlContent = `...`; // 1688商品页面HTML
const productData = extractProductDataFromHTML(htmlContent);

if (productData) {
  console.log('商品标题:', productData.title);
  console.log('变体数量:', productData.variants.length);
  console.log('发货地:', productData.shipping.location);
}
```

### 示例2: 数据验证

```typescript
import { validateExtractedData } from './src/schemas/product-schema';

const result = validateExtractedData(productData);
if (result.success) {
  console.log('✅ 数据验证通过');
  console.log('验证后的数据:', result.data);
} else {
  console.log('❌ 数据验证失败:', result.error);
}
```

### 示例3: 浏览器环境自动提取

```typescript
import { createAutoExtractor } from './src/models/product-extractor';

// 创建自动提取器，每5秒检查一次页面数据
const stopExtractor = createAutoExtractor((data) => {
  if (data) {
    console.log('自动提取到商品:', data.title);
    // 发送到后端或更新UI
  }
}, { interval: 5000, immediate: true });

// 停止自动提取
// stopExtractor();
```

### 示例4: 批量处理

```typescript
import { extractProductDataFromHTML, validateExtractedData } from './src/models/product-extractor';

const htmlFiles = ['file1.html', 'file2.html', 'file3.html'];
const results = [];

for (const html of htmlFiles) {
  const data = extractProductDataFromHTML(html);
  if (data && validateExtractedData(data)) {
    results.push(data);
  }
}

console.log(`成功处理 ${results.length} 个商品`);
```

## 🔍 数据完整性检查

```typescript
import { checkDataCompleteness } from './src/schemas/product-schema';

const completeness = checkDataCompleteness(productData);
console.log(`数据完整性: ${completeness.score}%`);
console.log('缺失字段:', completeness.missing);
```

## 🎯 错误处理

```typescript
import { validateWithFriendlyError, ExtractedProductDataSchema } from './src/schemas/product-schema';

const result = validateWithFriendlyError(ExtractedProductDataSchema, data);
if (!result.success) {
  console.log('友好错误信息:');
  console.log(result.error);
}
```

## 🚀 性能优化建议

1. **缓存提取结果**: 对于相同的HTML内容，缓存提取结果避免重复处理
2. **批量验证**: 使用批量验证减少单个验证的开销
3. **按需提取**: 根据需要只提取必要的字段
4. **异步处理**: 对于大量数据，使用异步处理避免阻塞

## 🔧 自定义配置

### 扩展颜色映射

```typescript
// 在 parser-utils.ts 中扩展颜色映射
const customColorMap = {
  '红': 'red',
  '蓝': 'blue',
  '绿': 'green',
  // 添加更多颜色映射
};
```

### 自定义验证规则

```typescript
import { z } from 'zod';

// 创建自定义验证模式
const CustomProductSchema = z.object({
  productId: z.string().min(10), // 更严格的ID验证
  title: z.string().min(5).max(100), // 自定义标题长度
  // 其他自定义规则...
});
```

## 🐛 常见问题

### Q: 提取失败怎么办？

A: 检查以下几点：
1. HTML内容是否包含`window.context`数据
2. 数据结构是否发生变化
3. 使用`validateExtractedData`检查数据完整性

### Q: 如何处理新的商品类型？

A: 在`ProductTypeSchema`中添加新的枚举值，并更新相关的处理逻辑。

### Q: 如何提高提取准确性？

A: 
1. 更新正则表达式匹配规则
2. 增加数据验证规则
3. 添加更多的错误处理逻辑

## 📝 开发指南

### 添加新的提取字段

1. 在`ExtractedProductData`接口中添加新字段
2. 在提取函数中添加相应的提取逻辑
3. 在Zod模式中添加验证规则
4. 更新测试用例

### 扩展解析工具

1. 在`parser-utils.ts`中添加新的工具函数
2. 编写单元测试
3. 在示例中展示用法

## 🧪 测试

运行示例测试：

```bash
# 编译TypeScript
npx tsc

# 运行示例
node examples/product-extraction-examples.js
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

---

**注意**: 这个提取器是基于当前1688页面结构设计的。如果1688更新了页面结构，可能需要相应地更新提取逻辑。