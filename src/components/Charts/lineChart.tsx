// components/LineChart.tsx
import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  backgroundColor: string;
  borderColor: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  backgroundColor,
  borderColor,
}) => {
  // Prepare data for recharts
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke={borderColor}
          strokeWidth={2}
          dot={{ r: 5, fill: backgroundColor }} // Dot styling
          activeDot={{ r: 8 }}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
