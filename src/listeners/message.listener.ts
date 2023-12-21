import bot from '../modules/tgBot';
import { isEventMatch } from '../helpers';
import { MessageListener } from './interfaces';
import expensesRepository from '../db/expenses/expenses.repository';
import { EVENTS } from '../constants';
import { createExpenseUsecase } from '../usecases/createExpense';
import { categoriesValues } from '../constants/categories';

export const messageListener: MessageListener = async msg => {
  if (!msg.text || isEventMatch(msg.text)) {
    return;
  }

  if (msg.reply_to_message) {
    const msgText = msg.reply_to_message.text;
    const amount = msgText?.match(EVENTS.ANY_DIGITS)?.[1];
    if (amount && msg.from?.id) {
      const originalMsgId = msg.reply_to_message.message_id;
      const expense = await expensesRepository.getExpenseByMessageId({
        messageId: originalMsgId,
        userId: msg.from?.id,
      });

      if (!expense) {
        const response = await createExpenseUsecase({
          amount,
          chatId: msg.chat.id,
          text: msgText,
          userId: msg.from.id,
          messageId: originalMsgId,
        });
        if (response.error) {
          await bot.sendMessage(msg.chat.id, response.message);
          return;
        }
        await bot.sendMessage(
          msg.chat.id,
          'Expense was not found. Created new one.' + '\n' + response.message,
        );
      }

      const isValidCategory = categoriesValues.includes(msg.text as any);

      if (!isValidCategory) {
        await bot.sendMessage(
          msg.chat.id,
          'Invalid category. Please use one from the list:' +
            '\n' +
            categoriesValues.join('\n'),
        );
        return;
      }

      await expensesRepository.updateExpenseByMessageId(originalMsgId, {
        category: msg.text,
      });
      await bot.sendMessage(
        msg.chat.id,
        `Expense category updated - ${msg.text}`,
      );

      return;
    }
  }

  bot.sendMessage(
    msg.chat.id,
    'Sorry, I did not understand that. Type /help for a list of available commands.',
  );
};
