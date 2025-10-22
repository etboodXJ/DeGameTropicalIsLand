import React from 'react';
import { Box, Text } from '@radix-ui/themes';

interface ProfitChartProps {
  data: Array<{
    month: number;
    revenue: number;
    expectation: number;
  }>;
}

const ProfitChart: React.FC<ProfitChartProps> = ({ data }) => {
  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxExpectation = Math.max(...data.map(d => d.expectation));

  return (
    <Box className="bg-gray-800/30 rounded-lg p-4">
      <Text size="3" className="text-gray-400 mb-4">收益趋势图</Text>
      
      <div className="relative h-64 mb-4">
        {/* Y轴标签 */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600">
          <span>{maxRevenue.toFixed(2)}</span>
          <span>{(maxRevenue * 0.75).toFixed(2)}</span>
          <span>{(maxRevenue * 0.5).toFixed(2)}</span>
          <span>{(maxRevenue * 0.25).toFixed(2)}</span>
          <span>0.00</span>
        </div>

        {/* 图表区域 */}
        <div className="ml-12 h-full relative border-l border-b border-gray-600">
          {/* 网格线 */}
          {[0, 25, 50, 75, 100].map(percent => (
            <div
              key={percent}
              className="absolute w-full border-t border-gray-700/50"
              style={{ bottom: `${percent}%` }}
            />
          ))}

          {/* 数据柱状图 */}
          <div className="flex items-end justify-between h-full px-2">
            {data.slice(0, 6).map((item, index) => {
              const heightPercent = (item.revenue / maxRevenue) * 100;
              return (
                <div key={item.month} className="flex flex-col items-center">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-8 transition-all duration-300 hover:from-blue-400 hover:to-blue-200"
                    style={{ height: `${heightPercent}%`, minHeight: '2px' }}
                    title={`第${item.month}月: ${item.revenue.toFixed(4)} SUI`}
                  />
                  <Text size="1" className="text-gray-600 mt-1">
                    {item.month}月
                  </Text>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 图例 */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-300 rounded"></div>
          <span className="text-gray-500">预期收益 (SUI)</span>
        </div>
      </div>
    </Box>
  );
};

export default ProfitChart;