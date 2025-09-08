// routes/inverter.route.js
import express from "express";
import {
  createModule,
  deleteModule,
  getModuleById,
  getModules,
  updateModule,
} from "../controllers/module.controller.js";
import { validateModuleData } from "../validators/module.validator.js";

const router = express.Router();

router.get("/", getModules);
router.get("/:id", getModuleById);
router.post("/", validateModuleData, createModule);
router.put("/:id", validateModuleData, updateModule);
router.delete("/:id", deleteModule);

export default router;
