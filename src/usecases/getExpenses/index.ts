import expensesRepository from '../../db/expenses/expenses.repository';
import { PREFIX, paramsSeparator } from '../../constants';
import { Usecase } from '../interfaces';
import { GetExpensesParams } from './interfaces';

export const getEpxensesUsecase: Usecase<GetExpensesParams> = async ({
  timeRange,
  page = 0,
  ...params
}) => {
  const result = await expensesRepository.getExpenses({ page, ...params });
  const { expenses, totalCount } = result;
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

  if (page > 0) {
    const showLessButton = {
      title: '⬆️ | Back ',
      id: `${timeRange}${paramsSeparator}p${page - 1}`,
      prefix: PREFIX.EXPENSES_DATE_FILTER,
    };
    buttons.push([showLessButton]);
  }
  const pages = Math.ceil(totalCount / 10);
  if (expenses.length < totalCount && page < pages - 1) {
    const showMoreButton = {
      title: '⬇️ | Next ',
      id: `${timeRange}${paramsSeparator}p${page + 1}`,
      prefix: PREFIX.EXPENSES_DATE_FILTER,
    };
    buttons.push([showMoreButton]);
  }

  const message =
    `You have ${totalCount} expenses for *${timeRange}*.` +
    '\n' +
    `Here is your expenses: `;

  return {
    message,
    buttons,
  };
};
