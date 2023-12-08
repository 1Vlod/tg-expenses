import expensesRepository from '../../db/expenses/expenses.repository';
import { Usecase } from '../interfaces';
import { GetExpensesParams } from './interfaces';

export const getEpxensesUsecase: Usecase<GetExpensesParams> = async params => {
  const expenses = await expensesRepository.getExpenses(params);

  const message = expenses.length
    ? `You have ${expenses.length} expenses for this period.\nHere is your expenses list: `
    : 'You have no expenses for this period.';
  const buttons = expenses.map(
    ({ _id, createdAt, amount, currency, description }) => [
      {
        title: `${createdAt
          .toISOString()
          .slice(0, 10)}: ${amount} | ${currency} - ${description}`,
        id: _id,
      },
    ],
  );

  return {
    message,
    buttons,
  };
};
