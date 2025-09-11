// controllers/project.controller.js
import mongoose from "mongoose";

import ProjectModel from "../models/project.model.js";
import ClientModel from "../models/client.model.js";

export const getProjectById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(clientId) || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "IDs inválidos" });
  }
  try {
    const project = await ProjectModel.findOne({ _id: id, client: clientId }).lean();
    if (!project) return res.status(404).json({ success: false, message: "Projeto não encontrado" });
    return res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(`Error in getting project ${err}`);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST /api/projects/
export const createProject = async (req, res) => {
  const payload = req.validatedData;
  if (!mongoose.isValidObjectId(payload.client)) {
    return res.status(400).json({ success: false, message: "ID de cliente inválido" });
  }
  const sess = await mongoose.startSession();
  let newProject;
  try {
    await sess.withTransaction(async () => {
      const exists = await ClientModel.exists({ _id: payload.client }).session(sess);
      if (!exists) throw new Error("Cliente não encontrado");

      const project = new ProjectModel({ ...payload, client: payload.client });
      newProject = await project.save({ session: sess });

      await ClientModel.findByIdAndUpdate(
        payload.client,
        { $push: { projects: newProject._id } },
        { session: sess }
      );
    });
    return res.status(201).json({
      success: true,
      data: newProject.toObject ? newProject.toObject() : newProject,
      message: "Projeto criado e adicionado ao cliente",
    });
  } catch (err) {
    if (err.message === "Cliente não encontrado") {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    }
    console.error("Error creating project:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    await sess.endSession();
  }
};
