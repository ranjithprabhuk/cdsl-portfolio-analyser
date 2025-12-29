import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { getAssetColor } from '../utils/assetClassifier';
import { formatCurrency, formatPercentage } from '../utils/formatters';

function AssetAllocationChart({ assetAllocation }) {
  if (!assetAllocation || assetAllocation.length === 0) {
    return (
      <div className="card mb-4 shadow-sm">
        <div className="card-body text-center py-5">
          <p className="text-muted">No data available for chart</p>
        </div>
      </div>
    );
  }

  const chartData = assetAllocation.map(asset => ({
    name: asset.assetType,
    value: asset.totalValue,
    percentage: asset.percentage,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card shadow-sm">
          <div className="card-body p-2">
            <p className="mb-1 fw-semibold">{payload[0].name}</p>
            <p className="mb-0 text-muted small">
              {formatCurrency(payload[0].value)}
            </p>
            <p className="mb-0 text-muted small">
              {formatPercentage(payload[0].payload.percentage)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-4">Asset Allocation</h5>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getAssetColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AssetAllocationChart;
