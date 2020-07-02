import { Injectable, InternalServerErrorException, HttpStatus, HttpService } from '@nestjs/common';
import { Payment } from 'src/interfaces/payment.interface';
import { Check } from 'src/interfaces/check.interface';
import { DatabaseService } from 'src/database/database.service';
import OracleDB = require('oracledb');

@Injectable()
export class PaymentService {

    constructor(
        private httpService: HttpService,
        private readonly database: DatabaseService
    ) {}

    async getSubscriber(msisdn: string): Promise<Check> {
        let x: Check = new Check();
        x.msisdn = msisdn;
        let promise = new Promise((resolve, reject) => {
            this.httpService.post('http://127.0.0.1:3000/check', { "msisdn": msisdn })
            .subscribe(body => {
                    x.account = body.data.account;
                    x.status = body.data.status;
                    resolve(x);
            }, error => {
                x.status = false;
                let status = error.response.status;
                if (status == 404) {
                    x.message = "MSISDN [" + x.msisdn + "] not found.";
                } else {
                    x.message = "Internal error [" + error.response.statusText + "]";
                }
                resolve(x);
            });
        });
        await promise;
        return x;
    }

    async addPayment(account: number, x: Payment): Promise<Payment> {
        const date = x.date.toISOString();
        const sp = await this.database.getByQuery(
            `begin
                add_payment(
                    :customer,
                    :external,
                    to_date(:date, 'YYYY-MM-DD HH24:MI:SS'),
                    :value,
                    :balance,
                    :status,
                    :is_forced
                );
             end;`, 
             {
                customer: { dir: OracleDB.BIND_IN, val: account, type: OracleDB.NUMBER },
                external: { dir: OracleDB.BIND_IN, val: x.operation, type: OracleDB.STRING },
                date: { dir: OracleDB.BIND_IN, val: date.substr(0, 10) + " " + date.substr(11, 8), type: OracleDB.STRING },
                value: { dir: OracleDB.BIND_IN, val: x.sum, type: OracleDB.NUMBER },
                balance: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
                status: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
                is_forced: { dir: OracleDB.BIND_IN, val: 0, type: OracleDB.NUMBER }
             }
        );

        console.log(sp.outBinds);

        const result = await this.database.getByQuery(
            `select BALANCE_VALUE from BALANCE where ID = :id`, [account]
        );
        if (result.rows.length > 0) {
            x.balance = result.rows[0][0];
        }
        return x;
    }

    async payment(x: Payment): Promise<Payment> {
        try {
            const y: Check = await this.getSubscriber(x.msisdn);
            if (!y.account) {
                x.message = y.message;
                x.code = 10;
                return x;
            }
            if (!y.status) {
                x.message = "Customer [" + y.account + "], MSISDN = [" + x.msisdn + "] is closed.";
                x.code = 1;
                return x;
            }
            if (!x.date) {
                x.date = new Date();
            }
            return await this.addPayment(y.account, x);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException({
                status: HttpStatus.BAD_REQUEST,
                error: error
            });
        }
    }
}
