export const TECH: Record<string, { slug: string; hex: string }> = {
  "Next.js": { slug: "nextdotjs", hex: "#FFFFFF" },
  React: { slug: "react", hex: "#61DAFB" },
  TypeScript: { slug: "typescript", hex: "#3178C6" },
  Tailwind: { slug: "tailwindcss", hex: "#38BDF8" },
  "Three.js": { slug: "threedotjs", hex: "#FFFFFF" },
  GSAP: { slug: "greensock", hex: "#88CE02" },
  Motion: { slug: "framer", hex: "#FFFFFF" },
  Stripe: { slug: "stripe", hex: "#8B7CFF" },
  PostgreSQL: { slug: "postgresql", hex: "#6CA0DC" },
  "Node.js": { slug: "nodedotjs", hex: "#66BB6A" },
  Vercel: { slug: "vercel", hex: "#FFFFFF" },
  WordPress: { slug: "wordpress", hex: "#6AA9DC" },
  CSS: { slug: "css3", hex: "#4F9BE0" },
};

export function techIcon(slug: string, hex: string) {
  return `https://cdn.simpleicons.org/${slug}/${hex.slice(1)}`;
}
