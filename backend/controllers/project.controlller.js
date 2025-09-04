// controllers/project.controller.js
import mongoose from "mongoose"

import ProjectModel from "../models/project.model.js";

const ALLOWED_FIELDS = ["title", "locations", "solarkit"];

export const pick = (obj, allowedFields) => {
  const filtered = {};
  for (const field of allowedFields) {
    if (obj[field] !== undefined) {
      filtered[field] = obj[field];
    }
  }
  return filtered;
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await ProjectModel.find({}).lean();
    if (projects.length === 0) {
      return res.status(200).json({ success: true, data: [], message: "No projects found." });
    }
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    console.error(`Error in getting projects ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getProjectById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await ProjectModel.findById(id).lean();
    if (!project) return res.status(404).json({ success: false, message: "Project not found." });
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    console.error(`Error in getting project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProject = async (req, res, next) => {
  const { clientId } = req.params
  const newProject = pick(req.body, ALLOWED_FIELDS);
  newProject.locations = []

  try {
    const created = await ProjectModel.create(newProject);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    console.error(`Error in creating project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


export const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const project = pick(req.body, ALLOWED_FIELDS);

  try {
    const updatedProject = await ProjectModel.findByIdAndUpdate(id, project, { new: true }).lean();
    if (!updatedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, data: updatedProject, message: "Project Updated Successfully" });
  } catch (err) {
    console.error(`Error in updating project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProject = await ProjectModel.findByIdAndDelete(id).lean();
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error(`Error in deleting project ${err}`);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};