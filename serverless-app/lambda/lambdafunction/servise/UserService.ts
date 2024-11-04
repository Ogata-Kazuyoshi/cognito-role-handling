import {DefaultUserRepository, UserRepository} from "../repository/UserRepository";
import {v4 as uuidv4} from 'uuid';
import {ResponseUser} from "../model/ResponseUser";
import {CognitoAttributeInterface} from "../model/CognitoAttributeInterface";

export interface UserService {
    createAndAssignManager(email: string, allowDomain: string, companyUUID?: string): Promise<void>
    findUsersByGroupName(groupName: string): Promise<ResponseUser[]>
    deleteUserByUserName(userName: string): Promise<void>
}

export class DefaultUserService implements UserService {
    constructor(private userRepository: UserRepository = new DefaultUserRepository()) {
    }

    async createAndAssignManager(email: string, allowDomain: string, companyUUID?: string): Promise<void> {
        await this.createManager(email, allowDomain, companyUUID);
        await this.assignGroup(email);
    }

    async findUsersByGroupName(groupName: string): Promise<ResponseUser[]> {
        try {
            const Users = (await this.userRepository.findUsersByGroup(groupName)).Users!!
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

    async deleteUserByUserName(userName: string): Promise<void> {
       await this.userRepository.deleteCognitoUser(userName)
    }

    private async createManager(email: string, allowDomain: string, companyUUID?: string) {
        const userAttributes: CognitoAttributeInterface[] = [
            { Name: 'email', Value: email,},
            { Name: 'email_verified', Value: 'true',},
            { Name: 'custom:companyUUID', Value: companyUUID || uuidv4() },
            { Name: 'custom:allowDomain', Value: allowDomain },
        ]
        await this.userRepository.createCognitoUser(userAttributes)
    }

    private async assignGroup(email: string) {
        await this.userRepository.assignGroup(email, 'MANAGER')
    }
}