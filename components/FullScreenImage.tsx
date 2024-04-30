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
  credit = "Default Credit",
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
          ? "fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col justify-center items-center overflow-hidden cursor-pointer"
          : "relative flex justify-center items-center flex-col"
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
          className="absolute top-4 right-4 z-50 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 dark:bg-black dark:bg-opacity-30 dark:hover:bg-opacity-50 rounded-full"
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
              ? "absolute top-4 left-4 bg-white text-black p-1"
              : "absolute bottom-0 right-0 bg-white text-black p-1"
          }
        >
          {credit}
        </div>
      </div>
      {caption && (
        <div
          className={`${
            isFullScreen
              ? "absolute bottom-4 text-center bg-white text-black p-1"
              : "text-center bg-white text-black p-1"
          }`}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export default FullScreenImage;
