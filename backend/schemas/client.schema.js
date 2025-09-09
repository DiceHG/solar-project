// src/schemas/client.schema.js
import { z } from "zod";
import { isValidCPF, isValidCNPJ } from "../utils/br-docs.js";
import { filterDigits } from "../utils/helpers.js";

export const clientSchema = z
  .object({
    entityType: z.enum(["individual", "company"]).default("individual"),
    name: z.string().trim().min(1, "Nome inválido"),
    docNumber: z.string().trim().transform(filterDigits).min(1, "Documento Inválido"),
    email: z.email().optional(),
    phoneNumber: z.string().transform(filterDigits).min(8).max(15).optional(),
    originDate: z.coerce.date().optional(),
    projects: z.array(z.string()).default([]),
  })
  .strict()
  .superRefine((clientObj, ctx) => {
    if (clientObj.entityType === "individual" && !isValidCPF(clientObj.docNumber)) {
      ctx.addIssue({ code: "custom", path: ["docNumber"], message: "Invalid CPF" });
    }
    if (clientObj.entityType === "company" && !isValidCNPJ(clientObj.docNumber)) {
      ctx.addIssue({ code: "custom", path: ["docNumber"], message: "Invalid CNPJ" });
    }
  });
