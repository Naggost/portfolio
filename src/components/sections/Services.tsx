"use client";

import { useEffect, useRef } from "react";
import { TECH, techIcon } from "@/lib/tech";

const SERVICES = [
  {
    title: "Landing pages",
    desc: "Páginas de alto impacto pensadas para convertir: rápidas, claras y con un diseño que vende.",
    tags: ["Next.js", "Tailwind", "GSAP", "Motion"],
  },
  {
    title: "Webs institucionales",
    desc: "El sitio de tu empresa: profesional, optimizado para SEO y fácil de mantener.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    title: "E-commerce",
    desc: "Tiendas online completas con pagos, carrito y gestión de productos.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
  },
  {
    title: "Aplicaciones web",
    desc: "Software a medida: paneles, autenticación, datos en tiempo real y lógica compleja.",
    tags: ["React", "Node.js", "PostgreSQL", "TypeScript"],
  },
];

export default function Services() {
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
      <h2>Servicios</h2>
      <p className="lead">
        Lo que puedo construir para vos. Desde una landing que convierte hasta una aplicación web a
        medida — siempre con el mismo estándar de diseño y código.
      </p>
      <div
        className="srv-list"
        ref={ref}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        {SERVICES.map((s, i) => (
          <div className="srv" key={i}>
            <span className="num">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{s.title}</h3>
              <p className="desc">{s.desc}</p>
              <div className="tags">
                {s.tags.map((t) => {
                  const tech = TECH[t];
                  return (
                    <span
                      key={t}
                      style={{
                        borderColor: `${tech.hex}59`,
                        background: `${tech.hex}14`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={techIcon(tech.slug, tech.hex)} alt="" width={14} height={14} />
                      {t}
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
