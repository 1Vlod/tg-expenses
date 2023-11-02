import expensesRepository from '../../db/expenses/expenses.repository';
import { DeleteExpenseParams } from './interfaces';
import { Usecase } from '../interfaces';

export const deleteEpxenseUsecase: Usecase<
  DeleteExpenseParams
> = async params => {
  const expense = await expensesRepository.deleteExpense(params.id);
  if (!expense) {
    return {
      error: true,
      message: 'Expense was not found.',
    };
  }
  return {
    message: 'Expense was deleted.',
  };
};
