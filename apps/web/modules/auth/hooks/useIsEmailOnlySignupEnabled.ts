import { useEffect, useRef } from "react";

import { isVisitorWithinPercentage } from "@calcom/features/bookings/Booker/utils/isFeatureEnabledForVisitor";
import { PUBLIC_SIGNUP_EMAIL_ONLY_ROLLOUT } from "@calcom/lib/constants";

export const useIsEmailOnlySignupEnabled = () => {
  const isEmailOnlySignupEnabledRef = useRef(
    isVisitorWithinPercentage({ percentage: PUBLIC_SIGNUP_EMAIL_ONLY_ROLLOUT })
  );

  useEffect(() => {
    console.log("EmailOnlySignup experiment enabled:", isEmailOnlySignupEnabledRef.current);
  }, []);

  return isEmailOnlySignupEnabledRef.current;
};
