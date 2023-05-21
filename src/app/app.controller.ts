import {
  Controller,
  Get,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { KrakenService } from '../kraken-exchanger/kraken.service';
import { PricesResponseExchangeDto } from './dto/app.dto';
import SetRequestTimeout from '../common/interceptions/timeout.interception';
import { REQUEST_TIMEOUT } from '../common/utils/Config';
import { CurrencyPairsQuery } from './dto/app.dto';
import { CurrencyPair } from '../common/model/app-service.model';

@Controller()
export class AppController {
  constructor(private readonly krakenService: KrakenService) {}

  @Get('prices')
  @SetRequestTimeout(REQUEST_TIMEOUT)
  async getPrices(
    @Query('pairs') pairs?: CurrencyPairsQuery,
  ): Promise<PricesResponseExchangeDto> {
    if (!pairs || !pairs.length) throw new BadRequestException();
    const target_pairs = pairs.split(',') as unknown as CurrencyPair[];
    target_pairs.forEach((pair: CurrencyPair) => {
      if (pair.split('/').length !== 2) throw new BadRequestException();
    });

    try {
      const rates = await this.krakenService.getCurrenciesExchange(
        target_pairs,
      );
      return { rates };
    } catch (err: unknown) {
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: err as Error,
        },
      );
    }
  }
}
