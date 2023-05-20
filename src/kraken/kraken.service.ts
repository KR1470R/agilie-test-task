import { Injectable } from '@nestjs/common';
import { WebSocket } from 'ws';
import { translateResponse, timeoutWhileCondition } from '../common/utils/Util';
import { CurrencyPair } from 'src/common/model/app-service.model';
import { CurrencySubscribers } from 'src/common/model/kraken-service.model';
import { KrakenServerResponse } from './dto/kraken-wss.dto';

@Injectable()
export class KrakenService {
  private baseUrl = 'wss://ws.kraken.com'; // Replace with the appropriate URL

  private ws: WebSocket;
  private isConnected = false;

  private currencyTickerSubscribers: CurrencySubscribers = {};

  constructor() {
    this.connect();
  }

  private async connect() {
    this.ws = new WebSocket(this.baseUrl);

    this.ws.on('open', async () => {
      console.log('Connected to Kraken WebSockets API');
      this.isConnected = true;
      // await this.subscribeToChannel('ticker');
    });

    this.ws.on('message', (data) => {
      const translatedData: KrakenServerResponse = translateResponse(data);
      if (Array.isArray(translatedData)) {
        const [channelId, exchangeDescription, subscribeName, currencyPair] =
          translatedData;
        this.currencyTickerSubscribers[currencyPair] = {
          channelId: channelId,
          rate: exchangeDescription.c[0],
        };
        console.log(`pair ${currencyPair} updated`);
      } else {
        if (translatedData?.event === 'heartbeat') return;
        if (translatedData.status === 'error') {
          console.log('ERROR:', translatedData);
        }
      }
    });

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      console.log('Reconnecting...');
      this.connect();
    });

    this.ws.on('close', () => {
      console.log('Connection closed. Reconnecting...');
      this.isConnected = false;
      this.connect();
    });
  }

  private sendRequest(request: any) {
    return new Promise<void>((resolve, reject) => {
      if (!this.isConnected) reject('Not connected to Kraken WebSockets API');
      else {
        this.ws.send(JSON.stringify(request), (error) => {
          if (error) reject(`Error sending request: ${error.message}`);
          else resolve();
        });
      }
    });
  }

  public async getCurrenciesExchange(pairs: CurrencyPair[]) {
    const result: CurrencySubscribers[] = [];
    for (const pair of pairs) {
      const savedTicker = this.currencyTickerSubscribers[pair];
      if (savedTicker) {
        result.push(savedTicker);
      } else {
        await this.subscribeCurrencyTicker(pairs);
        await timeoutWhileCondition(
          () => this.currencyTickerSubscribers[pair] !== undefined,
          5000,
          false,
        );
        result.push(this.currencyTickerSubscribers[pair]);
      }
    }
    return result;
  }

  private async subscribeCurrencyTicker(currencyPairs: CurrencyPair[]) {
    const request = {
      event: 'subscribe',
      pair: currencyPairs,
      subscription: {
        name: 'ticker',
      },
    };

    return this.sendRequest(request);
  }

  public async unsubscribeFromChannel(channelName: string) {
    const request = {
      event: 'unsubscribe',
      subscription: {
        name: channelName,
      },
    };

    return this.sendRequest(request);
  }
}
