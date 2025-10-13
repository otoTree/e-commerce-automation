const { Search1688Extractor } = require('./dist/models/search-1688-extractor.js');

// 纯HTML结构测试（不包含window.data）
const pureHTMLContent = `
<!DOCTYPE html>
<html>
<head>
    <title>宝宝裤子秋外穿 - 1688搜索结果</title>
</head>
<body>
    <div class="search-results">
        <!-- 第一个产品 -->
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
</body>
</html>
`;

console.log('🧪 开始测试纯HTML结构提取（无JavaScript数据）...\n');

try {
    const extractor = new Search1688Extractor(pureHTMLContent);
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
        if (product.imageUrl) {
            console.log(`      图片URL: ${product.imageUrl}`);
        }
        console.log('');
    });

    console.log('\n📊 数据质量分析:');
    console.log(`   ✅ 关键词提取: ${result.keyword ? '成功' : '失败'}`);
    console.log(`   ✅ 产品提取: ${result.products.length > 0 ? '成功' : '失败'} (${result.products.length}个)`);
    console.log(`   ✅ 分页提取: ${result.pagination.totalPages > 1 ? '成功' : '部分成功'}`);
    console.log(`   ✅ 总数提取: ${result.totalCount > 0 ? '成功' : '失败'}`);
    console.log(`   📊 数据源: ${result.dataSource}`);

    // 验证HTML提取的完整性
    console.log('\n============================================================');
    console.log('🔍 HTML提取完整性验证');
    console.log('============================================================');

    let completeProducts = 0;
    let hasImages = 0;
    let hasSuppliers = 0;
    let hasPrices = 0;

    result.products.forEach((product, index) => {
        const hasTitle = product.title && !product.title.startsWith('产品 ');
        const hasPrice = product.price && product.price !== '价格面议';
        const hasLink = product.link && product.link !== '#';
        const hasImage = product.imageUrl && product.imageUrl.length > 0;
        const hasSupplier = product.seller && product.seller.length > 0;

        if (hasTitle && hasPrice && hasLink) completeProducts++;
        if (hasImage) hasImages++;
        if (hasSupplier) hasSuppliers++;
        if (hasPrice) hasPrices++;

        console.log(`产品 ${index + 1}:`);
        console.log(`   标题提取: ${hasTitle ? '✅' : '❌'} ${hasTitle ? '' : '(使用默认标题)'}`);
        console.log(`   价格提取: ${hasPrice ? '✅' : '❌'} ${hasPrice ? '' : '(使用默认价格)'}`);
        console.log(`   链接提取: ${hasLink ? '✅' : '❌'}`);
        console.log(`   图片提取: ${hasImage ? '✅' : '❌'}`);
        console.log(`   供应商提取: ${hasSupplier ? '✅' : '❌'}`);
        console.log('');
    });

    console.log(`📈 HTML提取质量评估:`);
    console.log(`   完整产品: ${completeProducts}/${result.products.length}`);
    console.log(`   图片提取: ${hasImages}/${result.products.length}`);
    console.log(`   供应商提取: ${hasSuppliers}/${result.products.length}`);
    console.log(`   价格提取: ${hasPrices}/${result.products.length}`);
    console.log(`   HTML提取成功率: ${Math.round((completeProducts / result.products.length) * 100)}%`);

    if (result.dataSource === 'html' && completeProducts > 0) {
        console.log('\n🎉 HTML提取测试通过！提取器能够正确解析真实的产品HTML结构');
    } else if (result.dataSource === 'html') {
        console.log('\n⚠️  HTML提取部分成功：能识别HTML结构但数据提取不完整');
    } else {
        console.log('\n❌ HTML提取测试失败：未能从HTML结构中提取产品数据');
        console.log(`   实际数据源: ${result.dataSource}`);
    }

} catch (error) {
    console.error('❌ 测试过程中发生错误:', error);
    console.error('错误堆栈:', error.stack);
}