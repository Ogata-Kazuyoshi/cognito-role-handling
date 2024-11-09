import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {DefaultUserService} from "../servise/UserService";
import {RequestCreateUser} from "../model/RequestCreateUser";
import * as AWS from 'aws-sdk';

const ses = new AWS.SES({ region: 'ap-northeast-1' });
export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const {email}: RequestCreateUser = JSON.parse(event.body || '{}');

        // SESを使用してメールを送信
        const params = {
            Destination: {
                ToAddresses: [email],
            },
            Message: {
                Body: {
                    Text: { Data: "こんにちは、これはテストメールです。" },
                },
                Subject: { Data: "テストメール" },
            },
            Source: "your-email@example.com", // 送信元のメールアドレスを指定してください
        };

        await ses.sendEmail(params).promise();


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
