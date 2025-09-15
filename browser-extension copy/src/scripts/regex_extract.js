const fs = require('fs');

// 读取HTML文件
const html = fs.readFileSync('example.html', 'utf8');

// 查找包含完整商品信息的容器
// 从<a>标签开始，到包含所有商品信息的结束
const productPattern = /<a[^>]*search-offer-wrapper[^>]*>.*?<div class="offer-shop-row">.*?<\/div>/gs;
const products = html.match(productPattern) || [];

console.log(`找到 ${products.length} 个商品`);

// 提取商品信息
const extractedData = [];
// 移除数量限制，提取所有产品

for (let i = 0; i < products.length; i++) {
    const product = products[i];
    
    // 提取链接
    const linkMatch = product.match(/href="([^"]*)"/i);  
    const link = linkMatch ? linkMatch[1] : null;
    
    // 提取图片
    const imgMatch = product.match(/<img[^>]*src="([^"]*)"/i);  
    const image = imgMatch ? imgMatch[1] : null;
    
    // 提取标题 - 查找 title-text 类中的内容
    const titleMatch = product.match(/<div class="title-text"><div>([^<]*)<\/div><\/div>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;
    
    // 提取价格 - 查找 text-main 类中的内容
    const priceMatch = product.match(/<div class="text-main">([^<]*)<\/div>/i);
    const price = priceMatch ? priceMatch[1].trim() : null;
    
    // 提取供应商 - 查找供应商链接中的文本
    const supplierMatch = product.match(/<div class="desc-text"[^>]*>([^<]*公司)<\/div>/i);
    const supplier = supplierMatch ? supplierMatch[1].trim() : null;
    
    const productData = {
        index: i + 1,
        link,
        image,
        title,
        price,
        supplier
    };
    
    extractedData.push(productData);
    
    console.log(`商品 ${i + 1}:`);
    console.log(`  标题: ${title || 'null'}`);
    console.log(`  价格: ${price || 'null'}`);
    console.log(`  链接: ${link ? '已提取' : 'null'}`);
    console.log(`  图片: ${image ? '已提取' : 'null'}`);
    console.log(`  供应商: ${supplier || 'null'}`);
    console.log('---');
}

// 保存结果
fs.writeFileSync('regex_extracted_data.json', JSON.stringify(extractedData, null, 2));

// 统计有效数据
const validProducts = extractedData.filter(p => p.title && p.price);
console.log(`\n提取完成！`);
console.log(`总商品数: ${extractedData.length}`);
console.log(`有效商品数 (有标题和价格): ${validProducts.length}`);
console.log(`数据已保存到 regex_extracted_data.json`);