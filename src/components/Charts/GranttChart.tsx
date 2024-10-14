// components/GanttChart.tsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type ChartDataPoint = {
  x: [number, number];
  y: string;
};

interface GanttChartProps {
  data: ChartDataPoint[];
  backgroundColor: string[]; // Change this line if using multiple colors
  min: number; // Min timestamp for x-axis range
  max: number; // Max timestamp for x-axis range
}
const GanttChart: React.FC<GanttChartProps> = ({
  data,
  backgroundColor,
  min,
  max,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        layout="vertical"
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 100,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[min, max]}
          tickFormatter={formatDate}
        />
        <YAxis type="category" dataKey="y" />
        <Tooltip
          formatter={(value: number) => formatDate(value)}
          labelFormatter={(label: string) => label}
        />
        {data.map((entry, index) => (
          <Bar
            key={entry.y}
            dataKey="x" // Instead of "endDate", we now use "x"
            fill={backgroundColor[index % backgroundColor.length]} // Use color cycling
            background={{ fill: "#eee" }}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};


export default GanttChart;
