import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {headers} from '../config/responseHeaderConfig';
import {DefaultUserService} from "../servise/UserService";

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const groupName = event.pathParameters!.group!

        const userService = new DefaultUserService()
        const users = await userService.findUsersByGroupName(groupName)

        return {
            statusCode: 200,
            headers: headers,
            body: JSON.stringify(users),
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
