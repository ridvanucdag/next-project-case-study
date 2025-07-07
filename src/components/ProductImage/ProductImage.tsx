import Image from "next/image";
import React from "react";
import { ProductImageProps } from "./ProductImage.type";

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  width = 100,
  height = 100,
  className = "",
  priority = false,
}) => {
  const blurDataURL = `data:image/svg+xml;base64,${btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="${width}" height="${height}" fill="#f5f5f5"/></svg>`
  )}`;

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain"
        loading={priority ? "eager" : "lazy"}
        placeholder="blur"
        blurDataURL={blurDataURL}
        quality={75}
        sizes={`(max-width: 768px) ${width}px, (max-width: 1200px) ${width * 1.5}px, ${width}px`}
        priority={priority}
      />
    </div>
  );
};

export default ProductImage;