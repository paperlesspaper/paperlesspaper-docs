"use client";

import { useEffect } from "react";

const movedSections = new Set([
  "#test-patterns",
  "#reading-the-swatches",
  "#measurement-method",
  "#measurement-limits",
  "#references",
]);

export function MovedCalibrationSection() {
  useEffect(() => {
    function followOldLink() {
      const { hash } = window.location;
      if (movedSections.has(hash)) {
        window.location.replace(`/panels/color-calibration${hash}`);
      }
    }

    followOldLink();
    window.addEventListener("hashchange", followOldLink);
    return () => window.removeEventListener("hashchange", followOldLink);
  }, []);

  return null;
}
