import { PREFIX } from '../constants';

export type UsecaseResponse =
  | {
      error?: false;
      message: string;
      buttons?: { title: string; id?: string; prefix?: PREFIX }[][];
    }
  | {
      error: true;
      message: string;
    };

export type Usecase<T extends object> = (
  params: T,
) => Promise<UsecaseResponse> | UsecaseResponse;
