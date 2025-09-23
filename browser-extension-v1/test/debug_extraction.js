// 详细调试提取过程
const fs = require('fs');
const { JSDOM } = require('jsdom');

// 读取HTML和规则文件
const htmlContent = fs.readFileSync('./example.html', 'utf8');
const rules = JSON.parse(fs.readFileSync('../assets/extraction_rules.json', 'utf8'));

// 创建DOM环境
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

console.log('=== 调试商品提取 ===');

console.log('规则结构:', Object.keys(rules));
console.log('extraction_rules存在:', !!rules.extraction_rules);
console.log('product_list存在:', !!rules.extraction_rules?.product_list);

if (!rules.extraction_rules?.product_list) {
    console.log('错误: 未找到product_list配置');
    console.log('extraction_rules内容:', Object.keys(rules.extraction_rules || {}));
    process.exit(1);
}

const productListRules = rules.extraction_rules.product_list;

// 查找容器
const container = document.querySelector(productListRules.container_selector);
console.log('容器选择器:', productListRules.container_selector);
console.log('找到容器:', !!container);

if (container) {
    // 查找商品项
    const items = container.querySelectorAll(productListRules.item_selector);
    console.log('商品项选择器:', productListRules.item_selector);
    console.log('找到商品项数量:', items.length);
    
    if (items.length > 0) {
        const firstItem = items[0];
        console.log('\n=== 分析第一个商品项 ===');
        console.log('商品项标签:', firstItem.tagName);
        console.log('商品项类名:', firstItem.className);
        
        // 测试每个字段
        const fields = productListRules.fields;
        
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            console.log(`\n--- 测试字段: ${fieldName} ---`);
            console.log('主选择器:', field.selector);
            
            // 测试主选择器
            let element = firstItem.querySelector(field.selector);
            if (element) {
                const value = field.attribute === 'text' ? element.textContent.trim() : element.getAttribute(field.attribute);
                console.log('✓ 主选择器成功:', value.substring(0, 100));
            } else {
                console.log('✗ 主选择器失败');
                
                // 测试备用选择器
                if (field.fallback_selectors) {
                    for (let i = 0; i < field.fallback_selectors.length; i++) {
                        const fallbackSelector = field.fallback_selectors[i];
                        element = firstItem.querySelector(fallbackSelector);
                        if (element) {
                            const value = field.attribute === 'text' ? element.textContent.trim() : element.getAttribute(field.attribute);
                            console.log(`✓ 备用选择器 "${fallbackSelector}" 成功:`, value.substring(0, 100));
                            break;
                        } else {
                            console.log(`✗ 备用选择器 "${fallbackSelector}" 失败`);
                        }
                    }
                }
            }
        });
        
        // 查找所有可能的标题元素
        console.log('\n=== 查找所有可能的标题元素 ===');
        const titleCandidates = firstItem.querySelectorAll('*');
        let titleFound = false;
        for (let i = 0; i < Math.min(titleCandidates.length, 20); i++) {
            const el = titleCandidates[i];
            const text = el.textContent.trim();
            if (text && text.length > 10 && text.length < 200 && !text.includes('¥') && !text.includes('件')) {
                console.log(`可能的标题 [${el.tagName}.${el.className}]: "${text.substring(0, 80)}"`);
                titleFound = true;
            }
        }
        if (!titleFound) {
            console.log('未找到明显的标题元素');
        }
        
        // 查找所有可能的价格元素
        console.log('\n=== 查找所有可能的价格元素 ===');
        const priceElements = firstItem.querySelectorAll('*');
        let priceFound = false;
        for (let i = 0; i < priceElements.length; i++) {
            const el = priceElements[i];
            const text = el.textContent.trim();
            if (text && (text.includes('¥') || /^\d+\.\d+$/.test(text))) {
                console.log(`可能的价格 [${el.tagName}.${el.className}]: "${text}"`);
                priceFound = true;
            }
        }
        if (!priceFound) {
            console.log('未找到明显的价格元素');
        }
    }
}