import {RequestSESSend} from "../model/RequestSESSend.ts";
import {ResponseMessage} from "../model/ResponseMessage.ts";
import {Http, HttpClient} from "../network/http.ts";

export interface SESRepository {
    sendEmail(body: RequestSESSend): Promise<ResponseMessage>
}

export class DefaultSESRepository implements SESRepository {
    apiGateway: string = import.meta.env.VITE_APIGATEWAY
    constructor(private http: Http = new HttpClient()) {}
    async sendEmail(body: RequestSESSend): Promise<ResponseMessage> {
        return await this.http.post(`${this.apiGateway}/api/ses`, body)
    }
}