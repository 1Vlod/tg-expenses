import bot from '../modules/tgBot';
import { EVENTS, currencyMap } from '../constants';
import { TGListener } from './interfaces';
import expensesRepository from '../db/expenses/expenses.repository';
import { isEventMatch } from '../helpers';

export const listeners: TGListener[] = [
  {
    type: 'text',
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

      const parsedCurrency = currencyMap[info[0].toUpperCase()] || info[0];

      expensesRepository.createExpense({
        userId: msg.from?.id.toString(),
        messageId: msg.message_id,
        chatId: msg.chat.id,
        amount: parseFloat(amount),
        currency: parsedCurrency,
        description: info[1],
      });

      bot.sendMessage(
        chatId,
        `You typed the amount: *${amount}* with currency *${parsedCurrency}* and description *${info[1]}*`,
        {
          parse_mode: 'Markdown',
        },
      );
    },
  },

  {
    type: 'text',
    event: EVENTS.MY_EXPENSES,
    handler: async msg => {
      const chatId = msg.chat.id;
      if (!msg.from?.id) {
        bot.sendMessage(chatId, 'Invalid format. Please use default format.'); // TODO: add default format example
        return;
      }
      const expenses = await expensesRepository.getExpenses(
        msg.from?.id.toString() || '',
      );
      if (!expenses.length) {
        bot.sendMessage(chatId, 'You have no expenses yet.');
        return;
      }
      const expensesList = expenses
        .map(
          expense =>
            `*${expense.amount}* ${expense.currency} - ${expense.description}`,
        )
        .join('\n');
      bot.sendMessage(chatId, expensesList, { parse_mode: 'Markdown' });
    },
  },

  {
    type: 'text',
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
    type: 'text',
    event: EVENTS.START,
    handler: msg => {
      bot.sendMessage(msg.chat.id, 'Welcome to my Telegram bot!');
    },
  },

  {
    type: 'message',
    handler: msg => {
      if (!msg.text || isEventMatch(msg.text)) {
        return;
      }
      bot.sendMessage(
        msg.chat.id,
        'Sorry, I did not understand that. Type /help for a list of available commands.',
      );
    },
  },
];
