import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

export const AA_videos = () => {
  const [currentVideo, setCurrentVideo] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const videos = [
    {
      url: 'https://youtu.be/B4CEzFvGEds?si=gQqQBRdYLIbsnB4L&t=4',
      thumbnail: 'https://img.youtube.com/vi/B4CEzFvGEds/0.jpg',
    },
    {
      url: 'https://youtu.be/iht8DZLB-1E?si=qnu_0zuNWRUJBQnP',
      thumbnail: 'https://img.youtube.com/vi/iht8DZLB-1E/0.jpg',
    },
  ];

  return (
    <div>
      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-4 my-4 max-w-lg mx-auto mt-5">
        {videos.map((video, index) => (
          <div
            key={index}
            className="relative cursor-pointer group"
            onClick={() => {
              setCurrentVideo(video.url);
              setIsDialogOpen(true);
            }}
          >
            {/* Video Thumbnail */}
            <img
              src={video.thumbnail}
              alt={`Video ${index + 1}`}
              className="rounded-lg object-cover w-full h-32"
            />
            {/* Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="white"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.752 11.168l-3.197-1.765A1 1 0 0010 10.234v3.532a1 1 0 001.555.832l3.197-1.766a1 1 0 000-1.732z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for Video Playback */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-black/70 p-0 max-w-5xl w-full h-[83vh] border-none">
          <div
            className="relative h-full rounded-1xl border-8 border-white/20 bg-white/10 backdrop-blur-md shadow-lg overflow-hidden"
            style={{
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Close Button */}
            <DialogClose asChild>
              <button
                className="absolute top-2 right-2 z-50 text-white"
                aria-label="Close"
                onClick={() => setCurrentVideo('')}
              >
              </button>
            </DialogClose>
            {/* ReactPlayer */}
            {currentVideo && (
              <ReactPlayer
                url={currentVideo}
                controls={true}
                playing={true}
                width="100%"
                height="100%"
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  objectFit: "cover", // Ensures video covers the entire area
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
