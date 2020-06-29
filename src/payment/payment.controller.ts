import { Controller, HttpStatus, Post, Res, Body } from '@nestjs/common';
import { Payment } from 'src/interfaces/payment.interface';
import { PaymentService } from './payment.service';
import { ApiBody, ApiOkResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {

    constructor(
        private readonly service: PaymentService
    ) {}

    @Post()
    @ApiBody({ type: [Payment] })
    @ApiOkResponse({ description: 'Successfully.'})
    @ApiInternalServerErrorResponse({ description: 'Internal Server error.'})
    async check(@Res() res, @Body() x: Payment): Promise<Payment> {
        try {
            const r = await this.service.payment(x);
            return res.status(HttpStatus.OK).json(r);
        } catch (e) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: e.message.error.toString(), stack: e.stack});
        }
    }
}
