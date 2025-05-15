import { useEffect } from "react";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Index = () => {
  useEffect(() => {
    // Set page title
    document.title = "BACIP - Blockchain Academic Certification";
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
