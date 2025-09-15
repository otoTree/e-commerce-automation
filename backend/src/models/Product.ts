import mongoose, { Document, Schema } from 'mongoose';

// 1688商品数据接口
export interface I1688ProductData {
  index: number;
  link: string;
  image: string;
  title: string;
  price: string;
  supplier: string | null;
  sales: string | null;
}

// 商品接口定义
export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category?: string;
  brand?: string;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  stock: number;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  source: {
    platform: string;
    url: string;
    extractedAt: Date;
    originalIndex?: number;
  };
  supplier?: string;
  sales?: string;
  createdAt: Date;
  updatedAt: Date;
  // 实例方法
  updateStock(quantity: number): Promise<IProduct>;
  addRating(rating: number): Promise<IProduct>;
}

// 商品Schema定义
const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, '商品名称是必需的'],
    trim: true,
    maxlength: [200, '商品名称不能超过200个字符']
  },
  description: {
    type: String,
    maxlength: [2000, '商品描述不能超过2000个字符']
  },
  price: {
    type: Number,
    required: [true, '商品价格是必需的'],
    min: [0, '价格不能为负数']
  },
  originalPrice: {
    type: Number,
    min: [0, '原价不能为负数']
  },
  category: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: [],
    validate: {
      validator: function(v: string[]) {
        return v.length <= 10;
      },
      message: '图片数量不能超过10张'
    }
  },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  stock: {
    type: Number,
    required: [true, '库存数量是必需的'],
    min: [0, '库存不能为负数'],
    default: 0
  },
  sku: {
    type: String,
    required: [true, 'SKU是必需的'],
    unique: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock'],
    default: 'active'
  },
  tags: {
    type: [String],
    default: []
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  source: {
    platform: {
      type: String,
      required: [true, '来源平台是必需的']
    },
    url: {
      type: String,
      required: [true, '来源URL是必需的']
    },
    extractedAt: {
      type: Date,
      default: Date.now
    },
    originalIndex: {
      type: Number
    }
  },
  supplier: {
    type: String,
    trim: true
  },
  sales: {
    type: String,
    trim: true
  }
}, {
  timestamps: true, // 自动添加createdAt和updatedAt字段
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 索引设置
ProductSchema.index({ name: 'text', description: 'text' }); // 全文搜索索引
ProductSchema.index({ category: 1 }); // 分类索引
ProductSchema.index({ brand: 1 }); // 品牌索引
ProductSchema.index({ price: 1 }); // 价格索引
ProductSchema.index({ status: 1 }); // 状态索引
ProductSchema.index({ 'source.platform': 1 }); // 来源平台索引
ProductSchema.index({ createdAt: -1 }); // 创建时间索引

// 虚拟字段：折扣百分比
ProductSchema.virtual('discountPercentage').get(function(this: IProduct) {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// 虚拟字段：是否有库存
ProductSchema.virtual('inStock').get(function(this: IProduct) {
  return this.stock > 0 && this.status === 'active';
});

// 中间件：保存前自动更新状态
ProductSchema.pre('save', function(next) {
  if (this.stock === 0 && this.status === 'active') {
    this.status = 'out_of_stock';
  }
  next();
});

// 静态方法：根据分类查找商品
ProductSchema.statics.findByCategory = function(category: string) {
  return this.find({ category, status: 'active' });
};

// 静态方法：根据品牌查找商品
ProductSchema.statics.findByBrand = function(brand: string) {
  return this.find({ brand, status: 'active' });
};

// 静态方法：价格范围查询
ProductSchema.statics.findByPriceRange = function(minPrice: number, maxPrice: number) {
  return this.find({ 
    price: { $gte: minPrice, $lte: maxPrice },
    status: 'active'
  });
};

// 实例方法：更新库存
ProductSchema.methods.updateStock = function(quantity: number) {
  this.stock = Math.max(0, this.stock + quantity);
  if (this.stock === 0) {
    this.status = 'out_of_stock';
  } else if (this.status === 'out_of_stock') {
    this.status = 'active';
  }
  return this.save();
};

// 实例方法：添加评分
ProductSchema.methods.addRating = function(rating: number) {
  const totalRating = this.rating.average * this.rating.count + rating;
  this.rating.count += 1;
  this.rating.average = totalRating / this.rating.count;
  return this.save();
};

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;