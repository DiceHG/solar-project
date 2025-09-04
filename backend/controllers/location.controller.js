// controllers/location.controller.js
import mongoose from "mongoose"

import LocationModel from "../models/location.model.js";

export const createLocation = async (req, res, next) => {
  const { projectId } = req.params;
  const newLocation = {...req.validatedData, project: projectId, sitePhotos: []};

  try {
    const created = await LocationModel.create(newLocation);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(`Error in creating location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateLocation = async (req, res, next) => {
  const { id } = req.params;
  const location = req.validatedData;

  try {
    const updatedLocation = await LocationModel.findByIdAndUpdate(id, location, { new: true }).lean();
    if (!updatedLocation) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.status(200).json({ success: true, data: updatedLocation, message: "Location Updated Successfully" });
  } catch (err) {
    console.error(`Error in updating location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLocation = await LocationModel.findByIdAndDelete(id).lean();
    if (!deletedLocation) {
      return res.status(404).json({ success: false, message: "Location not found" });
    }
    res.status(200).json({ success: true, message: "Location deleted" });
  } catch (err) {
    console.error(`Error in deleting location ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};