// controllers/project.controller.js
import mongoose from "mongoose";

import ClientModel from "../models/client.model.js";
import ProjectModel from "../models/project.model.js";
import SiteModel from "../models/site.model.js";

// GET /api/projects/:id
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "IDs inválidos" });
  }
  try {
    const project = await ProjectModel.findById(id)
      .populate({
        path: "projects",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
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
  try {
    const client = await ClientModel.findById(payload.client).lean();
    if (!client) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    }
    const newProject = await ProjectModel.create(payload);
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    console.error(`Error in creating project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.validatedData };
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de projeto inválido" });
  }
  try {
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updatedProject) {
      return res.status(404).json({ success: false, message: "Projeto não encontrado" });
    }
    res.status(200).json({ success: true, data: updatedProject, message: "Projeto Atualizado com Sucesso" });
  } catch (err) {
    console.error(`Error in updating project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de projeto inválido" });
  }

  const sess = await mongoose.startSession();
  let deleted = { sites: 0 };

  try {
    await sess.withTransaction(async () => {
      // 1) Checks if project exists
      const project = await ProjectModel.findById({ _id: id }).session(sess);
      if (!project) throw new Error("Projeto não encontrado");

      // 2) Grab sites IDs
      const sites = await SiteModel.find({ project: id }, { _id: 1 }).session(sess).lean();
      const siteIds = sites.map((s) => s._id);

      // 3) Delete the sites
      const deletedSites = await SiteModel.deleteMany({ _id: { $in: siteIds } }).session(sess);
      deleted.sites = deletedSites.deletedCount ?? 0;

      // 4) Finally delete the project
      await ProjectModel.findByIdAndDelete(id).session(sess);
    });

    return res.status(200).json({
      success: true,
      message: `Projeto Excluído com Sucesso, ${deleted.sites} locais deletados.`,
    });
  } catch (err) {
    if (err.message === "Projeto não encontrado") {
      return res.status(404).json({ success: false, message: "Projeto não encontrado" });
    }
    console.error("Error deleting project:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    await sess.endSession();
  }
};
