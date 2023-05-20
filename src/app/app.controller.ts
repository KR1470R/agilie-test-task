import {
  Controller,
  Get,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppService } from './app.service';
import { KrakenService } from '../kraken/kraken.service';
import { GetPricesExchangeDto, PricesResponseExchangeDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly krakenService: KrakenService,
  ) {}

  @Get('prices')
  async getPrices(
    @Body() req: GetPricesExchangeDto,
  ): Promise<PricesResponseExchangeDto> {
    if (typeof req !== 'object' || !req.pairs) throw new BadRequestException();
    try {
      const rates = await this.krakenService.getCurrenciesExchange(req.pairs);
      return { rates };
    } catch (err: unknown) {
      console.log('SERVER_ERROR:', err);
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
