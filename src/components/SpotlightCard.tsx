"use client";

import { useRef } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  glow?: string;
  tilt?: boolean;
};

/**
 * Wraps a card and adds:
 *  - a soft radial "spotlight" that follows the cursor (via CSS vars,
 *    painted by the ::before in globals.css through the `.spotlight-card` class)
 *  - an optional subtle 3D tilt toward the pointer
 *
 * Everything else about the card (background, border, hover scale/lift)
 * stays exactly as authored in the className passed in — this only adds
 * the pointer-reactive layer on top.
 */
export default function SpotlightCard({
  children,
  className = "",
  glow = "rgba(16,185,129,0.35)",
  tilt = true,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--spot-x", `${x}px`);
    el.style.setProperty("--spot-y", `${y}px`);

    if (tilt) {
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      el.style.setProperty("--tilt-x", `${(-py * 6).toFixed(2)}deg`);
      el.style.setProperty("--tilt-y", `${(px * 6).toFixed(2)}deg`);
    }
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`spotlight-card ${className}`}
      style={{ "--spot-color": glow } as React.CSSProperties}
    >
      <div className="spotlight-card-inner">{children}</div>
    </div>
  );
}
