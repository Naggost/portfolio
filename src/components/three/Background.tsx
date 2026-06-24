"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

const SunCanvas = dynamic(() => import("./SunCanvas"), { ssr: false });

export default function Background() {
  // On reload, glide smoothly up to the top instead of restoring abruptly.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const KEY = "nico:scrollY";
    const saved = Number(sessionStorage.getItem(KEY) || "0");
    const save = () => sessionStorage.setItem(KEY, String(window.scrollY));
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (saved > 4 && !reduce) {
      window.scrollTo(0, saved); // appear where you left off…
      const html = document.documentElement;
      const prev = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      const dur = 750;
      const t0 = performance.now();
      const ease = (t: number) => 1 - Math.pow(1 - t, 3);
      const step = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        window.scrollTo(0, saved * (1 - ease(p))); // …then slide up to the hero
        if (p < 1) requestAnimationFrame(step);
        else html.style.scrollBehavior = prev;
      };
      requestAnimationFrame(step);
    } else {
      window.scrollTo(0, 0);
    }

    return () => {
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  // Scrims are driven here (DOM level) so the darkening + readability work even
  // if WebGL is unavailable and the 3D canvas never mounts.
  useEffect(() => {
    let target = 0;
    let cur = 0;
    let raf = 0;
    const onScroll = () => {
      target = Math.min(window.scrollY / window.innerHeight, 1.4);
    };
    const tick = () => {
      cur += (target - cur) * 0.06;
      const sl = document.getElementById("scrimL");
      const sd = document.getElementById("scrimD");
      if (sl) sl.style.opacity = String(Math.max(0, 1 - cur * 1.25));
      if (sd) sd.style.opacity = String(Math.min(0.82, cur * 0.9));
      raf = requestAnimationFrame(tick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="ambient" />
      <CanvasErrorBoundary fallback={<div className="sun-fallback" />}>
        <SunCanvas />
      </CanvasErrorBoundary>
      <div className="cosmos" aria-hidden="true">
        <span className="shooting s1" />
        <span className="shooting s2" />
        <span className="shooting s3" />
        <span className="shooting s4" />
      </div>
      <div className="scrim-left" id="scrimL" />
      <div className="scrim-dark" id="scrimD" />
      <div className="vignette" />
      <div className="grain" />
    </>
  );
}
