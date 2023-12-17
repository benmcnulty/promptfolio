/* eslint-disable @next/next/no-img-element */
import React from "react";

interface SparkleProps {
  size?: number | string;
  className?: string;
}

export const Sparkle: React.FC<SparkleProps> = ({
  size = "100%",
  className,
}) => (
  <div
    className={className}
    style={{ width: size, height: size, position: "relative" }}
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
