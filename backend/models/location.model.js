// models/location.model.js
import mongoose, { Schema } from "mongoose";

const locationSchema = new Schema(
  {
    // Link to the project
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },

    // Address
    address: {
      cep: { type: String, required: true },
      state: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      street: { type: String, required: true },
      number: { type: String, required: true },
      complement: { type: String },
    },

    // Electrical info
    utilityCompany: { type: String, required: true },
    uc: { type: String, required: true },
    accountHolder: { type: String, required: true },
    connectionType: {
      type: String,
      enum: ["monophasic", "biphasic", "triphasic"],
      required: true,
    },
    serviceVoltage: { type: Number, required: true },
    circuitBreaker: { type: Number, required: true },

    // Geographic coordinates
    coords: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },

    // Energy consumption
    consumption: {
      average: { type: Number },
      monthly: { type: [Number] },
    },

    // Site photos or documents
    sitePhotos: { type: [String] },
  },
  {
    timestamps: true,
  }
);

const LocationModel = mongoose.models.Location || mongoose.model("Location", locationSchema);

export default LocationModel;
