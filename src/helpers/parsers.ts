import { PREFIXES, PREFIX } from '../constants';
import { DATE_FILTERS, dateFiltersOptions } from '../constants/dateFilters';
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
  const options = dateFiltersOptions[date as DATE_FILTERS];
  if (!options) {
    return;
  }

  const from = new Date();
  from.setDate(from.getDate() + options.from);
  const to = new Date();
  to.setDate(to.getDate() + options.to);

  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
};
