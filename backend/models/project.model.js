// models/project.model.js
import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, trim: true },
    client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;
