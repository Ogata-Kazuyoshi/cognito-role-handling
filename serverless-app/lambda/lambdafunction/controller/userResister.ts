import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {UsernameExistsException,} from '@aws-sdk/client-cognito-identity-provider';
import {headers} from '../config/responseHeaderConfig';
import {RequestUserCreate} from "../model/RequestUserCreate";
import {DefaultUserService} from "../servise/UserService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const body: RequestUserCreate = JSON.parse(event.body || '{}');
        const email = body.email;

        const userService = new DefaultUserService()
        await userService.createAndAssignManager(email)

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                message: `ユーザー ${email} を作成し、招待メールを送信しました。`,
            }),
        };
    } catch (err) {
        console.error('Error creating user:', err);
        let statusCode = 500;
        let message = 'ユーザー作成中にエラーが発生しました';

        if (err instanceof UsernameExistsException) {
            statusCode = 400;
            message = 'ユーザーは既に存在します';
        }

        return {
            statusCode,
            headers: headers,
            body: JSON.stringify({
                message,
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
