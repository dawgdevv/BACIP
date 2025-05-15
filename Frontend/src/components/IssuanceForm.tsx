import { useState } from "react";
import { Check, Loader2, Lock, Upload, HelpCircle } from "lucide-react";
import { issueDegree } from "../services/api";
import { toast } from "sonner"; // Assuming you're using sonner for toast notifications

type FormField = {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  required: boolean;
  tooltip?: string;
};

type FormStep = {
  title: string;
  subtitle: string;
  fields: FormField[];
};

const IssuanceForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    institution: "",
    department: "",
    issuerName: "",
    issuerEmail: "",
    credentialType: "",
    credentialName: "",
    studentName: "",
    studentId: "",
    studentEmail: "",
    issueDate: "",
    expiryDate: "",
    credentials: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState<string | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<{
    degreeId: string;
    transactionHash: string;
  } | null>(null);

  const steps: FormStep[] = [
    {
      title: "Issuer Information",
      subtitle: "Enter details about the institution issuing the certificate",
      fields: [
        {
          id: "institution",
          label: "Institution Name",
          placeholder: "e.g. Stanford University",
          type: "text",
          required: true,
        },
        {
          id: "department",
          label: "Department",
          placeholder: "e.g. Computer Science",
          type: "text",
          required: true,
        },
        {
          id: "issuerName",
          label: "Issuer Name",
          placeholder: "e.g. Dr. John Smith",
          type: "text",
          required: true,
        },
        {
          id: "issuerEmail",
          label: "Issuer Email",
          placeholder: "e.g. john.smith@stanford.edu",
          type: "email",
          required: true,
        },
      ],
    },
    {
      title: "Credential Information",
      subtitle: "Enter details about the certificate being issued",
      fields: [
        {
          id: "credentialType",
          label: "Credential Type",
          placeholder: "e.g. Degree, Certificate, Diploma",
          type: "text",
          required: true,
          tooltip: "The type of academic credential being issued",
        },
        {
          id: "credentialName",
          label: "Credential Name",
          placeholder: "e.g. Bachelor of Science in Computer Science",
          type: "text",
          required: true,
        },
        {
          id: "issueDate",
          label: "Issue Date",
          placeholder: "",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "Recipient Information",
      subtitle: "Enter details about the student receiving the certificate",
      fields: [
        {
          id: "studentName",
          label: "Student Name",
          placeholder: "e.g. Nishant Raj",
          type: "text",
          required: true,
        },
        {
          id: "studentId",
          label: "Student ID",
          placeholder: "e.g. S12345678",
          type: "text",
          required: true,
        },
        {
          id: "studentEmail",
          label: "Student Email",
          placeholder: "e.g.nraj@gmail.com",
          type: "email",
          required: true,
          tooltip: "The certificate will be sent to this email",
        },
        {
          id: "studentwalletaddress",
          label: "Student Wallet Address",
          placeholder: "e.g. 0x1234567890abcdef1234567890abcdef12345678",
          type: "text",
          required: true,
          tooltip: "The certificate will be sent to this wallet address",
        },
        {
          id: "credentials",
          label: "Upload Supporting Documents (Optional)",
          placeholder: "PDF, JPG, or PNG files",
          type: "file",
          required: false,
          tooltip:
            "Upload any supporting documents such as transcript, projects, etc.",
        },
      ],
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, files } = e.target;

    if (id === "credentials" && files && files.length > 0) {
      setFormData({ ...formData, [id]: files[0] });
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const isStepComplete = () => {
    const currentFields = steps[currentStep].fields;
    for (const field of currentFields) {
      if (field.required && !formData[field.id as keyof typeof formData]) {
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    // Set submitting state
    setIsSubmitting(true);

    try {
      const result = await issueDegree({
        // Use the actual form data values
        recipientAddress: formData.studentwalletaddress.startsWith("0x")
          ? formData.studentwalletaddress
          : "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // Default address if none provided
        degreeName: formData.credentialName,
        university: formData.institution,
        studentName: formData.studentName,
        studentId: formData.studentId,
        studentEmail: formData.studentEmail,
      });

      if (result.success) {
        setIsComplete(true);
        // Store transaction details for display
        setTransactionDetails({
          degreeId: result.data.degreeId,
          transactionHash: result.data.transactionHash,
        });

        toast.success("Certificate issued successfully!", {
          description: `Transaction hash: ${result.data.transactionHash.substring(
            0,
            10
          )}...`,
        });
      } else {
        toast.error("Failed to issue certificate", {
          description: result.message,
        });
      }
    } catch (error) {
      console.error("Error issuing degree:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error("Failed to issue certificate", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showTooltip = (id: string) => {
    setTooltipVisible(id);
  };

  const hideTooltip = () => {
    setTooltipVisible(null);
  };

  if (isComplete) {
    return (
      <div className="glass rounded-2xl p-8 text-center max-w-md mx-auto animate-scale-in">
        <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">
          Certificate Issued Successfully
        </h2>
        <p className="text-muted-foreground mb-8">
          The certificate has been issued and will be added to the blockchain.
          The recipient will receive an email notification.
        </p>
        <div className="glass bg-secondary/50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium">Transaction ID</p>
          <p className="text-muted-foreground font-mono text-xs">
            {transactionDetails?.transactionHash}
          </p>
        </div>
        <button
          onClick={() => {
            setIsComplete(false);
            setCurrentStep(0);
            setFormData({
              institution: "",
              department: "",
              issuerName: "",
              issuerEmail: "",
              credentialType: "",
              credentialName: "",
              studentName: "",
              studentId: "",
              studentEmail: "",
              issueDate: "",
              expiryDate: "",
              credentials: null,
            });
          }}
          className="btn-primary mx-auto"
        >
          Issue Another Certificate
        </button>
      </div>
    );
  }

  return (
    <section className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="glass rounded-2xl p-8">
        {/* Stepper */}
        <div className="flex justify-between items-center mb-8 px-2">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                  index < currentStep
                    ? "bg-primary text-white"
                    : index === currentStep
                    ? "bg-primary/10 text-primary border-2 border-primary"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {index < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              <div className="text-xs mt-2 hidden sm:block text-center max-w-[100px]">
                {step.title}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-secondary rounded-full mb-8 relative">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Current step */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-muted-foreground mb-6">
            {steps[currentStep].subtitle}
          </p>

          <div className="space-y-4">
            {steps[currentStep].fields.map((field) => (
              <div key={field.id}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <label htmlFor={field.id} className="text-sm font-medium">
                    {field.label}{" "}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {field.tooltip && (
                    <div className="relative">
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        onMouseEnter={() => showTooltip(field.id)}
                        onMouseLeave={hideTooltip}
                        onClick={() =>
                          tooltipVisible === field.id
                            ? hideTooltip()
                            : showTooltip(field.id)
                        }
                      >
                        <HelpCircle className="w-4 h-4" />
                      </button>
                      {tooltipVisible === field.id && (
                        <div className="absolute z-10 mt-2 w-64 p-3 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg left-0 top-full">
                          {field.tooltip}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <input
                  id={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  required={field.required}
                  value={
                    field.type !== "file"
                      ? (formData[field.id as keyof typeof formData] as string)
                      : undefined
                  }
                  onChange={handleChange}
                  accept={
                    field.type === "file"
                      ? "application/pdf,image/jpeg,image/png"
                      : undefined
                  }
                />

                {field.id === "credentials" && formData.credentials && (
                  <div className="mt-2 text-sm text-muted-foreground">
                    File selected: {formData.credentials.name}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
              disabled={currentStep === 0}
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepComplete() || isSubmitting}
              className="btn-primary disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : currentStep === steps.length - 1 ? (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Issue Certificate</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IssuanceForm;
