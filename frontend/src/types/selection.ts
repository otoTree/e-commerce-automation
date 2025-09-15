// AI选品助手相关类型定义

// 选品任务状态
export type SelectionTaskStatus = 
  | 'PENDING'     // 待处理
  | 'SCRAPING'    // 爬取中
  | 'PROCESSING'  // 处理中
  | 'COMPLETED'   // 已完成
  | 'FAILED';     // 失败

// 供应商商品信息
export interface SupplierProduct {
  supplierProductId: string;    // 供应商商品ID
  source: '1688' | 'taobao';   // 来源平台
  title: string;               // 商品标题
  price: string;               // 价格
  imageUrl: string;            // 商品图片URL
  productUrl: string;          // 商品详情页URL
  similarityScore: number;     // AI计算的相似度 (0-1)
  
  // 可选的额外信息
  supplier?: {
    name: string;              // 供应商名称
    location: string;          // 供应商地址
    rating?: number;           // 供应商评分
  };
  
  // 成本核算相关
  estimatedLogisticsCost?: string;     // 预估物流成本
  estimatedTotalCost?: string;         // 预估总成本
  logisticsRecommendation?: string;    // 物流方案推荐
}

// 选品任务
export interface SelectionTask {
  taskId: string;              // 任务ID
  status: SelectionTaskStatus; // 任务状态
  message?: string;            // 状态消息
  
  // 输入信息
  input: {
    type: 'url' | 'keywords';  // 输入类型
    value: string;             // 输入值
  };
  
  // 搜索结果
  results?: SupplierProduct[];
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// 创建选品任务请求
export interface CreateSelectionTaskRequest {
  type: 'url' | 'keywords';
  value: string;
}

// 成本核算请求
export interface CostCalculationRequest {
  supplierProductIds: string[];
  logisticsQuery: string;      // 物流需求描述
}

// 成本核算结果
export interface CostCalculationResult {
  costResults: Array<{
    supplierProductId: string;
    title: string;
    purchasePrice: string;
    estimatedLogisticsCost: string;
    estimatedTotalCost: string;
    logisticsRecommendation: string;
  }>;
}

// 物流方案
export interface LogisticsOption {
  id: string;
  name: string;                // 方案名称
  provider: string;            // 物流商
  transportMode: 'air' | 'sea' | 'land' | 'express'; // 运输方式
  estimatedDays: {
    min: number;
    max: number;
  };
  pricePerKg: number;          // 每公斤价格
  minWeight: number;           // 最小重量
  description: string;         // 方案描述
}

// 最终选品决策
export interface SelectionDecision {
  finalSupplierProductId: string;
  selectedLogistics?: LogisticsOption;
  notes?: string;              // 决策备注
}