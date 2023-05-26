import { Navbar } from "@/components/navbar";
import axios from "axios";
import { JSX, useState } from "react";

export default function OnboardingPage(): JSX.Element {
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(true);

  return (
    <>
      <Navbar />
      <div
        className={`py-4 px-4 md:px-8 md:py-8 bg-white dark:bg-gray-800 rounded-lg shadow-md`}
      >
        <button
          onClick={async (): Promise<void> => {
            await axios.post("/api/utils/seed");
            alert("Seeded database");
          }}
        >
          Open Modal
        </button>
      </div>
    </>
  );
}
