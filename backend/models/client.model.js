// models/client.model.js
import mongoose, { Schema } from "mongoose";

const clientSchema = new Schema(
  {
    clientType: {
      type: String,
      enum: ["individual", "company"],
      default: "individual",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    docNumber: {
      type: String,
      required: true,
      trim: true,
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    dateOfBirth: { type: Date, alias: "creationDate", trim: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    toObject: { virtuals: true },
  }
);

const ClientModel =
  mongoose.models.Client || mongoose.model("Client", clientSchema);

export default ClientModel;
