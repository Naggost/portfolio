"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
    }, 2200);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className={`preloader ${done ? "gone" : ""}`} aria-hidden={done}>
      <div className="pre-inner">
        <span className="pre-eyebrow">Nico</span>
        <h2 className="pre-title">
          <span className="pre-line">
            <span>Bienvenido a</span>
          </span>
          <span className="pre-line">
            <span>
              mi <em>Portfolio</em>
            </span>
          </span>
        </h2>
      </div>
    </div>
  );
}
