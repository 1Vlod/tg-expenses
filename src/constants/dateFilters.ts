export enum DATE_FILTERS {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  WEEK = 'week',
  LAST_2_DAYS = 'last 2 days',
  LAST_3_DAYS = 'last 3 days',
  LAST_2_WEEKS = 'last 2 weeks',
  MONTH = 'month',
  YEAR = 'year',
  ALL_TIME = 'all time',
}


export const dateFiltersOptions: {
  [key in Lowercase<DATE_FILTERS>]: { from: number; to: number };
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
