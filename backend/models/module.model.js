// models/module.model.js
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
  {
    // Basic identification
    maker: { type: String, required: true },
    model: { type: String, required: true },
    inmetro: { type: String, required: true },
    datasheetUrl: { type: String },

    // Physical dimensions (m)
    width: { type: Number, required: true, min: 0 },  // m
    length: { type: Number, required: true, min: 0 },  // m

    // Electrical output at STC
    maxPower: { type: Number, required: true, min: 0 }, // Pmax (kW)
    maxVoltage: { type: Number, required: true, min: 0 }, // Vmp (V)
    maxCurrent: { type: Number, required: true, min: 0 }, // Imp (A)
  },
  {
    timestamps: true,
  },
);

const ModuleModel = mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default ModuleModel;
