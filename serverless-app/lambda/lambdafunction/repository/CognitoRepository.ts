import {
    AdminAddUserToGroupCommand,
    AdminAddUserToGroupCommandInput,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput,
    AdminDeleteUserCommand,
    AdminDeleteUserCommandInput,
    ListUsersInGroupCommand,
    ListUsersInGroupCommandInput,
    ListUsersInGroupCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {cognitoClient, userPoolId} from "../config/cognitoConfig";
import {CognitoAttributeInterface} from "../model/CognitoAttributeInterface";

export interface CognitoCommand{
    createUserCommand(userAttributes: CognitoAttributeInterface[]): Promise<void>
    assignGroup(email: string, groupName: string): Promise<void>
    findUsersByGroupName(groupName: string): Promise<ListUsersInGroupCommandOutput>
    deleteUserByUserName(userName: string): Promise<void>
}

export class CognitoRepository implements CognitoCommand {
    constructor(private userPool:string) {}

    async createUserCommand(userAttributes: CognitoAttributeInterface[]): Promise<void> {
        const email = userAttributes.find(attribute => attribute.Name === 'email')!!.Value
        const params: AdminCreateUserCommandInput = {
            UserPoolId: this.userPool,
            Username: email,
            UserAttributes: userAttributes,
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
        }
        const command = new AdminCreateUserCommand(params)
        await cognitoClient.send(command);
    }

    async assignGroup(email: string, groupName: string): Promise<void> {
        const addToGroupParams: AdminAddUserToGroupCommandInput = {
            UserPoolId: this.userPool,
            Username: email,
            GroupName: groupName,
        }
        const addToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams)
        await cognitoClient.send(addToGroupCommand)
    }

    async findUsersByGroupName(groupName: string): Promise<ListUsersInGroupCommandOutput> {
        const params: ListUsersInGroupCommandInput = {
            UserPoolId: this.userPool,
            GroupName: groupName,
        };
        const command = new ListUsersInGroupCommand(params);
        try {
            return  await cognitoClient.send(command);
        } catch (error) {
            console.error("Error listing users in group:", error);
            throw error;
        }
    }

    async deleteUserByUserName(userName: string): Promise<void> {
        const params: AdminDeleteUserCommandInput = {
            UserPoolId: userPoolId,
            Username: userName,
        };
        const command = new AdminDeleteUserCommand(params);
        try {
            await cognitoClient.send(command);
        } catch (error) {
            console.error("Error deleting user:", error);
            throw Error();
        }
    }

}

