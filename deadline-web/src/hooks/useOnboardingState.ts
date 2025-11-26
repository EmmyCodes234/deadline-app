import { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'deadline_onboarding_completed';

export function useOnboardingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    // Initialize from localStorage immediately to avoid flash
    const completed = localStorage.getItem(ONBOARDING_KEY);
    return completed === 'true';
  });
  const [isLoading, setIsLoading] = useState(true);

  // Mark as loaded after initial check
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem(ONBOARDING_KEY, 'true');
  };

  const resetOnboarding = () => {
    setCurrentStep(0);
    setHasCompletedOnboarding(false);
    localStorage.removeItem(ONBOARDING_KEY);
  };

  return {
    currentStep,
    hasCompletedOnboarding,
    isLoading,
    nextStep,
    prevStep,
    completeOnboarding,
    resetOnboarding,
  };
}
