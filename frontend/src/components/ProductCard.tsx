'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductData, OzonProductData } from "@/types/product"
import { Package, Truck, Shield, MapPin } from "lucide-react"

interface ProductCardProps {
  product: ProductData
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const formatPrice = (price?: string | { current?: string }) => {
    if (!price) return '价格待询'
    if (typeof price === 'string') return `¥${price}`
    if (typeof price === 'object' && price.current) return `¥${price.current}`
    return '价格待询'
  }

  const formatWeight = (weight: number) => {
    if (weight >= 1000) {
      return `${(weight / 1000).toFixed(1)}kg`
    }
    return `${weight}g`
  }

  const getVariantTypeLabel = (type: string) => {
    return type === 'with_backrest' ? '有靠背' : '无靠背'
  }

  return (
    <Card className="w-full max-w-2xl mx-auto hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {product.title}
            </CardTitle>
            <CardDescription className="mt-2 flex items-center gap-2">
              <Package className="h-4 w-4" />
              商品ID: {product.productId}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            <div className="text-sm text-muted-foreground">
              卖家: {product.seller}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 商品图片 */}
        {product.images && product.images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {product.images.slice(0, 4).map((image, index) => (
              <img
                key={index}
                src={image['220x220'] || image.imageURI || image.url || image.src}
                alt={`${product.title} - 图片 ${index + 1}`}
                className="w-20 h-20 object-cover rounded-md border flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            ))}
          </div>
        )}

        {/* 商品变体 */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            商品规格 ({product.variants.length}种)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {product.variants.slice(0, 6).map((variant) => (
              <div
                key={variant.skuId}
                className="p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge variant="outline" className="text-xs">
                    {getVariantTypeLabel(variant.type)}
                  </Badge>
                  <span className="text-sm font-medium">
                    {formatWeight(variant.weight)}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {variant.color}
                </div>
                {variant.dimensions && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {variant.dimensions.length}×{variant.dimensions.width}×{variant.dimensions.height}cm
                  </div>
                )}
              </div>
            ))}
            {product.variants.length > 6 && (
              <div className="p-3 border rounded-lg bg-muted/50 flex items-center justify-center text-muted-foreground">
                +{product.variants.length - 6} 更多规格
              </div>
            )}
          </div>
        </div>

        {/* 物流信息 */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-sm font-medium">
                {product.shipping.location} → {product.shipping.targetLocation}
              </div>
              <div className="text-xs text-muted-foreground">
                {product.shipping.deliveryPromise}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {product.shipping.freeShipping ? (
                <Badge variant="success">包邮</Badge>
              ) : (
                `运费 ¥${product.shipping.cost}`
              )}
            </div>
          </div>
        </div>

        {/* 服务保障 */}
        {product.protections.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              服务保障
            </h4>
            <div className="flex flex-wrap gap-2">
              {product.protections.map((protection) => (
                <Badge
                  key={protection.code}
                  variant={protection.enabled ? "success" : "secondary"}
                  className="text-xs"
                >
                  {protection.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 特征属性 */}
        {product.featureAttributes && product.featureAttributes.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">商品特征</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {product.featureAttributes.slice(0, 4).map((attr) => (
                <div key={attr.fid} className="flex justify-between">
                  <span className="text-muted-foreground">{attr.name}:</span>
                  <span>{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 元数据 */}
        <div className="pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>提取时间: {new Date(product.metadata.extractedAt).toLocaleString()}</span>
            <span>来源: {product.metadata.source}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}