# Herramientas, MCPs y Skills para Diseño/Desarrollo Web

> Catálogo de las mejores extensiones de Claude Code para hacer páginas web de
> primer nivel. Complementa a `STACK.md`.
> Última actualización: 2026-06-23.

---

## 1. MCPs ESENCIALES (los que de verdad mueven la aguja)

| MCP | Estado | Para qué sirve |
|-----|--------|----------------|
| **21st.dev Magic** (`/ui …`) | ⭐ Instalar | "v0 dentro de tu editor". Generás componentes React+Tailwind de calidad desde lenguaje natural, a partir de una librería enorme de patrones pulidos. Ideal para tu nivel de diseño |
| **Figma MCP / Figma Skills** | ⭐ Instalar | Conecta los diseños de Figma con el código: tokens, variables, componentes, estados (hover/loading/empty). Si Claude Design entrega en Figma, esto traduce diseño→código fiel |
| **shadcn** | ✅ Ya conectado | Listar e instalar bloques/componentes shadcn directo |
| **context7** | ✅ Ya conectado | Docs actualizadas (Next, Tailwind, R3F, Drizzle...). Evita código viejo |
| **playwright** | ✅ Ya conectado | Browser real: navegar, screenshots, validar la UI y los flujos. Claude verifica su propio trabajo visual |
| **GitHub MCP** | Opcional | Cuando subamos a repos: issues, PRs, reviews sin salir de Claude Code |

> **Regla de oro encontrada en la investigación:** 3 MCPs es el punto dulce, 5 el
> máximo antes de que el overhead de tokens moleste. No instalar de más.

---

## 2. SKILLS de diseño/UI (las mejores 2026)

| Skill | Para qué |
|-------|----------|
| **Vercel `web-design-guidelines`** | Revisa el código UI contra 100+ reglas de accesibilidad, performance y UX. Un "linter de diseño profesional" |
| **`composition-patterns`** | Enseña patrones de componentes que escalan (compound components, context, variantes). Evita el anti-patrón de "props booleanas infinitas" |
| **Figma `/figma-use`** | Enseña a Claude tokens, variables, estilos y componentes de Figma y cómo usarlos en el canvas |
| **`/code-review` y `/security-review`** (nativas) | Revisión de bugs + auditoría de seguridad sobre el diff antes de deploy |

> Repo de referencia con 1000+ skills de la comunidad: **VoltAgent/awesome-agent-skills**.

---

## 3. ElevenLabs — qué es y cuándo nos sirve

**ElevenLabs MCP = plataforma de audio con IA.** No es para maquetar, es para
**contenido de audio**. Capacidades:

- **Text-to-Speech**: voz natural a partir de texto (multi-idioma)
- **Sound effects / música**: genera efectos y música desde una descripción
- **Voice cloning**: clonar una voz
- **Transcripción** (speech-to-text) y **speech-to-speech**
- **Agentes de voz** conversacionales

**Dónde encaja en webs profesionales:**
- Narración/voiceover para videos de presentación de un proyecto o landing
- Microsonidos UI (hover, success) generados a medida
- Demos de producto con voz, o un "asistente" de voz en una web
- Banda sonora corta para un hero animado

> Para el **portfolio** no es prioritario. Lo dejamos anotado: si un cliente pide
> video promocional, voiceover o audio UI, es la mejor opción. Se combina muy bien
> con las skills de **HyperFrames** (video) que ya tenemos disponibles.

---

## 4. Plantillas / inspiración de UI premium

| Fuente | Qué ofrece |
|--------|-----------|
| **21st.dev** | Componentes y bloques modernos (vía MCP Magic o web). Base principal de plantillas |
| **shadcn/ui + Aceternity UI + Magic UI** | Componentes animados premium para Next + Tailwind |
| **Motion-Primitives** | Animaciones listas sobre Motion |
| **Vercel templates** | Starters Next.js de referencia |

---

## 5. Cómo lo combinamos en el flujo

```
1. Claude Design  →  estética + (idealmente) archivo Figma
2. Figma MCP / brief  →  Claude lee tokens, colores, componentes
3. 21st.dev Magic (/ui) + shadcn  →  genero componentes base rápido
4. R3F/drei + GSAP  →  3D de alto impacto y scroll storytelling
5. context7  →  asegura APIs actualizadas
6. playwright  →  valido visualmente en navegador real (desktop + mobile)
7. web-design-guidelines + /code-review + /security-review  →  pulido final
8. (opcional) ElevenLabs + HyperFrames  →  audio/video promocional
```

---

## 6. Acción pendiente (cuando quieras instalar)

Estos requieren que vos los actives con tu cuenta/API key:
- [ ] **21st.dev Magic** — crear cuenta en 21st.dev → API key → instalar MCP
- [ ] **Figma MCP** — si Claude Design entrega en Figma
- [ ] **ElevenLabs** — solo si hay proyecto con audio/video (API key de ElevenLabs)

> shadcn, context7 y playwright ya están conectados en esta sesión.
