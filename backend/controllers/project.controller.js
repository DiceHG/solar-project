// controllers/project.controller.js
import mongoose from "mongoose";

import ProjectModel from "../models/project.model.js";

export const createProject = async (req, res, next) => {
  console.log(req.body);
  const { client, title } = req.body;

  try {
    const created = await ProjectModel.create({ title, client });
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(`Error in creating project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
