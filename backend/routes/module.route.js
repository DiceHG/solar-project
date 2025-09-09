// routes/inverter.route.js
import express from "express";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from "../controllers/module.controller.js";
import { validate } from "../middleware/validate.js";
import { moduleSchema } from "../schemas/module.schema.js";

const router = express.Router();

router.get("/", getModules);
router.get("/:id", getModuleById);
router.post("/", validate(moduleSchema), createModule);
router.put("/:id", validate(moduleSchema), updateModule);
router.delete("/:id", deleteModule);

export default router;
