import { type ImgHTMLAttributes } from "react";

export interface ScreenshotFrameProps
  extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  /** Caption shown under the screenshot. */
  title?: string;
}

export default function ScreenshotFrame({
  src,
  alt = "",
  title,
  className,
  ...imgProps
}: ScreenshotFrameProps) {
  return (
    <figure className={`screenshot-frame ${className ?? ""}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="block h-auto w-full object-contain object-center"
        {...imgProps}
      />
      {title ? <figcaption>{title}</figcaption> : null}
    </figure>
  );
}
