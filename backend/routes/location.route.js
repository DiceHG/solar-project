// routes/location.route.js
import express from "express"
import { createLocation, deleteLocation, updateLocation } from "../controllers/location.controller.js";

const router = express.Router();

router.post("/:projectId", createLocation);
router.put("/:id", updateLocation)
router.delete("/:id", deleteLocation)

export default router;