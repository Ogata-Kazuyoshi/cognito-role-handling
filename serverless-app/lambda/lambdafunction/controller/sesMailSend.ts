import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {SendEmailCommand, SESClient} from "@aws-sdk/client-ses";
import {v4 as uuidv4} from 'uuid'
import {RequestSES} from "../model/RequestSES";


const sesClient = process.env.AWS_SAM_LOCAL
    ? new SESClient({
    region: 'ap-northeast-1',
    credentials: {
        accessKeyId: process.env.AwsAccessKeyId || '',
        secretAccessKey: process.env.AwsSecretAccessKey || '',
        sessionToken: process.env.AwsSessionToken || '',
    },
}): new SESClient({
        region: 'ap-northeast-1'
    })
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {senderEmail, receiverEmail}: RequestSES = JSON.parse(event.body || '{}');
        console.log({senderEmail})
        console.log({receiverEmail})
        const uuid = uuidv4()
        console.log({uuid})

        const url = `https://hogehoge.toro.toyota/agreement?id=${uuid}`


        // SESを使用してメールを送信
        const params = {
            Destination: {
                ToAddresses: [receiverEmail],
            },
            Message: {
                Body: {
                    Text: { Data: `こんにちは、これはテストメールです。下記のurlへアクセスしてくださん ¥n ${url} ¥n よろしくお願いします` },
                },
                Subject: { Data: "テストメール" },
            },
            Source: senderEmail
        };

        const data = await sesClient.send(new SendEmailCommand(params));

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
