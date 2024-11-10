import {DefaultSESRepository, SESRepository} from "../repository/SESRepository";
import {SendEmailCommand, SendEmailCommandOutput} from "@aws-sdk/client-ses";
import {v4 as uuidv4} from "uuid";

export interface SESService {
    sendEmail(senderEmail: string, receiverEmail: string): Promise<SendEmailCommandOutput>

}

export class DefaultSESService implements SESService {
    constructor(private sesRepository: SESRepository = new DefaultSESRepository()) {}

    async sendEmail(senderEmail: string, receiverEmail: string): Promise<SendEmailCommandOutput> {
        const uuid = uuidv4()
        const url = `https://hogehoge.fuga.com/agreement?id=${uuid}`
        const params = {
            Destination: {
                ToAddresses: [receiverEmail],
            },
            Message: {
                Body: {
                    Text: { Data: `こんにちは、これはテストメールです。下記のurlへアクセスしてくださん\n${url}\nよろしくお願いします` },
                },
                Subject: { Data: "テストメール" },
            },
            Source: senderEmail
        };
        const sendEmailCommand = new SendEmailCommand(params)
        return await this.sesRepository.sendEmail(sendEmailCommand)
    }
}