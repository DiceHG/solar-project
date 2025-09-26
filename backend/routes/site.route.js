// routes/location.route.js
import express from "express";
import { getSiteById, createSite, deleteSite, updateSite } from "../controllers/site.controller.js";
import { validate } from "../middleware/validate.js";
import { siteSchema } from "../schemas/site.schema.js";

const router = express.Router();

router.get("/:id", getSiteById);
router.post("/", validate(siteSchema), createSite);
router.put("/:id", validate(siteSchema), updateSite);
router.delete("/:id", deleteSite);

export default router;
