import { Injectable } from '@nestjs/common';
import { translateResponse } from '../common/utils/Util';
import { CurrencyPair } from 'src/common/model/app-service.model';
import { CurrencySubscribers } from 'src/common/model/kraken-service.model';
import {
  KrakenClientRequest,
  KrakenServerResponse,
} from './dto/kraken-wss.dto';
import KrakenClientService from './interfaces/KrakenClientService';
import KrakenWSC from './kraken.wsc';
import { RawData } from 'ws';
import { Observer } from '../common/utils/Util';

@Injectable()
export class KrakenService implements KrakenClientService {
  public apiUrl = 'wss://ws.kraken.com';
  private socket: KrakenWSC;
  private readonly TIMEOUT = 10000;

  private currencyTickerSubscribers: CurrencySubscribers = {};

  public aliveTicker: NodeJS.Timer | null;

  constructor() {
    this.connect();
  }

  public async connect() {
    this.socket = new KrakenWSC(this.apiUrl);

    this.socket.onOpen = () => {
      this.keepAliveConnection();
    };

    this.socket.onMessage = this.handleSocketResponses.bind(this);

    this.socket.onError = (_error?: Error) => {
      this.clearTicker();
      this.connect();
    };

    this.socket.onClose = () => {
      this.clearTicker();
      this.connect();
    };
  }

  private handleSocketResponses(response: RawData) {
    const translatedData = translateResponse(response) as KrakenServerResponse;
    if (Array.isArray(translatedData)) {
      const [channelId, exchangeDescription, _subscribeName, currencyPair] =
        translatedData;
      this.currencyTickerSubscribers[currencyPair] = {
        channelId: channelId,
        exchangePair: currencyPair,
        rate: exchangeDescription.c[0],
      };
      Observer.listenAll();
    } else {
      if (translatedData?.event === 'heartbeat') return;
      if (translatedData.status === 'error') {
        console.log('ERROR:', translatedData);
      }
    }
  }

  public getCurrenciesExchange(pairs: CurrencyPair[]) {
    return new Promise<CurrencySubscribers[]>((resolve) => {
      const result: CurrencySubscribers[] = [];
      const unkown_pairs = [];

      for (const pair of pairs) {
        const current_pair = this.currencyTickerSubscribers[pair];
        if (current_pair) result.push(current_pair);
        else unkown_pairs.push(pair);
      }

      if (unkown_pairs.length === 0) resolve(result);
      else {
        const handler_fun = () => {
          const _unkown_pairs = unkown_pairs.filter((pair) => {
            const _pair = this.currencyTickerSubscribers[pair];
            if (_pair) result.push(_pair);
            else return !_pair;
          });
          if (_unkown_pairs.length) return;
          else {
            Observer.unsubscribe(handler_fun);
            resolve(result);
          }
        };

        this.subscribeCurrencyTicker(unkown_pairs).then(() =>
          Observer.subscribe(handler_fun),
        );
      }
    });
  }

  public async subscribeCurrencyTicker(currencyPairs: CurrencyPair[]) {
    const request = {
      event: 'subscribe',
      pair: currencyPairs,
      subscription: {
        name: 'ticker',
      },
    };

    return this.socket.sendRequest(request as KrakenClientRequest);
  }

  public async unsubscribeFromChannel(channelName: string) {
    const request = {
      event: 'unsubscribe',
      subscription: {
        name: channelName,
      },
    };

    return this.socket.sendRequest(request as KrakenClientRequest);
  }

  private async pingServer() {
    const request = {
      event: 'ping',
    };

    return this.socket.sendRequest(request as KrakenClientRequest);
  }

  private keepAliveConnection() {
    this.aliveTicker = setInterval(async () => {
      await this.pingServer();
    }, 5000);
  }

  private clearTicker() {
    this.aliveTicker = null;
  }
}
