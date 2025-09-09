// models/project.model.js
import mongoose, { Schema } from "mongoose";

// --- Project ---
const projectSchema = new Schema(
  {
    title: { type: String },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  },
  {
    timestamps: true,
  }
);

const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;
