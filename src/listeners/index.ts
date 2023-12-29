export * from './message.listener';
export * from './callbackQuery';

import bot from '../modules/tgBot';
import { EVENTS, PREFIX, currencyMessage } from '../constants';
import { TGListener } from './interfaces';
import { dateFiltersButtons, helpTemplate, startMessage } from '../templates';
import { createExpenseUsecase } from '../usecases/createExpense';

export const listeners: TGListener[] = [
  {
    event: EVENTS.ANY_DIGITS,
    handler: async (msg, match) => {
      const chatId = msg.chat.id;
      const amount = match?.[1];
      // TODO: add helper for checking that at least one falsy
      if (!amount || !msg.text || !msg.from?.id) {
        bot.sendMessage(chatId, 'Invalid format. Please use default format.'); // TODO: add default format example
        return;
      }

      const response = await createExpenseUsecase({
        amount,
        chatId,
        text: msg.text,
        userId: msg.from.id,
        messageId: msg.message_id,
      });

      await bot.sendMessage(chatId, response.message);
    },
  },

  {
    event: EVENTS.TOTAL_EXPENSES,
    handler: async msg => {
      const chatId = msg.chat.id;
      if (!msg.from?.id) {
        bot.sendMessage(chatId, 'Invalid format. Please use default format.'); // TODO: add default format example
        return;
      }

      bot.sendInlineKeyboard({
        chatId: msg.chat.id,
        text: 'Choose date range:',
        keyboard: {
          keys: dateFiltersButtons,
          commonPrefix: PREFIX.EXPENSES_DATE_FILTER_TOTAL,
        },
      });
    },
  },

  {
    event: EVENTS.HELP,
    handler: msg => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, helpTemplate);
    },
  },

  {
    event: EVENTS.START,
    handler: msg => {
      bot.sendMessage(msg.chat.id, startMessage);
    },
  },

  {
    event: EVENTS.СURRENCY,
    handler: msg => {
      bot.sendMessage(msg.chat.id, currencyMessage);
    },
  },

  {
    event: EVENTS.EXPENSES,
    handler(msg) {
      bot.sendInlineKeyboard({
        chatId: msg.chat.id,
        text: 'Choose date range:',
        keyboard: {
          keys: dateFiltersButtons,
          commonPrefix: PREFIX.EXPENSES_DATE_FILTER,
        },
      });
    },
  },
];
