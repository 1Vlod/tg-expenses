export * from './message.listener';
export * from './callbackQuery';

import bot from '../modules/tgBot';
import { EVENTS, PREFIX, currencyMap } from '../constants';
import { TGListener } from './interfaces';
import expensesRepository from '../db/expenses/expenses.repository';

export const listeners: TGListener[] = [
  {
    event: EVENTS.ANY_DIGITS,
    handler: (msg, match) => {
      const chatId = msg.chat.id;
      const amount = match?.[1];
      // TODO: add helper for checking that at least one falsy
      if (!amount || !msg.text || !msg.from?.id) {
        bot.sendMessage(chatId, 'Invalid format. Please use default format.'); // TODO: add default format example
        return;
      }
      const info = msg.text
        .replace(amount, ' ')
        .replace(/ +/g, ' ')
        .trim()
        .split(' ');

      const [currency, ...descriptionArray] = info;
      const description = descriptionArray.join(' ');

      const parsedCurrency = currencyMap[currency.toUpperCase()] || currency;

      expensesRepository.createExpense({
        userId: msg.from?.id,
        messageId: msg.message_id,
        chatId: msg.chat.id,
        amount: parseFloat(amount),
        currency: parsedCurrency,
        description,
      });

      bot.sendMessage(
        chatId,
        `You typed the amount: *${amount}* with currency *${parsedCurrency}* and description *${description}*`,
      );
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
      const total = await expensesRepository.getTotal(msg.from.id);
      const totalString = total.map(
        ({ currency, total }) => `\n*${total}:* ${currency}`,
      );
      bot.sendMessage(chatId, `Your total expenses: ${totalString}`);
    },
  },

  {
    event: EVENTS.HELP,
    handler: msg => {
      const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        'Available commands:\n/start - Start the bot\n/help - Show this help message',
      );
    },
  },

  {
    event: EVENTS.START,
    handler: msg => {
      bot.sendMessage(msg.chat.id, 'Welcome to my Telegram bot!');
    },
  },

  {
    event: EVENTS.EXPENSES,
    handler(msg) {
      bot.sendInlineKeyboard({
        chatId: msg.chat.id,
        text: 'Choose date range:',
        keyboard: {
          keys: [
            [{ title: 'Today' }, { title: 'Yesterday' }, { title: 'Week' }],
            [{ title: 'Cancel' }],
          ],
          commonPrefix: PREFIX.EXPENSES_DATE_FILTER,
        },
      });
    },
  },
];
