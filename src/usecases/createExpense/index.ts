import expensesRepository from '../../db/expenses/expenses.repository';
import { CreateExpenseParams } from './interfaces';
import { currencyMap } from '../../constants';
import { Usecase } from '../interfaces';

export const createExpenseUsecase: Usecase<CreateExpenseParams> = async ({
  text,
  amount,
  userId,
  chatId,
  messageId,
}) => {
  const info = text.replace(amount, ' ').replace(/ +/g, ' ').trim().split(' '); // TODO: add handling "-" in description. Exmpl: "100 USD - lunch with friends"

  const [currency, ...descriptionArray] = info;
  const description = descriptionArray.join(' ');

  const parsedCurrency = currencyMap[currency.toUpperCase()] || currency;

  await expensesRepository.createExpense({
    userId,
    messageId,
    chatId,
    amount: parseFloat(amount),
    currency: parsedCurrency,
    description,
  });

  return {
    error: false,
    message: `You typed the amount: *${amount}* with currency *${parsedCurrency}* and description *${description}*`,
  };
};
