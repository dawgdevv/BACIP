const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface DegreeData {
  recipientAddress: string;
  degreeName: string;
  university: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
}

interface DegreeResponse {
  success: boolean;
  message: string;
  data: {
    degreeId: string;
    transactionHash: string;
    degreeName: string;
    university: string;
    studentName: string;
    recipientAddress: string;
  };
}

/**
 * Issues a new degree certificate on the blockchain
 */
export const issueDegree = async (
  data: DegreeData
): Promise<DegreeResponse> => {
  try {
    // Corrected endpoint URL - should be /degrees/issue not /degree/issue
    const response = await fetch(`${API_URL}/degrees/issue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error issuing degree:", error);
    throw error;
  }
};

/**
 * Verifies a degree certificate on the blockchain
 */
export const verifyDegree = async (degreeId: string) => {
  try {
    // Corrected endpoint URL - should be /degrees/verify/ not /degree/verify/
    const response = await fetch(`${API_URL}/degrees/verify/${degreeId}`);

    if (response.status === 404) {
      return {
        status: "error",
        message: "Certificate not found. Please check the ID and try again.",
      };
    }

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying degree:", error);
    throw error;
  }
};

/**
 * Revokes a degree certificate on the blockchain
 */
export const revokeDegree = async (degreeId: string) => {
  try {
    // Corrected endpoint URL - should be /degrees/revoke/ not /degree/revoke/
    const response = await fetch(`${API_URL}/degrees/revoke/${degreeId}`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error revoking degree:", error);
    throw error;
  }
};

/**
 * Gets all degrees for a specific wallet address
 */
export const getDegreesByAddress = async (address: string) => {
  try {
    // Corrected endpoint URL - should be /degrees/address/ not /degree/address/
    const response = await fetch(`${API_URL}/degrees/address/${address}`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting degrees by address:", error);
    throw error;
  }
};
