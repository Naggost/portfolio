"use client";

import { useEffect, useRef, useState } from "react";
import { TECH, techIcon } from "@/lib/tech";

type Project = {
  tag: string;
  title: string;
  desc: string;
  accent: string;
  url?: string;
  soon?: boolean;
  tech?: string[];
};

const PROJECTS: Project[] = [
  {
    tag: "Inmobiliaria",
    title: "Veta Inmobiliaria",
    desc: "Portal de propiedades con búsqueda y panel de administración.",
    accent: "#FF8A1E",
    url: "https://vetainmobiliaria.com",
    // tech: [...]  // TODO: confirmar el stack real de Veta con Nico
  },
  {
    tag: "Periodístico",
    title: "Aires de Libertad",
    desc: "Optimización y rediseño de un blog político en WordPress: UX/UI, SEO (Open Graph) y diseño responsive.",
    accent: "#5FA0DC",
    url: "https://airesdelibertadlp.com.ar",
    tech: ["WordPress", "CSS"],
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

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [done, setDone] = useState(false);
  const [techOpen, setTechOpen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([en]) => {
        if (en.isIntersecting) {
          setInView(true);
          setTimeout(() => setDone(true), 1100 + index * 120);
          io.unobserve(el);
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index]);

  const hasUrl = !!p.url && p.url !== "#";
  const domain = hasUrl ? domainOf(p.url!) : "tusitio.com";
  const hasTech = !!p.tech && p.tech.length > 0;

  return (
    <div
      ref={ref}
      className={`card ${hasUrl ? "is-link" : "card-soon"} ${inView ? "in" : ""}`}
      style={{ transitionDelay: done ? "0s" : `${index * 0.12}s` }}
    >
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

      <div className="card-body">
        <span className="card-tag2">{p.tag}</span>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>

        <div className="card-foot">
          {hasUrl ? (
            <a className="card-go" href={p.url} target="_blank" rel="noreferrer">
              Ver sitio <i>↗</i>
            </a>
          ) : (
            <span className="card-soon-label">Próximamente</span>
          )}
          {hasTech && (
            <button
              type="button"
              className="tech-toggle"
              onClick={() => setTechOpen((v) => !v)}
              aria-expanded={techOpen}
            >
              Tecnologías <i>{techOpen ? "−" : "+"}</i>
            </button>
          )}
        </div>

        {hasTech && (
          <div className={`card-tech ${techOpen ? "open" : ""}`}>
            {p.tech!.map((t) => {
              const tech = TECH[t];
              return (
                <span
                  className="tech-chip"
                  key={t}
                  style={{ borderColor: `${tech.hex}59`, background: `${tech.hex}14` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={techIcon(tech.slug, tech.hex)} alt="" width={14} height={14} />
                  {t}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Work() {
  return (
    <section className="work" id="trabajos">
      <h2>Trabajos seleccionados</h2>
      <p className="lead">
        Una muestra del tipo de proyectos que construyo. Cada uno pensado de cero: diseño,
        performance y código mantenible.
      </p>
      <div className="cards">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={i} p={p} index={i} />
        ))}
      </div>
    </section>
  );
}
