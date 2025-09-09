// models/module.model.js
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
  {
    // Basic Information
    maker: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    inmetro: { type: String, required: true, trim: true },
    warrantyYears: { type: Number },
    price: { type: Number, required: true, min: 0 },
    // datasheetUrl: { type: String, trim: true },
    // image: { type: String, trim: true },

    // Mechanical Specifications
    dimensions: {
      width: { type: Number }, // m
      length: { type: Number }, // m
      depth: { type: Number }, // m
    },
    weight: { type: Number }, // kg
    cellType: { type: String, trim: true },
    numOfCells: { type: Number },
    frame: { type: String, trim: true },
    junctionBox: { type: String, trim: true },
    cable: { type: String, trim: true },
    connector: { type: String, trim: true },

    // Electrical Specifications
    maxPower: { type: Number, required: true, min: 0 }, // Pmax (W)
    maxPowerVoltage: { type: Number, required: true, min: 0 }, // Vmp (V)
    maxPowerCurrent: { type: Number, required: true, min: 0 }, // Imp (A)
    ocVoltage: { type: Number, min: 0 }, // Voc (V)
    scCurrent: { type: Number, min: 0 }, // Isc (A)
    efficiency: { type: Number, min: 0, max: 100 }, // %
    maxSystemVoltage: { type: Number, min: 0 }, // VDC (V)
    maxSeriesFuse: { type: Number, min: 0 }, // (A)
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

moduleSchema.index({ maker: 1, model: 1 }, { unique: true });

const ModuleModel = mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default ModuleModel;
