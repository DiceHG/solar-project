// models/module.model.js
import mongoose, { Schema } from "mongoose";

const moduleSchema = new Schema(
  {
    // Basic Information
    maker: { type: String }, // manufacturer
    model: { type: String }, // model name/number
    inmetro: { type: String }, // certification number
    warrantyYears: { type: Number }, // years
    price: { type: Number }, // R$
    // datasheetUrl: { type: String },
    // image: { type: String },

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
    maxPower: { type: Number }, // Pmax (W)
    maxPowerVoltage: { type: Number }, // Vmp (V)
    maxPowerCurrent: { type: Number }, // Imp (A)
    ocVoltage: { type: Number }, // Voc (V)
    scCurrent: { type: Number }, // Isc (A)
    efficiency: { type: Number }, // %
    maxSystemVoltage: { type: Number }, // VDC (V)
    maxSeriesFuse: { type: Number }, // (A)
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

moduleSchema.index({ maker: 1, model: 1 }, { unique: true });

const ModuleModel = mongoose.models.Module || mongoose.model("Module", moduleSchema);

export default ModuleModel;
