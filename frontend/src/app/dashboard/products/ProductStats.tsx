import React, { memo, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import { Product } from '@/services/productService'

interface ProductStatsProps {
  products: Product[]
}

// 使用React.memo优化统计组件
const ProductStats = memo(({ products }: ProductStatsProps) => {
  const stats = useMemo(() => {
    const totalProducts = products.length
    const activeProducts = products.filter(p => p.status === 'active').length
    const totalValue = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)
    
    return {
      totalProducts,
      activeProducts,
      totalValue
    }
  }, [products])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
    }).format(value)
  }

  const inactiveProducts = stats.totalProducts - stats.activeProducts

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总产品数</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProducts}</div>
          <p className="text-xs text-muted-foreground">
            所有产品总数
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">上架产品</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.activeProducts}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalProducts > 0 ? 
              `占比 ${((stats.activeProducts / stats.totalProducts) * 100).toFixed(1)}%` : 
              '暂无数据'
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">库存总价值</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</div>
          <p className="text-xs text-muted-foreground">
            基于当前价格计算
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">下架产品</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inactiveProducts}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalProducts > 0 ? 
              `占比 ${((inactiveProducts / stats.totalProducts) * 100).toFixed(1)}%` : 
              '暂无数据'
            }
          </p>
        </CardContent>
      </Card>
    </div>
  )
})

ProductStats.displayName = 'ProductStats'

export default ProductStats