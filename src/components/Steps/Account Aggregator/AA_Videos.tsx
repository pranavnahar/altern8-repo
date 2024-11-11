import React from "react";
import ReactPlayer from "react-player";

export const AA_videos = () => {
  return (
    <div className="flex justify-center space-x-4 my-2">
      <div className="max-w-xs w-full">
        <ReactPlayer
          url="https://youtu.be/YDjKI0VMtiM?si=g32b9rydr5W9D0x4&t=4"
          controls={true}
          className="rounded-lg overflow-hidden"
          width="100%"
          height="auto"
        />
      </div>
      <div className=" max-w-xs w-full">
        <ReactPlayer
          url="https://youtu.be/Cf_rAhtn0H8?si=i6dJ2dgevYODcK-f"
          controls={true}
          className="rounded-lg overflow-hidden"
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};
