// models/inverter.model.js
import mongoose, { Schema } from "mongoose";

const mpptSchema = new Schema(
  {
    dcMaxCurrent: { type: Number }, // A
    scCurrent: { type: Number }, // A
    pvStringCount: { type: Number }, // per MPPT
  },
  { _id: false }
);

const inverterSchema = new Schema(
  {
    // Basic Information
    maker: { type: String }, // manufacturer
    model: { type: String }, // model name/number
    inmetro: { type: String }, // certification number
    price: { type: Number }, // R$
    // datasheetUrl: { type: String },
    // image: { type: String },

    // Input DC
    dcMaxPower: { type: Number }, // W
    dcNominalVoltage: { type: Number }, // V
    dcVoltage: {
      min: { type: Number }, // V
      max: { type: Number }, // V
    },
    startUpVoltage: { type: Number }, // V
    mpptConfig: { type: [mpptSchema] },

    // Output AC
    acNominalPower: { type: Number }, // W
    acNominalVoltage: { type: Number }, // V
    acMaxCurrent: { type: Number }, // A
    frequency: { type: Number }, // Hz
    thd: { type: Number }, // %
    powerFactor: {
      i: { type: Number }, // Inductive
      c: { type: Number }, // Capacitive
    },
    connectionType: { type: String }, // single-phase, three-phase

    // Efficiency
    efficiency: {
      max: { type: Number }, // %
      european: { type: Number }, // %
    },

    // Mechanical Specifications
    dimensions: {
      width: { type: Number }, // m
      length: { type: Number }, // m
      depth: { type: Number }, // m
    },
    weight: { type: Number }, // kg
    protection: { type: String }, // e.g., IP65
    connectors: {
      dc: { type: String }, // e.g., MC4
      ac: { type: String }, // e.g., Plug and Play
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

inverterSchema.index({ maker: 1, model: 1 }, { unique: true });

const InverterModel = mongoose.models.Inverter || mongoose.model("Inverter", inverterSchema);

export default InverterModel;
