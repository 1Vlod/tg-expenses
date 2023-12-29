export const EVENTS = {
  START: new RegExp('/start'),
  HELP: new RegExp('/help'),
  СURRENCY: new RegExp('/currency'),
  ANY_DIGITS: /(\d+(\.\d{1,2})?)/,
  TOTAL_EXPENSES: /\/total/i,
  EXPENSES: /\/expenses/i,
} as const;

export const eventsValues = Object.values(EVENTS);
