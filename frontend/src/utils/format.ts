// 格式化工具函数

/**
 * 格式化价格显示
 * @param price 价格数字
 * @param currency 货币符号，默认为 ¥
 * @returns 格式化后的价格字符串
 */
export function formatPrice(price: number, currency = '¥'): string {
  if (typeof price !== 'number' || isNaN(price)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${price.toFixed(2)}`;
}

/**
 * 格式化数字，添加千分位分隔符
 * @param num 数字
 * @returns 格式化后的数字字符串
 */
export function formatNumber(num: number): string {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }
  
  return num.toLocaleString('zh-CN');
}

/**
 * 格式化日期
 * @param date 日期
 * @param format 格式类型
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string, format: 'date' | 'datetime' | 'time' = 'date'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (!(d instanceof Date) || isNaN(d.getTime())) {
    return '-';
  }
  
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Shanghai',
  };
  
  switch (format) {
    case 'datetime':
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    case 'time':
      options.hour = '2-digit';
      options.minute = '2-digit';
      break;
    default:
      options.year = 'numeric';
      options.month = '2-digit';
      options.day = '2-digit';
  }
  
  return d.toLocaleDateString('zh-CN', options);
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 截断文本
 * @param text 文本
 * @param maxLength 最大长度
 * @param suffix 后缀，默认为 ...
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number, suffix = '...'): string {
  if (!text || text.length <= maxLength) {
    return text || '';
  }
  
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * 格式化百分比
 * @param value 数值 (0-1 或 0-100)
 * @param decimals 小数位数
 * @param isDecimal 是否为小数形式 (0-1)，默认为 true
 * @returns 格式化后的百分比字符串
 */
export function formatPercentage(value: number, decimals = 1, isDecimal = true): string {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0%';
  }
  
  const percentage = isDecimal ? value * 100 : value;
  return `${percentage.toFixed(decimals)}%`;
}

/**
 * 格式化评分
 * @param rating 评分
 * @param maxRating 最高评分，默认为 5
 * @returns 格式化后的评分字符串
 */
export function formatRating(rating: number, maxRating = 5): string {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '0.0';
  }
  
  const clampedRating = Math.max(0, Math.min(rating, maxRating));
  return clampedRating.toFixed(1);
}