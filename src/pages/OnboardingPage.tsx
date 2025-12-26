import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import OnboardingProgress from "@/components/onboarding/OnboardingProgress";
import BasicInfoStep from "@/components/onboarding/steps/BasicInfoStep";
import PhotoStep from "@/components/onboarding/steps/PhotoStep";
import TravelStyleStep from "@/components/onboarding/steps/TravelStyleStep";
import InterestsStep from "@/components/onboarding/steps/InterestsStep";
import HostingStyleStep from "@/components/onboarding/steps/HostingStyleStep";
import HouseRulesStep from "@/components/onboarding/steps/HouseRulesStep";
import SummaryStep from "@/components/onboarding/steps/SummaryStep";

const TOTAL_STEPS = 7;

interface OnboardingData {
  // Basic info
  name: string;
  age: string;
  location: string;
  gender: string;
  // Photo
  photo: string;
  photoType: 'avatar' | 'emoji' | 'random';
  // Travel style
  adventureLevel: number;
  socialLevel: number;
  planningStyle: number;
  budgetLevel: number;
  // Interests
  interests: string[];
  // Hosting
  hostingStatus: string;
  maxGuests: number;
  preferredStayLength: string;
  // House rules
  smokingOk: boolean | null;
  petsOk: boolean | null;
  kidsOk: boolean | null;
  preferredVibe: string;
}

const initialData: OnboardingData = {
  name: "",
  age: "",
  location: "",
  gender: "",
  photo: "",
  photoType: 'avatar',
  adventureLevel: 50,
  socialLevel: 50,
  planningStyle: 50,
  budgetLevel: 50,
  interests: [],
  hostingStatus: "",
  maxGuests: 2,
  preferredStayLength: "flexible",
  smokingOk: null,
  petsOk: null,
  kidsOk: null,
  preferredVibe: "",
};

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { loginAsDemo, createUserFromOnboarding, setOnboardingComplete } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    document.title = "Create Profile | Passport Pals";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Create your Passport Pals profile with a fun onboarding questionnaire and start matching with hosts worldwide."
      );
    }

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `${window.location.origin}/onboarding`);
  }, []);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedKeys.forEach((key) => delete newErrors[key]);
      return newErrors;
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!data.name.trim()) newErrors.name = "Please enter your name";
      if (!data.age) newErrors.age = "Please enter your age";
      else if (parseInt(data.age) < 18) newErrors.age = "You must be 18 or older";
      else if (parseInt(data.age) > 120) newErrors.age = "Please enter a valid age";
      if (!data.location.trim()) newErrors.location = "Please enter your location";
      if (!data.gender) newErrors.gender = "Please select your gender";
    }

    if (currentStep === 4) {
      if (data.interests.length < 3) {
        toast.error("Please select at least 3 interests");
        return false;
      }
    }

    if (currentStep === 5) {
      if (!data.hostingStatus) {
        toast.error("Please select your hosting style");
        return false;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < TOTAL_STEPS) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // Parse location into city and country
    const locationParts = data.location.split(",").map((s) => s.trim());
    const city = locationParts[0] || "Unknown";
    const country = locationParts[1] || "Unknown";
    
    // Determine photo to use
    let photo = data.photo;
    if (!photo || photo.startsWith('emoji:')) {
      // For emoji avatars, we'll use a placeholder with the emoji reference
      photo = data.photo || '';
    }
    
    // Create user with onboarding data
    createUserFromOnboarding({
      name: data.name,
      age: parseInt(data.age),
      city,
      country,
      interests: data.interests,
      hostingStatus: data.hostingStatus as 'hosting' | 'traveling' | 'both',
      photo,
    });
    
    setOnboardingComplete(true);
    toast.success("Welcome to Passport Pals!");
    navigate("/swipe");
  };

  const handleDemoMode = () => {
    loginAsDemo();
    navigate("/swipe");
  };

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep data={data} onChange={updateData} errors={errors} />;
      case 2:
        return <PhotoStep data={data} onChange={updateData} />;
      case 3:
        return <TravelStyleStep data={data} onChange={updateData} />;
      case 4:
        return <InterestsStep data={data} onChange={updateData} />;
      case 5:
        return <HostingStyleStep data={data} onChange={updateData} />;
      case 6:
        return <HouseRulesStep data={data} onChange={updateData} />;
      case 7:
        return <SummaryStep data={data} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <main className="container max-w-2xl mx-auto px-4 py-8 min-h-[calc(100vh-4rem)]">
        <div className="mb-8">
          <OnboardingProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        </div>

        <Card className="p-6 md:p-8 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < TOTAL_STEPS ? (
              <Button variant="hero" onClick={handleNext} className="gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="hero" onClick={handleComplete} className="gap-2">
                <Sparkles className="w-4 h-4" />
                Start Swiping
              </Button>
            )}
          </div>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={handleDemoMode}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          >
            Skip and try Demo Mode instead
          </button>
        </div>
      </main>
    </AppLayout>
  );
};

export default OnboardingPage;
