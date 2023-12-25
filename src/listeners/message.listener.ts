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
  if (!text || isEventMatch(text)) {
    return;
  }

  if (
    msg.reply_to_message?.from?.is_bot ||
    msg.from?.id !== msg.reply_to_message?.from?.id
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

    if (amount && msg.from?.id) {
      const originalMsgId = msg.reply_to_message.message_id;
      const expense = await expensesRepository.getExpenseByMessageId({
        messageId: originalMsgId,
        userId: msg.from?.id,
      });

      if (!expense) {
        const response = await createExpenseUsecase({
          amount,
          chatId,
          text: msgText,
          userId: msg.from.id,
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

      await expensesRepository.updateExpenseByMessageId(originalMsgId, {
        category: msg.text,
      });
      await bot.sendMessage(chatId, `Expense category updated - ${text}`);

      return;
    }
  }

  bot.sendMessage(
    chatId,
    'Sorry, I did not understand that. Type /help for a list of available commands.',
  );
};
