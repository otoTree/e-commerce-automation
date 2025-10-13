/**
 * 1688商品数据提取器
 * 提供从HTML页面或window.context对象中提取商品数据的方法
 */

import { ProductContext, ProductVariant, BuyerProtection, ProtectionInfo } from './product-data-analysis';
import { extractAndParseContext } from '../utils/robust-json-parser';
import { extractContextFromHTML as extractContextFromHTMLProduction, validateContextData } from '../utils/production-context-parser';

// ===== 核心数据提取接口 =====

export interface ExtractedProductData {
  // 基本信息
  productId: string;
  title: string;
  seller: string;
  
  // SKU信息
  variants: ProductVariantSimplified[];
  
  // 价格信息
  price?: string;
  
  // 商品图片
  images?: ProductImage[];
  
  // 物流信息
  shipping: {
    location: string;
    targetLocation: string;
    cost: number;
    deliveryPromise: string;
    freeShipping: boolean;
  };
  
  // 服务保障
  protections: ServiceProtection[];
  
  // 商品详情
  description?: {
    detailUrl?: string;
    images?: string[];
  };
  
  // 新增：特征属性（从featureAttributes提取）
  featureAttributes?: FeatureAttribute[];
  
  // 元数据
  metadata: {
    extractedAt: Date;
    source: 'html' | 'context';
    offerId: number;
  };
}

export interface ProductVariantSimplified {
  skuId: number;
  color: string;
  type: 'with_backrest' | 'without_backrest';
  weight: number; // 克
  fullName: string;
  // 新增属性字段
  dimensions?: {
    length?: number; // 长度(cm)
    width?: number;  // 宽度(cm)
    height?: number; // 高度(cm)
    volume?: number; // 体积(cm³)
  };
  attributes?: Record<string, any>; // 完整的属性值映射
}

// 新增商品图片接口
export interface ProductImage {
  fullPathImageURI: string;
  imageURI: string;
  searchImageURI: string;
  size220x220ImageURI: string;
  size310x310ImageURI: string;
  summImageURI: string;
  // 添加更多可能的图片字段
  url?: string;
  src?: string;
  originalUrl?: string;
  thumbnailUrl?: string;
}

// 新增商品属性定义接口
export interface ProductAttribute {
  fid: number;
  name: string;
  label: string;
  precision: number;
  type?: 'dimension' | 'weight' | 'color' | 'text' | 'number';
}

// 新增特征属性接口（从featureAttributes提取）
export interface FeatureAttribute {
  fid: number;
  isSpecial: boolean;
  lectotype: boolean;
  name: string;
  outputType: number;
  value: string;
  values: string[];
}

export interface ServiceProtection {
  code: string;
  name: string;
  description: string;
  type: 'insurance' | 'protect';
  enabled: boolean;
}

// ===== 主要提取函数 =====

/**
 * 从HTML字符串中提取商品数据
 */
export const extractProductDataFromHTML = (htmlContent: string): ExtractedProductData | null => {
  try {
    // 提取window.context数据
    const contextData = extractContextFromHTML(htmlContent);
    
    if (contextData) {
      return extractProductDataFromContext(contextData, htmlContent);
    } else {
      // 如果无法提取context，尝试从HTML中提取基本信息
      console.warn('无法提取window.context，尝试从HTML中提取基本信息');
      return extractBasicDataFromHTML(htmlContent);
    }
  } catch (error) {
    console.error('HTML数据提取失败:', error);
    return null;
  }
};

/**
 * 提取商品ID
 */
const extractProductId = (htmlContent: string): string => {
  const offerIdMatch = htmlContent.match(/offerId['":\s]*(\d+)/);
  return offerIdMatch ? offerIdMatch[1] : '';
};

/**
 * 从HTML直接提取基本数据（备用方案）
 */
const extractBasicDataFromHTML = (htmlContent: string): ExtractedProductData | null => {
  try {
    // 提取商品ID
    const offerIdMatch = htmlContent.match(/offerId['":\s]*(\d+)/);
    const productId = offerIdMatch ? offerIdMatch[1] : '';
    
    // 提取标题
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)</);
    const title = titleMatch ? titleMatch[1].replace(/\s*-\s*阿里巴巴.*$/, '').trim() : '';
    
    // 提取卖家信息并解码Unicode
    const sellerMatch = htmlContent.match(/offerLoginId['":\s]*["']([^"']+)["']/);
    let seller = sellerMatch ? sellerMatch[1] : '';
    if (seller) {
      seller = decodeUnicodeString(seller);
    }
    
    // 提取价格信息（取第一个有效价格）
    let price: string | undefined;
    const priceMatches = htmlContent.match(/"price":\s*"([^"]+)"/g);
    if (priceMatches && priceMatches.length > 0) {
      const firstPriceMatch = priceMatches[0].match(/"price":\s*"([^"]+)"/);
      if (firstPriceMatch) {
        price = firstPriceMatch[1];
      }
    }
    
    // 提取变体信息
    const variants: ProductVariantSimplified[] = [];
    let attributeDefinitions: ProductAttribute[] = [];
    let images: ProductImage[] = [];
    
    const variantMatches = htmlContent.match(/"pieceWeightScaleInfo":\s*\[(.*?)\]/s);
    if (variantMatches) {
      // 提取属性定义
      const columnListMatch = htmlContent.match(/"columnList":\s*\[(.*?)\]/s);
      if (columnListMatch) {
        try {
          const columnListStr = `[${columnListMatch[1]}]`;
          const columns = JSON.parse(columnListStr);
          attributeDefinitions = columns.map((col: any) => ({
            fid: col.fid || 0,
            name: col.name || '',
            label: col.label || '',
            precision: col.precision || 0,
            type: getAttributeType(col.name, col.label)
          }));
        } catch (error) {
          console.warn('解析属性定义失败:', error);
        }
      }
      
      // 增强的变体提取模式，包含更多属性
      const variantPattern = /\{\s*"volume":\s*([\d.]+)[^}]*"sku1":\s*"([^"]+)"[^}]*"length":\s*([\d.]+)[^}]*"width":\s*([\d.]+)[^}]*"weight":\s*(\d+)[^}]*"skuId":\s*(\d+)[^}]*"height":\s*([\d.]+)[^}]*\}/g;
      let match;
      
      while ((match = variantPattern.exec(variantMatches[1])) !== null) {
        const volume = parseFloat(match[1]);
        const sku1 = match[2];
        const length = parseFloat(match[3]);
        const width = parseFloat(match[4]);
        const weight = parseInt(match[5]);
        const skuId = parseInt(match[6]);
        const height = parseFloat(match[7]);
        const color = extractColorFromSku(sku1);
        
        variants.push({
          skuId,
          color,
          weight,
          fullName: sku1,
          type: sku1.includes('靠背') ? 'with_backrest' : 'without_backrest',
          dimensions: {
            length: length > 0 ? length : undefined,
            width: width > 0 ? width : undefined,
            height: height > 0 ? height : undefined,
            volume: volume > 0 ? volume : undefined
          },
          attributes: {
            sku1,
            volume,
            length,
            width,
            height,
            weight,
            // 根据attributeDefinitions映射完整的属性值
            ...(attributeDefinitions.reduce((acc, attr) => {
              switch(attr.name) {
                case 'sku1': acc[attr.label || attr.name] = sku1; break;
                case 'length': acc[attr.label || attr.name] = length; break;
                case 'width': acc[attr.label || attr.name] = width; break;
                case 'height': acc[attr.label || attr.name] = height; break;
                case 'volume': acc[attr.label || attr.name] = volume; break;
                case 'weight': acc[attr.label || attr.name] = weight; break;
              }
              return acc;
            }, {} as Record<string, any>))
          }
        });
      }
      
      // 如果增强模式没有匹配到，回退到原始模式
      if (variants.length === 0) {
        const fallbackPattern = /\{\s*"volume":[^}]*"sku1":\s*"([^"]+)"[^}]*"weight":\s*(\d+)[^}]*"skuId":\s*(\d+)[^}]*\}/g;
        let fallbackMatch;
        
        while ((fallbackMatch = fallbackPattern.exec(variantMatches[1])) !== null) {
          const sku1 = fallbackMatch[1];
          const weight = parseInt(fallbackMatch[2]);
          const skuId = parseInt(fallbackMatch[3]);
          const color = extractColorFromSku(sku1);
          
          variants.push({
            skuId,
            color,
            weight,
            fullName: sku1,
            type: sku1.includes('靠背') ? 'with_backrest' : 'without_backrest',
            attributes: {
              sku1,
              weight
            }
          });
        }
      }
    }
    
    // 提取物流信息
    const locationMatch = htmlContent.match(/"location":\s*"([^"]+)"/);
    const targetLocationMatch = htmlContent.match(/"targetLocation":\s*"([^"]+)"/);
    const totalCostMatch = htmlContent.match(/"totalCost":\s*([\d.]+)/);
    const deliveryPromiseMatch = htmlContent.match(/"deliveryLimitText":\s*"([^"]+)"/);
    
    const shipping = {
      location: locationMatch ? locationMatch[1] : '',
      targetLocation: targetLocationMatch ? targetLocationMatch[1] : '',
      cost: totalCostMatch ? parseFloat(totalCostMatch[1]) : 0,
      deliveryPromise: deliveryPromiseMatch ? deliveryPromiseMatch[1] : '',
      freeShipping: false
    };
    
    // 提取服务保障（去重）
    const protections: ServiceProtection[] = [];
    const protectionMatches = htmlContent.match(/"serviceName":\s*"([^"]+)"/g);
    if (protectionMatches) {
      const uniqueServices = new Set<string>();
      protectionMatches.forEach(match => {
        const serviceName = match.match(/"serviceName":\s*"([^"]+)"/)?.[1];
        if (serviceName && !uniqueServices.has(serviceName)) {
          uniqueServices.add(serviceName);
          protections.push({
            code: '',
            name: serviceName,
            description: serviceName,
            type: serviceName.includes('退货') || serviceName.includes('退款') ? 'protect' : 'insurance',
            enabled: true
          });
        }
      });
    }
    
    // 提取featureAttributes（新增）
    let featureAttributes: FeatureAttribute[] = [];
    if (htmlContent) {
      try {
        const featureAttributesIndex = htmlContent.indexOf('featureAttributes');
        if (featureAttributesIndex !== -1) {
          const startIndex = htmlContent.indexOf('[', featureAttributesIndex);
          if (startIndex !== -1) {
            const arrayContent = extractFeatureAttributesArray(htmlContent, startIndex);
            if (arrayContent) {
              const rawAttributes = JSON.parse(arrayContent);
              // 验证和补全featureAttributes数据
              featureAttributes = validateAndFixFeatureAttributes(rawAttributes);
            }
          }
        }
      } catch (error) {
        console.warn('提取featureAttributes失败:', error);
      }
    }

    return {
    productId,
    title,
    seller,
    variants,
    price,
    images,
    shipping,
    protections,
    featureAttributes, // 新增
    metadata: {
      extractedAt: new Date(),
      source: 'html',
      offerId: parseInt(productId) || 0
    }
  };
  } catch (error) {
    console.error('从HTML提取完整数据失败:', error);
    return null;
  }
};

/**
 * 从window.context对象中提取商品数据
 * 增强容错性，处理部分数据缺失的情况
 */
export const extractProductDataFromContext = (context: ProductContext, htmlContent?: string): ExtractedProductData => {
  const data = context.result?.data;
  
  // 提取基本信息
  const basicInfo = extractBasicInfo(context, htmlContent);
  
  // 安全地提取各种数据，如果某个部分失败不影响其他部分
  let variants: ProductVariantSimplified[] = [];
  let attributeDefinitions: ProductAttribute[] = [];
  let images: ProductImage[] = [];
  let shipping: any = {
    location: '',
    targetLocation: '',
    cost: 0,
    deliveryPromise: '',
    freeShipping: false
  };
  let protections: ServiceProtection[] = [];
  let description: any = undefined;
  
  try {
    // 尝试提取SKU变体信息和属性定义
    if (data?.productPackInfo) {
      variants = extractVariants(data.productPackInfo);
      
      // 提取属性定义
      if (htmlContent) {
        const columnListMatch = htmlContent.match(/"columnList":\s*\[(.*?)\]/s);
        if (columnListMatch) {
          try {
            const columnListStr = `[${columnListMatch[1]}]`;
            const columns = JSON.parse(columnListStr);
            attributeDefinitions = columns.map((col: any) => ({
              fid: col.fid || 0,
              name: col.name || '',
              label: col.label || '',
              precision: col.precision || 0,
              type: getAttributeType(col.name, col.label)
            }));
          } catch (error) {
            console.warn('解析属性定义失败:', error);
          }
        }
      }
      
      // 提取商品图片 - 增强版
      if (htmlContent) {
        // 方法1: 从"imageList"字段提取（优先级最高）
        const imageListMatch = htmlContent.match(/"imageList":\s*\[(.*?)\]/s);
        if (imageListMatch) {
          try {
            const imageListStr = `[${imageListMatch[1]}]`;
            const imageList = JSON.parse(imageListStr);
            images = imageList.map((img: any) => ({
              fullPathImageURI: img.fullPathImageURI || '',
              imageURI: img.imageURI || '',
              searchImageURI: img.searchImageURI || '',
              size220x220ImageURI: img.size220x220ImageURI || '',
              size310x310ImageURI: img.size310x310ImageURI || '',
              summImageURI: img.summImageURI || '',
              url: img.url || img.fullPathImageURI || img.imageURI || '',
              src: img.src || img.imageURI || '',
              originalUrl: img.originalUrl || img.fullPathImageURI || '',
              thumbnailUrl: img.thumbnailUrl || img.size220x220ImageURI || ''
            }));
          } catch (error) {
            console.warn('解析imageList信息失败:', error);
          }
        }

        // 方法2: 从"images"字段提取
        if (images.length === 0) {
          const imageListMatch2 = htmlContent.match(/"images":\s*\[(.*?)\]/s);
          if (imageListMatch2) {
            try {
              const imageListStr = `[${imageListMatch2[1]}]`;
              const imageList = JSON.parse(imageListStr);
              images = imageList.map((img: any) => ({
                fullPathImageURI: img.fullPathImageURI || '',
                imageURI: img.imageURI || '',
                searchImageURI: img.searchImageURI || '',
                size220x220ImageURI: img.size220x220ImageURI || '',
                size310x310ImageURI: img.size310x310ImageURI || '',
                summImageURI: img.summImageURI || '',
                url: img.url || img.fullPathImageURI || img.imageURI || '',
                src: img.src || img.imageURI || '',
                originalUrl: img.originalUrl || img.fullPathImageURI || '',
                thumbnailUrl: img.thumbnailUrl || img.size220x220ImageURI || ''
              }));
            } catch (error) {
              console.warn('解析图片信息失败:', error);
            }
          }
        }

        // 方法3: 从window.context中提取图片数据（更全面的路径搜索）
        if (images.length === 0) {
          const contextMatch = htmlContent.match(/window\.context\s*=.*?(\{.*\});/s);
          if (contextMatch) {
            try {
              const contextStr = contextMatch[1];
              const context = JSON.parse(contextStr);
              
              // 尝试从不同路径提取图片，包括imageList
              const imagePaths = [
                'result.data.imageList',
                'result.data.productPackInfo.imageList',
                'result.data.description.fields.images',
                'result.data.productPackInfo.fields.images',
                'result.data.images',
                'data.imageList',
                'data.images',
                'imageList',
                'images'
              ];

              for (const path of imagePaths) {
                const pathParts = path.split('.');
                let current = context;
                
                for (const part of pathParts) {
                  if (current && current[part]) {
                    current = current[part];
                  } else {
                    current = null;
                    break;
                  }
                }

                if (current && Array.isArray(current) && current.length > 0) {
                  images = current.map((img: any) => ({
                    fullPathImageURI: img.fullPathImageURI || img.url || img.src || '',
                    imageURI: img.imageURI || img.url || img.src || '',
                    searchImageURI: img.searchImageURI || img.url || img.src || '',
                    size220x220ImageURI: img.size220x220ImageURI || img.thumbnailUrl || img.url || '',
                    size310x310ImageURI: img.size310x310ImageURI || img.url || img.src || '',
                    summImageURI: img.summImageURI || img.thumbnailUrl || img.url || '',
                    url: img.url || img.fullPathImageURI || img.imageURI || '',
                    src: img.src || img.imageURI || img.url || '',
                    originalUrl: img.originalUrl || img.fullPathImageURI || img.url || '',
                    thumbnailUrl: img.thumbnailUrl || img.size220x220ImageURI || img.url || ''
                  }));
                  break;
                }
              }
            } catch (error) {
              console.warn('从window.context提取图片失败:', error);
            }
          }
        }

        // 方法4: 从HTML中的img标签提取（作为最后的备选方案）
        if (images.length === 0) {
          const imgTagMatches = htmlContent.match(/<img[^>]+src="([^"]+)"[^>]*>/g);
          if (imgTagMatches) {
            const imgUrls = imgTagMatches
              .map(tag => {
                const srcMatch = tag.match(/src="([^"]+)"/);
                return srcMatch ? srcMatch[1] : null;
              })
              .filter(url => url && url.includes('img.alicdn.com'))
              .slice(0, 10); // 限制最多10张图片

            images = imgUrls.map(url => ({
              fullPathImageURI: url || '',
              imageURI: url || '',
              searchImageURI: url || '',
              size220x220ImageURI: url || '',
              size310x310ImageURI: url || '',
              summImageURI: url || '',
              url: url || '',
              src: url || '',
              originalUrl: url || '',
              thumbnailUrl: url || ''
            }));
          }
        }
      }
    }
  } catch (error) {
    console.warn('提取变体信息失败:', error);
  }
  
  try {
    // 尝试提取物流信息
    if (data?.shippingServices) {
      shipping = extractShippingInfo(data.shippingServices);
    }
  } catch (error) {
    console.warn('提取物流信息失败:', error);
  }
  
  try {
    // 尝试提取服务保障
    if (data?.shippingServices) {
      protections = extractProtections(data.shippingServices);
    }
  } catch (error) {
    console.warn('提取服务保障失败:', error);
  }
  
  try {
    // 尝试提取商品详情
    if (data?.description) {
      description = extractDescription(data.description);
    }
  } catch (error) {
    console.warn('提取商品详情失败:', error);
  }

  // 提取featureAttributes（新增）
  let featureAttributes: FeatureAttribute[] = [];
  if (htmlContent) {
    try {
      const featureAttributesIndex = htmlContent.indexOf('featureAttributes');
      if (featureAttributesIndex !== -1) {
        const startIndex = htmlContent.indexOf('[', featureAttributesIndex);
        if (startIndex !== -1) {
          const arrayContent = extractFeatureAttributesArray(htmlContent, startIndex);
          if (arrayContent) {
            const rawAttributes = JSON.parse(arrayContent);
            // 验证和补全featureAttributes数据
            featureAttributes = validateAndFixFeatureAttributes(rawAttributes);
          }
        }
      }
    } catch (error) {
      console.warn('提取featureAttributes失败:', error);
    }
  }

  return {
    ...basicInfo,
    variants,
    images,
    shipping,
    protections,
    description,
    featureAttributes, // 新增
    metadata: {
      extractedAt: new Date(),
      source: 'context',
      offerId: basicInfo.productId ? parseInt(basicInfo.productId) : 0,
    },
  };
};

// ===== 辅助提取函数 =====

/**
 * 解码Unicode转义字符
 */
const decodeUnicodeString = (str: string): string => {
  try {
    // 处理双重转义的Unicode字符 \\\\u -> \\u
    let decoded = str.replace(/\\\\u([0-9a-fA-F]{4})/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    // 处理单重转义的Unicode字符 \\u -> 字符
    decoded = decoded.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
      return String.fromCharCode(parseInt(code, 16));
    });
    
    return decoded;
  } catch (error) {
    console.warn('Unicode解码失败:', error);
    return str;
  }
};

/**
 * 从字符串中提取关键数据
 */
const extractKeyDataFromString = (contextStr: string): ProductContext => {
  // 提取offerId
  const offerIdMatch = contextStr.match(/"offerId":\s*(\d+)/);
  const offerId = offerIdMatch ? parseInt(offerIdMatch[1]) : 0;
  
  // 提取offerLoginId (seller)
  const sellerMatch = contextStr.match(/"offerLoginId":\s*"([^"]+)"/);
  const seller = sellerMatch ? decodeUnicodeString(sellerMatch[1]) : '';
  
  // 提取价格信息
  let price: number | undefined;
  
  // 尝试从skuRangePrices提取价格
  const skuRangePricesMatch = contextStr.match(/"skuRangePrices":\s*\[([^\]]+)\]/);
  if (skuRangePricesMatch) {
    const priceMatch = skuRangePricesMatch[1].match(/"price":\s*"([^"]+)"/);
    if (priceMatch) {
      price = parseFloat(priceMatch[1]);
    }
  }
  
  // 如果没有找到skuRangePrices中的价格，尝试其他价格字段
  if (!price) {
    const generalPriceMatch = contextStr.match(/"price":\s*"([^"]+)"/);
    if (generalPriceMatch) {
      price = parseFloat(generalPriceMatch[1]);
    }
  }
  
  // 构建简化的ProductContext
  return {
    result: {
      data: {
        globalConfig: {
          offerId,
          offerLoginId: seller
        },
        productPackInfo: { fields: {} },
        shippingServices: { fields: {} },
        description: { fields: {} },
        screen: { fields: {} },
        widgets: { fields: {} },
        cart: { fields: {} },
        chromePlugin: { fields: {} },
        shopProductCombine: { fields: {} },
        shopProductRecommend: { fields: {} },
        userRights: { fields: {} },
        customMade: { fields: {} },
        mainServices: { fields: {} }
      }
    }
  } as unknown as ProductContext;
};

/**
 * 解析JSON中的$ref引用
 */
const resolveJsonReferences = (jsonStr: string): string => {
  // 处理$ref引用，将其替换为实际的值
  // 例如: "skuWeight":{"$ref":"$.result.data.shippingServices.fields.freightInfo.skuWeight"}
  
  try {
    // 先尝试解析JSON以获取完整对象
    const tempObj = JSON.parse(jsonStr);
    
    // 递归解析$ref引用
    const resolveRefs = (obj: any, root: any): any => {
      if (typeof obj === 'object' && obj !== null) {
        if (Array.isArray(obj)) {
          return obj.map(item => resolveRefs(item, root));
        } else {
          const result: any = {};
          for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && '$ref' in value) {
              // 解析$ref路径
              const refPath = (value as any).$ref as string;
              const resolvedValue = getValueByPath(root, refPath);
              result[key] = resolvedValue !== undefined ? resolvedValue : value;
            } else {
              result[key] = resolveRefs(value, root);
            }
          }
          return result;
        }
      }
      return obj;
    };
    
    const resolved = resolveRefs(tempObj, tempObj);
    return JSON.stringify(resolved);
  } catch (error) {
    // 如果解析失败，尝试简单的字符串替换
    console.warn('复杂$ref解析失败，使用简单替换:', error);
    
    // 移除所有$ref引用，用空对象替换
    return jsonStr.replace(/\{\s*"\$ref"\s*:\s*"[^"]+"\s*\}/g, '{}');
  }
};

/**
 * 根据路径获取对象中的值
 */
const getValueByPath = (obj: any, path: string): any => {
  if (!path || !path.startsWith('$.')) return undefined;
  
  const keys = path.substring(2).split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
};

/**
 * 从HTML中提取window.context数据
 */
const extractContextFromHTML = (htmlContent: string): ProductContext | null => {
  try {
    // 优先使用生产环境解析器
    console.log('🚀 使用生产环境解析器提取window.context数据');
    const productionContext = extractContextFromHTMLProduction(htmlContent);
    
    if (productionContext && validateContextData(productionContext)) {
      console.log('✅ 生产环境解析器成功提取并验证数据');
      return productionContext as ProductContext;
    }
    
    // 备用方案：使用原有的强大JSON解析器
    console.log('生产环境解析器未成功，尝试原有解析器...');
    const parsedContext = extractAndParseContext(htmlContent);
    
    if (parsedContext) {
      console.log('✅ 原有解析器成功提取window.context数据');
      return parsedContext as ProductContext;
    }
    
    console.log('所有解析器都未找到数据，尝试备用方案...');
    
    // 备用方案：查找window.FE_GLOBALS
    const feGlobalsMatch = htmlContent.match(/window\.FE_GLOBALS\s*=\s*(\{[^}]*\{[^}]*\}[^}]*\})/s);
    if (feGlobalsMatch) {
      console.log('找到window.FE_GLOBALS，尝试构建兼容的context结构');
      try {
        const feGlobals = JSON.parse(feGlobalsMatch[1]);
        const mockContext = {
          result: {
            data: {
              globalConfig: feGlobals,
              productPackInfo: { fields: {} },
              shippingServices: { fields: {} },
              description: { fields: {} },
              screen: { fields: {} },
              widgets: { fields: {} },
              cart: { fields: {} },
              chromePlugin: { fields: {} },
              shopProductCombine: { fields: {} },
              shopProductRecommend: { fields: {} },
              userRights: { fields: {} },
              customMade: { fields: {} },
              mainServices: { fields: {} }
            }
          }
        };
        return mockContext as unknown as ProductContext;
      } catch (error) {
        console.warn('解析FE_GLOBALS失败:', error);
      }
    }
    
    // 最后的备用方案：从脚本中提取基本信息
    const scriptMatches = htmlContent.match(/<script[^>]*>(.*?)<\/script>/gs);
    if (scriptMatches) {
      for (const script of scriptMatches) {
        if (script.includes('offerId') && script.includes('offerLoginId')) {
          console.log('找到包含商品数据的脚本块');
          const offerIdMatch = script.match(/offerId:\s*(\d+)/);
          const sellerMatch = script.match(/offerLoginId:\s*"([^"]+)"/);
          
          if (offerIdMatch && sellerMatch) {
            const mockContext = {
              result: {
                data: {
                  globalConfig: {
                    offerId: parseInt(offerIdMatch[1]),
                    offerLoginId: decodeUnicodeString(sellerMatch[1])
                  },
                  productPackInfo: { fields: {} },
                  shippingServices: { fields: {} },
                  description: { fields: {} },
                  screen: { fields: {} },
                  widgets: { fields: {} },
                  cart: { fields: {} },
                  chromePlugin: { fields: {} },
                  shopProductCombine: { fields: {} },
                  shopProductRecommend: { fields: {} },
                  userRights: { fields: {} },
                  customMade: { fields: {} },
                  mainServices: { fields: {} }
                }
              }
            };
            return mockContext as unknown as ProductContext;
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('解析window.context失败:', error);
    return null;
  }
};

/**
 * 提取基本信息
 */
const extractBasicInfo = (context: ProductContext, htmlContent?: string) => {
  let productId = '';
  let seller = '';
  let price = '';
  
  // 尝试从context字符串中解析基本信息
  const contextStr = JSON.stringify(context);
  const globalMatch = contextStr.match(/offerId[":]*\s*(\d+)/);
  const sellerMatch = contextStr.match(/offerLoginId[":]*\s*"([^"]+)"/);
  
  productId = globalMatch?.[1] || '';
  // 对seller字段进行Unicode解码
  seller = sellerMatch?.[1] ? decodeUnicodeString(sellerMatch[1]) : '';
  
  // 提取价格信息 - 优先从skuRangePrices中获取
  const skuRangePricesMatch = contextStr.match(/"skuRangePrices":\s*\[([^\]]+)\]/);
  if (skuRangePricesMatch) {
    // 从skuRangePrices中提取第一个价格
    const priceMatch = skuRangePricesMatch[1].match(/"price":\s*"([^"]+)"/);
    if (priceMatch) {
      price = priceMatch[1];
    }
  }
  
  // 如果没有找到skuRangePrices，尝试从其他price字段中获取
  if (!price) {
    const generalPriceMatch = contextStr.match(/"price":\s*"([^"]+)"/);
    if (generalPriceMatch) {
      price = generalPriceMatch[1];
    }
  }
  
  // 如果还是没有找到，尝试从HTML中提取
  if (!productId && htmlContent) {
    const htmlOfferMatch = htmlContent.match(/offerId:\s*(\d+)/);
    const htmlSellerMatch = htmlContent.match(/offerLoginId:\s*"([^"]+)"/);
    productId = htmlOfferMatch?.[1] || '';
    // 对从HTML提取的seller字段也进行Unicode解码
    seller = htmlSellerMatch?.[1] ? decodeUnicodeString(htmlSellerMatch[1]) : '';
  }
  
  return {
    productId,
    title: extractTitleFromHTML(htmlContent) || '',
    seller,
    price: price || undefined,
  };
};

/**
 * 从HTML标题中提取商品标题
 */
const extractTitleFromHTML = (htmlContent?: string): string => {
  if (htmlContent) {
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].replace(' - 阿里巴巴', '').trim();
    }
  }
  return '';
};

/**
 * 动态提取属性定义
 */
const extractAttributeDefinitions = (data: any): ProductAttribute[] => {
  const attributeDefinitions: ProductAttribute[] = [];
  
  // 从 columnList 提取属性定义
  const columnList = data?.productPackInfo?.fields?.pieceWeightScale?.columnList;
  if (columnList && Array.isArray(columnList)) {
    columnList.forEach((col: any) => {
      if (col.name && col.label) {
        attributeDefinitions.push({
          fid: col.fid || 0,
          name: col.name,
          label: col.label,
          precision: col.precision || 0,
          type: getAttributeType(col.name, col.label)
        });
      }
    });
  }
  
  // 如果没有找到属性定义，创建默认的通用属性
  if (attributeDefinitions.length === 0) {
    const defaultAttributes = [
      { name: 'sku1', label: '规格', type: 'text' },
      { name: 'color', label: '颜色', type: 'color' },
      { name: 'weight', label: '重量', type: 'weight' },
      { name: 'price', label: '价格', type: 'price' }
    ];
    
    defaultAttributes.forEach((attr, index) => {
      attributeDefinitions.push({
        fid: index,
        name: attr.name,
        label: attr.label,
        precision: 0,
        type: attr.type as any
      });
    });
  }
  
  return attributeDefinitions;
};

/**
 * 动态映射变体属性
 */
const mapVariantAttributes = (variant: any, attributeDefinitions: ProductAttribute[]): Record<string, any> => {
  const attributes: Record<string, any> = {};
  
  // 基于属性定义动态映射
  attributeDefinitions.forEach(attr => {
    let value: any = undefined;
    
    // 根据属性名称映射值
    switch (attr.name) {
      case 'sku1':
        value = variant.sku1 || variant.fullName || '';
        break;
      case 'color':
        value = variant.color || extractColorFromSku(variant.sku1 || '');
        break;
      case 'weight':
        value = variant.weight;
        break;
      case 'length':
        value = variant.length;
        break;
      case 'width':
        value = variant.width;
        break;
      case 'height':
        value = variant.height;
        break;
      case 'volume':
        value = variant.volume;
        break;
      case 'price':
        value = variant.price;
        break;
      default:
        // 尝试直接从变体对象中获取值
        value = variant[attr.name];
        break;
    }
    
    // 使用标签作为键名，如果值存在的话
    if (value !== undefined && value !== null) {
      attributes[attr.label] = value;
    }
  });
  
  return attributes;
};

/**
 * 提取SKU变体信息
 */
const extractVariants = (productPackInfo: any): ProductVariantSimplified[] => {
  if (!productPackInfo?.fields?.pieceWeightScale?.pieceWeightScaleInfo) {
    return [];
  }

  // 提取属性定义
  const attributeDefinitions = extractAttributeDefinitions({ productPackInfo });

  return productPackInfo.fields.pieceWeightScale.pieceWeightScaleInfo.map((variant: any) => {
    const color = extractColorFromSku(variant.sku1);
    const type = variant.sku1.includes('靠背') ? 'with_backrest' : 'without_backrest';
    
    // 动态映射属性
    const attributes = mapVariantAttributes(variant, attributeDefinitions);
    
    // 构建尺寸对象（只包含有值的尺寸）
    const dimensions: Record<string, any> = {};
    ['length', 'width', 'height', 'volume'].forEach(dim => {
      if (variant[dim] !== undefined && variant[dim] !== null && variant[dim] !== 0) {
        dimensions[dim] = variant[dim];
      }
    });
    
    return {
      skuId: variant.skuId,
      color,
      type,
      weight: variant.weight,
      fullName: variant.sku1,
      dimensions: Object.keys(dimensions).length > 0 ? dimensions : undefined,
      attributes
    };
  });
};

/**
 * 从SKU名称中提取颜色
 */
const extractColorFromSku = (skuName: string): string => {
  const colorMatch = skuName.match(/^([^\s]+)/);
  return colorMatch?.[1] || '';
};

/**
 * 提取物流信息
 */
const extractShippingInfo = (shippingServices: any) => {
  const fields = shippingServices?.fields || {};
  const freightInfo = fields.freightInfo || {};
  
  return {
    location: freightInfo.location || fields.location || '',
    targetLocation: freightInfo.recieveAddress || fields.targetLocation || '',
    cost: freightInfo.totalCost || fields.totalCost || 0,
    deliveryPromise: fields.deliveryLimitText || '',
    freeShipping: freightInfo.freeDeliverFee || fields.freeDeliverFee || false,
  };
};

/**
 * 提取服务保障信息
 */
const extractProtections = (shippingServices: any): ServiceProtection[] => {
  const protectionInfos = shippingServices?.fields?.protectionInfos || [];
  
  return protectionInfos.map((protection: ProtectionInfo) => ({
    code: protection.serviceCode,
    name: protection.serviceName,
    description: protection.description,
    type: protection.type as 'insurance' | 'protect',
    enabled: true,
  }));
};

/**
 * 提取商品详情信息
 */
const extractDescription = (description: any) => {
  if (!description?.fields) {
    return undefined;
  }

  return {
    detailUrl: description.fields.detailUrl,
    images: [], // 需要额外的图片提取逻辑
  };
};

// ===== 数据验证和清理函数 =====

/**
 * 验证提取的数据是否有效
 * 放宽验证规则，提高对缺失数据的容错性
 */
export const validateExtractedData = (data: ExtractedProductData): boolean => {
  // 只要有基本的商品ID或标题，就认为是有效的
  const hasBasicInfo = !!(data.productId || data.title);
  
  // 记录缺失的字段，但不阻止数据通过验证
  const missingFields = [];
  if (!data.productId) missingFields.push('productId');
  if (!data.title) missingFields.push('title');
  if (!data.seller) missingFields.push('seller');
  if (data.variants.length === 0) missingFields.push('variants');
  if (!data.shipping.location) missingFields.push('shipping.location');
  
  if (missingFields.length > 0) {
    console.warn('数据验证警告 - 缺失字段:', missingFields.join(', '));
  }
  
  return hasBasicInfo;
};

/**
 * 清理和标准化提取的数据
 * 为缺失的字段提供默认值，提高数据完整性
 */
export const cleanExtractedData = (data: ExtractedProductData): ExtractedProductData => {
  return {
    ...data,
    // 基本信息清理和默认值
    productId: data.productId || '',
    title: (data.title || '').trim() || '未知商品',
    seller: (data.seller || '').trim() || '未知卖家',
    
    // 变体信息清理
    variants: data.variants?.map(variant => ({
      ...variant,
      color: (variant.color || '').trim() || '默认',
      fullName: (variant.fullName || '').trim() || `SKU-${variant.skuId}`,
      type: variant.type || 'without_backrest',
      weight: variant.weight || 0,
      skuId: variant.skuId || 0,
    })) || [],
    
    // 物流信息清理和默认值
    shipping: {
      location: (data.shipping?.location || '').trim() || '未知发货地',
      targetLocation: (data.shipping?.targetLocation || '').trim() || '待确认',
      cost: data.shipping?.cost || 0,
      deliveryPromise: (data.shipping?.deliveryPromise || '').trim() || '按约定时间发货',
      freeShipping: data.shipping?.freeShipping || false,
    },
    
    // 服务保障清理
    protections: data.protections?.map(protection => ({
      ...protection,
      code: protection.code || '',
      name: (protection.name || '').trim() || '未知服务',
      description: (protection.description || '').trim() || '',
      type: protection.type || 'protect',
      enabled: protection.enabled || false,
    })) || [],
    
    // 价格信息
    price: data.price || undefined,
    
    // 商品详情
    description: data.description ? {
      detailUrl: data.description.detailUrl || undefined,
      images: data.description.images || [],
    } : undefined,
    
    // 元数据
    metadata: {
      extractedAt: data.metadata?.extractedAt || new Date(),
      source: data.metadata?.source || 'html',
      offerId: data.metadata?.offerId || 0,
    },
  };
};

// ===== 浏览器环境专用函数 =====

/**
 * 在浏览器环境中直接从当前页面提取数据
 * 注意：此函数仅在浏览器环境中可用
 */
export const extractFromCurrentPage = (): ExtractedProductData | null => {
  // 检查是否在浏览器环境中
  if (typeof globalThis === 'undefined' || typeof (globalThis as any).window === 'undefined') {
    console.error('此函数只能在浏览器环境中使用');
    return null;
  }

  try {
    // 尝试从window.context获取数据
    const context = ((globalThis as any).window as any).context as ProductContext;
    if (context) {
      const htmlContent = ((globalThis as any).document as any)?.documentElement?.outerHTML;
      return extractProductDataFromContext(context, htmlContent);
    }

    // 如果没有window.context，尝试从HTML解析
    const htmlContent = ((globalThis as any).document as any)?.documentElement?.outerHTML;
    if (htmlContent) {
      return extractProductDataFromHTML(htmlContent);
    }
    
    return null;
  } catch (error) {
    console.error('从当前页面提取数据失败:', error);
    return null;
  }
};

/**
 * 监听页面变化并自动提取数据
 * 注意：此函数仅在浏览器环境中可用
 */
export const createAutoExtractor = (
  callback: (data: ExtractedProductData | null) => void,
  options: { interval?: number; immediate?: boolean } = {}
) => {
  const { interval = 3000, immediate = true } = options;

  if (immediate) {
    const data = extractFromCurrentPage();
    callback(data);
  }

  const intervalId = setInterval(() => {
    const data = extractFromCurrentPage();
    callback(data);
  }, interval);

  return () => clearInterval(intervalId);
};

/**
 * 验证和修复featureAttributes数据，确保所有属性都包含必需的outputType字段
 */
const validateAndFixFeatureAttributes = (rawAttributes: any[]): FeatureAttribute[] => {
  if (!Array.isArray(rawAttributes)) {
    return [];
  }

  return rawAttributes.map((attr, index) => {
    // 确保所有必需字段都存在
    const fixedAttr: FeatureAttribute = {
      fid: attr.fid || index,
      isSpecial: attr.isSpecial || false,
      lectotype: attr.lectotype || false,
      name: attr.name || '',
      outputType: attr.outputType !== undefined ? attr.outputType : 1, // 默认outputType为1
      value: attr.value || '',
      values: Array.isArray(attr.values) ? attr.values : []
    };

    return fixedAttr;
  });
};

/**
 * 提取featureAttributes数组内容
 */
const extractFeatureAttributesArray = (htmlContent: string, startIndex: number): string | null => {
  let bracketCount = 0;
  let inString = false;
  let escapeNext = false;
  let endIndex = startIndex;
  
  for (let i = startIndex; i < htmlContent.length; i++) {
    const char = htmlContent[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '[') {
        bracketCount++;
      } else if (char === ']') {
        bracketCount--;
        if (bracketCount === 0) {
          endIndex = i + 1;
          break;
        }
      }
    }
  }
  
  if (bracketCount === 0 && endIndex > startIndex) {
    return htmlContent.substring(startIndex, endIndex);
  }
  
  return null;
};

// ===== 工具函数 =====

/**
 * 根据属性名称和标签确定属性类型
 */
const getAttributeType = (name: string, label: string): 'dimension' | 'weight' | 'color' | 'text' | 'number' => {
  const lowerName = name.toLowerCase();
  const lowerLabel = label.toLowerCase();
  
  if (lowerName.includes('length') || lowerName.includes('width') || lowerName.includes('height') || 
      lowerName.includes('volume') || lowerLabel.includes('长') || lowerLabel.includes('宽') || 
      lowerLabel.includes('高') || lowerLabel.includes('体积')) {
    return 'dimension';
  }
  
  if (lowerName.includes('weight') || lowerLabel.includes('重') || lowerLabel.includes('量')) {
    return 'weight';
  }
  
  if (lowerName.includes('color') || lowerName.includes('sku1') || lowerLabel.includes('颜色') || lowerLabel.includes('色')) {
    return 'color';
  }
  
  if (lowerName.includes('number') || lowerName.includes('count') || lowerLabel.includes('数量') || lowerLabel.includes('个数')) {
    return 'number';
  }
  
  return 'text';
};

/**
 * 格式化重量显示
 */
export const formatWeight = (weightInGrams: number): string => {
  if (weightInGrams >= 1000) {
    return `${(weightInGrams / 1000).toFixed(1)}kg`;
  }
  return `${weightInGrams}g`;
};

/**
 * 格式化价格显示
 */
export const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `¥${numPrice.toFixed(2)}`;
};

/**
 * 获取商品类型描述
 */
export const getProductTypeDescription = (type: 'with_backrest' | 'without_backrest'): string => {
  return type === 'with_backrest' ? '有靠背' : '无靠背';
};

/**
 * 按颜色分组SKU
 */
export const groupVariantsByColor = (variants: ProductVariantSimplified[]) => {
  return variants.reduce((groups, variant) => {
    const color = variant.color;
    if (!groups[color]) {
      groups[color] = [];
    }
    groups[color].push(variant);
    return groups;
  }, {} as Record<string, ProductVariantSimplified[]>);
};

/**
 * 按类型分组SKU
 */
export const groupVariantsByType = (variants: ProductVariantSimplified[]) => {
  return variants.reduce((groups, variant) => {
    const type = variant.type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(variant);
    return groups;
  }, {} as Record<string, ProductVariantSimplified[]>);
};

// ===== 导出所有函数 =====

export default {
  // 主要提取函数
  extractProductDataFromHTML,
  extractProductDataFromContext,
  extractFromCurrentPage,
  
  // 验证和清理
  validateExtractedData,
  cleanExtractedData,
  
  // 自动提取
  createAutoExtractor,
  
  // 工具函数
  formatWeight,
  formatPrice,
  getProductTypeDescription,
  groupVariantsByColor,
  groupVariantsByType,
};