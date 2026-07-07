"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { sendLead } from "@/app/actions/contact";
import { useLanguage } from "@/lib/i18n";

type Data = {
  nombre: string;
  email: string;
  empresa: string;
  contactoIdx: number;
  tipoIdx: number | null;
  presupuestoIdx: number;
  plazoIdx: number;
  mensaje: string;
  consent: boolean;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export default function Contact() {
  const { t } = useLanguage();
  const c = t.contact;
  const [step, setStep] = useState(0);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [data, setData] = useState<Data>({
    nombre: "",
    email: "",
    empresa: "",
    contactoIdx: 0,
    tipoIdx: null,
    presupuestoIdx: 0,
    plazoIdx: 3,
    mensaje: "",
    consent: false,
  });

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    setErr("");
  };

  const next = () => {
    if (step === 0 && (!data.nombre.trim() || !EMAIL_RE.test(data.email))) {
      setErr(c.errName);
      return;
    }
    if (step === 1 && data.tipoIdx === null) {
      setErr(c.errTipo);
      return;
    }
    setErr("");
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!data.consent) {
      setErr(c.errConsent);
      return;
    }
    setErr("");
    setLoading(true);
    const res = await sendLead({
      nombre: data.nombre,
      email: data.email,
      empresa: data.empresa,
      contacto: c.contacto[data.contactoIdx],
      tipo: data.tipoIdx !== null ? c.tipos[data.tipoIdx] : "",
      presupuesto: c.presupuesto[data.presupuestoIdx],
      plazo: c.plazo[data.plazoIdx],
      mensaje: data.mensaje,
      consent: data.consent,
      website,
    });
    setLoading(false);
    if (res.ok) setSent(true);
    else setErr(res.error || c.errSend);
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
          <span className="kicker">{c.kicker}</span>
          <h2>
            {c.h2a}
            <br />
            {c.h2b}
          </h2>
          <p className="lead">{c.lead}</p>
          <ul className="assure">
            {c.assure.map((a) => (
              <li key={a}>
                <span className="tick">✓</span> {a}
              </li>
            ))}
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
                <h3>{c.thanks(data.nombre || "crack")}</h3>
                <p>{c.successBody(c.contacto[data.contactoIdx].toLowerCase())}</p>
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
                    <p className="step-count">{c.stepCount(step + 1)}</p>
                    <p className="step-title">{c.stepTitles[step]}</p>

                    {step === 0 && (
                      <>
                        <div className="field">
                          <label>{c.nombre}</label>
                          <input
                            value={data.nombre}
                            onChange={(e) => set("nombre", e.target.value)}
                            placeholder={c.nombrePh}
                          />
                        </div>
                        <div className="field">
                          <label>{c.email}</label>
                          <input
                            type="email"
                            value={data.email}
                            onChange={(e) => set("email", e.target.value)}
                            placeholder={c.emailPh}
                          />
                        </div>
                        <div className="field">
                          <label>{c.empresa}</label>
                          <input
                            value={data.empresa}
                            onChange={(e) => set("empresa", e.target.value)}
                            placeholder={c.empresaPh}
                          />
                        </div>
                        <div className="field">
                          <label>{c.preferContact}</label>
                          <div className="chips">
                            {c.contacto.map((label, i) => (
                              <button
                                type="button"
                                key={label}
                                className={`chip-opt ${data.contactoIdx === i ? "sel" : ""}`}
                                onClick={() => set("contactoIdx", i)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <div className="field">
                          <label>{c.needQuestion}</label>
                          <div className="chips">
                            {c.tipos.map((label, i) => (
                              <button
                                type="button"
                                key={label}
                                className={`chip-opt ${data.tipoIdx === i ? "sel" : ""}`}
                                onClick={() => set("tipoIdx", i)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="field">
                          <label>{c.presupuestoLabel}</label>
                          <div className="chips">
                            {c.presupuesto.map((label, i) => (
                              <button
                                type="button"
                                key={label}
                                className={`chip-opt ${data.presupuestoIdx === i ? "sel" : ""}`}
                                onClick={() => set("presupuestoIdx", i)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="field">
                          <label>{c.plazoLabel}</label>
                          <div className="chips">
                            {c.plazo.map((label, i) => (
                              <button
                                type="button"
                                key={label}
                                className={`chip-opt ${data.plazoIdx === i ? "sel" : ""}`}
                                onClick={() => set("plazoIdx", i)}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="field">
                          <label>{c.mensajeLabel}</label>
                          <textarea
                            value={data.mensaje}
                            onChange={(e) => set("mensaje", e.target.value)}
                            placeholder={c.mensajePh}
                          />
                        </div>
                        <label className="consent">
                          <input
                            type="checkbox"
                            checked={data.consent}
                            onChange={(e) => set("consent", e.target.checked)}
                          />
                          <span>{c.consent}</span>
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
                      <span className="label">{c.back}</span>
                    </button>
                  ) : (
                    <span />
                  )}
                  {step < 2 ? (
                    <button className="btn btn-primary" onClick={next}>
                      <span className="label">{c.next}</span>
                      <span className="arrow">→</span>
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={submit} disabled={loading}>
                      <span className="label">{loading ? c.sending : c.send}</span>
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
