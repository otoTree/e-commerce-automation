'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductData, OzonProductData, ProductImage, OzonPrice } from "@/types/product"
import { Package, Truck, Shield, MapPin, Star, ExternalLink } from "lucide-react"

interface UniversalProductCardProps {
  product: ProductData
}

export const UniversalProductCard = ({ product }: UniversalProductCardProps) => {
  const formatPrice = (price?: string) => {
    if (!price) return '价格待询'
    return price.startsWith('¥') || price.startsWith('$') || price.startsWith('₽') 
      ? price 
      : `¥${price}`
  }

  const getProductImages = () => {
    return product.images?.map(img => {
      if (typeof img === 'string') return img
      return img['220x220'] || img.imageURI || img.url || img.src || ''
    }).filter(Boolean) || []
  }

  const getProductPrice = () => {
    return formatPrice(product.price)
  }

  const getProductSeller = () => {
    return product.seller || '未知卖家'
  }

  const renderProductSpecificInfo = () => {
    const isOzonProduct = product.source === 'ozon'
    
    return (
      <>
        {/* 产品变体信息 */}
        {product.variants && product.variants.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Package className="h-3 w-3" />
              产品变体 ({product.variants.length})
            </h4>
            <div className="grid grid-cols-1 gap-1">
              {product.variants.slice(0, 2).map((variant, index) => (
                <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                  <span className="font-medium">{variant.type === 'with_backrest' ? '有靠背' : '无靠背'}</span>
                  <span className="text-muted-foreground ml-2">颜色: {variant.color}</span>
                  <span className="text-muted-foreground ml-2">重量: {variant.weight}g</span>
                </div>
              ))}
            </div>
            {product.variants.length > 2 && (
              <p className="text-xs text-muted-foreground">
                还有 {product.variants.length - 2} 个变体
              </p>
            )}
          </div>
        )}

        {/* Ozon特有的评分信息 */}
        {isOzonProduct && product.ozonData?.rating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.ozonData.rating.score || '暂无评分'}</span>
            {product.ozonData.rating.reviewCount && (
              <span className="text-xs text-muted-foreground">({product.ozonData.rating.reviewCount} 评价)</span>
            )}
          </div>
        )}

        {/* Ozon特有的可用性状态 */}
        {isOzonProduct && product.ozonData?.availability && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">库存状态:</span>
            <span>{product.ozonData.availability.inStock ? '有库存' : '缺货'}</span>
          </div>
        )}

        {/* 物流信息 */}
        {product.shipping && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Truck className="h-3 w-3" />
              物流信息
            </h4>
            <div className="space-y-1 text-xs text-muted-foreground">
              {product.shipping.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span>发货地: {product.shipping.location}</span>
                </div>
              )}
              <div>运费: ¥{product.shipping.cost}</div>
              {product.shipping.freeShipping && (
                <span className="text-green-600">包邮</span>
              )}
            </div>
          </div>
        )}

        {/* 服务保障 */}
        {product.protections && product.protections.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-3 w-3" />
              服务保障
            </h4>
            <div className="text-xs text-muted-foreground">
              {product.protections.map(protection => protection.name).join(' • ')}
            </div>
          </div>
        )}

        {/* 特征属性 */}
        {product.featureAttributes && product.featureAttributes.length > 0 && (
          <div className="space-y-1">
            <h4 className="text-sm font-medium">产品特征</h4>
            <div className="grid grid-cols-1 gap-1 text-xs">
              {product.featureAttributes.slice(0, 3).map((attr, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{attr.name}:</span>
                  <span className="text-right">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    )
  }

  const images = getProductImages()

  return (
    <Card className="w-full max-w-md mx-auto hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="space-y-2">
          <CardTitle className="text-base line-clamp-2 leading-tight">{product.title}</CardTitle>
          <div className="flex justify-between items-center">
            <CardDescription className="text-xs">
              ID: {product.productId}
            </CardDescription>
            <div className="text-sm text-muted-foreground">
              {product.source === 'ozon' ? 'Ozon' : '1688'}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-primary">
              {getProductPrice()}
            </div>
            <div className="text-sm text-muted-foreground">
              {getProductSeller()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {/* 产品图片 */}
        {images.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {images.slice(0, 3).map((image, index) => (
                <div key={index} className="aspect-square bg-muted rounded-md overflow-hidden">
                  <img
                    src={image}
                    alt={`产品图片 ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </div>
              ))}
            </div>
            {images.length > 3 && (
              <p className="text-xs text-muted-foreground">
                还有 {images.length - 3} 张图片
              </p>
            )}
          </div>
        )}

        {/* 产品特定信息 */}
        {renderProductSpecificInfo()}

        {/* 元数据 */}
        {product.metadata?.extractedAt && (
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground text-center">
              提取时间: {new Date(product.metadata.extractedAt).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}