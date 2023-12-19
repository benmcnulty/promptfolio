/* eslint-disable @next/next/no-img-element */
// components/ui/sparkle.tsx
import React from "react";

interface SparkleProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export const Sparkle: React.FC<SparkleProps> = ({
  width = "100%",
  height = "100%",
  className,
}) => (
  <div
    className={className}
    style={{ width: width, height: height, position: "relative" }}
  >
    <img
      src="/sparkle.svg"
      alt="Sparkle Icon"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        position: "absolute",
      }}
    />
  </div>
);
