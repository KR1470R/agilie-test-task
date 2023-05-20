import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KrakenService } from '../kraken/kraken.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, KrakenService],
})
export class AppModule {}
