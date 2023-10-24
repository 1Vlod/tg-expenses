import bot from '../modules/tgBot';
import { isEventMatch } from '../helpers';
import { MessageListener } from './interfaces';

export const messageListener: MessageListener = msg => {
  if (!msg.text || isEventMatch(msg.text)) {
    return;
  }
  bot.sendMessage(
    msg.chat.id,
    'Sorry, I did not understand that. Type /help for a list of available commands.',
  );
};
