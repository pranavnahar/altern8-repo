import React from "react";
import ReactPlayer from "react-player";

export const AA_videos = () => {
  return (
    <div className="flex justify-center space-x-4 my-2">
      <div className="max-w-xs w-full">
        <ReactPlayer
          url="https://youtu.be/B4CEzFvGEds?si=gQqQBRdYLIbsnB4L&t=4"
          controls={true}
          className="rounded-lg overflow-hidden"
          width="100%"
          height="auto"
        />
      </div>
      <div className=" max-w-xs w-full">
        <ReactPlayer
          url="https://youtu.be/iht8DZLB-1E?si=qnu_0zuNWRUJBQnP"
          controls={true}
          className="rounded-lg overflow-hidden"
          width="100%"
          height="auto"
        />
      </div>
    </div>
  );
};
