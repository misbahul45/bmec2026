import React, { forwardRef } from "react";

interface ImageShapeProps {
  image: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const ImageShape = forwardRef<HTMLDivElement, ImageShapeProps>(
  ({ image, size = 128, className = "", style = {} }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute ${className}`}
        style={{
          width: size,
          height: size,
          willChange: "transform",
          ...style,
        }}
      >
        {/* Glow ring */}
        <div
          style={{
            position: "absolute",
            inset: -6,
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, rgba(0,212,255,0.25), rgba(0,80,200,0.1))",
            transform: "rotate(45deg)",
            filter: "blur(8px)",
          }}
        />

        {/* Diamond shape container */}
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "rotate(45deg)",
            overflow: "hidden",
            borderRadius: "22px",
            border: "1px solid rgba(0,212,255,0.3)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05) inset",
            position: "relative",
          }}
        >
          {/* Image fills the rotated box */}
          <div
            style={{
              position: "absolute",
              top: "-21%",
              left: "-21%",
              width: "142%",
              height: "142%",
              transform: "rotate(-45deg)",
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Overlay shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,212,255,0.08) 0%, transparent 60%)",
            }}
          />
        </div>
      </div>
    );
  }
);

ImageShape.displayName = "ImageShape";
export default ImageShape;