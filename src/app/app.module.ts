import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KrakenService } from '../kraken-exchanger/kraken.service';
import { PrismaService } from '../database/Prisma.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [KrakenService, PrismaService, AppService],
})
export class AppModule {}
