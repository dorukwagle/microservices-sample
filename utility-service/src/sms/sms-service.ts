import { Injectable } from "@nestjs/common";


@Injectable()
export class SmsService {
    async sendSms(to: string, message: string) {
        console.log('Sending SMS to', to, 'with message', message);
        return;
    }
}
