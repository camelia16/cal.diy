import { useEffect, type ReactNode } from "react";

import { trackExposure } from "@/lib/pilot-experiments";
import { useIsEmailOnlySignupEnabled } from "../hooks/useIsEmailOnlySignupEnabled";
import { EmailOnlySignupForm } from "./EmailOnlySignupForm";

interface SignupPageExperimentWrapperProps {
  /** The original full signup UI (control) */
  children: ReactNode;
  /** Called when the email-only variant form is submitted */
  onEmailSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

export function SignupPageExperimentWrapper({
  children,
  onEmailSubmit,
  isSubmitting,
}: SignupPageExperimentWrapperProps) {
  const isEmailOnly = useIsEmailOnlySignupEnabled();
  const variant = isEmailOnly ? "treatment" : "control";

  useEffect(() => {
    // Report exposure to Pilot
    trackExposure("signup_email_only", variant, "anonymous");

    // Fire PostHog experiment_viewed event
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("experiment_viewed", {
        experiment: "signup_email_only",
        variant: isEmailOnly ? "email_only" : "control",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isEmailOnly) {
    return (
      <EmailOnlySignupForm
        onSubmit={onEmailSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Control: render the original full signup UI
  return <>{children}</>;
}
