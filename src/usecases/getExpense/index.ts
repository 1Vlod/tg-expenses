import expensesRepository from '../../db/expenses/expenses.repository';
import { GetExpenseParams } from './interfaces';
import { PREFIX } from '../../constants';
import { Usecase } from '../interfaces';

export const getEpxenseUsecase: Usecase<GetExpenseParams> = async params => {
  const expense = await expensesRepository.getExpenseById(params.id);
  if (!expense) {
    return {
      message: 'Expense was not found.',
      buttons: [],
    };
  }

  const message = `*${expense.createdAt.toISOString().slice(0, 10)}*: ${
    expense.amount
  } *${expense.currency}* - ${expense.description || 'Without description'}`;

  return {
    message,
    buttons: [
      [
        {
          title: 'Edit',
          id: expense?._id,
          prefix: PREFIX.EXPENSES_EDIT,
        },
        {
          title: 'Delete',
          id: expense?._id,
          prefix: PREFIX.EXPENSES_DELETE,
        },
      ],
    ],
  };
};
