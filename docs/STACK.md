# Stack & Estándar de Trabajo — "Marca Registrada"

> Documento maestro del portfolio y de todos los proyectos a futuro.
> Objetivo: un stack fijo, confiable, seguro y profesional (nivel senior),
> con variaciones mínimas para tener una identidad técnica reconocible.
> Última actualización: 2026-06-23.

---

## 1. Filosofía

- **Un stack base, pocas variantes.** Reusar el mismo esqueleto en cada proyecto
  para ganar velocidad, calidad y previsibilidad. Cambiar solo lo que el proyecto exige.
- **Diseño primero, pero medible.** Estética y animaciones 3D de alto nivel, sin
  sacrificar Core Web Vitals, accesibilidad ni SEO. Lo "increíble" tiene que cargar rápido.
- **Type-safe de punta a punta.** TypeScript + validación de esquemas en cada borde.
- **Todo testeado y revisado** antes de mergear/publicar.

---

## 2. Stack base (el "sello")

### Frontend
| Capa | Elección | Por qué |
|------|----------|---------|
| Framework | **Next.js 15+ (App Router, React Server Components)** | SEO, velocidad, edge, estándar de la industria 2026 |
| Lenguaje | **TypeScript** (strict) | Seguridad de tipos de punta a punta |
| Estilos | **Tailwind CSS v4** | Velocidad, consistencia, design tokens |
| Componentes | **shadcn/ui** (Radix por debajo) | Accesible, sin lock-in, copy-paste, customizable |
| Animación UI | **Motion** (ex Framer Motion) | Estándar para transiciones/gestos en React/Next |
| Animación narrativa / scroll | **GSAP** (+ ScrollTrigger) | Choreography de hero, scroll storytelling |
| 3D / WebGL | **React Three Fiber + drei** (sobre Three.js) | 3D declarativo, fondos y escenas 3D |
| Vectores autorados | **Lottie / Rive** | Animaciones hechas por diseñador, livianas |

### Backend
| Capa | Elección | Por qué |
|------|----------|---------|
| API | **Next.js Server Actions + Route Handlers** | Menos superficie, type-safe, colocado |
| Validación | **Zod** | Valida en cada borde (forms, API, env) |
| ORM | **Drizzle ORM** (alternativa: Prisma) | Ligero, type-safe, SQL-first |
| Auth | **Auth.js (NextAuth v5)** o **Clerk** (si se quiere UI lista) | Estándar, sesiones/cookies seguras |
| Emails | **Resend** + React Email | DX excelente, barato |
| Pagos (si aplica) | **Stripe** | Estándar |

### Calidad
| Capa | Elección |
|------|----------|
| Unit/integración | **Vitest** + React Testing Library |
| E2E | **Playwright** (auth, formularios, checkout, flujos críticos) |
| Lint/format | **ESLint + Prettier** (o **Biome**) |
| Type-check en CI | `tsc --noEmit` |
| Pre-commit | **Husky + lint-staged** |

> Estrategia de tests: unit para lógica de negocio y funciones puras, integración
> para acceso a datos/API, y **20–30 tests E2E** solo para los caminos donde un fallo
> cuesta dinero. Feedback rápido sin suites de 15 minutos.

---

## 3. Bases de datos (según escala)

| Escenario | Recomendación | Notas |
|-----------|---------------|-------|
| **Default / arranque** | **Neon (Postgres serverless)** | Scale-to-zero, branching instantáneo, free tier generoso, driver HTTP para edge. Mejor punto de partida 2026. |
| **Full backend incluido** (auth, storage, realtime) | **Supabase (Postgres)** | Si querés todo-en-uno: DB + auth + storage + realtime + edge functions |
| **Tráfico muy alto / escala crítica** | **PlanetScale** (Vitess; MySQL o Postgres) | ~17k QPS en benchmarks, deploy requests de schema sin downtime. Lo usan Cursor, Intercom, Block |

**Regla práctica:**
- Proyecto chico/mediano → **Neon** (o Supabase si querés auth+storage gratis).
- Cliente con mucho tráfico o carga grande de datos → **PlanetScale**.

---

## 4. Hosting (barato pero eficaz)

| Opción | Costo | Cuándo usarla |
|--------|-------|---------------|
| **Vercel** (Hobby gratis / Pro $20) | $0 personal, $20/mes comercial | Mejor DX para Next.js, cero config. Default para demos y clientes que pagan |
| **Cloudflare Pages** | Gratis (bandwidth ilimitado) | Si el ancho de banda es la preocupación; sitios estáticos/edge |
| **Netlify** | Gratis (100GB) | Alternativa a Vercel |
| **VPS (Hetzner / Contabo) + Coolify** | **$4–6/mes** | Mejor relación costo/escala. Coolify = experiencia tipo Vercel (git push deploy, SSL, preview URLs, DBs 1-click) self-hosted. Pagás 10–20% de lo que costaría Vercel |

**Regla práctica:**
- Portfolio y demos → **Vercel Hobby** (gratis).
- Cliente que paga y quiere cero fricción → **Vercel Pro**.
- Varios proyectos / ahorrar a escala → **Hetzner + Coolify** ($5/mes hostea una docena de apps).

---

## 5. Skills y herramientas de Claude Code para este flujo

Estas son las capacidades de Claude Code que conviene usar en cada etapa:

| Etapa | Skill / MCP | Para qué |
|-------|-------------|----------|
| Componentes UI | **MCP `shadcn`** | Listar/instalar bloques y componentes shadcn directo |
| Docs de librerías | **MCP `context7`** | Docs actualizadas de Next, Tailwind, Drizzle, R3F, etc. |
| Probar en navegador | **MCP `playwright`** | Abrir la app, screenshots, validar flujos reales |
| Razonamiento complejo | **MCP `sequential-thinking`** | Arquitectura, decisiones difíciles |
| Verificar cambios | Skill **`/verify`** y **`/run`** | Correr la app y confirmar que un cambio funciona |
| Revisión de código | Skill **`/code-review`** | Bugs + simplificación sobre el diff |
| Revisión de seguridad | Skill **`/security-review`** | Auditoría de seguridad de los cambios |
| Limpieza | Skill **`/simplify`** | Reuso, eficiencia, claridad |
| Arranque de repo | Skill **`/init`** | Generar CLAUDE.md del proyecto |

**Flujo de trabajo acordado:**
1. **Claude Design** genera la estética/frontend de la página.
2. Me pasás toda esa info (diseño, referencias, assets).
3. Yo escribo el código sobre el stack base de este documento.
4. Tests (Vitest/Playwright) → `/code-review` → `/security-review` → deploy.

---

## 6. Checklist de calidad por proyecto

- [ ] TypeScript strict, sin `any` sueltos
- [ ] Validación Zod en forms, API y variables de entorno
- [ ] Core Web Vitals en verde (LCP, CLS, INP) — `next/image`, lazy 3D
- [ ] Accesibilidad (focus, contraste, ARIA, navegación por teclado)
- [ ] SEO (metadata, OpenGraph, sitemap, URLs limpias)
- [ ] Animaciones 3D con fallback y `prefers-reduced-motion`
- [ ] Tests E2E de los flujos críticos
- [ ] `/security-review` pasado (auth, cookies, headers, secrets)
- [ ] Variables sensibles fuera del repo (`.env` + secrets del host)
- [ ] Responsive real (mobile-first)

---

## 7. Estructura de carpetas estándar (propuesta)

```
proyecto/
├── docs/                 # Documentación (este STACK.md, decisiones, etc.)
├── src/
│   ├── app/              # App Router (rutas, layouts, server components)
│   ├── components/       # UI (shadcn + propios)
│   │   ├── ui/           # shadcn
│   │   └── 3d/           # escenas R3F, fondos WebGL
│   ├── lib/              # utils, db (drizzle), auth, validaciones zod
│   ├── server/           # server actions, lógica de negocio
│   └── styles/           # tailwind, tokens
├── tests/
│   ├── unit/             # vitest
│   └── e2e/              # playwright
├── .env.example
└── CLAUDE.md             # instrucciones del repo para Claude Code
```
