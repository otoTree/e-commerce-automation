import React, { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useProducts } from '../../hooks/useApi';
import type { Product } from '../../lib/api';
import { DataTable, Loading, EmptyState } from '../common';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { MoreHorizontal, Edit, Trash2, Eye, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
// 简化的格式化函数
const formatPrice = (price: number, currency = '¥'): string => {
  if (typeof price !== 'number' || isNaN(price)) return `${currency}0.00`;
  return `${currency}${price.toFixed(2)}`;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('zh-CN');
  } catch {
    return '无效日期';
  }
};

interface ProductListProps {
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onView?: (product: Product) => void;
  onCreate?: () => void;
}

export function ProductList({ onEdit, onDelete, onView, onCreate }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: products, loading, error } = useProducts({
    search: searchQuery,
    page: 1,
    limit: 50,
  });

  const columns: ColumnDef<Product, unknown>[] = [
    {
      accessorKey: 'image',
      header: '图片',
      cell: ({ row }) => {
        const product = row.original;
        const primaryImage = product.images[0];
        return (
          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100">
            {primaryImage ? (
              <img
                src={primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs">无图</span>
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: '商品名称',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="max-w-xs">
            <div className="font-medium truncate">{product.name}</div>
            <div className="text-sm text-muted-foreground">
              {product.sku ? `SKU: ${product.sku}` : `ID: ${product._id}`}
            </div>
            {product.sales && (
              <div className="text-xs text-blue-600">销量: {product.sales}</div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'price',
      header: '价格',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-right">
            <div className="font-medium">{formatPrice(product.price)}</div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'stock',
      header: '库存',
      cell: ({ row }) => {
        const product = row.original;
        const stockLevel = product.stock <= 10 ? 'low' : product.stock <= 50 ? 'medium' : 'high';
        const stockColor = {
          low: 'destructive',
          medium: 'secondary',
          high: 'default',
        }[stockLevel] as 'destructive' | 'secondary' | 'default';
        
        return (
          <Badge variant={stockColor}>
            {product.stock}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'category',
      header: '分类',
      cell: ({ row }) => {
        const product = row.original;
        return product.category ? (
          <Badge variant="outline">{product.category}</Badge>
        ) : (
          <span className="text-muted-foreground">未分类</span>
        );
      },
    },
    {
      accessorKey: 'source',
      header: '来源',
      cell: ({ row }) => {
        const product = row.original;
        if (product.source?.platform) {
          return (
            <Badge variant="secondary" className="text-xs">
              {product.source.platform}
            </Badge>
          );
        }
        return <span className="text-muted-foreground text-xs">未知</span>;
      },
     },
     {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }) => {
        const product = row.original;
        const statusConfig = {
          active: { label: '上架', variant: 'default' as const },
          inactive: { label: '下架', variant: 'secondary' as const },
          out_of_stock: { label: '缺货', variant: 'destructive' as const },
        };
        const config = statusConfig[product.status] || statusConfig.inactive;
        
        return <Badge variant={config.variant}>{config.label}</Badge>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: '创建时间',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(product.createdAt)}
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const product = row.original;
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">打开菜单</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onView && (
                <DropdownMenuItem onClick={() => onView(product)}>
                  <Eye className="mr-2 h-4 w-4" />
                  查看详情
                </DropdownMenuItem>
              )}
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(product)}>
                  <Edit className="mr-2 h-4 w-4" />
                  编辑
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(product)}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">加载商品列表失败: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">商品管理</h2>
        {onCreate && (
          <Button onClick={onCreate}>
            <Plus className="mr-2 h-4 w-4" />
            添加商品
          </Button>
        )}
      </div>
      
      <DataTable
        data={products || []}
        columns={columns}
        loading={loading}
        searchable={true}
        searchPlaceholder="搜索商品名称、SKU..."
        emptyMessage="暂无商品"
        emptyDescription="还没有添加任何商品，点击上方按钮开始添加"
      />
    </div>
  );
}