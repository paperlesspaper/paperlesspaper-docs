import type { ReactNode } from "react";
import styles from "./color-measurements.module.css";

export type ColorMeasurement = {
  id: string;
  name: string;
  kind: string;
  pair: string | null;
  hex: string;
  srgb: number[];
  lab: number[];
  nativeCode: string | null;
  maxPositionDeltaE00: number | null;
  areaModelDeltaE00: number;
};

/** A measured sRGB preview with its label outside the color area for contrast. */
export function ColorSwatch({
  name,
  hex,
  children,
}: {
  name: string;
  hex: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.swatch}>
      <div className={styles.color} style={{ backgroundColor: hex }} aria-hidden="true" />
      <div className={styles.details}>
        <div className={styles.name}>{name}</div>
        <code className={styles.hex}>{hex}</code>
        {children}
      </div>
    </div>
  );
}

export function SolidColorPalette({ measurements }: { measurements: ColorMeasurement[] }) {
  return (
    <div className={`${styles.palette} not-prose`} aria-label="Six measured solid colors">
      {measurements.filter((sample) => sample.kind === "solid").map((sample) => (
        <ColorSwatch key={sample.id} name={sample.name} hex={sample.hex}>
          <dl className={styles.values}>
            <div><dt>sRGB</dt><dd>{sample.srgb.join(", ")}</dd></div>
            <div><dt>Lab</dt><dd>{sample.lab.map((value) => value.toFixed(1)).join(" / ")}</dd></div>
            <div><dt>Input code</dt><dd>{sample.nativeCode}</dd></div>
            <div><dt>Max. position ΔE₀₀</dt><dd>{sample.maxPositionDeltaE00?.toFixed(2)}</dd></div>
          </dl>
        </ColorSwatch>
      ))}
    </div>
  );
}

export function MixtureColorSwatches({ measurements }: { measurements: ColorMeasurement[] }) {
  const groups = new Map<string, ColorMeasurement[]>();
  for (const sample of measurements) {
    if (sample.kind !== "mixture" || sample.pair === null) continue;
    const group = groups.get(sample.pair) ?? [];
    group.push(sample);
    groups.set(sample.pair, group);
  }

  return (
    <div className={`${styles.mixtures} not-prose`} aria-label="45 measured two-color mixtures">
      {Array.from(groups, ([pair, samples]) => (
        <section className={styles.group} aria-label={`${pair} mixtures`} key={pair}>
          <div className={styles.groupTitle}>{pair}</div>
          <div className={styles.mixtureGrid}>
            {samples.map((sample) => (
              <ColorSwatch key={sample.id} name={sample.name} hex={sample.hex}>
                <div className={styles.modelError}>
                  Area-model ΔE₀₀: {sample.areaModelDeltaE00.toFixed(1)}
                </div>
              </ColorSwatch>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function PanelPhotoGallery({ children }: { children: ReactNode }) {
  return <div className={styles.photoGallery}>{children}</div>;
}

/** Link directly to the photo; measurement captures bypass image optimization. */
export function PanelPhoto({ src, alt, caption, width = 2560, height = 1440 }: {
  src: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure className={`${styles.photo} not-prose`}>
      <a href={src} aria-label={`Open full-size image: ${alt}`}>
        <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
      </a>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
