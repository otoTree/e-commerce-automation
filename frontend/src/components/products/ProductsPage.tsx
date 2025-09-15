import React, { useState } from 'react';
import { Product } from '../../lib/api';
import { useProducts } from '../../hooks/useApi';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { Modal } from '../common';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';

interface ProductsPageProps {
  className?: string;
}

type ViewMode = 'list' | 'form';

export function ProductsPage({ className }: ProductsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // 获取商品数据
  const {
    data: products,
    loading,
    error,
    refetch
  } = useProducts({
    search: searchQuery,
    status: statusFilter === 'all' ? undefined : statusFilter as 'active' | 'inactive' | 'out_of_stock',
    category: categoryFilter === 'all' ? undefined : categoryFilter,
  });

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`确定要删除商品「${product.name}」吗？`)) {
      try {
        // TODO: 实现删除API调用
        console.log('删除商品:', product._id);
        await refetch();
      } catch (error) {
        console.error('删除商品失败:', error);
        alert('删除商品失败，请重试');
      }
    }
  };

  const handleFormSubmit = async (formData: Partial<Product>) => {
    try {
      if (selectedProduct) {
        // TODO: 实现更新API调用
        console.log('更新商品:', selectedProduct._id, formData);
      } else {
        // TODO: 实现创建API调用
        console.log('创建商品:', formData);
      }
      
      setIsFormModalOpen(false);
      setSelectedProduct(null);
      await refetch();
    } catch (error) {
      console.error('保存商品失败:', error);
      throw error;
    }
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setSelectedProduct(null);
  };

  const handleImportProducts = () => {
    // TODO: 实现商品导入功能
    console.log('导入商品');
  };

  const handleExportProducts = () => {
    // TODO: 实现商品导出功能
    console.log('导出商品');
  };

  const getProductStats = () => {
    if (!products) return { total: 0, active: 0, inactive: 0, outOfStock: 0 };
    
    return {
      total: products.length,
      active: products.filter(p => p.status === 'active').length,
      inactive: products.filter(p => p.status === 'inactive').length,
      outOfStock: products.filter(p => p.status === 'out_of_stock').length,
    };
  };

  const stats = getProductStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 页面标题和统计 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">商品管理</h1>
          <p className="text-muted-foreground">
            管理您的商品库存、价格和信息
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleImportProducts}>
            <Upload className="w-4 h-4 mr-2" />
            导入
          </Button>
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="w-4 h-4 mr-2" />
            导出
          </Button>
          <Button onClick={handleAddProduct}>
            <Plus className="w-4 h-4 mr-2" />
            添加商品
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总商品数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">上架商品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">下架商品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">缺货商品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
          </CardContent>
        </Card>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="搜索商品名称、品牌或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">上架</SelectItem>
                <SelectItem value="inactive">下架</SelectItem>
                <SelectItem value="out_of_stock">缺货</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="未分类">未分类</SelectItem>
                <SelectItem value="电子产品">电子产品</SelectItem>
                <SelectItem value="服装配饰">服装配饰</SelectItem>
                <SelectItem value="家居用品">家居用品</SelectItem>
                <SelectItem value="美妆护肤">美妆护肤</SelectItem>
                <SelectItem value="运动户外">运动户外</SelectItem>
                <SelectItem value="食品饮料">食品饮料</SelectItem>
                <SelectItem value="图书文具">图书文具</SelectItem>
                <SelectItem value="母婴用品">母婴用品</SelectItem>
                <SelectItem value="汽车用品">汽车用品</SelectItem>
                <SelectItem value="其他">其他</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 商品列表 */}
      <Card>
        <CardContent className="p-0">
          <ProductList
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        </CardContent>
      </Card>

      {/* 商品表单模态框 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormCancel}
        title={selectedProduct ? '编辑商品' : '添加商品'}
        size="lg"
      >
        <ProductForm
          product={selectedProduct || undefined}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      </Modal>
    </div>
  );
}

export default ProductsPage;