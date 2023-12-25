export enum DATE_FILTERS {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'this week',
  PREV_WEEK = 'prev week',
  THIS_MONTH = 'this month',
  PREV_MONTH = 'prev month',
  THIS_WEEKEND = 'this weekend',
  LAST_WEEKEND = 'last weekend',
  LAST_2_DAYS = 'last 2 days',
  LAST_3_DAYS = 'last 3 days',
  WEEK = 'week',
  LAST_2_WEEKS = 'last 2 weeks',
  MONTH = 'month',
  YEAR = 'year',
  ALL_TIME = 'all time',
}

export interface DateFilterOptions {
  from: number;
  to: number;
  weekStartDay?: number;
  weekLength?: number;
  month?: number;
}

export const dateFiltersOptions: {
  [key in DATE_FILTERS]: DateFilterOptions;
} = {
  [DATE_FILTERS.TODAY]: {
    from: 0,
    to: +1,
  },
  [DATE_FILTERS.YESTERDAY]: {
    from: -1,
    to: 0,
  },
  [DATE_FILTERS.LAST_2_DAYS]: {
    from: -2,
    to: +1,
  },
  [DATE_FILTERS.LAST_3_DAYS]: {
    from: -3,
    to: +1,
  },
  [DATE_FILTERS.THIS_WEEK]: {
    from: 0,
    to: 0,
    weekStartDay: 1,
    weekLength: 7,
  },
  [DATE_FILTERS.PREV_WEEK]: {
    from: -7,
    to: -7,
    weekStartDay: 1,
    weekLength: 7,
  },
  [DATE_FILTERS.THIS_MONTH]: {
    from: 0,
    to: 0,
    month: 0,
  },
  [DATE_FILTERS.PREV_MONTH]: {
    from: 0,
    to: 0,
    month: -1,
  },
  [DATE_FILTERS.THIS_WEEKEND]: {
    from: 0,
    to: 0,
    weekStartDay: 5,
    weekLength: 3,
  },
  [DATE_FILTERS.LAST_WEEKEND]: {
    from: -7,
    to: -7,
    weekStartDay: 5,
    weekLength: 3,
  },
  [DATE_FILTERS.WEEK]: {
    from: -7,
    to: +1,
  },
  [DATE_FILTERS.LAST_2_WEEKS]: {
    from: -14,
    to: +1,
  },
  [DATE_FILTERS.MONTH]: {
    from: -30,
    to: +1,
  },
  [DATE_FILTERS.YEAR]: {
    from: -365,
    to: +1,
  },
  [DATE_FILTERS.ALL_TIME]: {
    from: -3650,
    to: +1,
  },
};
