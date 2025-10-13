const { Search1688Extractor } = require('./dist/models/search-1688-extractor.js');

// 真实的1688产品HTML结构（基于用户提供的代码片段）
const realProductHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>1688搜索结果测试</title>
</head>
<body>
    <div class="search-results">
        <!-- 真实的产品HTML结构 -->
        <a class="search-offer-wrapper" href="//detail.1688.com/offer/836259592067.html?spm=a2615.7691456.co_1_1_1.1.2e8b7d5fhKjQxL&amp;cosite=baidujj_pz&amp;tracelog=p4p&amp;clickid=2_60_p4p_b2b-22175456677110386b_836259592067&amp;sessionid=f5b5b5b5b5b5b5b5b5b5b5b5b5b5b5b5" data-renderkey="2_60_p4p_b2b-22175456677110386b_836259592067" data-spm-anchor-id="a2615.7691456.co_1_1_1.1">
            <div class="offer-img-wrapper">
                <img class="main-img" src="https://cbu01.alicdn.com/img/ibank/O1CN01234567890_!!2-item_pic.png_300x300q90.jpg" alt="产品图片">
            </div>
            <div class="offer-title-row">
                <div class="title-text">
                    <div>儿童秋装外穿裤子男女宝宝加厚保暖长裤婴幼儿童装</div>
                </div>
            </div>
            <div class="offer-price-row">
                <div class="price-item">
                    <span class="price-units">¥</span>
                    <span class="text-main">15.80</span>
                    <div>起批</div>
                </div>
                <div class="col-desc_after">
                    <div class="desc-text">已售1000+件</div>
                </div>
            </div>
            <div class="offer-shop-row">
                <div class="desc-text">广州童装批发商城</div>
            </div>
        </a>

        <!-- 第二个产品 -->
        <a class="search-offer-wrapper" href="//detail.1688.com/offer/123456789012.html?spm=a2615.7691456.co_1_1_1.2" data-renderkey="2_60_p4p_b2b-22175456677110386b_123456789012" data-spm-anchor-id="a2615.7691456.co_1_1_1.2">
            <div class="offer-img-wrapper">
                <img class="main-img" src="https://cbu01.alicdn.com/img/ibank/O1CN01987654321_!!2-item_pic.png_300x300q90.jpg" alt="产品图片">
            </div>
            <div class="offer-title-row">
                <div class="title-text">
                    <div>婴儿秋冬加绒加厚保暖裤子新生儿外穿长裤</div>
                </div>
            </div>
            <div class="offer-price-row">
                <div class="price-item">
                    <span class="price-units">¥</span>
                    <span class="text-main">22.50</span>
                    <div>-35.80</div>
                </div>
                <div class="col-desc_after">
                    <div class="desc-text">已售500+件</div>
                </div>
            </div>
            <div class="offer-shop-row">
                <div class="desc-text">义乌童装工厂店</div>
            </div>
        </a>

        <!-- 第三个产品 -->
        <a class="search-offer-wrapper" href="//detail.1688.com/offer/555666777888.html" data-renderkey="2_60_p4p_b2b-22175456677110386b_555666777888">
            <div class="offer-img-wrapper">
                <img class="main-img" src="https://cbu01.alicdn.com/img/ibank/O1CN01555666777_!!2-item_pic.png_300x300q90.jpg" alt="产品图片">
            </div>
            <div class="offer-title-row">
                <div class="title-text">
                    <div>宝宝秋装裤子外穿男女童加厚保暖长裤儿童装</div>
                </div>
            </div>
            <div class="offer-price-row">
                <div class="price-item">
                    <span class="price-units">¥</span>
                    <span class="text-main">18.90</span>
                    <div>起</div>
                </div>
                <div class="col-desc_after">
                    <div class="desc-text">已售2000+件</div>
                </div>
            </div>
            <div class="offer-shop-row">
                <div class="desc-text">东莞儿童服装厂</div>
            </div>
        </a>
    </div>

    <!-- 分页信息 -->
    <div class="fui-paging">
        <div class="fui-paging-total">共<span class="fui-paging-num">25</span>页</div>
    </div>

    <script>
        // 模拟window.data结构
        window.data = {
            pageConfigData: {
                keywords: "宝宝裤子秋外穿"
            },
            requestData: {
                totalCount: 500
            }
        };
    </script>
</body>
</html>
`;

console.log('🧪 开始测试真实产品HTML结构提取...\n');

try {
    const extractor = new Search1688Extractor(realProductHTML);
    const result = extractor.extract();

    console.log('📊 提取结果汇总:');
    console.log(`   关键词: ${result.keyword}`);
    console.log(`   产品数量: ${result.products.length}`);
    console.log(`   当前页: ${result.pagination.currentPage}`);
    console.log(`   总页数: ${result.pagination.totalPages}`);
    console.log(`   总商品数: ${result.totalCount}`);
    console.log(`   数据源: ${result.dataSource}`);

    console.log('\n============================================================');
    console.log('📋 详细提取结果');
    console.log('============================================================\n');

    console.log(`🔑 关键词: ${result.keyword}\n`);

    console.log('📄 分页信息:');
    console.log(`   当前页: ${result.pagination.currentPage}`);
    console.log(`   总页数: ${result.pagination.totalPages}`);
    console.log(`   有下一页: ${result.pagination.hasNextPage ? '是' : '否'}`);
    console.log(`   有上一页: ${result.pagination.hasPrevPage ? '是' : '否'}\n`);

    console.log(`📦 产品信息 (共${result.products.length}个):`);
    result.products.forEach((product, index) => {
        console.log(`   ${index + 1}.  ${product.title}`);
        console.log(`      ID: ${product.productId}`);
        console.log(`      价格: ${product.price}`);
        console.log(`      链接: ${product.link}`);
        console.log(`      供应商: ${product.seller || '未知'}`);
        console.log(`      图片: ${product.imageUrl ? '有' : '无'}`);
        console.log('');
    });

    console.log('\n📊 数据质量分析:');
    console.log(`   ✅ 关键词提取: ${result.keyword ? '成功' : '失败'}`);
    console.log(`   ✅ 产品提取: ${result.products.length > 0 ? '成功' : '失败'} (${result.products.length}个)`);
    console.log(`   ✅ 分页提取: ${result.pagination.totalPages > 1 ? '成功' : '部分成功'}`);
    console.log(`   ✅ 总数提取: ${result.totalCount > 0 ? '成功' : '失败'}`);
    console.log(`   📊 数据源: ${result.dataSource}`);

    // 验证产品数据的完整性
    console.log('\n============================================================');
    console.log('🔍 产品数据完整性验证');
    console.log('============================================================');

    let validProducts = 0;
    let hasRealData = false;

    result.products.forEach((product, index) => {
        const isValid = product.title && product.price && product.link;
        const isRealData = !product.productId.startsWith('test_') && !product.title.startsWith('测试产品');
        
        if (isValid) validProducts++;
        if (isRealData) hasRealData = true;

        console.log(`产品 ${index + 1}:`);
        console.log(`   标题完整: ${product.title ? '✅' : '❌'}`);
        console.log(`   价格完整: ${product.price ? '✅' : '❌'}`);
        console.log(`   链接完整: ${product.link ? '✅' : '❌'}`);
        console.log(`   图片完整: ${product.imageUrl ? '✅' : '❌'}`);
        console.log(`   供应商完整: ${product.seller ? '✅' : '❌'}`);
        console.log(`   真实数据: ${isRealData ? '✅' : '❌'}`);
        console.log('');
    });

    console.log(`📈 总体质量评估:`);
    console.log(`   有效产品: ${validProducts}/${result.products.length}`);
    console.log(`   真实数据: ${hasRealData ? '是' : '否'}`);
    console.log(`   提取成功率: ${Math.round((validProducts / result.products.length) * 100)}%`);

    if (hasRealData && validProducts > 0) {
        console.log('\n🎉 测试通过！提取器能够正确解析真实的产品HTML结构');
    } else if (validProducts > 0) {
        console.log('\n⚠️  测试部分通过：提取器工作正常，但使用了fallback数据');
    } else {
        console.log('\n❌ 测试失败：提取器无法正确解析产品数据');
    }

} catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    console.error('错误堆栈:', error.stack);
}