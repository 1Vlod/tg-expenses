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

export const parseDateFilter = (
  date: string,
): { from: string; to: string } | undefined => {
  if (date === 'today') {
    const from = new Date().toISOString().slice(0, 10);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const to = tomorrow.toISOString().slice(0, 10);
    return {
      from,
      to,
    };
  }

  if (date === 'yesterday') {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      from: yesterday.toISOString().slice(0, 10),
      to: new Date().toISOString().slice(0, 10),
    };
  }
  if (date === 'week') {
    const week = new Date();
    week.setDate(week.getDate() - 7);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const to = tomorrow.toISOString().slice(0, 10);
    return {
      from: week.toISOString().slice(0, 10),
      to,
    };
  }
};
