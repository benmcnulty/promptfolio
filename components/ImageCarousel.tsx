"use client";
import React, { useRef, useState, useEffect } from "react";
import FullScreenImage from "./FullScreenImage";

interface ImageData {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
}

interface ImageCarouselProps {
  images: ImageData[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  useEffect(() => {
    checkScroll();
    const div = carouselRef.current;
    div?.addEventListener("scroll", checkScroll);

    return () => {
      div?.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div className="relative w-full pt-4 pb-4">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="controller absolute left-10 top-1/2 -translate-y-1/2 z-30 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 dark:bg-black dark:bg-opacity-30 dark:hover:bg-opacity-50 rounded-full"
          aria-label="Scroll left"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 12 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-full"
            strokeWidth="4"
          >
            <path d="M11 23L1 12 11 1" />
          </svg>
        </button>
      )}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory my-carousel w-full gap-4"
        onScroll={checkScroll}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="snap-center shrink-0 flex-none w-80 md:w-96 h-auto"
          >
            <FullScreenImage
              src={image.src}
              alt={image.alt}
              width={500}
              height={500}
              caption={image.caption}
              credit={image.credit}
            />
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="controller absolute right-10 top-1/2 -translate-y-1/2 z-30 p-2 bg-white bg-opacity-30 hover:bg-opacity-50 dark:bg-black dark:bg-opacity-30 dark:hover:bg-opacity-50 rounded-full"
          aria-label="Scroll right"
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 12 24"
            fill="none"
            stroke="currentColor"
            className="w-6 h-full"
            strokeWidth="4"
          >
            <path d="M1 1l10 11L1 23" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
