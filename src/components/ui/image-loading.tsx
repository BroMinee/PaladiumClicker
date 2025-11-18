import Image from "next/image";
import React from "react";
import { ImageProps } from "next/image";

type ImageLoadingProps = Omit<ImageProps, "placeholder" | "blurDataURL"> & {
  blurDataURL: string;
};

type ImageNextNeedProps = {
  alt: string;
}

const ImageLoading = React.forwardRef<HTMLImageElement, ImageLoadingProps & ImageNextNeedProps>(
  ({ blurDataURL, alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        blurDataURL={blurDataURL}
        placeholder='blur'
        {...props}
      />
    );
  });

ImageLoading.displayName = "ImageLoading";

const UnOptimizedImage = React.forwardRef<HTMLImageElement, ImageProps & ImageNextNeedProps>(
  ({ alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        alt={alt}
        unoptimized={true}
        {...props}
      />
    );
  });

UnOptimizedImage.displayName = "UnOptimizedImage";

export { ImageLoading, UnOptimizedImage };

