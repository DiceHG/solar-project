// routes/inverter.route.js
import express from "express"
import { createInverter, deleteInverter, getInverterById, getInverters, updateInverter } from "../controllers/inverter.controller.js";
import { validateInverterData } from "../validators/inverter.validator.js";

const router = express.Router();

router.get("/", getInverters)
router.get("/:id", getInverterById)
router.post("/", validateInverterData, createInverter)
router.put("/:id", validateInverterData, updateInverter)
router.delete("/:id", deleteInverter)

export default router;