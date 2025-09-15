import React, { useState, useEffect } from "react";
import { Product } from "../../lib/api";
import { FormBuilder, FormFieldConfig } from "../common";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { X, Upload, Plus } from "lucide-react";

interface ProductFormProps {
  product?: Partial<Product>;
  onSubmit: (data: Partial<Product>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: string;
  category: string;
  brand: string;
  supplier?: string;
  images: string[];
  specifications: Record<string, string | number | boolean>;
  stock: number;
  sku?: string;
  status: "active" | "inactive" | "out_of_stock";
  tags: string[];
  sales?: string;
  source?: {
    platform: string;
    url: string;
    extractedAt: string;
  };
  discountPercentage?: number;
  inStock?: boolean;
  sourceUrl?: string;
  sourcePlatform?: string;
}

const CATEGORIES = [
  "电子产品",
  "服装配饰",
  "家居用品",
  "美妆护肤",
  "运动户外",
  "食品饮料",
  "图书文具",
  "母婴用品",
  "汽车用品",
  "其他",
];

const CURRENCIES = [
  { value: "CNY", label: "人民币 (¥)" },
  { value: "USD", label: "美元 ($)" },
  { value: "EUR", label: "欧元 (€)" },
];

const STATUS_OPTIONS = [
  { value: "active", label: "上架" },
  { value: "inactive", label: "下架" },
  { value: "out_of_stock", label: "缺货" },
];

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  loading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    originalPrice: undefined,
    currency: "CNY",
    category: "",
    brand: "",
    supplier: "",
    images: [],
    specifications: {},
    stock: 0,
    sku: "",
    status: "active",
    tags: [],
    sales: "",
    source: undefined,
    discountPercentage: 0,
    inStock: true,
    sourceUrl: "",
    sourcePlatform: "",
  });

  const [newTag, setNewTag] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // 初始化表单数据
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        originalPrice: product.originalPrice,
        currency: product.currency || "CNY",
        category: product.category || "",
        brand: product.brand || "",
        supplier: (product.specifications?.supplier as string) || "",
        images: product.images || [],
        specifications: product.specifications || {},
        stock: product.stock || 0,
        sku: product.sku || "",
        status: product.status || "active",
        tags: product.tags || [],
        sales: product.sales || "",
        source: product.source || {
          platform: product.sourcePlatform || "",
          url: product.sourceUrl || "",
          extractedAt: new Date().toISOString(),
        },
        discountPercentage: product.discountPercentage || 0,
        inStock: product.inStock !== undefined ? product.inStock : true,
        sourceUrl: product.source?.url || product.sourceUrl || "",
        sourcePlatform:
          product.source?.platform || product.sourcePlatform || "",
      });
    }
  }, [product]);

  const handleInputChange = (
    field: keyof ProductFormData,
    value: string | number | boolean | undefined
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const handleRemoveSpecification = (keyToRemove: string) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[keyToRemove];
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleAddImage = () => {
    if (imageUrl.trim() && !formData.images.includes(imageUrl.trim())) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl.trim()],
      }));
      setImageUrl("");
    }
  };

  const handleRemoveImage = (imageToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img !== imageToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 基本验证
    if (!formData.name.trim()) {
      alert("请输入商品名称");
      return;
    }

    if (formData.price <= 0) {
      alert("请输入有效的价格");
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("提交表单失败:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">商品名称 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="请输入商品名称"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand">品牌</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => handleInputChange("brand", e.target.value)}
              placeholder="请输入品牌名称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sales">销量</Label>
            <Input
              id="sales"
              value={formData.sales || ""}
              onChange={(e) => handleInputChange("sales", e.target.value)}
              placeholder="请输入销量"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="supplier">供应商</Label>
          <Input
            id="supplier"
            value={formData.supplier || ""}
            onChange={(e) => handleInputChange("supplier", e.target.value)}
            placeholder="请输入供应商名称"
          />
        </div>


        <div className="space-y-2">
          <Label htmlFor="description">商品描述</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="请输入商品描述"
            rows={4}
          />
        </div>

        {/* 价格信息 */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            价格信息
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label htmlFor="price" className="text-sm font-medium">
                售价 *
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="originalPrice" className="text-sm font-medium">
                原价
              </Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  handleInputChange(
                    "originalPrice",
                    parseFloat(e.target.value) || undefined
                  )
                }
                placeholder="0.00"
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="discountPercentage"
                className="text-sm font-medium"
              >
                折扣百分比
              </Label>
              <Input
                id="discountPercentage"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.discountPercentage || ""}
                onChange={(e) =>
                  handleInputChange(
                    "discountPercentage",
                    parseFloat(e.target.value) || 0
                  )
                }
                placeholder="0.00"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="currency" className="text-sm font-medium">
                货币
              </Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 分类和库存 */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
            分类和库存
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-3">
              <Label htmlFor="category" className="text-sm font-medium">
                分类
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label htmlFor="sku" className="text-sm font-medium">
                SKU
              </Label>
              <Input
                id="sku"
                value={formData.sku || ""}
                onChange={(e) => handleInputChange("sku", e.target.value)}
                placeholder="请输入SKU"
                className="h-11"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="stock" className="text-sm font-medium">
                库存数量
              </Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) =>
                  handleInputChange("stock", parseInt(e.target.value) || 0)
                }
                placeholder="0"
                className="h-11"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label htmlFor="status" className="text-sm font-medium">
                状态
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange("status", value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* 商品图片 */}
        <div className="space-y-4">
          <Label>商品图片</Label>
          <div className="flex gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="输入图片URL"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddImage} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`商品图片 ${index + 1}`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 标签 */}
        <div className="space-y-4">
          <Label>商品标签</Label>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="输入标签"
              className="flex-1"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button type="button" onClick={handleAddTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* 规格参数 */}
        <div className="space-y-4">
          <Label>规格参数</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={newSpecKey}
              onChange={(e) => setNewSpecKey(e.target.value)}
              placeholder="参数名称"
            />
            <div className="flex gap-2">
              <Input
                value={newSpecValue}
                onChange={(e) => setNewSpecValue(e.target.value)}
                placeholder="参数值"
                className="flex-1"
                onKeyPress={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), handleAddSpecification())
                }
              />
              <Button type="button" onClick={handleAddSpecification} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {Object.keys(formData.specifications).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span className="text-sm">
                    <strong>{key}:</strong> {String(value)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecification(key)}
                    className="text-destructive hover:text-destructive/80"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 来源信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="sourcePlatform">来源平台</Label>
            <Input
              id="sourcePlatform"
              value={formData.source?.platform || formData.sourcePlatform || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  source: {
                    ...prev.source,
                    platform: value,
                    url: prev.source?.url || prev.sourceUrl || "",
                    extractedAt:
                      prev.source?.extractedAt || new Date().toISOString(),
                  },
                  sourcePlatform: value,
                }));
              }}
              placeholder="如：1688、淘宝、天猫等"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="sourceUrl">来源链接</Label>
            <Input
              id="sourceUrl"
              type="url"
              value={formData.source?.url || formData.sourceUrl || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  source: {
                    ...prev.source,
                    platform:
                      prev.source?.platform || prev.sourcePlatform || "",
                    url: value,
                    extractedAt:
                      prev.source?.extractedAt || new Date().toISOString(),
                  },
                  sourceUrl: value,
                }));
              }}
              placeholder="https://..."
              className="w-full"
            />
          </div>
        </div>

        {/* 库存状态 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              checked={formData.inStock || false}
              onChange={(e) => handleInputChange("inStock", e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="inStock">有库存</Label>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "保存中..." : product?._id ? "更新商品" : "添加商品"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
