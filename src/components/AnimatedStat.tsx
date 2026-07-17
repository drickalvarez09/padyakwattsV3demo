"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedStatProps = {
  /** e.g. "500+", "2.5K+", "120Kg", "850 Wh" */
  value: string;
  duration?: number;
  className?: string;
};

/**
 * Parses the leading number out of a display string (handles decimals,
 * "K" suffixes, etc.), counts up to it once the element scrolls into
 * view, and re-attaches whatever prefix/suffix text surrounded the number.
 */
export default function AnimatedStat({ value, duration = 1400, className = "" }: AnimatedStatProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(value.replace(/[\d.]+/, "0"));
  const started = useRef(false);

  useEffect(() => {
    const match = value.match(/([\d]*\.?[\d]+)/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(match[0]);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice((match.index ?? 0) + match[0].length);
    const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const startTime = performance.now();

            const tick = (now: number) => {
              const progress = Math.min((now - startTime) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = (target * eased).toFixed(decimals);
              setDisplay(`${prefix}${current}${suffix}`);
              if (progress < 1) requestAnimationFrame(tick);
            };

            requestAnimationFrame(tick);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
