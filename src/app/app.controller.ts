import { Controller, Get, Body, BadRequestException } from '@nestjs/common';
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
    console.log(req);
    if (typeof req !== 'object' || !req.pairs) throw new BadRequestException();

    const rates = await this.krakenService.getCurrenciesExchange(req.pairs);

    return { rates };
  }
}
