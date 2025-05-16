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
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <VerificationForm />
      </main>

      <Footer />
    </div>
  );
};

export default Verify;
