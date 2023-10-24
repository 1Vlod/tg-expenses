import { PREFIX } from '../constants';

export interface UsecaseResponse {
  message: string;
  buttons: { title: string; id?: string; prefix?: PREFIX }[][];
}

export type Usecase<T extends object> = (
  params: T,
) => Promise<UsecaseResponse> | UsecaseResponse;
