import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserBalanceDto } from './dto/user.dto';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  public async createUser(currencyRate: UserBalanceDto) {
    return this.user.create({
      data: {
        pair: currencyRate.exchangePair,
        rate: currencyRate.rate,
        balanceCrypto: currencyRate.balanceCrypto,
        balanceFiat: currencyRate.balanceFiat,
      },
    });
  }

  public async getAllUsers() {
    return this.user.findMany();
  }

  public async deleteAllUsers() {
    return this.user.deleteMany();
  }

  public async updateUserById(id: number, userInfo: UserBalanceDto) {
    return this.user.update({
      where: { id },
      data: {
        pair: userInfo.exchangePair,
        rate: userInfo.rate,
        balanceCrypto: userInfo.balanceCrypto,
        balanceFiat: userInfo.balanceFiat,
      },
    });
  }
}
