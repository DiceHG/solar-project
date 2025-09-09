// routes/client.route.js
import express from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/client.controller.js";
import { validate } from "../middleware/validate.js";
import { clientSchema } from "../schemas/client.schema.js";

const router = express.Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", validate(clientSchema), createClient);
router.put("/:id", validate(clientSchema), updateClient);
router.delete("/:id", deleteClient);

export default router;
