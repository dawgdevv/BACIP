import { ethers } from "ethers";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  BLOCKCHAIN_RPC_URL,
  ISSUER_PRIVATE_KEY,
} from "../config/contract";

let contract: ethers.Contract;

// Always initialize blockchain connection
if (!CONTRACT_ADDRESS || !BLOCKCHAIN_RPC_URL || !ISSUER_PRIVATE_KEY) {
  throw new Error("Missing required environment variables");
}

// Connect to blockchain network using ethers v6 syntax
const provider = new ethers.JsonRpcProvider(BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(ISSUER_PRIVATE_KEY, provider);
contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

interface DegreeData {
  recipientAddress: string;
  degreeName: string;
  university: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
}

// Issue a degree on the blockchain
export const issueDegree = async (
  data: DegreeData
): Promise<{ degreeId: string; transactionHash: string }> => {
  try {
    console.log(
      `Issuing degree for ${data.studentName} from ${data.university}`
    );

    // Call the smart contract's issueDegree function
    const tx = await contract.issueDegree(
      data.recipientAddress,
      data.degreeName,
      data.university
    );

    // Wait for transaction to be mined (ethers v6 syntax)
    const receipt = await tx.wait();
    console.log(`Degree issued. Transaction hash: ${receipt.hash}`);

    // Extract the degreeId from the emitted event (ethers v6 syntax)
    const degreeIssuedEvent = receipt.logs.find((log) => {
      const parsedLog = contract.interface.parseLog(log);
      return parsedLog && parsedLog.name === "DegreeIssued";
    });

    let degreeId = "";
    if (degreeIssuedEvent) {
      const parsedLog = contract.interface.parseLog(degreeIssuedEvent);
      degreeId = parsedLog.args.degreeId;
    }

    if (!degreeId) {
      throw new Error("Failed to retrieve degree ID from transaction");
    }

    return {
      degreeId,
      transactionHash: receipt.hash, // In v6, it's just 'hash' not 'transactionHash'
    };
  } catch (error) {
    console.error("Error issuing degree on blockchain:", error);
    throw error;
  }
};

// Verify a degree on the blockchain
export const verifyDegree = async (degreeId: string): Promise<any> => {
  try {
    console.log(`Verifying degree with ID: ${degreeId}`);

    // Call the smart contract's verifyDegree function
    const degreeData = await contract.verifyDegree(degreeId);

    if (!degreeData || !degreeData.degreeId) {
      return {
        status: "error",
        message: "Degree not found.",
      };
    }

    // Format the response
    const issueDateFormatted = new Date(
      Number(degreeData.issueDate) * 1000
    ).toLocaleDateString();

    return {
      status: "success",
      message: degreeData.isValid
        ? "Certificate successfully verified!"
        : "Certificate found but has been revoked.",
      certificate: {
        id: degreeId,
        recipientAddress: degreeData.recipient,
        degreeName: degreeData.degreeName,
        university: degreeData.university,
        issueDate: issueDateFormatted,
        isValid: degreeData.isValid,
        nonce: degreeData.nonce.toString(),
      },
    };
  } catch (error) {
    console.error("Error verifying degree:", error);
    return {
      status: "error",
      message:
        "Error verifying degree. It may not exist or the blockchain query failed.",
    };
  }
};

// Revoke a degree on the blockchain
export const revokeDegree = async (
  degreeId: string
): Promise<{ transactionHash: string }> => {
  try {
    console.log(`Revoking degree with ID: ${degreeId}`);

    // Call the smart contract's revokeDegree function
    const tx = await contract.revokeDegree(degreeId);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log(`Degree revoked. Transaction hash: ${receipt.hash}`);

    return {
      transactionHash: receipt.hash,
    };
  } catch (error) {
    console.error("Error revoking degree:", error);
    throw error;
  }
};

// Get all degrees for a specific address
export const getDegreesByAddress = async (address: string): Promise<any[]> => {
  try {
    console.log(`Getting degrees for address: ${address}`);

    // Call the smart contract's getDegreesByAddress function
    const degreeIds = await contract.getDegreesByAddress(address);

    const degrees = [];

    // Fetch details for each degree ID
    for (const degreeId of degreeIds) {
      const degreeData = await contract.verifyDegree(degreeId);

      degrees.push({
        id: degreeId,
        degreeName: degreeData.degreeName,
        university: degreeData.university,
        issueDate: new Date(
          Number(degreeData.issueDate) * 1000
        ).toLocaleDateString(),
        isValid: degreeData.isValid,
      });
    }

    return degrees;
  } catch (error) {
    console.error("Error getting degrees by address:", error);
    throw error;
  }
};
