import { PREFIX } from '../../constants';

export interface CallbackQueryContext {
  userId: number;
  chatId: number;
}

export interface CallbackQueryData {
  prefix: PREFIX;
  key: string;
}

export type CallbackQueryListenerResponse =
  | {
      response: {
        message: string;
        buttons?: { title: string; id?: string; prefix?: PREFIX }[][];
      };
      prefix?: PREFIX;
      error?: false;
    }
  | {
      message: string;
      userErrorMessage?: string;
      error: true;
    };

export type CallbackQueryListenersMap = {
  [key in PREFIX]: (
    ctx: CallbackQueryContext,
    callbackQueryData: string,
  ) => Promise<CallbackQueryListenerResponse>;
};
