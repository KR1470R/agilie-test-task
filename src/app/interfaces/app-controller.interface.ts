import { PricesResponseExchangeDto } from '../dto/app.dto';
import { CurrencyPairsQuery } from '../dto/app.dto';
import { CurrencyPair } from '../../common/model/app-service.model';

export default interface IAppController {
  getPrices: (
    pairs?: CurrencyPairsQuery,
  ) => Promise<PricesResponseExchangeDto> | never;
  postAccounts: (
    pair: CurrencyPair,
    balanceCrypto: string,
  ) => Promise<void> | never;
  getAccounts: () =>
    | Promise<{
        users: any;
      }>
    | never;
  deleteAccounts: () => Promise<void> | never;
}
