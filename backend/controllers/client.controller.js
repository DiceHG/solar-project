// controllers/client.controller.js
import mongoose from "mongoose";

import ClientModel from "../models/client.model.js";
import ProjectModel from "../models/project.model.js";
// import LocationModel from "../models/location.model.js";

// GET /api/clients
export const getClients = async (req, res, next) => {
  try {
    const clients = await ClientModel.find()
      .select("_id name phoneNumber email createdAt")
      .sort({ createdAt: -1 })
      .lean();
    if (clients.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "Nenhum cliente encontrado" });
    }
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
    const client = await ClientModel.findById(id).lean();
    if (!client) return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    console.error(`Error in getting client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// POST api/clients
export const createClient = async (req, res, next) => {
  const payload = { ...req.validatedData };
  try {
    const clientExist = await ClientModel.findOne({ docNumber: payload.docNumber }).lean();
    if (clientExist) {
      return res.status(409).json({ success: false, message: "Cliente já registrado" });
    }
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
    const updatedClient = await ClientModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updatedClient) {
      return res.status(404).json({ success: false, message: "Cliente não encontrado" });
    }
    res.status(200).json({ success: true, data: updatedClient, message: "Cliente Atualizado com Sucesso" });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Conflito: valores duplicados" });
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
  let deleted = { projects: 0, locations: 0 };

  try {
    await sess.withTransaction(async () => {
      // 1) Delete the client and capture its projects
      const deletedClient = await ClientModel.findByIdAndDelete(id).session(sess).lean();

      if (!deletedClient) throw new Error("Cliente não encontrado");

      // 2) Grab project IDs
      const projectIds = deletedClient.projects;

      if (projectIds.length) {
        // 3) Delete projects
        const projRes = await ProjectModel.deleteMany({ _id: { $in: projectIds } }).session(sess);
        deleted.projects = projRes.deletedCount ?? 0;

        // 4) Delete
        // const locRes = await LocationModel.deleteMany({ project: { $in: projectIds } }).session(session);
        // deleted.locations = locRes.deletedCount ?? 0;
      }
    });

    return res.status(200).json({
      success: true,
      message: "Cliente Excluído com Sucesso",
      deleted,
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
