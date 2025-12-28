'use client';

import React from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartConfig } from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';
import { cn } from '@/lib/utils';

interface GenericChartProps {
  data: Record<string, unknown>[];
  type: 'line' | 'bar' | 'pie';
  dataKeys: Array<string | { key: string; label?: string }>; // Support multiple data keys
  xAxisKey?: string;
  colors?: string[];
  showTooltip?: boolean;
  showLegend?: boolean;
  showGrid?: boolean;
  curveType?: CurveType;
  animation?: boolean;
  barLayout?: 'horizontal' | 'vertical';
  pieInnerRadius?: number;
  pieOuterRadius?: number;
  config?: Record<string, unknown>;
  className?: string;
}

const GenericChart: React.FC<GenericChartProps> = ({
  data,
  type,
  dataKeys,
  xAxisKey = 'name',
  colors = ['#8884d8', '#82ca9d', '#ffc658'],
  showTooltip = true,
  showLegend = true,
  showGrid = true,
  curveType = 'monotone',
  animation = true,
  barLayout = 'horizontal',
  pieInnerRadius = 0,
  pieOuterRadius = 80,
  config = {},
  className = '',
}) => {
  const dataKeysWithLabels = dataKeys.map(key =>
    typeof key !== 'string' ? key : { key: key, label: key }
  );
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {dataKeysWithLabels.map(({ key, label }, index) => (
              <Line
                key={key}
                type={curveType}
                dataKey={key}
                name={label}
                stroke={colors[index % colors.length]}
                isAnimationActive={animation}
              />
            ))}
            {showLegend && <ChartLegend />}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} layout={barLayout}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {dataKeysWithLabels.map(({ key, label }, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} name={label} isAnimationActive={animation} />
            ))}
            {showLegend && <ChartLegend />}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            <Pie
              data={data}
              dataKey={dataKeysWithLabels[0].key}
              nameKey={xAxisKey}
              innerRadius={pieInnerRadius}
              outerRadius={pieOuterRadius}
              fill={colors[0]}
              label={({ name, percent }) => ` ${name}: ${(Number(percent) * 100).toFixed(0)}% `}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showLegend && <ChartLegend />}
          </PieChart>
        );
    }
  };

  return (
    <ChartContainer 
      config={config as ChartConfig} 
      className={cn('w-full h-full min-h-[300px]', className)}
      style={{ minHeight: '300px', height: '100%' }}
    >
      {renderChart()}
    </ChartContainer>
  );
};

export default GenericChart;
