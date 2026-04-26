type PaperlesspaperLogoProps = {
  className?: string;
};

export function PaperlesspaperLogo({
  className = "h-6 w-auto",
}: PaperlesspaperLogoProps) {
  return (
    <span
      className="inline-flex items-center text-current gap-[0.1em]"
      aria-label="paperlesspaper API"
    >
      <span className="border-[1px] border-current ml-1 mr-2 h-4 w-3 scale-150 text-sky-600">
        <span className="inline-block  rotate-80 -translate-x-[-0.37em] -translate-y-[0.5em] text-[0.5em] font-semibold">
          <span className="font-black">:</span>)
        </span>
      </span>{" "}
      paperlesspaper docs
    </span>
  );
}
