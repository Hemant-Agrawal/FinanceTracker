'use client';

import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { CurveType } from 'recharts/types/shape/Curve';

interface GenericChartProps {
  data: Record<string, any>[];
  type: 'line' | 'bar' | 'pie';
  dataKeys: string[]; // Support multiple data keys
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
  config?: Record<string, any>;
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
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type={curveType}
                dataKey={key}
                stroke={colors[index % colors.length]}
                isAnimationActive={animation}
              />
            ))}
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={data} layout={barLayout}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            {dataKeys.map((key, index) => (
              <Bar key={key} dataKey={key} fill={colors[index % colors.length]} isAnimationActive={animation} />
            ))}
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart>
            {showTooltip && <ChartTooltip content={<ChartTooltipContent />} />}
            {showLegend && <ChartLegend content={<ChartLegendContent />} />}
            <Pie
              data={data}
              dataKey={dataKeys[0]}
              nameKey={xAxisKey}
              innerRadius={pieInnerRadius}
              outerRadius={pieOuterRadius}
              fill={colors[0]}
              label
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
          </PieChart>
        );
      }
    };
    
    return (
      <ChartContainer config={config} className="w-full h-full">
      {renderChart()}
    </ChartContainer>
  );
};

export default GenericChart;
