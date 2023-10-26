import bot from '../../modules/tgBot';
import { CallbackQueryListener } from '../interfaces';
import { PREFIX } from '../../constants';
import { CALLBACK_QUERY_LISTENERS_MAP } from './listeners';
import { parseCallbackQueryData } from '../../helpers/parsers';

export const callbackQueryListener: CallbackQueryListener = async query => {
  const chatId = query.message?.chat.id;
  if (!chatId) {
    return;
  }
  try {
    const queryData = parseCallbackQueryData(query.data);
    if (!queryData) {
      console.error('Invalid callback query data', query.data);
      bot.answerCallbackQuery(
        query.id,
        'Something went wrong. Please try again later.',
      ); // TODO: add common error handler
      return;
    }
    const { prefix, key } = queryData;

    const handler = CALLBACK_QUERY_LISTENERS_MAP[prefix as PREFIX];
    const handlerResponse = await handler(
      { userId: query.from.id, chatId },
      key,
    );

    if (handlerResponse.error) {
      console.error(
        'Prefix: %s, key: %s, handler: %s, error: %s',
        prefix,
        key,
        handler.name,
        handlerResponse.message,
      );
      await bot.sendMessage(
        chatId,
        'Something went wrong. Please try again later.',
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
    await bot.sendMessage(
      chatId,
      'Something went wrong. Please try again later.',
    );
  } finally {
    await bot.answerCallbackQuery(query.id);
    if (query.message?.message_id) {
      await bot.deleteMessage(chatId, query.message?.message_id);
    }
  }
};
