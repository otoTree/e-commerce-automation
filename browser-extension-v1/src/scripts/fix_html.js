const fs = require('fs');

// 读取原始HTML
let html = fs.readFileSync('example.html', 'utf8');

console.log('原始HTML长度:', html.length);
console.log('原始HTML前1000字符:');
console.log(html.substring(0, 1000));

// 检查是否有自闭合的<a>标签
const selfClosingATagPattern = /<a[^>]*\/>/g;
const selfClosingATags = html.match(selfClosingATagPattern);
console.log('\n找到自闭合<a>标签数量:', selfClosingATags ? selfClosingATags.length : 0);

// 检查是否有未闭合的<a>标签
const openATagPattern = /<a[^>]*>/g;
const closeATagPattern = /<\/a>/g;
const openATags = html.match(openATagPattern);
const closeATags = html.match(closeATagPattern);
console.log('开始<a>标签数量:', openATags ? openATags.length : 0);
console.log('结束</a>标签数量:', closeATags ? closeATags.length : 0);

// 如果有自闭合的<a>标签，尝试修复
if (selfClosingATags && selfClosingATags.length > 0) {
    console.log('\n检测到自闭合<a>标签，尝试修复...');
    
    // 将自闭合的<a>标签转换为正常的开始标签
    html = html.replace(/<a([^>]*)\/>/g, '<a$1>');
    
    // 在每个商品项后添加闭合标签
    // 查找商品项的结束位置（通常是下一个<a>标签或容器结束）
    html = html.replace(/(<a[^>]*class="[^"]*search-offer-wrapper[^"]*"[^>]*>)([^<]*(?:<(?!\/a>|a\s)[^<]*)*)/g, 
        (match, openTag, content) => {
            // 如果内容不为空且没有闭合标签，添加闭合标签
            if (content && !content.includes('</a>')) {
                return openTag + content + '</a>';
            }
            return match;
        });
    
    console.log('修复后HTML长度:', html.length);
    
    // 保存修复后的HTML
    fs.writeFileSync('example_fixed.html', html);
    console.log('修复后的HTML已保存到 example_fixed.html');
} else {
    console.log('\n未检测到自闭合<a>标签');
    
    // 检查HTML结构
    console.log('\n=== HTML结构分析 ===');
    const firstATag = html.match(/<a[^>]*class="[^"]*search-offer-wrapper[^"]*"[^>]*>/)
    if (firstATag) {
        console.log('第一个商品<a>标签:', firstATag[0].substring(0, 200) + '...');
        
        // 查找这个<a>标签后的内容
        const startIndex = html.indexOf(firstATag[0]) + firstATag[0].length;
        const nextContent = html.substring(startIndex, startIndex + 2000);
        console.log('\n<a>标签后的内容（前2000字符）:');
        console.log(nextContent);
    }
}