"use client";

import { useEffect, useRef } from "react";
import { TECH, techIcon } from "@/lib/tech";
import { useLanguage } from "@/lib/i18n";

const STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind",
  "Three.js",
  "GSAP",
  "Motion",
  "Node.js",
  "PostgreSQL",
  "Stripe",
  "Vercel",
];

export default function About() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const items = Array.from(ref.current?.querySelectorAll<HTMLElement>(".reveal-up") ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const i = items.indexOf(el);
            el.style.transitionDelay = `${i * 0.12}s`;
            el.classList.add("in");
            setTimeout(() => (el.style.transitionDelay = ""), 1000 + i * 120);
            io.unobserve(el);
          }
        }),
      { threshold: 0.25 },
    );
    items.forEach((x) => io.observe(x));
    return () => io.disconnect();
  }, []);

  return (
    <section className="about" id="sobre-mi">
      <div className="about-grid" ref={ref}>
        <div className="reveal-up">
          <span className="label">{t.about.label}</span>
          <p className="statement">{t.about.statement}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
        </div>
        <div className="reveal-up stack-col">
          <p className="stack-title">{t.about.stackTitle}</p>
          <div className="stack">
            {STACK.map((t) => {
              const tech = TECH[t];
              return (
                <span
                  className="chip"
                  key={t}
                  style={{ borderColor: `${tech.hex}59`, background: `${tech.hex}14` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={techIcon(tech.slug, tech.hex)} alt="" width={16} height={16} />
                  {t}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
