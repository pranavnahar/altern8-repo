"use client";
import React from "react";

interface DrawHeaderProps {
    params: {
      id: string | number;
    };
  }

const DrawHeader = ({ params }: DrawHeaderProps) => {
  return (
    <div
      className={`px-5 draw-header [background:linear-gradient(243.52deg,_#021457,_#19112f_31.84%,_#251431_51.79%,_#301941_64.24%,_#6e3050),_#0f1212] flex`}
    >
      <h1 className="text-2xl font-bold text-white mr-5">{`Tranche ${params?.id}`}</h1>
      <div className="mx-5">
        <p className="text-white text-xs">Tranche Total</p>
        <h4 className="text-themeBlue font-bold">74554564 INR</h4>
      </div>
      <div className="mx-5">
        <p className="text-white text-xs">Approvals</p>
        <h4 className="text-white">Approved</h4>
      </div>
    </div>
  );
};

export default DrawHeader;
