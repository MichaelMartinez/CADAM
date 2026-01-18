import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST =
  import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

let isInitialized = false;

export const initPostHog = () => {
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not configured. Analytics disabled.');
    return;
  }

  try {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      person_profiles: 'always',
      capture_pageview: false, // We'll handle this manually with React Router
      capture_pageleave: true,
      autocapture: true,
      // Suppress errors when blocked by ad blockers
      disable_session_recording: true,
      opt_out_capturing_by_default: false,
      // Don't log debug info
      loaded: (posthog) => {
        // Only enable in production, disable verbose logging
        if (import.meta.env.DEV) {
          posthog.debug(false);
        }
      },
      // Handle errors silently (ad blockers, network issues)
      on_request_error: () => {
        // Silently ignore - likely blocked by ad blocker
      },
    });

    isInitialized = true;
  } catch {
    // PostHog failed to initialize (likely blocked)
    console.warn('PostHog initialization failed. Analytics disabled.');
  }
};

// Safe wrapper that only calls PostHog methods when initialized
export const analytics = {
  identify: (userId: string, properties?: Record<string, unknown>) => {
    if (isInitialized) {
      posthog.identify(userId, properties);
    }
  },
  reset: () => {
    if (isInitialized) {
      posthog.reset();
    }
  },
  capture: (event: string, properties?: Record<string, unknown>) => {
    if (isInitialized) {
      posthog.capture(event, properties);
    }
  },
};
