import { connectDB } from '../config/database.js';
import { ProductService, type CreateProductData } from '../services/productService.js';
import { config } from 'dotenv';

// Load environment variables
config();

// 示例商品数据
const sampleProducts: CreateProductData[] = [
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple iPhone 15 Pro Max，搭载A17 Pro芯片，钛金属设计，支持5G网络',
    price: 9999,
    originalPrice: 10999,
    category: '手机数码',
    brand: 'Apple',
    images: [
      'https://example.com/iphone15-1.jpg',
      'https://example.com/iphone15-2.jpg'
    ],
    specifications: {
      '屏幕尺寸': '6.7英寸',
      '存储容量': '256GB',
      '颜色': '深空黑色',
      '网络': '5G'
    },
    stock: 50,
    sku: 'IPHONE15-PRO-MAX-256GB-BLACK',
    tags: ['手机', 'Apple', '5G', '旗舰'],
    source: {
      platform: '1688',
      url: 'https://detail.1688.com/offer/example1.html'
    }
  },
  {
    name: '小米14 Ultra',
    description: '小米14 Ultra，徕卡专业摄影，骁龙8 Gen3处理器',
    price: 5999,
    originalPrice: 6499,
    category: '手机数码',
    brand: '小米',
    images: [
      'https://example.com/mi14-1.jpg',
      'https://example.com/mi14-2.jpg'
    ],
    specifications: {
      '屏幕尺寸': '6.73英寸',
      '存储容量': '512GB',
      '颜色': '钛金属银',
      '摄像头': '50MP徕卡三摄'
    },
    stock: 30,
    sku: 'MI14-ULTRA-512GB-SILVER',
    tags: ['手机', '小米', '徕卡', '摄影'],
    source: {
      platform: '淘宝',
      url: 'https://item.taobao.com/item.htm?id=example2'
    }
  },
  {
    name: 'MacBook Pro 16英寸',
    description: 'Apple MacBook Pro 16英寸，M3 Max芯片，专业级性能',
    price: 25999,
    originalPrice: 27999,
    category: '电脑办公',
    brand: 'Apple',
    images: [
      'https://example.com/macbook-1.jpg',
      'https://example.com/macbook-2.jpg'
    ],
    specifications: {
      '屏幕尺寸': '16.2英寸',
      '处理器': 'M3 Max',
      '内存': '32GB',
      '存储': '1TB SSD',
      '颜色': '深空灰色'
    },
    stock: 15,
    sku: 'MACBOOK-PRO-16-M3MAX-32GB-1TB',
    tags: ['笔记本', 'Apple', 'M3', '专业'],
    source: {
      platform: '京东',
      url: 'https://item.jd.com/example3.html'
    }
  },
  {
    name: 'AirPods Pro 3代',
    description: 'Apple AirPods Pro 第三代，主动降噪，空间音频',
    price: 1899,
    originalPrice: 1999,
    category: '数码配件',
    brand: 'Apple',
    images: [
      'https://example.com/airpods-1.jpg'
    ],
    specifications: {
      '降噪': '主动降噪',
      '续航': '6小时+24小时(充电盒)',
      '连接': '蓝牙5.3',
      '防水': 'IPX4'
    },
    stock: 100,
    sku: 'AIRPODS-PRO-3GEN-WHITE',
    tags: ['耳机', 'Apple', '降噪', '无线'],
    source: {
      platform: '天猫',
      url: 'https://detail.tmall.com/item.htm?id=example4'
    }
  },
  {
    name: '华为MateBook X Pro',
    description: '华为MateBook X Pro，13.9英寸3K触控屏，轻薄便携',
    price: 8999,
    originalPrice: 9999,
    category: '电脑办公',
    brand: '华为',
    images: [
      'https://example.com/matebook-1.jpg',
      'https://example.com/matebook-2.jpg'
    ],
    specifications: {
      '屏幕尺寸': '13.9英寸',
      '分辨率': '3000x2000',
      '处理器': 'Intel Core i7',
      '内存': '16GB',
      '存储': '512GB SSD'
    },
    stock: 25,
    sku: 'MATEBOOK-X-PRO-I7-16GB-512GB',
    tags: ['笔记本', '华为', '触控屏', '轻薄'],
    source: {
      platform: '华为商城',
      url: 'https://www.vmall.com/product/example5.html'
    }
  }
];

// 数据播种函数
async function seedDatabase() {
  try {
    console.log('开始连接数据库...');
    await connectDB();
    
    console.log('开始清理现有数据...');
    // 注意：这会删除所有现有商品数据，仅用于开发测试
    // await Product.deleteMany({});
    
    console.log('开始插入示例数据...');
    const products = await ProductService.bulkCreateProducts(sampleProducts);
    
    console.log(`成功插入 ${products.length} 个商品:`);
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ¥${product.price}`);
    });
    
    console.log('\n数据播种完成！');
    console.log('\n可以使用以下API测试:');
    console.log('- GET /api/products - 获取商品列表');
    console.log('- GET /api/products/:id - 获取单个商品');
    console.log('- GET /api/products/special/stats - 获取统计信息');
    console.log('- GET /api/products/special/popular - 获取热门商品');
    console.log('- GET /api/products/special/latest - 获取最新商品');
    
  } catch (error) {
    console.error('数据播种失败:', error);
  } finally {
    process.exit(0);
  }
}

// 如果直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase, sampleProducts };