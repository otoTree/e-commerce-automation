const { extractSearch1688Data } = require('./dist/models/search-1688-extractor.js');

// 基于用户提供的真实HTML结构创建完整测试页面
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

        <!-- 第二个产品 -->
        <a class="search-offer-wrapper" href="/offer/123456789012.html?spm=a2615.7691456.co_1_1_1.2" data-renderkey="2_60_p4p_b2b-22175456677110386b_123456789012">
            <div class="offer-card">
                <div class="image-wrapper">
                    <img src="//cbu01.alicdn.com/img/ibank/O1CN01def456_987654321_!!987654321-0-cib.jpg" alt="儿童秋装裤子" />
                </div>
                <div class="content-wrapper">
                    <div class="title-text">
                        <div>儿童秋装裤子 男女童休闲长裤 纯棉舒适</div>
                    </div>
                    <div class="price-item">
                        <span class="price-units">¥</span>
                        <span class="text-main">28.50</span>
                        <div>起批</div>
                    </div>
                    <div class="desc-text">东莞儿童服装有限公司</div>
                </div>
            </div>
        </a>

        <!-- 第三个产品 -->
        <a class="search-offer-wrapper" href="/offer/555666777888.html" data-renderkey="2_60_p4p_b2b-22175456677110386b_555666777888">
            <div class="offer-card">
                <div class="image-wrapper">
                    <img src="//cbu01.alicdn.com/img/ibank/O1CN01ghi789_456789123_!!456789123-0-cib.jpg" alt="秋季童装裤子" />
                </div>
                <div class="content-wrapper">
                    <div class="title-text">
                        <div>秋季童装裤子 宝宝外穿长裤 时尚百搭</div>
                    </div>
                    <div class="price-item">
                        <span class="price-units">¥</span>
                        <span class="text-main">35.80</span>
                        <div>起批</div>
                    </div>
                    <div class="desc-text">佛山童装批发市场</div>
                </div>
            </div>
        </a>
    </div>

    <!-- 分页信息 -->
    <div class="pagination">
        <span class="current-page">1</span>
        <a href="?page=2">2</a>
        <a href="?page=3">3</a>
        <span>...</span>
        <a href="?page=25">25</a>
    </div>

    <script>
        // 关键词信息
        document.title = "1688搜索结果 - 宝宝裤子秋外穿";
        
        // 总数信息
        var totalCount = 625;
    </script>
</body>
</html>
`;

console.log('🧪 测试完整HTML结构提取功能');
console.log('======================================');

const result = extractSearch1688Data(completeHtmlContent);

console.log('🔑 关键词:', result.keyword);
console.log('');
console.log('📄 分页信息:');
console.log('   当前页:', result.pagination.currentPage);
console.log('   总页数:', result.pagination.totalPages);
console.log('   有下一页:', result.pagination.hasNextPage ? '是' : '否');
console.log('   有上一页:', result.pagination.hasPrevPage ? '是' : '否');
console.log('');
console.log(`📦 产品信息 (共${result.products.length}个):`);

result.products.forEach((product, index) => {
    console.log(`   ${index + 1}. ${product.title}`);
    console.log(`      ID: ${product.productId}`);
    console.log(`      价格: ${product.price}`);
    console.log(`      链接: ${product.link}`);
    console.log(`      供应商: ${product.seller || '未知'}`);
    console.log(`      图片: ${product.imageUrl || '无'}`);
    console.log('');
});

console.log('📊 数据质量分析:');
console.log('   ✅ 关键词提取:', result.keyword ? '成功' : '失败');
console.log(`   ✅ 产品提取: 成功 (${result.products.length}个)`);
console.log('   ✅ 分页提取:', result.pagination ? '成功' : '失败');
console.log('   ✅ 总数提取:', result.totalCount > 0 ? '成功' : '失败');
console.log('   📊 数据源:', result.dataSource);

console.log('');
console.log('============================================================');
console.log('🔍 完整HTML提取验证');
console.log('============================================================');

let successfulExtractions = 0;
let totalFields = 0;

result.products.forEach((product, index) => {
    console.log(`产品 ${index + 1}:`);
    
    const hasTitle = product.title && product.title !== `产品 ${index + 1}`;
    const hasPrice = product.price && product.price !== '价格面议';
    const hasLink = product.link && product.link.includes('offer');
    const hasImage = product.imageUrl && product.imageUrl.length > 0;
    const hasSeller = product.seller && product.seller.length > 0;
    
    console.log(`   标题提取: ${hasTitle ? '✅' : '❌'} ${hasTitle ? '' : '(使用默认标题)'}`);
    console.log(`   价格提取: ${hasPrice ? '✅' : '❌'} ${hasPrice ? '' : '(使用默认价格)'}`);
    console.log(`   链接提取: ${hasLink ? '✅' : '❌'}`);
    console.log(`   图片提取: ${hasImage ? '✅' : '❌'}`);
    console.log(`   供应商提取: ${hasSeller ? '✅' : '❌'}`);
    console.log('');
    
    const fieldCount = [hasTitle, hasPrice, hasLink, hasImage, hasSeller].filter(Boolean).length;
    successfulExtractions += fieldCount;
    totalFields += 5;
});

const successRate = Math.round((successfulExtractions / totalFields) * 100);

console.log('📈 完整HTML提取质量评估:');
console.log(`   成功字段: ${successfulExtractions}/${totalFields}`);
console.log(`   HTML提取成功率: ${successRate}%`);

if (successRate >= 80) {
    console.log('   🎉 HTML提取功能完全正常！');
} else if (successRate >= 50) {
    console.log('   ⚠️  HTML提取部分成功，需要进一步优化');
} else {
    console.log('   ❌ HTML提取功能需要修复');
}