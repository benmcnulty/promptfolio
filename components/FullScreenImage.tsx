// FullScreenImage.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

interface FullScreenImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  credit?: string;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  src,
  alt,
  width,
  height,
  caption,
  credit = "Created with DALL·E by Ben McNulty",
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (isFullScreen) {
      e.stopPropagation();
      setIsFullScreen(false);
    }
  };

  return (
    <div
      className={`${
        isFullScreen
          ? "fullscreen image fixed inset-0 z-50 flex flex-col justify-center items-center overflow-hidden cursor-pointer blurry"
          : "image relative flex justify-center items-center flex-col"
      }`}
      onClick={handleOverlayClick}
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        maxWidth: "inherit",
        overflow: isFullScreen ? "hidden" : "visible",
      }}
    >
      {isFullScreen && (
        <button
          onClick={handleOverlayClick}
          className="controller absolute top-4 right-4 z-50 p-2 rounded-full"
          aria-label="Close fullscreen"
          style={{
            width: "3rem",
            height: "3rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-6"
            strokeWidth="2"
          >
            <g transform="rotate(45 12 12)">
              <path d="M2 12h20" />
              <path d="M12 2v20" />
            </g>
          </svg>
        </button>
      )}
      <div
        className={isFullScreen ? "" : "relative"}
        style={{ cursor: "pointer" }}
        onClick={handleImageClick}
      >
        {isFullScreen ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain cursor-pointer"
            style={{
              objectFit: "contain",
            }}
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="cursor-pointer"
            style={{
              objectFit: "cover",
            }}
          />
        )}
        <div
          className={
            isFullScreen
              ? "credit absolute top-4 left-4 bg-white text-black p-1"
              : "credit absolute bottom-1 right-1 bg-white text-black p-1"
          }
        >
          {credit}
        </div>
      </div>
      {caption && (
        <div
          className={`${
            isFullScreen
              ? "caption absolute bottom-4 text-center bg-white text-black p-1"
              : "caption text-center bg-white text-black p-1 mt-2"
          }`}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default FullScreenImage;
