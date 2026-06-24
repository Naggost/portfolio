// Best-effort in-memory rate limiter (per warm serverless instance). Good enough
// to blunt bursts/abuse on a contact form; for stronger, cross-instance limits
// use a shared store (e.g. Upstash Redis).
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}
