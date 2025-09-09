// src/models/client.model.js
import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
  {
    entityType: { type: String, enum: ["individual", "company"], required: true, default: "individual" },
    name: { type: String, required: true, trim: true, minlength: 1 },
    docNumber: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true },
    originDate: { type: Date },
    projects: { type: [{ type: Schema.Types.ObjectId, ref: "Project" }], default: [] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ClientModel = mongoose.models.Client || mongoose.model("Client", clientSchema);

export default ClientModel;
