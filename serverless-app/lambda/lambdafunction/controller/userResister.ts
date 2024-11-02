import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {
    AdminAddUserToGroupCommand,
    AdminAddUserToGroupCommandInput,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    UsernameExistsException,
} from '@aws-sdk/client-cognito-identity-provider';
import { cognitoClient, EventBody, userPoolId } from '../config/cognitoConfig';
import { headers } from '../config/responseHeaderConfig';

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('postに届いてます!');
        const body: EventBody = JSON.parse(event.body || '{}');

        if (!body.userEmail || typeof body.userEmail !== 'string') {
            throw new Error('Invalid or missing userEmail in request body');
        }
        const userEmail = body.userEmail;

        if (!userPoolId) {
            throw new Error('USER_POOL_ID is not set');
        } else {
            console.log({ USER_POOL_ID: userPoolId });
        }

        const params: AdminCreateUserCommandInput = {
            UserPoolId: userPoolId,
            Username: userEmail,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: userEmail,
                },
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
            ],
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
        };
        console.log('ここまで来てる');

        const command = new AdminCreateUserCommand(params);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await cognitoClient.send<AdminCreateUserCommand>(command);
        console.log('登録もできてる');

        // Add user to ADMIN group
        const addToGroupParams: AdminAddUserToGroupCommandInput = {
            UserPoolId: userPoolId,
            Username: userEmail,
            GroupName: 'ADMIN',
        };
        const addToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await cognitoClient.send<AdminAddUserToGroupCommand>(addToGroupCommand);
        console.log('ユーザーをADMINグループに追加しました');

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify({
                message: `ユーザー ${userEmail} を作成し、招待メールを送信しました。`,
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
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'POST,OPTIONS',
            },
            body: JSON.stringify({
                message,
                error: err instanceof Error ? err.message : 'Unknown error',
            }),
        };
    }
};
