/**
 * 销量提取功能测试脚本
 */

// 模拟DOM环境
function createMockElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
}

// 测试用的HTML片段（基于example.html中的实际结构）
const testHTML = `
<div class="search-offer-wrapper">
    <div class="offer-title-row">
        <div class="title-text">
            <div>CNC碳纤维板加工 雕刻diy复合材料板 碳纤维双面加工 碳板加工</div>
        </div>
    </div>
    <div class="offer-price-row">
        <div class="col-desc">
            <div class="price-item">
                <div class="price-units">¥</div>
                <div class="text-main">1</div>
            </div>
        </div>
        <div class="col-desc_after">
            <div class="offer-desc-item">
                <div class="desc-text">10万+件</div>
            </div>
        </div>
    </div>
    <div style="display: flex; align-items: center; padding: 3px 0px;">
        <span style="color: rgba(0, 0, 0, 0.45); font-size: 12px; margin-right: 4px; flex: 0 0 auto;">年销量:</span>
        <span title="1294127件（268笔）" style="color: rgb(255, 64, 0); font-size: 12px;">1294127件（268笔）</span>
    </div>
</div>
`;

// 简化版的ContentExtractor类用于测试
class TestContentExtractor {
    extractSalesVolume(element) {
        // 尝试多种选择器来查找销量信息
        const selectors = [
            'span[title*="件"]',
            'span[title*="年销量"]',
            'div:contains("年销量:") + span',
            'span:contains("件")',
            'div[style*="padding: 3px 0px"] span[title]'
        ];
        
        for (const selector of selectors) {
            try {
                // 对于包含文本的选择器，需要特殊处理
                if (selector.includes(':contains')) {
                    const salesElements = element.querySelectorAll('*');
                    for (const el of salesElements) {
                        const text = el.textContent || '';
                        if (text.includes('年销量:')) {
                            // 查找包含销量数据的相邻元素
                            const nextSibling = el.nextElementSibling;
                            if (nextSibling && nextSibling.getAttribute('title')) {
                                return nextSibling.getAttribute('title');
                            }
                            // 或者在同一个元素中查找
                            const match = text.match(/年销量[：:]\s*([^\s]+)/); 
                            if (match) {
                                return match[1];
                            }
                        }
                    }
                } else {
                    const salesElement = element.querySelector(selector);
                    if (salesElement) {
                        const title = salesElement.getAttribute('title');
                        const text = salesElement.textContent;
                        return title || text;
                    }
                }
            } catch (error) {
                console.warn(`销量选择器 ${selector} 执行失败:`, error);
            }
        }
        
        // 最后尝试通过正则表达式在整个元素文本中查找销量信息
        try {
            const fullText = element.textContent || '';
            const salesMatch = fullText.match(/年销量[：:]?\s*([0-9]+[万千]?[+]?件[^）]*(?:\（[^）]*\）)?)/i);
            if (salesMatch) {
                return salesMatch[1];
            }
        } catch (error) {
            console.warn('正则表达式提取销量失败:', error);
        }
        
        return null;
    }
}

// 执行测试
function runTest() {
    console.log('开始测试销量提取功能...');
    
    // 创建测试元素
    const testElement = createMockElement(testHTML);
    
    // 创建提取器实例
    const extractor = new TestContentExtractor();
    
    // 执行销量提取
    const salesVolume = extractor.extractSalesVolume(testElement);
    
    console.log('提取结果:', salesVolume);
    
    // 验证结果
    if (salesVolume && salesVolume.includes('1294127件')) {
        console.log('✅ 测试通过：成功提取到销量信息');
        return true;
    } else {
        console.log('❌ 测试失败：未能正确提取销量信息');
        console.log('期望包含: 1294127件');
        console.log('实际结果:', salesVolume);
        return false;
    }
}

// 如果在浏览器环境中运行
if (typeof document !== 'undefined') {
    // 等待DOM加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTest);
    } else {
        runTest();
    }
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestContentExtractor, runTest };
}