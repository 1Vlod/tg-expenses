import TelegramBot from 'node-telegram-bot-api';
import config from '../config';
import {
  CallbackQueryListener,
  MessageListener,
  TGListener,
} from '../listeners/interfaces';
import { PREFIX } from '../constants';
class BotProvider {
  private bot: TelegramBot;

  constructor() {
    this.bot = new TelegramBot(config.botToken, {
      polling: true,
      onlyFirstMatch: true,
    });
  }

  addListeners({
    listeners,
    messageListener,
    callbackQueryListener,
  }: {
    listeners: TGListener[];
    messageListener: MessageListener;
    callbackQueryListener: CallbackQueryListener;
  }) {
    for (const listener of listeners) {
      this.bot.onText(listener.event, listener.handler);
    }

    this.bot.on('message', messageListener);
    this.bot.on('callback_query', callbackQueryListener);
  }

  async sendMessage(
    chatId: number,
    text: string,
    options?: {
      keyboard: {
        keys?: {
          id?: string;
          title: string;
          prefix?: PREFIX;
        }[][];
        commonPrefix?: PREFIX;
      };
      parseMode?: 'Markdown';
    },
  ) {
    const messageOptions: TelegramBot.SendMessageOptions = {};

    if (options?.keyboard && options.keyboard.keys) {
      messageOptions.reply_markup = {
        inline_keyboard: [
          ...options.keyboard.keys.map(row =>
            row.map(({ title, id, prefix }) => ({
              text: title,
              callback_data: [
                prefix || options.keyboard.commonPrefix,
                id || title.toLowerCase(),
              ]
                .join('.')
                .slice(0, 64),
            })),
          ),
        ],
      };
    }

    if (options?.parseMode) {
      messageOptions.parse_mode = options.parseMode;
    }

    return this.bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      ...messageOptions,
    });
  }

  async sendInlineKeyboard({
    chatId,
    text,
    keyboard,
  }: {
    chatId: number;
    text: string;
    keyboard: {
      keys: {
        id?: string;
        title: string;
        prefix?: PREFIX;
      }[][];
      commonPrefix?: PREFIX;
    };
  }) {
    await this.bot.sendMessage(chatId, text, {
      reply_markup: {
        inline_keyboard: [
          ...keyboard.keys.map(row =>
            row.map(({ title, id, prefix }) => ({
              text: title,
              callback_data: [
                prefix || keyboard.commonPrefix,
                id || title.toLowerCase(),
              ]
                .join('.')
                .slice(0, 64),
            })),
          ),
        ],
      },
    });
  }

  async answerCallbackQuery(queryId: string, text?: string) {
    return this.bot.answerCallbackQuery(queryId, { text });
  }

  async deleteMessage(chatId: number, messageId: number) {
    return this.bot.deleteMessage(chatId, messageId);
  }

  async destroy() {
    await this.bot.stopPolling();
  }
}

export default new BotProvider();
