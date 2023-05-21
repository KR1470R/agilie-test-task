import { CurrencyPair } from './app-service.model';

export type CurrencyInfo = {
  channelId: number;
  exchangePair: string;
  rate: string;
};

export type CurrencySubscribers = Record<CurrencyPair, CurrencyInfo>;
