// src/schemas/inverter.schema.js
import { z } from "zod";

const mpptSchema = z.object({
  dcMaxCurrent: z.coerce.number().min(0, "Corrente inválida"), // A
  scCurrent: z.coerce.number().min(0, "Corrente inválida").optional(), // A
  pvStringCount: z.coerce.number().int().min(1).default(1),
});

export const inverterSchema = z.object({
  // Basic Information
  maker: z.string().trim().min(1, "Fabricante inválido"),
  model: z.string().trim().min(1, "Modelo inválido"),
  inmetro: z.string().trim().min(1, "Inmetro inválido"),
  price: z.coerce.number().min(0, "Preço inválido"),
  // datasheetUrl: z.string().optional(),
  // image: z.string().optional(),

  // Input DC
  dcMaxPower: z.coerce.number().min(0, "Potência inválida"), // W (DC)
  dcNominalVoltage: z.coerce.number().min(0).optional(), // V (DC)
  dcVoltage: z.object({
    min: z.coerce.number().min(0, "Tensão inválida"), // V
    max: z.coerce.number().min(0, "Tensão inválida"), // V
  }),
  startUpVoltage: z.coerce.number().min(0, "Tensão inválida"), // V (DC)
  mpptConfig: z.array(mpptSchema).min(1, "Ao menos uma MPPT é obrigatório"),

  // Output AC
  acNominalPower: z.coerce.number().min(0, "Potência inválida"), // W (AC)
  acNominalVoltage: z.coerce.number().min(0, "Tensão inválida").default(220), // V (AC)
  acMaxCurrent: z.coerce.number().min(0, "Corrente inválida"), // A (AC)
  frequency: z.coerce.number().default(60), // Hz
  thd: z.coerce.number().min(0).max(100).default(3), // %
  powerFactor: z.object({
    i: z.coerce.number().min(0).max(1).default(0.8), // Inductive
    c: z.coerce.number().min(0).max(1).default(0.8), // Capacitive
  }),
  connectionType: z.enum(["single-phase", "three-phase"]).default("single-phase"),

  // Efficiency
  efficiency: z
    .object({
      max: z.coerce.number().min(0).max(100).optional(), // %
      european: z.coerce.number().min(0).max(100).optional(), // %
    })
    .optional(),

  // Mechanical Specifications
  dimensions: z
    .object({
      width: z.coerce.number().min(0).optional(), // m
      length: z.coerce.number().min(0).optional(), // m
      depth: z.coerce.number().min(0).optional(), // m
    })
    .optional(),
  weight: z.coerce.number().min(0).optional(), // kg
  protection: z.string().trim().optional(),
  connectors: z.object({
    dc: z.string().trim().default("MC4"),
    ac: z.string().trim().default("Plug and Play"),
  }),
});
