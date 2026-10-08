import posthog from 'posthog-js';

export default function capturePostHogEvent(
  eventName: string,
  properties?: Record<string, unknown>
) {
  if (import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST) {
    posthog.capture(eventName, properties);
  }
}
