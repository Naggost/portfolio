import { describe, it, expect } from "vitest";
import { leadSchema } from "./contact-schema";

const base = {
  nombre: "Nico",
  email: "nico@example.com",
  contacto: "Email",
  tipo: "Landing",
  presupuesto: "A definir",
  plazo: "Flexible",
};

describe("leadSchema", () => {
  it("acepta un lead válido", () => {
    expect(leadSchema.safeParse(base).success).toBe(true);
  });

  it("rechaza un email inválido", () => {
    expect(leadSchema.safeParse({ ...base, email: "no-es-un-mail" }).success).toBe(false);
  });

  it("rechaza nombre vacío", () => {
    expect(leadSchema.safeParse({ ...base, nombre: "" }).success).toBe(false);
  });

  it("rechaza tipo de proyecto vacío", () => {
    expect(leadSchema.safeParse({ ...base, tipo: "" }).success).toBe(false);
  });

  it("rechaza el honeypot con contenido (bot)", () => {
    expect(leadSchema.safeParse({ ...base, website: "http://spam" }).success).toBe(false);
  });

  it("rechaza un nombre exageradamente largo", () => {
    expect(leadSchema.safeParse({ ...base, nombre: "a".repeat(500) }).success).toBe(false);
  });
});
