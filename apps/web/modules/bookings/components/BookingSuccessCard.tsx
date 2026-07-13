import { useLocale } from "@calcom/lib/hooks/useLocale";
import { Badge } from "@calcom/ui/components/badge";
import { Button } from "@calcom/ui/components/button";
import { CheckIcon } from "@coss/ui/icons";
import posthog from "posthog-js";
import { useEffect, useId } from "react";
import { trackExposure, trackConversion } from "@/lib/pilot-experiments";
import { useIsPostBookingUpsellEnabled } from "../hooks/useIsPostBookingUpsellEnabled";

export interface BookingSuccessCardProps {
  title: string;
  formattedDate: string;
  formattedTime: string;
  endTime: string;
  formattedTimeZone: string;
  hostName: string | null;
  hostEmail: string | null;
  attendeeName: string | null;
  attendeeEmail: string | null;
  location: string | null;
  hostBookingPageUrl?: string | null;
  attendeeUserId?: string | null;
}

export function BookingSuccessCard({
  title,
  formattedDate,
  formattedTime,
  endTime,
  formattedTimeZone,
  hostName,
  hostEmail,
  attendeeName,
  attendeeEmail,
  location,
  hostBookingPageUrl,
  attendeeUserId,
}: BookingSuccessCardProps) {
  const { t } = useLocale();
  const isUpsellEnabled = useIsPostBookingUpsellEnabled();
  const experimentKey = "post_booking_upsell_prompt";
  const variant = isUpsellEnabled ? "treatment" : "control";
  const userId = attendeeUserId ?? "anonymous";

  useEffect(() => {
    trackExposure(experimentKey, variant, userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFollowUpClick = () => {
    posthog.capture("booking_followup_clicked", {
      variant,
      host_booking_page_url: hostBookingPageUrl,
    });
    trackConversion(experimentKey, variant, userId, "booking_followup_clicked", {
      host_booking_page_url: hostBookingPageUrl,
    });
    if (hostBookingPageUrl) {
      window.open(hostBookingPageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="h-screen">
      <main className="mx-auto max-w-3xl">
        <div className="overflow-y-auto">
          <div className="flex items-end justify-center px-4 pb-20 pt-4 text-center sm:flex sm:p-0">
            <div className="main inset-0 my-4 flex flex-col transition-opacity sm:my-0" aria-hidden="true">
              <div
                className="bg-default dark:bg-cal-muted border-booker border-booker-width inline-block transform overflow-hidden rounded-lg px-8 pb-4 pt-5 text-left align-bottom transition-all sm:my-8 sm:w-full sm:max-w-xl sm:py-8 sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline">
                <div>
                  <div className="bg-cal-success mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                    <CheckIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mb-8 mt-6 text-center last:mb-0">
                  <h3 className="text-emphasis text-2xl font-semibold leading-6" id="modal-headline">
                    {t("meeting_is_scheduled")}
                  </h3>

                  <div className="mt-3">
                    <p className="text-default">{t("emailed_you_and_any_other_attendees")}</p>
                  </div>

                  <div className="border-subtle text-default mt-8 grid grid-cols-3 gap-x-4 border-t pt-8 text-left rtl:text-right sm:gap-x-0">
                    <div className="font-medium">{t("what")}</div>
                    <div className="col-span-2 mb-6 last:mb-0">{title}</div>

                    {formattedDate && (
                      <>
                        <div className="font-medium">{t("when")}</div>
                        <div className="col-span-2 mb-6 last:mb-0">
                          {formattedDate}
                          {formattedTime && (
                            <>
                              <br />
                              {formattedTime}
                              {endTime && ` - ${endTime}`}
                              {formattedTimeZone && (
                                <span className="text-bookinglight"> ({formattedTimeZone})</span>
                              )}
                            </>
                          )}
                        </div>
                      </>
                    )}

                    <div className="font-medium">{t("who")}</div>
                    <div className="col-span-2 last:mb-0">
                      {hostName && (
                        <div className="mb-3">
                          <div>
                            <span className="mr-2">{hostName}</span>
                            <Badge variant="blue">{t("Host")}</Badge>
                          </div>
                          {hostEmail && <p className="text-default">{hostEmail}</p>}
                        </div>
                      )}
                      {attendeeName && (
                        <div className="mb-3 last:mb-0">
                          <p>{attendeeName}</p>
                          {attendeeEmail && <p>{attendeeEmail}</p>}
                        </div>
                      )}
                    </div>

                    {location && (
                      <>
                        <div className="mt-3 font-medium">{t("where")}</div>
                        <div className="col-span-2 mt-3">{t("web_conferencing_details_to_follow")}</div>
                      </>
                    )}
                  </div>
                </div>

                {isUpsellEnabled && (
                  <div className="border-subtle mt-6 rounded-lg border bg-muted px-6 py-4 text-center">
                    <p className="text-emphasis mb-3 font-semibold text-sm">
                      {t("want_to_meet_again") || "Want to meet again?"}
                    </p>
                    <p className="text-default mb-4 text-sm">
                      {t("book_a_followup_description") || "Schedule a follow-up meeting while it's fresh."}
                    </p>
                    <Button
                      color="secondary"
                      className="rounded-[10px]"
                      onClick={handleFollowUpClick}
                      disabled={!hostBookingPageUrl}>
                      {t("book_a_followup") || "Book a follow-up"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
