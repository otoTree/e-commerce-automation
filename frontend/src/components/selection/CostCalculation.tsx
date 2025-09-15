import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  Truck,
  Plane,
  Ship,
  Package,
  Loader2,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import type { SupplierProduct, LogisticsOption } from '../../types/selection';

interface CostCalculationProps {
  selectedProducts: SupplierProduct[];
  onCalculated: () => void;
  onBack: () => void;
}

export function CostCalculation({ 
  selectedProducts, 
  onCalculated, 
  onBack 
}: CostCalculationProps) {
  const [logisticsQuery, setLogisticsQuery] = useState('');
  const [selectedLogistics, setSelectedLogistics] = useState<string>('');
  const [calculating, setCalculating] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 模拟物流选项
  const logisticsOptions: LogisticsOption[] = [
    {
      id: 'air_express',
      name: '空运快递',
      provider: 'DHL/FedEx',
      transportMode: 'air',
      estimatedDays: { min: 5, max: 8 },
      pricePerKg: 45,
      minWeight: 0.5,
      description: '速度最快，适合小件商品和紧急订单'
    },
    {
      id: 'air_cargo',
      name: '空运专线',
      provider: '中俄专线',
      transportMode: 'air',
      estimatedDays: { min: 8, max: 12 },
      pricePerKg: 28,
      minWeight: 1,
      description: '性价比较高，适合中等重量商品'
    },
    {
      id: 'sea_cargo',
      name: '海运拼箱',
      provider: '中欧班列',
      transportMode: 'sea',
      estimatedDays: { min: 25, max: 35 },
      pricePerKg: 12,
      minWeight: 10,
      description: '成本最低，适合大批量商品'
    }
  ];

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case 'air': return <Plane className="w-4 h-4" />;
      case 'sea': return <Ship className="w-4 h-4" />;
      case 'land': return <Truck className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const handleCalculate = async () => {
    if (!selectedLogistics) {
      alert('请选择物流方案');
      return;
    }

    setCalculating(true);
    
    // 模拟API调用
    setTimeout(() => {
      const mockResults = selectedProducts.map(product => {
        const logistics = logisticsOptions.find(l => l.id === selectedLogistics)!;
        const estimatedWeight = 0.8; // 假设重量
        const logisticsCost = (logistics.pricePerKg * estimatedWeight).toFixed(2);
        const totalCost = (parseFloat(product.price) + parseFloat(logisticsCost)).toFixed(2);
        
        return {
          ...product,
          estimatedWeight,
          estimatedLogisticsCost: logisticsCost,
          estimatedTotalCost: totalCost,
          logisticsRecommendation: logistics.description,
          selectedLogistics: logistics
        };
      });
      
      setResults(mockResults);
      setShowResults(true);
      setCalculating(false);
    }, 2000);
  };

  const handleCreateOperationTask = (productId: string) => {
    // 这里应该调用API创建运营任务
    console.log('创建运营任务:', productId);
    onCalculated();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            成本核算
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 选中的商品列表 */}
            <div>
              <h3 className="font-medium mb-3">已选商品 ({selectedProducts.length})</h3>
              <div className="grid gap-3">
                {selectedProducts.map(product => (
                  <div key={product.supplierProductId} className="flex items-center gap-3 p-3 border rounded-lg">
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{product.title}</p>
                      <p className="text-sm text-muted-foreground">¥{product.price}</p>
                    </div>
                    <Badge variant="secondary">{product.source}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* 物流需求输入 */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="logistics-query">物流需求描述（可选）</Label>
                <Textarea
                  id="logistics-query"
                  placeholder="例如：需要10天内到货，商品易碎需要特殊包装..."
                  value={logisticsQuery}
                  onChange={(e) => setLogisticsQuery(e.target.value)}
                  rows={3}
                />
              </div>

              {/* 物流方案选择 */}
              <div>
                <Label>选择物流方案</Label>
                <RadioGroup value={selectedLogistics} onValueChange={setSelectedLogistics}>
                  <div className="grid gap-4 mt-3">
                    {logisticsOptions.map(option => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <label 
                          htmlFor={option.id} 
                          className="flex-1 cursor-pointer"
                        >
                          <Card className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="mt-1">
                                  {getTransportIcon(option.transportMode)}
                                </div>
                                <div>
                                  <h4 className="font-medium">{option.name}</h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {option.provider} • {option.estimatedDays.min}-{option.estimatedDays.max}天
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">¥{option.pricePerKg}</p>
                                <p className="text-xs text-muted-foreground">/公斤</p>
                              </div>
                            </div>
                          </Card>
                        </label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* 计算按钮 */}
            <div className="flex justify-center">
              <Button 
                onClick={handleCalculate}
                disabled={calculating || !selectedLogistics}
                size="lg"
              >
                {calculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    计算中...
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 mr-2" />
                    开始核算成本
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 成本核算结果 */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              成本核算结果
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={result.supplierProductId} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={result.imageUrl}
                      alt={result.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium mb-2 line-clamp-2">{result.title}</h4>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">采购价格</span>
                          <p className="font-medium">¥{result.price}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">物流费用</span>
                          <p className="font-medium">¥{result.estimatedLogisticsCost}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">预估重量</span>
                          <p className="font-medium">{result.estimatedWeight}kg</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">总成本</span>
                          <p className="font-bold text-lg text-red-600">¥{result.estimatedTotalCost}</p>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{result.selectedLogistics.name}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {result.selectedLogistics.estimatedDays.min}-{result.selectedLogistics.estimatedDays.max}天到货
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(result.productUrl, '_blank')}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            查看商品
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleCreateOperationTask(result.supplierProductId)}
                          >
                            就选这个，去运营
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回选择商品
        </Button>
      </div>
    </div>
  );
}

export default CostCalculation;