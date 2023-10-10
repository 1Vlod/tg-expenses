import { eventsValues } from '../constants';

export const isEventMatch = (text: string) => {
  return eventsValues.some(event => event.test(text));
};
