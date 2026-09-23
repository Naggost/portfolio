"use client";

import { useEffect, useRef } from "react";
import { flyToContact } from "@/lib/meteor";
import { useLanguage } from "@/lib/i18n";

export default function Hero() {
  const { t } = useLanguage();
  const twRef = useRef<HTMLSpanElement>(null);
  const words = t.hero.words;

  // typewriter
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (twRef.current) twRef.current.textContent = words[0];
      return;
    }
    let wi = 0;
    let ci = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    const type = () => {
      const el = twRef.current;
      if (!el) return;
      const w = words[wi];
      if (!deleting) {
        ci++;
        el.textContent = w.slice(0, ci);
        if (ci === w.length) {
          deleting = true;
          timer = setTimeout(type, 1500);
          return;
        }
      } else {
        ci--;
        el.textContent = w.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          timer = setTimeout(type, 300);
          return;
        }
      }
      timer = setTimeout(type, deleting ? 40 : 85);
    };
    timer = setTimeout(type, 1600);
    return () => clearTimeout(timer);
  }, [words]);

  // magnetic buttons
  useEffect(() => {
    const btns = Array.from(document.querySelectorAll<HTMLButtonElement>(".magnetic"));
    const move = (btn: HTMLButtonElement) => (e: PointerEvent) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.3}px,${
        (e.clientY - (r.top + r.height / 2)) * 0.4
      }px)`;
    };
    const leave = (btn: HTMLButtonElement) => () => {
      btn.style.transform = "";
    };
    const handlers = btns.map((b) => {
      const mv = move(b);
      const lv = leave(b);
      b.addEventListener("pointermove", mv);
      b.addEventListener("pointerleave", lv);
      return { b, mv, lv };
    });
    return () =>
      handlers.forEach(({ b, mv, lv }) => {
        b.removeEventListener("pointermove", mv);
        b.removeEventListener("pointerleave", lv);
      });
  }, []);

  return (
    <section className="hero">
      <h1>
        <span className="line reveal-1">
          <span>{t.hero.line1}</span>
        </span>
        <span className="line reveal-2">
          <span>
            <span className="accent" ref={twRef} />
            <span className="caret" />
          </span>
        </span>
        <span className="line reveal-3">
          <span>{t.hero.line3}</span>
        </span>
      </h1>
      <p className="sub">{t.hero.sub}</p>
      <div className="cta">
        <button
          className="btn btn-primary magnetic"
          onClick={() => {
            const h = document.querySelector<HTMLElement>("#trabajos h2");
            if (h)
              window.scrollTo({
                top: h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.1,
                behavior: "smooth",
              });
          }}
        >
          <span className="label">{t.hero.ctaProjects}</span>
          <span className="arrow">→</span>
        </button>
        <button className="btn btn-ghost magnetic" onClick={flyToContact}>
          <span className="label">{t.hero.ctaContact}</span>
          <span className="arrow">→</span>
        </button>
      </div>
      <div className="scrollcue" aria-hidden="true">
        <span className="mouse">
          <span className="wheel" />
        </span>
        <span className="chevron">↓</span>
      </div>
    </section>
  );
}
