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

export type CurrencyExchangeDto = [
  number,
  ExchangeDescription,
  SubscribeName,
  CurrencyPair,
];

export type KrakenCurrencyErrorDto = {
  errorMessage: string;
  event: string;
  status: string;
  pair: CurrencyPair;
  subscription: {
    name: SubscribeName;
  };
};

export type HeartBeatResponseDto = {
  event: 'heartbeat';
  status?: unknown;
};

export type KrakenServerResponseDto =
  | KrakenCurrencyErrorDto
  | CurrencyExchangeDto
  | HeartBeatResponseDto;

export type KrakenClientRequest = {
  event: 'subscribe' | 'unsubscribe' | 'ping';
  pair?: CurrencyPair[];
  subscription?: {
    name: SubscribeName;
  };
};
