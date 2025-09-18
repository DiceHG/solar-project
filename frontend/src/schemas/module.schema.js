// src/schemas/client.schema.js
import { z } from "zod";

export const moduleSchema = z.object({
  // Basic Information
  model: z.string().trim().min(1, "Modelo inválido"),
  maker: z.string().trim().min(1, "Fabricante inválido"),
  inmetro: z.string().trim().min(1, "Inmetro Inválido"),
  warrantyYears: z.coerce.number().optional(),
  price: z.coerce.number().min(0, "Preço inválido"),
  // datasheetUrl: z.string().optional(),
  // image: z.string().optional(),

  // Mechanical Specifications
  dimensions: z.object({
    width: z.coerce.number().min(0).optional(), // m
    length: z.coerce.number().min(0).optional(), // m
    depth: z.coerce.number().min(0).optional(), // m
  }),
  weight: z.coerce.number().min(0).optional(), // kg
  cellType: z.string().trim().optional(),
  numOfCells: z.coerce.number().min(0).optional(),
  frame: z.string().trim().optional(),
  junctionBox: z.string().trim().optional(),
  cable: z.string().trim().optional(),
  connector: z.string().trim().optional(),

  // Eletrical Specifications
  maxPower: z.coerce.number().min(0, "Potência Inválida"),
  maxPowerVoltage: z.coerce.number().min(0, "Tensão Inválida"),
  maxPowerCurrent: z.coerce.number().min(0, "Corrente Inválida"),
  ocVoltage: z.coerce.number().min(0).optional(),
  scCurrent: z.coerce.number().min(0).optional(),
  efficiency: z.coerce.number().min(0).max(100).optional(),
  maxSystemVoltage: z.coerce.number().min(0).optional(),
  maxSeriesFuse: z.coerce.number().min(0).optional(),
});
