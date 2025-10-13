/**
 * 1688商品页面数据解析分析
 * 基于 /backend/1688-product.html 文件的数据结构分析
 */

// ===== 1. HTML文件结构分析 =====

/**
 * HTML文件整体结构：
 * 1. 标准HTML5文档结构
 * 2. 包含阿里巴巴1688商品详情页的完整数据
 * 3. 核心数据存储在JavaScript的window.context对象中
 * 4. 商品ID: 891956763013
 * 5. 商品标题: "网红懒人靠背椅子家用板凳万向轮圆凳带娃神器小凳子滑轮矮凳"
 */

// ===== 2. 核心数据结构 =====

/**
 * window.context 数据结构包含以下主要模块：
 */

export interface ProductContext {
  result: {
    data: {
      productPackInfo: ProductPackInfo;
      screen: ScreenInfo;
      description: ProductDescription;
      shippingServices: ShippingServices;
      widgets: WidgetsInfo;
      cart: CartInfo;
      chromePlugin: ChromePluginInfo;
      shopProductCombine: ShopProductCombineInfo;
      shopProductRecommend: ShopProductRecommendInfo;
      userRights: UserRightsInfo;
      customMade: CustomMadeInfo;
      mainServices: MainServicesInfo;
    };
  };
}

// ===== 3. 商品包装信息 (ProductPackInfo) =====

export interface ProductPackInfo {
  fields: {
    unitWeight: number;
    uiType: string;
    label: string;
    pieceWeightScale: {
      pieceWeightScaleInfo: ProductVariant[];
      columnList: ColumnDefinition[];
    };
  };
  id: string;
  meta: {
    scriptFileName: string;
  };
  position: string;
  tag: string;
  type: string;
}

export interface ProductVariant {
  volume: number;
  sku1: string; // 颜色规格，如"粉色 升级软包靠背+加厚云端坐垫"
  length: number;
  width: number;
  weight: number; // 重量(克)
  skuId: number;
  height: number;
}

export interface ColumnDefinition {
  fid?: number;
  precision: number;
  name: string;
  label: string;
}

// ===== 4. SKU变体分析 =====

/**
 * 商品SKU变体信息：
 * 
 * 有靠背款式 (重量: 2750g):
 * - 粉色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883804)
 * - 白色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883805)
 * - 灰色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883806)
 * - 绿色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883807)
 * - 橘色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883808)
 * - 黑色 升级软包靠背+加厚云端坐垫 (SKU: 5908243883809)
 * 
 * 无靠背款式 (重量: 980g):
 * - 白色 升级软包无靠背+加厚云端坐垫 (SKU: 5908243883810)
 * - 橘色 升级软包无靠背+加厚云端坐垫 (SKU: 5808321956126)
 * - 雾灰升级软包无靠背+加厚云端坐垫 (SKU: 5808321956127)
 * - 草绿升级软包无靠背+加厚云端坐垫 (SKU: 5808321956128)
 * - 天蓝升级软包无靠背+加厚云端坐垫 (SKU: 5808321956132)
 * - 暗夜黑升级软包无靠背+加厚云端坐垫 (SKU: 5808321956130)
 * - 咖啡色升级软包无靠背+加厚云端坐垫 (SKU: 5808321956134)
 * - 粉色升级软包无靠背+加厚云端坐垫 (SKU: 5808321956133)
 * - 黄色升级软包无靠背+加厚云端坐垫 (SKU: 5808321956129)
 * - 红色升级软包无靠背+加厚云端坐垫 (SKU: 5808321956131)
 */

// ===== 5. 物流配送信息 =====

export interface ShippingServices {
  fields: {
    unitWeight: number;
    buyerProtectionModel: BuyerProtection[];
    freeEndAmount: number;
    hideDeliveryTime: boolean;
    postFeeValue: number; // 运费: 3.80元
    minWeight: number;
    logistics: string;
    officialLogistics: boolean;
    templateId: number;
    targetLocation: string; // "配送至：广东省揭阳市"
    recieveAddressCode: string;
    sendAddressCode: string;
    price: string; // "10.30"
    deliveryLimitText: string; // "承诺48小时发货"
    text: string;
    freightInfo: FreightInfo;
    isSkuTradeSupported: boolean;
    trackInfo: Record<string, any>;
    buyerProtectionScene: string;
    label: string;
    isShowLogistics: boolean;
    deliveryLimitTimeModel: DeliveryLimitTimeModel;
    volume: number;
    unit: string; // "个"
    deliveryFee: string;
    startAmount: number;
    postFree: boolean;
    recieveAddress: string;
    uiType: string;
    hideLogisticsClick: boolean;
    location: string; // "浙江省金华市"
    freeDeliverFee: boolean;
    protectionInfos: ProtectionInfo[];
    totalCost: number; // 3.80
    skuWeight: Record<string, number>; // SKU ID到重量的映射
  };
}

export interface BuyerProtection {
  serviceCode: string;
  serviceShortCode: string;
  productPage?: string;
  type: string; // "insurance" | "protect"
  enabled: boolean;
  scene?: string;
  forceUseSubPtsCodes: boolean;
  serviceVersion: number;
  bizScenes?: string[];
  payerDesc?: string;
  bigLogo: string;
  middleLogo: string;
  littleLogo: string;
  shortSellerDesc: string;
  shortBuyerDesc: string;
  serviceName: string; // "退货包运费" | "7天无理由退货" | "晚发必赔" | "极速退款"
  extendInfo: Record<string, any>;
  userId: number;
  mainServiceCode?: string;
  instruction?: string;
  textDesc: string;
  logicGroupId: string;
  packageBuyerDesc?: string;
  logo?: string;
  agreementPage?: string;
  hugeLogo?: string;
  largeLogo?: string;
  moreHugeLogo?: string;
  agreeDeliveryHours?: number;
  currentStep?: number;
  ptsOfferStepModels?: any[];
  displayMode?: string;
}

export interface FreightInfo {
  unitWeight: number;
  freeEndAmount: number;
  receiveAddressId: string;
  deliveryLimit: number;
  officialLogistics: boolean;
  recieveAddressCode: string;
  receiveAddressAreaCodeList: string[];
  locationDivisionCode: string;
  subTemplateId: number;
  logisticsText: string;
  deliveryFee: {
    name: string;
  };
  recieveAddress: string;
  freeDeliverFee: boolean;
  location: string;
  locationCode: string;
  totalCost: number;
  skuWeight: Record<string, number>;
}

export interface ProtectionInfo {
  longDescription: string;
  serviceLink?: string;
  serviceCode: string;
  description: string;
  serviceName: string;
  type: string;
  logoUrl?: string;
  logoUrl_64_64?: string;
  logoUrl_16_16: string;
  buyerDescription?: string;
  displayMode?: string;
  agreeDeliveryHours?: number;
}

export interface DeliveryLimitTimeModel {
  attrs: {
    offerUnit: string;
    ptsOfferStepModels: any[];
  };
  limitTimeDay: number;
  expectSendHour: number;
  offerId: number;
  orderCntLevelText: string;
  limitTimeDesc: string;
  expectTimeDesc: string;
}

// ===== 6. 其他模块接口定义 =====

export interface ScreenInfo {
  fields: {
    uiType: string;
    className: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface ProductDescription {
  fields: {
    bigPromotionBanner: {
      hasBigPromotion: boolean;
      bannerUrl: string;
      bannerJumpUrl: string;
    };
    uiType: string;
    detailUrl: string;
    label: string;
  };
  id: string;
  meta: {
    scriptFileName: string;
  };
  position: string;
  tag: string;
  type: string;
}

export interface WidgetsInfo {
  fields: {
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface CartInfo {
  fields: {
    partition: number[];
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface ChromePluginInfo {
  fields: {
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface ShopProductCombineInfo {
  fields: {
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface ShopProductRecommendInfo {
  fields: {
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface UserRightsInfo {
  fields: {
    hidePlusMonthCard: boolean;
    trackInfo: Record<string, any>;
    testParam: string;
    operateType: string;
    uiType: string;
    label: string;
    targetUrl: string;
    isShow: boolean;
  };
  id: string;
  meta: {
    scriptFileName: string;
  };
  position: string;
  tag: string;
  type: string;
}

export interface CustomMadeInfo {
  fields: {
    uiType: string;
    label: string;
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

export interface MainServicesInfo {
  fields: {
    trackInfo: Record<string, any>;
    guaranteeList: any[];
    // 更多字段...
  };
  id: string;
  meta: Record<string, any>;
  position: string;
  tag: string;
  type: string;
}

// ===== 7. 全局配置信息 =====

export interface GlobalConfig {
  traceId: string;
  FEENV: string;
  odVersion: string;
  FE_GLOBALS: {
    offerId: number;
    offerLoginId: string;
    loginId: string;
    clientIP: string;
    clientDeviceId: string;
    timestamp: Date;
  };
  GL_PAGE_ID: string;
  GL_ARGS: URLSearchParams;
}

// ===== 8. 数据解析总结 =====

/**
 * 数据解析总结：
 * 
 * 1. 商品基本信息：
 *    - 商品ID: 891956763013
 *    - 标题: 网红懒人靠背椅子家用板凳万向轮圆凳带娃神器小凳子滑轮矮凳
 *    - 卖家: 嘉屿日用百货有限公司
 * 
 * 2. SKU规格：
 *    - 主要分为有靠背和无靠背两大类
 *    - 有靠背款重量2.75kg，无靠背款重量0.98kg
 *    - 多种颜色选择：粉色、白色、灰色、绿色、橘色、黑色等
 * 
 * 3. 物流信息：
 *    - 发货地：浙江省金华市
 *    - 运费：3.80元
 *    - 承诺48小时发货
 *    - 支持7天无理由退货、退货包运费、晚发必赔、极速退款等服务
 * 
 * 4. 数据结构特点：
 *    - 采用模块化设计，每个功能模块独立
 *    - 包含完整的UI类型标识和元数据
 *    - 支持多种保障服务和物流选项
 *    - 数据结构层次清晰，便于解析和处理
 */