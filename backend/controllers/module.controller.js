// controllers/equipment.controller.js
import mongoose from "mongoose";

import ModuleModel from "../models/module.model.js";

export const getModules = async (req, res, next) => {
  try {
    const modules = await ModuleModel.find()
      .select("-datasheetUrl -__v")
      .lean();
    res.status(200).json({ success: true, data: modules });
  } catch (err) {
    console.error(`Error in getting modules ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getModuleById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }

  try {
    const module = await ModuleModel.findById(id).lean();
    if (!module)
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    res.status(200).json({ success: true, data: module });
  } catch (err) {
    console.error(`Error in getting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createModule = async (req, res, next) => {
  const payload = { ...req.validatedData };

  try {
    const newModule = await ModuleModel.create(payload);
    res.status(201).json({ success: true, data: newModule });
  } catch (err) {
    console.error(`Error in creating module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateModule = async (req, res, next) => {
  const { id } = req.params;
  const module = { ...req.validatedData };

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const updatedModule = await ModuleModel.findByIdAndUpdate(id, module, {
      new: true,
    }).lean();
    if (!updatedModule) {
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedModule,
      message: "Module Updated Successfully",
    });
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
      return res
        .status(404)
        .json({ success: false, message: "Module not found" });
    }
    res.status(200).json({ success: true, message: "Module deleted" });
  } catch (err) {
    console.error(`Error in deleting module ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
