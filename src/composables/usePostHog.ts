/* eslint-disable import/prefer-default-export */
// src/composables/usePostHog.ts
import posthog from 'posthog-js';

export function usePostHog() {
  posthog.init('phc_lgqGN7C2WKoLM4I0HgY51ik2pozm533V3rEyClN2xTY', {
    api_host: 'https://us.i.posthog.com',
    defaults: '2025-05-24',
  });

  return { posthog };
}
