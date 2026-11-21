type TechniquePreviewProps = {
  image: string;
  alt: string;
  left: string;
  right: string;
  height: number;
};

export function TechniquePreview({ image, alt, left, right, height }: TechniquePreviewProps) {
  return (
    <figure className="not-prose m-0 w-[clamp(8rem,27vw,13rem)]">
      <img
        src={`/panels/techniques/${image}.webp`}
        width={608}
        height={height}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full rounded"
      />
      <figcaption className="mt-1 grid grid-cols-2 gap-1 text-center text-xs leading-snug text-fd-muted-foreground">
        <span>{left}</span>
        <span>{right}</span>
      </figcaption>
    </figure>
  );
}
