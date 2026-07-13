import { useRef } from "react";

import { isVisitorWithinPercentage } from "@calcom/features/bookings/Booker/utils/isFeatureEnabledForVisitor";

const POST_BOOKING_UPSELL_ROLLOUT = 50;

export const useIsPostBookingUpsellEnabled = () => {
  const isEnabledRef = useRef(
    isVisitorWithinPercentage({ percentage: POST_BOOKING_UPSELL_ROLLOUT })
  );

  return isEnabledRef.current;
};
