import { PREFIX } from '../../constants';

export interface CallbackQueryContext {
  userId: number;
  chatId: number;
}

export interface CallbackQueryData {
  prefix: PREFIX;
  key: string;
}
