// models/site.model.js
import mongoose, { Schema } from "mongoose";

const siteSchema = new Schema(
  {
    // Link to the project
    project: { type: Schema.Types.ObjectId, ref: "Project" }, // project ID

    // Site name or identifier
    name: { type: String },

    // Address
    address: {
      cep: { type: String },
      state: { type: String },
      city: { type: String },
      district: { type: String },
      street: { type: String },
      number: { type: String },
      complement: { type: String },
    },

    // Electrical info
    utilityCompany: { type: String },
    uc: { type: String }, // utility company code
    accountHolder: { type: String },
    serviceType: {
      class: { type: String }, // residential, commercial, industrial
      connection: { type: String }, // single-phase, two-phase, three-phase
      voltage: { type: Number }, // V
      circuitBreaker: { type: Number }, // A
    },

    // Geographic coordinates
    coords: {
      lat: { type: Number }, // latitude
      lng: { type: Number }, // longitude
    },

    // Energy consumption
    consumption: { type: [Number] }, // kW monthly
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

siteSchema.virtual("consumptionAvg").get(function () {
  const arr = this.consumption || [];
  if (!arr.length) return 0;
  const sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
});

siteSchema.virtual("consumptionSum").get(function () {
  const arr = this.consumption || [];
  return arr.reduce((a, b) => a + b, 0);
});

const SiteModel = mongoose.models.Site || mongoose.model("Site", siteSchema);

export default SiteModel;
