// models/project.model.js
import mongoose, { Schema } from 'mongoose';

// --- Subdocs ---
const projectLocationSchema = new Schema(
  {
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

const arraySchema = new Schema(
  {
    mpptIndex: { type: Number, min: 0 },
    arrayIndex: { type: Number, min: 0},
    module: { type: Schema.Types.ObjectId, ref: 'Module' },
    quantity: { type: Number, min: 0 },
  },
  { _id: false }
);

const kitSchema = new Schema(
  {
    inverter:   { type: Schema.Types.ObjectId, ref: 'Inverter' },
    arraySetup: { type: [arraySchema] }
  },
  { _id: false }
);

// --- Project ---
const projectSchema = new Schema(
  {
    title: { type: String },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    locations: { type: [projectLocationSchema] },
    solarKit: { type: [kitSchema] },
  },
  {
    timestamps: true,
  }
);

const ProjectModel = mongoose.models.Project || mongoose.model('Project', projectSchema);

export default ProjectModel