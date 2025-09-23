import * as cheerio from 'cheerio';
// 1688商品解析器
export const alibaba1688ProductParser = {
    platform: 'alibaba',
    canParse: (url) => {
        return url.includes('1688.com') && (url.includes('/offer/') || url.includes('detail.1688.com'));
    },
    parse: async (html, url) => {
        const startTime = Date.now();
        try {
            const $ = cheerio.load(html);
            // 提取标题 - 参考浏览器扩展的多选择器策略
            let title = '';
            // 优先从h1标签中提取商品标题
            const titleH1Elements = $('h1');
            titleH1Elements.each((_, el) => {
                const text = $(el).text().trim();
                const titleAttr = $(el).attr('title');
                // 优先使用title属性，如果没有则使用文本内容
                const candidateTitle = titleAttr || text;
                if (candidateTitle && candidateTitle.length > 3) {
                    // 检查是否是商品标题（包含商品相关关键词或者长度合适）
                    if (candidateTitle.includes('商品') || candidateTitle.includes('产品') ||
                        candidateTitle.length > 10 ||
                        /[\u4e00-\u9fa5]{3,}/.test(candidateTitle)) {
                        title = candidateTitle;
                        console.log(`标题提取成功，h1选择器: ${candidateTitle}`);
                        return false; // break
                    }
                }
            });
            // 如果h1中没找到合适的标题，使用原有的多选择器策略
            if (!title) {
                const titleSelectors = [
                    '.title-text',
                    '[title]',
                    'h3',
                    '.title',
                    'a[title]',
                    '.offer-title',
                    '.product-title',
                    '.item-title',
                    '[data-title]',
                    '.name',
                    '.product-name'
                ];
                // 首先尝试从商品容器中查找
                const productContainers = [
                    '.search-offer-wrapper',
                    '.offer-item',
                    '.offer-wrapper',
                    '[data-offer-id]',
                    '.list-item',
                    '.sm-offer-item',
                    '.offer-card'
                ];
                // 尝试从商品容器中提取标题
                for (const containerSelector of productContainers) {
                    const containers = $(containerSelector);
                    if (containers.length > 0) {
                        const firstContainer = containers.first();
                        for (const titleSelector of titleSelectors) {
                            const element = firstContainer.find(titleSelector).first();
                            if (element.length > 0) {
                                title = element.attr('title') || element.text().trim();
                                if (title && title.length > 3) {
                                    console.log(`标题提取成功，容器: ${containerSelector}, 选择器: ${titleSelector}`);
                                    break;
                                }
                            }
                        }
                        if (title)
                            break;
                    }
                }
                // 如果从容器中没找到，尝试全局查找
                if (!title) {
                    for (const selector of titleSelectors) {
                        const element = $(selector).first();
                        if (element.length > 0) {
                            title = element.attr('title') || element.text().trim();
                            if (title && title.length > 3) {
                                console.log(`标题提取成功，全局选择器: ${selector}`);
                                break;
                            }
                        }
                    }
                }
                // 如果还没找到，尝试从title标签提取
                if (!title) {
                    title = $('title').text().trim();
                    if (title) {
                        console.log('从title标签提取标题成功');
                    }
                }
            }
            // 从meta description提取描述
            let description = $('meta[name="description"]').attr('content')?.trim();
            if (!description) {
                description = $('.description-content').text().trim() ||
                    $('.offer-description').text().trim() ||
                    $('.detail-desc').text().trim() ||
                    $('.product-desc').text().trim();
            }
            // 提取价格信息 - 改进的价格提取逻辑
            let price = 0;
            // 定义scriptTags变量供后续使用
            const scriptTags = $('script').toArray();
            // 优先从div标签中提取价格信息
            const priceDivs = $('div');
            priceDivs.each((_, el) => {
                const $div = $(el);
                const text = $div.text().trim();
                const className = $div.attr('class') || '';
                const id = $div.attr('id') || '';
                // 检查是否是价格相关的div
                if ((className.includes('price') || id.includes('price') ||
                    text.includes('¥') || text.includes('￥') || text.includes('元')) &&
                    text.length < 50) {
                    // 提取价格数字
                    const priceMatch = text.match(/[\d,]+\.?\d*/);
                    if (priceMatch) {
                        const extractedPrice = parseFloat(priceMatch[0].replace(/,/g, ''));
                        if (extractedPrice > 0 && extractedPrice < 999999) {
                            price = extractedPrice;
                            console.log(`价格提取成功，div选择器: ${extractedPrice}`);
                            return false; // break
                        }
                    }
                }
            });
            // 如果div中没找到价格，尝试从JavaScript变量中提取价格数据
            if (price === 0) {
                for (const script of scriptTags) {
                    const scriptContent = $(script).html() || '';
                    // 查找价格相关的JavaScript变量
                    const priceMatches = [
                        /price["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                        /现价["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                        /原价["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                        /¥\s*(\d+\.?\d*)/g,
                        /"price"\s*:\s*"?(\d+\.?\d*)"?/gi,
                        /unitPrice["\']?\s*:\s*["\']?(\d+\.?\d*)/gi
                    ];
                    for (const regex of priceMatches) {
                        const matches = scriptContent.match(regex);
                        if (matches) {
                            for (const match of matches) {
                                const priceMatch = match.match(/(\d+\.?\d*)/);
                                if (priceMatch && priceMatch[1]) {
                                    const extractedPrice = parseFloat(priceMatch[1]);
                                    if (extractedPrice > 0 && extractedPrice < 999999) {
                                        price = extractedPrice;
                                        break;
                                    }
                                }
                            }
                            if (price > 0)
                                break;
                        }
                    }
                    if (price > 0)
                        break;
                }
            }
            // 如果JavaScript中没找到价格，尝试DOM选择器
            if (price === 0) {
                const priceSelectors = [
                    '.price-now', '.price-original', '.offer-price',
                    '.price', '.fd-clr', '[class*="price"]',
                    '.price-range', '.price-value', '.current-price',
                    '.sale-price', '.unit-price', '.offer-unit-price',
                    '[data-role="price"]', '.price-text'
                ];
                for (const selector of priceSelectors) {
                    const priceElements = $(selector);
                    priceElements.each((_, el) => {
                        const priceText = $(el).text().trim();
                        if (priceText) {
                            const extractedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
                            if (extractedPrice > 0 && extractedPrice < 999999) {
                                price = extractedPrice;
                                return false; // break
                            }
                        }
                    });
                    if (price > 0)
                        break;
                }
            }
            // 提取图片 - 改进的图片提取逻辑
            const images = [];
            // 优先从v-detail-h标签中提取图片
            const vDetailElements = $('v-detail-h');
            vDetailElements.each((_, el) => {
                const $element = $(el);
                // 查找v-detail-h内的图片
                $element.find('img').each((_, img) => {
                    const src = $(img).attr('src') || $(img).attr('data-src') || $(img).attr('data-lazy');
                    if (src && !images.includes(src)) {
                        const fullSrc = src.startsWith('//') ? `https:${src}` :
                            src.startsWith('/') ? `https://detail.1688.com${src}` : src;
                        if (fullSrc.match(/\.(jpg|jpeg|png|webp)/i)) {
                            images.push(fullSrc);
                        }
                    }
                });
                // 也检查v-detail-h元素本身是否有背景图片
                const bgImage = $element.css('background-image');
                if (bgImage && bgImage !== 'none') {
                    const urlMatch = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                    if (urlMatch && urlMatch[1] && !images.includes(urlMatch[1])) {
                        const fullSrc = urlMatch[1].startsWith('//') ? `https:${urlMatch[1]}` :
                            urlMatch[1].startsWith('/') ? `https://detail.1688.com${urlMatch[1]}` : urlMatch[1];
                        if (fullSrc.match(/\.(jpg|jpeg|png|webp)/i)) {
                            images.push(fullSrc);
                        }
                    }
                }
            });
            // 如果v-detail-h中没找到图片，使用原有的图片提取逻辑
            if (images.length === 0) {
                const imageSelectors = [
                    '.image-list img', '.offer-image img', '.main-image img',
                    '.product-image img', '[class*="image"] img',
                    '.gallery img', '.photo img', '.pic img',
                    'img[src*="jpg"]', 'img[src*="jpeg"]',
                    'img[src*="png"]', 'img[src*="webp"]'
                ];
                imageSelectors.forEach(selector => {
                    $(selector).each((_, el) => {
                        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
                        if (src && !images.includes(src)) {
                            const fullSrc = src.startsWith('//') ? `https:${src}` :
                                src.startsWith('/') ? `https://detail.1688.com${src}` : src;
                            if (fullSrc.match(/\.(jpg|jpeg|png|webp)/i)) {
                                images.push(fullSrc);
                            }
                        }
                    });
                });
            }
            // 提取供应商信息 - 改进的供应商提取逻辑
            let supplierName = '';
            let supplierLocation = '';
            let shippingCost = '';
            // 优先使用h1标签提取供应商信息
            const supplierH1Elements = $('h1');
            supplierH1Elements.each((_, el) => {
                const text = $(el).text().trim();
                // 过滤掉商品标题，寻找供应商相关的h1
                if (text && text.length > 0 && text.length < 100 &&
                    !text.includes('商品') && !text.includes('产品') &&
                    !text.includes('价格') && !text.includes('规格')) {
                    // 检查是否包含供应商相关关键词或者是公司名称格式
                    if (text.includes('公司') || text.includes('厂') || text.includes('店') ||
                        text.includes('有限') || text.includes('集团') || text.includes('企业') ||
                        /^[A-Za-z\u4e00-\u9fa5]{2,20}$/.test(text)) {
                        supplierName = text;
                        return false; // break
                    }
                }
            });
            // 如果h1中没找到，尝试从JavaScript变量中提取供应商信息
            if (!supplierName) {
                for (const script of scriptTags) {
                    const scriptContent = $(script).html() || '';
                    const supplierMatches = [
                        /companyName["\']?\s*:\s*["\'](.*?)["\']/gi,
                        /supplierName["\']?\s*:\s*["\'](.*?)["\']/gi,
                        /shopName["\']?\s*:\s*["\'](.*?)["\']/gi,
                        /company["\']?\s*:\s*["\'](.*?)["\']/gi
                    ];
                    for (const regex of supplierMatches) {
                        const match = scriptContent.match(regex);
                        if (match && match[0]) {
                            const nameMatch = match[0].match(/["\'](.*?)["\']/);
                            if (nameMatch && nameMatch[1]) {
                                supplierName = nameMatch[1];
                                break;
                            }
                        }
                    }
                    if (supplierName)
                        break;
                }
            }
            // 如果JavaScript中没找到，尝试DOM选择器
            if (!supplierName) {
                const supplierSelectors = [
                    '.supplier-name', '.company-name', '.shop-name',
                    '.seller-name', '.store-name', '[class*="supplier"]',
                    '[class*="company"]', '[class*="shop"]'
                ];
                for (const selector of supplierSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text && text.length > 0 && text.length < 100) {
                        supplierName = text;
                        break;
                    }
                }
            }
            // 提取供应商位置和运费信息
            // 优先从span标签中提取发货地和运费信息
            const spanElements = $('span');
            spanElements.each((_, el) => {
                const $span = $(el);
                const text = $span.text().trim();
                const className = $span.attr('class') || '';
                const id = $span.attr('id') || '';
                // 检查是否是发货地相关的span
                if (!supplierLocation && text && text.length > 0 && text.length < 50) {
                    if (text.includes('发货') || text.includes('发出') || text.includes('地区') ||
                        text.includes('省') || text.includes('市') || text.includes('县') ||
                        className.includes('location') || className.includes('address') ||
                        id.includes('location') || id.includes('address')) {
                        // 提取地区信息，去除"发货"等前缀
                        const locationMatch = text.replace(/发货|发出|地区|：|:/g, '').trim();
                        if (locationMatch && locationMatch.length > 1) {
                            supplierLocation = locationMatch;
                        }
                    }
                }
                // 检查是否是运费相关的span
                if (!shippingCost && text && text.length > 0 && text.length < 50) {
                    if (text.includes('运费') || text.includes('邮费') || text.includes('快递费') ||
                        text.includes('包邮') || text.includes('免邮') ||
                        className.includes('shipping') || className.includes('freight') ||
                        id.includes('shipping') || id.includes('freight')) {
                        shippingCost = text;
                    }
                }
                // 如果都找到了就退出循环
                if (supplierLocation && shippingCost) {
                    return false; // break
                }
            });
            // 如果span中没找到发货地，尝试原有的选择器
            if (!supplierLocation) {
                const locationSelectors = [
                    '.supplier-location', '.company-location', '.shop-location',
                    '.address', '.location', '[class*="location"]',
                    '[class*="address"]'
                ];
                for (const selector of locationSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text && text.length > 0 && text.length < 50) {
                        supplierLocation = text;
                        break;
                    }
                }
            }
            // 提取销售数据 - 改进的销量提取逻辑
            let salesVolume = 0;
            let reviewCount = 0;
            // 尝试从JavaScript变量中提取销量信息
            for (const script of scriptTags) {
                const scriptContent = $(script).html() || '';
                const salesMatches = [
                    /销量["\']?\s*:\s*["\']?(\d+)/gi,
                    /成交["\']?\s*:\s*["\']?(\d+)/gi,
                    /sold["\']?\s*:\s*["\']?(\d+)/gi,
                    /salesCount["\']?\s*:\s*["\']?(\d+)/gi,
                    /transactionCount["\']?\s*:\s*["\']?(\d+)/gi
                ];
                for (const regex of salesMatches) {
                    const match = scriptContent.match(regex);
                    if (match) {
                        const numberMatch = match[0].match(/(\d+)/);
                        if (numberMatch && numberMatch[1]) {
                            salesVolume = parseInt(numberMatch[1]);
                            break;
                        }
                    }
                }
                if (salesVolume > 0)
                    break;
            }
            // 如果JavaScript中没找到，尝试DOM选择器
            if (salesVolume === 0) {
                const salesSelectors = [
                    '.sales-count', '.transaction-count', '.sold-count',
                    '[class*="sales"]', '[class*="sold"]', '[class*="transaction"]'
                ];
                for (const selector of salesSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text) {
                        const number = parseInt(text.replace(/[^\d]/g, ''));
                        if (number > 0) {
                            salesVolume = number;
                            break;
                        }
                    }
                }
            }
            // 提取评论数
            const reviewSelectors = [
                '.review-count', '.comment-count', '.feedback-count',
                '[class*="review"]', '[class*="comment"]', '[class*="feedback"]'
            ];
            for (const selector of reviewSelectors) {
                const text = $(selector).first().text().trim();
                if (text) {
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    if (number > 0) {
                        reviewCount = number;
                        break;
                    }
                }
            }
            // 提取规格信息 - 改进的规格提取逻辑
            const specifications = {};
            // 优先从div标签中提取规格信息
            const specDivs = $('div');
            specDivs.each((_, el) => {
                const $div = $(el);
                const text = $div.text().trim();
                // 查找包含规格信息的div
                if (text && text.length > 5 && text.length < 200) {
                    // 检查是否包含规格相关的关键词和格式
                    const specPatterns = [
                        /([^:：]+)[：:]([^:：\n]+)/g, // 键值对格式：key:value
                        /([^=]+)=([^=\n]+)/g, // 键值对格式：key=value
                        /([^|]+)\|([^|\n]+)/g, // 键值对格式：key|value
                    ];
                    for (const pattern of specPatterns) {
                        const matches = text.matchAll(pattern);
                        for (const match of matches) {
                            const key = match[1]?.trim();
                            const value = match[2]?.trim();
                            if (key && value && key.length < 50 && value.length < 200 &&
                                !key.includes('http') && !value.includes('http')) {
                                specifications[key] = value;
                            }
                        }
                    }
                    // 检查是否是规格列表格式的div
                    const children = $div.children();
                    if (children.length >= 2) {
                        children.each((index, child) => {
                            if (index % 2 === 0 && index + 1 < children.length) {
                                const key = $(child).text().trim();
                                const value = $(children[index + 1]).text().trim();
                                if (key && value && key.length < 50 && value.length < 200) {
                                    specifications[key] = value;
                                }
                            }
                        });
                    }
                }
            });
            // 尝试从表格中提取规格
            $('table tr, .spec-table tr, .attr-table tr').each((_, row) => {
                const cells = $(row).find('td, th');
                if (cells.length >= 2) {
                    const key = $(cells[0]).text().trim();
                    const value = $(cells[1]).text().trim();
                    if (key && value && key.length < 50 && value.length < 200) {
                        specifications[key] = value;
                    }
                }
            });
            // 尝试从列表中提取规格
            $('.spec-list .spec-item, .attr-list .attr-item').each((_, el) => {
                const key = $(el).find('.spec-key, .attr-key, .label').first().text().trim();
                const value = $(el).find('.spec-value, .attr-value, .value').first().text().trim();
                if (key && value && key.length < 50 && value.length < 200) {
                    specifications[key] = value;
                }
            });
            const productData = {
                platform: 'alibaba',
                platform_product_id: extractProductId(url),
                basic_info: {
                    title: title || '未知商品',
                    description: description || '暂无描述',
                    category: '未分类',
                    images,
                    specifications
                },
                pricing: {
                    current_price: price,
                    currency: 'CNY',
                    price_history: []
                },
                sales_data: {
                    sales_volume: salesVolume,
                    review_count: reviewCount,
                    rating: 0
                },
                supplier: {
                    name: supplierName || '未知供应商',
                    location: supplierLocation || '未知地区',
                    rating: 0
                },
                collection_meta: {
                    collected_at: new Date(),
                    collection_duration: Date.now() - startTime,
                    data_completeness: calculateCompleteness({
                        title, description, price, images, supplierName
                    })
                }
            };
            return {
                success: true,
                data: productData,
                parse_duration_ms: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown parsing error',
                parse_duration_ms: Date.now() - startTime
            };
        }
    }
};
// Ozon商品解析器
export const ozonProductParser = {
    platform: 'ozon',
    canParse: (url) => {
        return url.includes('ozon.ru') || url.includes('ozon.com');
    },
    parse: async (html, url) => {
        const startTime = Date.now();
        try {
            const $ = cheerio.load(html);
            // 提取商品标题 - 改进的标题提取逻辑
            let title = $('title').text().trim();
            if (!title) {
                title = $('h1').first().text().trim() ||
                    $('.product-title').text().trim() ||
                    $('[data-widget="webProductHeading"] h1').text().trim() ||
                    $('.item-title').text().trim() ||
                    $('.product-name').text().trim();
            }
            // 提取描述 - 改进的描述提取逻辑
            let description = $('meta[name="description"]').attr('content')?.trim();
            if (!description) {
                description = $('.product-description').text().trim() ||
                    $('.item-description').text().trim() ||
                    $('.description').text().trim() ||
                    $('.product-info').text().trim();
            }
            // 提取价格信息 - 改进的价格提取逻辑
            let price = 0;
            // 尝试从JavaScript变量中提取价格数据
            const scriptTags = $('script').toArray();
            for (const script of scriptTags) {
                const scriptContent = $(script).html() || '';
                // 查找价格相关的JavaScript变量
                const priceMatches = [
                    /price["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                    /цена["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                    /стоимость["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                    /₽\s*(\d+\.?\d*)/g,
                    /"price"\s*:\s*"?(\d+\.?\d*)"?/gi,
                    /finalPrice["\']?\s*:\s*["\']?(\d+\.?\d*)/gi,
                    /currentPrice["\']?\s*:\s*["\']?(\d+\.?\d*)/gi
                ];
                for (const regex of priceMatches) {
                    const matches = scriptContent.match(regex);
                    if (matches) {
                        for (const match of matches) {
                            const priceMatch = match.match(/(\d+\.?\d*)/);
                            if (priceMatch && priceMatch[1]) {
                                const extractedPrice = parseFloat(priceMatch[1]);
                                if (extractedPrice > 0 && extractedPrice < 9999999) {
                                    price = extractedPrice;
                                    break;
                                }
                            }
                        }
                        if (price > 0)
                            break;
                    }
                }
                if (price > 0)
                    break;
            }
            // 如果JavaScript中没找到价格，尝试DOM选择器
            if (price === 0) {
                const priceSelectors = [
                    '.price-current', '.price-final', '.price-now',
                    '.price', '[class*="price"]', '.cost',
                    '.product-price', '.item-price', '.current-price',
                    '[data-widget="webPrice"]', '.price-value',
                    '.sale-price', '.final-price'
                ];
                for (const selector of priceSelectors) {
                    const priceElements = $(selector);
                    priceElements.each((_, el) => {
                        const priceText = $(el).text().trim();
                        if (priceText) {
                            const extractedPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
                            if (extractedPrice > 0 && extractedPrice < 9999999) {
                                price = extractedPrice;
                                return false; // break
                            }
                        }
                    });
                    if (price > 0)
                        break;
                }
            }
            // 提取图片 - 改进的图片提取逻辑
            const images = [];
            const imageSelectors = [
                '.product-images img', '.item-images img', '.gallery img',
                '.product-photo img', '[class*="image"] img',
                '.photo img', '.pic img', '.thumbnail img',
                'img[src*="jpg"]', 'img[src*="jpeg"]',
                'img[src*="png"]', 'img[src*="webp"]'
            ];
            imageSelectors.forEach(selector => {
                $(selector).each((_, el) => {
                    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy');
                    if (src && !images.includes(src)) {
                        const fullSrc = src.startsWith('//') ? `https:${src}` :
                            src.startsWith('/') ? `https://ozon.ru${src}` : src;
                        if (fullSrc.match(/\.(jpg|jpeg|png|webp)/i)) {
                            images.push(fullSrc);
                        }
                    }
                });
            });
            // 提取供应商信息 - 改进的供应商提取逻辑
            let supplierName = '';
            let supplierLocation = '';
            // 尝试从JavaScript变量中提取供应商信息
            for (const script of scriptTags) {
                const scriptContent = $(script).html() || '';
                const supplierMatches = [
                    /sellerName["\']?\s*:\s*["\'](.*?)["\']/gi,
                    /brandName["\']?\s*:\s*["\'](.*?)["\']/gi,
                    /shopName["\']?\s*:\s*["\'](.*?)["\']/gi,
                    /seller["\']?\s*:\s*["\'](.*?)["\']/gi,
                    /brand["\']?\s*:\s*["\'](.*?)["\']/gi
                ];
                for (const regex of supplierMatches) {
                    const match = scriptContent.match(regex);
                    if (match && match[0]) {
                        const nameMatch = match[0].match(/["\'](.*?)["\']/);
                        if (nameMatch && nameMatch[1]) {
                            supplierName = nameMatch[1];
                            break;
                        }
                    }
                }
                if (supplierName)
                    break;
            }
            // 如果JavaScript中没找到，尝试DOM选择器
            if (!supplierName) {
                const supplierSelectors = [
                    '.seller-name', '.brand-name', '.shop-name',
                    '.supplier-name', '.store-name', '[class*="seller"]',
                    '[class*="brand"]', '[class*="shop"]', '.vendor'
                ];
                for (const selector of supplierSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text && text.length > 0 && text.length < 100) {
                        supplierName = text;
                        break;
                    }
                }
            }
            // 提取供应商位置
            const locationSelectors = [
                '.seller-location', '.shop-location', '.store-location',
                '.address', '.location', '[class*="location"]',
                '[class*="address"]', '.region'
            ];
            for (const selector of locationSelectors) {
                const text = $(selector).first().text().trim();
                if (text && text.length > 0 && text.length < 50) {
                    supplierLocation = text;
                    break;
                }
            }
            // 提取销售数据 - 改进的销量提取逻辑
            let salesVolume = 0;
            let reviewCount = 0;
            let rating = 0;
            // 尝试从JavaScript变量中提取销量信息
            for (const script of scriptTags) {
                const scriptContent = $(script).html() || '';
                const salesMatches = [
                    /продано["\']?\s*:\s*["\']?(\d+)/gi,
                    /sold["\']?\s*:\s*["\']?(\d+)/gi,
                    /salesCount["\']?\s*:\s*["\']?(\d+)/gi,
                    /ordersCount["\']?\s*:\s*["\']?(\d+)/gi
                ];
                for (const regex of salesMatches) {
                    const match = scriptContent.match(regex);
                    if (match) {
                        const numberMatch = match[0].match(/(\d+)/);
                        if (numberMatch && numberMatch[1]) {
                            salesVolume = parseInt(numberMatch[1]);
                            break;
                        }
                    }
                }
                if (salesVolume > 0)
                    break;
            }
            // 如果JavaScript中没找到，尝试DOM选择器
            if (salesVolume === 0) {
                const salesSelectors = [
                    '.sales-count', '.sold-count', '.orders-count',
                    '[class*="sales"]', '[class*="sold"]', '[class*="orders"]'
                ];
                for (const selector of salesSelectors) {
                    const text = $(selector).first().text().trim();
                    if (text) {
                        const number = parseInt(text.replace(/[^\d]/g, ''));
                        if (number > 0) {
                            salesVolume = number;
                            break;
                        }
                    }
                }
            }
            // 提取评论数和评分
            const reviewSelectors = [
                '.reviews-count', '.review-count', '.comments-count',
                '[class*="review"]', '[class*="comment"]', '[class*="feedback"]'
            ];
            for (const selector of reviewSelectors) {
                const text = $(selector).first().text().trim();
                if (text) {
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    if (number > 0) {
                        reviewCount = number;
                        break;
                    }
                }
            }
            // 提取评分
            const ratingSelectors = [
                '.rating-value', '.star-rating', '.score',
                '[class*="rating"]', '[class*="star"]', '[class*="score"]'
            ];
            for (const selector of ratingSelectors) {
                const text = $(selector).first().text().trim();
                if (text) {
                    const ratingValue = parseFloat(text.replace(/[^\d.]/g, ''));
                    if (ratingValue > 0 && ratingValue <= 5) {
                        rating = ratingValue;
                        break;
                    }
                }
            }
            // 提取规格信息 - 改进的规格提取逻辑
            const specifications = {};
            // 尝试从表格中提取规格
            $('table tr, .specs-table tr, .characteristics tr').each((_, row) => {
                const cells = $(row).find('td, th');
                if (cells.length >= 2) {
                    const key = $(cells[0]).text().trim();
                    const value = $(cells[1]).text().trim();
                    if (key && value && key.length < 50 && value.length < 200) {
                        specifications[key] = value;
                    }
                }
            });
            // 尝试从列表中提取规格
            $('.specs-list .spec-item, .characteristics .char-item').each((_, el) => {
                const key = $(el).find('.spec-key, .char-key, .label').first().text().trim();
                const value = $(el).find('.spec-value, .char-value, .value').first().text().trim();
                if (key && value && key.length < 50 && value.length < 200) {
                    specifications[key] = value;
                }
            });
            const productData = {
                platform: 'ozon',
                platform_product_id: extractProductId(url),
                basic_info: {
                    title: title || '未知商品',
                    description: description || '暂无描述',
                    category: '未分类',
                    images,
                    specifications: {}
                },
                pricing: {
                    current_price: price,
                    currency: 'RUB',
                    price_history: []
                },
                sales_data: {
                    sales_volume: 0,
                    review_count: reviewCount,
                    rating
                },
                supplier: {
                    name: 'Ozon',
                    location: 'Russia',
                    rating: 0
                },
                collection_meta: {
                    collected_at: new Date(),
                    collection_duration: Date.now() - startTime,
                    data_completeness: calculateCompleteness({
                        title, description, price, images, rating
                    })
                }
            };
            return {
                success: true,
                data: productData,
                parse_duration_ms: Date.now() - startTime
            };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown parsing error',
                parse_duration_ms: Date.now() - startTime
            };
        }
    }
};
// 工具函数
const extractProductId = (url) => {
    const match = url.match(/\/(\d+)\.html/) || url.match(/product\/([^\/\?]+)/);
    if (match && match[1]) {
        return match[1];
    }
    const pathParts = url.split('/').filter(part => part.length > 0);
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart || 'unknown';
};
const calculateCompleteness = (data) => {
    const fields = Object.values(data);
    const nonEmptyFields = fields.filter(field => field !== null && field !== undefined && field !== '' &&
        (Array.isArray(field) ? field.length > 0 : true));
    return nonEmptyFields.length / fields.length;
};
// 解析器注册表
export const productParsers = [
    alibaba1688ProductParser,
    ozonProductParser
];
// 获取适合的解析器 - 改进的自动识别逻辑
export const getProductParser = (url, html) => {
    // 首先基于URL进行识别
    for (const parser of productParsers) {
        if (parser.canParse(url)) {
            return parser;
        }
    }
    // 如果URL识别失败，尝试基于HTML内容识别
    if (html) {
        // 检查HTML中的平台特征
        if (html.includes('1688.com') ||
            html.includes('alibaba') ||
            html.includes('detail.1688') ||
            html.includes('offer.1688')) {
            return alibaba1688ProductParser;
        }
        if (html.includes('ozon.ru') ||
            html.includes('ozone.ru') ||
            html.includes('data-widget="web') ||
            html.includes('ozon-')) {
            return ozonProductParser;
        }
    }
    return null;
};
// 智能平台识别函数
export const identifyPlatform = (url, html) => {
    // URL优先识别
    if (url.includes('1688.com') || url.includes('alibaba.com')) {
        return '1688';
    }
    if (url.includes('ozon.ru') || url.includes('ozone.ru')) {
        return 'ozon';
    }
    // HTML内容识别
    if (html) {
        const htmlLower = html.toLowerCase();
        // 1688特征
        const features1688 = [
            '1688.com', 'alibaba', 'detail.1688', 'offer.1688',
            'window.g_config', 'pvArgs', 'tmall', 'taobao'
        ];
        // Ozon特征
        const featuresOzon = [
            'ozon.ru', 'ozone.ru', 'data-widget="web', 'ozon-',
            'webProductHeading', 'webPrice', 'webGallery'
        ];
        const count1688 = features1688.filter(feature => htmlLower.includes(feature)).length;
        const countOzon = featuresOzon.filter(feature => htmlLower.includes(feature)).length;
        if (count1688 > countOzon && count1688 > 0) {
            return '1688';
        }
        if (countOzon > count1688 && countOzon > 0) {
            return 'ozon';
        }
    }
    return 'unknown';
};
//# sourceMappingURL=productParser.js.map