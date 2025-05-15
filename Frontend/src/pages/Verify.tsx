import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VerificationForm from "../components/VerificationForm";

const Verify = () => {
  useEffect(() => {
    // Set page title
    document.title = "Verify Certificate - BACIP";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl font-bold mb-4">Verify Certificate</h1>
            <p className="text-xl text-muted-foreground">
              Instantly verify the authenticity of any academic certificate
              issued through our blockchain protocol.
            </p>
          </div>
        </div>
        <VerificationForm />
      </main>
      <Footer />
    </div>
  );
};

export default Verify;
