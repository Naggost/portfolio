# Baseline de Seguridad y Robustez

> Mecanismos de seguridad aplicados en el portfolio. Sirve como **checklist
> reutilizable** para cualquier proyecto de cliente. Nada es "impenetrable",
> pero esto es hardening de nivel profesional que cubre lo que de verdad importa.
> Última actualización: 2026-06-24.

---

## 1. Lo aplicado en este proyecto ✅

### Security headers (`next.config.ts`)
| Header | Para qué |
|--------|----------|
| **Content-Security-Policy** | Limita de dónde se cargan scripts/estilos/imágenes/fuentes → frena XSS e inyección |
| **Strict-Transport-Security (HSTS)** | Fuerza HTTPS siempre (evita downgrade/MITM) |
| **X-Frame-Options: DENY** + `frame-ancestors 'none'` | El sitio no puede embeberse en un iframe → anti-clickjacking |
| **X-Content-Type-Options: nosniff** | Evita que el browser "adivine" tipos MIME |
| **Referrer-Policy** | No filtra URLs internas en el `Referer` |
| **Permissions-Policy** | Bloquea cámara, micrófono, geolocalización |
| **poweredByHeader: false** | No revela que es Next.js |

### Formulario de contacto (único endpoint dinámico)
- **Validación con Zod** (cliente + servidor) — tamaños máximos, email válido, campos requeridos.
- **Sanitización**: se escapan `& < > "` antes de meter datos en el HTML del email (anti-inyección).
- **Honeypot** (campo oculto `website`): si un bot lo completa, se rechaza.
- **Rate limiting** por IP (5 envíos / 10 min) — frena abuso/spam del endpoint de email.
- **Secretos fuera del código**: la `RESEND_API_KEY` vive en variables de entorno (`.env.local` localmente, env vars en Vercel), nunca en el repo (`.gitignore` cubre `.env*`).
- **Server Action**: la lógica de envío corre solo en el servidor; el navegador nunca ve la API key.

### Testing automatizado (Vitest)
- Tests de la validación (`leadSchema`) y del rate limiter.
- Correr con `npm test`.

### Dependencias
- `npm audit` revisado. Las vulnerabilidades transitivas se evalúan **una por una** —
  no se corre `npm audit fix --force` a ciegas (puede romper con downgrades mayores).

---

## 2. Checklist para proyectos de cliente

- [ ] Security headers (copiar `next.config.ts`)
- [ ] Validación Zod en **cada** entrada (forms, params, API)
- [ ] Sanitizar/escapar todo dato que se renderice o se mande
- [ ] Rate limiting en endpoints que cuesten (email, DB, auth)
- [ ] Honeypot y/o **CAPTCHA** (Cloudflare Turnstile) en formularios públicos
- [ ] Secretos solo en env vars (nunca en el repo)
- [ ] HTTPS forzado (HSTS) + dominio con SSL
- [ ] Si hay DB: **queries parametrizadas** siempre (anti SQL injection)
- [ ] Si hay auth: sesiones seguras, cookies `httpOnly`+`secure`+`sameSite`
- [ ] Tests de la lógica crítica (Vitest) + E2E de los flujos que cuestan (Playwright)
- [ ] `npm audit` antes de cada deploy
- [ ] Logs de intentos de abuso (rate-limit, validaciones fallidas)
- [ ] Manejo de errores que **no filtre** detalles internos al usuario

---

## 3. Próximo nivel (opcional, requiere cuentas)

| Mecanismo | Qué suma | Necesita |
|-----------|----------|----------|
| **Cloudflare Turnstile** | CAPTCHA invisible → corta bots de verdad | Cuenta Cloudflare (gratis) + site key/secret |
| **Upstash Redis** | Rate limiting real **cross-instance** (el in-memory actual es best-effort en serverless) | Cuenta Upstash (free tier) |
| **CSP con nonce** | CSP estricta sin `'unsafe-inline'` en scripts | Middleware de nonces |
| **`/security-review`** (skill de Claude Code) | Auditoría OWASP automática del diff | Repo git |
| **Sentry** | Monitoreo de errores en producción | Cuenta Sentry |

---

## 4. Comandos útiles

```bash
npm test            # tests de validación + rate limit
npm audit           # revisar vulnerabilidades de dependencias
npm run build       # build de producción (valida tipos + lint)
```
