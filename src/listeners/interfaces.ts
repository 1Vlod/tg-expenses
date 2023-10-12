import TelegramBot from 'node-telegram-bot-api';

interface BaseListener {
  type: 'text' | 'message';
  handler: (msg: TelegramBot.Message, match: RegExpExecArray | null) => void;
}

export interface TextListener extends BaseListener {
  type: 'text';
  event: RegExp;
}

export interface MessageListener extends Omit<BaseListener, 'handler'> {
  type: 'message';
  handler: (msg: TelegramBot.Message, metadata: TelegramBot.Metadata) => void;
}

export type TGListener = TextListener | MessageListener;
