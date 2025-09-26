import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(1, "Título obrigatório"),
  client: z.string().trim(),
  status: z.enum(["draft", "in-progress", "completed", "cancelled"]).default("draft"),
});
