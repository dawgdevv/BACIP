import Moongose from "mongoose";
import mongoose from "mongoose";

const DegreeSchema = new mongoose.Schema({
  degreeId: {
    type: String,
    required: true,
    unique: true,
  },
  recipientAddress: {
    type: String,
    required: true,
    index: true,
  },
  degreeName: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentId: {
    type: String,
  },
  studentEmail: {
    type: String,
  },
  transactionHash: {
    type: String,
    required: true,
  },
  issuedAt: {
    type: Date,
    default: Date.now,
  },
  isRevoked: {
    type: Boolean,
    default: false,
  },
  revokedAt: {
    type: Date,
  },
  revokeTransactionHash: {
    type: String,
  },
});

export const Degree = mongoose.model("Degree", DegreeSchema);
