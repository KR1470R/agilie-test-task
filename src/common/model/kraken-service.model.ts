import { CurrencyPair } from './app-service.model';

export type CurrencySubscribers = Record<
  CurrencyPair,
  {
    channelId: number;
    exchangePair: string;
    rate: string;
  }
>;
