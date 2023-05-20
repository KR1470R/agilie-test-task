import { CurrencyPair } from '../../common/model/app-service.model';

export type SubscribeName = 'ticker';

type ExchangeDescription = {
  a: [string, number, string];
  b: [string, number, string];
  c: [string, string];
  v: [string, string];
  p: [string, string];
  t: [number, number];
  l: [string, string];
  h: [string, string];
  o: [string, string];
};

export type CurrencyExchange = [
  number,
  ExchangeDescription,
  SubscribeName,
  CurrencyPair,
];

export type KrakenCurrencyError = {
  errorMessage: string;
  event: string;
  status: string;
  pair: CurrencyPair;
  subscription: {
    name: SubscribeName;
  };
};

export type HeartBeatResponse = {
  event: 'heartbeat';
  status?: unknown;
};

export type KrakenServerResponse =
  | KrakenCurrencyError
  | CurrencyExchange
  | HeartBeatResponse;
