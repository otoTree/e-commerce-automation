import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, ShoppingCart, Calculator, ArrowRight, Loader2 } from 'lucide-react';
import { ProductInput } from './ProductInput';
import { SearchResults } from './SearchResults';
import { CostCalculation } from './CostCalculation';
import { useSelectionTask } from '../../hooks/useSelectionTask';
import type { SelectionTask, SupplierProduct } from '../../types/selection';

interface SelectionPageProps {
  className?: string;
}

export function SelectionPage({ className }: SelectionPageProps) {
  const [currentStep, setCurrentStep] = useState<'input' | 'search' | 'calculate'>('input');
  const [selectedProducts, setSelectedProducts] = useState<SupplierProduct[]>([]);
  const {
    task,
    loading,
    error,
    createTask,
    getTaskStatus,
    calculateCosts
  } = useSelectionTask();

  const handleProductSubmit = async (data: { type: 'url' | 'keywords'; value: string }) => {
    try {
      await createTask(data);
      setCurrentStep('search');
    } catch (error) {
      console.error('创建选品任务失败:', error);
    }
  };

  const handleProductSelect = (products: SupplierProduct[]) => {
    setSelectedProducts(products);
    setCurrentStep('calculate');
  };

  const handleCostCalculated = () => {
    // 成本核算完成后的处理逻辑
    console.log('成本核算完成');
  };

  const getStepStatus = (step: string) => {
    const steps = ['input', 'search', 'calculate'];
    const currentIndex = steps.indexOf(currentStep);
    const stepIndex = steps.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className={`space-y-6 ${className || ''}`}>
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI选品助手</h1>
          <p className="text-muted-foreground mt-2">
            从OZON商品分析开始，智能匹配1688货源，核算成本，助您做出最优采购决策
          </p>
        </div>
      </div>

      {/* 步骤指示器 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                getStepStatus('input') === 'completed' ? 'text-green-600' :
                getStepStatus('input') === 'current' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus('input') === 'completed' ? 'bg-green-100 text-green-600' :
                  getStepStatus('input') === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Search className="w-4 h-4" />
                </div>
                <span className="font-medium">商品输入</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-400" />
              
              <div className={`flex items-center space-x-2 ${
                getStepStatus('search') === 'completed' ? 'text-green-600' :
                getStepStatus('search') === 'current' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus('search') === 'completed' ? 'bg-green-100 text-green-600' :
                  getStepStatus('search') === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <span className="font-medium">货源搜索</span>
              </div>
              
              <ArrowRight className="w-4 h-4 text-gray-400" />
              
              <div className={`flex items-center space-x-2 ${
                getStepStatus('calculate') === 'completed' ? 'text-green-600' :
                getStepStatus('calculate') === 'current' ? 'text-blue-600' : 'text-gray-400'
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  getStepStatus('calculate') === 'completed' ? 'bg-green-100 text-green-600' :
                  getStepStatus('calculate') === 'current' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                }`}>
                  <Calculator className="w-4 h-4" />
                </div>
                <span className="font-medium">成本核算</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 主要内容区域 */}
      <div className="space-y-6">
        {currentStep === 'input' && (
          <ProductInput
            onSubmit={handleProductSubmit}
            loading={loading}
          />
        )}
        
        {currentStep === 'search' && (
          <SearchResults
            task={task}
            loading={loading}
            error={error}
            onProductSelect={handleProductSelect}
            onBack={() => setCurrentStep('input')}
          />
        )}
        
        {currentStep === 'calculate' && (
          <CostCalculation
            selectedProducts={selectedProducts}
            onCalculated={handleCostCalculated}
            onBack={() => setCurrentStep('search')}
          />
        )}
      </div>
    </div>
  );
}

export default SelectionPage;