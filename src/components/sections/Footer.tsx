const SECTIONS = [
  { label: "Trabajos", href: "#trabajos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Proceso", href: "#proceso" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Contacto", href: "#contacto" },
];

const SOCIAL = [
  { label: "WhatsApp", href: "https://wa.me/5492302567945" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nicolás-agostini" },
  { label: "GitHub", href: "https://github.com/naggost" },
  { label: "Instagram", href: "https://www.instagram.com/nicoagostini_" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-cta">
        <h2>¿Empezamos tu proyecto?</h2>
        <a className="btn btn-primary" href="#contacto">
          <span className="label">Trabajemos juntos</span>
          <span className="arrow">→</span>
        </a>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo">
            Nico<span className="dot-gold">.</span>
          </span>
          <p>Desarrollo web profesional. Diseño y código a medida, con detalles que sorprenden.</p>
        </div>

        <nav className="footer-nav">
          <span className="fn-title">Secciones</span>
          {SECTIONS.map((s) => (
            <a key={s.href} href={s.href}>
              {s.label}
            </a>
          ))}
        </nav>

        <nav className="footer-nav">
          <span className="fn-title">Conectemos</span>
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Nico — Desarrollo web profesional.</span>
      </div>
    </footer>
  );
}
