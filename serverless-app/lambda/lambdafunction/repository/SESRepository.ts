import {SendEmailCommand, SendEmailCommandOutput} from "@aws-sdk/client-ses";
import {sesClient} from "../config/sesConfig";

export interface SESRepository {
    sendEmail(sendEmailParam: SendEmailCommand): Promise<SendEmailCommandOutput>

}

export class DefaultSESRepository implements SESRepository {
    async sendEmail(sendEmailParam: SendEmailCommand): Promise<SendEmailCommandOutput> {
        return await sesClient.send(sendEmailParam)
    }

}