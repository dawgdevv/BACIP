import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IssuanceForm from "../components/IssuanceForm";

const Issue = () => {
  useEffect(() => {
    // Set page title
    document.title = "Issue Certificate - BACIP";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto ">
            <h1 className="text-4xl font-bold ">Issue Certificate</h1>
            <p className="text-xl text-muted-foreground">
              Issue secure, blockchain-verified certificates for academic
              achievements and skills.
            </p>
          </div>
        </div>
        <IssuanceForm />
      </main>
      <Footer />
    </div>
  );
};

export default Issue;
