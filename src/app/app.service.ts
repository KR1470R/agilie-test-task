import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../database/Prisma.service';
import { KrakenService } from 'src/kraken-exchanger/kraken.service';
import { CurrencyPair } from 'src/common/model/app-service.model';
import { CurrencyInfo } from 'src/common/model/kraken-service.model';

@Injectable()
export class AppService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly krakenService: KrakenService,
  ) {}

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
