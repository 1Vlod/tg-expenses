import TelegramBot from 'node-telegram-bot-api';

import config from './config';
import { EVENTS, currencyMap } from './constants';
import { isEventMatch } from './helpers';

const bot = new TelegramBot(config.botToken, {
  polling: true,
  onlyFirstMatch: true,
});

bot.onText(EVENTS.START, msg => {
  bot.sendMessage(msg.chat.id, 'Welcome to my Telegram bot!');
});

bot.onText(EVENTS.HELP, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    'Available commands:\n/start - Start the bot\n/help - Show this help message',
  );
});

bot.onText(EVENTS.ANY_DIGITS, (msg, match) => {
  const chatId = msg.chat.id;
  const amount = match?.[1];
  // TODO: add helper for checking that at least one falsy
  if (!amount || !msg.text) {
    bot.sendMessage(chatId, 'Invalid format. Please use default format.'); // TODO: add default format example
    return;
  }
  const info = msg.text
    .replace(amount, ' ')
    .replace(/ +/g, ' ')
    .trim()
    .split(' ');

  const parsedCurrency = currencyMap[info[0].toUpperCase()] || info[0];

  bot.sendMessage(
    chatId,
    `You typed the amount: *${amount}* with currency *${parsedCurrency}* and description *${info[1]}*`,
    {
      parse_mode: 'Markdown',
    },
  );
});

// Listen for any message
bot.on('message', msg => {
  if (!msg.text || isEventMatch(msg.text)) {
    return;
  }
  bot.sendMessage(
    msg.chat.id,
    'Sorry, I did not understand that. Type /help for a list of available commands.',
  );
});
