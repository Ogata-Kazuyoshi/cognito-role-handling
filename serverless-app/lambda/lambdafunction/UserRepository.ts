import {AdminAddUserToGroupCommand, AdminCreateUserCommand} from "@aws-sdk/client-cognito-identity-provider";
import {cognitoClient} from "./config/cognitoConfig";

export interface UserRepository {
    createCognitoUser(command:  AdminCreateUserCommand): Promise<void>
    assignGroup(command:  AdminAddUserToGroupCommand): Promise<void>
}

export class DefaultUserRepository implements UserRepository {
    async assignGroup(command:  AdminAddUserToGroupCommand): Promise<void> {
        await cognitoClient.send(command);
    }

    async createCognitoUser(command:  AdminCreateUserCommand): Promise<void> {
        await cognitoClient.send(command);
    }

}