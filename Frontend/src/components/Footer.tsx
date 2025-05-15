import { Link } from "react-router-dom";
import { GraduationCap, Github, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/80 border-t border-border py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="md:w-1/3">
            <Link
              to="/"
              className="flex items-center gap-2 text-primary font-bold text-xl mb-4"
            >
              <GraduationCap className="w-6 h-6" />
              <span>BACIP</span>
            </Link>
            <p className="text-muted-foreground mb-6">
              Transforming academic credentials through blockchain technology
              for secure, transparent verification and issuance.
            </p>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} BACIP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
