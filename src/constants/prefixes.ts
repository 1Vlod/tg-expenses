export enum PREFIX {
  EXPENSES_DATE_FILTER = 'exdf', // Using such a small prefix because tg callback_data has a limit of 64 bytes
  EXPENSES_DATE_FILTER_TOTAL = 'exdft',
  EXPENSES_GET_ONE = 'exg1',
  EXPENSES_EDIT = 'exed',
  EXPENSES_DELETE = 'exd',

  // MESSAGE_CANCEL = 'mc',
}

export const PREFIXES = Object.values(PREFIX);
