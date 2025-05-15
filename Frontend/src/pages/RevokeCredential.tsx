import { useState, useEffect } from "react";
import {
  Search,
  FileX,
  AlertTriangle,
  X,
  CheckCircle,
  Loader2,
  Info,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { verifyDegree, revokeDegree } from "../services/api";
import { toast } from "sonner"; // Assuming you're using sonner for notifications

interface Certificate {
  id: string;
  studentName?: string;
  institution?: string;
  credential?: string;
  issueDate: string;
  status: "active" | "revoked";
  recipientAddress: string;
  degreeName: string;
  university: string;
  isValid: boolean;
}

const RevokeCredential = () => {
  useEffect(() => {
    document.title = "Revoke Certificate - BACIP";
  }, []);

  const [certificateId, setCertificateId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);
  const [revocationReason, setRevocationReason] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [revokeComplete, setRevokeComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset states
    setSearchResult(null);
    setErrorMessage("");
    setShowConfirmation(false);
    setRevokeComplete(false);
    setTransactionHash(null);

    if (!certificateId) return;

    setIsSearching(true);

    try {
      const result = await verifyDegree(certificateId);

      if (result.status === "success") {
        // Format the certificate data
        setSearchResult({
          id: result.certificate.id,
          recipientAddress: result.certificate.recipientAddress,
          degreeName: result.certificate.degreeName,
          university: result.certificate.university,
          issueDate: result.certificate.issueDate,
          status: result.certificate.isValid ? "active" : "revoked",
          isValid: result.certificate.isValid,
          // Map to match our interface
          studentName: "Student", // This might need to come from elsewhere
          institution: result.certificate.university,
          credential: result.certificate.degreeName,
        });

        if (!result.certificate.isValid) {
          setErrorMessage("This certificate has already been revoked.");
        }
      } else {
        setErrorMessage(
          result.message ||
            "Certificate not found. Please check the ID and try again."
        );
      }
    } catch (error: Unknown) {
      console.error("Error verifying degree:", error);
      setErrorMessage(
        error.message || "Failed to verify certificate. Please try again."
      );
      toast.error("Failed to verify certificate", {
        description: error.message,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleRevoke = () => {
    if (!revocationReason) {
      setErrorMessage("Please provide a reason for revocation");
      return;
    }

    setShowConfirmation(true);
  };

  const confirmRevoke = async () => {
    if (!searchResult) return;

    setIsRevoking(true);
    setShowConfirmation(false);

    try {
      const result = await revokeDegree(searchResult.id);
      setTransactionHash(result.transactionHash);
      setRevokeComplete(true);
      setSearchResult((prev) =>
        prev ? { ...prev, status: "revoked", isValid: false } : null
      );
      toast.success("Certificate revoked successfully", {
        description: `Transaction hash: ${result.transactionHash.substring(
          0,
          10
        )}...`,
      });
    } catch (error: Unknown) {
      console.error("Error revoking degree:", error);
      setErrorMessage(
        error.message || "Failed to revoke certificate. Please try again."
      );
      toast.error("Failed to revoke certificate", {
        description: error.message,
      });
    } finally {
      setIsRevoking(false);
    }
  };

  const resetForm = () => {
    setCertificateId("");
    setSearchResult(null);
    setRevocationReason("");
    setErrorMessage("");
    setShowConfirmation(false);
    setRevokeComplete(false);
    setTransactionHash(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Revoke Certificate</h1>
            <p className="text-xl text-muted-foreground">
              Revoke academic certificates that require cancellation due to
              error, fraud, or other legitimate reasons.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-2xl p-8">
              <form onSubmit={handleSearch} className="mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  Find Certificate to Revoke
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Search className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      placeholder="Enter certificate ID or hash"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      disabled={isSearching}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!certificateId || isSearching}
                    className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        <span>Search Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Error message */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Certificate found and can be revoked */}
              {searchResult &&
                searchResult.status === "active" &&
                !revokeComplete && (
                  <div className="animate-scale-in">
                    <div className="border border-border rounded-xl p-6 mb-8">
                      <h3 className="text-xl font-semibold mb-3">
                        Certificate Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Certificate ID
                          </p>
                          <p className="font-medium">{searchResult.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Recipient Address
                          </p>
                          <p className="font-medium">
                            {searchResult.recipientAddress}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Institution
                          </p>
                          <p className="font-medium">
                            {searchResult.university}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Degree
                          </p>
                          <p className="font-medium">
                            {searchResult.degreeName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Issue Date
                          </p>
                          <p className="font-medium">
                            {searchResult.issueDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Status
                          </p>
                          <p className="font-medium text-green-600">Active</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label
                        htmlFor="reason"
                        className="block font-medium mb-2"
                      >
                        Reason for Revocation *
                      </label>
                      <textarea
                        id="reason"
                        value={revocationReason}
                        onChange={(e) => setRevocationReason(e.target.value)}
                        placeholder="Please provide a detailed reason for revoking this certificate"
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all h-32"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        This information will be stored on the blockchain and
                        visible to verifiers
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleRevoke}
                        disabled={!revocationReason}
                        className="btn-destructive disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <FileX className="w-5 h-5" />
                        <span>Revoke Certificate</span>
                      </button>
                    </div>
                  </div>
                )}

              {/* Confirmation dialog */}
              {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-background rounded-xl shadow-lg max-w-md w-full p-6 animate-scale-in">
                    <div className="text-center mb-6">
                      <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        Confirm Revocation
                      </h3>
                      <p className="text-muted-foreground">
                        This action is permanent and cannot be undone. The
                        certificate will be marked as revoked on the blockchain.
                      </p>
                    </div>

                    <div className="bg-secondary/50 p-4 rounded-lg mb-6">
                      <p className="font-medium mb-1">
                        Certificate: {searchResult?.id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Issued to: {searchResult?.recipientAddress}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={confirmRevoke}
                        className="btn-destructive"
                      >
                        Confirm Revocation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing overlay */}
              {isRevoking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-background rounded-xl shadow-lg p-8 flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-xl font-medium">Processing Revocation</p>
                    <p className="text-muted-foreground mt-2">
                      Writing to blockchain, please wait...
                    </p>
                  </div>
                </div>
              )}

              {/* Revocation complete */}
              {revokeComplete && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-scale-in">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">
                        Certificate Successfully Revoked
                      </h3>
                    </div>
                    <button
                      onClick={resetForm}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="pl-12 mt-4">
                    <p className="mb-4">
                      Certificate{" "}
                      <span className="font-medium">{searchResult?.id}</span>{" "}
                      has been revoked successfully.
                    </p>

                    <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium mb-1">
                            Revocation Transaction
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Transaction ID:
                          </p>
                          <p className="text-sm font-mono bg-background/80 p-2 rounded">
                            {transactionHash || "Transaction processing..."}
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Timestamp: {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button onClick={resetForm} className="btn-primary mt-2">
                      Revoke Another Certificate
                    </button>
                  </div>
                </div>
              )}

              {/* Notice at bottom */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Important Notice</h4>
                    <p className="text-sm text-muted-foreground">
                      Certificate revocation should only be performed for
                      legitimate reasons such as fraud, error in issuance, or
                      academic misconduct. Once revoked, a certificate cannot be
                      reinstated.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RevokeCredential;
