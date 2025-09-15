import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Badge } from '../ui/badge';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';
import type { ChartDataPoint } from '../../types';

interface StatsChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'area';
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  className?: string;
}

interface ChartMetrics {
  total: number;
  average: number;
  change: {
    value: number;
    type: 'increase' | 'decrease';
  };
  peak: {
    value: number;
    date: string;
  };
}

function SimpleChart({ data, type = 'line' }: { data: ChartDataPoint[]; type?: 'line' | 'bar' | 'area' }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>暂无数据</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  const getBarHeight = (value: number) => {
    if (range === 0) return 50;
    return ((value - minValue) / range) * 200 + 20;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  return (
    <div className="h-64 p-4">
      <div className="relative h-full">
        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
          <span>{formatValue(maxValue)}</span>
          <span>{formatValue((maxValue + minValue) / 2)}</span>
          <span>{formatValue(minValue)}</span>
        </div>

        {/* 图表区域 */}
        <div className="ml-12 h-full flex items-end justify-between space-x-1">
          {data.map((point, index) => {
            const height = getBarHeight(point.value);
            return (
              <div key={index} className="flex flex-col items-center group relative">
                {/* 数据点/柱状图 */}
                {type === 'bar' ? (
                  <div
                    className="bg-primary hover:bg-primary/80 transition-colors rounded-t-sm min-w-[20px] cursor-pointer"
                    style={{ height: `${height}px` }}
                  />
                ) : (
                  <div className="relative">
                    <div
                      className="bg-gradient-to-t from-primary/20 to-transparent rounded-t-sm min-w-[20px]"
                      style={{ height: `${height}px` }}
                    />
                    <div
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full -mt-1"
                    />
                  </div>
                )}

                {/* 悬浮提示 */}
                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                  <div>{formatValue(point.value)}</div>
                  <div className="text-gray-300">{point.label}</div>
                </div>

                {/* X轴标签 */}
                <div className="text-xs text-muted-foreground mt-2 transform -rotate-45 origin-left">
                  {point.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StatsChart({
  title,
  data,
  type = 'line',
  timeRange = '7d',
  onTimeRangeChange,
  className,
}: StatsChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>(type);

  // 计算统计指标
  const metrics = useMemo((): ChartMetrics => {
    if (!data || data.length === 0) {
      return {
        total: 0,
        average: 0,
        change: { value: 0, type: 'increase' },
        peak: { value: 0, date: '' },
      };
    }

    const total = data.reduce((sum, point) => sum + point.value, 0);
    const average = total / data.length;
    
    // 计算变化趋势（最后一个值与第一个值比较）
    const firstValue = data[0]?.value || 0;
    const lastValue = data[data.length - 1]?.value || 0;
    const changePercent = firstValue === 0 ? 0 : ((lastValue - firstValue) / firstValue) * 100;
    
    // 找到峰值
    const peakPoint = data.reduce((max, point) => 
      point.value > max.value ? point : max
    );

    return {
      total,
      average,
      change: {
        value: Math.abs(changePercent),
        type: changePercent >= 0 ? 'increase' : 'decrease',
      },
      peak: {
        value: peakPoint.value,
        date: peakPoint.label,
      },
    };
  }, [data]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('zh-CN').format(Math.round(num));
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN');
  };

  const handleExport = () => {
    // 模拟导出功能
    const csvContent = [
      ['日期', '数值'],
      ...data.map(point => [point.label, point.value.toString()])
    ]
      .map(row => row.join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${title}_${timeRange}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            {title}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {/* 图表类型选择 */}
            <Select value={chartType} onValueChange={(value: 'line' | 'bar' | 'area') => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">线图</SelectItem>
                <SelectItem value="bar">柱图</SelectItem>
                <SelectItem value="area">面积图</SelectItem>
              </SelectContent>
            </Select>

            {/* 时间范围选择 */}
            {onTimeRangeChange && (
              <Select value={timeRange} onValueChange={onTimeRangeChange}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7天</SelectItem>
                  <SelectItem value="30d">30天</SelectItem>
                  <SelectItem value="90d">90天</SelectItem>
                  <SelectItem value="1y">1年</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* 导出按钮 */}
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* 统计指标 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(metrics.total)}</div>
            <div className="text-xs text-muted-foreground">总计</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(metrics.average)}</div>
            <div className="text-xs text-muted-foreground">平均值</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              {metrics.change.type === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-lg font-bold ${
                metrics.change.type === 'increase' ? 'text-green-500' : 'text-red-500'
              }`}>
                {metrics.change.value.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">变化趋势</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(metrics.peak.value)}</div>
            <div className="text-xs text-muted-foreground">
              峰值 ({formatDate(metrics.peak.date)})
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <SimpleChart data={data} type={chartType} />
      </CardContent>
    </Card>
  );
}

export default StatsChart;