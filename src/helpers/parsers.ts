import { PREFIXES, PREFIX } from '../constants';
import { CallbackQueryData } from '../listeners/callbackQuery/interfaces';

export const parseCallbackQueryData = (data = '') => {
  if (!data) return null;
  try {
    const parsedData = data.split('.');
    if (!parsedData) {
      return null;
    }
    const [prefix, key] = parsedData;
    if (!PREFIXES.includes(prefix as PREFIX) || !key) {
      return null;
    }
    return {
      prefix,
      key,
    } as CallbackQueryData;
  } catch (error) {
    console.error('Invalid callback query data', data);
    return null;
  }
};
