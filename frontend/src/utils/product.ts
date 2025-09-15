import { Product } from '@/types/product';

/**
 * 格式化价格为中文货币格式
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
  }).format(price);
};

/**
 * 计算原价（基于折扣百分比）
 */
export const calculateOriginalPrice = (price: number, discountPercentage: number): number => {
  return price / (1 - discountPercentage / 100);
};

/**
 * 获取平台显示名称
 */
export const getPlatformDisplayName = (platform: string): string => {
  const platformNames: Record<string, string> = {
    '1688': '1688',
    'taobao': '淘宝',
    'tmall': '天猫',
  };
  return platformNames[platform] || platform.toUpperCase();
};

/**
 * 获取平台样式类名
 */
export const getPlatformClassName = (platform: string): string => {
  const platformColors: Record<string, string> = {
    '1688': 'bg-orange-100 text-orange-800',
    'taobao': 'bg-red-100 text-red-800',
    'tmall': 'bg-red-100 text-red-800',
  };
  return platformColors[platform] || 'bg-gray-100 text-gray-800';
};



/**
 * 过滤商品
 */
export const filterProducts = (
  products: Product[],
  searchTerm: string,
  selectedCategory: string,
  selectedPlatform: string
): Product[] => {
  return products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.specifications.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'all' || product.source.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });
};

/**
 * 从商品列表中提取唯一的分类
 */
export const extractCategories = (products: Product[]): string[] => {
  const cats = Array.from(new Set(products.map(p => p.category)));
  return cats.filter(cat => cat && cat !== '未分类');
};

/**
 * 从商品列表中提取唯一的平台
 */
export const extractPlatforms = (products: Product[]): string[] => {
  return Array.from(new Set(products.map(p => p.source.platform)));
};