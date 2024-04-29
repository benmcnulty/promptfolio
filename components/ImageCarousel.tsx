"use client";
import React, { useRef, useState, useEffect } from "react";
import FullScreenImage from "./FullScreenImage";

interface ImageData {
  src: string;
  alt: string;
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
    // Set up event listener for scroll events
    const div = carouselRef.current;
    div?.addEventListener("scroll", checkScroll);

    return () => {
      div?.removeEventListener("scroll", checkScroll);
    };
  }, []);

  return (
    <div className="relative">
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 z-10 p-2 text-lg md:text-xl"
          aria-label="Scroll left"
        >
          ◀
        </button>
      )}
      <div
        ref={carouselRef}
        className="flex overflow-x-auto snap-x snap-mandatory p-4 gap-4 my-carousel"
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
              height={300}
            />
          </div>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 z-10 p-2 text-lg md:text-xl"
          aria-label="Scroll right"
        >
          ▶
        </button>
      )}
    </div>
  );
};

export default ImageCarousel;
