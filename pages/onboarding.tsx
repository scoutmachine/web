import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { Navbar } from "@/components/navbar";
import { useState } from "react";

export default function OnboardingPage() {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(true);

  return (
    <>
      <Navbar />
      <OnboardingModal
        isOpen={isOnboardingModalOpen}
        setOpen={setIsOnboardingModalOpen}
      />
    </>
  );
}
