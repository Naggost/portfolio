// Meteor flourish: slow scroll to the contact form while a big meteor flies in
// (overlapping the scroll so it lands as the form centers) and detonates with a
// shockwave larger than the form. Pure DOM + Web Animations API.

function makeDiv(cssText: string): HTMLDivElement {
  const d = document.createElement("div");
  d.style.cssText = cssText;
  return d;
}

function explode(x: number, y: number, card: HTMLElement | null) {
  // z-index 2 keeps the blast BEHIND the form (section content is z-index 3)
  // while still above the sun canvas and scrims.
  const root = makeDiv(
    `position:fixed;left:${x}px;top:${y}px;z-index:2;width:0;height:0;pointer-events:none`,
  );
  document.body.appendChild(root);

  // bright core flash
  const core = makeDiv(
    "position:absolute;left:-22px;top:-22px;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle,#fff,#FFE08A 40%,#FF8A1E 72%,transparent)",
  );
  root.appendChild(core);
  core.animate(
    [
      { transform: "scale(.3)", opacity: 1 },
      { transform: "scale(11)", opacity: 0 },
    ],
    { duration: 480, easing: "cubic-bezier(.15,.7,.3,1)", fill: "forwards" },
  );

  // main shockwave ring — expands beyond the form
  const ring1 = makeDiv(
    "position:absolute;left:-15px;top:-15px;width:30px;height:30px;border-radius:50%;border:3px solid rgba(255,176,32,.9)",
  );
  root.appendChild(ring1);
  ring1.animate(
    [
      { transform: "scale(.4)", opacity: 0.95 },
      { transform: "scale(30)", opacity: 0 },
    ],
    { duration: 900, easing: "cubic-bezier(.12,.7,.25,1)", fill: "forwards" },
  );

  // secondary ring
  const ring2 = makeDiv(
    "position:absolute;left:-12px;top:-12px;width:24px;height:24px;border-radius:50%;border:2px solid rgba(255,106,18,.75)",
  );
  root.appendChild(ring2);
  ring2.animate(
    [
      { transform: "scale(.4)", opacity: 0.8 },
      { transform: "scale(22)", opacity: 0 },
    ],
    { duration: 700, delay: 70, easing: "cubic-bezier(.12,.7,.25,1)", fill: "forwards" },
  );

  // particle burst
  const N = 26;
  for (let i = 0; i < N; i++) {
    const sz = 3 + Math.random() * 6;
    const p = makeDiv(
      `position:absolute;left:${-sz / 2}px;top:${-sz / 2}px;width:${sz}px;height:${sz}px;border-radius:50%;background:${
        i % 3 ? "#FFB020" : "#FF7A1E"
      };box-shadow:0 0 10px rgba(255,176,32,.85)`,
    );
    root.appendChild(p);
    const ang = (Math.PI * 2 * i) / N + Math.random() * 0.4;
    const dist = 90 + Math.random() * 200;
    const dx = Math.cos(ang) * dist;
    const dy = Math.sin(ang) * dist + 50; // gravity
    p.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) scale(.15)`, opacity: 0 },
      ],
      { duration: 750 + Math.random() * 400, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" },
    );
  }

  if (card) {
    card.animate(
      [
        { transform: "translate(0,0)" },
        { transform: "translate(7px,-5px)" },
        { transform: "translate(-7px,5px)" },
        { transform: "translate(4px,3px)" },
        { transform: "translate(-3px,-2px)" },
        { transform: "translate(0,0)" },
      ],
      { duration: 520, easing: "ease-out" },
    );
  }

  setTimeout(() => root.remove(), 1400);
}

function launchMeteor(tx: number, ty: number, card: HTMLElement | null, flightDur: number) {
  const sx = Math.min(window.innerWidth * 0.92, tx + 360);
  const sy = -160;
  const angle = (Math.atan2(ty - sy, tx - sx) * 180) / Math.PI;

  const m = makeDiv(
    "position:fixed;left:0;top:0;z-index:200;width:26px;height:26px;border-radius:50%;pointer-events:none;background:radial-gradient(circle,#fff 0%,#FFE08A 42%,#FF8A1E 74%,transparent 100%);box-shadow:0 0 30px 8px rgba(255,176,32,.9)",
  );
  const tail = makeDiv(
    "position:absolute;right:13px;top:50%;width:240px;height:5px;border-radius:5px;transform:translateY(-50%);background:linear-gradient(90deg,transparent,rgba(255,138,30,.9))",
  );
  m.appendChild(tail);
  document.body.appendChild(m);

  const a = m.animate(
    [
      { transform: `translate(${sx - 13}px,${sy - 13}px) rotate(${angle}deg)`, opacity: 0 },
      { opacity: 1, offset: 0.12 },
      { transform: `translate(${tx - 13}px,${ty - 13}px) rotate(${angle}deg)`, opacity: 1 },
    ],
    { duration: flightDur, easing: "cubic-bezier(.55,0,.95,.45)", fill: "forwards" },
  );
  a.onfinish = () => {
    m.remove();
    explode(tx, ty, card);
  };
}

export function flyToContact() {
  const target = document.getElementById("contacto");
  if (!target) return;
  const card = target.querySelector<HTMLElement>(".form-card") ?? target;

  const cardRect = card.getBoundingClientRect();
  const cardCenterAbs = window.scrollY + cardRect.top + cardRect.height / 2;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const endY = Math.max(0, Math.min(cardCenterAbs - window.innerHeight / 2, maxScroll));

  // impact point in viewport coords AFTER the scroll: x is unchanged by a
  // vertical scroll; y is where the card center lands (viewport centre).
  const tx = cardRect.left + cardRect.width / 2;
  const ty = window.innerHeight * 0.45;

  const html = document.documentElement;
  const prevBehavior = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, endY);
    html.style.scrollBehavior = prevBehavior;
    return;
  }

  const startY = window.scrollY;
  const dur = 1100; // slower scroll
  const t0 = performance.now();
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const stepFn = (now: number) => {
    const p = Math.min((now - t0) / dur, 1);
    window.scrollTo(0, startY + (endY - startY) * ease(p));
    if (p < 1) requestAnimationFrame(stepFn);
    else html.style.scrollBehavior = prevBehavior;
  };
  requestAnimationFrame(stepFn);

  // meteor flies during the scroll and lands as it settles
  launchMeteor(tx, ty, card, dur - 80);
}
