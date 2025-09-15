// 直接检查第一个商品项的HTML内容
const fs = require('fs');
const { JSDOM } = require('jsdom');

// 读取HTML文件
const htmlContent = fs.readFileSync('./example.html', 'utf8');

// 创建DOM环境
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

console.log('=== 检查第一个商品项 ===');

// 查找第一个商品项
const firstItem = document.querySelector('.search-offer-wrapper');
if (firstItem) {
    console.log('找到第一个商品项');
    console.log('标签名:', firstItem.tagName);
    console.log('类名:', firstItem.className);
    
    // 输出完整的HTML内容（前3000字符）
    console.log('\n=== 商品项HTML内容（前3000字符）===');
    console.log(firstItem.innerHTML.substring(0, 3000));
    
    // 查找所有子元素
    console.log('\n=== 所有子元素（前50个）===');
    const allChildren = firstItem.querySelectorAll('*');
    console.log('子元素总数:', allChildren.length);
    
    for (let i = 0; i < Math.min(allChildren.length, 50); i++) {
        const child = allChildren[i];
        const text = child.textContent.trim();
        if (text && text.length < 100) {
            console.log(`${i + 1}. ${child.tagName}.${child.className}: "${text}"`);
        } else if (child.tagName === 'IMG') {
            console.log(`${i + 1}. ${child.tagName}.${child.className}: src="${child.src}"`);
        }
    }
    
} else {
    console.log('未找到商品项');
    
    // 查看所有可能的容器
    console.log('\n=== 查找所有可能的容器 ===');
    const containers = document.querySelectorAll('div[class*="offer"], div[class*="search"], div[class*="wrapper"]');
    console.log('找到容器数量:', containers.length);
    
    containers.forEach((container, index) => {
        console.log(`容器${index + 1}: ${container.tagName}.${container.className}`);
    });
}