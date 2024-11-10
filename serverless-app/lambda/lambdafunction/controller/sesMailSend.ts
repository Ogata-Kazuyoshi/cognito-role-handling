import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {DefaultUserService} from "../servise/UserService";
import {RequestCreateUser} from "../model/RequestCreateUser";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import {v4 as uuidv4} from 'uuid'


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
        const {email}: RequestCreateUser = JSON.parse(event.body || '{}');
        console.log({email})
        const uuid = uuidv4()
        console.log({uuid})

        const url = `https://hogehoge.toro.toyota/agreement?id=${uuid}`


        // SESを使用してメールを送信
        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: { Data: `こんにちは、これはテストメールです。下記のurlへアクセスしてくださん ¥n ${url} ¥n よろしくお願いします` },
                },
                Subject: { Data: "テストメール" },
            },
            Source: "gatagataogata@gmail.com", // 送信元のメールアドレスを指定してください
        };

        try {
            const data = await sesClient.send(new SendEmailCommand(params));
            console.log("メールが送信されました:", data);
        } catch (error) {
            console.error("メールの送信に失敗しました:", error);
        }


        return {
            statusCode: 201,
            headers: headers,
            body: JSON.stringify({message: `SESに送信しました`}),
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
