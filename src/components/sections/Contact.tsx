"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendLead } from "@/app/actions/contact";

type Data = {
  nombre: string;
  email: string;
  empresa: string;
  contacto: string;
  tipo: string;
  presupuesto: string;
  plazo: string;
  mensaje: string;
  consent: boolean;
};

const CONTACTO = ["Email", "WhatsApp"];
const TIPOS = ["Landing", "Web institucional", "E-commerce", "Web app", "Otro"];
const PRESUPUESTO = ["A definir", "Reducido", "Estándar", "Avanzado"];
const PLAZO = ["Urgente", "1 mes", "2-3 meses", "Flexible"];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const STEP_TITLES = ["Sobre vos", "Sobre tu proyecto", "Contame un poco más"];

export default function Contact() {
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [data, setData] = useState<Data>({
    nombre: "",
    email: "",
    empresa: "",
    contacto: "Email",
    tipo: "",
    presupuesto: "A definir",
    plazo: "Flexible",
    mensaje: "",
    consent: false,
  });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErr("");
  };

  const next = () => {
    if (step === 0 && (!data.nombre.trim() || !EMAIL_RE.test(data.email))) {
      setErr("Completá tu nombre y un email válido.");
      return;
    }
    if (step === 1 && !data.tipo) {
      setErr("Elegí el tipo de proyecto.");
      return;
    }
    setErr("");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!data.consent) {
      setErr("Necesito tu consentimiento para poder contactarte.");
      return;
    }
    setErr("");
    setLoading(true);
    const res = await sendLead({ ...data, website });
    setLoading(false);
    if (res.ok) setSent(true);
    else setErr(res.error || "No se pudo enviar. Probá de nuevo.");
  };

  const spotlight = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section className="contact" id="contacto">
      <div className="contact-grid">
        <div className="contact-pitch">
          <span className="kicker">Contacto</span>
          <h2>
            ¿Tenés un proyecto
            <br />
            en mente?
          </h2>
          <p className="lead">
            Contame qué necesitás y te respondo en menos de 24-48 hs. Sin compromiso — solo una
            charla para entender tu proyecto.
          </p>
          <ul className="assure">
            <li>
              <span className="tick">✓</span> Respondo en 24-48 hs
            </li>
            <li>
              <span className="tick">✓</span> Sin compromiso ni costo inicial
            </li>
            <li>
              <span className="tick">✓</span> Presupuesto claro desde el principio
            </li>
          </ul>
        </div>

        <div className="form-card" onPointerMove={spotlight}>
          <div className="form-inner">
            {sent ? (
              <motion.div
                className="success"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="ico">✓</span>
                <h3>¡Gracias, {data.nombre || "crack"}!</h3>
                <p>
                  Recibí tu mensaje y te voy a contactar por {data.contacto.toLowerCase()} muy
                  pronto.
                </p>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="step-count">Paso {step + 1} de 3</p>
                    <p className="step-title">{STEP_TITLES[step]}</p>

                    {step === 0 && (
                      <>
                        <div className="field">
                          <label>Nombre *</label>
                          <input
                            value={data.nombre}
                            onChange={(e) => set("nombre", e.target.value)}
                            placeholder="Tu nombre"
                          />
                        </div>
                        <div className="field">
                          <label>Email *</label>
                          <input
                            type="email"
                            value={data.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder="tu@email.com"
                          />
                        </div>
                        <div className="field">
                          <label>Empresa / marca (opcional)</label>
                          <input
                            value={data.empresa}
                            onChange={(e) => set("empresa", e.target.value)}
                            placeholder="Tu negocio"
                          />
                        </div>
                        <div className="field">
                          <label>¿Cómo preferís que te contacte?</label>
                          <div className="chips">
                            {CONTACTO.map((c) => (
                              <button
                                type="button"
                                key={c}
                                className={`chip-opt ${data.contacto === c ? "sel" : ""}`}
                                onClick={() => set("contacto", c)}
                              >
                                {c}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div className="field">
                          <label>¿Qué necesitás? *</label>
                          <div className="chips">
                            {TIPOS.map((t) => (
                              <button
                                type="button"
                                key={t}
                                className={`chip-opt ${data.tipo === t ? "sel" : ""}`}
                                onClick={() => set("tipo", t)}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="field">
                          <label>Presupuesto estimado</label>
                          <div className="chips">
                            {PRESUPUESTO.map((p) => (
                              <button
                                type="button"
                                key={p}
                                className={`chip-opt ${data.presupuesto === p ? "sel" : ""}`}
                                onClick={() => set("presupuesto", p)}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="field">
                          <label>¿Para cuándo?</label>
                          <div className="chips">
                            {PLAZO.map((p) => (
                              <button
                                type="button"
                                key={p}
                                className={`chip-opt ${data.plazo === p ? "sel" : ""}`}
                                onClick={() => set("plazo", p)}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="field">
                          <label>Tu mensaje (opcional)</label>
                          <textarea
                            value={data.mensaje}
                            onChange={(e) => set("mensaje", e.target.value)}
                            placeholder="Contame tu idea, objetivos, referencias que te gusten…"
                          />
                        </div>
                        <label className="consent">
                          <input
                            type="checkbox"
                            checked={data.consent}
                            onChange={(e) => set("consent", e.target.checked)}
                          />
                          <span>
                            Acepto que Nico use mis datos para contactarme sobre este proyecto.
                          </span>
                        </label>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                />

                {err && <p className="err-text">{err}</p>}

                <div className="form-nav">
                  {step > 0 ? (
                    <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                      <span className="label">← Atrás</span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 2 ? (
                    <button className="btn btn-primary" onClick={next}>
                      <span className="label">Siguiente</span>
                      <span className="arrow">→</span>
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={submit} disabled={loading}>
                      <span className="label">{loading ? "Enviando…" : "Enviar solicitud"}</span>
                      {!loading && <span className="arrow">→</span>}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
