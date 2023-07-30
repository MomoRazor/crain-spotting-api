import mongoose, { Schema } from "mongoose";

const { String, Boolean, Number } = Schema.Types;

export const baseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    createdTimestamp: { type: Schema.Types.Date },
    createdBy: { type: String },
    updatedTimestamp: { type: Schema.Types.Date },
    updatedBy: { type: String },
    softDeletedTimestamp: { type: Schema.Types.Date },
    softDeletedBy: { type: String },
    softDeleted: { type: Boolean, default: false },
    permanentDeletedTimestamp: { type: Schema.Types.Date },
    permanentDeletedBy: { type: String },
    permanentDeleted: { type: Boolean, default: false },
    restoredTimestamp: { type: Schema.Types.Date },
    restoredBy: { type: String },
    version: { type: Number, required: true, default: 0 },
  },
  { strict: true }
);

export * from "./UserRepo";
export * from "./MailRepo";
