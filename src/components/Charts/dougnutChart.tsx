import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface CircularChartProps {
  value: string;
  description: string;
  backgroundColor: string[];
  borderColor?: string[];
}

const CircularChart: React.FC<CircularChartProps> = ({
  value,
  description,
  backgroundColor,
}) => {
  const data = [
    { name: "Schedule Health", value: 50 },
    { name: "Remaining", value: 50 },
  ];

  return (
    <div className="relative w-[300px] h-full">
      <div className="absolute w-full h-full flex items-center justify-center">
        <div className="w-[50%] mt-2 text-center text-white">
          <p>{value}</p>
          <p>{description}</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={100}
            startAngle={220}
            endAngle={500}
            fill="#8884d8"
            paddingAngle={5}
            cornerRadius={10}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={backgroundColor[index % backgroundColor.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CircularChart;
