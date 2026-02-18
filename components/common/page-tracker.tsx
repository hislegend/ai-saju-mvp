'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/client-track';

type EventName =
  | 'landing_view'
  | 'form_started'
  | 'form_submitted'
  | 'checkout_started'
  | 'payment_success'
  | 'result_viewed'
  | 'share_clicked';

type PageTrackerProps = {
  eventName: EventName;
  readingId?: string;
  metadata?: Record<string, string | number | boolean>;
};

export function PageTracker({ eventName, readingId, metadata }: PageTrackerProps) {
  useEffect(() => {
    void trackEvent({ eventName, readingId, metadata });
  }, [eventName, readingId, metadata]);

  return null;
}
