// models/project.model.js
import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    // Link to the client
    client: { type: Schema.Types.ObjectId, ref: "Client" }, // client ID

    // Project details
    title: { type: String }, // project title
    status: { type: String }, // draft, in progress, completed, canceled
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

projectSchema.virtual("sites", {
  ref: "Site",
  localField: "_id",
  foreignField: "project",
  options: { sort: { createdAt: -1 } },
});

const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);

export default ProjectModel;
