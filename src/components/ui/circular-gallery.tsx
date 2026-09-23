"use client";

import { Children, useLayoutEffect, useRef, type ReactNode } from "react";

type CircularGalleryProps = {
  children: ReactNode;
  label?: string;
  /** Scroll distance, in vh, the page travels while the ring turns from one item to the next. */
  scrollPerItem?: number;
  /** Space, in px, kept between neighbouring items on the ring. */
  gap?: number;
  perspective?: number;
  /** Idle rotation in degrees per second. 0 disables it. */
  autoRotateSpeed?: number;
};

const damp = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

export function CircularGallery({
  children,
  label = "Gallery",
  scrollPerItem = 55,
  gap = 72,
  perspective = 1800,
  autoRotateSpeed = 1.2,
}: CircularGalleryProps) {
  const items = Children.toArray(children);
  const n = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const ring = ringRef.current;
    const els = itemRefs.current.slice(0, n).filter((el): el is HTMLDivElement => !!el);
    if (!track || !stage || !ring || n < 2 || els.length !== n) return;

    const step = 360 / n;
    let radius = 400;
    let scale = 1;
    let rot = 0;
    let auto = 0;
    let progress = 0;
    let idle = 1;
    let hovered: number | null = null;
    let held = false;
    let raf = 0;
    let last = 0;
    const pop = new Array<number>(n).fill(0);
    const dim = new Array<number>(n).fill(1);
    const away = new Array<boolean>(n).fill(false);

    const scrollProgress = () => {
      const rect = track.getBoundingClientRect();
      const travel = rect.height - innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
    };

    const layout = () => {
      const width = Math.min(430, Math.max(340, stage.clientWidth * 0.3));
      for (const el of els) {
        el.style.width = `${width}px`;
        el.style.marginLeft = `${-width / 2}px`;
      }
      const tallest = Math.max(...els.map((el) => el.offsetHeight));
      scale = tallest > 0 ? Math.min(1, Math.max(0.55, (stage.clientHeight - 120) / tallest)) : 1;
      radius = (width * scale + gap) / (2 * Math.tan(Math.PI / Math.max(n, 3)));
    };

    const apply = () => {
      ring.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
      for (let i = 0; i < n; i++) {
        const rel = (((i * step + rot) % 360) + 360) % 360;
        const off = rel > 180 ? 360 - rel : rel;
        const depth = Math.max(0.2, 1 - off / 120);
        const el = els[i];
        el.style.opacity = ((depth + (1 - depth) * pop[i]) * dim[i]).toFixed(3);
        el.style.transform =
          `translateY(-50%) rotateY(${i * step}deg) translateZ(${radius + 70 * pop[i]}px) ` +
          `scale(${(scale * (1 + 0.05 * pop[i])).toFixed(4)})`;
        const isAway = off > 100;
        if (isAway !== away[i]) {
          away[i] = isAway;
          el.toggleAttribute("data-away", isAway);
        }
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const p = scrollProgress();
      idle = Math.abs(p - progress) > 1e-5 ? 0 : idle + dt;
      progress = p;

      if (idle < 0.2) auto -= auto * damp(5, dt);
      else if (hovered === null && !held) auto += autoRotateSpeed * dt;
      if (auto > 180) {
        auto -= 360;
        rot -= 360;
      } else if (auto < -180) {
        auto += 360;
        rot += 360;
      }

      const target = -progress * (n - 1) * step + auto;
      rot += (target - rot) * damp(9, dt);

      for (let i = 0; i < n; i++) {
        pop[i] += ((hovered === i ? 1 : 0) - pop[i]) * damp(12, dt);
        dim[i] += ((hovered === null || hovered === i ? 1 : 0.45) - dim[i]) * damp(10, dt);
      }
      apply();
    };

    progress = scrollProgress();
    rot = -progress * (n - 1) * step;
    layout();
    apply();

    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(track);

    const ro = new ResizeObserver(() => {
      layout();
      apply();
    });
    ro.observe(stage);
    document.fonts?.ready.then(() => {
      layout();
      apply();
    });

    const listeners = els.map((el, i) => {
      const enter = () => {
        hovered = i;
      };
      const leave = () => {
        hovered = null;
      };
      const focus = () => {
        held = true;
        const base = -progress * (n - 1) * step;
        let want = -i * step - base;
        want -= 360 * Math.round((want - auto) / 360);
        auto = want;
      };
      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointerleave", leave);
      el.addEventListener("focusin", focus);
      return { el, enter, leave, focus };
    });
    const release = (e: FocusEvent) => {
      if (!(e.relatedTarget instanceof Node) || !ring.contains(e.relatedTarget)) held = false;
    };
    ring.addEventListener("focusout", release);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      ring.removeEventListener("focusout", release);
      for (const { el, enter, leave, focus } of listeners) {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointerleave", leave);
        el.removeEventListener("focusin", focus);
      }
    };
  }, [n, gap, autoRotateSpeed]);

  return (
    <div
      ref={trackRef}
      className="cg-track"
      style={{ height: `calc(100vh + ${(n - 1) * scrollPerItem}vh)` }}
    >
      <div className="cg-sticky">
        <div
          ref={stageRef}
          className="cg-stage"
          style={{ perspective }}
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
        >
          <div ref={ringRef} className="cg-ring">
            {items.map((child, i) => (
              <div
                key={i}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="cg-item"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} / ${n}`}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
