import { Injectable, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/Prisma.service';
import { KrakenService } from 'src/kraken-exchanger/kraken.service';
import { CurrencyPair } from 'src/common/model/app-service.model';
import { CurrencyInfo } from 'src/common/model/kraken-service.model';
import IAppService from './interfaces/app-service.interface';
import { getRandomInt } from 'src/common/utils/Util';
import { FAKE_USERS_AMOUNT } from 'src/common/utils/Config';

@Injectable()
export class AppService implements IAppService, OnModuleInit {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly krakenService: KrakenService,
  ) {}

  public async onModuleInit() {
    await this.createFakeUsers();
  }

  public async createFakeUsers() {
    const users = await this.prismaService.getAllUsers();
    if (users.length) return;

    const pairs = ['XBT/EUR', 'ETH/USD', 'XBT/USD'] as CurrencyPair[];
    const rates = await this.krakenService.getCurrenciesExchange(pairs);

    const promises: Promise<void>[] = [];

    for (let i = 0; i < FAKE_USERS_AMOUNT; i++) {
      const rnd_rate = rates[getRandomInt(0, rates.length - 1)];
      const fakeUserCryptoBalance = getRandomInt(10, 100);
      const fakeUserFiatBalance =
        fakeUserCryptoBalance * parseFloat(rnd_rate.rate);
      promises.push(
        new Promise<void>((resolve, reject) => {
          this.prismaService
            .createUser({
              ...rnd_rate,
              balanceCrypto: fakeUserCryptoBalance,
              balanceFiat: fakeUserFiatBalance,
            })
            .then(
              () => resolve,
              (reason: unknown) => {
                console.log('CreateUserError:', reason);
                reject();
              },
            );
        }),
      );
    }

    await Promise.allSettled(promises);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  public async updateUsersBalance() {
    const users = await this.prismaService.getAllUsers();
    const promises: Promise<void>[] = [];

    for (const user of users) {
      const promise = new Promise<void>((resolve, reject) => {
        this.krakenService
          .getCurrenciesExchange([user.pair] as CurrencyPair[])
          .then(async (updated_rate_info: CurrencyInfo[]) => {
            const new_rate = updated_rate_info[0];

            await this.prismaService.updateUserById(user.id, {
              channelId: new_rate.channelId,
              exchangePair: new_rate.exchangePair,
              rate: new_rate.rate,
              balanceCrypto: user.balanceCrypto,
              balanceFiat: parseFloat(new_rate.rate) * user.balanceCrypto,
            });

            resolve();
          })
          .catch((err) => reject(err));
      });

      promises.push(promise);
    }

    await Promise.allSettled(promises);
  }
}
