import { PREFIX } from '../../constants';
import { getEpxensesUsecase } from '../../usecases/getExpenses';
import { getEpxenseUsecase } from '../../usecases/getExpense';
import { CallbackQueryListenersMap } from './interfaces';
import { deleteEpxenseUsecase } from '../../usecases/deleteExpense';
import { parseDateFilter } from '../../helpers/parsers';

export const CALLBACK_QUERY_LISTENERS_MAP: CallbackQueryListenersMap = {
  [PREFIX.EXPENSES_DATE_FILTER]: async (ctx, callbackQueryData) => {
    const dateFilters = parseDateFilter(callbackQueryData);
    if (!dateFilters) {
      throw new Error('Invalid date filter');
    }

    const response = await getEpxensesUsecase({
      userId: ctx.userId,
      ...dateFilters,
    });

    return {
      prefix: PREFIX.EXPENSES_GET_ONE,
      response,
    };
  },
  [PREFIX.EXPENSES_GET_ONE]: async (_, callbackQueryData) => {
    const expenseId = callbackQueryData;

    const response = await getEpxenseUsecase({
      id: expenseId,
    });

    return {
      response,
    };
  },

  [PREFIX.EXPENSES_EDIT]: async (ctx, callbackQueryData) => {
    return {
      error: true,
      message: 'Not implemented yet',
    };
  },

  [PREFIX.EXPENSES_DELETE]: async (ctx, callbackQueryData) => {
    const expenseId = callbackQueryData;

    const response = await deleteEpxenseUsecase({ id: expenseId });

    if (response.error) {
      return response;
    }

    return {
      response: {
        message: response.message,
      },
    };
  },
};
