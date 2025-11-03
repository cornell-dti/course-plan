/* eslint-disable import/prefer-default-export */
// src/composables/usePostHog.ts
import posthog, { PostHog } from 'posthog-js';

export function usePostHog(): { posthog: PostHog } {
  posthog.init('phc_lgqGN7C2WKoLM4I0HgY51ik2pozm533V3rEyClN2xTY', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
  });

  return { posthog };
}
