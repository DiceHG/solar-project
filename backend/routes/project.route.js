// routes/inverter.route.js
import express from "express";
import {
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { validate } from "../middleware/validate.js";
import { projectSchema } from "../schemas/project.schema.js";

const router = express.Router();

router.get("/:id", getProjectById);
router.post("/", validate(projectSchema), createProject);
router.put("/:id", validate(projectSchema), updateProject);
router.delete("/:id", deleteProject);

export default router;
