import { Schema, model, Document } from 'mongoose';

// 搜索页商品项接口
export interface ISearchProductItem {
  title: string;
  price: string;
  currency: string;
  product_url: string;
  image_url?: string;
  supplier_name?: string;
  supplier_url?: string;
  sales_info?: string;
  rating?: number;
  review_count?: number;
  location?: string;
}

// 搜索页数据接口
export interface ISearchPageData extends Document {
  search_url: string;
  search_keyword: string;
  platform: 'alibaba' | 'ozon' | 'other';
  html_storage_id: string; // 关联的HTML存储记录ID
  products: ISearchProductItem[];
  pagination_info: {
    current_page: number;
    total_pages?: number;
    total_results?: number;
    has_next_page: boolean;
    next_page_url?: string;
  };
  metadata: {
    parsed_at: Date;
    products_count: number;
    parse_duration_ms: number;
    parser_version: string;
  };
  is_processed: boolean; // 是否已触发商品详情收集
  processing_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  processing_errors: string[];
  created_at: Date;
  updated_at: Date;
}

// 搜索页商品项模式
const searchProductItemSchema = new Schema<ISearchProductItem>({
  title: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  product_url: {
    type: String,
    required: true
  },
  image_url: String,
  supplier_name: String,
  supplier_url: String,
  sales_info: String,
  rating: Number,
  review_count: Number,
  location: String
}, { _id: false });

// 搜索页数据模式
const searchPageDataSchema = new Schema<ISearchPageData>({
  search_url: {
    type: String,
    required: true,
    index: true
  },
  search_keyword: {
    type: String,
    required: true,
    index: true
  },
  platform: {
    type: String,
    enum: ['alibaba', 'ozon', 'other'],
    required: true,
    index: true
  },
  html_storage_id: {
    type: String,
    required: true,
    ref: 'HtmlStorage'
  },
  products: [searchProductItemSchema],
  pagination_info: {
    current_page: {
      type: Number,
      required: true
    },
    total_pages: Number,
    total_results: Number,
    has_next_page: {
      type: Boolean,
      required: true
    },
    next_page_url: String
  },
  metadata: {
    parsed_at: {
      type: Date,
      required: true
    },
    products_count: {
      type: Number,
      required: true
    },
    parse_duration_ms: {
      type: Number,
      required: true
    },
    parser_version: {
      type: String,
      required: true
    }
  },
  is_processed: {
    type: Boolean,
    default: false,
    index: true
  },
  processing_status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed'],
    default: 'pending',
    index: true
  },
  processing_errors: [{
    type: String
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// 创建复合索引
searchPageDataSchema.index({ platform: 1, is_processed: 1 });
searchPageDataSchema.index({ processing_status: 1, created_at: -1 });
searchPageDataSchema.index({ search_keyword: 1, platform: 1 });

export const SearchPageData = model<ISearchPageData>('SearchPageData', searchPageDataSchema);