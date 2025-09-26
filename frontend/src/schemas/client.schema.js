// src/schemas/client.schema.js
import { z } from "zod";
import { isValidCPF, isValidCNPJ } from "../utils/br-docs.js";
import { filterDigits, trimString } from "../utils/helpers.js";

export const clientSchema = z
  .object({
    entityType: z.enum(["individual", "company"]).default("individual"),
    name: z.string().trim().min(1, "Nome inválido"),
    docNumber: z.preprocess(
      (v) => filterDigits(v),
      z.string("Documento inválido").min(11, "Documento inválido").max(14, "Documento inválido")
    ),
    email: z.preprocess((v) => trimString(v), z.email("Email inválido").optional()),
    phoneNumber: z.preprocess(
      (v) => filterDigits(v),
      z.string().min(10, "Telefone inválido").max(15, "Telefone inválido").optional()
    ),
    originDate: z.coerce.date().optional(),
  })
  .superRefine((client, ctx) => {
    if (client.entityType === "individual" && !isValidCPF(client.docNumber)) {
      ctx.addIssue({ code: "custom", path: ["docNumber"], message: "CPF inválido" });
    }
    if (client.entityType === "company" && !isValidCNPJ(client.docNumber)) {
      ctx.addIssue({ code: "custom", path: ["docNumber"], message: "CNPJ inválido" });
    }
  });
