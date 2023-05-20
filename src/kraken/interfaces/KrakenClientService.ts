import { CurrencyPair } from '../../common/model/app-service.model';
import { CurrencySubscribers } from '../..//common/model/kraken-service.model';

export default interface KrakenClientService {
  apiUrl: string;
  aliveTicker: NodeJS.Timer | null;
  connect: () => Promise<void>;
  getCurrenciesExchange: (
    pairs: CurrencyPair[],
  ) => Promise<CurrencySubscribers[]>;
  subscribeCurrencyTicker: (currencyPairs: CurrencyPair[]) => Promise<void>;
  unsubscribeFromChannel: (channelName: string) => Promise<void>;
}
