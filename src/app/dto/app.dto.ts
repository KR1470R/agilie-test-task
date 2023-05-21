import { CurrencyPair } from '../../common/model/app-service.model';
import { CurrencySubscribers } from 'src/common/model/kraken-service.model';

export type CurrencyPairsQuery = `${CurrencyPair},${CurrencyPair}`;

export class PricesResponseExchangeDto {
  rates: CurrencySubscribers[];
}
