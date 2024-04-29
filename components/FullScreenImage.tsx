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

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      className={`${
        isFullScreen
          ? "fixed inset-0 bg-black bg-opacity-90 z-50 flex justify-center items-center overflow-hidden cursor-pointer"
          : "relative flex justify-center items-center"
      }`}
      onClick={toggleFullScreen}
      style={{
        width: "100%",
        height: "100%",
        margin: 0,
        maxWidth: "inherit",
        overflow: isFullScreen ? "hidden" : "visible",
      }}
    >
      <div style={{ cursor: "pointer" }}>
        <Image
          src={src}
          alt={alt}
          width={isFullScreen ? undefined : width}
          height={isFullScreen ? undefined : height}
          layout={isFullScreen ? "fill" : "intrinsic"}
          className={`${isFullScreen ? "object-contain" : ""}`}
          style={{
            objectFit: isFullScreen ? "contain" : "cover",
            width: isFullScreen ? "100%" : undefined,
            height: isFullScreen ? "100%" : undefined,
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default FullScreenImage;
