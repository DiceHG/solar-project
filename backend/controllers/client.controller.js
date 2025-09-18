// controllers/client.controller.js
import mongoose from "mongoose";

import ClientModel from "../models/client.model.js";
import ProjectModel from "../models/project.model.js";
import SiteModel from "../models/site.model.js";

// GET /api/clients
export const getClients = async (req, res, next) => {
  try {
    const clients = await ClientModel.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    console.error(`Error in getting clients ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// GET api/clients/:id
export const getClientById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de cliente inválido" });
  }
  try {
    const client = await ClientModel.findById(id)
      .populate({
        path: "projects",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "sites",
          options: { sort: { createdAt: -1 } },
        },
      })
      .lean();
    if (!client) return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    console.error(`Error in getting client by id ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST api/clients
export const createClient = async (req, res, next) => {
  const payload = { ...req.validatedData };
  try {
    const newClient = await ClientModel.create(payload);
    res.status(201).json({ success: true, data: newClient });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Cliente já registrado" });
    }
    console.error(`Error in creating client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT api/clients/:id
export const updateClient = async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.validatedData };
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de cliente inválido" });
  }
  try {
    const updatedClient = await ClientModel.findOneAndReplace({ _id: id }, payload, {
      new: true,
    }).lean();
    if (!updatedClient) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    }
    res.status(200).json({ success: true, data: updatedClient });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Conflito: Valores Duplicados" });
    }
    console.error(`Error in updating client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE api/clients/:id
export const deleteClient = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de cliente inválido" });
  }

  const sess = await mongoose.startSession();
  let deleted = { projects: 0, sites: 0 };

  try {
    await sess.withTransaction(async () => {
      // 1) Check if client exists
      const client = await ClientModel.findById({ _id: id }).session(sess);
      if (!client) throw new Error("Cliente não encontrado");

      // 2) Grab project IDs
      const projects = await ProjectModel.find({ client: id }, { _id: 1 }).session(sess).lean();
      const projectIds = projects.map((p) => p._id);

      // 3) Delete sites that belong to those projects
      if (projectIds.length) {
        const deletedSites = await SiteModel.deleteMany({ project: { $in: projectIds } }).session(sess);
        deleted.sites = deletedSites.deletedCount ?? 0;
      }

      // 4) Delete the projects
      const deletedProjects = await ProjectModel.deleteMany({ client: id }).session(sess);
      deleted.projects = deletedProjects.deletedCount ?? 0;

      // 5) Finally delete the client
      await ClientModel.findByIdAndDelete(id).session(sess);
    });

    return res.status(200).json({
      success: true,
      message: `Cliente Excluído com Sucesso, ${deleted.projects} projetos e ${deleted.sites} locais deletados.`,
    });
  } catch (err) {
    if (err.message === "Cliente não encontrado") {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    }
    console.error("Error deleting client:", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    await sess.endSession();
  }
};
