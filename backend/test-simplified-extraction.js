const { Search1688Extractor } = require('./dist/models/search-1688-extractor');

// 模拟真实的1688搜索结果HTML结构
const testHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>手机壳_手机壳批发_手机壳供应_阿里巴巴</title>
</head>
<body>
    <div class="search-results">
        <!-- 产品1 -->
        <a class="search-offer-wrapper" href="https://detail.1688.com/offer/123456789.html">
            <div class="offer-content">
                <img class="main-img" src="https://img.alicdn.com/imgextra/i1/123456789.jpg" alt="手机壳">
                <div class="offer-title">苹果iPhone手机壳透明硅胶保护套</div>
                <div class="price-item">
                    <div class="price-units">¥</div>
                    <div class="text-main">12</div>
                    <div>.50</div>
                </div>
            </div>
        </a>

        <!-- 产品2 -->
        <a class="search-offer-wrapper" href="https://detail.1688.com/offer/987654321.html">
            <div class="offer-content">
                <img class="main-img" src="https://img.alicdn.com/imgextra/i2/987654321.jpg" alt="手机壳">
                <div class="offer-title">华为手机壳防摔保护壳</div>
                <div class="price-item">
                    <div class="price-units">¥</div>
                    <div class="text-main">8</div>
                    <div>.80</div>
                </div>
            </div>
        </a>

        <!-- 产品3 -->
        <a class="search-offer-wrapper" href="https://detail.1688.com/offer/456789123.html">
            <div class="offer-content">
                <img class="main-img" src="https://img.alicdn.com/imgextra/i3/456789123.jpg" alt="手机壳">
                <div class="offer-title">小米手机壳磁吸支架款</div>
                <div class="price-item">
                    <div class="price-units">¥</div>
                    <div class="text-main">15</div>
                    <div>.20</div>
                </div>
            </div>
        </a>
    </div>

    <!-- 分页信息 -->
    <div class="fui-paging">
        <span class="fui-current">1</span>
        <a href="?page=2">2</a>
        <a href="?page=3">3</a>
        <div class="fui-paging-total">共<span class="fui-paging-num">25</span>页</div>
    </div>

    <!-- 总数信息 -->
    <div class="result-info">找到相关产品约1250个</div>
</body>
</html>
`;

console.log('=== 测试简化后的1688提取器 ===');
console.log('只提取链接信息\n');

try {
    // 创建提取器实例
    const extractor = new Search1688Extractor(testHtml);
    
    // 执行提取
    const result = extractor.extract();
    
    console.log('提取结果:');
    console.log('关键词:', result.keyword);
    console.log('数据源:', result.dataSource);
    console.log('总数量:', result.totalCount);
    console.log('分页信息:', JSON.stringify(result.pagination, null, 2));
    console.log('产品数量:', result.products.length);
    console.log('\n产品列表:');
    
    result.products.forEach((product, index) => {
        console.log(`产品 ${index + 1}:`);
        console.log(`  链接: ${product.link}`);
        console.log('');
    });
    
    // 验证提取质量
    console.log('=== 提取质量验证 ===');
    const validProducts = result.products.filter(p => p.link && p.link.includes('detail.1688.com'));
    const successRate = (validProducts.length / result.products.length) * 100;
    
    console.log(`有效产品数: ${validProducts.length}/${result.products.length}`);
    console.log(`成功率: ${successRate.toFixed(1)}%`);
    
    if (successRate >= 80) {
        console.log('✅ 提取质量良好');
    } else {
        console.log('❌ 提取质量需要改进');
    }
    
} catch (error) {
    console.error('测试失败:', error);
}