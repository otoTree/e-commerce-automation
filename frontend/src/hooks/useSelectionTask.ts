import { useState, useCallback } from 'react';
import type { SelectionTask, SupplierProduct } from '../types/selection';

export function useSelectionTask() {
  const [currentTask, setCurrentTask] = useState<SelectionTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (productUrl: string, targetMarket: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 模拟API调用
      const newTask: SelectionTask = {
        taskId: Date.now().toString(),
        status: 'PROCESSING',
        input: {
          type: 'url',
          value: productUrl
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCurrentTask(newTask);
      
      // 模拟分析过程
      setTimeout(() => {
        setCurrentTask(prev => prev ? {
          ...prev,
          status: 'COMPLETED',
          updatedAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
          results: [
            {
              supplierProductId: '1',
              source: '1688' as const,
              title: '示例商品1',
              price: '25.99',
              imageUrl: '/placeholder-product.jpg',
              productUrl: 'https://example.com/product1',
              similarityScore: 0.95,
              supplier: {
                name: '供应商A',
                location: '广东省广州市',
                rating: 4.5
              },
              estimatedLogisticsCost: '8.50',
              estimatedTotalCost: '34.49'
            },
            {
              supplierProductId: '2',
              source: '1688' as const,
              title: '示例商品2', 
              price: '18.50',
              imageUrl: '/placeholder-product.jpg',
              productUrl: 'https://example.com/product2',
              similarityScore: 0.88,
              supplier: {
                name: '供应商B',
                location: '浙江省义乌市',
                rating: 4.2
              },
              estimatedLogisticsCost: '7.20',
              estimatedTotalCost: '25.70'
            }
          ]
        } : null);
        setIsLoading(false);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<SelectionTask>) => {
    setCurrentTask(prev => 
      prev && prev.taskId === taskId 
        ? { ...prev, ...updates, updatedAt: new Date().toISOString() }
        : prev
    );
  }, []);

  const clearTask = useCallback(() => {
    setCurrentTask(null);
    setError(null);
  }, []);

  return {
    currentTask,
    isLoading,
    error,
    createTask,
    updateTask,
    clearTask
  };
}