import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, School, UserCheck } from "lucide-react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "none" | "issuer" | "verifier"
  >("none");

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="py-20 md:py-32 relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-secondary/10 z-0"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Main heading with minimal decoration */}
          <div className="mb-3">
            <Shield
              className={`w-10 h-10 text-primary mx-auto mb-4 transition-all duration-500 ${
                isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            />
          </div>

          <h1
            className={`text-4xl md:text-5xl font-bold mb-6 transition-all duration-700 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <span className="gradient-text">Academic Credentials</span> on
            Blockchain
          </h1>

          {/* Concise description */}
          <p
            className={`text-muted-foreground text-lg max-w-2xl mx-auto mb-10 transition-all duration-700 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            A secure protocol for verifying and issuing tamper-proof academic
            credentials
          </p>

          {/* Simplified role selection */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                className="bg-background shadow-sm border border-border hover:border-primary/30 p-5 rounded-xl transition-all flex items-center justify-between"
                onClick={() => setSelectedRole("issuer")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <School className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Institution / Issuer</span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <button
                className="bg-background shadow-sm border border-border hover:border-primary/30 p-5 rounded-xl transition-all flex items-center justify-between"
                onClick={() => setSelectedRole("verifier")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium">Employer / Verifier</span>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Action panels based on role */}
          {selectedRole === "issuer" && (
            <div className="mt-8 transition-all duration-500 animate-fade-in">
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <Link
                  to="/issue"
                  className="btn-primary w-full justify-between"
                >
                  <span>Issue Certificate</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/revoke"
                  className="btn-outline w-full justify-between"
                >
                  <span>Revoke Certificate</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setSelectedRole("none")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
                >
                  ← Back to selection
                </button>
              </div>
            </div>
          )}

          {selectedRole === "verifier" && (
            <div className="mt-8 transition-all duration-500 animate-fade-in">
              <div className="flex flex-col gap-3 max-w-md mx-auto">
                <Link
                  to="/verify"
                  className="btn-primary w-full justify-between"
                >
                  <span>Verify Certificate</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={() => setSelectedRole("none")}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors mt-2"
                >
                  ← Back to selection
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
