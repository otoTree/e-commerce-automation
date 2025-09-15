/**
 * 阿里巴巴页面内容提取器
 * 基于extraction_rules.json中定义的规则提取页面内容
 */

class ContentExtractor {
    constructor(rules) {
        this.rules = rules;
        this.extractedData = {
            page_info: {},
            products: [],
            pagination: {},
            metadata: {
                extraction_time: new Date().toISOString(),
                extractor_version: '1.0.0'
            }
        };
    }

    /**
     * 主提取方法
     */
    async extract() {
        try {
            // 等待页面加载完成
            await this.waitForPageLoad();
            
            // 提取页面基本信息
            this.extractPageInfo();
            
            // 提取商品列表
            this.extractProducts();
            
            // 提取分页信息
            this.extractPagination();
            
            return this.extractedData;
        } catch (error) {
            console.error('内容提取失败:', error);
            throw error;
        }
    }

    /**
     * 等待页面加载完成
     */
    waitForPageLoad() {
        return new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
    }

    /**
     * 提取页面基本信息
     */
    extractPageInfo() {
        const pageRules = this.rules.extraction_rules.page_metadata;
        
        // 提取页面标题
        this.extractedData.page_info.title = this.extractText(pageRules.page_title.selector);
        
        // 提取页面URL
        this.extractedData.page_info.url = window.location.href;
        
        // 提取搜索关键词
        this.extractedData.page_info.search_keyword = this.extractAttribute(
            pageRules.search_keyword.selector, 
            pageRules.search_keyword.attribute
        );
        
        // 尝试从JavaScript变量中提取数据
        this.extractJavaScriptData();
    }

    /**
     * 提取商品列表
     */
    extractProducts() {
        const productRules = this.rules.extraction_rules.product_list;
        
        // 查找商品容器
        const containers = this.findElements(productRules.container_selector);
        
        containers.forEach(container => {
            const items = container.querySelectorAll(productRules.item_selector);
            
            items.forEach(item => {
                const product = this.extractProductData(item, productRules.fields);
                if (this.validateProduct(product)) {
                    this.extractedData.products.push(product);
                }
            });
        });
        
        // 如果没有找到商品，尝试备用选择器
        if (this.extractedData.products.length === 0) {
            this.extractProductsWithFallback();
        }
    }

    /**
     * 从单个商品元素提取数据
     */
    extractProductData(element, fields) {
        const product = {};
        
        Object.keys(fields).forEach(fieldName => {
            const fieldRule = fields[fieldName];
            let value = null;
            
            // 尝试主选择器
            value = this.extractFromElement(element, fieldRule.selector, fieldRule.attribute);
            
            // 如果主选择器失败，尝试备用选择器
            if (!value && fieldRule.fallback_selectors) {
                for (const fallbackSelector of fieldRule.fallback_selectors) {
                    value = this.extractFromElement(element, fallbackSelector, fieldRule.attribute);
                    if (value) break;
                }
            }
            
            // 如果还是没有值，尝试备用属性
            if (!value && fieldRule.fallback_attribute) {
                value = this.extractFromElement(element, fieldRule.selector, fieldRule.fallback_attribute);
            }
            
            product[fieldName] = value || '';
        });
        
        // 提取数据属性
        this.extractDataAttributes(element, product);
        
        // 如果通过常规方法没有提取到销量，尝试专门的销量提取方法
        if (!product.sales_volume) {
            product.sales_volume = this.extractSalesVolume(element) || '';
        }
        
        return product;
    }

    /**
     * 提取分页信息
     */
    extractPagination() {
        const paginationRules = this.rules.extraction_rules.pagination;
        
        this.extractedData.pagination = {
            current_page: parseInt(this.extractText(paginationRules.current_page.selector)) || 1,
            total_pages: parseInt(this.extractText(paginationRules.total_pages.selector)) || 1,
            next_page_link: this.extractAttribute(paginationRules.next_page_link.selector, 'href') || null
        };
    }

    /**
     * 从JavaScript变量中提取数据
     */
    extractJavaScriptData() {
        const jsRules = this.rules.javascript_variables;
        
        Object.keys(jsRules).forEach(dataType => {
            const variableNames = jsRules[dataType].variable_names;
            
            for (const varName of variableNames) {
                try {
                    const data = this.getNestedProperty(window, varName.replace('window.', ''));
                    if (data) {
                        this.extractedData.page_info[dataType] = data;
                        break;
                    }
                } catch (error) {
                    console.warn(`无法访问变量 ${varName}:`, error);
                }
            }
        });
    }

    /**
     * 提取数据属性
     */
    extractDataAttributes(element, product) {
        const dataRules = this.rules.data_attributes;
        
        Object.keys(dataRules).forEach(attrType => {
            const attributes = dataRules[attrType].attributes;
            
            for (const attr of attributes) {
                const value = element.getAttribute(attr);
                if (value) {
                    product[attrType] = value;
                    break;
                }
            }
        });
    }

    /**
     * 使用备用策略提取商品
     */
    extractProductsWithFallback() {
        // 通用商品选择器
        const fallbackSelectors = [
            '.offer-item',
            '.product-item', 
            '.search-item',
            '.item',
            '[data-offer-id]',
            '[data-product-id]'
        ];
        
        for (const selector of fallbackSelectors) {
            const items = document.querySelectorAll(selector);
            if (items.length > 0) {
                items.forEach(item => {
                    const product = this.extractBasicProductData(item);
                    if (this.validateProduct(product)) {
                        this.extractedData.products.push(product);
                    }
                });
                break;
            }
        }
    }

    /**
     * 提取基本商品数据（备用方法）
     */
    extractBasicProductData(element) {
        return {
            title: this.extractFromElement(element, 'a[title], .title, h3, h4', 'text') || '',
            price: this.extractFromElement(element, '.price, .money, [class*="price"]', 'text') || '',
            image: this.extractFromElement(element, 'img', 'src') || '',
            link: this.extractFromElement(element, 'a', 'href') || '',
            supplier: this.extractFromElement(element, '.company, .shop, .supplier', 'text') || '',
            sales_volume: this.extractSalesVolume(element) || ''
        };
    }

    /**
     * 验证商品数据
     */
    validateProduct(product) {
        const requiredFields = this.rules.validation_rules.required_fields;
        return requiredFields.every(field => product[field] && product[field].trim() !== '');
    }

    /**
     * 通用元素查找方法
     */
    findElements(selector) {
        try {
            const elements = document.querySelectorAll(selector);
            return Array.from(elements);
        } catch (error) {
            console.warn(`选择器 ${selector} 无效:`, error);
            return [];
        }
    }

    /**
     * 从元素中提取文本或属性
     */
    extractFromElement(element, selector, attribute = 'text') {
        try {
            const targetElement = selector ? element.querySelector(selector) : element;
            if (!targetElement) return null;
            
            if (attribute === 'text') {
                return targetElement.textContent?.trim() || null;
            } else {
                return targetElement.getAttribute(attribute) || null;
            }
        } catch (error) {
            return null;
        }
    }

    /**
     * 提取文本内容
     */
    extractText(selector) {
        try {
            const element = document.querySelector(selector);
            return element ? element.textContent.trim() : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * 提取属性值
     */
    extractAttribute(selector, attribute) {
        try {
            const element = document.querySelector(selector);
            return element ? element.getAttribute(attribute) : null;
        } catch (error) {
            return null;
        }
    }

    /**
     * 获取嵌套对象属性
     */
    getNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    /**
     * 提取销量信息
     */
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

// 使用示例
(async function() {
    try {
        // 加载提取规则
        const response = await fetch(chrome.runtime.getURL('assets/extraction_rules.json'));
        const rules = await response.json();
        
        // 创建提取器实例
        const extractor = new ContentExtractor(rules);
        
        // 执行提取
        const extractedData = await extractor.extract();
        
        console.log('提取的数据:', extractedData);
        
        // 发送数据到后台脚本或弹出窗口
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                action: 'contentExtracted',
                data: extractedData
            });
        }
        
    } catch (error) {
        console.error('内容提取器初始化失败:', error);
    }
})();

// 导出类（如果在模块环境中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentExtractor;
}