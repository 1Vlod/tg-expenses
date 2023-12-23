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

const MONTH_START_DAY = 1;
const ISO_DATE_LENGTH = 10;

export const parseDateFilter = (
  dateFilterKey: string,
): { from: string; to: string } | undefined => {
  const options = dateFiltersOptions[dateFilterKey as DATE_FILTERS];
  if (!options) {
    return;
  }

  const from = new Date();
  from.setDate(from.getDate() + options.from);
  const to = new Date();
  to.setDate(to.getDate() + options.to);

  if (options.month !== undefined) {
    from.setFullYear(
      from.getFullYear(),
      from.getMonth() + options.month,
      MONTH_START_DAY,
    );
    to.setFullYear(
      to.getFullYear(),
      to.getMonth() + options.month + 1,
      MONTH_START_DAY,
    );
  }

  if (options.weekStartDay && options.weekLength) {
    const day = from.getDay();
    const diff = from.getDate() - day + (day === 0 ? -6 : options.weekStartDay);
    from.setDate(diff);
    to.setDate(from.getDate() + options.weekLength);
  }

  return {
    from: from.toISOString().slice(0, ISO_DATE_LENGTH),
    to: to.toISOString().slice(0, ISO_DATE_LENGTH),
  };
};
