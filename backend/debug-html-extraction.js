const { Search1688Extractor } = require('./dist/models/search-1688-extractor.js');

// 基于用户提供的真实HTML结构创建测试页面
const completeHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>1688搜索结果 - 宝宝裤子秋外穿</title>
</head>
<body>
    <div class="search-results">
        <!-- 第一个产品 - 完整的真实HTML结构 -->
        <a class="search-offer-wrapper" href="/offer/836259592067.html?spm=a2615.7691456.co_1_1_1.1.2e8b7d5fhKjQxL&amp;cosite=baidujj_pz&amp;tracelog=p4p&amp;clickid=2_60_p4p_b2b-22175456677110386b_836259592067&amp;sessionid=f5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5" data-renderkey="2_60_p4p_b2b-22175456677110386b_836259592067">
            <div class="offer-card">
                <div class="image-wrapper">
                    <img src="//cbu01.alicdn.com/img/ibank/O1CN01abc123_123456789_!!123456789-0-cib.jpg" alt="宝宝裤子秋外穿" />
                </div>
                <div class="content-wrapper">
                    <div class="title-text">
                        <div>宝宝裤子秋外穿 儿童休闲裤 加厚保暖长裤</div>
                    </div>
                    <div class="price-item">
                        <span class="price-units">¥</span>
                        <span class="text-main">15.00</span>
                        <div>起批</div>
                    </div>
                    <div class="desc-text">广州童装厂</div>
                </div>
            </div>
        </a>
    </div>
</body>
</html>
`;

console.log('🔍 调试HTML提取过程');
console.log('===================');

const extractor = new Search1688Extractor(completeHtmlContent);

// 测试各个提取方法
console.log('1. 测试JavaScript提取:');
const scriptProducts = extractor.extractFromScript();
console.log(`   JavaScript产品数量: ${scriptProducts.length}`);

console.log('');
console.log('2. 测试HTML提取:');

// 手动测试HTML选择器
const productSelectors = [
    'a.search-offer-wrapper',
    'a[class*="search-offer"]',
    'div[data-spm-anchor-id*="offer"]',
    'div[class*="offer-item"]'
];

for (const selector of productSelectors) {
    console.log(`   测试选择器: ${selector}`);
    
    // 简单的选择器匹配测试
    if (selector === 'a.search-offer-wrapper') {
        const matches = completeHtmlContent.match(/<a[^>]*class="[^"]*search-offer-wrapper[^"]*"[^>]*>.*?<\/a>/gs);
        console.log(`     匹配结果: ${matches ? matches.length : 0} 个`);
        if (matches) {
            console.log(`     第一个匹配长度: ${matches[0].length} 字符`);
        }
    }
}

console.log('');
console.log('3. 完整提取测试:');
const result = extractor.extract();
console.log(`   数据源: ${result.dataSource}`);
console.log(`   产品数量: ${result.products.length}`);
console.log(`   关键词: ${result.keyword}`);

if (result.products.length > 0) {
    console.log('');
    console.log('4. 产品详情:');
    result.products.forEach((product, index) => {
        console.log(`   产品 ${index + 1}:`);
        console.log(`     ID: ${product.productId}`);
        console.log(`     标题: ${product.title}`);
        console.log(`     价格: ${product.price}`);
        console.log(`     链接: ${product.link}`);
        console.log(`     图片: ${product.imageUrl || '无'}`);
        console.log(`     供应商: ${product.seller || '无'}`);
        console.log('');
    });
}