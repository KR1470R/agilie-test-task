import { RawData } from 'ws';

export function translateResponse(message: Buffer | RawData): any {
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
