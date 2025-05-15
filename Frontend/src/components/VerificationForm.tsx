import { useState } from "react";
import { Search, FileCheck, X, Loader2 } from "lucide-react";
import { verifyDegree } from "../services/api";
import { toast } from "sonner";

const VerificationForm = () => {
  const [verificationId, setVerificationId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<null | {
    status: "success" | "error";
    message: string;
    certificate?: {
      id: string;
      recipientAddress: string;
      degreeName: string;
      university: string;
      issueDate: string;
      isValid: boolean;
      nonce: string;
    };
  }>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationId) return;

    setIsLoading(true);

    try {
      const result = await verifyDegree(verificationId);
      setVerificationResult(result);

      if (result.status === "success") {
        toast.success("Certificate verified successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error: Unknown) {
      toast.error("Verification failed", {
        description: error.message,
      });
      setVerificationResult({
        status: "error",
        message: "Failed to verify certificate. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setVerificationId("");
    setVerificationResult(null);
  };

  return (
    <section className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="glass rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Verify Certificate
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          Enter a certificate ID to verify its authenticity on the blockchain
        </p>

        <form onSubmit={handleVerify} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={verificationId}
                onChange={(e) => setVerificationId(e.target.value)}
                placeholder="Enter certificate ID or hash"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!verificationId || isLoading}
              className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </div>
        </form>

        {verificationResult && (
          <div
            className={`rounded-xl p-6 mb-4 animate-scale-in ${
              verificationResult.status === "success"
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
            role="alert"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${
                    verificationResult.status === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {verificationResult.status === "success" ? (
                    <FileCheck className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                </div>
                <h3 className="text-xl font-semibold">
                  {verificationResult.status === "success"
                    ? "Certificate Verified"
                    : "Verification Failed"}
                </h3>
              </div>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                aria-label="Reset verification form"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p
              className={
                verificationResult.status === "success"
                  ? "text-green-700 mb-6"
                  : "text-red-700 mb-6"
              }
            >
              {verificationResult.message}
            </p>

            {verificationResult.certificate && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mt-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Certificate ID
                  </p>
                  <p className="font-medium break-all">
                    {verificationResult.certificate.id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Recipient Address
                  </p>
                  <p className="font-medium break-all">
                    {verificationResult.certificate.recipientAddress}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Degree Name</p>
                  <p className="font-medium">
                    {verificationResult.certificate.degreeName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">University</p>
                  <p className="font-medium">
                    {verificationResult.certificate.university}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">
                    {verificationResult.certificate.issueDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Is Valid</p>
                  <p className="font-medium">
                    {verificationResult.certificate.isValid ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nonce</p>
                  <p className="font-medium break-all">
                    {verificationResult.certificate.nonce}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          <p>Enter a valid certificate ID to verify its authenticity.</p>
        </div>
      </div>
    </section>
  );
};

export default VerificationForm;
