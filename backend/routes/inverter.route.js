// routes/inverter.route.js
import express from "express";
import {
  createInverter,
  deleteInverter,
  getInverterById,
  getInverters,
  updateInverter,
} from "../controllers/inverter.controller.js";
import { validate } from "../middleware/validate.js";
import { inverterSchema } from "../schemas/inverter.schema.js";

const router = express.Router();

router.get("/", getInverters);
router.get("/:id", getInverterById);
router.post("/", validate(inverterSchema), createInverter);
router.put("/:id", validate(inverterSchema), updateInverter);
router.delete("/:id", deleteInverter);

export default router;
