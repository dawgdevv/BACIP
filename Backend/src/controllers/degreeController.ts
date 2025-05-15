import { Request, Response } from "express";
import {
  issueDegree,
  verifyDegree,
  revokeDegree,
  getDegreesByAddress,
} from "../services/blockchainService";
import { Degree } from "../model/Degree";

// Issue a new degree
export const issueDegreeController = async (req: Request, res: Response) => {
  try {
    const {
      recipientAddress,
      degreeName,
      university,
      studentName,
      studentId,
      studentEmail,
    } = req.body;

    // Validate input
    if (!recipientAddress || !degreeName || !university || !studentName) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Issue the degree using the blockchain service
    const result = await issueDegree({
      recipientAddress,
      degreeName,
      university,
      studentName,
      studentId,
      studentEmail,
    });

    const newDegree = new Degree({
      degreeId: result.degreeId,
      recipientAddress,
      degreeName,
      university,
      studentName,
      studentId,
      studentEmail,
      transactionHash: result.transactionHash,
    });
    await newDegree.save();

    // Check if the degree was issued successfully

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Degree issued successfully",
      data: {
        degreeId: result.degreeId,
        transactionHash: result.transactionHash,
        degreeName,
        university,
        studentName,
        recipientAddress,
      },
    });
  } catch (error) {
    console.error("Error in issueDegreeController:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to issue degree",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Verify a degree
export const verifyDegreeController = async (req: Request, res: Response) => {
  try {
    const { degreeId } = req.params;

    // Validate input
    if (!degreeId) {
      return res.status(400).json({ error: "Degree ID is required" });
    }

    // Check if the degree exists in the database
    const degree = await Degree.findOne({ degreeId });

    // Verify the degree using the blockchain service
    const result = await verifyDegree(degreeId);

    // Return the verification result
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error in verifyDegreeController:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to verify degree",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Revoke a degree
export const revokeDegreeController = async (req: Request, res: Response) => {
  try {
    const { degreeId } = req.params;

    // Validate input
    if (!degreeId) {
      return res.status(400).json({ error: "Degree ID is required" });
    }

    // Revoke the degree using the blockchain service
    const result = await revokeDegree(degreeId);

    // Check if the degree exists in the database
    const degree = await Degree.findOne({ degreeId });
    if (!degree) {
      return res.status(404).json({ error: "Degree not found" });
    }
    // Update the degree status in the database
    degree.isRevoked = true;
    degree.revokedAt = new Date();
    degree.revokeTransactionHash = result.transactionHash;
    await degree.save();
    // Check if the degree was revoked successfully

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Degree revoked successfully",
      data: {
        transactionHash: result.transactionHash,
      },
    });
  } catch (error) {
    console.error("Error in revokeDegreeController:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to revoke degree",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get degrees by address
export const getDegreesByAddressController = async (
  req: Request,
  res: Response
) => {
  try {
    const { address } = req.params;

    // Validate input
    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Get degrees using the blockchain service
    const degrees = await getDegreesByAddress(address);

    // Return the degrees
    return res.status(200).json({
      success: true,
      data: degrees,
    });
  } catch (error) {
    console.error("Error in getDegreesByAddressController:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to get degrees",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
