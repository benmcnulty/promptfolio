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
          ? "fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center overflow-hidden cursor-pointer"
          : "relative flex justify-center items-center"
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
      <div style={{ cursor: "pointer" }} onClick={handleImageClick}>
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
      </div>
    </div>
  );
};

export default FullScreenImage;
