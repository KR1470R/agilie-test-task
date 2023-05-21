import {
  Controller,
  Get,
  Body,
  BadRequestException,
  HttpException,
  HttpStatus,
  Query,
  Post,
  HttpCode,
  NotFoundException,
} from '@nestjs/common';
import { KrakenService } from '../kraken-exchanger/kraken.service';
import { PrismaService } from '../database/Prisma.service';
import { PricesResponseExchangeDto } from './dto/app.dto';
import SetRequestTimeout from '../common/interceptions/timeout.interception';
import { REQUEST_TIMEOUT } from '../common/utils/Config';
import { CurrencyPairsQuery } from './dto/app.dto';
import { checkValidationOfPairs } from '../common/utils/Util';
import { CurrencyPair } from '../common/model/app-service.model';

@Controller()
export class AppController {
  constructor(
    private readonly krakenService: KrakenService,
    private readonly prismaService: PrismaService,
  ) {}

  @Get('prices')
  @SetRequestTimeout(REQUEST_TIMEOUT)
  @HttpCode(HttpStatus.OK)
  async getPrices(
    @Query('pairs') pairs?: CurrencyPairsQuery,
  ): Promise<PricesResponseExchangeDto> {
    try {
      const target_pairs = checkValidationOfPairs(pairs);

      const rates = await this.krakenService.getCurrenciesExchange(
        target_pairs,
      );

      return { rates };
    } catch (error: unknown) {
      throw new HttpException(
        'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error as Error,
        },
      );
    }
  }

  @Post('accounts')
  @HttpCode(HttpStatus.CREATED)
  async postAccounts(
    @Query('pair') pair: CurrencyPair,
    @Query('balanceCrypto') balanceCrypto: string,
  ) {
    if (Array.isArray(pair)) throw new BadRequestException();
    if (!balanceCrypto) throw new BadRequestException();
    try {
      const target_pairs = checkValidationOfPairs(pair);

      const served_exhange = (
        await this.krakenService.getCurrenciesExchange(target_pairs)
      )[0];
      const balanceFiat =
        parseFloat(balanceCrypto) * parseFloat(served_exhange.rate);

      await this.prismaService.createUser({
        ...served_exhange,
        balanceCrypto: parseFloat(balanceCrypto),
        balanceFiat,
      });
    } catch (error: unknown) {
      const er = error as Error;
      throw new HttpException(
        er.message ? er.message : 'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error as Error,
        },
      );
    }
  }

  @Get('accounts')
  @HttpCode(HttpStatus.FOUND)
  async getAccounts() {
    try {
      const users = await this.prismaService.getAllUsers();
      return {
        users,
      };
    } catch (error: unknown) {
      const er = error as Error;
      throw new HttpException(
        er.message ? er.message : 'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error as Error,
        },
      );
    }
  }

  @Post('delete-accounts')
  @HttpCode(HttpStatus.OK)
  async deleteAccounts() {
    try {
      await this.prismaService.deleteAllUsers();
    } catch (error: unknown) {
      const er = error as Error;
      throw new HttpException(
        er.message ? er.message : 'Server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          cause: error as Error,
        },
      );
    }
  }
}
