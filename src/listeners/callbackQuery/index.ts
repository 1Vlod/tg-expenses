import bot from '../../modules/tgBot';
import { CallbackQueryListener } from '../interfaces';
import { CALLBACK_QUERY_LISTENERS_MAP } from './listeners';
import { parseCallbackQueryData } from '../../helpers/parsers';
import { Errors } from '../../constants';

export const callbackQueryListener: CallbackQueryListener = async query => {
  const chatId = query.message?.chat.id;
  if (!chatId) {
    return;
  }
  try {
    const queryData = parseCallbackQueryData(query.data);
    if (!queryData) {
      console.error('Invalid callback query data', query.data);
      await bot.sendMessage(chatId, Errors.defaultUserErrorMessage);
      return;
    }
    const { prefix, key } = queryData;

    if (key.includes('cancel') || key.includes('🚫')) {
      return;
    }

    const ctx = {
      chatId,
      userId: query.from.id,
      messageText: query.message?.text,
    };
    const handler = CALLBACK_QUERY_LISTENERS_MAP[prefix];
    const handlerResponse = await handler(ctx, key);

    if (handlerResponse.error) {
      console.error(
        'Prefix: %s, key: %s, ctx: %s, handler: %s, error: %s',
        prefix,
        key,
        JSON.stringify(ctx),
        handler.name,
        handlerResponse.message,
      );
      await bot.sendMessage(
        chatId,
        handlerResponse.userErrorMessage || Errors.defaultUserErrorMessage,
      );
      return;
    }

    const {
      response: { message, buttons },
      prefix: responsePrefix,
    } = handlerResponse;

    await bot.sendMessage(chatId, message, {
      keyboard: {
        keys: buttons,
        commonPrefix: responsePrefix,
      },
    });
  } catch (error) {
    console.error('Unexpected error in callbackQueryListener', error);
    await bot.sendMessage(chatId, Errors.defaultUserErrorMessage);
  } finally {
    await bot.answerCallbackQuery(query.id);
    if (query.message?.message_id) {
      await bot.deleteMessage(chatId, query.message?.message_id);
    }
  }
};
