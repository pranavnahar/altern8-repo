"use client"

import React, { useState } from 'react';
import { Progress } from "@/components/ui/progress";

const LinearBuffer = () => {
  const [progress, setProgress] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        return oldProgress + 10;
      });
    }, 500);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="w-full max-w-md">
      <Progress value={progress} />
    </div>
  );
};

export default LinearBuffer;
