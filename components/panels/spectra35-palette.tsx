import palette from "@/public/panels/spectra35/palette.json";
import styles from "./spectra35-palette.module.css";

export function Spectra35Palette() {
  return (
    <figure className="not-prose">
      <figcaption className={styles.caption}>
        Approximate appearance colors · 35 experimental recipes, not 35 certified colors.
        Tokens below identify recipes; they are not native Spectra6 pixel codes.
      </figcaption>
      <ol className={styles.grid}>
        {palette.map((entry, index) => (
          <li key={entry.deviceColor} className={styles.item}>
            <span className={styles.swatch} style={{ backgroundColor: entry.color }} aria-hidden="true" />
            <strong>Recipe {index} · {entry.name}</strong>
            <span>Appearance <code>{entry.color}</code></span>
            <span>Token <code>{entry.deviceColor}</code></span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
