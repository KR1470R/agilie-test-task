import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { KrakenService } from '../kraken-exchanger/kraken.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [KrakenService],
})
export class AppModule {}
