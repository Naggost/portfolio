"use client";

import { useEffect, useRef } from "react";

type Project = {
  tag: string;
  title: string;
  desc: string;
  accent: string;
  url?: string;
  soon?: boolean;
};

const PROJECTS: Project[] = [
  {
    tag: "Inmobiliaria",
    title: "Veta Inmobiliaria",
    desc: "Portal de propiedades con búsqueda y panel de administración.",
    accent: "#FF8A1E",
    url: "https://vetainmobiliaria.com",
  },
  {
    tag: "E-commerce",
    title: "En desarrollo",
    desc: "Tienda online con pagos, carrito y gestión de stock.",
    accent: "#FFC23D",
    soon: true,
  },
  {
    tag: "Web app",
    title: "En desarrollo",
    desc: "Aplicación a medida con autenticación y dashboard en tiempo real.",
    accent: "#FFB020",
    soon: true,
  },
];

const shotUrl = (url: string) =>
  `https://s.wp.com/mshots/v1/${encodeURIComponent(url)}?w=720&h=480`;

const domainOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "tusitio.com";
  }
};

function Gear({ size, className }: { size: number; className: string }) {
  const teeth = 10;
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} aria-hidden="true">
      <g fill="currentColor">
        {Array.from({ length: teeth }).map((_, i) => (
          <rect
            key={i}
            x={-5.5}
            y={-48}
            width={11}
            height={15}
            rx={2}
            transform={`rotate(${(360 / teeth) * i})`}
          />
        ))}
        <circle r={33} />
      </g>
      <circle r={13} fill="#15110d" />
    </svg>
  );
}

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = Array.from(ref.current?.querySelectorAll<HTMLElement>(".card") ?? []);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            const c = en.target as HTMLElement;
            const i = cards.indexOf(c);
            c.style.transitionDelay = `${i * 0.14}s`;
            c.classList.add("in");
            setTimeout(() => (c.style.transitionDelay = ""), 1100 + i * 140);
            io.unobserve(c);
          }
        }),
      { threshold: 0.2 },
    );
    cards.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return (
    <section className="work" id="trabajos">
      <h2>Trabajos seleccionados</h2>
      <p className="lead">
        Una muestra del tipo de proyectos que construyo. Cada uno pensado de cero: diseño,
        performance y código mantenible.
      </p>
      <div className="cards" ref={ref}>
        {PROJECTS.map((p, i) => {
          const hasUrl = !!p.url && p.url !== "#";
          const domain = hasUrl ? domainOf(p.url!) : "tusitio.com";

          const media = (
            <div className="card-media">
              <div className="browser-bar">
                <span className="b-dots">
                  <i />
                  <i />
                  <i />
                </span>
                <span className="b-url">{domain}</span>
              </div>
              {hasUrl ? (
                <div className="shot" style={{ backgroundImage: `url(${shotUrl(p.url!)})` }} />
              ) : (
                <div
                  className="shot empty"
                  style={{
                    background: `radial-gradient(120% 120% at 75% 12%, ${p.accent}45, transparent 58%), #15110d`,
                  }}
                >
                  <div className="gears">
                    <Gear size={92} className="gear gear-a" />
                    <Gear size={60} className="gear gear-b" />
                  </div>
                </div>
              )}
            </div>
          );

          const body = (
            <div className="card-body">
              <span className="card-tag2">{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              {hasUrl ? (
                <span className="card-go">
                  Ver sitio <i>↗</i>
                </span>
              ) : (
                <span className="card-soon-label">Próximamente</span>
              )}
            </div>
          );

          return hasUrl ? (
            <a className="card" key={i} href={p.url} target="_blank" rel="noreferrer">
              {media}
              {body}
            </a>
          ) : (
            <div className="card card-soon" key={i}>
              {media}
              {body}
            </div>
          );
        })}
      </div>
    </section>
  );
}
