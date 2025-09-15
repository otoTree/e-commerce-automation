const fs = require('fs');

// 读取HTML文件
const html = fs.readFileSync('example.html', 'utf8');

console.log('HTML文件长度:', html.length);

// 查找商品容器
function findProductContainer(html) {
    // 尝试多种容器选择器
    const containerPatterns = [
        /<div[^>]*class="[^"]*search-offer-list[^"]*"[^>]*>([\s\S]*?)<\/div>/,
        /<div[^>]*class="[^"]*offer-list[^"]*"[^>]*>([\s\S]*?)<\/div>/,
        /<div[^>]*class="[^"]*cardui-list[^"]*"[^>]*>([\s\S]*?)<\/div>/
    ];
    
    for (const pattern of containerPatterns) {
        const match = html.match(pattern);
        if (match) {
            console.log('找到商品容器，长度:', match[1].length);
            return match[1];
        }
    }
    
    console.log('未找到商品容器，使用整个HTML');
    return html;
}

// 分析商品项结构
function analyzeProductStructure(html) {
    // 查找第一个商品项及其周围的HTML
    const productPattern = /<a[^>]*class="[^"]*search-offer-wrapper[^"]*"[^>]*>/;
    const match = html.match(productPattern);
    
    if (match) {
        const startIndex = html.indexOf(match[0]);
        console.log('\n=== 第一个商品项位置分析 ===');
        console.log('商品项开始位置:', startIndex);
        
        // 查看商品项前面的HTML（可能包含标题等信息）
        const beforeProduct = html.substring(Math.max(0, startIndex - 2000), startIndex);
        console.log('\n商品项前2000字符:');
        console.log(beforeProduct);
        
        // 查找商品项的结束位置
        let endIndex = startIndex;
        let depth = 0;
        let inTag = false;
        let tagName = '';
        
        for (let i = startIndex; i < html.length; i++) {
            const char = html[i];
            
            if (char === '<') {
                inTag = true;
                tagName = '';
                // 检查是否是结束标签
                if (html[i + 1] === '/') {
                    // 这是结束标签
                    let j = i + 2;
                    while (j < html.length && html[j] !== '>' && html[j] !== ' ') {
                        tagName += html[j];
                        j++;
                    }
                    if (tagName === 'a') {
                        depth--;
                        if (depth === 0) {
                            endIndex = j + 1;
                            break;
                        }
                    }
                } else {
                    // 这是开始标签
                    let j = i + 1;
                    while (j < html.length && html[j] !== '>' && html[j] !== ' ') {
                        tagName += html[j];
                        j++;
                    }
                    if (tagName === 'a') {
                        depth++;
                    }
                }
            }
        }
        
        if (endIndex > startIndex) {
            const productHtml = html.substring(startIndex, endIndex);
            console.log('\n=== 完整商品HTML ===');
            console.log('长度:', productHtml.length);
            console.log('前1000字符:');
            console.log(productHtml.substring(0, 1000));
            console.log('\n后1000字符:');
            console.log(productHtml.substring(Math.max(0, productHtml.length - 1000)));
            
            return productHtml;
        }
        
        // 如果没找到结束标签，查看商品项后面的HTML
        const afterProduct = html.substring(startIndex, Math.min(html.length, startIndex + 3000));
        console.log('\n商品项后3000字符:');
        console.log(afterProduct);
    }
    
    return null;
}

// 查找所有可能包含商品信息的div
function findProductDivs(html) {
    console.log('\n=== 查找商品相关的div ===');
    
    // 查找包含商品信息的div模式
    const patterns = [
        /<div[^>]*class="[^"]*title[^"]*"[^>]*>([^<]*)<\/div>/g,
        /<div[^>]*class="[^"]*price[^"]*"[^>]*>([^<]*)<\/div>/g,
        /<div[^>]*class="[^"]*text-main[^"]*"[^>]*>([^<]*)<\/div>/g,
        /<div[^>]*class="[^"]*desc[^"]*"[^>]*>([^<]*)<\/div>/g
    ];
    
    patterns.forEach((pattern, index) => {
        const matches = [...html.matchAll(pattern)];
        console.log(`模式 ${index + 1} 匹配数量:`, matches.length);
        if (matches.length > 0) {
            console.log('前5个匹配:');
            matches.slice(0, 5).forEach((match, i) => {
                console.log(`  ${i + 1}: ${match[1].trim()}`);
            });
        }
    });
}

// 执行分析
const container = findProductContainer(html);
const productHtml = analyzeProductStructure(container);
findProductDivs(html);

console.log('\n=== 分析完成 ===');