export const EVENTS = {
  START: new RegExp('/start'),
  HELP: new RegExp('/help'),
  ANY_DIGITS: /(\d+(\.\d{1,2})?)/,
  TOTAL_EXPENSES: /\/total(_expenses)?$/i
} as const;

export const eventsValues = Object.values(EVENTS);
