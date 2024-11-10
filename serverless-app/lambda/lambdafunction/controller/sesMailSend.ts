import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {RequestSES} from "../model/RequestSES";
import {DefaultSESService} from "../servise/SESService";


export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {senderEmail, receiverEmail}: RequestSES = JSON.parse(event.body || '{}');
        const sesService = new DefaultSESService()
        const data = await sesService.sendEmail(senderEmail, receiverEmail)

        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify({message: `SESに送信しました: ${data}`}),
        };
    } catch (err) {
        console.error('Error find users:', err);
        return {
            statusCode: 500,
            headers: headers,
            body: JSON.stringify({
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
