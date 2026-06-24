# Sección de Captación de Clientes (Lead / Brief de Proyecto)

> El portfolio no es solo vitrina: también capta clientes. Un visitante puede
> contar qué web necesita y dejar sus datos para que Nico lo contacte.
> Basado en best practices de intake forms de web devs/agencias.
> Última actualización: 2026-06-23.

---

## 1. Principios (lo que dicen los que viven de esto)

- **Corto y al grano.** Pedir solo lo relevante. Formularios largos espantan.
- **Calificar el lead.** Las preguntas sirven para saber si el cliente es buen fit
  (presupuesto, plazo, tipo de proyecto) antes de invertir tiempo.
- **Profesional pero humano.** Que dé confianza, que se sienta una consultoría, no un trámite.
- **Cumplir privacidad.** Checkbox de consentimiento (GDPR/CCPA) para usar sus datos.

---

## 2. Estructura recomendada: formulario en pasos (wizard)

Un formulario de **3–4 pasos** convierte mejor que uno largo de una sola pantalla:
se siente liviano, profesional y guía al cliente. Barra de progreso arriba.

### Paso 1 — Contacto
- Nombre *(requerido)*
- Email *(requerido, validado)*
- Empresa / marca *(opcional)*
- Teléfono / WhatsApp *(opcional)*
- Medio de contacto preferido (Email / WhatsApp / Llamada)

### Paso 2 — Qué necesita
- Tipo de proyecto: Landing · Web institucional · E-commerce · Web app · Rediseño · Otro
- ¿Ya tenés web? (link opcional)
- Objetivo principal (vender, mostrar, captar clientes, reservas, etc.)
- Breve descripción del negocio / público objetivo *(textarea)*

### Paso 3 — Alcance
- Funcionalidades deseadas (multi-select: blog, pagos, reservas, login, panel admin, multi-idioma, etc.)
- Sitios de referencia que le gustan *(opcional)*
- Presupuesto aproximado (rangos: <$X / $X–$Y / $Y+ / a definir)
- Plazo deseado (urgente / 1 mes / 2-3 meses / flexible)

### Paso 4 — Cierre
- Mensaje libre *(opcional)*
- ☑️ Consentimiento de contacto/privacidad *(requerido)*
- Botón "Enviar solicitud"
- Pantalla de éxito: "¡Gracias! Te contacto en menos de 24-48 hs."

> **Tip de conversión:** mostrar un dato de confianza cerca del form
> (ej. "Respondo en 24 hs", "Proyectos entregados", testimonios).

---

## 3. Implementación técnica (sobre el stack)

| Necesidad | Solución |
|-----------|----------|
| Validación | **Zod** en cliente y servidor (email, requeridos) |
| Envío | **Server Action** de Next.js (sin API key expuesta) |
| Notificación a Nico | **Resend** + React Email → email formateado con todos los datos del lead |
| Auto-respuesta al cliente | Email automático de confirmación ("recibí tu mensaje...") |
| Guardar leads | Tabla `leads` en **Neon (Postgres)** vía Drizzle (para no perder ninguno y hacer seguimiento) |
| Anti-spam | **Honeypot** (campo oculto) + **rate limit** por IP + opcional Cloudflare Turnstile |
| Privacidad | Checkbox de consentimiento + link a política de privacidad |
| Accesibilidad | Labels, foco, errores anunciados, navegación por teclado entre pasos |

### Esquema de datos sugerido (`leads`)
```
id, created_at, nombre, email, empresa, telefono, contacto_preferido,
tipo_proyecto, web_actual, objetivo, descripcion, funcionalidades (json),
referencias, presupuesto, plazo, mensaje, consentimiento, estado (nuevo/contactado/cerrado)
```

> El campo `estado` te sirve como mini-CRM para hacer seguimiento de cada lead.

---

## 4. Prompt para diseñar esta sección en Claude Design

> Diseñá la **sección de contacto / solicitud de proyecto** del portfolio: un
> **formulario en 3-4 pasos** (wizard con barra de progreso) donde un cliente
> potencial describe la web que necesita. Pasos: (1) contacto, (2) qué necesita
> y tipo de proyecto, (3) alcance/presupuesto/plazo, (4) mensaje + consentimiento
> y pantalla de éxito. Estética coherente con el resto del portfolio, profesional
> y que transmita confianza. Incluí estados de validación (error/success) y un
> bloque lateral de confianza ("respondo en 24 hs"). Seguí las reglas SPECS del proyecto.
