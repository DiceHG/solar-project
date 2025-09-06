// controllers/equipment.controller.js
import mongoose from "mongoose";

import InverterModel from "../models/inverter.model.js";

export const getInverters = async (req, res, next) => {
  try {
    const inverters = await InverterModel.find()
      .select("-datasheetUrl -__v")
      .lean();
    res.status(200).json({ success: true, data: inverters });
  } catch (err) {
    console.error(`Error in getting inverters ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getInverterById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format" });
  }
  try {
    const inverter = await InverterModel.findById(id).lean();

    if (!inverter)
      return res
        .status(404)
        .json({ success: false, message: "Inverter not found" });

    res.status(200).json({ success: true, data: inverter });
  } catch (err) {
    console.error(`Error in getting inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createInverter = async (req, res, next) => {
  const payload = { ...req.validatedData };

  try {
    const newInverter = await InverterModel.create(payload);
    res.status(201).json({ success: true, data: newInverter });
  } catch (err) {
    console.error(`Error in creating inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateInverter = async (req, res, next) => {
  const { id } = req.params;
  const payload = { ...req.validatedData };

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const updatedInverter = await InverterModel.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true }
    ).lean();
    if (!updatedInverter) {
      return res
        .status(404)
        .json({ success: false, message: "Inverter not found" });
    }
    res.status(200).json({
      success: true,
      data: updatedInverter,
      message: "Inverter Updated Successfully",
    });
  } catch (err) {
    console.error(`Error in updating inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteInverter = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid ID format." });
  }

  try {
    const deletedInverter = await InverterModel.findByIdAndDelete(id).lean();
    if (!deletedInverter) {
      return res
        .status(404)
        .json({ success: false, message: "Inverter not found" });
    }
    res.status(200).json({ success: true, message: "Inverter deleted" });
  } catch (err) {
    console.error(`Error in deleting inverter ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
