import {ListUsersInGroupCommandOutput} from "@aws-sdk/client-cognito-identity-provider";
import {userPoolId} from "../config/cognitoConfig";
import {CognitoCommand, CognitoRepository} from "./CognitoRepository";
import {CognitoAttributeInterface} from "../model/CognitoAttributeInterface";

export interface UserRepository {
    createCognitoUser(userAttributes: CognitoAttributeInterface[]): Promise<void>
    assignGroup(email: string, groupName: string): Promise<void>
    findUsersByGroup(groupName: string): Promise<ListUsersInGroupCommandOutput>
    deleteCognitoUser(userName: string): Promise<void>
}

export class DefaultUserRepository implements UserRepository {
    constructor(private cognitoRepository: CognitoCommand = new CognitoRepository(userPoolId)) {}

    async assignGroup(email: string, groupName: string): Promise<void> {
        await this.cognitoRepository.assignGroup(email, groupName)
    }

    async createCognitoUser(userAttributes: CognitoAttributeInterface[]): Promise<void> {
        await this.cognitoRepository.createUserCommand(userAttributes)
    }

    async findUsersByGroup(groupName: string): Promise<ListUsersInGroupCommandOutput> {
        return await this.cognitoRepository.findUsersByGroupName(groupName)
    }

    async deleteCognitoUser(userName: string): Promise<void> {
        await this.cognitoRepository.deleteUserByUserName(userName)
    }

}