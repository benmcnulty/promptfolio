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
    <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4 p-4">
      {images.map((image, index) => (
        <div key={index} className="snap-center shrink-0">
          <FullScreenImage
            src={image.src}
            alt={image.alt}
            width={500} // Default width for non-full-screen images
            height={300} // Default height for non-full-screen images
          />
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;
