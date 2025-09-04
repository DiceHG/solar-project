// controllers/client.controller.js
import mongoose from "mongoose";

import ClientModel from "../models/client.model.js";

// Get all clients data
// GET api/clients
export const getClients = async (req, res, next) => {
  try {
    const clients = await ClientModel.find({}).lean();
    if (clients.length === 0) {
      return res
        .status(200)
        .json({ success: true, data: [], message: "No clients found." });
    }
    res.status(200).json({ success: true, data: clients });
  } catch (err) {
    console.error(`Error in getting clients ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get client data by ID
// GET api/clients/:id
export const getClientById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const client = await ClientModel.findById(id).lean();
    if (!client)
      return res
        .status(404)
        .json({ success: false, message: "Client not found." });
    res.status(200).json({ success: true, data: client });
  } catch (err) {
    console.error(`Error in getting client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Creates a new client
// POST api/clients
export const createClient = async (req, res, next) => {
  const payload = { ...req.validatedData, projects: [] };

  try {
    if (payload.docNumber) {
      const existing = await ClientModel.findOne({
        docNumber: payload.docNumber,
      }).lean();
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Client already registered." });
      }
    }
    const newClient = await ClientModel.create(payload);
    res.status(201).json({ success: true, data: newClient });
  } catch (err) {
    console.error(`Error in creating client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Updates an existing client
// PUT api/clients/:id
export const updateClient = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.validatedData;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const updatedClient = await ClientModel.findByIdAndUpdate(
      id,
      { $set: payload },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    ).lean();
    if (!updatedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedClient,
      message: "Client Updated Successfully",
    });
  } catch (err) {
    console.error(`Error in updating client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Deletes a client
// DELETE api/clients/:id
export const deleteClient = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const deletedClient = await ClientModel.findByIdAndDelete(id).lean();
    if (!deletedClient) {
      return res
        .status(404)
        .json({ success: false, message: "Client not found" });
    }
    res.status(200).json({ success: true, message: "Client deleted" });
  } catch (err) {
    console.error(`Error in deleting client ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
