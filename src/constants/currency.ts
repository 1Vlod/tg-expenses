const currencyCodes = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  AUD: 'AUD',
  RUB: 'RUB',
} as const;

const symbolsCurrencyMap = {
  $: currencyCodes.USD,
  '€': currencyCodes.EUR,
  '£': currencyCodes.GBP,
  A$: currencyCodes.AUD,
  '₽': currencyCodes.RUB,
};

const oneLetterCurrencyMap = {
  U: currencyCodes.USD,
  E: currencyCodes.EUR,
  G: currencyCodes.GBP,
  A: currencyCodes.AUD,
  R: currencyCodes.RUB,
};

const customCurrencyMap = {
  'US DOLLAR': currencyCodes.USD,
  EURO: currencyCodes.EUR,
  'BRITISH POUND': currencyCodes.GBP,
  'AUSTRALIAN DOLLAR': currencyCodes.AUD,
  'RUSSIAN RUBLE': currencyCodes.RUB,
  РУБ: currencyCodes.RUB,
  Р: currencyCodes.RUB,
  РУБЛЕЙ: currencyCodes.RUB, // TODO: think about same root
  РУБЛЬ: currencyCodes.RUB,
  РУБЛЯ: currencyCodes.RUB,
};

export const currencyMap: {
  [key: string]: (typeof currencyCodes)[keyof typeof currencyCodes] | undefined;
} = {
  ...currencyCodes,
  ...symbolsCurrencyMap,
  ...oneLetterCurrencyMap,
  ...customCurrencyMap,
};