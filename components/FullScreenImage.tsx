// FullScreenImage.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";

interface FullScreenImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const FullScreenImage: React.FC<FullScreenImageProps> = ({
  src,
  alt,
  width,
  height,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Toggle FullScreen on by clicking the image itself
  const handleImageClick = () => {
    setIsFullScreen(true);
  };

  // Toggle FullScreen off by clicking the overlay but not the image
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (isFullScreen) {
      e.stopPropagation(); // Prevent the click from affecting the inner image click
      setIsFullScreen(false);
    }
  };

  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center overflow-hidden cursor-pointer"
          : "relative flex justify-center items-center"
      }`}
      onClick={handleOverlayClick} // Set the overlay click to handle fullscreen off
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        maxWidth: "inherit",
        overflow: isFullScreen ? "hidden" : "visible",
      }}
    >
      <div style={{ cursor: "pointer" }} onClick={handleImageClick}>
        {isFullScreen ? (
          <Image
            src={src}
            alt={alt}
            fill // Using fill to ensure the image can cover the container in full-screen
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
      </div>
    </div>
  );
};

export default FullScreenImage;
