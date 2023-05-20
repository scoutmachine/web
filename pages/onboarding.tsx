import { OnboardingModal } from "@/components/modals/OnboardingModal";
import { Navbar } from "@/components/navbar";
import { JSX, useState } from "react";

export default function OnboardingPage(): JSX.Element {
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
