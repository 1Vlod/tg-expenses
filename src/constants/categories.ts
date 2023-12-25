export enum CATEGORIES {
  COFFEE = 'кофейни',
  RESTAURANTS = 'рестораны',
  TRANSPORT = 'транспорт',
  GROCERIES = 'продукты',
  ENTERTAINMENT = 'развлечения',
  CLOTHES = 'одежда',
  HOUSE = 'дом',
  HEALTH = 'здоровье',
  GIFTS = 'подарки',
  FAST_FOOD = 'фастфуд',
  PETS = 'домашние животные',
  SPORT = 'спорт',
  OTHER = 'другое',
}

export const categoriesValues = Object.values(CATEGORIES) as string[];

export const categoriesValuesString = categoriesValues.join('\n');
