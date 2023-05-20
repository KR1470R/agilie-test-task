import { CurrencyPair } from '../../common/model/app-service.model';
import { CurrencySubscribers } from 'src/common/model/kraken-service.model';

export class GetPricesExchangeDto {
  pairs: CurrencyPair[];
}

export class PricesResponseExchangeDto {
  rates: CurrencySubscribers[];
}
