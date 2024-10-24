import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className="size-10 animate-spin text-primary" />
    </div>
  );
};

export default LoadingSpinner;
