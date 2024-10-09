import LoadingSpinner from '../../../components/LoadingSpinner';
import React from 'react';

const LoadingOverlay = () => (
  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-600 bg-opacity-50 ">
    <div className="relative">
      <LoadingSpinner />
    </div>
  </div>
);

export default LoadingOverlay;
