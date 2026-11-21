"use client";

import { useState, type CSSProperties } from "react";
import styles from "./photo-comparison.module.css";

type Photo = { src: string; label: string; alt: string };

export function PhotoComparison({ before, after, width, height }: {
  before: Photo;
  after: Photo;
  width: number;
  height: number;
}) {
  const [split, setSplit] = useState(50);

  return (
    <figure className={`${styles.figure} not-prose`}>
      <figcaption className={styles.labels}>
        <a href={before.src}>Before · {before.label}</a>
        <a href={after.src}>After · {after.label}</a>
      </figcaption>
      <div className={styles.frame} style={{ "--split": `${split}%` } as CSSProperties}>
        <img src={after.src} alt={after.alt} width={width} height={height} loading="lazy" />
        <img className={styles.before} src={before.src} alt={before.alt} width={width} height={height} loading="lazy" />
        <span className={styles.divider} aria-hidden="true" />
        <span className={styles.handle} aria-hidden="true">‹ ›</span>
        <input type="range" min={0} max={100} value={split}
          aria-label={`Compare ${before.label} with ${after.label}`}
          aria-valuetext={`${split}% before, ${100 - split}% after`}
          onChange={(event) => setSplit(event.currentTarget.valueAsNumber)}
        />
      </div>
    </figure>
  );
}
