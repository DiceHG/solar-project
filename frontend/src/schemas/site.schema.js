import { z } from "zod";
import { trimString, filterDigits } from "../utils/helpers.js";

export const siteSchema = z.object({
  // Link to the project
  project: z.string().trim(),

  // Site name
  name: z.string().trim(),

  // Address
  address: z.object({
    cep: z.preprocess((v) => filterDigits(v), z.string().length(8, "CEP inválido")),
    state: z.string().trim().min(2, "Estado inválido"),
    city: z.string().trim().min(1, "Cidade inválida"),
    district: z.preprocess((v) => trimString(v), z.string().min(1, "Bairro inválido").optional()),
    street: z.string().trim().min(1, "Logradouro inválido"),
    number: z.string().trim().min(1, "Número inválido"),
    complement: z.preprocess((v) => trimString(v), z.string().optional()),
  }),

  // Electrical info
  uc: z.string().trim().min(1, "UC inválida"),
  class: z.enum(["residential", "commercial", "industrial"]).default("residential"),
  connectionType: z.enum(["single-phase", "two-phase", "three-phase"]).default("single-phase"),
  voltage: z.coerce.number().min(0), // V
  circuitBreaker: z.coerce.number().min(0), // A
  load: z.coerce.number(),

  // Geographic coordinates
  coords: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),

  // Energy consumption
  consumption: z.array(z.coerce.number().min(0)), // kW monthly
});
