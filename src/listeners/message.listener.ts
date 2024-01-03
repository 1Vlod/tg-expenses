import bot from '../modules/tgBot';
import { isEventMatch } from '../helpers';
import { MessageListener } from './interfaces';
import expensesRepository from '../db/expenses/expenses.repository';
import { EVENTS } from '../constants';
import { createExpenseUsecase } from '../usecases/createExpense';
import {
  categoriesValues,
  categoriesValuesString,
} from '../constants/categories';

export const messageListener: MessageListener = async msg => {
  const text = msg.text?.toLowerCase();
  const chatId = msg.chat.id;
  const userId = msg.from?.id;
  if (!text || isEventMatch(text)) {
    return;
  }

  if (
    msg.reply_to_message?.from?.is_bot ||
    userId !== msg.reply_to_message?.from?.id
  ) {
    await bot.sendMessage(
      chatId,
      'To add category, please reply to your expense message.',
    );
    return;
  }

  if (msg.reply_to_message) {
    const msgText = msg.reply_to_message.text;
    const amount = msgText?.match(EVENTS.ANY_DIGITS)?.[1];

    if (!amount) {
      await bot.sendMessage(
        chatId,
        'Expense amount was not found. To add category, please reply to your expense message.',
      );
      return;
    }

    if (amount && userId) {
      const originalMsgId = msg.reply_to_message.message_id;
      const expense = await expensesRepository.getExpenseByMessageId({
        messageId: originalMsgId,
        userId,
      });

      if (!expense) {
        const response = await createExpenseUsecase({
          amount,
          chatId,
          userId,
          text: msgText,
          messageId: originalMsgId,
        });
        if (response.error) {
          await bot.sendMessage(chatId, response.message);
          return;
        }
        await bot.sendMessage(
          chatId,
          'Expense was not found. Created new one.' + '\n' + response.message,
        );
      }

      const isValidCategory = categoriesValues.includes(text);

      if (!isValidCategory) {
        await bot.sendMessage(
          chatId,
          'Invalid category. Please use one from the list:' +
            '\n' +
            categoriesValuesString,
        );
        return;
      }

      await expensesRepository.updateExpenseByMessageId(
        {
          messageId: originalMsgId,
          userId,
        },
        {
          category: msg.text,
        },
      );
      await bot.sendMessage(chatId, `Expense category updated - ${text}`);

      return;
    }
  }

  bot.sendMessage(
    chatId,
    'Sorry, I did not understand that. Type /help for a list of available commands.',
  );
};
