const { Search1688Extractor } = require('./dist/models/search-1688-extractor');

// 真实的1688产品HTML结构（基于用户提供的HTML）
const realHtmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>1688搜索结果测试</title>
</head>
<body>
    <div class="search-container">
        <!-- 搜索关键词 -->
        <div class="search-keyword">宝宝裤子秋外穿</div>
        
        <!-- 产品列表 -->
        <div class="offer-list">
            <!-- 产品1 - 真实HTML结构 -->
            <a href="https://dj.1688.com/ci_bb?spm=a26352.13672862.offerlist.1.3b2e1e62iNIxln&amp;a=31384&amp;e=4OjNS02zNvaCJqUzg1qU1B-EyV7hh-XW9tqrvLzIyGB6uqmhn14fsiJSphKpDx5k9kt8R-Ot7MbXJkmSxpsMvmvjYzAYjZIULIC587ATzYSx7zVRL7hdKlVf26Mhrk5-EbjZo6GvUCkod6ndEFkAErLOvQ0YNdHbqOuLZT-3T4qXcQBgJrkJwIiqsX.S6S4w-BIpdN7Fc1ICT3z.TybDcLfl8EScCHAFLFnlrI-IiP-9JZqWyCtLbhyuMfo2dEwOBgiVmtMef-4MNj2OJoCCesjk3ucCqZJOyNyLmoQuBI7Yoklo8s9tNN1KeDCuA7iaaOSRXJzedMY4j0Ox3j5MZqX3SHei1ydthUe-DPB0wEtA0Y5kkwKTtksyIOTMd86lUuMj0Pkc28pJ8AeQcDablwyqsufJMeYiF4xenPH0rvLAzjWxyQ.oCu6JUD9uIFFweCI08avuzZd7JOvcmMHCzAcdP4zDhDsgdou28f4QDYN-16f0Nq6GkAOBg666i8eieurOKLeM.VeRj889osOeTgc27a.FvUhsUqYWotTdxu4hRg9lvL000bPKYm-q.fbwq4JI3qnn4ZX5q4k9GfZ9KwgE9n16yZdPDEiKZxZT2A.WPh3OMoADzj4ofgRh.yzFKUcgflNqVSotsMPyEZM-gh-4B2Rg9-Cv-G0kuGQTZd7MOzSPpAGK8mfOrKTCLUJd4WFhGKMMjPAiXy8eBLJINpp3qPqJ0g2g056ec50Ww5fbO0ew3ow3hJfYXFOpTJOb7e91v.TN1PpcNj2La1NF6rLzcWu5wKRmNrciztHuRpiC-OrptI1PNGVm93VD2zwcvjx300evBUfhc1RGSUrFudt-dIoruDD3XJt1RYED7Oy55bEvJlIK5dowGXiamRl6r5o7f9zWAOzTH--RNpjgReLm-uFoQMj51FH3.RBenusVnWJ5sbj4tHmdqjroo55X2YdQ91d8JKvLSrU30GVR0bw7JnL6KusSYv1srKyhFkrGcLScNpKyx.CyQ5DGAzzXTVkMY3v2GpBl5s6Qax-GPyh.JZSDVU8JseGa.sx2LyJWyb2V4T5flwGT.JYwzPBzLFYWjbI-gYkhGHzELFUSo3-woxTfusHGj--kWru9KntSoZJzkGNSko8jsJ76c4GjPEbhb1Esxg.nTebBV2bi.qnxeITc96avuE2jXNdAkh3cki7u9ebc9u0GUzN-8BfdrXMGt.8dn2oHzSofsyQwwWgktK6vvEkIZAhnYS5oFo8sxDcOjMzVLUQCqWdjFrFEMUwTd.8JIfEPe3bIcZi7ZqXZw9zV-0.mTeq2ErQqdII1Ky57uQY-nIoWZWTZfkj.zA-2GGMWrszsMJ7lgnZPi86qZKa0PIwVL1.3OGGcjZu95l16ga1iifgSKXTexXNSj8Ak8MwVpZFj4O17jyqWTXx-Lexg6rv241u3S6WOfe0pujI-flXaaqgNKA1XnCKN&amp;v=4&amp;ap=2&amp;rp=2&amp;idx=1&amp;sw_check_ab=1" target="_blank" data-renderkey="2_60_p4p_b2b-22175456677110386b_836259592067" data-index="0" class="search-offer-wrapper cardui-normal search-offer-item major-offer" data-tracker="offer">
                <div class="offer-img-wrapper">
                    <div class="offer-img-inner">
                        <img src="https://cbu01.alicdn.com/img/ibank/O1CN01Tag6Xy26ph5hlmsPq_!!2217545667711-0-cib.jpg_460x460q100.jpg_.webp" class="main-img" loading="lazy" fetchpriority="high">
                        <div class="img-overlay"></div>
                        <img class="main-img-icon" src="https://img.alicdn.com/imgextra/i4/O1CN01DVYxqX1mvptAv7LeQ_!!6000000005017-2-tps-60-36.png">
                    </div>
                </div>
                <div class="offer-title-row">
                    <div class="title-text">
                        <div data-spm-anchor-id="a26352.13672862.offerlist.i0.3b2e1e62iNIxln">熊猫圆圆2025<font color="red">秋</font>季新款重磅工装风男童卫裤儿童水洗针织<font color="red">裤子</font>运动裤</div>
                    </div>
                </div>
                <div class="offer-desc-row"></div>
                <div class="offer-price-row">
                    <div class="col-desc">
                        <div class="price-item">
                            <div class="price-units">¥</div>
                            <div class="text-main">48</div>
                            <div>.8</div>
                        </div>
                        <div class="offer-desc-item">
                            <div class="desc-text" style="color: rgb(255, 64, 0);">新人价</div>
                        </div>
                    </div>
                    <div class="col-desc_after">
                        <div class="offer-desc-item">
                            <div class="desc-text">5200+件</div>
                        </div>
                    </div>
                </div>
                <div class="offer-shop-row">
                    <div class="col-left">
                        <a href="http://shop562646a9a46z8.1688.com?tracelog=p4p" target="_blank" class="offer-desc-item">
                            <div class="desc-text" style="font-size: 14px; color: rgb(153, 153, 153);">湖州天供服饰有限公司</div>
                        </a>
                    </div>
                </div>
            </a>
            
            <!-- 产品2 - 简化的真实结构 -->
            <a href="https://detail.1688.com/offer/123456789.html" target="_blank" data-renderkey="2_60_p4p_b2b-22175456677110386b_123456789" data-index="1" class="search-offer-wrapper cardui-normal search-offer-item">
                <div class="offer-img-wrapper">
                    <div class="offer-img-inner">
                        <img src="https://cbu01.alicdn.com/img/ibank/test2.jpg" class="main-img" loading="lazy">
                    </div>
                </div>
                <div class="offer-title-row">
                    <div class="title-text">
                        <div>儿童春秋款休闲裤男童女童运动裤宽松长裤</div>
                    </div>
                </div>
                <div class="offer-price-row">
                    <div class="col-desc">
                        <div class="price-item">
                            <div class="price-units">¥</div>
                            <div class="text-main">35</div>
                            <div>.5</div>
                        </div>
                    </div>
                </div>
                <div class="offer-shop-row">
                    <div class="col-left">
                        <a href="http://shop123.1688.com" target="_blank" class="offer-desc-item">
                            <div class="desc-text">广州童装批发有限公司</div>
                        </a>
                    </div>
                </div>
            </a>
            
            <!-- 产品3 - 另一种结构变体 -->
            <a href="https://detail.1688.com/offer/987654321.html" target="_blank" data-renderkey="2_60_p4p_b2b-22175456677110386b_987654321" data-index="2" class="search-offer-wrapper">
                <div class="offer-img-wrapper">
                    <img src="https://cbu01.alicdn.com/img/ibank/test3.jpg" class="main-img">
                </div>
                <div class="offer-title-row">
                    <div class="title-text">
                        <div>2025新款儿童加绒保暖裤冬季厚款运动裤</div>
                    </div>
                </div>
                <div class="offer-price-row">
                    <div class="price-item">
                        <div class="price-units">¥</div>
                        <div class="text-main">52</div>
                        <div>.0</div>
                    </div>
                </div>
                <div class="offer-shop-row">
                    <a href="http://shop456.1688.com" target="_blank">
                        <div class="desc-text">杭州儿童服装厂</div>
                    </a>
                </div>
            </a>
        </div>
        
        <!-- 分页信息 -->
        <div class="pagination">
            <span class="fui-current">1</span>
            <a href="#" class="fui-next">下一页</a>
            <span class="fui-paging-total">共25页</span>
        </div>
        
        <!-- 总数量 -->
        <div class="search-result-count">找到相关产品约1250个</div>
    </div>
</body>
</html>
`;

console.log('🧪 测试真实HTML结构提取功能');
console.log('='.repeat(50));

try {
    const extractor = new Search1688Extractor(realHtmlContent);
    const result = extractor.extract();
    
    console.log('📊 提取结果:');
    console.log(`关键词: ${result.keyword}`);
    console.log(`产品数量: ${result.products.length}`);
    console.log(`数据源: ${result.dataSource}`);
    console.log(`总数量: ${result.totalCount}`);
    console.log(`当前页: ${result.pagination.currentPage}`);
    console.log(`总页数: ${result.pagination.totalPages}`);
    
    console.log('\n📦 产品详情:');
    result.products.forEach((product, index) => {
        console.log(`\n产品 ${index + 1}:`);
        console.log(`  ID: ${product.productId}`);
        console.log(`  标题: ${product.title}`);
        console.log(`  价格: ${product.price}`);
        console.log(`  链接: ${product.link}`);
        console.log(`  图片: ${product.imageUrl || '无'}`);
        console.log(`  供应商: ${product.seller || '无'}`);
    });
    
    // 验证提取质量
    console.log('\n🔍 真实HTML提取质量验证:');
    let successCount = 0;
    let totalFields = 0;
    
    result.products.forEach((product, index) => {
        console.log(`\n产品 ${index + 1} 字段完整性:`);
        
        const fields = [
            { name: '标题', value: product.title, valid: product.title && product.title !== `产品 ${index + 1}` },
            { name: '价格', value: product.price, valid: product.price && product.price !== '价格面议' },
            { name: '链接', value: product.link, valid: !!product.link },
            { name: '图片', value: product.imageUrl, valid: !!product.imageUrl },
            { name: '供应商', value: product.seller, valid: !!product.seller }
        ];
        
        fields.forEach(field => {
            const status = field.valid ? '✅' : '❌';
            console.log(`  ${status} ${field.name}: ${field.value || '未提取到'}`);
            totalFields++;
            if (field.valid) successCount++;
        });
    });
    
    const successRate = totalFields > 0 ? ((successCount / totalFields) * 100).toFixed(1) : 0;
    console.log(`\n📈 真实HTML提取成功率: ${successRate}% (${successCount}/${totalFields})`);
    
    if (result.dataSource === 'html' && successRate >= 80) {
        console.log('🎉 真实HTML提取功能测试通过！');
    } else if (result.dataSource !== 'html') {
        console.log('⚠️  数据源不是HTML，可能存在问题');
    } else {
        console.log('⚠️  提取成功率较低，需要进一步优化');
    }
    
} catch (error) {
    console.error('❌ 测试失败:', error);
}