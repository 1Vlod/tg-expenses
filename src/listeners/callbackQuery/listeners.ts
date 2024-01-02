import { Errors, PREFIX, paramsSeparator } from '../../constants';
import { getEpxensesUsecase } from '../../usecases/getExpenses';
import { getEpxenseUsecase } from '../../usecases/getExpense';
import { CallbackQueryListenersMap } from './interfaces';
import { deleteEpxenseUsecase } from '../../usecases/deleteExpense';
import { parseDateFilter } from '../../helpers/parsers';
import { getTotalUsecase } from '../../usecases/getTotal';
import { setCategoryUsecase } from '../../usecases/setCategory';

export const CALLBACK_QUERY_LISTENERS_MAP: CallbackQueryListenersMap = {
  [PREFIX.EXPENSES_DATE_FILTER]: async (ctx, callbackQueryData) => {
    const [timeRange, pageFilter = 'p0'] =
      callbackQueryData.split(paramsSeparator);
    const dateFilters = parseDateFilter(timeRange);
    if (!dateFilters) {
      return {
        error: true,
        message: 'Invalid date filter',
        userErrorMessage: 'Unsupported date filter. Please try again later.',
      };
    }
    const page = +pageFilter.slice(1);
    if (pageFilter && isNaN(page)) {
      return {
        error: true,
        message: `Invalid page number: ${pageFilter}`,
        userErrorMessage: 'Unsupported page number. Please try again later.',
      };
    }

    const response = await getEpxensesUsecase({
      userId: ctx.userId,
      timeRange,
      page,
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

  [PREFIX.EXPENSES_EDIT]: async (/*ctx: _, callbackQueryData*/) => {
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

  [PREFIX.EXPENSES_DATE_FILTER_TOTAL]: async (ctx, callbackQueryData) => {
    const dateFilters = parseDateFilter(callbackQueryData);
    if (!dateFilters) {
      return {
        error: true,
        message: 'Invalid date filter',
        userErrorMessage: 'Unsupported date filter. Please try again later.',
      };
    }

    const response = await getTotalUsecase({
      userId: ctx.userId,
      timeRange: callbackQueryData,
      ...dateFilters,
    });

    return {
      response,
    };
  },

  [PREFIX.EXPENSES_CATEGORY_SELECT]: async (ctx, callbackQueryData) => {
    const [msgId, category = ''] = callbackQueryData.split(paramsSeparator);
    const parsedCategory = category.slice(1);

    if (!msgId || !parsedCategory) {
      return {
        error: true,
        message: 'Invalid params',
        userErrorMessage: Errors.defaultUserErrorMessage,
      };
    }

    const response = await setCategoryUsecase({
      category: parsedCategory,
      messageId: +msgId,
      userId: ctx.userId,
    });

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
