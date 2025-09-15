import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Link, Search, Loader2, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface ProductInputProps {
  onSubmit: (data: { type: 'url' | 'keywords'; value: string }) => void;
  loading?: boolean;
}

export function ProductInput({ onSubmit, loading }: ProductInputProps) {
  const [inputType, setInputType] = useState<'url' | 'keywords'>('url');
  const [inputValue, setInputValue] = useState('');
  const [errors, setErrors] = useState<string>('');

  const validateInput = () => {
    if (!inputValue.trim()) {
      setErrors('请输入内容');
      return false;
    }

    if (inputType === 'url') {
      // 简单的URL验证
      const urlPattern = /^https?:\/\/.+/;
      if (!urlPattern.test(inputValue.trim())) {
        setErrors('请输入有效的URL地址');
        return false;
      }
    }

    setErrors('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInput()) {
      return;
    }

    onSubmit({
      type: inputType,
      value: inputValue.trim()
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          商品信息输入
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'url' | 'keywords')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <Link className="w-4 h-4" />
                OZON商品链接
              </TabsTrigger>
              <TabsTrigger value="keywords" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                关键词搜索
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ozon-url">OZON商品链接</Label>
                <Input
                  id="ozon-url"
                  type="url"
                  placeholder="https://ozon.ru/product/..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={errors ? 'border-red-500' : ''}
                />
                <p className="text-sm text-muted-foreground">
                  粘贴OZON商品页面的完整URL地址
                </p>
              </div>
              
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  系统将自动分析OZON商品信息，提取关键特征，然后在1688平台搜索相似商品。
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="keywords" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="keywords">搜索关键词</Label>
                <Textarea
                  id="keywords"
                  placeholder="例如：蓝牙耳机 TWS 降噪 无线"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className={errors ? 'border-red-500' : ''}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  输入商品的关键特征词，用空格分隔
                </p>
              </div>
              
              <Alert>
                <HelpCircle className="h-4 w-4" />
                <AlertDescription>
                  建议包含商品类型、品牌、型号、主要功能等关键词，以获得更精准的搜索结果。
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {errors && (
            <Alert variant="destructive">
              <AlertDescription>{errors}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={loading || !inputValue.trim()}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  开始分析
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default ProductInput;