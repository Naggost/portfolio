import type { CSSProperties } from "react";

const STEPS = [
  {
    title: "Charlamos",
    desc: "Me contás tu idea, objetivos y referencias. Entiendo tu negocio y qué necesitás.",
  },
  {
    title: "Diseño",
    desc: "Creo la propuesta visual: estética, estructura y experiencia. Iteramos hasta que te encante.",
  },
  {
    title: "Desarrollo",
    desc: "Construyo el sitio con código limpio, rápido y seguro. Te muestro avances en el camino.",
  },
  {
    title: "Entrega",
    desc: "Lanzamos. Te dejo todo funcionando, optimizado y listo para crecer.",
  },
];

export default function Process() {
  return (
    <section className="process" id="proceso">
      <h2>Cómo trabajo</h2>
      <p className="lead">
        Un proceso simple y transparente. Pasá el cursor sobre las tarjetas para desplegar los 4
        pasos.
      </p>
      <div className="dcards">
        {STEPS.map((s, i) => (
          <div className="dcard" key={i} style={{ "--i": i } as CSSProperties}>
            <span className="dcard-ico">{String(i + 1).padStart(2, "0")}</span>
            <div className="dcard-body">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
