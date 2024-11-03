import {
    AdminAddUserToGroupCommand,
    AdminAddUserToGroupCommandInput,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput
} from "@aws-sdk/client-cognito-identity-provider";
import {userPoolId} from "../config/cognitoConfig";
import {DefaultUserRepository, UserRepository} from "../UserRepository";

export interface UserService {
    createAndAssignManager(email: string): Promise<void>
}

export class DefaultUserService implements UserService {
    constructor(private userRepository: UserRepository = new DefaultUserRepository()) {
    }
    async createAndAssignManager(email: string): Promise<void> {
        await this.createManager(email);
        await this.assignGroup(email);
    }

    private async createManager(email: string) {
        const params: AdminCreateUserCommandInput = {
            UserPoolId: userPoolId,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email,},
                { Name: 'email_verified', Value: 'true',},
            ],
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
        };
        const command = new AdminCreateUserCommand(params);
        await this.userRepository.createCognitoUser(command)
    }

    private async assignGroup(email: string) {
        const addToGroupParams: AdminAddUserToGroupCommandInput = {
            UserPoolId: userPoolId,
            Username: email,
            GroupName: 'MANAGER',
        }
        const addToGroupCommand = new AdminAddUserToGroupCommand(addToGroupParams)
        await this.userRepository.assignGroup(addToGroupCommand)
    }
}