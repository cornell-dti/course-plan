/* eslint-disable camelcase */
type EventPayload = { event_category: string; event_label: string; value: number };
type LoginEventPayload = { method: string };

export type GTag = {
  event(eventType: string, eventPayload: LoginEventPayload | EventPayload): void;
};

/** GTagLoginEvent represents the gtag that tracks when users login. */
export const GTagLoginEvent = (gtag: GTag | undefined, method: string): void => {
  if (!gtag) return;
  gtag.event('login', { method });
};

/**
 * GTagEvent represents a gtag event.
 * @param gtag is the global site tag that sends events to Google Analytics
 * @param eventType specifies the type of event that the gtag sends
 * eventType === 'logout': User logs out
 *
 * eventType === 'to-compact': User sets the semester view to compact
 *
 * eventType === 'to-not-compact': User sets the semester view to default
 *
 * eventType === 'add-semester': User adds a semester
 *
 * eventType === 'delete-semester': User deletes a semester
 *
 * eventType === 'add-course': User adds a course
 *
 * eventType === 'delete-course': User deletes a course
 *
 * eventType === 'course-edit-color': User edits the course color
 *
 * eventType === 'start-walkthrough': User clicks to start the walkthrough
 *
 * eventType === 'skip-walkthrough': User clicks to skip the walkthrough
 *
 * eventType === 'onboarding-edit-basic-information': User clicks to edit basic info on the review page of Onboarding
 *
 * eventType === 'onboarding-edit-transfer-credits': User clicks to edit transfer credits on the review page of Onboarding
 *
 * eventType === 'bottom-bar-see-all-reviews': User clicks See All Reviews link on Bottom Bar
 *
 * eventType === 'bottom-bar-view-course-information-on-roster': User clicks View Course Information on Roster link on Bottom Bar
 *
 * eventType === 'bottom-bar-see-more': User clicks on the See More tab of the Bottom Bar
 *
 * eventType === 'bottom-bar-delete-tab': User deletes a tab on the Bottom Bar
 *
 * eventType === 'bottom-bar-open': User opens or expands the Bottom Bar
 *
 * eventType === 'bottom-bar-close': User collapses or closes the Bottom Bar
 *
 * eventType === 'add-modal-edit-requirements': User clicks Edit Requirements on Add Modal
 *
 * eventType === 'requirements-bar-filled-requirements-toggle': User toggles the SHOW/HIDE of Filled Requirements section on Requirements Bar
 *
 * eventType === 'requirements-bar-course-drag-and-drop': User drags and drops a course from the Requirements Bar
 */
export const GTagEvent = (gtag: GTag | undefined, eventType: string): void => {
  if (!gtag) return;
  let eventPayload: EventPayload | undefined;
  switch (eventType) {
    case 'logout':
      eventPayload = {
        event_category: 'engagement',
        event_label: 'logout',
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
    case 'add-semester':
      eventPayload = {
        event_category: 'semester',
        event_label: 'add',
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
    case 'add-course':
      eventPayload = {
        event_category: 'course',
        event_label: 'add',
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
    case 'course-edit-color':
      eventPayload = {
        event_category: 'course',
        event_label: 'edit-color',
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
    case 'skip-walkthrough':
      eventPayload = {
        event_category: 'walkthrough',
        event_label: 'skip',
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
    case 'bottom-bar-see-all-reviews':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'see-all-reviews',
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
    case 'bottom-bar-see-more':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'see-more',
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
    case 'bottom-bar-close':
      eventPayload = {
        event_category: 'bottom-bar',
        event_label: 'close',
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
    case 'requirements-bar-filled-requirements-toggle':
      eventPayload = {
        event_category: 'requirements-bar',
        event_label: 'filled-requirements-toggle',
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
    default:
      return;
  }
  gtag.event(eventType, eventPayload);
};
