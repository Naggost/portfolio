"use client";

import type { CSSProperties } from "react";
import { useLanguage } from "@/lib/i18n";

export default function Process() {
  const { t } = useLanguage();

  return (
    <section className="process" id="proceso">
      <h2>{t.process.heading}</h2>
      <p className="lead">{t.process.lead}</p>
      <div className="dcards">
        {t.process.steps.map((s, i) => (
          <div className="dcard" key={i} style={{ "--i": i } as CSSProperties}>
            <span className="dcard-ico">{String(i + 1).padStart(2, "0")}</span>
            <div className="dcard-body">
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
