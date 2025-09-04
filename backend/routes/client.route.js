// routes/client.route.js
import express from "express";
import {
  createClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/client.controller.js";
import { validateClientData } from "../validators/client.validator.js";

const router = express.Router();

router.get("/", getClients);
router.get("/:id", getClientById);
router.post("/", validateClientData, createClient);
router.put("/:id", validateClientData, updateClient);
router.delete("/:id", deleteClient);

export default router;
