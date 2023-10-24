import { PREFIX } from '../../constants';
import { getEpxensesUsecase } from '../../usecases/getExpenses';
import { parseDateFilterUsecase } from '../../usecases/parseDateFilter';
import { getEpxenseUsecase } from '../../usecases/getExpense';
import { CallbackQueryContext } from './interfaces';

export const CALLBACK_QUERY_LISTENERS_MAP: {
  [key in PREFIX]: (
    ctx: CallbackQueryContext,
    callbackQueryData: string,
  ) => Promise<
    | {
        response: {
          message: string;
          buttons: { title: string; id?: string, prefix?: PREFIX }[][];
        };
        prefix?: PREFIX;
        error?: false;
      }
    | {
        message: string;
        error: true;
      }
  >;
} = {
  [PREFIX.EXPENSES_DATE_FILTER]: async (ctx, callbackQueryData) => {
    const dateFilters = parseDateFilterUsecase(callbackQueryData);
    if (!dateFilters) {
      throw new Error('Invalid date filter');
    }

    const response = await getEpxensesUsecase({
      userId: ctx.userId,
      ...dateFilters,
    });

    return {
      status: 'ok',
      prefix: PREFIX.EXPENSES_GET_ONE,
      response,
    };
  },
  [PREFIX.EXPENSES_GET_ONE]: async (_, callbackQueryData) => {
    const expenseId = callbackQueryData;

    const message = await getEpxenseUsecase({
      id: expenseId,
    });

    return {
      status: 'ok',
      response: message,
    };
  },

  [PREFIX.EXPENSES_EDIT]: async (ctx, callbackQueryData) => {
    return {
      error: true,
      message: 'Not implemented yet',
    };
  },

  [PREFIX.EXPENSES_DELETE]: async (ctx, callbackQueryData) => {
    return {
      error: true,
      message: 'Not implemented yet',
    };
  },
};
