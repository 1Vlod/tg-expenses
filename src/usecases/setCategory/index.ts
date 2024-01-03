import expensesRepository from '../../db/expenses/expenses.repository';
import { SetCategoryParams } from './interfaces';
import { categoriesValues } from '../../constants';
import { Usecase } from '../interfaces';

export const setCategoryUsecase: Usecase<SetCategoryParams> = async ({
  category,
  messageId,
  userId,
}) => {
  if (!categoriesValues.includes(category)) {
    return {
      error: true,
      message: 'Invalid category',
      userErrorMessage: 'Unsupported category. Please try again later.',
    };
  }

  await expensesRepository.updateExpenseByMessageId(
    {
      messageId,
      userId,
    },
    {
      category,
    },
  );

  return {
    message: `Expense category updated - ${category}`,
  };
};
