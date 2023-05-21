import { RawData } from 'ws';
import { CurrencyPairsQuery } from '../../app/dto/app.dto';
import { CurrencyPair } from '../model/app-service.model';

export function translateResponse(
  message: Buffer | RawData,
): RawData | object | never {
  try {
    const translated = JSON.parse(message.toString());
    if (typeof translated === 'object' && translated !== null)
      return translated;
    throw new Error('Got wrong response!');
  } catch (err) {
    return message;
  }
}

export class EventObserver {
  constructor(public observers: ((...args: unknown[]) => unknown)[] = []) {}

  subscribe(fn) {
    this.observers.push(fn);
  }

  unsubscribe(fn) {
    this.observers = this.observers.filter((subscriber) => subscriber !== fn);
  }

  listenAll(...args: unknown[]) {
    this.observers.forEach((subscriber) => subscriber(...args));
  }
}

export const Observer = new EventObserver();

export function checkValidationOfPairs(
  pairs: CurrencyPairsQuery | CurrencyPair,
): never | CurrencyPair[] {
  if (!pairs) throw new Error('Pairs is not specified!');

  let target_pairs = [];
  if (typeof pairs === 'string') {
    target_pairs.push(pairs);
  } else if (Array.isArray(pairs)) {
    target_pairs = (pairs as CurrencyPairsQuery).split(
      ',',
    ) as unknown as CurrencyPair[];
  }

  target_pairs.forEach((pair: CurrencyPair) => {
    if (pair.split('/').length !== 2) throw new Error('Invalid pairs syntax!');
  });

  return target_pairs;
}
