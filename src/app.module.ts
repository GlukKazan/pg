import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PaymentModule } from './payment/payment.module';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [PaymentModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
