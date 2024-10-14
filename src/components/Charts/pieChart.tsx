// components/PieChart.tsx
import React from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  backgroundColor: string[];
  borderColor?: string[];
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  backgroundColor,
}) => {
  // Prepare data for recharts
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          fill="#8884d8"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={backgroundColor[index % backgroundColor.length]}
            />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPieChart>
    </ResponsiveContainer>
  );
};

export default PieChart;
