import { VueGtag, query } from 'vue-gtag-next';

type EventPayload = { event_category: string; event_label: string; value: number };

/**
 * Set a user's properties for analytics
 *
 * @param gtag the `VueGtag` instance to query
 * @param properties the user's properties
 */
export const setUserProperties = (onboardingData: AppOnboardingData) => {
  const gtag = query as Gtag.Gtag;
  gtag('set', 'user_properties', {
    major: onboardingData.major,
    gradYear: onboardingData.gradYear,
  });
};

/** GTagLoginEvent represents the gtag that tracks when users login. */
export const GTagLoginEvent = (gtag: VueGtag | undefined, method: string): void => {
  if (!gtag) return;
  gtag.event('login', { method });
};

type EventType =
  | 'add-collection' // User adds a collection
  | 'add-course' // User adds a course
  | 'add-course-collections' // User adds a course to a collection(s)
  | 'add-modal-edit-requirements' // User clicks Edit Requirements on Add Modal
  | 'add-semester' // User adds a semester
  | 'add-plan'
  | 'bottom-bar-close' // User collapses or closes the Bottom Bar
  | 'bottom-bar-CU-reviews-link' // User clicks CU Reviews link on Bottom Bar
  | 'bottom-bar-delete-tab' // User deletes a tab on the Bottom Bar
  | 'bottom-bar-open' // User opens or expands the Bottom Bar
  | 'bottom-bar-see-more' // User clicks on the See More tab of the Bottom Bar
  | 'bottom-bar-view-course-information-on-roster' // User clicks View Course Information on Roster link on Bottom Bar
  | 'course-edit-color' // User edits the course color
  | 'subject-edit-color' // User edits the subject color
  | 'delete-collection' // User deletes a collection
  | 'delete-course' // User deletes a course
  | 'delete-course-collection' // User deletes a course from a collection
  | 'delete-semester' // User deletes a semester
  | 'delete-semester-courses' // User deletes all courses in a semester
  | 'delete-plan'
  | 'logout' // User logs out
  | 'onboarding-edit-basic-information' // User clicks to edit basic info on the review page of Onboarding
  | 'onboarding-edit-transfer-credits' // User clicks to edit transfer credits on the review page of Onboarding
  | 'requirements-bar-course-drag-and-drop' // User drags and drops a course from the Requirements Bar
  | 'requirements-bar-filled-requirements-toggle' // User toggles the SHOW/HIDE of Filled Requirements section on Requirements Bar
  | 'skip-walkthrough' // User clicks to skip the walkthrough
  | 'start-walkthrough' // User clicks to start the walkthrough
  | 'to-compact' // User sets the semester view to compact
  | 'to-not-compact'; // User sets the semester view to default

/**
 * GTagEvent represents a gtag event.
 * @param gtag is the global site tag that sends events to Google Analytics
 * @param eventType specifies the type of event that the gtag sends
 */
export const GTagEvent = (gtag: VueGtag | undefined, eventType: EventType): void => {
  if (!gtag) return;
  let eventPayload: EventPayload | undefined;
  switch (eventType) {
    case 'add-collection':
      eventPayload = {
        event_category: 'collection',
        event_label: 'add-collection',
        value: 1,
      };
      break;
    case 'add-course':
      eventPayload = {
        event_category: 'course',
        event_label: 'add',
        value: 1,
      };
      break;
    case 'add-course-collections':
      eventPayload = {
        event_category: 'collection',
        event_label: 'add-course-collections',
        value: 1,
      };
      break;
    case 'add-modal-edit-requirements':
      eventPayload = {
        event_category: 'add-modal',
        event_label: 'edit-requirements',
        value: 1,
      };
      break;
    case 'add-semester':
      eventPayload = {
        event_category: 'semester',
        event_label: 'add',
        value: 1,
      };
      break;
    case 'add-plan':
      eventPayload = {
        event_category: 'plan',
        event_label: 'add',
        value: 1,
      };
      break;
    case 'bottom-bar-close':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'close',
        value: 1,
      };
      break;
    case 'bottom-bar-CU-reviews-link':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'CU-reviews-link',
        value: 1,
      };
      break;
    case 'bottom-bar-delete-tab':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'delete-tab',
        value: 1,
      };
      break;
    case 'bottom-bar-open':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'open',
        value: 1,
      };
      break;
    case 'bottom-bar-see-more':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'see-more',
        value: 1,
      };
      break;
    case 'bottom-bar-view-course-information-on-roster':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'view-course-information-on-roster',
        value: 1,
      };
      break;
    case 'course-edit-color':
      eventPayload = {
        event_category: 'course',
        event_label: 'edit-color',
        value: 1,
      };
      break;
    case 'subject-edit-color':
      eventPayload = {
        event_category: 'subject',
        event_label: 'edit-color',
        value: 1,
      };
      break;
    case 'delete-collection':
      eventPayload = {
        event_category: 'collection',
        event_label: 'delete-collection',
        value: 1,
      };
      break;
    case 'delete-course':
      eventPayload = {
        event_category: 'course',
        event_label: 'delete',
        value: 1,
      };
      break;
    case 'delete-course-collection':
      eventPayload = {
        event_category: 'collection',
        event_label: 'delete-course-collection',
        value: 1,
      };
      break;
    case 'delete-semester':
      eventPayload = {
        event_category: 'semester',
        event_label: 'delete',
        value: 1,
      };
      break;
    case 'delete-semester-courses':
      eventPayload = {
        event_category: 'semester-courses',
        event_label: 'delete',
        value: 1,
      };
      break;
    case 'delete-plan':
      eventPayload = {
        event_category: 'semester',
        event_label: 'delete',
        value: 1,
      };
      break;
    case 'logout':
      eventPayload = {
        event_category: 'engagement',
        event_label: 'logout',
        value: 1,
      };
      break;
    case 'onboarding-edit-basic-information':
      eventPayload = {
        event_category: 'onboarding',
        event_label: 'edit-basic-information',
        value: 1,
      };
      break;
    case 'onboarding-edit-transfer-credits':
      eventPayload = {
        event_category: 'onboarding',
        event_label: 'edit-transfer-credits',
        value: 1,
      };
      break;
    case 'requirements-bar-course-drag-and-drop':
      eventPayload = {
        event_category: 'requirements-bar',
        event_label: 'course-drag-and-drop',
        value: 1,
      };
      break;
    case 'requirements-bar-filled-requirements-toggle':
      eventPayload = {
        event_category: 'requirements-bar',
        event_label: 'filled-requirements-toggle',
        value: 1,
      };
      break;
    case 'skip-walkthrough':
      eventPayload = {
        event_category: 'walkthrough',
        event_label: 'skip',
        value: 1,
      };
      break;
    case 'start-walkthrough':
      eventPayload = {
        event_category: 'walkthrough',
        event_label: 'start',
        value: 1,
      };
      break;
    case 'to-compact':
      eventPayload = {
        event_category: 'views',
        event_label: 'compact',
        value: 1,
      };
      break;
    case 'to-not-compact':
      eventPayload = {
        event_category: 'views',
        event_label: 'not-compact',
        value: 1,
      };
      break;
    default:
      return;
  }
  gtag.event(eventType, eventPayload);
};
