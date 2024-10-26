// This is a dashboard page component for showing piechart at main dashboardHome page
import React from 'react';
import { PieChart, Pie, Tooltip } from 'recharts';

const myData = [
  { name: 'Amount Left', value: 55.55, fill: '#7509b8' },
  { name: 'Amount Used', value: 44.45, fill: '#0088FE' },
];

// custom tool tip to add percentage sign in the end
const CustomTooltip: React.FC<{ active?: string; payload?: { name: string; value: string }[] }> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: '#212121',
          color: '#eeeeee',
          padding: '5px',
          borderRadius: '0.375rem',
        }}
      >
        <p className="label">{`${payload[0]?.name} : ${payload[0]?.value}`} %</p>
        {/* <p className="desc">Anything you want can be displayed here.</p> */}
      </div>
    );
  }

  return null;
};

const MyPieChart = () => {
  return (
    <PieChart width={240} height={240}>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        // isAnimationActive={!isServer} // Disable animation during server-side rendering
        data={myData}
        outerRadius={120}
        innerRadius={70}
        fill="orangered"
        id="recharts1"
        stroke="none"
        strokeWidth={0}
        // sx={{
        //   border: 'none',
        //   outline: 'none',
        // }}
        // label
      />

      {/* Display the tooltips */}
      <Tooltip content={<CustomTooltip />} />
    </PieChart>
  );
};

export default MyPieChart;
