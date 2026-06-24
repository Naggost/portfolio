# Resumen Técnico del Portfolio

> Todo lo que se construyó, qué hace cada tecnología y cada mecanismo de
> seguridad. Pensado para entender el "cómo" y el "por qué" de cada decisión.
> Última actualización: 2026-06-24.

---

## 1. Las tecnologías y qué hace cada una

### Núcleo
| Tecnología | Qué es / qué hace |
|------------|-------------------|
| **Next.js 16** (App Router) | El framework de React para producción. Maneja el ruteo, el renderizado (estático + server), la optimización del build y las **Server Actions** (funciones que corren en el servidor, ej. el envío del formulario). |
| **React 19** | La librería de UI. Todo lo visual son componentes React. |
| **TypeScript** | JavaScript con tipos. Detecta errores antes de ejecutar; el `npm run build` falla si hay un tipo mal. Más seguro y mantenible. |
| **Tailwind CSS v4** | Sistema de estilos por utilidades. Acá lo usamos junto a CSS propio (`globals.css`) para los efectos custom. |

### Diseño y animación
| Tecnología | Qué hace |
|------------|----------|
| **React Three Fiber (R3F)** | React para **Three.js / WebGL**. Es lo que dibuja el **sol 3D** con la GPU. |
| **Three.js** | Motor 3D por debajo de R3F. |
| **drei** | Helpers para R3F. Usamos **`PerformanceMonitor`** para la calidad adaptativa (baja calidad si la máquina sufre). |
| **postprocessing (`@react-three/postprocessing`)** | Efectos de post-render. Usamos **Bloom** (el brillo/halo del sol). |
| **Shader GLSL custom** | El sol no es una imagen: es un **shader** (código que corre en la GPU). Un *vertex shader* deforma la esfera con ruido (fbm/simplex) para el efecto de plasma; un *fragment shader* le pone el degradado de color y la corona. |
| **Motion** (ex Framer Motion) | Animaciones de UI declarativas. Lo usamos en las transiciones entre pasos del formulario. |
| **GSAP / Lenis** | Instaladas para animaciones avanzadas y scroll suave (disponibles para futuro). |
| **Web Animations API** (nativa) | El **meteorito + explosión** y el back-to-top usan la API nativa del navegador (liviana, sin librerías). |

### Tipografía e íconos
| Recurso | Qué hace |
|---------|----------|
| **Clash Display + Satoshi** (Fontshare) | Las tipografías. Display para títulos/botones, Satoshi para el cuerpo. |
| **simple-icons** (CDN) | Los logos de marca de las tecnologías (chips de colores) y el de WhatsApp. |
| **mShots** (WordPress) | Genera el **screenshot automático** de los sitios (ej. Veta) a partir de la URL. |

### Backend del formulario
| Tecnología | Qué hace |
|------------|----------|
| **Server Action** (`src/app/actions/contact.ts`) | Función que corre **solo en el servidor** cuando se envía el form. El navegador nunca ve la API key. |
| **Zod** | Valida los datos del formulario (email válido, campos requeridos, tamaños máximos) tanto en cliente como en servidor. |
| **Resend** | Servicio que envía el email. Cuando alguien completa el form, te llega un mail a tu Gmail con los datos del lead. |

### Testing e infraestructura
| Tecnología | Qué hace |
|------------|----------|
| **Vitest** | Corre los **tests automatizados** (validación + rate limit). `npm test`. |
| **Vercel** | El hosting. Hace el build y sirve el sitio con HTTPS y CDN global. |
| **Git** | Control de versiones (historial de cambios). |

---

## 2. Cómo está organizado el proyecto

```
src/
├── app/
│   ├── layout.tsx        → fuentes + metadata (head global)
│   ├── page.tsx          → ensambla todas las secciones
│   ├── globals.css       → tema (colores) + todos los estilos
│   └── actions/contact.ts→ Server Action del formulario (Resend)
├── components/
│   ├── Preloader.tsx     → pantalla de bienvenida
│   ├── ScrollTop.tsx     → flecha "volver arriba"
│   ├── three/            → el sol 3D (SunCanvas, Background, ErrorBoundary)
│   └── sections/         → Hero, Work, Services, Process, About, Contact, Footer
└── lib/
    ├── tech.ts           → registro de tecnologías (logos/colores)
    ├── meteor.ts         → efecto meteorito + explosión
    ├── contact-schema.ts → validación Zod (testeable)
    └── rate-limit.ts     → limitador de envíos
```

---

## 3. Los mecanismos de seguridad y qué hace cada uno

### a) Honeypot (trampa para bots)
Hay un **campo de formulario oculto** llamado `website`. Un humano nunca lo ve ni lo completa (está fuera de pantalla). Pero **los bots completan todos los campos** automáticamente. Si ese campo llega con contenido → es un bot → el envío se **rechaza**. Silencioso y sin molestar al usuario real.

### b) Rate limiting (límite de envíos)
Se cuentan los envíos **por dirección IP**: máximo **5 cada 10 minutos**. Si alguien (o un bot) intenta spamear el formulario, a partir del 6º intento recibe *"Demasiados envíos, esperá unos minutos"* y **no se envía nada**. Protege tu cuenta de Resend de abuso.

### c) Validación con Zod
Cada dato se valida en el servidor antes de procesarse: el email tiene que ser válido, el nombre y el tipo de proyecto no pueden estar vacíos, y todo tiene **tamaño máximo** (ej. nombre ≤120 caracteres, mensaje ≤2000). Si algo no cumple → *"Revisá los datos"* y no se envía.

### d) Sanitización (anti-inyección)
Antes de meter los datos del lead en el HTML del email, se **escapan los caracteres peligrosos** (`< > & "`). Así, si alguien manda código malicioso en un campo, se muestra como texto inofensivo, no se ejecuta.

### e) Security headers (en `next.config.ts`)
Son instrucciones que el servidor le manda al navegador:
- **CSP** (Content-Security-Policy): lista blanca de dónde se pueden cargar scripts/estilos/imágenes. Frena ataques de inyección de scripts (XSS).
- **HSTS**: obliga a usar siempre HTTPS (no se puede degradar a HTTP inseguro).
- **X-Frame-Options: DENY**: nadie puede meter tu web dentro de un iframe (evita clickjacking).
- **X-Content-Type-Options: nosniff**: el navegador no "adivina" tipos de archivo.
- **Referrer-Policy / Permissions-Policy**: no filtran datos y bloquean cámara/micrófono/ubicación.

### f) Secretos fuera del código
La API key de Resend vive en **variables de entorno** (`.env.local` local, env vars en Vercel), **nunca** en el código ni en el repo de Git (`.gitignore` lo bloquea). Si el código se filtra, la clave no está ahí.

### g) Calidad adaptativa (robustez)
No es seguridad pero sí robustez: el 3D **mide los FPS** y si la máquina del visitante sufre, baja calidad sola → la página nunca se ve trabada. Y si el WebGL falla, un **error boundary** evita que se caiga toda la página (muestra un glow de respaldo).

### ¿Qué pasa cuando se detecta spam/bot? (resumen del flujo)
1. Llega un envío → se mira la **IP** → si superó 5 en 10 min, **se corta** (rate limit).
2. Se revisa el **honeypot** → si el campo oculto vino lleno, **se descarta** (bot).
3. Se **valida con Zod** → si los datos no cumplen, **se rechaza**.
4. Recién si pasa todo, se **sanitiza** y se envía el email.
> En todos los casos, el atacante recibe un mensaje genérico (no se le revela *por qué* falló) y **tu email/cuenta de Resend quedan protegidos**.

---

## 4. Comandos útiles

```bash
npm run dev     # desarrollo local (localhost:3000)
npm run build   # build de producción (valida tipos + lint)
npm test        # corre los tests
npm audit       # revisa vulnerabilidades de dependencias
```

Documentos relacionados: `STACK.md` (el stack base), `SEGURIDAD.md` (checklist de seguridad), `HERRAMIENTAS.md` (MCPs/skills).
