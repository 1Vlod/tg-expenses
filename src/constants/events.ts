export const EVENTS = {
  START: new RegExp('/start'),
  HELP: new RegExp('/help'),
  ANY_DIGITS: /(\d+(\.\d{1,2})?)/,
  MY_EXPENSES: new RegExp('/my_expenses'),
} as const;

export const eventsValues = Object.values(EVENTS);
