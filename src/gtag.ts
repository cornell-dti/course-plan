/* eslint-disable camelcase */
type EventPayload = { event_category: string; event_label: string; value: number };
type LoginEventPayload = { method: string };

export type GTag = {
  event(eventType: string, eventPayload: LoginEventPayload | EventPayload): void;
};

export const GTagLoginEvent = (gtag: GTag | undefined, method: string): void => {
  if (!gtag) return;
  gtag.event('login', { method });
};

export const GTagEvent = (gtag: GTag | undefined, eventType: string): void => {
  if (!gtag) return;
  let eventPayload: EventPayload | undefined;
  switch (eventType) {
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
    default:
      return;
  }
  gtag.event(eventType, eventPayload);
};
