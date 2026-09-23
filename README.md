<div align="center">

<img src="https://nico-portfolio-lovat.vercel.app/opengraph-image" alt="Portfolio · Nicolás Agostini" width="640" />

# Portfolio · Nicolás Agostini

Mi portfolio como desarrollador de software: reúne los proyectos que construí y es el lugar
desde donde se puede ver cómo trabajo y contactarme para una próxima web.

[**🌐 Ver en vivo**](https://nico-portfolio-lovat.vercel.app) ·
[**LinkedIn**](https://www.linkedin.com/in/nicol%C3%A1s-agostini-562335247/) ·
[**GitHub**](https://github.com/Naggost)

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0B1120?logo=tailwindcss&logoColor=38BDF8)
![Three.js](https://img.shields.io/badge/Three.js-000?logo=threedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=white)

</div>

---

## ✨ Sobre el proyecto

Un sitio pensado de cero como carta de presentación: estética premium y minimal, animaciones
3D en tiempo real y, sobre todo, rápido y bien hecho por dentro. Doble función: mostrar
trabajo y captar oportunidades/leads a través del formulario de contacto.

## 🚀 Características

- **Fondo 3D animado** — un sol renderizado con shaders GLSL (React Three Fiber) sobre un fondo
  cósmico con estrellas fugaces, con **calidad adaptativa** según el dispositivo.
- **Cards de proyectos** con preview dentro de un mockup de notebook y un borde naranja
  animado recorriendo el contorno.
- **Cursor personalizado** (punto + anillo) en desktop.
- **Sección de contacto con captación de leads** — formulario validado y envío por email.
- **Diseño responsive** y micro-interacciones cuidadas.
- **SEO + redes** — metadata Open Graph / Twitter con imagen de preview generada.

## 🛠️ Stack técnico

| Capa | Tecnologías |
|------|-------------|
| **Framework / UI** | Next.js (App Router) · React · TypeScript |
| **Estilos** | Tailwind CSS v4 |
| **3D / Animación** | Three.js · React Three Fiber · drei · postprocessing · GSAP · Motion · Lenis |
| **Formularios / Datos** | Server Actions · Zod (validación) · Resend (email) |
| **Seguridad** | CSP, HSTS y headers estrictos · honeypot + rate limiting anti-spam |
| **Testing / Tooling** | Vitest · ESLint |
| **Infra** | Vercel (hosting + CI/CD) |

## 📂 Proyectos incluidos

- **Veta Inmobiliaria** — portal de propiedades con búsqueda y panel de administración.
- **Aires de Libertad** — rediseño y optimización (UX/UI, SEO, responsive) de un medio digital.
- **(En desarrollo)** — aplicación a medida con autenticación y dashboard.

## 🔒 Seguridad

- Headers estrictos (`Content-Security-Policy`, `HSTS`, `X-Frame-Options`, etc.).
- Protección anti-spam en el formulario: **honeypot** + **rate limiting** por IP.
- Validación de datos con **Zod** y escape de HTML en el contenido de los mensajes.
- Las claves viven solo en variables de entorno (`.env.local`, fuera del control de versiones).

## 💻 Correr en local

```bash
npm install
npm run dev      # http://localhost:3000
```

Para el email de contacto, crear un `.env.local` con:

```bash
RESEND_API_KEY=tu_api_key
```

Scripts útiles: `npm run build` (build de producción) · `npm run lint` (ESLint).

---

<div align="center">

Hecho por **Nicolás Agostini** — Desarrollador de software.
¿Necesitás una web profesional? [Escribime.](https://nico-portfolio-lovat.vercel.app/#contacto)

</div>
