import React, { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, BarChart3, Eye } from 'lucide-react'

// 使用页面中定义的Product接口
interface Product {
  id: string
  title: string
  price: number
  originalPrice?: number
  currency: string
  description: string
  images: string[]
  category: string
  brand?: string
  sku?: string
  stock?: number
  status: 'active' | 'inactive' | 'draft'
  platform: string
  sourceUrl?: string
  createdAt: string
  updatedAt: string
}

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
  onAnalyze?: (productId: string) => void // 新增分析功能
}

// 专门用于网格视图的产品卡片组件
const ProductCard = memo(({ product, onEdit, onDelete, onAnalyze }: ProductCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'draft': return 'outline'
      default: return 'outline'
    }
  }

  const formatPrice = (price: number, currency: string = 'CNY') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 产品图片 */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            {product.images && product.images.length > 0 ? (
              <img 
                className="w-full h-full object-cover" 
                src={product.images[0]} 
                alt={product.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-sm">无图片</span>
              </div>
            )}
          </div>

          {/* 产品信息 */}
          <div className="space-y-2">
            <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem]">
              {product.title}
            </h3>
            
            <div className="text-xs text-gray-500">
              <div>{product.category}</div>
              <div>{product.brand || '未知品牌'}</div>
              {product.sku && <div>SKU: {product.sku}</div>}
            </div>

            {/* 价格 */}
            <div className="space-y-1">
              <div className="font-semibold text-lg">
                {formatPrice(product.price, product.currency)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice, product.currency)}
                </div>
              )}
            </div>

            {/* 库存和状态 */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                库存: {product.stock || 0}
              </span>
              <Badge variant={getStatusColor(product.status)} className="text-xs">
                {product.status === 'active' ? '上架' : 
                 product.status === 'inactive' ? '下架' : 
                 product.status === 'draft' ? '草稿' : product.status}
              </Badge>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-2">
            {/* 分析按钮 */}
            {onAnalyze && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAnalyze(product.id)}
                className="flex-1"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                分析
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

ProductCard.displayName = 'ProductCard'

export default ProductCard