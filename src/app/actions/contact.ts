"use server";

import { Resend } from "resend";
import { headers } from "next/headers";
import { leadSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

export type LeadResult = { ok: boolean; error?: string };

const TO = "nicoagostini38@gmail.com";

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function sendLead(input: unknown): Promise<LeadResult> {
  // rate limit by client IP — protects the email endpoint from abuse/spam
  const hdrs = await headers();
  const ip = (hdrs.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || "local";
  if (!rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    return { ok: false, error: "Demasiados envíos. Esperá unos minutos e intentá de nuevo." };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revisá los datos del formulario." };
  const d = parsed.data;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "El envío no está configurado todavía." };

  const rows: [string, string][] = [
    ["Nombre", d.nombre],
    ["Email", d.email],
    ["Empresa", d.empresa || "—"],
    ["Contacto preferido", d.contacto],
    ["Tipo de proyecto", d.tipo],
    ["Presupuesto", d.presupuesto],
    ["Plazo", d.plazo],
    ["Mensaje", d.mensaje || "—"],
  ];
  const html = `
    <h2 style="font-family:sans-serif">Nuevo lead desde el portfolio</h2>
    <table style="font-family:sans-serif;border-collapse:collapse">
      ${rows
        .map(
          ([k, v]) =>
            `<tr><td style="padding:6px 14px 6px 0;color:#666;vertical-align:top"><b>${k}</b></td><td style="padding:6px 0">${esc(
              v,
            )}</td></tr>`,
        )
        .join("")}
    </table>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [TO],
      replyTo: d.email,
      subject: `Nuevo lead: ${d.nombre} — ${d.tipo}`,
      html,
    });
    if (error) return { ok: false, error: "No se pudo enviar. Probá de nuevo en un momento." };
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo enviar. Probá de nuevo en un momento." };
  }
}
