import dotenv from "dotenv";
dotenv.config();

// Import the ABI from the artifacts directory
import DegreeIssuanceArtifact from "../../../contract/artifacts/contracts/DegreeIssuance.sol/DegreeIssuance.json";

export const CONTRACT_ABI = DegreeIssuanceArtifact.abi;

export const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
export const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL;
export const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY;
