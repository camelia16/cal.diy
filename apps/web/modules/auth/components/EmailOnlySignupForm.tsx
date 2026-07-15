import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { trackExposure, trackConversion } from "@/lib/pilot-experiments";

interface EmailOnlySignupFormProps {
  onSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

export function EmailOnlySignupForm({ onSubmit, isSubmitting }: EmailOnlySignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>();

  useEffect(() => {
    // Report exposure to Pilot
    trackExposure("signup_email_only", "treatment", "anonymous");

    // Fire PostHog experiment_viewed event if PostHog is available
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("experiment_viewed", {
        experiment: "signup_email_only",
        variant: "email_only",
      });
    }
  }, []);

  const handleFormSubmit = handleSubmit(({ email }) => {
    // Track conversion in Pilot
    trackConversion(
      "signup_email_only",
      "treatment",
      "anonymous",
      "signup_form_submitted",
      { experiment_variant: "email_only", email }
    );

    // Fire PostHog event
    if (typeof window !== "undefined" && (window as any).posthog) {
      (window as any).posthog.capture("signup_form_submitted", {
        experiment_variant: "email_only",
      });
    }

    onSubmit(email);
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-default">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="block w-full rounded-md border border-default bg-default px-3 py-2 text-sm text-default placeholder:text-muted shadow-sm focus:border-emphasis focus:outline-none focus:ring-2 focus:ring-emphasis"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center rounded-md bg-brand-default px-4 py-2.5 text-sm font-semibold text-brand-accent shadow-sm hover:bg-brand-emphasis focus:outline-none focus:ring-2 focus:ring-brand-default focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {isSubmitting ? "Please wait..." : "Continue with Email"}
        </button>
      </form>
    </div>
  );
}
