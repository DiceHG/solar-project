// routes/inverter.route.js
import express from "express"
import { createModule, deleteModule, getModuleById, getModules, updateModule } from "../controllers/module.controller.js";

const router = express.Router();

router.get("/", getModules)
router.get("/:id", getModuleById)
router.post("/", createModule)
router.put("/:id", updateModule)
router.delete("/:id", deleteModule)

export default router;