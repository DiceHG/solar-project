// src/models/client.model.js
import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
  {
    entityType: { type: String }, // individual, company
    name: { type: String }, // full name or company name
    docNumber: { type: String }, // CPF or CNPJ
    email: { type: String },
    phoneNumber: { type: String }, // DDD + number
    originDate: { type: Date }, // birth date or foundation date
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clientSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "client",
  options: { sort: { createdAt: -1 } },
});

clientSchema.index({ docNumber: 1 }, { unique: true });

const ClientModel = mongoose.models.Client || mongoose.model("Client", clientSchema);

export default ClientModel;
