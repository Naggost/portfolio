"use client";

import { useLanguage } from "@/lib/i18n";

const SOCIAL = [
  { label: "WhatsApp", href: "https://wa.me/5492302567945" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/nicolás-agostini" },
  { label: "GitHub", href: "https://github.com/naggost" },
  { label: "Instagram", href: "https://www.instagram.com/nicoagostini_" },
];

export default function Footer() {
  const { t } = useLanguage();
  const sections = [
    { label: t.nav.trabajos, href: "#trabajos" },
    { label: t.nav.servicios, href: "#servicios" },
    { label: t.nav.proceso, href: "#proceso" },
    { label: t.nav.sobreMi, href: "#sobre-mi" },
    { label: t.nav.contacto, href: "#contacto" },
  ];

  return (
    <footer className="footer">
      <div className="footer-cta">
        <h2>{t.footer.ctaTitle}</h2>
        <a className="btn btn-primary" href="#contacto">
          <span className="label">{t.footer.ctaBtn}</span>
          <span className="arrow">→</span>
        </a>
      </div>

      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo">
            Nico<span className="dot-gold">.</span>
          </span>
          <p>{t.footer.brandDesc}</p>
        </div>

        <nav className="footer-nav">
          <span className="fn-title">{t.footer.sectionsTitle}</span>
          {sections.map((s) => (
            <a key={s.href} href={s.href}>
              {s.label}
            </a>
          ))}
        </nav>

        <nav className="footer-nav">
          <span className="fn-title">{t.footer.connectTitle}</span>
          {SOCIAL.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-bottom">
        <span>{t.footer.bottom(new Date().getFullYear())}</span>
      </div>
    </footer>
  );
}
