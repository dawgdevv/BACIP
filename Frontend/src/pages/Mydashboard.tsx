import { useState } from "react";
import { getDegreesByAddress } from "../services/api";
import { Loader2, Search, FileCheck, X } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../components/Navbar";

interface Degree {
  id: string;
  degreeName: string;
  university: string;
  issueDate: string;
  isValid: boolean;
}

const Mydashboard = () => {
  const [address, setAddress] = useState("");
  const [degrees, setDegrees] = useState<Degree[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchDegrees = async (e: React.FormEvent) => {
    e.preventDefault();
    setDegrees([]);
    setError(null);

    if (!address) {
      setError("Please enter a wallet address.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await getDegreesByAddress(address);
      if (result.success === false) {
        setError(result.message || "Failed to fetch degrees.");
        setDegrees([]);
      } else if (Array.isArray(result.data)) {
        setDegrees(result.data);
        if (result.data.length === 0) {
          toast.info("No degrees found for this address.");
        }
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err: Unkown) {
      setError(err.message || "Failed to fetch degrees.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-6 py-12 max-w-4xl">
      <Navbar />
      <div className="glass rounded-2xl p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">
          My Issued Degrees
        </h2>
        <form onSubmit={handleFetchDegrees} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your wallet address"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!address || isLoading}
              className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>Get Degrees</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <X className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {degrees.length > 0 && (
          <div className="animate-scale-in">
            <h3 className="text-xl font-semibold mb-4">Degrees Found</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-background border rounded-lg">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Degree ID</th>
                    <th className="px-4 py-2 text-left">Degree Name</th>
                    <th className="px-4 py-2 text-left">University</th>
                    <th className="px-4 py-2 text-left">Issue Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {degrees.map((deg) => (
                    <tr key={deg.id} className="border-t">
                      <td className="px-4 py-2 font-mono break-all">
                        {deg.id}
                      </td>
                      <td className="px-4 py-2">{deg.degreeName}</td>
                      <td className="px-4 py-2">{deg.university}</td>
                      <td className="px-4 py-2">{deg.issueDate}</td>
                      <td className="px-4 py-2">
                        {deg.isValid ? (
                          <span className="text-green-600 font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            Revoked
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {degrees.length === 0 && !isLoading && !error && (
          <div className="text-center text-muted-foreground mt-8">
            <p>Enter your wallet address to view your issued degrees.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Mydashboard;
