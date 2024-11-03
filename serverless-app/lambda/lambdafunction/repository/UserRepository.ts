import {
    AdminAddUserToGroupCommand,
    AdminCreateUserCommand,
    ListUsersInGroupCommand, ListUsersInGroupCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {cognitoClient} from "../config/cognitoConfig";

export interface UserRepository {
    createCognitoUser(command:  AdminCreateUserCommand): Promise<void>
    assignGroup(command:  AdminAddUserToGroupCommand): Promise<void>
    findUsersByGroup(command: ListUsersInGroupCommand): Promise<ListUsersInGroupCommandOutput>
}

export class DefaultUserRepository implements UserRepository {
    async assignGroup(command:  AdminAddUserToGroupCommand): Promise<void> {
        await cognitoClient.send(command);
    }

    async createCognitoUser(command:  AdminCreateUserCommand): Promise<void> {
        await cognitoClient.send(command);
    }

    async findUsersByGroup(command: ListUsersInGroupCommand): Promise<ListUsersInGroupCommandOutput> {
        try {
            return  await cognitoClient.send(command);
        } catch (error) {
            console.error("Error listing users in group:", error);
            throw error;
        }
    }

}