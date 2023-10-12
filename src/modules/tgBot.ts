import TelegramBot from 'node-telegram-bot-api';
import config from '../config';

const bot = new TelegramBot(config.botToken, {
  polling: true,
  onlyFirstMatch: true,
});

export default bot;
