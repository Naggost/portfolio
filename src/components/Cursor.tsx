"use client";

import { useEffect, useRef } from "react";

// Custom cursor: a dot that tracks the pointer exactly + a ring that follows
// with a slight lag and grows/turns gold over interactive elements.
// Desktop only (fine pointer) and disabled for reduced-motion users.
const INTERACTIVE = "a, button, input, textarea, select, label, [role='button'], .card.is-link, .chip-opt";

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = matchMedia("(pointer: fine)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!fine || reduce || !dot || !ring) return; // mobile/touch: keep native cursor

    document.documentElement.classList.add("has-cursor");

    // Target = real pointer; ring eases toward it each frame.
    let tx = innerWidth / 2;
    let ty = innerHeight / 2;
    let rx = tx;
    let ry = ty;
    let raf = 0;

    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
      if (dot.style.opacity !== "1") {
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
    };
    const tick = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    const over = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) ring.classList.add("hover");
    };
    const out = (e: Event) => {
      if ((e.target as Element)?.closest?.(INTERACTIVE)) ring.classList.remove("hover");
    };
    const leave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const down = () => ring.classList.add("down");
    const up = () => ring.classList.remove("down");

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerout", out, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerout", out);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
