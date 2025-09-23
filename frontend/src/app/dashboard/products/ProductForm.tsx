'use client'

import React, { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Product, CreateProductData, UpdateProductData } from '@/services/productService'
import { X, Plus, AlertCircle } from 'lucide-react'

interface ProductFormProps {
  product?: Product
  onClose: () => void
  onSave: () => void
  createProduct?: (data: CreateProductData) => Promise<Product>
  updateProduct?: (data: UpdateProductData) => Promise<Product>
  isLoading?: boolean
}

export default function ProductForm({
  product,
  onClose,
  onSave,
  createProduct,
  updateProduct,
  isLoading = false
}: ProductFormProps) {
  const [formData, setFormData] = useState<CreateProductData>({
    title: product?.title || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || undefined,
    currency: product?.currency || 'CNY',
    description: product?.description || '',
    images: product?.images || [],
    category: product?.category || '',
    brand: product?.brand || '',
    sku: product?.sku || '',
    stock: product?.stock || 0,
    status: product?.status || 'draft',
    platform: product?.platform || '',
    sourceUrl: product?.sourceUrl || ''
  })

  const [imageInput, setImageInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = useCallback((field: keyof CreateProductData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }, [])

  const handleAddImage = useCallback(() => {
    if (imageInput.trim() && !formData.images.includes(imageInput.trim())) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }))
      setImageInput('')
    }
  }, [imageInput, formData.images])

  const handleRemoveImage = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }, [])

  const validateForm = useCallback((): boolean => {
    if (!formData.title.trim()) {
      setError('产品标题不能为空')
      return false
    }
    if (formData.price <= 0) {
      setError('产品价格必须大于0')
      return false
    }
    if (!formData.category.trim()) {
      setError('产品分类不能为空')
      return false
    }
    if (!formData.platform.trim()) {
      setError('产品平台不能为空')
      return false
    }
    setError(null)
    return true
  }, [formData])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      if (product && updateProduct) {
        // 编辑模式
        await updateProduct({
          id: product.id,
          ...formData
        })
      } else if (createProduct) {
        // 创建模式
        await createProduct(formData)
      }
      
      onSave()
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败')
    }
  }, [formData, product, createProduct, updateProduct, validateForm, onSave])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* 基本信息 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">基本信息</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">产品标题 *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="请输入产品标题"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => handleInputChange('sku', e.target.value)}
                placeholder="请输入产品SKU"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">产品描述</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="请输入产品描述"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">分类 *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="请输入产品分类"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="brand">品牌</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
                placeholder="请输入品牌名称"
              />
            </div>
            
            <div>
              <Label htmlFor="platform">平台 *</Label>
              <Input
                id="platform"
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                placeholder="请输入销售平台"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 价格和库存 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">价格和库存</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="price">当前价格 *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="originalPrice">原价</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice?.toString() || ''}
                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || undefined)}
                placeholder="0.00"
              />
            </div>
            
            <div>
              <Label htmlFor="currency">货币</Label>
              <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择货币" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNY">人民币 (CNY)</SelectItem>
                  <SelectItem value="USD">美元 (USD)</SelectItem>
                  <SelectItem value="EUR">欧元 (EUR)</SelectItem>
                  <SelectItem value="JPY">日元 (JPY)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="stock">库存数量</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 产品图片 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">产品图片</h3>
          
          <div className="flex gap-2">
            <Input
              value={imageInput}
              onChange={(e) => setImageInput(e.target.value)}
              placeholder="请输入图片URL"
              className="flex-1"
            />
            <Button type="button" onClick={handleAddImage} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`产品图片 ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-image.png'
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 其他设置 */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">其他设置</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">状态</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'draft') => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">活跃</SelectItem>
                  <SelectItem value="inactive">非活跃</SelectItem>
                  <SelectItem value="draft">草稿</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sourceUrl">来源链接</Label>
              <Input
                id="sourceUrl"
                value={formData.sourceUrl}
                onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                placeholder="请输入产品来源链接"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
          取消
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '保存中...' : (product ? '更新产品' : '创建产品')}
        </Button>
      </div>
    </form>
  )
}