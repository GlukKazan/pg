import { Injectable, InternalServerErrorException, HttpStatus, HttpService } from '@nestjs/common';
import { Payment } from 'src/interfaces/payment.interface';
import { Check } from 'src/interfaces/check.interface';

@Injectable()
export class PaymentService {

    constructor(private httpService: HttpService) {}

    async getSubscriber(msisdn: string): Promise<Check> {
        let x: Check = new Check();
        x.msisdn = msisdn;

        let promise = new Promise((resolve, reject) => {
            this.httpService.post('http://127.0.0.1:3000/check', { "msisdn": msisdn })
            .subscribe(body => {
                    x.account = body.data.account;
                    x.status = body.data.status;
                    resolve(x);
            });
        });
        await promise;
        return x;
    }

    async payment(x: Payment): Promise<Payment> {
        try {
            const y = await this.getSubscriber(x.msisdn);
            // TODO:

            return x;
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }
}
