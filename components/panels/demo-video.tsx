"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

export function DemoVideo(props: Pick<ComponentPropsWithoutRef<"video">,
  "src" | "poster" | "width" | "height" | "aria-label">) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let started = false;
    let automatic = false;
    const markStarted = () => { started = true; };
    const onPause = () => { automatic = false; };
    const stopAutomatic = () => { if (automatic) video.pause(); };
    const onPreferenceChange = () => { if (motion.matches) stopAutomatic(); };
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        stopAutomatic();
      } else if (entry.intersectionRatio >= 0.5 && !started && !motion.matches) {
        started = true;
        automatic = true;
        void video.play().catch(() => { automatic = false; });
      }
    }, { threshold: [0, 0.5] });

    observer.observe(video);
    video.addEventListener("play", markStarted);
    video.addEventListener("pause", onPause);
    motion.addEventListener("change", onPreferenceChange);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", markStarted);
      video.removeEventListener("pause", onPause);
      motion.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return <video {...props} ref={ref} controls muted playsInline preload="none" />;
}
