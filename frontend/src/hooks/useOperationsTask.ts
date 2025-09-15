import { useState, useCallback } from 'react';
import type { OperationTask } from '../types/operations';

export function useOperationsTask() {
  const [currentTask, setCurrentTask] = useState<OperationTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTask = useCallback(async (productId: string, productName: string, productImage: string, type: 'full_operation' | 'analysis_only' | 'content_only' | 'marketing_only') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTask: OperationTask = {
        id: Date.now().toString(),
        productId,
        productName,
        productImage,
        type,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: {
          analysis: 'pending',
          content: 'pending',
          marketing: 'pending',
          tracking: 'pending'
        },
        results: {}
      };
      
      setCurrentTask(newTask);
      
      // 模拟处理过程
      setTimeout(() => {
        setCurrentTask((prev: OperationTask | null) => prev ? {
          ...prev,
          status: 'completed',
          updatedAt: new Date(),
          progress: {
            analysis: 'completed',
            content: 'completed',
            marketing: 'completed',
            tracking: 'completed'
          },
          results: {
            analysisScore: 85,
            contentGenerated: 5,
            marketingPlansCreated: 2,
            performanceMetrics: {
              views: 1250,
              clicks: 89,
              conversions: 12,
              revenue: 580.50,
              ctr: 7.1,
              cvr: 13.5,
              roas: 4.2
            }
          }
        } : null);
        setIsLoading(false);
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建任务失败');
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback((taskId: string, updates: Partial<OperationTask>) => {
    setCurrentTask((prev: OperationTask | null) => 
      prev && prev.id === taskId 
        ? { ...prev, ...updates, updatedAt: new Date() }
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