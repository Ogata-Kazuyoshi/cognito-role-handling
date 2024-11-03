import {
    AdminAddUserToGroupCommand,
    AdminAddUserToGroupCommandInput,
    AdminCreateUserCommand,
    AdminCreateUserCommandInput, ListUsersInGroupCommand, ListUsersInGroupCommandInput, ListUsersInGroupCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import {userPoolId} from "../config/cognitoConfig";
import {DefaultUserRepository, UserRepository} from "../repository/UserRepository";
import {v4 as uuidv4} from 'uuid';
import {ResponseUser} from "../model/ResponseUser";

export interface UserService {
    createAndAssignManager(email: string, allowDomain: string, companyUUID?: string): Promise<void>
    findUsersByGroupName(groupName: string): Promise<ResponseUser[]>
}

export class DefaultUserService implements UserService {
    constructor(private userRepository: UserRepository = new DefaultUserRepository()) {
    }


    async createAndAssignManager(email: string, allowDomain: string, companyUUID?: string): Promise<void> {
        await this.createManager(email, allowDomain, companyUUID);
        await this.assignGroup(email);
    }

    async findUsersByGroupName(groupName: string): Promise<ResponseUser[]> {
        const params: ListUsersInGroupCommandInput = {
            UserPoolId: userPoolId,
            GroupName: groupName,
        };
        const command = new ListUsersInGroupCommand(params);
        try {
            const Users = (await this.userRepository.findUsersByGroup(command)).Users!!
            return Users.map(user => {
                const userName = user.Username!!
                const attributes = user.Attributes!!
                const email = attributes.find(elm => elm.Name === 'email')!!.Value!!
                const companyUUID = attributes.find(elm => elm.Name === 'custom:companyUUID')!!.Value!!
                const allowDomain = attributes.find(elm => elm.Name === 'custom:allowDomain')?.Value
                return {
                    userName,
                    email,
                    allowDomain,
                    companyUUID,
                }
            })
        } catch (error) {
            console.error("Error fetching users by group name:", error);
            throw Error()
        }
    }

    private async createManager(email: string, allowDomain: string, companyUUID?: string) {
        const params: AdminCreateUserCommandInput = {
            UserPoolId: userPoolId,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email,},
                { Name: 'email_verified', Value: 'true',},
                { Name: 'custom:companyUUID', Value: companyUUID || uuidv4() },
                { Name: 'custom:allowDomain', Value: allowDomain },
            ],
            DesiredDeliveryMediums: ['EMAIL'],
            ForceAliasCreation: false,
        }
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