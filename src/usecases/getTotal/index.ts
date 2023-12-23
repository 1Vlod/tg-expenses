import expensesRepository from '../../db/expenses/expenses.repository';
import { Usecase } from '../interfaces';
import { GetTotalParams } from './interfaces';

export const getTotalUsecase: Usecase<GetTotalParams> = async ({
  timeRange,
  ...params
}) => {
  const total = await expensesRepository.getTotal(params);
  if (total.length === 0) {
    return {
      message: `You don't have expenses for *${timeRange}*.`,
    };
  }

  const totalString = total
    .map(({ currency, total }) => `\n*${currency}:* ${total}`)
    .join('');

  return {
    message: `Your total expenses for *${timeRange}*: ${totalString}`,
  };
};
