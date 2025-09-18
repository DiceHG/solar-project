// controllers/site.controller.js
import mongoose from "mongoose";

import SiteModel from "../models/site.model.js";

// POST /api/sites
export const createSite = async (req, res, next) => {
  const payload = { ...req.validatedData };
  try {
    const newSite = await SiteModel.create(payload);
    res.status(201).json({ success: true, data: newSite, message: "Local Criado com Sucesso" });
  } catch (err) {
    console.error(`Error in creating location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// PUT /api/sites/:id
export const updateSite = async (req, res, next) => {
  const { id } = req.params;
  const payload = req.validatedData;
  try {
    const updatedSite = await SiteModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updatedSite) {
      return res.status(404).json({ success: false, message: "Local não encontrado" });
    }
    res.status(200).json({ success: true, data: updatedSite, message: "Local Atualizado com Sucesso" });
  } catch (err) {
    console.error(`Error in updating location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// DELETE /api/sites/:id
export const deleteSite = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSite = await SiteModel.findByIdAndDelete(id).lean();
    if (!deletedSite) {
      return res.status(404).json({ success: false, message: "Local não encontrado" });
    }
    res.status(200).json({ success: true, message: "Local excluído com sucesso" });
  } catch (err) {
    console.error(`Error in deleting location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
