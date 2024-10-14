import React from "react";
import { motion } from "framer-motion";

type Props = {
  radius: number;
  stroke: number;
  progress: number;
};

const ProgressCircle = ({ stroke, radius, progress }: Props) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  return (
    <svg width={radius * 2} height={radius * 2}>
      <circle
        cx={radius}
        cy={radius}
        r={radius - stroke / 2}
        stroke="lightgray"
        strokeWidth={stroke}
        fill="transparent"
      />
      <motion.circle
        className={"border-1 border-black"}
        cx={radius}
        cy={radius}
        r={radius - stroke / 2}
        stroke="#1565c0"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        fill="transparent"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset }}
        transition={{ duration: 1 }}
      />
      <text
        x={radius}
        y={radius}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={radius / 2} // Adjust font size relative to radius
        fill="white"
      >
        {`${progress}%`}
      </text>
    </svg>
  );
};

export default ProgressCircle;
