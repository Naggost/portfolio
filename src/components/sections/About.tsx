"use client";

import { useEffect, useRef } from "react";
import { TECH, techIcon } from "@/lib/tech";

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
          <span className="label">Sobre mí</span>
          <p className="statement">
            Soy <span className="hl">Nico</span>, Desarrollador de Software, obsesionado con el
            detalle y con que cada proyecto se sienta único.
          </p>
          <p>
            Recibido como Software Developer, no dejé de perfeccionarme — llevado por la curiosidad
            y las ganas de crear cosas que se vean y funcionen increíble. Combino diseño y código
            para construir webs rápidas, seguras y con personalidad.
          </p>
          <p>
            Cada proyecto lo encaro de cero: cuido desde la primera animación hasta la última línea
            de código. Si buscás a alguien que se tome tu web como propia, estás en el lugar
            correcto.
          </p>
        </div>
        <div className="reveal-up stack-col">
          <p className="stack-title">Tecnologías que uso</p>
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
