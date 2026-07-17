"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** delay in ms before the reveal animation starts, once visible */
  delay?: number;
  /** direction the content travels in from */
  direction?: "up" | "left" | "right" | "none";
  as?: keyof JSX.IntrinsicElements;
};

/**
 * Fades + slides content into place the first time it scrolls into view.
 * Pure CSS transition driven by a single class toggle, so it stays cheap
 * even with many instances on one page.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as any;
  const startTransform =
    direction === "up"
      ? "translate-y-10"
      : direction === "left"
      ? "-translate-x-10"
      : direction === "right"
      ? "translate-x-10"
      : "";

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-x-0 translate-y-0" : `opacity-0 ${startTransform}`
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
