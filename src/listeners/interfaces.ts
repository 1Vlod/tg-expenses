import TelegramBot from 'node-telegram-bot-api';

export interface TGListener {
  event: RegExp;
  handler: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void;
}

export type MessageListener = (
  msg: TelegramBot.Message,
  metadata: TelegramBot.Metadata,
) => void;

export type CallbackQueryListener = (query: TelegramBot.CallbackQuery) => void;
