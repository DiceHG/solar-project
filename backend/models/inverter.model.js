// models/inverter.model.js
import mongoose, { Schema } from "mongoose";

const mpptSchema = new Schema(
  {
    startUpVoltage: { type: Number, required: true, min: 0 },
    maxVoltage: { type: Number, required: true, min: 0 },
    maxCurrent: { type: Number, required: true, min: 0 },
    numOfStrings: { type: Number, required: true, min: 1, default: 1 },
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
    inputPower: { type: Number, min: 0, required: true }, // kW (DC)
    mpptConfig: { type: [mpptSchema], required: true },

    // Output AC
    outputPower: { type: Number, required: true, min: 0 }, // kW (AC)
    outputVoltage: { type: Number, required: true, default: 220 }, // V (AC)
    outputCurrent: { type: Number, min: 0, required: true }, // A (AC)
    phaseType: {
      type: String,
      enum: ["single-phase", "three-phase"],
      required: true,
      default: "single-phase",
    },
    frequency: { type: Number, default: 60 }, // Hz
    efficiency: { type: Number, min: 0, max: 100 }, // %
  },
  {
    timestamps: true,
  }
);

const InverterModel = mongoose.models.Inverter || mongoose.model("Inverter", inverterSchema);

export default InverterModel;
