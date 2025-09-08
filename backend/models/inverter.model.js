// models/inverter.model.js
import mongoose, { Schema } from "mongoose";

const mpptSchema = new Schema(
  {
    maxInputCurrent: { type: Number, required: true, min: 0 },
    stringCount: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: false }
);

const inverterSchema = new Schema(
  {
    // Identity
    maker: { type: String, required: true },
    model: { type: String, required: true },
    inmetro: { type: String, required: true },
    datasheetUrl: { type: String },

    // Input DC
    maxInputPower: { type: Number, min: 0, required: true }, // kW (DC)
    startUpVoltage: { type: Number, required: true },
    inputVoltage: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    mpptConfig: { type: [mpptSchema], required: true },

    // Output AC
    maxOutputPower: { type: Number, required: true, min: 0 }, // kW (AC)
    nominalVoltage: { type: Number, required: true, default: 220 }, // V (AC)
    maxOutputCurrent: { type: Number, min: 0, required: true }, // A (AC)
    phaseType: {
      type: String,
      enum: ["single-phase", "three-phase"],
      default: "single-phase",
    },
    frequency: { type: Number, default: 60 }, // Hz
    efficiency: { type: Number, min: 0, max: 100 }, // %
  },
  {
    timestamps: true,
  }
);

const InverterModel =
  mongoose.models.Inverter || mongoose.model("Inverter", inverterSchema);

export default InverterModel;
