import { Module, HttpModule } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [HttpModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
