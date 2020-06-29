import { Injectable, InternalServerErrorException, HttpStatus, HttpService } from '@nestjs/common';
import { Payment } from 'src/interfaces/payment.interface';
import { Check } from 'src/interfaces/check.interface';

@Injectable()
export class PaymentService {

    constructor(private httpService: HttpService) {}

    async getSubscriber(msisdn: string): Promise<any> {
        let x = new Check();
        x.msisdn = msisdn;
        let resp = fetch(
            'http://127.0.0.1:3000/check', 
            { method: "POST", body: JSON.stringify({ "msisdn": msisdn }) },
        );
        return await resp.json();
/*      resp.subscribe(
            body => {
                console.log(body);
                x.account = body.data.account;
                return x;
            }
        );
        return x;*/
    }

    async payment(x: Payment): Promise<Payment> {
        try {
            const subscriber = await this.getSubscriber(x.msisdn);
            
            console.log(subscriber);
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
