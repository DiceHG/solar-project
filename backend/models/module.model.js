// models/module.model.js
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
  {
    // Basic Information
    maker: { type: String, required: true },
    model: { type: String, required: true },
    inmetro: { type: String, required: true },
    warrantPeriod: { type: Number },
    price: { type: Number, required: true, min: 0 },
    datasheetUrl: { type: String },

    // Mechanical Specifications
    dimensions: {
      width: { type: Number }, // m
      length: { type: Number }, // m
      depth: { type: Number }, // m
    },
    weight: { type: Number }, // kg
    cellType: { type: String },
    numOfCells: { type: Number },
    frame: { type: String },
    junctionBox: { type: String },
    cable: { type: String },
    connector: { type: String },

    // Electrical Specifications
    maxPower: { type: Number, required: true }, // Pmax (kW)
    maxPowerVoltage: { type: Number, required: true }, // Vmp (V)
    maxPowerCurrent: { type: Number, required: true }, // Imp (A)
    ocVoltage: { type: Number }, // Voc (V)
    scCurrent: { type: Number }, // Isc (A)
    efficiency: { type: Number, min: 0, max: 1 }, // %
    maxSystemVoltage: { type: Number }, // VDC (V)
    maxSeriesFuse: { type: Number }, // (A)
  },
  {
    timestamps: true,
  }
);

const ModuleModel = mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default ModuleModel;
