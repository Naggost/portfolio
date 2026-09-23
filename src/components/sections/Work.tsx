"use client";

import { useEffect, useRef, useState } from "react";
import { TECH, techIcon } from "@/lib/tech";
import { useLanguage, type Dict } from "@/lib/i18n";

type ProjectMeta = {
  accent: string;
  url?: string;
  soon?: boolean;
  tech?: string[];
};

type ProjectText = Dict["work"]["projects"][number];

const PROJECTS_META: ProjectMeta[] = [
  {
    accent: "#FF8A1E",
    url: "https://vetainmobiliaria.com",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "Prisma", "PostgreSQL"],
  },
  {
    accent: "#5FA0DC",
    url: "https://airesdelibertadlp.com.ar",
    tech: ["WordPress", "CSS"],
  },
  {
    accent: "#C1121F",
    url: "https://mac-automotores.vercel.app/",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "Motion"],
  },
  {
    accent: "#C8A165",
    url: "https://kuper-web.vercel.app",
    tech: ["Next.js", "React", "TypeScript", "Tailwind", "Motion"],
  },
  {
    accent: "#2E8C85",
    url: "https://nina-del-norte.vercel.app",
    tech: ["HTML", "CSS", "JavaScript"],
  },
  {
    accent: "#FFB020",
    soon: true,
    tech: ["Next.js", "PostgreSQL", "TypeScript"],
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

function ProjectCard({
  meta,
  text,
  index,
  labels,
}: {
  meta: ProjectMeta;
  text: ProjectText;
  index: number;
  labels: Dict["work"];
}) {
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

  const hasUrl = !!meta.url && meta.url !== "#";
  const domain = hasUrl ? domainOf(meta.url!) : "tusitio.com";
  const hasTech = !!meta.tech && meta.tech.length > 0;

  return (
    <div
      ref={ref}
      className={`card ${hasUrl ? "is-link" : "card-soon"} ${inView ? "in" : ""}`}
      style={{ transitionDelay: done ? "0s" : `${index * 0.12}s` }}
    >
      <div className="card-media">
        <div className="laptop">
          <div className="laptop-screen">
            <div className="browser-bar">
              <span className="b-dots">
                <i />
                <i />
                <i />
              </span>
              <span className="b-url">{domain}</span>
            </div>
            {hasUrl ? (
              <div className="shot" style={{ backgroundImage: `url(${shotUrl(meta.url!)})` }} />
            ) : (
              <div
                className="shot empty"
                style={{
                  background: `radial-gradient(120% 120% at 75% 12%, ${meta.accent}45, transparent 58%), #15110d`,
                }}
              >
                <div className="gears">
                  <Gear size={78} className="gear gear-a" />
                  <Gear size={52} className="gear gear-b" />
                </div>
              </div>
            )}
            <div className="screen-chin">MacBook Pro</div>
          </div>
          <div className="laptop-base" />
        </div>
      </div>

      <div className="card-body">
        <span className="card-tag2">{text.tag}</span>
        <h3>{text.title}</h3>
        <p>{text.desc}</p>

        <div className="card-foot">
          {hasUrl ? (
            <a className="card-go" href={meta.url} target="_blank" rel="noreferrer">
              {labels.viewSite} <i>↗</i>
            </a>
          ) : (
            <span className="card-soon-label">{labels.comingSoon}</span>
          )}
          {hasTech && (
            <button
              type="button"
              className="tech-toggle"
              onClick={() => setTechOpen((v) => !v)}
              aria-expanded={techOpen}
            >
              {labels.tech} <i>{techOpen ? "−" : "+"}</i>
            </button>
          )}
        </div>

        {hasTech && (
          <div className={`card-tech ${techOpen ? "open" : ""}`}>
            {meta.tech!.map((t) => {
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
  const { t } = useLanguage();

  return (
    <section className="work" id="trabajos">
      <h2>{t.work.heading}</h2>
      <p className="lead">{t.work.lead}</p>
      <div className="cards">
        {PROJECTS_META.map((meta, i) => (
          <ProjectCard key={i} meta={meta} text={t.work.projects[i]} index={i} labels={t.work} />
        ))}
      </div>
    </section>
  );
}
