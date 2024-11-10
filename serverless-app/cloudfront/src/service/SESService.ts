import {RequestSESSend} from "../model/RequestSESSend.ts";
import {ResponseMessage} from "../model/ResponseMessage.ts";
import {DefaultSESRepository, SESRepository} from "../repository/SESRepository.ts";

export interface SESService {
    sendEmail(body: RequestSESSend): Promise<ResponseMessage>
}

export class DefaultSESService implements SESService {
    constructor(private sesRepository: SESRepository = new DefaultSESRepository()) {}
    async sendEmail(body: RequestSESSend): Promise<ResponseMessage> {
        return this.sesRepository.sendEmail(body)
    }

}