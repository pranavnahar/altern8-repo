"use client";
import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface BarChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  backgroundColor: string[];
  borderColor?: string[];
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  backgroundColor,
  borderColor,
}) => {
  // Prepare the data in a format recharts can handle
  const chartData = data.labels.map((label, index) => ({
    name: label,
    value: data.values[index],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsBarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="value"
          fill={backgroundColor[0]} // Use the first color for bars
          stroke={borderColor ? borderColor[0] : "#000000"} // Optional border color
          strokeWidth={1}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
