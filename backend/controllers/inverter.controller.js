// controllers/equipment.controller.js
import mongoose from "mongoose";

import InverterModel from "../models/inverter.model.js";

export const getInverters = async (req, res, next) => {
  try {
    const inverters = await InverterModel.find()
      .select("maker model price acNominalPower connectionType acNominalVoltage")
      .lean();
    if (inverters.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "Nenhum inversor encontrado" });
    }
    res.status(200).json({ success: true, data: inverters });
  } catch (err) {
    console.error(`Error in getting inverters ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getInverterById = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de inversor inválido" });
  }
  try {
    const inverter = await InverterModel.findById(id).lean();
    if (!inverter) return res.status(404).json({ success: false, message: "Inversor não encontrado" });
    res.status(200).json({ success: true, data: inverter });
  } catch (err) {
    console.error(`Error in getting inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createInverter = async (req, res, next) => {
  const payload = { ...req.validatedData };
  try {
    const inverterExist = await InverterModel.findOne({ maker: payload.maker, model: payload.model }).lean();
    if (inverterExist) {
      return res.status(409).json({ success: false, message: "Inversor já registrado" });
    }
    const newInverter = await InverterModel.create(payload);
    res.status(201).json({ success: true, data: newInverter });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Inversor já registrado" });
    }
    console.error(`Error in creating inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateInverter = async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.validatedData };
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de inversor inválido" });
  }
  try {
    const updatedInverter = await InverterModel.findByIdAndUpdate(id, payload, { new: true }).lean();
    if (!updatedInverter) {
      return res.status(404).json({ success: false, message: "Inversor não encontrado" });
    }
    res
      .status(200)
      .json({ success: true, data: updatedInverter, message: "Inversor Atualizado com Sucesso" });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ success: false, message: "Conflito: valores duplicados" });
    }
    console.error(`Error in updating inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteInverter = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "ID de inversor inválido" });
  }
  try {
    const deletedInverter = await InverterModel.findByIdAndDelete(id).lean();
    if (!deletedInverter) {
      return res.status(404).json({ success: false, message: "Inversor não encontrado" });
    }
    res.status(200).json({ success: true, message: "Inversor Excluído com Sucesso" });
  } catch (err) {
    console.error(`Error in deleting inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
