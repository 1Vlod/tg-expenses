import expensesRepository from '../../db/expenses/expenses.repository';
import { CreateExpenseParams } from './interfaces';
import {
  PREFIX,
  categoriesValues,
  currencyMap,
  paramsSeparator,
} from '../../constants';
import { Usecase } from '../interfaces';

export const createExpenseUsecase: Usecase<CreateExpenseParams> = async ({
  text,
  amount,
  userId,
  chatId,
  messageId,
}) => {
  const parsedMessage = text
    .replace(amount, ' ')
    .replace(/ +/g, ' ')
    .trim()
    .split(' '); // TODO: add handling "-" in description. Exmpl: "100 USD - lunch with friends"

  const [currency, ...descriptionArray] = parsedMessage;
  const description = descriptionArray.join(' ');

  const parsedCurrency = currencyMap[currency.toUpperCase()];

  if (!parsedCurrency) {
    return {
      error: true,
      message:
        `Currency *${currency}* is not supported.` +
        '\n' +
        'Please use command /currency to see the list of available currencies.',
    };
  }

  await expensesRepository.createExpense({
    userId,
    messageId,
    chatId,
    description,
    amount: parseFloat(amount),
    currency: parsedCurrency,
  });

  return {
    error: false,
    message: `You typed the amount: *${amount}* with currency *${parsedCurrency}* and description *${description}*`,
    buttons: categoriesValues.reduce(
      (acc, category) => {
        if (acc[acc.length - 1].length === 2) {
          acc.push([]);
        }

        acc[acc.length - 1].push({
          title: category,
          id: `${messageId}${paramsSeparator}c${category}`,
          prefix: PREFIX.EXPENSES_CATEGORY_SELECT,
        });

        return acc;
      },
      [[]] as { title: string; id: string; prefix: PREFIX }[][],
    ),
  };
};
