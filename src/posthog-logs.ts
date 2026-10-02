import posthog from 'posthog-js';

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_POSTHOG_HOST
);

const coursePlanLog = {
  loginCompleted() {
    if (isPostHogConfigured) {
      posthog.logger.info('login completed', { auth_method: 'google' });
    }
  },
  scheduleRegenerated(semester: string, courseCount: number) {
    if (isPostHogConfigured) {
      posthog.logger.info('schedule regenerated', {
        semester,
        course_count: courseCount,
      });
    }
  },
  scheduleDownloadStarted(semester: string, courseCount: number) {
    if (isPostHogConfigured) {
      posthog.logger.info('schedule download started', {
        semester,
        course_count: courseCount,
      });
    }
  },
};

export default coursePlanLog;
