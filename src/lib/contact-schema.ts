import { z } from "zod";

// Shared, framework-agnostic validation for the contact form. Lives outside the
// "use server" action so it can be unit-tested directly.
export const leadSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  empresa: z.string().trim().max(160).optional(),
  contacto: z.string().max(40),
  tipo: z.string().trim().min(1).max(60),
  presupuesto: z.string().max(40),
  plazo: z.string().max(40),
  mensaje: z.string().trim().max(2000).optional(),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export type LeadInput = z.infer<typeof leadSchema>;
