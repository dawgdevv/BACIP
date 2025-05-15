import { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import {
  Shield,
  Link,
  Globe,
  Lock,
  FileCheck,
  UserCheck,
  Clock,
  Database,
} from "lucide-react";

interface Benefit {
  icon: JSX.Element;
  title: string;
  description: string;
}

const Benefits = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const benefits: Benefit[] = [
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Enhanced Security",
      description:
        "Immutable blockchain records ensure credentials cannot be tampered with or falsified.",
    },
    {
      icon: <Link className="w-6 h-6 text-primary" />,
      title: "Interoperability",
      description:
        "Seamless sharing of academic records between institutions and employers across borders.",
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: "Global Verification",
      description:
        "Instant verification of academic credentials from anywhere in the world.",
    },
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Data Privacy",
      description:
        "Students maintain control over their personal data and who can access their credentials.",
    },
    {
      icon: <FileCheck className="w-6 h-6 text-primary" />,
      title: "Reduced Fraud",
      description:
        "Eliminates certificate forgery and misrepresentation of academic qualifications.",
    },
    {
      icon: <UserCheck className="w-6 h-6 text-primary" />,
      title: "Ownership",
      description:
        "Students own their credentials and can share them without institutional intermediaries.",
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Efficiency",
      description:
        "Instant verification reduces administrative burdens and speeds up credential checks.",
    },
    {
      icon: <Database className="w-6 h-6 text-primary" />,
      title: "Permanence",
      description:
        "Credentials remain accessible even if the issuing institution ceases to exist.",
    },
  ];

  return (
    <section className="section bg-secondary/30" ref={ref}>
      <div className="container-tight mx-auto px-6">
        <div className="text-center mb-16">
          <h2
            className={`section-title transition-all duration-700 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Why Choose <span className="gradient-text">BACIP</span>
          </h2>
          <p
            className={`section-subtitle transition-all duration-700 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Our blockchain academic protocol offers unparalleled benefits for
            students, institutions, and employers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`glass rounded-xl p-6 transition-all duration-700 ${
                inView
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-16"
              }`}
              style={{ transitionDelay: `${150 + index * 100}ms` }}
            >
              <div className="bg-primary/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
