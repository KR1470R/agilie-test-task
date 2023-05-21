import { CurrencyInfo } from '../../common/model/kraken-service.model';

export type UserBalanceDto = CurrencyInfo & {
  balanceCrypto: number;
  balanceFiat: number;
};
