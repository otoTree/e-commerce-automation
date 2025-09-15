const fs = require('fs');
const { JSDOM } = require('jsdom');

// 读取HTML文件
const html = fs.readFileSync('example.html', 'utf8');

console.log('HTML文件长度:', html.length);

// 创建DOM环境，使用更简单的配置
const dom = new JSDOM(`<!DOCTYPE html><html><body>${html}</body></html>`, {
    contentType: 'text/html'
});
const document = dom.window.document;

console.log('DOM解析后的body子元素数量:', document.body.children.length);

// 查找商品容器
const container = document.querySelector('.feeds-wrapper');
console.log('\n=== 查找商品容器 ===');
console.log('找到容器:', !!container);

if (container) {
    console.log('容器子元素数量:', container.children.length);
    
    // 查找商品项
    const items = container.querySelectorAll('a.search-offer-wrapper');
    console.log('找到商品项数量:', items.length);
    
    if (items.length > 0) {
        console.log('\n=== 分析第一个商品项 ===');
        const firstItem = items[0];
        
        console.log('商品项标签名:', firstItem.tagName);
        console.log('商品项类名:', firstItem.className);
        console.log('商品项子元素数量:', firstItem.children.length);
        console.log('商品项innerHTML长度:', firstItem.innerHTML.length);
        
        if (firstItem.innerHTML.length > 0) {
            console.log('\n=== 提取商品数据 ===');
            
            // 提取标题 - 尝试多个选择器
            let title = null;
            const titleSelectors = [
                '.offer-title-row .title-text div',
                '.title-text div',
                '.offer-title-row .title-text',
                '.title-text'
            ];
            
            for (const selector of titleSelectors) {
                const element = firstItem.querySelector(selector);
                if (element && element.textContent.trim()) {
                    title = element.textContent.trim();
                    console.log(`标题 (${selector}):`, title);
                    break;
                }
            }
            
            // 提取价格 - 尝试多个选择器
            let price = null;
            const priceSelectors = [
                '.offer-price-row .price-item .text-main',
                '.price-item .text-main',
                '.text-main',
                '.hover-price-item .text-main'
            ];
            
            for (const selector of priceSelectors) {
                const element = firstItem.querySelector(selector);
                if (element && element.textContent.trim()) {
                    price = element.textContent.trim();
                    console.log(`价格 (${selector}):`, price);
                    break;
                }
            }
            
            // 提取图片
            const imgElement = firstItem.querySelector('img.main-img');
            const image = imgElement ? imgElement.src : null;
            console.log('图片:', image);
            
            // 提取链接
            const link = firstItem.href || firstItem.getAttribute('href');
            console.log('链接:', link);
            
            // 提取供应商
            let supplier = null;
            const supplierSelectors = [
                '.offer-shop-row .col-left .desc-text',
                '.offer-shop-row .desc-text',
                '.desc-text'
            ];
            
            for (const selector of supplierSelectors) {
                const element = firstItem.querySelector(selector);
                if (element && element.textContent.trim() && !element.textContent.includes('件')) {
                    supplier = element.textContent.trim();
                    console.log(`供应商 (${selector}):`, supplier);
                    break;
                }
            }
            
            const result = {
                title,
                price,
                image,
                link,
                supplier,
                extracted_at: new Date().toISOString()
            };
            
            console.log('\n=== 最终结果 ===');
            console.log(JSON.stringify(result, null, 2));
            
            // 保存结果
            fs.writeFileSync('extracted_data.json', JSON.stringify([result], null, 2));
            console.log('\n结果已保存到 extracted_data.json');
            
            // 提取所有商品
            console.log('\n=== 提取所有商品 ===');
            const allResults = [];
            
            for (let i = 0; i < items.length; i++) { // 移除数量限制，处理所有商品
                const item = items[i];
                
                // 提取标题
                let itemTitle = null;
                for (const selector of titleSelectors) {
                    const element = item.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        itemTitle = element.textContent.trim();
                        break;
                    }
                }
                
                // 提取价格
                let itemPrice = null;
                for (const selector of priceSelectors) {
                    const element = item.querySelector(selector);
                    if (element && element.textContent.trim()) {
                        itemPrice = element.textContent.trim();
                        break;
                    }
                }
                
                // 提取图片
                const itemImgElement = item.querySelector('img.main-img');
                const itemImage = itemImgElement ? itemImgElement.src : null;
                
                // 提取链接
                const itemLink = item.href || item.getAttribute('href');
                
                // 提取供应商
                let itemSupplier = null;
                for (const selector of supplierSelectors) {
                    const element = item.querySelector(selector);
                    if (element && element.textContent.trim() && !element.textContent.includes('件')) {
                        itemSupplier = element.textContent.trim();
                        break;
                    }
                }
                
                allResults.push({
                    title: itemTitle,
                    price: itemPrice,
                    image: itemImage,
                    link: itemLink,
                    supplier: itemSupplier,
                    extracted_at: new Date().toISOString()
                });
            }
            
            console.log(`成功提取 ${allResults.length} 个商品`);
            
            // 保存所有结果
            fs.writeFileSync('all_extracted_data.json', JSON.stringify(allResults, null, 2));
            console.log('所有结果已保存到 all_extracted_data.json');
        } else {
            console.log('商品项innerHTML为空');
        }
    } else {
        console.log('未找到商品项');
    }
} else {
    console.log('未找到商品容器');
}