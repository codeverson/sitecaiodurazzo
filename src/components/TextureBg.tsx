import type { CSSProperties } from "react";

/** Camada de textura fotográfica — composição, não só “fundo bonito”. */
export default function TextureBg({
  src,
  className = "",
  opacity = 0.25,
  blendMode = "overlay",
  position = "center",
  size = "cover",
}: {
  src: string;
  className?: string;
  opacity?: number;
  blendMode?: CSSProperties["mixBlendMode"];
  position?: string;
  size?: CSSProperties["backgroundSize"];
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        backgroundPosition: position,
        backgroundSize: size,
        opacity,
        mixBlendMode: blendMode,
      }}
    />
  );
}
