import expensesRepository from '../../db/expenses/expenses.repository';
import { Usecase } from '../interfaces';
import { GetExpensesParams } from './interfaces';

export const getEpxensesUsecase: Usecase<GetExpensesParams> = async ({
  timeRange,
  ...params
}) => {
  const expenses = await expensesRepository.getExpenses(params);
  if (expenses.length === 0) {
    return {
      message: `You have no expenses for *${timeRange}*.`,
    };
  }

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
    message: `You have ${expenses.length} expenses for *${timeRange}*.\nHere is your expenses list: `,
    buttons,
  };
};
