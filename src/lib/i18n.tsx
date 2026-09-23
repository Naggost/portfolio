"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "es" | "en";

export type Dict = {
  nav: { trabajos: string; servicios: string; proceso: string; sobreMi: string; contacto: string };
  hero: {
    line1: string;
    words: string[];
    line3: string;
    sub: string;
    ctaProjects: string;
    ctaContact: string;
  };
  work: {
    heading: string;
    lead: string;
    viewSite: string;
    tech: string;
    comingSoon: string;
    projects: { tag: string; title: string; desc: string }[];
  };
  services: {
    heading: string;
    lead: string;
    items: { title: string; desc: string }[];
  };
  process: {
    heading: string;
    lead: string;
    steps: { title: string; desc: string }[];
  };
  about: { label: string; statement: string; p2: string; p3: string; stackTitle: string };
  contact: {
    kicker: string;
    h2a: string;
    h2b: string;
    lead: string;
    assure: string[];
    stepTitles: string[];
    stepCount: (n: number) => string;
    nombre: string;
    nombrePh: string;
    email: string;
    emailPh: string;
    empresa: string;
    empresaPh: string;
    preferContact: string;
    contacto: string[];
    needQuestion: string;
    tipos: string[];
    presupuestoLabel: string;
    presupuesto: string[];
    plazoLabel: string;
    plazo: string[];
    mensajeLabel: string;
    mensajePh: string;
    consent: string;
    back: string;
    next: string;
    send: string;
    sending: string;
    errName: string;
    errTipo: string;
    errConsent: string;
    errSend: string;
    thanks: (name: string) => string;
    successBody: (via: string) => string;
  };
  footer: {
    ctaTitle: string;
    ctaBtn: string;
    brandDesc: string;
    sectionsTitle: string;
    connectTitle: string;
    bottom: (year: number) => string;
  };
};

const dict: Record<Lang, Dict> = {
  es: {
    nav: {
      trabajos: "Trabajos",
      servicios: "Servicios",
      proceso: "Proceso",
      sobreMi: "Sobre mí",
      contacto: "Contacto",
    },
    hero: {
      line1: "Construyo webs",
      words: ["a medida.", "que convierten.", "memorables.", "rápidas y seguras."],
      line3: "by Nico.",
      sub: "Diseño y desarrollo de webs y sistemas premium — rápidas, seguras y con detalles únicos que sorprenden a cualquiera.",
      ctaProjects: "Ver proyectos",
      ctaContact: "Trabajemos juntos",
    },
    work: {
      heading: "Mis trabajos",
      lead: "Una muestra del tipo de proyectos que construyo. Cada uno pensado de cero: diseño, performance y código mantenible.",
      viewSite: "Ver sitio",
      tech: "Tecnologías",
      comingSoon: "Próximamente",
      projects: [
        {
          tag: "Inmobiliaria",
          title: "Veta Inmobiliaria",
          desc: "Portal de propiedades con búsqueda y panel de administración.",
        },
        {
          tag: "Periodístico",
          title: "Aires de Libertad",
          desc: "Optimización y rediseño de un blog político en WordPress: UX/UI, SEO (Open Graph) y diseño responsive.",
        },
        {
          tag: "Concesionaria",
          title: "MAC Automotores",
          desc: "Plataforma web para una concesionaria multimarca: catálogo del stock real, simulador de cuotas y contacto directo por WhatsApp en cada unidad.",
        },
        {
          tag: "Medicina estética",
          title: "KUPER Medicina Estética",
          desc: "Landing cinematográfica para un centro de medicina estética: hero con video controlado por el scroll, tratamientos, reseñas y pedido de turnos por WhatsApp.",
        },
        {
          tag: "Web app",
          title: "En desarrollo",
          desc: "Aplicación a medida con autenticación y dashboard en tiempo real.",
        },
      ],
    },
    services: {
      heading: "Servicios",
      lead: "Lo que puedo construir para vos. Desde una landing que convierte hasta una aplicación web a medida — siempre con el mismo estándar de diseño y código.",
      items: [
        {
          title: "Landing pages",
          desc: "Páginas de alto impacto pensadas para convertir: rápidas, claras y con un diseño que vende.",
        },
        {
          title: "Webs institucionales",
          desc: "El sitio de tu empresa: profesional, optimizado para SEO y fácil de mantener.",
        },
        {
          title: "E-commerce",
          desc: "Tiendas online completas con pagos, carrito y gestión de productos.",
        },
        {
          title: "Aplicaciones web",
          desc: "Software a medida: paneles, autenticación, datos en tiempo real y lógica compleja.",
        },
      ],
    },
    process: {
      heading: "Cómo trabajo",
      lead: "Un proceso simple y transparente. Pasá el cursor sobre las tarjetas para desplegar los 4 pasos.",
      steps: [
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
      ],
    },
    about: {
      label: "Sobre mí",
      statement: "Soy Nico, Desarrollador de Software, obsesionado con el detalle y con que cada proyecto se sienta único.",
      p2: "Recibido como Software Developer, no dejé de perfeccionarme — llevado por la curiosidad y las ganas de crear cosas que se vean y funcionen increíble. Combino diseño y código para construir webs rápidas, seguras y con personalidad.",
      p3: "Cada proyecto lo encaro de cero: cuido desde la primera animación hasta la última línea de código. Si buscás a alguien que se tome tu web como propia, estás en el lugar correcto.",
      stackTitle: "Tecnologías que uso",
    },
    contact: {
      kicker: "Contacto",
      h2a: "¿Tenés un proyecto",
      h2b: "en mente?",
      lead: "Contame qué necesitás y te respondo en menos de 24-48 hs. Sin compromiso — solo una charla para entender tu proyecto.",
      assure: ["Respondo en 24-48 hs", "Sin compromiso ni costo inicial", "Presupuesto claro desde el principio"],
      stepTitles: ["Sobre vos", "Sobre tu proyecto", "Contame un poco más"],
      stepCount: (n: number) => `Paso ${n} de 3`,
      nombre: "Nombre *",
      nombrePh: "Tu nombre",
      email: "Email *",
      emailPh: "tu@email.com",
      empresa: "Empresa / marca (opcional)",
      empresaPh: "Tu negocio",
      preferContact: "¿Cómo preferís que te contacte?",
      contacto: ["Email", "WhatsApp"],
      needQuestion: "¿Qué necesitás? *",
      tipos: ["Landing", "Web institucional", "E-commerce", "Web app", "Otro"],
      presupuestoLabel: "Presupuesto estimado",
      presupuesto: ["A definir", "Reducido", "Estándar", "Avanzado"],
      plazoLabel: "¿Para cuándo?",
      plazo: ["Urgente", "1 mes", "2-3 meses", "Flexible"],
      mensajeLabel: "Tu mensaje (opcional)",
      mensajePh: "Contame tu idea, objetivos, referencias que te gusten…",
      consent: "Acepto que Nico use mis datos para contactarme sobre este proyecto.",
      back: "← Atrás",
      next: "Siguiente",
      send: "Enviar solicitud",
      sending: "Enviando…",
      errName: "Completá tu nombre y un email válido.",
      errTipo: "Elegí el tipo de proyecto.",
      errConsent: "Necesito tu consentimiento para poder contactarte.",
      errSend: "No se pudo enviar. Probá de nuevo.",
      thanks: (name: string) => `¡Gracias, ${name}!`,
      successBody: (via: string) => `Recibí tu mensaje y te voy a contactar por ${via} muy pronto.`,
    },
    footer: {
      ctaTitle: "¿Empezamos tu proyecto?",
      ctaBtn: "Trabajemos juntos",
      brandDesc: "Desarrollo web profesional. Diseño y código a medida, con detalles que sorprenden.",
      sectionsTitle: "Secciones",
      connectTitle: "Conectemos",
      bottom: (year: number) => `© ${year} Nico — Desarrollo web profesional.`,
    },
  },
  en: {
    nav: {
      trabajos: "Work",
      servicios: "Services",
      proceso: "Process",
      sobreMi: "About",
      contacto: "Contact",
    },
    hero: {
      line1: "I build websites",
      words: ["that fit you.", "that convert.", "you'll remember.", "fast and secure."],
      line3: "by Nico.",
      sub: "Premium web and systems design and development — fast, secure, and full of unique details that surprise anyone.",
      ctaProjects: "View projects",
      ctaContact: "Let's work together",
    },
    work: {
      heading: "My work",
      lead: "A sample of the kind of projects I build. Each one crafted from scratch: design, performance and maintainable code.",
      viewSite: "View site",
      tech: "Tech stack",
      comingSoon: "Coming soon",
      projects: [
        {
          tag: "Real estate",
          title: "Veta Inmobiliaria",
          desc: "Property listing portal with search and an admin dashboard.",
        },
        {
          tag: "Media",
          title: "Aires de Libertad",
          desc: "Optimization and redesign of a political news blog on WordPress: UX/UI, SEO (Open Graph) and responsive design.",
        },
        {
          tag: "Dealership",
          title: "MAC Automotores",
          desc: "Web platform for a multi-brand car dealership: real-inventory catalog, financing simulator, and direct WhatsApp contact on every listing.",
        },
        {
          tag: "Aesthetic medicine",
          title: "KUPER Medicina Estética",
          desc: "Cinematic landing page for an aesthetic medicine clinic: scroll-controlled video hero, treatments, reviews and appointment requests through WhatsApp.",
        },
        {
          tag: "Web app",
          title: "In progress",
          desc: "Custom application with authentication and a real-time dashboard.",
        },
      ],
    },
    services: {
      heading: "Services",
      lead: "What I can build for you. From a landing page that converts to a fully custom web app — always with the same standard of design and code quality.",
      items: [
        {
          title: "Landing pages",
          desc: "High-impact pages built to convert: fast, clear and designed to sell.",
        },
        {
          title: "Business websites",
          desc: "Your company's website: professional, SEO-optimized and easy to maintain.",
        },
        {
          title: "E-commerce",
          desc: "Full online stores with payments, cart and product management.",
        },
        {
          title: "Web applications",
          desc: "Custom software: dashboards, authentication, real-time data and complex logic.",
        },
      ],
    },
    process: {
      heading: "How I work",
      lead: "A simple, transparent process. Hover over the cards to reveal the 4 steps.",
      steps: [
        {
          title: "We talk",
          desc: "You tell me your idea, goals and references. I understand your business and what you need.",
        },
        {
          title: "Design",
          desc: "I create the visual proposal: aesthetics, structure and experience. We iterate until you love it.",
        },
        {
          title: "Development",
          desc: "I build the site with clean, fast and secure code, showing you progress along the way.",
        },
        {
          title: "Delivery",
          desc: "We launch. I hand off everything working, optimized and ready to grow.",
        },
      ],
    },
    about: {
      label: "About me",
      statement: "I'm Nico, a Software Developer obsessed with detail and making every project feel unique.",
      p2: "Graduated as a Software Developer, I never stopped improving — driven by curiosity and the will to build things that look and work amazingly. I combine design and code to build fast, secure websites with personality.",
      p3: "I approach every project from scratch: I care about everything from the first animation to the last line of code. If you're looking for someone who treats your website as their own, you're in the right place.",
      stackTitle: "Technologies I use",
    },
    contact: {
      kicker: "Contact",
      h2a: "Got a project",
      h2b: "in mind?",
      lead: "Tell me what you need and I'll reply within 24-48 hours. No commitment — just a chat to understand your project.",
      assure: ["I reply within 24-48 hs", "No commitment or upfront cost", "Clear budget from the start"],
      stepTitles: ["About you", "About your project", "Tell me a bit more"],
      stepCount: (n: number) => `Step ${n} of 3`,
      nombre: "Name *",
      nombrePh: "Your name",
      email: "Email *",
      emailPh: "you@email.com",
      empresa: "Company / brand (optional)",
      empresaPh: "Your business",
      preferContact: "How would you like to be contacted?",
      contacto: ["Email", "WhatsApp"],
      needQuestion: "What do you need? *",
      tipos: ["Landing page", "Business website", "E-commerce", "Web app", "Other"],
      presupuestoLabel: "Estimated budget",
      presupuesto: ["To be defined", "Small", "Standard", "Advanced"],
      plazoLabel: "By when?",
      plazo: ["Urgent", "1 month", "2-3 months", "Flexible"],
      mensajeLabel: "Your message (optional)",
      mensajePh: "Tell me your idea, goals, references you like…",
      consent: "I agree that Nico may use my data to contact me about this project.",
      back: "← Back",
      next: "Next",
      send: "Send request",
      sending: "Sending…",
      errName: "Please fill in your name and a valid email.",
      errTipo: "Choose the type of project.",
      errConsent: "I need your consent to be able to contact you.",
      errSend: "Couldn't send. Please try again.",
      thanks: (name: string) => `Thanks, ${name}!`,
      successBody: (via: string) => `I got your message and I'll reach out via ${via} very soon.`,
    },
    footer: {
      ctaTitle: "Shall we start your project?",
      ctaBtn: "Let's work together",
      brandDesc: "Professional web development. Custom design and code, with details that surprise.",
      sectionsTitle: "Sections",
      connectTitle: "Let's connect",
      bottom: (year: number) => `© ${year} Nico — Professional web development.`,
    },
  },
};

type Ctx = { lang: Lang; t: Dict; toggle: () => void };

const LanguageContext = createContext<Ctx>({ lang: "es", t: dict.es, toggle: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("lang");
    if (stored === "en" || stored === "es") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () =>
    setLang((l) => {
      const next: Lang = l === "es" ? "en" : "es";
      localStorage.setItem("lang", next);
      return next;
    });

  return (
    <LanguageContext.Provider value={{ lang, t: dict[lang], toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
