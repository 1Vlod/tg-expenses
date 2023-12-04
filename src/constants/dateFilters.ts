export enum DATE_FILTERS {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  WEEK = 'week',
}

export const dateFiltersOptions: {
  [key in DATE_FILTERS]: { from: number; to: number };
} = {
  [DATE_FILTERS.TODAY]: {
    from: 0,
    to: +1,
  },
  [DATE_FILTERS.YESTERDAY]: {
    from: -1,
    to: 0,
  },
  [DATE_FILTERS.WEEK]: {
    from: -7,
    to: +1,
  },
};
