// Define the type for the image data
interface ImageData {
  src: string;
  alt: string;
}

// Carousel component using FullScreenImage
import React from "react";
import FullScreenImage from "./FullScreenImage";

interface ImageCarouselProps {
  images: ImageData[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  return (
    <div className="relative">
      <div className="flex overflow-x-auto snap-x snap-mandatory p-4 gap-4 my-carousel">
        {images.map((image, index) => (
          <div
            key={index}
            className="snap-center shrink-0 flex-none w-80 md:w-96 h-auto" // Dynamic sizing and fixed width at different breakpoints
          >
            <FullScreenImage
              src={image.src}
              alt={image.alt}
              width={500} // These width and height props could be removed if not required as the CSS handles sizing
              height={300}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
