import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {DefaultUserService} from "../servise/UserService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const userName = event.queryStringParameters!!.userName!!

        const userService = new DefaultUserService()
        await userService.deleteUserByUserName(userName)

        return {
            statusCode: 204,
            headers: headers,
            body: JSON.stringify({message: `${userName}のuserを削除しました`}),
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
