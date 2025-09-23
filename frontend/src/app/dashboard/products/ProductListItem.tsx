import React, { memo } from 'react'

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

interface ProductListItemProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (productId: string) => void
}

// 使用React.memo优化产品列表项组件
const ProductListItem = memo(({ product, onEdit, onDelete }: ProductListItemProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-red-600 bg-red-100'
      case 'draft': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatPrice = (price: number, currency: string = 'CNY') => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {product.images && product.images.length > 0 ? (
              <img 
                className="h-10 w-10 rounded-full object-cover" 
                src={product.images[0]} 
                alt={product.title}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">无图</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.title}</div>
            <div className="text-sm text-gray-500">{product.sku}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{product.category}</div>
        <div className="text-sm text-gray-500">{product.brand || '未知品牌'}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatPrice(product.price, product.currency)}
        </div>
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="text-sm text-gray-500 line-through">
            {formatPrice(product.originalPrice, product.currency)}
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {product.stock || 0}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
          {product.status === 'active' ? '上架' : 
           product.status === 'inactive' ? '下架' : 
           product.status === 'draft' ? '草稿' : product.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.platform}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onEdit(product)}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          编辑
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="text-red-600 hover:text-red-900"
        >
          删除
        </button>
      </td>
    </tr>
  )
})

ProductListItem.displayName = 'ProductListItem'

export default ProductListItem