import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KrakenService } from '../kraken-exchanger/kraken.service';
import { PrismaService } from '../database/Prisma.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [KrakenService, PrismaService],
})
export class AppModule {}
