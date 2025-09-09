// controllers/equipment.controller.js
import mongoose from "mongoose";

import ModuleModel from "../models/module.model.js";

export const getModules = async (req, res, next) => {
  try {
    const modules = await ModuleModel.find().select("maker model price dimensions").lean();
    if (modules.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "Nenhum módulo encontrado" });
    }
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    console.error(`Error in getting modules ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getModuleById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de módulo inválido" });
  }
  try {
    const module = await ModuleModel.findById(id).lean();
    if (!module) return res.status(404).json({ success: false, message: "Módulo não encontrado" });
    res.status(200).json({ success: true, data: module });
  } catch (err) {
    console.error(`Error in getting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createModule = async (req, res, next) => {
  const payload = { ...req.validatedData };
  try {
    const moduleExist = await ModuleModel.findOne({ maker: payload.maker, model: payload.model }).lean();
    if (moduleExist) {
      return res.status(409).json({ success: false, message: "Módulo já registrado" });
    }
    const newModule = await ModuleModel.create(payload);
    res.status(201).json({ success: true, data: newModule });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Módulo já registrado" });
    }
    console.error(`Error in creating module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateModule = async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.validatedData };
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de módulo inválido" });
  }
  try {
    const updatedModule = await ModuleModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updatedModule) {
      return res.status(404).json({ success: false, message: "Módulo não encontrado" });
    }
    res.status(200).json({ success: true, data: updatedModule, message: "Módulo Atualizado com Sucesso" });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Conflito: valores duplicados" });
    }
    console.error(`Error in updating module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteModule = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de módulo inválido" });
  }
  try {
    const deletedModule = await ModuleModel.findByIdAndDelete(id).lean();
    if (!deletedModule) {
      return res.status(404).json({ success: false, message: "Módulo não encontrado" });
    }
    res.status(200).json({ success: true, message: "Módulo Excluído com Sucesso" });
  } catch (err) {
    console.error(`Error in deleting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
