// controllers/module.controller.js
import mongoose from "mongoose"

import ModuleModel from "../models/module.model.js";

const ALLOWED_FIELDS = ["maker", "model", "inmetro", "datasheetUrl", "width", "length", "maxPower", "maxVoltage", "maxCurrent", "maxSystemVoltage", "maxSeriesFuse"];

export const pick = (obj, allowedFields) => {
  const filtered = {};
  for (const field of allowedFields) {
    if (obj[field] !== undefined) {
      filtered[field] = obj[field];
    }
  }
  return filtered;
};

export const getModules = async (req, res, next) => {
  try {
    const modules = await ModuleModel.find({}).lean();
    if (modules.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No modules found." });
    }
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    console.error(`Error in getting modules ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getModuleById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const module = await ModuleModel.findById(id).lean();
    if (!module) return res.status(404).json({ success: false, message: "module not found." });
    res.status(200).json({ success: true, data: module });
  } catch (err) {
    console.error(`Error in getting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createModule = async (req, res, next) => {
  const newModule = pick(req.body, ALLOWED_FIELDS);

  try {
    const created = await ModuleModel.create(newModule);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(`Error in creating module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const updateModule = async (req, res, next) => {
  const { id } = req.params;
  const module = pick(req.body, ALLOWED_FIELDS);

  try {
    const updatedModule = await ModuleModel.findByIdAndUpdate(id, module, { new: true }).lean();
    if (!updatedModule) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }
    res.status(200).json({ success: true, data: updatedModule, message: "Module Updated Successfully" });
  } catch (err) {
    console.error(`Error in updating module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteModule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedModule = await ModuleModel.findByIdAndDelete(id).lean();
    if (!deletedModule) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }
    res.status(200).json({ success: true, message: "Module deleted" });
  } catch (err) {
    console.error(`Error in deleting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};