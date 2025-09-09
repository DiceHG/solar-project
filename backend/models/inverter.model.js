// models/inverter.model.js
import mongoose, { Schema } from "mongoose";

const mpptSchema = new Schema(
  {
    dcMaxCurrent: { type: Number, required: true, min: 0 }, // A (per MPPT)
    scCurrent: { type: Number, min: 0 }, // A (per MPPT)
    pvStringCount: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const inverterSchema = new Schema(
  {
    // Basic Information
    maker: { type: String, required: true, trim: true },
    model: { type: String, required: true, trim: true },
    inmetro: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    // datasheetUrl: { type: String, trim: true },
    // image: { type: String, trim: true },

    // Input DC
    dcMaxPower: { type: Number, required: true, min: 0 }, // W (DC)
    dcNominalVoltage: { type: Number, min: 0 }, // V (DC)
    dcVoltage: {
      min: { type: Number, required: true, min: 0 }, // V (DC)
      max: { type: Number, required: true, min: 0 }, // V (DC)
    },
    startUpVoltage: { type: Number, required: true, min: 0 }, // V (DC)
    mpptConfig: { type: [mpptSchema], required: true },

    // Output AC
    acNominalPower: { type: Number, required: true, min: 0 }, // W (AC)
    acNominalVoltage: { type: Number, required: true, default: 220 }, // V (AC)
    acMaxCurrent: { type: Number, min: 0, required: true }, // A (AC)
    frequency: { type: Number, default: 60 }, // Hz
    thd: { type: Number, default: 3 }, // %
    powerFactor: {
      i: { type: Number, default: 0.8 }, // Inductive
      c: { type: Number, default: 0.8 }, // Capacitive
    },
    connectionType: { type: String, enum: ["single-phase", "three-phase"], default: "single-phase" },

    // Efficiency
    efficiency: {
      max: { type: Number, min: 0, max: 100 }, // %
      european: { type: Number, min: 0, max: 100 }, // %
    },

    // Mechanical Specifications
    dimensions: {
      width: { type: Number }, // m
      length: { type: Number }, // m
      depth: { type: Number }, // m
    },
    weight: { type: Number, min: 0 },
    protection: { type: String, trim: true },
    connectors: {
      dc: { type: String, default: "MC4" },
      ac: { type: String, default: "Plug and Play" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

inverterSchema.index({ maker: 1, model: 1 }, { unique: true });

const InverterModel = mongoose.models.Inverter || mongoose.model("Inverter", inverterSchema);

export default InverterModel;
