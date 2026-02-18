export async function trackEvent(input: {
  eventName:
    | 'landing_view'
    | 'form_started'
    | 'form_submitted'
    | 'checkout_started'
    | 'payment_success'
    | 'result_viewed'
    | 'share_clicked';
  readingId?: string;
  metadata?: Record<string, string | number | boolean>;
}) {
  try {
    const params = new URLSearchParams(window.location.search);

    await fetch('/api/events/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName: input.eventName,
        readingId: input.readingId,
        utm: {
          source: params.get('utm_source') || undefined,
          medium: params.get('utm_medium') || undefined,
          campaign: params.get('utm_campaign') || undefined,
          term: params.get('utm_term') || undefined,
          content: params.get('utm_content') || undefined,
        },
        device: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          width: window.innerWidth,
          height: window.innerHeight,
        },
        metadata: input.metadata,
      }),
    });
  } catch {
    // fire-and-forget tracking
  }
}
