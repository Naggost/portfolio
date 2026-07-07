"use client";

import { useEffect, useRef } from "react";
import { TECH, techIcon } from "@/lib/tech";
import { useLanguage } from "@/lib/i18n";

const TAGS = [
  ["Next.js", "Tailwind", "GSAP", "Motion"],
  ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
  ["React", "Node.js", "PostgreSQL", "TypeScript"],
];

export default function Services() {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rows = Array.from(ref.current?.querySelectorAll<HTMLElement>(".srv") ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const el = en.target as HTMLElement;
            const i = rows.indexOf(el);
            el.style.transitionDelay = `${i * 0.1}s`;
            el.classList.add("in");
            setTimeout(() => (el.style.transitionDelay = ""), 900 + i * 100);
            io.unobserve(el);
          }
        }),
      { threshold: 0.3 },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section className="services" id="servicios">
      <h2>{t.services.heading}</h2>
      <p className="lead">{t.services.lead}</p>
      <div
        className="srv-list"
        ref={ref}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        {t.services.items.map((s, i) => (
          <div className="srv" key={i}>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{s.title}</h3>
              <p className="desc">{s.desc}</p>
              <div className="tags">
                {TAGS[i].map((tag) => {
                  const tech = TECH[tag];
                  return (
                    <span
                      key={tag}
                      style={{
                        borderColor: `${tech.hex}59`,
                        background: `${tech.hex}14`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={techIcon(tech.slug, tech.hex)} alt="" width={14} height={14} />
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
            <span className="go">→</span>
          </div>
        ))}
      </div>
    </section>
  );
}
